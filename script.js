/**
 * NISHANT NAHAR — RETRO PORTFOLIO  |  script.js
 * ─────────────────────────────────────────────────────────────
 *  1. Typewriter hero animation
 *  2. Sticky navbar active link on scroll
 *  3. Hamburger mobile menu toggle
 *  4. Project card filter (All / Web / Mobile / Design)
 *  5. Project modal open / close
 *  6. Skill bar animation on scroll
 *  7. Section fade-in on scroll
 *  8. Contact form validation + Formspree submission + toast
 */

"use strict";

/* ============================================================
   CONFIG — edit these values
   ============================================================ */

/**
 * HOW TO GET YOUR FORMSPREE URL (free, takes 2 minutes):
 *  1. Go to https://formspree.io and sign up
 *  2. Click "New Form" → give it a name → confirm your email
 *  3. Copy the endpoint URL (e.g. https://formspree.io/f/xabcdefg)
 *  4. Paste it below, replacing the placeholder string
 *
 * Once set, every form submission will land in your inbox. ✓
 */
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID"; // TODO: paste your Formspree URL here

/**
 * Typewriter phrases shown in the hero section.
 * TODO: Replace these with your own taglines (min 2).
 */
const TYPEWRITER_PHRASES = [
  "I build retro-inspired web experiences.",
  "I turn ideas into pixel-perfect interfaces.",
  "I love clean code and bold design.",
];

/* ============================================================
   1. TYPEWRITER ANIMATION
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el) return;

  let phraseIndex = 0,
    charIndex = 0,
    isDeleting = false;
  const TYPE_SPEED = 60;
  const DELETE_SPEED = 35;
  const PAUSE_END = 1800;
  const PAUSE_START = 300;

  function tick() {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    isDeleting ? charIndex-- : charIndex++;
    el.textContent = phrase.slice(0, charIndex);

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === phrase.length) {
      delay = PAUSE_END;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
      delay = PAUSE_START;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ============================================================
   2. NAVBAR — active link highlight on scroll
   ============================================================ */
(function initNavHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((sec) => observer.observe(sec));
})();

/* ============================================================
   3. HAMBURGER — mobile menu toggle
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ============================================================
   4. PROJECT FILTER
   ============================================================ */
(function initFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        if (show) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          card.offsetHeight; // force reflow
          card.style.animation = "";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ============================================================
   5. MODALS — open / close
   ============================================================ */
(function initModals() {
  const overlays = document.querySelectorAll(".modal-overlay");
  const viewBtns = document.querySelectorAll(".btn-view");

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close")?.focus();
  }

  function closeAll() {
    overlays.forEach((m) => m.classList.remove("open"));
    document.body.style.overflow = "";
  }

  viewBtns.forEach((btn) =>
    btn.addEventListener("click", () => openModal(btn.dataset.modal)),
  );
  overlays.forEach((o) =>
    o.addEventListener("click", (e) => {
      if (e.target === o) closeAll();
    }),
  );
  document
    .querySelectorAll(".modal-close")
    .forEach((btn) => btn.addEventListener("click", closeAll));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();

/* ============================================================
   6. SKILL BARS — animate on scroll
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");
  if (!bars.length) return;
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          bars.forEach((bar) => {
            requestAnimationFrame(() => {
              bar.style.width = (bar.dataset.width || "0") + "%";
            });
          });
        }
      });
    },
    { threshold: 0.3 },
  );
  const skillSection = document.getElementById("skills");
  if (skillSection) observer.observe(skillSection);
})();

/* ============================================================
   7. FADE-IN on scroll
   ============================================================ */
(function initFadeIn() {
  // NOTE: .project-card is intentionally excluded here —
  // it uses its own CSS fadeUp keyframe with nth-child delays.
  const targets = document.querySelectorAll(
    '.about-grid, .skills-grid, .contact-grid, ' +
    '.section-title, .section-eyebrow, .quicklinks-label, .quicklinks-bar'
  );
  targets.forEach((el) => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach((el) => observer.observe(el));
})();

/* ============================================================
   8. CONTACT FORM — validation + Formspree submission
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  const toastEl = document.getElementById("toast");
  const submitBtn = document.getElementById("submit-btn");
  if (!form) return;

  /* -- Toast helper -- */
  function showToast(message, duration = 4000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), duration);
  }

  /* -- Validate a single field -- */
  function validateField(input, errorEl) {
    const value = input.value.trim();
    let error = "";
    if (!value) {
      error = "This field is required.";
    } else if (
      input.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Please enter a valid email address.";
    }
    input.classList.toggle("error", !!error);
    errorEl.textContent = error;
    return !error;
  }

  /* -- Clear inline errors on typing -- */
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errorEl = document.getElementById(input.id + "-error");
      if (errorEl) errorEl.textContent = "";
    });
  });

  /* -- Submit handler -- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fields = [
      {
        input: form.querySelector("#name"),
        error: form.querySelector("#name-error"),
      },
      {
        input: form.querySelector("#email"),
        error: form.querySelector("#email-error"),
      },
      {
        input: form.querySelector("#subject"),
        error: form.querySelector("#subject-error"),
      },
      {
        input: form.querySelector("#message"),
        error: form.querySelector("#message-error"),
      },
    ];

    const allValid = fields.every(({ input, error }) =>
      input && error ? validateField(input, error) : true,
    );

    if (!allValid) {
      showToast("⚠ Please fill in all fields correctly.");
      return;
    }

    /* ── Send via Formspree ── */
    if (FORMSPREE_URL.includes("YOUR_FORM_ID")) {
      // Formspree not yet configured — show success toast as demo
      showToast(
        "✓ Message sent! (Demo mode — add your Formspree URL to script.js to receive real emails)",
      );
      form.reset();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        showToast("✓ Message sent successfully! I'll be in touch soon.");
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg =
          data?.errors?.map((e) => e.message).join(", ") ||
          "Something went wrong.";
        showToast("✕ Failed to send: " + msg);
      }
    } catch {
      showToast("✕ Network error — please try again or email me directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message →";
    }
  });
})();
