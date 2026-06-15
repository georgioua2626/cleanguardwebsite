# CLAUDE.md — Clean Guard Pest Control Cyprus

This file is persistent context for the whole project. Read it before building any page. The design system and shared components defined here are **authoritative** — every page inherits them. Do not redefine colors, components, header, or footer per page. The goal is one cohesive product, not four separate templates.

---

## Project

Multi-page marketing website for a pest control company in Cyprus.
**All site copy is in Greek.** Code, comments, and class names stay in English.

- **Company:** Clean Guard — Pest Control Cyprus
- **Tone:** professional, trustworthy, modern, premium
- **Phone:** `94 300 800`
- **Email:** `cgcpest@gmail.com`
- **Coverage:** all of Cyprus (Όλη η Κύπρος), based in Nicosia (Λευκωσία)
- **Selling points:** 24/7 availability, 15+ years experience, certified products, 100% guarantee

---

## Stack & structure

Static site. No framework. HTML + one shared CSS file + vanilla JS. Mobile-first, fully responsive.

```
/
├── index.html          # home
├── services.html       # Υπηρεσίες
├── about.html          # Η Ομάδα μας
├── encyclopedia.html   # Εγκυκλοπαίδεια Παρασίτων
├── css/styles.css      # single shared stylesheet (all design tokens live here)
└── js/main.js          # nav toggle, scroll animations, form validation
```

The header, footer, and CTA banner are **identical** on every page. Build them once, copy them verbatim.

---

## Design tokens

Define these as CSS custom properties in `:root` and reference them everywhere. Never hardcode a hex value in a component.

**Colors**
- `--brand`: confident emerald green (primary actions, links, icons)
- `--brand-dark`: deeper green (gradient end, hovers)
- `--hero-gradient`: green diagonal gradient (`--brand` → `--brand-dark`) for hero sections
- `--bg`: soft off-white page background
- `--surface`: white (cards)
- `--ink`: dark slate text
- `--ink-muted`: muted grey for supporting text
- `--footer-bg`: dark slate (near-black navy)

**Category accents** (for color-coded cards):
`--cat-red`, `--cat-orange`, `--cat-amber`, `--cat-green`, `--cat-blue`, `--cat-purple`

**Shape & depth**
- `--radius`: ~16px on cards, ~10px on buttons/inputs
- `--shadow-sm`: subtle resting shadow on cards
- `--shadow-lg`: lifted shadow on hover
- Cards are never flat and never heavy — soft, layered, generous.

**Typography**
- Clean sans-serif (system stack or one Google font). Bold, large headings; comfortable line height (~1.6 on body).
- Section pattern: small green eyebrow label → bold H2 → muted one-line subtitle → content.

**Spacing**
- Generous whitespace. Sections breathe. Consistent vertical rhythm between sections.
- Max content width ~1140px, centered, with side padding that holds on mobile.

---

## Shared components

### Card pattern (the backbone of the whole site)
Icon in a colored rounded square → heading → supporting text → optional checklist (small green check icons) → optional button.
Hover: lift + `--shadow-lg`. This one pattern, restyled, covers services, values, teams, stats, and categories.

### Header (sticky, white)
- Shield logo + stacked "Clean Guard / Pest Control Cyprus"
- Nav: Αρχική, Υπηρεσίες, Η Ομάδα μας, Εγκυκλοπαίδεια
- Collapses to a hamburger menu under ~768px (toggle in `main.js`)

### Footer (dark slate)
- Brand blurb (one or two lines, Greek)
- "Επικοινωνήστε μαζί μας" with phone + email
- Three link columns: **Υπηρεσίες** · **Εταιρεία** · **Επικοινωνία**
- Bottom bar: `© 2026 Clean Guard Pest Control Cyprus. Όλα τα δικαιώματα διατηρούνται.` + policy links (Πολιτική Απορρήτου, Όροι Υπηρεσίας, Πολιτική Cookies)

### CTA banner (full-width green)
Bold Greek headline + subtext + two buttons (a primary contact CTA and the phone number). Sits near the bottom of every page above the footer.

---

## Interaction & motion

- Subtle hover states on cards, buttons, links (lift + shadow, slight color shift).
- Light scroll-in fade/translate animations via IntersectionObserver — tasteful, never bouncy or flashy.
- No animation that causes layout shift.

---

## Greek copy conventions

- All visible text in Greek; keep it natural, not machine-translated.
- Recurring labels: Υπηρεσίες, Απεντόμωση, Απολύμανση, Μυοκτονία, Απωθητικά, Περισσότερα, Μάθετε Περισσότερα, Επικοινωνία, Κλείστε Ραντεβού, Καλέστε Τώρα.
- Numbers/phone stay as `94 300 800`.

---

## Quality bar (verify before considering any page done)

- Semantic HTML; one `<h1>` per page.
- Accessible: alt text on images, `<label>`s on inputs, visible focus states, AA contrast.
- Responsive: looks polished at **375px** and on a wide desktop. No horizontal scroll, no overflow.
- No console errors. No layout shift on load or on scroll animations.
- All four pages share the exact same header, footer, and CTA banner markup.
- Internal nav links work across all pages.
- Contact form is front-end only for now, with client-side validation (required fields, email format).

---

## How to work on this project

1. **Plan first.** In plan mode, lay out the full file structure and the shared components before writing code. Get approval, then execute.
2. **Build the shared layer first:** design tokens in `styles.css`, then header + footer + CTA banner. Confirm they render before touching pages.
3. **One page per pass.** Build a single page to completion, referencing this file, before moving to the next. Don't redefine the system.
4. **Reuse, don't recreate.** If a layout needs a card, restyle the existing card pattern — don't invent a new one.
