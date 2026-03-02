"use strict";

const formspree_url = "https://formspree.io/f/YOUR_FORM_ID";
const typewriter_phrases = [
  "I build retro-inspired web experiences.",
  "I turn ideas into pixel-perfect interfaces.",
  "I love clean code and bold design.",
];

document.addEventListener("DOMContentLoaded", () => {
  // 1. TYPEWRITER ANIMATION
  const typewriter_text = document.getElementById("typewriter-text");
  if (typewriter_text) {
    let phrase_index = 0;
    let char_index = 0;
    let is_deleting = false;

    const type_speed = 60;
    const delete_speed = 35;
    const pause_end = 1800;
    const pause_start = 300;

    const tick_typewriter = () => {
      const current_phrase = typewriter_phrases[phrase_index];

      if (is_deleting) {
        char_index--;
      } else {
        char_index++;
      }

      typewriter_text.textContent = current_phrase.slice(0, char_index);
      let current_delay = is_deleting ? delete_speed : type_speed;

      if (!is_deleting && char_index === current_phrase.length) {
        current_delay = pause_end;
        is_deleting = true;
      } else if (is_deleting && char_index === 0) {
        is_deleting = false;
        phrase_index = (phrase_index + 1) % typewriter_phrases.length;
        current_delay = pause_start;
      }

      setTimeout(tick_typewriter, current_delay);
    };

    setTimeout(tick_typewriter, pause_start);
  }

  // 2. NAVBAR HIGHLIGHTING ON SCROLL
  const page_sections = document.querySelectorAll("main section[id]");
  const navigation_links = document.querySelectorAll(".nav-link");

  const scroll_observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navigation_links.forEach((link) => {
          const target_id = "#" + entry.target.id;
          if (link.getAttribute("href") === target_id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  page_sections.forEach((section) => scroll_observer.observe(section));

  // 3. HAMBURGER MENU TOGGLE
  const hamburger_btn = document.getElementById("hamburger");
  const nav_links_container = document.getElementById("nav-links");

  if (hamburger_btn && nav_links_container) {
    hamburger_btn.addEventListener("click", () => {
      const is_open = nav_links_container.classList.toggle("open");
      hamburger_btn.classList.toggle("open", is_open);
      hamburger_btn.setAttribute("aria-expanded", String(is_open));
    });

    const all_nav_links = nav_links_container.querySelectorAll(".nav-link");
    all_nav_links.forEach((link) => {
      link.addEventListener("click", () => {
        nav_links_container.classList.remove("open");
        hamburger_btn.classList.remove("open");
        hamburger_btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. PROJECT FILTERING
  const filter_buttons = document.querySelectorAll(".filter-btn");
  const project_cards = document.querySelectorAll(".project-card");

  if (filter_buttons.length > 0 && project_cards.length > 0) {
    filter_buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filter_buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selected_filter = btn.dataset.filter;

        project_cards.forEach((card) => {
          const should_show = selected_filter === "all" || card.dataset.category === selected_filter;
          if (should_show) {
            card.classList.remove("hidden");
            card.style.animation = "none";
            // trigger reflow to restart animation
            void card.offsetHeight;
            card.style.animation = "";
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  // 5. MODAL LOGIC
  const modal_overlays = document.querySelectorAll(".modal-overlay");
  const view_buttons = document.querySelectorAll(".btn-view");
  const close_buttons = document.querySelectorAll(".modal-close");

  const close_all_modals = () => {
    modal_overlays.forEach((modal) => modal.classList.remove("open"));
    document.body.style.overflow = "";
  };

  view_buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target_modal_id = btn.dataset.modal;
      const target_modal = document.getElementById(target_modal_id);
      if (target_modal) {
        target_modal.classList.add("open");
        document.body.style.overflow = "hidden";
        const close_btn = target_modal.querySelector(".modal-close");
        if (close_btn) close_btn.focus();
      }
    });
  });

  modal_overlays.forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close_all_modals();
      }
    });
  });

  close_buttons.forEach((btn) => {
    btn.addEventListener("click", close_all_modals);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close_all_modals();
  });

  // 6. SKILL BARS SCROLL ANIMATION
  const skill_bars = document.querySelectorAll(".skill-bar");
  if (skill_bars.length > 0) {
    let has_animated = false;

    const skills_observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !has_animated) {
          has_animated = true;
          skill_bars.forEach((bar) => {
            requestAnimationFrame(() => {
              const target_width = bar.dataset.width || "0";
              bar.style.width = target_width + "%";
            });
          });
        }
      });
    }, { threshold: 0.3 });

    const skills_section = document.getElementById("skills");
    if (skills_section) {
      skills_observer.observe(skills_section);
    }
  }

  // 7. FADE-IN ANIMATION ON SCROLL
  const fade_in_targets = document.querySelectorAll(
    '.about-grid, .skills-grid, .contact-grid, ' +
    '.section-title, .section-eyebrow, .quicklinks-label, .quicklinks-bar, ' +
    '.section-header-row'
  );
  fade_in_targets.forEach((el) => el.classList.add('fade-in'));

  const fade_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fade_in_observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  fade_in_targets.forEach((el) => fade_in_observer.observe(el));

  // 8. CONTACT FORM VALIDATION
  const contact_form = document.getElementById("contact-form");
  const toast_element = document.getElementById("toast");
  const submit_button = document.getElementById("submit-btn");

  if (contact_form) {
    const show_toast = (message, duration_ms = 4000) => {
      if (!toast_element) return;
      toast_element.textContent = message;
      toast_element.classList.add("show");
      setTimeout(() => toast_element.classList.remove("show"), duration_ms);
    };

    const validate_input_field = (input_el, error_el) => {
      const current_val = input_el.value.trim();
      let error_message = "";

      if (!current_val) {
        error_message = "This field is required.";
      } else if (input_el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current_val)) {
        error_message = "Please enter a valid email address.";
      }

      if (error_message) {
        input_el.classList.add("error");
      } else {
        input_el.classList.remove("error");
      }

      error_el.textContent = error_message;
      return !error_message;
    };

    const clear_error_on_input = (input_el) => {
      input_el.addEventListener("input", () => {
        input_el.classList.remove("error");
        const error_el = document.getElementById(input_el.id + "-error");
        if (error_el) error_el.textContent = "";
      });
    };

    const form_inputs = contact_form.querySelectorAll("input, textarea");
    form_inputs.forEach(clear_error_on_input);

    contact_form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const form_fields = [
        { input: contact_form.querySelector("#name"), error: contact_form.querySelector("#name-error") },
        { input: contact_form.querySelector("#email"), error: contact_form.querySelector("#email-error") },
        { input: contact_form.querySelector("#subject"), error: contact_form.querySelector("#subject-error") },
        { input: contact_form.querySelector("#message"), error: contact_form.querySelector("#message-error") }
      ];

      let is_form_valid = true;
      form_fields.forEach((field) => {
        if (field.input && field.error) {
          const is_valid = validate_input_field(field.input, field.error);
          if (!is_valid) is_form_valid = false;
        }
      });

      if (!is_form_valid) {
        show_toast("⚠ Please fill in all fields correctly.");
        return;
      }

      if (formspree_url.includes("YOUR_FORM_ID")) {
        show_toast("✓ Message sent! (Demo mode)");
        contact_form.reset();
        return;
      }

      submit_button.disabled = true;
      submit_button.textContent = "Sending…";

      try {
        const fetch_response = await fetch(formspree_url, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contact_form),
        });

        if (fetch_response.ok) {
          show_toast("✓ Message sent successfully! I'll be in touch soon.");
          contact_form.reset();
        } else {
          show_toast("✕ Failed to send. Please check your details.");
        }
      } catch (err) {
        show_toast("✕ Network error — please try again or email me directly.");
      } finally {
        submit_button.disabled = false;
        submit_button.textContent = "Send Message →";
      }
    });
  }
});
