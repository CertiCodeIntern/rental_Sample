# 🎤 RentIT - Videoke Rental Management System

A modern rental management platform built with pure HTML5, CSS3, and Vanilla JavaScript.

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **Zero Dependencies** - No npm, no bundlers, no frameworks
- **Instant Deploy** - Just push to Vercel
- **Client & Admin** - Separate sections for customers and staff
- **Responsive Design** - Works on all devices
- **Reusable Components** - JS-injected UI elements
- **Well Documented** - Comprehensive docs for developers

---

## 📁 Project Structure

```
rental_Sample/
├── 📄 index.html           # Landing page (entry point)
├── 📄 wip.html             # Work in Progress page
├── 📄 vercel.json          # Vercel configuration
│
├── 📁 client/              # Customer-facing app
│   ├── 📁 auth/            # Login/Register
│   └── 📁 dashboard/       # Client dashboard
│
├── 📁 admin/               # Staff/Admin app
│   ├── 📁 auth/            # Admin login
│   └── 📁 dashboard/       # Admin dashboard
│
├── 📁 shared/              # Shared resources
│   ├── 📁 css/             # Global styles
│   └── 📁 js/              # Shared components
│
├── 📁 assets/              # Static files
│   ├── 📁 images/
│   └── 📁 icons/
│
├── 📁 docs/                # Documentation
│   ├── CHANGELOG.md        # Version history
│   ├── ARCHITECTURE.md     # Folder guide
│   └── 📁 logs/            # Dev logs
│
├── 📁 notes/               # Dev notes
└── 📁 reference/           # Reference materials
```

> 📖 See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed structure

---

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone [your-repo-url]
cd rental_Sample

# Start a local server (Python)
python -m http.server 3000

# Or use VS Code Live Server extension
```

Visit `http://localhost:3000`

### Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel Dashboard
3. Deploy (auto-detects `index.html`)

---

## 🔗 Routes

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/login` | Client login |
| `/signup` | Client registration |
| `/dashboard` | Client dashboard |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |

---

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript** - ES6+, no frameworks
- **Vercel** - Hosting and deployment

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG](docs/CHANGELOG.md) | Version history |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Folder structure |
| [Development Logs](docs/logs/) | Problem/solution logs |

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Update documentation
4. Submit a pull request

### 📋 Commit Convention

We follow **Conventional Commits** with semantic versioning for clear, trackable development.

#### Format
```
<type>(<scope>): <subject> [ticket-id]

<body>

<footer>
```

#### Type
- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - CSS/formatting changes (no logic)
- **refactor** - Code restructure (no feature/fix)
- **perf** - Performance improvements
- **test** - Test additions/updates
- **chore** - Build scripts, deps, config

#### Scope
Specify the area affected: `client`, `admin`, `auth`, `dashboard`, `shared`, `api`, `docs`

#### Subject
- Use **imperative mood** ("add" not "added")
- Start with **lowercase**
- No period at end
- Keep under **50 characters**

#### Body (Optional)
- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate multiple points with blank lines

#### Footer (Optional)
- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: ...`

#### Examples
```
feat(admin-auth): add session-based authentication [ADMIN-001]

Implement 8-hour session duration with localStorage/sessionStorage.
Added demo accounts (admin1/admin1, manager/manager123) for testing.
Session automatically expires and redirects to login.

Closes #45
```

```
fix(client-auth): prevent auto-login on admin page redirect

User was being automatically logged in when navigating to admin login.
Removed redirectIfAuthenticated check from LoginUI.init().

Closes #52
```

```
docs: add commit convention guidelines to README
```

```
perf(dashboard): optimize theme toggle performance

Reduced theme switch latency by caching theme value.
Impact: Instant visual feedback on light/dark toggle.
```

📖 **[Full Guidelines →](notes/COMMIT_GUIDELINES.md)** for extended examples and best practices

---

## 📝 License

MIT License - see LICENSE file

---

## 👥 Contributors

- **Marc | FrontEnd** - Initial development

---

*Last Updated: January 29, 2026 | Version 0.2.0*
