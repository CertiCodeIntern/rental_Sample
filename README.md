# 🎤 CertiCode - Videoke Rental Management System

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

### Commit Convention

We follow **professional, corporate-style commit messages**:

```
<type>(<scope>): <subject>

- What: Brief description
- Why: Reason for change
- Impact: Files/systems affected
- Tests: What was tested
```

**Examples:**
```
feat(client): add user profile page
fix(auth): resolve login redirect issue
docs: update CHANGELOG for v0.2.0
perf(dashboard): optimize tab loading
style(landing): update hero gradient colors
```

📖 **[Read Full Commit Guidelines →](notes/COMMIT_GUIDELINES.md)** for detailed format and examples

---

## 📝 License

MIT License - see LICENSE file

---

## 👥 Contributors

- **Marc | FrontEnd** - Initial development

---

*Last Updated: January 29, 2026 | Version 0.2.0*
