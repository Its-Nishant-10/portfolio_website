"use strict";

const formspree_url = "https://formspree.io/f/xdalqqgo";
const typewriter_phrases = [
  "I Love Building Things for Fun !!",
  "I Enjoy Taking Things Apart — not to Destroy, but to understand.",
  "Creating Something out of Mess is my Thing 🤓.",
];

document.addEventListener("DOMContentLoaded", () => {
  const typewriter_text = document.getElementById("typewriter_text");
  if (typewriter_text) {
    let phrase_index = 0;
    let char_index = 0;
    let is_deleting = false;

    const type_speed = 70;
    const delete_speed = 50;
    const pause_end = 180;
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

  const page_sections = document.querySelectorAll("main section[id]");
  const navigation_links = document.querySelectorAll(".nav_link");

  const scroll_observer = new IntersectionObserver(
    (entries) => {
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
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  page_sections.forEach((section) => scroll_observer.observe(section));

  const hamburger_btn = document.getElementById("hamburger");
  const nav_links_container = document.getElementById("nav_links");

  if (hamburger_btn && nav_links_container) {
    hamburger_btn.addEventListener("click", () => {
      const is_open = nav_links_container.classList.toggle("open");
      hamburger_btn.classList.toggle("open", is_open);
      hamburger_btn.setAttribute("aria-expanded", String(is_open));
    });

    const all_nav_links = nav_links_container.querySelectorAll(".nav_link");
    all_nav_links.forEach((link) => {
      link.addEventListener("click", () => {
        nav_links_container.classList.remove("open");
        hamburger_btn.classList.remove("open");
        hamburger_btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const filter_buttons = document.querySelectorAll(".filter_btn");
  const project_cards = document.querySelectorAll(".project_card");

  const visible_project_limit = 4;

  if (filter_buttons.length > 0 && project_cards.length > 0) {
    const apply_project_filter = (selected_filter) => {
      let visible_count = 0;

      project_cards.forEach((card) => {
        const matches_filter =
          selected_filter === "all" ||
          card.dataset.category === selected_filter;
        const should_show =
          matches_filter && visible_count < visible_project_limit;

        if (should_show) {
          visible_count++;
          card.classList.remove("hidden");
          card.style.animation = "none";
          void card.offsetHeight;
          card.style.animation = "";
        } else {
          card.classList.add("hidden");
        }
      });
    };

    filter_buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filter_buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selected_filter = btn.dataset.filter;
        apply_project_filter(selected_filter);
      });
    });

    const initial_active_filter =
      document.querySelector(".filter_btn.active")?.dataset.filter || "all";
    apply_project_filter(initial_active_filter);
  }

  const modal_overlays = document.querySelectorAll(".modal_overlay");
  const view_buttons = document.querySelectorAll(".btn_view");
  const close_buttons = document.querySelectorAll(".modal_close");

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
        const close_btn = target_modal.querySelector(".modal_close");
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

  const skill_bars = document.querySelectorAll(".skill_bar");
  if (skill_bars.length > 0) {
    let has_animated = false;

    const skills_observer = new IntersectionObserver(
      (entries) => {
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
      },
      { threshold: 0.3 },
    );

    const skills_section = document.getElementById("skills");
    if (skills_section) {
      skills_observer.observe(skills_section);
    }
  }

  const fade_in_targets = document.querySelectorAll(
    ".about_grid, .skills_grid, .contact_grid, " +
      ".section_title, .section_eyebrow, .quicklinks_label, .quicklinks_bar, " +
      ".section_header_row",
  );

  fade_in_targets.forEach((el) => el.classList.add("fade_in"));

  const fade_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is_visible");
          fade_in_observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  fade_in_targets.forEach((el) => fade_in_observer.observe(el));

  const contact_form = document.getElementById("contact_form");
  const toast_element = document.getElementById("toast");
  const submit_button = document.getElementById("submit_btn");

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
      } else if (
        input_el.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current_val)
      ) {
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

        const error_el = document.getElementById(input_el.id + "_error");
        if (error_el) error_el.textContent = "";
      });
    };

    const form_inputs = contact_form.querySelectorAll("input, textarea");
    form_inputs.forEach(clear_error_on_input);

    contact_form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const form_fields = [
        {
          input: contact_form.querySelector("#name"),
          error: contact_form.querySelector("#name_error"),
        },
        {
          input: contact_form.querySelector("#email"),
          error: contact_form.querySelector("#email_error"),
        },
        {
          input: contact_form.querySelector("#subject"),
          error: contact_form.querySelector("#subject_error"),
        },
        {
          input: contact_form.querySelector("#message"),
          error: contact_form.querySelector("#message_error"),
        },
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

  const all_anchor_links = document.querySelectorAll('a[href^="#"]');

  all_anchor_links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target_id = link.getAttribute("href");

      if (target_id === "#" || !target_id) return;

      const target_element = document.querySelector(target_id);
      if (target_element) {
        event.preventDefault();

        const nav_offset = 70;
        const element_top = target_element.getBoundingClientRect().top;
        const start_position = window.scrollY;
        const target_position = element_top + start_position - nav_offset;
        const distance = target_position - start_position;
        const duration = 800;
        let start_time = null;

        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return (c / 2) * t * t * t + b;
          t -= 2;
          return (c / 2) * (t * t * t + 2) + b;
        };

        const animation_step = (current_time) => {
          if (!start_time) start_time = current_time;
          const time_elapsed = current_time - start_time;
          const run_time = Math.min(time_elapsed, duration);

          const next_y = ease(run_time, start_position, distance, duration);
          window.scrollTo(0, next_y);

          if (time_elapsed < duration) {
            requestAnimationFrame(animation_step);
          }
        };

        requestAnimationFrame(animation_step);
      }
    });
  });
});
