# Commit Guidelines & Templates

Purpose: provide short, editable, corporate-style commit messages and a small guideline so you (or Claude) can quickly review, edit, and apply commits with consistent wording.

---

## Recommendation (two options — pick one)

Option A — Manual, short & detailed (recommended now)
- Use the templates below to write a single, focused commit per logical change.
- Keep title ≤ 72 chars, 50 chars ideal; include a 1–3 line body with `What / Why / Impact / Tests`.
- Fast, low setup cost — ideal when iterating with LLMs.

Option B — Light automation (optional)
- Add a commit template file in repo and use `git commit -F COMMIT_MSG.txt` or a tiny Node script to prefill messages.
- Good for teams or CI; slightly more setup but reduces copy/paste errors.

Advice: start with Option A to keep token usage minimal, then add Option B if you want consistent enforcement across contributors.

---

## Commit Message Template (Corporate style)

Title (imperative, short):

    <scope>: <short summary>

Body (optional, 1–3 lines; use bullets if needed):

    - What: One-line description of the change.
    - Why: Reason or problem addressed.
    - Impact: Files affected, runtime effects, or backward-compat notes.
    - Tests: Manual checks performed or areas to verify.

Example structure:

    typography: add modular type scale and tokens

    - What: Introduces CSS variables for a Major Third type scale, line-height and letter-spacing tokens, and utility classes.
    - Why: Normalize typography across the app and improve readability.
    - Impact: Updated `css/styles.css` and replaced many hardcoded font-size/spacing values.
    - Tests: Visual check of auth and dashboard pages; responsive checks at 768px and 480px.

---

## Ready-to-use commit messages for recent edits

1) Typography system

Title:

    typography: add modular scale tokens and base utilities

Body:

    - What: Added full typographic design tokens (`--font-size-*`, `--line-height-*`, `--letter-spacing-*`), responsive adjustments, and utility classes (`.text-h1`..`.text-body-*`).
    - Why: Consolidate inconsistent sizes and line-heights for better readability and maintainability.
    - Impact: `css/styles.css` modified extensively; minor CSS updates across components to use tokens.
    - Tests: Visual confirmation on auth screen and main layout; mobile sizes checked at 768px/480px.

2) Auth footer improvement

Title:

    auth: improve footer markup and micro-typography

Body:

    - What: Replace single-line footer with structured markup (`.auth-footer-icon`, `.auth-footer-text`, `.auth-footer-label`, `.auth-footer-links`) and added layout + micro-typography styles.
    - Why: Improve trust, spacing and readability on the auth screen.
    - Impact: `index.html` updated (auth footer markup), `css/styles.css` updated (footer styles).
    - Tests: Visual verification of footer spacing and link styles on auth page.

3) Motion & loader helpers

Title:

    perf/ux: add minimal motion tokens and async loader helpers

Body:

    - What: Add animation tokens, `fadeUp` & `shimmer` keyframes, skeleton utilities, and JS helpers `loadWithLoader` and `staggerEntrance` for staggered entrance and async-aware loading.
    - Why: Add subtle, accessible motion and robust loading UX that reacts to real network latency.
    - Impact: `css/styles.css` (new animation tokens & rules) and `js/app.js` (helpers exported on `window.AppUtils`). Motion is disabled if `prefers-reduced-motion`.
    - Tests: Confirmed `.auth-card` children get staggered entrance on DOMContentLoaded; reduced-motion respected.

---

## Quick commit examples (one-liners you can paste and edit)

- `git commit -m "typography: add modular scale tokens and base utilities"`
- `git commit -m "auth: improve footer markup and micro-typography"`
- `git commit -m "perf/ux: add animation tokens and async loader helpers"`

Tip: To include the body text when committing, create a temporary file `COMMIT_MSG.txt` with the title+body then run:

```bash
git commit -F COMMIT_MSG.txt
```

or on Windows (PowerShell):

```powershell
git commit -F .\COMMIT_MSG.txt
```

---

## Small automation snippet (optional)

If you want a tiny Node helper to open a prefilled commit message for quick edit before committing, drop this in `scripts/prepareCommit.js` and run `node scripts/prepareCommit.js` to create `COMMIT_MSG.txt`:

```js
const fs = require('fs');
const template = `### Title (imperative):\n\nscope: short-summary\n\n- What: \n- Why: \n- Impact: \n- Tests: \n`;
fs.writeFileSync('COMMIT_MSG.txt', template);
console.log('COMMIT_MSG.txt created — edit then run `git commit -F COMMIT_MSG.txt`');
```

This is optional and intentionally tiny to keep token and dependency overhead low.

---

If you'd like, I can now add a small `COMMIT_MSG.txt` example and the optional Node helper to the repo, or simply provide ready-to-use one-line corporate commits for each change — tell me which.