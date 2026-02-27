/**
 * ================================================================
 * RETRO PORTFOLIO — script.js
 * Nishant Nahar's portfolio — all vanilla JavaScript
 *
 * TABLE OF CONTENTS
 * -----------------
 * 1.  Configuration
 * 2.  Smooth Scroll (nav links + CTA buttons)
 * 3.  Hamburger / Mobile Nav Toggle
 * 4.  Active Nav Link (IntersectionObserver)
 * 5.  Section Fade-in (IntersectionObserver)
 * 6.  Typewriter Effect
 * 7.  Skill Bar Animation (IntersectionObserver)
 * 8.  Project Filter
 * 9.  Project Modal (open / close / Escape key)
 * 10. Contact Form Validation + Toast
 * 11. Init — bootstraps all features on DOMContentLoaded
 * ================================================================
 */

"use strict";

/* ================================================================
   1. CONFIGURATION
   ================================================================ */

/**
 * TODO: Add 3 personal tagline phrases for the typewriter effect.
 * Each string will be typed out character-by-character and then
 * erased before the next one begins.
 *
 * Example phrases:
 *   "I build retro-inspired web experiences."
 *   "I turn ideas into pixel-perfect interfaces."
 *   "I love clean code and bold design."
 */
const TYPEWRITER_PHRASES = [
  "I build retro-inspired web experiences.",
  "I turn ideas into pixel-perfect interfaces.",
  "I love clean code and bold design.",
];

/** Typing speed in milliseconds per character (lower = faster). */
const TYPEWRITER_SPEED = 68;

/** Erasing speed in milliseconds per character (lower = faster). */
const TYPEWRITER_ERASE_SPEED = 38;

/** Pause (ms) after fully typing a phrase before erasing starts. */
const TYPEWRITER_PAUSE_AFTER = 2200;

/** Pause (ms) after fully erasing a phrase before the next starts. */
const TYPEWRITER_PAUSE_BEFORE = 500;

/** Duration (ms) the success toast is visible before auto-dismissing. */
const TOAST_DURATION = 3000;

/* ================================================================
   2. SMOOTH SCROLL
   Intercepts all anchor clicks whose href points to an on-page
   section (#id) and scrolls to it smoothly instead of jumping.
   ================================================================ */

/**
 * Initialises smooth scrolling on all internal anchor links.
 * Also closes the mobile nav drawer when a link is clicked.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return; // Skip bare "#" links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile nav drawer after a link is clicked
      closeMobileNav();
    });
  });
}

/* ================================================================
   3. HAMBURGER / MOBILE NAV TOGGLE
   Toggles the slide-down mobile navigation drawer and updates
   the aria-expanded attribute for accessibility.
   ================================================================ */

/** @type {HTMLButtonElement|null} */
let hamburgerBtn = null;

/** @type {HTMLElement|null} */
let mobileNav = null;

/**
 * Initialises the hamburger button toggle behaviour.
 */
function initHamburger() {
  hamburgerBtn = document.getElementById("hamburger-btn");
  mobileNav = document.getElementById("mobile-nav");

  if (!hamburgerBtn || !mobileNav) return;

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("nav-open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

/**
 * Opens the mobile nav drawer.
 */
function openMobileNav() {
  if (!mobileNav || !hamburgerBtn) return;
  mobileNav.classList.add("nav-open");
  mobileNav.setAttribute("aria-hidden", "false");
  hamburgerBtn.setAttribute("aria-expanded", "true");
  hamburgerBtn.innerHTML = '<span aria-hidden="true">✕</span>';
}

/**
 * Closes the mobile nav drawer.
 */
function closeMobileNav() {
  if (!mobileNav || !hamburgerBtn) return;
  mobileNav.classList.remove("nav-open");
  mobileNav.setAttribute("aria-hidden", "true");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  hamburgerBtn.innerHTML = '<span aria-hidden="true">☰</span>';
}

/* ================================================================
   4. ACTIVE NAV LINK HIGHLIGHT
   Uses IntersectionObserver to track which section is currently
   in view and highlights the corresponding nav link.
   ================================================================ */

/**
 * Observes all major page sections and updates active nav links.
 */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");

  if (!sections.length || !navLinks.length) return;

  /**
   * Build a map: sectionId → navLink element
   * for O(1) lookups when the observer fires.
   */
  const linkMap = {};
  navLinks.forEach((link) => {
    linkMap[link.dataset.section] = link;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = linkMap[id];
        if (!link) return;

        if (entry.isIntersecting) {
          // Remove active class from all links first
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    {
      // Trigger when a section occupies at least 35% of the viewport
      threshold: 0.35,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ================================================================
   5. SECTION FADE-IN
   Observes all elements with .fade-section and adds .is-visible
   once they enter the viewport, triggering the CSS transition.
   ================================================================ */

/**
 * Sets up scroll-triggered fade-in for all .fade-section elements.
 */
function initFadeIn() {
  const fadeEls = document.querySelectorAll(".fade-section");
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Unobserve after animating to avoid toggling
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  fadeEls.forEach((el) => observer.observe(el));
}

/* ================================================================
   6. TYPEWRITER EFFECT
   Cycles through TYPEWRITER_PHRASES array, typing each character
   one-by-one and then erasing before moving to the next phrase.
   ================================================================ */

/**
 * Starts the typewriter animation on #typewriter-text.
 */
function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el || !TYPEWRITER_PHRASES.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  /**
   * Core tick function — called recursively via setTimeout.
   * @returns {void}
   */
  function tick() {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

    if (!isErasing) {
      // Typing forward
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Fully typed — pause then start erasing
        isErasing = true;
        setTimeout(tick, TYPEWRITER_PAUSE_AFTER);
        return;
      }
    } else {
      // Erasing
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        // Fully erased — move to next phrase
        isErasing = false;
        phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
        setTimeout(tick, TYPEWRITER_PAUSE_BEFORE);
        return;
      }
    }

    const speed = isErasing ? TYPEWRITER_ERASE_SPEED : TYPEWRITER_SPEED;
    setTimeout(tick, speed);
  }

  tick();
}

/* ================================================================
   7. SKILL BAR ANIMATION
   Observes .skill-bar elements. When they enter the viewport,
   reads the data-width attribute and animates the bar to that %.
   ================================================================ */

/**
 * Animates skill progress bars when they scroll into view.
 */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar[data-width]");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetPct = parseInt(bar.dataset.width, 10) || 0;
          // Small delay so other fade-in transitions complete first
          setTimeout(() => {
            bar.style.width = `${targetPct}%`;
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ================================================================
   8. PROJECT FILTER
   Filter buttons toggle card visibility by matching each card's
   data-category attribute. A fade-in transition is applied.
   ================================================================ */

/**
 * Initialises the project filter bar.
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update button states + aria-pressed
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Show / hide cards
      cards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;

        if (show) {
          card.removeAttribute("data-hidden");
          // Re-trigger fade-in if the card had previously animated
          card.classList.remove("is-visible");
          // requestAnimationFrame ensures the class removal is painted
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add("is-visible"));
          });
        } else {
          card.setAttribute("data-hidden", "true");
        }
      });
    });
  });
}

/* ================================================================
   9. PROJECT MODAL
   "View Project" buttons open the matching modal panel.
   Close via ✕ button, clicking the dark overlay, or Escape key.
   Focus is trapped inside the modal while open.
   ================================================================ */

/** @type {HTMLElement|null} Currently-open modal panel */
let activeModal = null;

/** @type {Element|null} Element that triggered the modal (for focus restore) */
let modalTrigger = null;

/**
 * Initialises project modal open/close behaviour.
 */
function initModals() {
  const overlay = document.getElementById("modal-overlay");
  const viewBtns = document.querySelectorAll(".btn-view[data-project]");
  const closeBtns = document.querySelectorAll(".modal-close[data-close]");

  if (!overlay) return;

  // Open modal when "View Project" is clicked
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.dataset.project;
      const panel = document.getElementById(`modal-${projectId}`);
      if (!panel) return;

      modalTrigger = btn;
      openModal(overlay, panel);
    });
  });

  // Close via ✕ button
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(overlay);
    });
  });

  // Close by clicking the dark overlay (outside the panel)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });

  // Close via Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeModal(overlay);
    }

    // Trap focus inside the modal
    if (e.key === "Tab" && activeModal) {
      trapFocus(activeModal, e);
    }
  });
}

/**
 * Opens the modal overlay and shows the target panel.
 *
 * @param {HTMLElement} overlay - The full-screen modal overlay element.
 * @param {HTMLElement} panel   - The specific modal panel to display.
 */
function openModal(overlay, panel) {
  // Hide any currently visible panel
  document.querySelectorAll(".modal-panel").forEach((p) => {
    p.hidden = true;
  });

  panel.hidden = false;
  activeModal = panel;

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Move focus to the close button inside the opened modal
  const closeBtn = panel.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

/**
 * Closes the modal overlay and hides all panels.
 *
 * @param {HTMLElement} overlay - The full-screen modal overlay element.
 */
function closeModal(overlay) {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Small delay so the CSS transition finishes before setting hidden
  setTimeout(() => {
    document.querySelectorAll(".modal-panel").forEach((p) => {
      p.hidden = true;
    });
    activeModal = null;
  }, 400);

  // Restore focus to the trigger that opened the modal
  if (modalTrigger) {
    modalTrigger.focus();
    modalTrigger = null;
  }
}

/**
 * Traps keyboard focus within the modal panel while it is open.
 * Cycles through focusable elements when Tab / Shift+Tab is pressed.
 *
 * @param {HTMLElement} panel - The currently active modal panel.
 * @param {KeyboardEvent} e   - The keyboard event to intercept.
 */
function trapFocus(panel, e) {
  const focusable = Array.from(
    panel.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

/* ================================================================
   10. CONTACT FORM VALIDATION + TOAST
   Client-side validation runs on submit.
   Invalid fields get a shake animation and red border.
   A valid submission shows a retro toast notification.
   ================================================================ */

/**
 * Validates the contact form and shows a success toast on success.
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Always prevent default (no backend yet)

    const isValid = validateForm(form);
    if (isValid) {
      showToast("Message sent successfully ✓");
      form.reset();
      // Re-enable submit button
      const submitBtn = form.querySelector("#submit-btn");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message →";
      }
    }
  });
}

/**
 * Runs all validation rules against the form fields.
 * Returns true if every field is valid, false otherwise.
 *
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} Whether the form is fully valid.
 */
function validateForm(form) {
  let isValid = true;

  /** Email regex — RFC 5322 simplified */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validates a single field.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} field - The field to check.
   * @param {string} errorId  - ID of the <span> that displays the error message.
   * @param {string} message  - Error message to display if validation fails.
   * @param {Function} [test] - Optional custom test fn returning boolean.
   */
  function validateField(field, errorId, message, test) {
    const errorEl = document.getElementById(errorId);
    const isEmpty = !field.value.trim();
    const fails = isEmpty || (test && !test(field.value.trim()));

    if (fails) {
      field.classList.add("is-error");
      if (errorEl)
        errorEl.textContent = isEmpty ? "This field is required." : message;
      isValid = false;

      // Remove error class after shake animation completes
      field.addEventListener(
        "animationend",
        () => field.classList.remove("is-error"),
        { once: true },
      );

      // Clear error on user input
      field.addEventListener(
        "input",
        () => {
          field.classList.remove("is-error");
          if (errorEl) errorEl.textContent = "";
        },
        { once: true },
      );
    } else {
      field.classList.remove("is-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  // Validate Name
  validateField(
    form.querySelector("#field-name"),
    "error-name",
    "Please enter your name.",
  );

  // Validate Email (with format check)
  validateField(
    form.querySelector("#field-email"),
    "error-email",
    "Please enter a valid email address.",
    (val) => emailRegex.test(val),
  );

  // Validate Subject
  validateField(
    form.querySelector("#field-subject"),
    "error-subject",
    "Please enter a subject.",
  );

  // Validate Message
  validateField(
    form.querySelector("#field-message"),
    "error-message",
    "Please write a message.",
  );

  return isValid;
}

/**
 * Creates and shows a retro toast notification at the bottom-right.
 * Auto-dismisses after TOAST_DURATION milliseconds.
 *
 * @param {string} message - Text to display inside the toast.
 */
function showToast(message) {
  // Remove any existing toast first
  const existing = document.getElementById("success-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "success-toast";
  toast.className = "toast";
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  document.body.appendChild(toast);

  // Trigger CSS transition (needs a paint frame after insertion)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });
  });

  // Auto-dismiss after TOAST_DURATION ms
  setTimeout(() => {
    toast.classList.remove("is-visible");
    // Remove from DOM after transition finishes
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  }, TOAST_DURATION);
}

/* ================================================================
   11. INIT
   Called once the DOM is fully parsed. Bootstraps all features.
   ================================================================ */

/**
 * Entry point — initialises all portfolio features.
 * Called when the DOM content is fully loaded.
 */
function init() {
  initSmoothScroll();
  initHamburger();
  initActiveNav();
  initFadeIn();
  initTypewriter();
  initSkillBars();
  initProjectFilter();
  initModals();
  initContactForm();
}

document.addEventListener("DOMContentLoaded", init);
