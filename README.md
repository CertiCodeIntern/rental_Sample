# CertiCode - Vanilla HTML/CSS/JS Dashboard

A clean, modern Videoke Rental Management System built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no bundlers.

## 📁 File Structure

```
rental-vanilla/
├── index.html              # Entry point (Login/Signup page)
├── dashboard.html          # Dashboard page
├── wip.html                # Work in Progress page
├── vercel.json             # Vercel deployment config
├── README.md               # This file
├── css/
│   ├── globals.css         # CSS variables, reset, base styles
│   ├── auth.css            # Login/Signup page styles
│   └── dashboard.css       # Dashboard & component styles
└── js/
    ├── components.js       # Reusable UI components (Sidebar, Topbar, etc.)
    ├── auth.js             # Authentication logic
    └── dashboard.js        # Dashboard page logic
```

## 🚀 Features

- **Pure Vanilla Stack**: HTML5, CSS3, JavaScript (ES6+)
- **No Build Step**: Just open in browser or deploy directly
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Reusable Components**: JavaScript-injected Sidebar and Topbar
- **CSS Custom Properties**: Centralized design tokens for easy theming
- **Smooth Animations**: CSS transitions and stagger animations
- **Authentication Flow**: Login/Register with localStorage persistence
- **Tab-based Dashboard**: Dynamic content switching without page reloads

## 🎨 CSS Architecture

### globals.css
- CSS Custom Properties (design tokens)
- CSS Reset
- Typography system
- Spacing scale
- Color palette
- Utility classes
- Animation keyframes

### auth.css
- Login/Signup page layout
- Form styles
- Tab switching animation
- Responsive breakpoints

### dashboard.css
- Sidebar component
- Topbar component
- Main content area
- Data table styles
- Status badges
- Mobile overlay

## 🧩 JavaScript Components

### components.js

The `Components` object provides reusable UI injection:

```javascript
// Inject sidebar into a container
Components.injectSidebar('sidebarContainer', 'users');

// Inject topbar
Components.injectTopbar('topbarContainer', 'Dashboard');

// Check authentication
if (Components.isAuthenticated()) {
  // User is logged in
}

// Require auth (redirects if not authenticated)
Components.requireAuth();
```

### auth.js

Handles:
- Tab switching (Login ↔ Register)
- Form validation
- Password visibility toggle
- URL hash routing (#login, #register)
- localStorage session management

### dashboard.js

Handles:
- Authentication check
- Component initialization
- Tab state persistence

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Deploy (auto-detects static site via index.html)

The `vercel.json` provides:
- Clean URL rewrites (/login → /index.html)
- Security headers
- Asset caching

## 🛠️ Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| 2560px+ | Large monitors (4K) |
| 1024px | Tablet landscape |
| 768px | Tablet portrait |
| 480px | Mobile |

## 🔐 Authentication Flow

1. User visits `/` or `/login`
2. If already logged in → redirect to `/dashboard`
3. User submits login/register form
4. On success → store user in localStorage → redirect to dashboard
5. Dashboard checks auth → if not logged in → redirect to `/`
6. Logout clears localStorage → redirect to `/`

## 🎯 Design Tokens

All design values are centralized in CSS custom properties:

```css
:root {
  /* Colors */
  --primary-color: #FF6B00;
  --secondary-color: #1E3A5F;
  
  /* Spacing */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Typography */
  --font-size-md: 1rem;
  --font-weight-semibold: 600;
  
  /* Shadows */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Layout */
  --sidebar-width: 280px;
  --topbar-height: 70px;
}
```

## 📄 License

MIT License - feel free to use for your projects!
