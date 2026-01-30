# 🌳 Git Branch Guide for Beginners

> **Date Created:** January 30, 2026  
> **Purpose:** Understanding Git branches for the rental_Sample project

---

## 📚 What is a Branch?

Think of branches like **photocopies** of your project:
- **main** = The original, perfect version everyone uses
- **feature branches** = Your experimental copies where you try new things

### Why Use Branches?
| Without Branches 😰 | With Branches 😊 |
|---------------------|------------------|
| Everyone edits the same files | Each person has their own copy |
| One mistake breaks everything | Mistakes stay in your branch only |
| Scary to try new things | Safe to experiment! |
| Hard to undo changes | Easy to throw away bad changes |

---

## 🌲 Our Project Branches

| Branch | Purpose | Who Uses It |
|--------|---------|-------------|
| `main` | Production-ready code | Everyone (final version) |
| `frontend` | Frontend development work | Frontend developers |

---

## 🛠️ Common Git Branch Commands

### 1️⃣ See All Branches
```bash
git branch
```
The one with `*` is your current branch!

### 2️⃣ Create a New Branch
```bash
git checkout -b branch-name
```
Example: `git checkout -b frontend`

### 3️⃣ Switch Between Branches
```bash
git checkout branch-name
```
Example: `git checkout main` or `git checkout frontend`

### 4️⃣ Push Your Branch to GitHub
```bash
git push -u origin branch-name
```
Example: `git push -u origin frontend`

---

## 🔀 How to Merge Branches

### Option A: Merge via Command Line
```bash
# 1. First, switch to main
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Merge your branch into main
git merge frontend

# 4. Push the merged changes
git push origin main
```

### Option B: Merge via GitHub Pull Request (Recommended! ✅)
1. Push your branch: `git push -u origin frontend`
2. Go to GitHub → Your Repository
3. Click **"Compare & pull request"** button
4. Write a description of your changes
5. Click **"Create pull request"**
6. Review the changes
7. Click **"Merge pull request"**
8. Delete the branch if done

---

## 📋 Our Workflow

```
     ┌─────────────────────────────────────────┐
     │              MAIN BRANCH                │
     │     (Always working & stable)           │
     └──────────────────┬──────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
    ┌──────────┐               ┌──────────┐
    │ frontend │               │  other   │
    │  branch  │               │ branches │
    └────┬─────┘               └────┬─────┘
         │                          │
         │  Work on                 │  Work on
         │  UI/CSS/HTML             │  other features
         │                          │
         ▼                          ▼
    ┌──────────────────────────────────────────┐
    │          MERGE BACK TO MAIN              │
    │     (When feature is complete)           │
    └──────────────────────────────────────────┘
```

---

## ⚠️ Important Rules

1. **Never commit directly to main** - Always use a branch!
2. **Pull before you push** - Get the latest changes first
3. **Write good commit messages** - See `COMMIT_GUIDELINES.md`
4. **Test before merging** - Make sure your code works!

---

## 🆘 Common Problems & Solutions

### Problem: "I'm on the wrong branch!"
```bash
# Save your changes first
git stash

# Switch to correct branch
git checkout correct-branch

# Get your changes back
git stash pop
```

### Problem: "I need to update my branch with main"
```bash
# While on your feature branch
git checkout frontend
git pull origin main
```

### Problem: "Merge conflict!"
1. Open the file with conflict
2. Look for `<<<<<<<`, `=======`, `>>>>>>>`
3. Choose which code to keep
4. Remove the conflict markers
5. Save and commit

---

## 📝 Quick Reference Card

| Action | Command |
|--------|---------|
| See current branch | `git branch` |
| Create & switch to new branch | `git checkout -b name` |
| Switch to existing branch | `git checkout name` |
| Push branch to GitHub | `git push -u origin name` |
| Merge branch into main | `git checkout main` → `git merge name` |
| Delete local branch | `git branch -d name` |
| Delete remote branch | `git push origin --delete name` |

---

## 🎯 Current Status

**You are now on the `frontend` branch!** 🎉

### Recent Changes (January 30, 2026):
- ✅ Updated `client/dashboard/index.html` - New dashboard layout with KPI cards, bookings table, delivery schedule
- ✅ Updated `client/dashboard/dashboard.css` - Complete new styling with dark theme
- ✅ Updated `client/dashboard/dashboard.js` - Mobile drawer toggle functionality
- ✅ Updated `pages/about.html` - New hero section, values cards, terms accordion
- ✅ Updated `pages/pages.css` - New about page styles with accordion

### To commit these changes:
```bash
git add .
git commit -m "feat(frontend): update dashboard and about page with new design"
git push -u origin frontend
```

---

*Last Updated: January 30, 2026*
