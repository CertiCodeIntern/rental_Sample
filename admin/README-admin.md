# 🛡️ Admin Application

> Administrative pages and functionality for staff/managers.

## 📁 Structure

```
admin/
├── 📁 auth/          # Admin Authentication
└── 📁 dashboard/     # Admin Dashboard
```

## 🔗 URLs

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | `auth/login.html` | Admin login |
| `/admin/dashboard` | `dashboard.html` | Admin dashboard |

## 🎯 Purpose

This folder contains administrative functionality:
- Admin authentication (separate from client)
- User management (all users)
- Rental management
- Inventory management
- Payment processing
- Reports and analytics
- System settings

## ⚠️ Status

**🚧 Under Development**

This section is currently being built. Check back for updates.

## 📝 Planned Features

- [ ] Admin login page
- [ ] Admin dashboard
- [ ] User management CRUD
- [ ] Rental management CRUD
- [ ] Item/inventory management
- [ ] Payment processing
- [ ] Reports generation
- [ ] System settings

## 🔐 Security Notes

- Admin routes should have stricter authentication
- Implement role-based access control (RBAC)
- Consider IP whitelisting for production
- Add audit logging for admin actions

---

*See [/docs/ARCHITECTURE.md](/docs/ARCHITECTURE.md) for full project structure*
