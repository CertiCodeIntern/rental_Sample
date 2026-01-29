# 🔗 Shared Resources

> Common CSS and JavaScript used across client and admin.

## 📁 Structure

```
shared/
├── 📁 css/
│   ├── globals.css     # Design tokens, reset, base styles
│   └── landing.css     # Landing page styles
│
└── 📁 js/
    ├── components.js   # Reusable UI components
    └── landing.js      # Landing page scripts
```

## 🎨 CSS Files

### `globals.css`
Contains:
- **CSS Custom Properties** (design tokens)
  - Colors (`--primary-color`, `--gray-500`, etc.)
  - Typography (`--font-size-md`, `--font-weight-bold`, etc.)
  - Spacing (`--spacing-md`, `--spacing-lg`, etc.)
  - Borders (`--radius-md`, `--radius-pill`, etc.)
  - Shadows (`--shadow-sm`, `--shadow-lg`, etc.)
- **CSS Reset** - Normalize browser defaults
- **Base Styles** - Body, links, buttons
- **Utility Classes** - `.hidden`, `.sr-only`
- **Animations** - `@keyframes fadeUp`

### `landing.css`
Contains:
- Navbar styles
- Hero section
- Features grid
- CTA section
- Footer

## 🧩 JavaScript Files

### `components.js`
Provides:
```javascript
// UI Injection
Components.injectSidebar(containerId, activeTab)
Components.injectTopbar(containerId, title)

// Tab Management
Components.handleTabChange(tabId)
Components.loadTabContent(tabId)

// Authentication
Components.isAuthenticated()
Components.requireAuth()
Components.handleLogout()

// Utilities
Components.getCurrentUser()
```

### `landing.js`
Provides:
- Smooth scrolling navigation
- Mobile menu toggle
- Header scroll effects
- Animation triggers

## 📝 Usage

```html
<!-- Include in any HTML page -->
<link rel="stylesheet" href="/shared/css/globals.css">
<script src="/shared/js/components.js"></script>
```

## ⚠️ Important Notes

- Always use absolute paths starting with `/`
- `globals.css` should be included FIRST in any page
- `components.js` requires DOM to be loaded before calling methods

---

*See [/docs/ARCHITECTURE.md](/docs/ARCHITECTURE.md) for full project structure*
