# Claude AI Coding Assistant - Project Rules & Reminders

> **Purpose**: This document serves as a quick reference for Claude AI when working on this rental management project. It ensures consistency, follows established patterns, and maintains code quality across all contributions.

---

## 📋 Project Overview

| Aspect | Detail |
|--------|--------|
| **Project Name** | Sound Rental Management System |
| **Type** | Full-stack rental platform (Karaoke/Audio Equipment) |
| **Tech Stack** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Framework** | None - Pure vanilla implementation |
| **Fonts** | Inter (Google Fonts) |
| **Icons** | Inline SVG (no external icon libraries) |

---

## 🎨 Design System Reference

### Admin Portal Colors

```css
/* Primary Navy Palette */
--admin-navy-900: #0A0F1A;  /* Darkest - sidebar bg */
--admin-navy-800: #0F172A;  /* Dark - main bg */
--admin-navy-700: #1E293B;  /* Card backgrounds */

/* Accent Orange */
--admin-orange-500: #FB7012; /* Primary accent */
--admin-orange-600: #EA6A10; /* Hover state */

/* Status Colors */
Success: #22C55E
Warning: #F59E0B
Danger:  #EF4444
Info:    #3B82F6
```

### Client Portal Colors

```css
/* Primary Colors */
--primary: #FB7012;      /* Orange accent */
--background: #FFFFFF;   /* Light mode */
--surface: #F8FAFC;      /* Cards */
--text-primary: #1E293B;
```

---

## 📁 File Structure Rules

### Admin Pages

```
admin/
├── [page-name]/
│   ├── [page-name].html    # Page structure
│   ├── [page-name].css     # Page-specific styles
│   └── [page-name].js      # Page-specific logic
├── shared/
│   ├── css/
│   │   ├── admin-theme.css       # CSS variables
│   │   ├── admin-globals.css     # Base styles, animations
│   │   └── admin-components.css  # Reusable components
│   └── js/
│       └── admin-components.js   # Component injection
```

### Client Pages

```
client/
├── [page-name]/
│   ├── [page-name].html
│   ├── [page-name].css
│   └── [page-name].js
├── shared/ or use root shared/
```

---

## 🔧 Coding Standards

### HTML

1. **Always include** proper DOCTYPE and meta tags
2. **Use semantic HTML5** elements (`<main>`, `<aside>`, `<article>`, etc.)
3. **Add `title` attributes** for accessibility/tooltips on interactive elements
4. **Use data attributes** for JavaScript hooks: `data-action`, `data-id`, etc.
5. **Include SVG icons inline** - no external icon libraries

```html
<!-- ✅ Correct -->
<button class="btn btn-primary" title="Create new booking" data-action="create">
    <svg>...</svg>
    New Booking
</button>

<!-- ❌ Avoid -->
<button class="btn">
    <i class="fa fa-plus"></i>
    New Booking
</button>
```

### CSS

1. **Use CSS custom properties** from `admin-theme.css` or `theme.css`
2. **Follow BEM-like naming** for components: `.admin-card`, `.card-header`, `.card-title`
3. **Add animations** using predefined keyframes from `admin-globals.css`
4. **Include responsive breakpoints** at end of each CSS file
5. **Group styles** with comment headers

```css
/* =====================================================
   SECTION NAME
   ===================================================== */
.component {
    /* Layout */
    display: flex;
    
    /* Spacing */
    padding: 1.5rem;
    
    /* Visual */
    background: var(--admin-card-bg);
    border-radius: var(--admin-radius-lg);
    
    /* Animation */
    transition: all var(--admin-transition-normal);
    animation: fadeInUp 0.4s ease-out backwards;
}
```

### JavaScript

1. **Use ES6+ syntax**: arrow functions, template literals, destructuring
2. **Organize with object patterns**: `const PageManager = { ... }`
3. **Initialize on DOMContentLoaded**
4. **Use `AdminComponents` for shared functionality**
5. **Add JSDoc comments** for functions

```javascript
document.addEventListener('DOMContentLoaded', () => {
    AdminComponents.initPage('pagename');
    PageManager.init();
});

const PageManager = {
    /**
     * Initialize the page
     */
    init() {
        this.bindEvents();
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Event bindings here
    }
};
```

---

## 🧩 Component Usage

### Admin Components (JavaScript)

```javascript
// Initialize page with sidebar, header, footer
AdminComponents.initPage('dashboard');

// Show toast notification
AdminComponents.showToast('Message here', 'success'); // success | error | warning | info

// Show modal dialog
AdminComponents.showModal({
    title: 'Modal Title',
    content: '<p>HTML content</p>',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => { /* callback */ }
});

// Toggle theme
AdminComponents.toggleTheme();
```

### Shared CSS Classes

```html
<!-- Cards -->
<div class="admin-card">
    <div class="card-header">
        <h2 class="card-title">Title</h2>
    </div>
    <div class="card-body">Content</div>
</div>

<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Status Badges -->
<span class="status-badge success">Active</span>
<span class="status-badge warning">Pending</span>
<span class="status-badge danger">Overdue</span>

<!-- Tables -->
<table class="admin-table">
    <thead>...</thead>
    <tbody>...</tbody>
</table>
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop First Approach */
@media (max-width: 1400px) { /* Large desktop */ }
@media (max-width: 1200px) { /* Desktop */ }
@media (max-width: 992px)  { /* Tablet landscape */ }
@media (max-width: 768px)  { /* Tablet portrait */ }
@media (max-width: 480px)  { /* Mobile */ }
```

---

## ✅ Checklist for New Pages

When creating a new admin page, ensure:

- [ ] HTML file includes all shared CSS files in correct order
- [ ] Page has `id="admin-sidebar"`, `id="admin-header"`, `id="admin-footer"` containers
- [ ] JavaScript calls `AdminComponents.initPage('pagename')`
- [ ] Page-specific CSS uses CSS variables from theme
- [ ] All interactive elements have `title` attributes
- [ ] Animations are added for visual polish
- [ ] Responsive styles are included
- [ ] Toast notifications for user feedback
- [ ] Modal dialogs for confirmations
- [ ] Dark/light theme works correctly

---

## 🚫 Things to Avoid

1. **Don't use external libraries** unless absolutely necessary
2. **Don't hardcode colors** - use CSS variables
3. **Don't create inline styles** in JavaScript (add classes instead)
4. **Don't skip accessibility** - always add titles, aria labels
5. **Don't forget dark mode** - test both themes
6. **Don't duplicate components** - use shared files
7. **Don't use `var`** - use `const` or `let`
8. **Don't use `==`** - use `===` for comparisons

---

## 💡 Quick Reminders

| When... | Do This... |
|---------|------------|
| Adding a new page | Copy structure from existing page (e.g., `repairs/`) |
| Showing user feedback | Use `AdminComponents.showToast()` |
| Confirming actions | Use `AdminComponents.showModal()` |
| Adding hover info | Add `title` attribute |
| Styling new components | Check `admin-components.css` first |
| Adding animations | Use keyframes from `admin-globals.css` |
| Creating forms | Use `.form-group`, `.form-label`, `.form-input` classes |
| Building tables | Use `.admin-table` class |

---

## 📖 Reference Files

| Purpose | File Path |
|---------|-----------|
| CSS Variables | `/admin/shared/css/admin-theme.css` |
| Base Styles | `/admin/shared/css/admin-globals.css` |
| UI Components | `/admin/shared/css/admin-components.css` |
| JS Components | `/admin/shared/js/admin-components.js` |
| Architecture | `/docs/PROJECT-ARCHITECTURE.md` |
| Example Page | `/admin/repairs/repairs.html` |

---

## 🔄 Common Patterns

### Filter Implementation

```javascript
filterByStatus(status) {
    const items = document.querySelectorAll('[data-status]');
    items.forEach(item => {
        item.style.display = (status === 'all' || item.dataset.status === status) ? '' : 'none';
    });
    AdminComponents.showToast(`Filtered by: ${status}`, 'info');
}
```

### Action Handlers

```javascript
handleAction(action, id, element) {
    switch (action) {
        case 'view': this.viewItem(id); break;
        case 'edit': this.editItem(id); break;
        case 'delete': this.confirmDelete(id, element); break;
    }
}
```

### Confirm Delete Pattern

```javascript
confirmDelete(id, element) {
    AdminComponents.showModal({
        title: 'Confirm Delete',
        content: '<p>Are you sure?</p>',
        confirmText: 'Delete',
        type: 'danger',
        onConfirm: () => {
            element.remove();
            AdminComponents.showToast('Deleted successfully', 'success');
        }
    });
}
```

---

*Last updated: January 2026*
*For the Sound Rental Management System project*
