/*
  ============================================================
  FILE: script.js
  PROJECT: Nishant Nahar — Personal Portfolio Website
  ============================================================
  This file contains ALL interactive JavaScript for the portfolio.
  It runs AFTER the HTML is fully loaded (placed at bottom of <body>
  so the DOM is ready; additionally wrapped in DOMContentLoaded).

  STRUCTURE:
    [1] Config / constants at top (formspree URL, typewriter phrases)
    [2] DOMContentLoaded wrapper — all code runs inside this callback:
        1. Typewriter Animation
        2. Navbar Scroll Highlighting
        3. Hamburger Menu Toggle
        4. Project Card Filtering
        5. Modal Open/Close Logic
        6. Skill Bars Scroll Animation
        7. Fade-In Scroll Observer
        8. Contact Form Validation & Submission

  NAMING CONVENTION:
    snake_case for all variables, functions, and IDs.
    Class names used with classList also use snake_case to match the HTML/CSS.
  ============================================================
*/

"use strict"; /* Enables strict mode: prevents undeclared variable usage, safer JS */

/* ============================================================
   [1] TOP-LEVEL CONFIGURATION CONSTANTS
   ============================================================
   These are defined OUTSIDE the DOMContentLoaded callback so they
   can be referenced from anywhere in the file.

   formspree_url:
     The Formspree endpoint to POST the contact form data to.
     Replace "YOUR_FORM_ID" with your actual form ID from formspree.io.
     If this string still contains "YOUR_FORM_ID", the form runs in
     demo mode (shows a fake success toast without sending any email).

   typewriter_phrases:
     An array of strings that the typewriter animation cycles through.
     Each string is typed character by character, then deleted, then
     the next string starts. Loop is infinite.
     Add, remove, or change any phrases here freely.
   ============================================================ */
const formspree_url = "https://formspree.io/f/xdalqqgo";
const typewriter_phrases = [
  "I Love Building Things for Fun !!",
  "I Enjoy Taking Things Apart — not to Destroy, but to understand.",
  "Creating Something out of Mess is my Thing 🤓.",
];


/* ============================================================
   DOMContentLoaded — MASTER EVENT LISTENER
   ============================================================
   All DOM-manipulation code lives inside this callback.
   This fires once the HTML document has been fully parsed and
   all elements are accessible via document.getElementById() etc.

   Without this wrapper, running script.js at the top of <head>
   would fail because the HTML elements don't exist yet.
   (This project places the script at the bottom of <body> instead,
   which also works — but DOMContentLoaded adds safety regardless.)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  /*
  ============================================================
  [1] TYPEWRITER ANIMATION
  ============================================================
  WHAT IT DOES:
    Simulates typing and erasing text inside the element with
    id="typewriter_text" in the Hero section.

  HOW IT WORKS:
    - Uses a recursive setTimeout loop (tick_typewriter function)
    - char_index tracks HOW MANY characters of the current phrase to show
    - is_deleting is a flag: false = typing, true = erasing
    - When a phrase is fully typed → pause → switch to deleting
    - When a phrase is fully deleted → switch to next phrase → pause → type

  TIMING:
    type_speed   = 70ms per character while typing
    delete_speed = 50ms per character while erasing (faster for snappy feel)
    pause_end    = 180ms pause AFTER fully typing, before erasing starts
    pause_start  = 300ms pause AFTER fully erasing, before typing next phrase

  ELEMENT USED:
    #typewriter_text — the <span> inside .hero_typewriter
    The blinking | cursor is a separate element (.tw_cursor) styled purely in CSS.

  NOTE: This function calls itself recursively via setTimeout.
  It does NOT use setInterval, which makes timing more predictable
  since each setTimeout starts AFTER the previous tick completes.
  ============================================================
  */
  // 1. TYPEWRITER ANIMATION
  const typewriter_text = document.getElementById("typewriter_text");
  if (typewriter_text) {
    let phrase_index = 0;   /* Index of the current phrase in typewriter_phrases array */
    let char_index = 0;     /* How many characters of the phrase are currently shown */
    let is_deleting = false; /* true = currently erasing; false = currently typing */

    /* Timing constants (milliseconds) */
    const type_speed = 70;   /* Delay between each character typed */
    const delete_speed = 50;   /* Delay between each character erased */
    const pause_end = 180;  /* Pause after phrase is FULLY typed */
    const pause_start = 300;  /* Pause after phrase is FULLY erased */

    /*
      tick_typewriter — The core recursive function.
      Each call updates char_index by ±1, updates the text content,
      then schedules itself again after current_delay milliseconds.
    */
    const tick_typewriter = () => {
      const current_phrase = typewriter_phrases[phrase_index];

      /* Increment or decrement the character count based on direction */
      if (is_deleting) {
        char_index--;
      } else {
        char_index++;
      }

      /* Update the visible text to show only the first char_index characters */
      typewriter_text.textContent = current_phrase.slice(0, char_index);

      /* Default delay is type or delete speed */
      let current_delay = is_deleting ? delete_speed : type_speed;

      /* Check if we just finished TYPING the full phrase */
      if (!is_deleting && char_index === current_phrase.length) {
        current_delay = pause_end;   /* Pause before starting to erase */
        is_deleting = true;
        /* Check if we just finished ERASING the phrase completely */
      } else if (is_deleting && char_index === 0) {
        is_deleting = false;
        /* Advance to the next phrase (loops back to 0 when we reach the end) */
        phrase_index = (phrase_index + 1) % typewriter_phrases.length;
        current_delay = pause_start; /* Pause before typing next phrase */
      }

      /* Schedule the next tick */
      setTimeout(tick_typewriter, current_delay);
    };

    /* Start the typewriter loop after a brief initial delay */
    setTimeout(tick_typewriter, pause_start);
  }


  /*
  ============================================================
  [2] NAVBAR SCROLL HIGHLIGHTING
  ============================================================
  WHAT IT DOES:
    Automatically highlights the correct nav link when its
    corresponding section is visible on screen as the user scrolls.

  HOW IT WORKS:
    Uses the browser's IntersectionObserver API.
    An IntersectionObserver watches a set of elements and fires
    a callback whenever one of them enters or leaves the viewport.

    We observe all <section> elements that have an id inside <main>.
    When a section "intersects" (becomes visible), we:
      1. Loop through all nav links
      2. Add the "active" class to the link whose href matches the section's id
      3. Remove "active" from all other links

  rootMargin: "-40% 0px -55% 0px":
    This shrinks the observation zone. The section only "counts as visible"
    when it occupies the middle band of the screen (roughly 5% to 60%).
    This prevents the wrong section from being highlighted when two
    sections are partially visible at the same time.

  ELEMENTS:
    page_sections      — all <section id="..."> elements inside <main>
    navigation_links   — all <a class="nav_link"> elements in the header
  ============================================================
  */
  // 2. NAVBAR HIGHLIGHTING ON SCROLL
  const page_sections = document.querySelectorAll("main section[id]");
  const navigation_links = document.querySelectorAll(".nav_link");

  const scroll_observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        /* Section is in view — highlight the matching nav link */
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

  /* Start observing every section */
  page_sections.forEach((section) => scroll_observer.observe(section));


  /*
  ============================================================
  [3] HAMBURGER MENU TOGGLE (MOBILE)
  ============================================================
  WHAT IT DOES:
    On small screens, the nav links are hidden by default.
    When the hamburger (☰) button is clicked, the links dropdown
    slides open. Clicking it again (or clicking any link) closes it.

  HOW IT WORKS:
    1. Toggle the "open" class on the nav links container
       → CSS uses .nav_links.open { display: flex; } to show/hide
    2. Toggle the "open" class on the hamburger button itself
       → CSS animates the three spans into an ✕ shape
    3. Update aria-expanded attribute for accessibility
       → Screen readers announce "expanded" or "collapsed"

  AUTO-CLOSE ON LINK CLICK:
    We also add click listeners to each .nav_link inside the mobile menu.
    Clicking any link removes "open" from both elements, closing the menu.
    This ensures after tapping a nav link the menu collapses before
    the smooth scroll completes.

  ELEMENTS:
    hamburger_btn        — the <button id="hamburger">
    nav_links_container  — the <ul id="nav_links">
  ============================================================
  */
  // 3. HAMBURGER MENU TOGGLE
  const hamburger_btn = document.getElementById("hamburger");
  const nav_links_container = document.getElementById("nav_links");

  if (hamburger_btn && nav_links_container) {
    /* Toggle open/close of mobile menu when hamburger is clicked */
    hamburger_btn.addEventListener("click", () => {
      const is_open = nav_links_container.classList.toggle("open");
      hamburger_btn.classList.toggle("open", is_open);
      hamburger_btn.setAttribute("aria-expanded", String(is_open));
    });

    /* Auto-close the menu when any nav link is clicked (smooth UX) */
    const all_nav_links = nav_links_container.querySelectorAll(".nav_link");
    all_nav_links.forEach((link) => {
      link.addEventListener("click", () => {
        nav_links_container.classList.remove("open");
        hamburger_btn.classList.remove("open");
        hamburger_btn.setAttribute("aria-expanded", "false");
      });
    });
  }


  /*
  ============================================================
  [4] PROJECT CARD FILTERING
  ============================================================
  WHAT IT DOES:
    Filters the project cards grid to show only cards matching
    the selected category (All / Web / Automation / Fun).
    Also limits the number of visible cards so you can keep
    adding many projects without making the section too long.

  HOW IT WORKS:
     1. Each filter button has data-filter="all|web|automation|fun"
     2. Each project card has data-category="web|automation|fun" (or any custom category)
    3. When a button is clicked:
       a. Remove "active" from all buttons → add it to the clicked one
       b. Loop through all project cards:
          - If filter is "all" OR card's category matches, AND
            visible_count is still below visible_project_limit → show it
            - Otherwise → hide it (add class "hidden" → CSS sets display:none)
     4. visible_project_limit controls how many cards are shown at once.
       (Current value is 5. Change this single constant to adjust.)
     5. A CSS animation REFLOW TRICK is used to restart the fadeUp animation:
         card.style.animation = "none"    → disables animation
         void card.offsetHeight           → forces browser to repaint (reflow)
         card.style.animation = ""        → re-enables animation
       This makes cards animate back in after filtering instead
       of just appearing instantly.
     6. The same filter function is called once on page load using
       the currently active filter button, so the 5-card limit is
       applied immediately (not only after the first click).

  ELEMENTS:
    filter_buttons  — all <button class="filter_btn">
    project_cards   — all <article class="project_card">
  ============================================================
  */
  // 4. PROJECT FILTERING
  const filter_buttons = document.querySelectorAll(".filter_btn");
  const project_cards = document.querySelectorAll(".project_card");
  /* Maximum number of cards visible at one time per selected filter */
  const visible_project_limit = 4;

  if (filter_buttons.length > 0 && project_cards.length > 0) {
    /* Reusable helper: applies category filter + visibility limit together */
    const apply_project_filter = (selected_filter) => {
      /* Counts how many cards are currently shown for this filter */
      let visible_count = 0;

      project_cards.forEach((card) => {
        const matches_filter = selected_filter === "all" || card.dataset.category === selected_filter;
        const should_show = matches_filter && visible_count < visible_project_limit;

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
        /* Move "active" class to the clicked filter button */
        filter_buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selected_filter = btn.dataset.filter;
        apply_project_filter(selected_filter);
      });
    });

    /* Apply current active filter on initial load so limit is active immediately */
    const initial_active_filter = document.querySelector(".filter_btn.active")?.dataset.filter || "all";
    apply_project_filter(initial_active_filter);
  }


  /*
  ============================================================
  [5] MODAL OPEN/CLOSE LOGIC
  ============================================================
  WHAT IT DOES:
    Opens a full-screen pop-up modal with detailed project info
    when the user clicks "View Project →" on any project card.
    Provides multiple ways to close it for good UX.

  HOW IT WORKS — OPENING:
    Each .btn_view button has data-modal="modal_1" (or 2, 3, 4).
    When clicked, we use document.getElementById(target_modal_id)
    to find the matching modal and add the "open" class to it.
    CSS shows it: .modal_overlay.open { display: flex; }
    We also set body overflow hidden to prevent background scrolling.
    Focus is moved to the close button for keyboard accessibility.

  HOW IT WORKS — CLOSING:
    close_all_modals() removes "open" from all modals at once
    and restores body scrolling.
    It is triggered by:
      1. Clicking the ✕ close button inside the modal
      2. Clicking the dark semi-transparent overlay *outside* the panel
         (detected by checking if event.target === overlay itself,
          not a child element like the modal panel)
      3. Pressing the Escape key anywhere on the page

  ELEMENTS:
    modal_overlays  — all <div class="modal_overlay"> elements
    view_buttons    — all <button class="btn_view"> in project cards
    close_buttons   — all <button class="modal_close"> inside modals
  ============================================================
  */
  // 5. MODAL LOGIC
  const modal_overlays = document.querySelectorAll(".modal_overlay");
  const view_buttons = document.querySelectorAll(".btn_view");
  const close_buttons = document.querySelectorAll(".modal_close");

  /* Helper: close ALL modals and restore page scroll */
  const close_all_modals = () => {
    modal_overlays.forEach((modal) => modal.classList.remove("open"));
    document.body.style.overflow = "";
  };

  /* Open the correct modal when "View Project →" is clicked */
  view_buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target_modal_id = btn.dataset.modal;                        /* e.g. "modal_1" */
      const target_modal = document.getElementById(target_modal_id); /* finds #modal_1 */
      if (target_modal) {
        target_modal.classList.add("open");
        document.body.style.overflow = "hidden"; /* Prevent background scroll while modal is open */
        const close_btn = target_modal.querySelector(".modal_close");
        if (close_btn) close_btn.focus(); /* Move keyboard focus to close button for accessibility */
      }
    });
  });

  /* Close modal when clicking the dark overlay background (outside the panel) */
  modal_overlays.forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      /* Only close if click was ON the overlay itself, not on its children (the modal panel) */
      if (event.target === overlay) {
        close_all_modals();
      }
    });
  });

  /* Close modal when clicking any ✕ button inside a modal */
  close_buttons.forEach((btn) => {
    btn.addEventListener("click", close_all_modals);
  });

  /* Close modal when the user presses the Escape key */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close_all_modals();
  });


  /*
  ============================================================
  [6] SKILL BARS SCROLL ANIMATION
  ============================================================
  WHAT IT DOES:
    When the user scrolls to the Skills section, the progress bars
    animate from 0% width to their target percentage.

  HOW IT WORKS:
    1. All elements matching ".skill_bar" are selected.
    2. A second IntersectionObserver watches the #skills section.
    3. When #skills is 30% visible (threshold: 0.3), the animation fires:
         - We read each bar's data-width attribute ("90", "80", "75" etc.)
         - We set bar.style.width = target_width + "%"
         - CSS handles the smooth transition: transition: width 1.2s cubic-bezier(...)
    4. has_animated flag ensures the bars only animate ONCE.
       Without it the bars would animate every time you scroll past skills.

  CSS DEPENDENCY:
    .skill_bar starts with width: 0 in style.css.
    The transition property in .skill_bar handles smoothing automatically.
    The gold glow box-shadow is also applied in CSS on .skill_bar.

  NOTE:
    requestAnimationFrame is used to delay the width assignment
    by one frame, ensuring the transition starts smoothly
    rather than jumping straight to the target width.
  ============================================================
  */
  // 6. SKILL BARS SCROLL ANIMATION
  const skill_bars = document.querySelectorAll(".skill_bar");
  if (skill_bars.length > 0) {
    let has_animated = false; /* Guard: prevents re-triggering on scroll */

    const skills_observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !has_animated) {
          has_animated = true;
          skill_bars.forEach((bar) => {
            requestAnimationFrame(() => {
              /* Read the target width from the HTML data-width attribute */
              const target_width = bar.dataset.width || "0";
              bar.style.width = target_width + "%";
              /* CSS transition: width 1.2s handles the smooth animation */
            });
          });
        }
      });
    }, { threshold: 0.3 }); /* Fires when 30% of #skills is in view */

    const skills_section = document.getElementById("skills");
    if (skills_section) {
      skills_observer.observe(skills_section);
    }
  }


  /*
  ============================================================
  [7] FADE-IN SCROLL ANIMATION
  ============================================================
  WHAT IT DOES:
    Various sections and structural elements smoothly fade and
    slide up into view as the user scrolls down the page.

  HOW IT WORKS:
    1. We select a list of elements we want to animate.
    2. We add the CSS class "fade_in" to each one.
       CSS .fade_in sets opacity: 0 and translateY(24px) — hidden & shifted down.
    3. A third IntersectionObserver watches all these elements.
    4. When an element enters the viewport (12% visible, rootMargin -40px bottom),
       we add the CSS class "is_visible" to it.
       CSS .fade_in.is_visible transitions it to opacity: 1 and translateY(0).
    5. After animating in, we unobserve the element (no need to keep watching it).

  ELEMENTS TARGETED:
    - .about_grid        — the About section's content grid
    - .skills_grid       — the Skills section's content grid
    - .contact_grid      — the Contact section's content grid
    - .section_title     — all large section H2 headings
    - .section_eyebrow   — all small uppercase label texts
    - .quicklinks_label  — (if present) quicklinks label
    - .quicklinks_bar    — the quick navigation bar
    - .section_header_row — the projects section header row
  ============================================================
  */
  // 7. FADE-IN ANIMATION ON SCROLL
  const fade_in_targets = document.querySelectorAll(
    '.about_grid, .skills_grid, .contact_grid, ' +
    '.section_title, .section_eyebrow, .quicklinks_label, .quicklinks_bar, ' +
    '.section_header_row'
  );

  /* Give every target element the "fade_in" starting state */
  fade_in_targets.forEach((el) => el.classList.add('fade_in'));

  const fade_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is_visible'); /* Trigger the CSS animation */
          fade_in_observer.unobserve(entry.target); /* Stop watching once animated */
        }
      });
    },
    {
      threshold: 0.12,            /* Element must be 12% visible to trigger */
      rootMargin: '0px 0px -40px 0px' /* Offset: trigger 40px before the bottom of viewport */
    }
  );

  fade_in_targets.forEach((el) => fade_in_observer.observe(el));


  /*
  ============================================================
  [8] CONTACT FORM VALIDATION & SUBMISSION
  ============================================================
  WHAT IT DOES:
    Custom form validation and AJAX submission via Formspree.
    Shows real-time error messages and a toast notification
    for success/failure feedback.

  HOW IT WORKS — VALIDATION:
    validate_input_field(input_el, error_el):
      Checks if the field is empty, or if it's an email field,
      whether the value matches a valid email regex.
      Returns true (valid) or false (invalid).
      Adds/removes the CSS class "error" on the input (red border).
      Sets error_el.textContent to the error message or clears it.

    clear_error_on_input(input_el):
      Attaches an "input" event listener to each field so the red
      error border clears as soon as the user starts correcting it.
      Provides instant positive feedback.

  HOW IT WORKS — SUBMISSION:
    On form submit:
      1. Prevent default browser form submission (event.preventDefault)
      2. Validate all 4 fields (name, email, subject, message)
      3. If ANY field is invalid → show a warning toast, stop here
      4. If Formspree URL is not set → run in demo mode (fake success)
      5. Otherwise → fetch() POST the form data to Formspree
      6. On success (response.ok) → clear form + show success toast
      7. On failure (non-ok response) → show error toast
      8. On network error (catch) → show network error toast
      9. finally block always runs: re-enable and reset the submit button

  TOAST NOTIFICATIONS:
    show_toast(message, duration_ms):
      Sets the toast element's text, adds the "show" class (CSS slides it up),
      then removes "show" after duration_ms milliseconds (default 4 seconds).

  ELEMENTS:
    contact_form    — the <form id="contact_form">
    toast_element   — <div id="toast"> for notifications
    submit_button   — <button id="submit_btn">
  ============================================================
  */
  // 8. CONTACT FORM VALIDATION
  const contact_form = document.getElementById("contact_form");
  const toast_element = document.getElementById("toast");
  const submit_button = document.getElementById("submit_btn");

  if (contact_form) {

    /*
      show_toast — Displays a brief notification at the bottom of the screen.
      message:     The text to show inside the toast.
      duration_ms: How long (in ms) to show the toast before hiding it again (default 4000ms).
    */
    const show_toast = (message, duration_ms = 4000) => {
      if (!toast_element) return;
      toast_element.textContent = message;
      toast_element.classList.add("show");
      setTimeout(() => toast_element.classList.remove("show"), duration_ms);
    };

    /*
      validate_input_field — Validates a single form field.
      input_el:  The <input> or <textarea> element to validate.
      error_el:  The corresponding <span class="field_error"> to show error text in.
      Returns true if the field is VALID, false if it's INVALID.

      Validation rules:
        - Empty field → "This field is required."
        - Email type with invalid format → "Please enter a valid email address."
      The regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ is a basic but effective
      email format checker (checks for "something@something.something").
    */
    const validate_input_field = (input_el, error_el) => {
      const current_val = input_el.value.trim();
      let error_message = "";

      if (!current_val) {
        error_message = "This field is required.";
      } else if (input_el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current_val)) {
        error_message = "Please enter a valid email address.";
      }

      /* Apply or remove the red "error" CSS class on the input */
      if (error_message) {
        input_el.classList.add("error");
      } else {
        input_el.classList.remove("error");
      }

      /* Show or clear the error message below the input */
      error_el.textContent = error_message;
      return !error_message; /* true = valid, false = invalid */
    };

    /*
      clear_error_on_input — Adds a live "input" event listener to one field.
      As soon as the user types into an invalid field, the red border clears.
      This gives immediate positive feedback that the error is being fixed.
    */
    const clear_error_on_input = (input_el) => {
      input_el.addEventListener("input", () => {
        input_el.classList.remove("error");
        /* Find the corresponding error span by ID convention: [fieldId]-error */
        const error_el = document.getElementById(input_el.id + "_error");
        if (error_el) error_el.textContent = "";
      });
    };

    /* Attach live error-clearing to every input and textarea in the form */
    const form_inputs = contact_form.querySelectorAll("input, textarea");
    form_inputs.forEach(clear_error_on_input);


    /*
      Form submit handler — runs when the user clicks "Send Message →".
      async so we can await the fetch() Formspree POST request.
    */
    contact_form.addEventListener("submit", async (event) => {
      event.preventDefault(); /* Stop the browser from doing a full page reload */

      /*
        Define the 4 fields to validate.
        Each is an object with:
          input: the <input> or <textarea> DOM element
          error: the corresponding <span class="field_error"> element
      */
      const form_fields = [
        { input: contact_form.querySelector("#name"), error: contact_form.querySelector("#name_error") },
        { input: contact_form.querySelector("#email"), error: contact_form.querySelector("#email_error") },
        { input: contact_form.querySelector("#subject"), error: contact_form.querySelector("#subject_error") },
        { input: contact_form.querySelector("#message"), error: contact_form.querySelector("#message_error") }
      ];

      /* Validate all fields; is_form_valid becomes false if ANY field fails */
      let is_form_valid = true;
      form_fields.forEach((field) => {
        if (field.input && field.error) {
          const is_valid = validate_input_field(field.input, field.error);
          if (!is_valid) is_form_valid = false;
        }
      });

      /* If validation failed, show a warning toast and stop */
      if (!is_form_valid) {
        show_toast("⚠ Please fill in all fields correctly.");
        return;
      }

      /*
        DEMO MODE: If the Formspree URL is unchanged (still has "YOUR_FORM_ID"),
        skip the actual fetch and just show a fake success message.
        This lets the portfolio work without a real Formspree account for testing.
      */
      if (formspree_url.includes("YOUR_FORM_ID")) {
        show_toast("✓ Message sent! (Demo mode)");
        contact_form.reset();
        return;
      }

      /* LIVE MODE: Disable button and show loading state */
      submit_button.disabled = true;
      submit_button.textContent = "Sending…";

      try {
        /*
          POST the form data to the Formspree URL using the fetch() API.
          FormData(contact_form) automatically collects all named input values.
          Accept: "application/json" tells Formspree to return a JSON response.
        */
        const fetch_response = await fetch(formspree_url, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contact_form),
        });

        if (fetch_response.ok) {
          /* SUCCESS: email was sent */
          show_toast("✓ Message sent successfully! I'll be in touch soon.");
          contact_form.reset();
        } else {
          /* SERVER ERROR: Formspree rejected the submission */
          show_toast("✕ Failed to send. Please check your details.");
        }
      } catch (err) {
        /* NETWORK ERROR: user has no internet connection or Formspree is down */
        show_toast("✕ Network error — please try again or email me directly.");
      } finally {
        /*
          finally always runs regardless of success or error.
          Re-enable the button and restore its text so the user can try again.
        */
        submit_button.disabled = false;
        submit_button.textContent = "Send Message →";
      }
    });

  } /* end if (contact_form) */


  /*
  ============================================================
  [9] CUSTOM SMOOTH SCROLLING
  ============================================================
  Intercepts clicks on all anchor links (href="#...") to perform
  a custom smooth scroll animation with easing.
  This provides a more polished feel than default browser scrolling
  and ensures the sticky navbar doesn't cover section headers.
  */
  const all_anchor_links = document.querySelectorAll('a[href^="#"]');

  all_anchor_links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target_id = link.getAttribute("href");

      /* Skip if href is just "#" (empty link) or invalid */
      if (target_id === "#" || !target_id) return;

      const target_element = document.querySelector(target_id);
      if (target_element) {
        event.preventDefault(); /* Stop default instant jump */

        /* Calculate position: element top + current scroll - navbar height offset */
        const nav_offset = 70;
        const element_top = target_element.getBoundingClientRect().top;
        const start_position = window.scrollY;
        const target_position = element_top + start_position - nav_offset;
        const distance = target_position - start_position;
        const duration = 800; /* Animation duration in ms (0.8 seconds) */
        let start_time = null;

        /* Custom easing function (easeInOutCubic) for a premium feel */
        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
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

}); /* end DOMContentLoaded */
