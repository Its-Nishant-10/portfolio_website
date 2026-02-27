# 📋 Portfolio — How to Personalise

Open this file alongside `index.html` and follow each step below.
Everything marked **TODO** is something you must add.

---

## 1. 🌐 Basic Info (`index.html` — `<head>`)

| What              | Where                                 | Example                                            |
| ----------------- | ------------------------------------- | -------------------------------------------------- |
| Browser tab title | `<title>` tag (line 7)                | `Nishant Nahar — Web Developer`                    |
| SEO description   | `<meta name="description">` (line 10) | `Portfolio of Nishant Nahar, Full-Stack Developer` |

---

## 2. 🔤 Navigation Logo (`index.html` — `<header>`)

Find this line and change the name:

```html
<span class="logo-text">Nishant.</span>
```

Change `Nishant.` to your own display name (e.g. `Alex.` or `Dev.`).

---

## 3. 🦸 Hero Section (`index.html` — `.hero`)

| What               | Where to edit                                          | Note                                             |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| Your role/title    | `<span class="hero-tag">`                              | e.g. `< Full Stack Dev />` or `< UI Designer />` |
| Your full name     | `<span class="hero-name">`                             | e.g. `Nishant Nahar.`                            |
| Typewriter phrases | **`script.js` — `TYPEWRITER_PHRASES` array** (line 35) | Min 2 phrases, shown one at a time               |

**Typewriter example:**

```js
const TYPEWRITER_PHRASES = [
  "I build full-stack web apps.",
  "I design clean, minimal UIs.",
  "I love open-source projects.",
];
```

---

## 4. 🗂️ Projects Section (`index.html` — `.projects-section`)

There are **4 project cards** + **4 matching modals**.
For each project, fill in **both** the card AND the modal.

### Card (repeat for cards 1–4)

```html
<article class="project-card" data-category="web"></article>
```

| What to change                 | How                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `data-category`                | Set to `"web"`, `"mobile"`, or `"design"`                                                                                |
| `card-filename`                | e.g. `my-portfolio.html` or `ecommerce-app`                                                                              |
| Card image                     | Replace the `<div class="img-placeholder">` with:<br>`<img src="images/project1.jpg" alt="My Project" loading="lazy" />` |
| Card title (`card-title`)      | Your project name, e.g. `RetroUI Kit`                                                                                    |
| Card description (`card-desc`) | 2–3 sentences: what it does, who it's for, why you built it                                                              |
| Tags (`card-tags`)             | Replace `<span class="tag">` values with your actual tech stack                                                          |

**Screenshot tips:**

- Save images in a folder called `images/` inside your portfolio folder
- Recommended size: **600 × 340 px** (16:9 ratio)
- Take a browser screenshot at 1280px width for best results

### Modal (repeat for modals 1–4)

Each modal ID must match the button: `data-modal="modal-1"` → `id="modal-1"`

| What to change            | How                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Modal image               | Same as card image — replace placeholder with `<img src="..." />`                                     |
| Modal title (`h3`)        | Same as card title (or longer version)                                                                |
| Modal description (`<p>`) | **4–6 sentences** — problem solved, your role, key decisions, technical challenges, outcome/learnings |
| Modal tags                | Full tech stack — more detailed than card                                                             |
| "Live Demo" `href`        | Your deployed project URL (Netlify, Vercel, GitHub Pages, etc.)                                       |
| "GitHub" `href`           | Your GitHub repo URL                                                                                  |

**Modal description template:**

> "[Project Name] is a [type of app] that [solves this problem] for [target users].
> I built it using [main technologies] over [time period].
> The biggest challenge was [challenge], which I solved by [solution].
> The result was [outcome/metric/impact].
> If I were to redo it, I would [improvement]."

**Categories explained:**

- `web` → websites, web apps, dashboards
- `mobile` → React Native, Flutter, iOS/Android apps
- `design` → Figma designs, UI kits, branding, case studies

---

## 5. 🙋 About Section (`index.html` — `.about-section`)

| What to change  | How                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Profile photo   | Replace `.photo-placeholder` div with:<br>`<img src="images/photo.jpg" alt="Photo of [Your Name]" class="profile-photo" />` |
| Location badge  | `<div class="location-badge">📍 India</div>` → your city/country                                                            |
| Bio paragraph 1 | Introduce yourself: who you are + what you do professionally                                                                |
| Bio paragraph 2 | Interests, hobbies, work philosophy, what drives you                                                                        |
| Fun fact 1      | Change `☕ Coffee-powered developer` to something personal                                                                  |
| Fun fact 2      | Change `🎨 Design nerd at heart` to your own fact                                                                           |
| Fun fact 3      | Change `🌍 Open to remote work` to your own fact                                                                            |

**Photo tips:**

- Square image, minimum **400 × 400 px**
- Professional but friendly — plain background works best
- Put the file in an `images/` folder in your portfolio

---

## 6. 💡 Skills Section (`index.html` — `.skills-section`)

### Skill Bars (left column)

For each `.skill-item`, change:

1. `skill-label` — skill name (e.g. `Python`, `React Native`)
2. `skill-pct` — shown percentage (e.g. `80%`)
3. `data-width` on `.skill-bar` — the same number **without %** (e.g. `80`)

**To add a new skill**, copy this block:

```html
<div class="skill-item">
  <div class="skill-header">
    <span class="skill-label">Your Skill</span>
    <span class="skill-pct">75%</span>
  </div>
  <div class="skill-track">
    <div class="skill-bar" data-width="75"></div>
  </div>
</div>
```

**To remove a skill**, delete the entire `.skill-item` block.

### Tool Tags (right column)

Replace or add `<span class="tool-tag">` chips:

```html
<span class="tool-tag">Docker</span>
<span class="tool-tag">AWS</span>
<span class="tool-tag">TypeScript</span>
```

---

## 7. 📬 Contact Section (`index.html` — `.contact-section`)

| What to change      | Where                                                            |
| ------------------- | ---------------------------------------------------------------- |
| Email address       | `href="mailto:your@email.com"` and `<span>your@email.com</span>` |
| Location            | `<span>India 🇮🇳</span>` → your city, country and flag emoji      |
| Contact invite text | `<p class="contact-intro">` paragraph                            |
| GitHub URL          | `<a href="#" aria-label="GitHub">`                               |
| LinkedIn URL        | `<a href="#" aria-label="LinkedIn">`                             |
| Twitter/X URL       | `<a href="#" aria-label="Twitter/X">`                            |
| Instagram URL       | `<a href="#" aria-label="Instagram">`                            |

**To remove a social icon**, delete its `<a class="social-icon">` block.

---

## 8. 📧 Making the Form Send Real Emails (`script.js`)

1. Go to **[formspree.io](https://formspree.io)** → create a free account
2. Click **New Form** → name it → confirm your email
3. Copy your endpoint (e.g. `https://formspree.io/f/xabcdefg`)
4. Open `script.js` and update **line 29**:

```js
// BEFORE:
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

// AFTER (paste your real URL):
const FORMSPREE_URL = "https://formspree.io/f/xabcdefg";
```

Free plan: **50 submissions/month** — more than enough for a portfolio.

---

## 9. 🔧 Footer (`index.html` — `.footer`)

```html
<span class="footer-copy">© 2025 Nishant Nahar. All rights reserved.</span>
```

Update the **year** and **your name**.

---

## 10. 🚀 Going Live (Publishing Your Portfolio)

Easiest free options — no server needed:

| Platform         | How                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Netlify**      | Drag & drop your portfolio folder at [netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push to a repo → Settings → Pages → Deploy from `main` branch                         |
| **Vercel**       | Connect your GitHub repo at [vercel.com](https://vercel.com)                          |

> All three are **completely free** and give you a live URL in under 2 minutes.

---

## ✅ Personalisation Checklist

Before you publish, tick off:

- [ ] Title tag and meta description updated
- [ ] Nav logo name changed
- [ ] Hero role/title and name updated
- [ ] Typewriter phrases updated (`script.js`)
- [ ] All 4 project cards filled in (title, desc, tags, image, category)
- [ ] All 4 project modals filled in (longer desc, live URL, GitHub URL)
- [ ] Profile photo added
- [ ] Bio paragraphs written
- [ ] Fun facts personalised
- [ ] Skills updated (labels, percentages, tool tags)
- [ ] Contact email and location updated
- [ ] Social URLs added
- [ ] Formspree URL added (`script.js`)
- [ ] Footer year and name updated
