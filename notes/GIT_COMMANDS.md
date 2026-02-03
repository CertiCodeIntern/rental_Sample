# 📋 Git Commands Reference Guide

> Quick reference for common Git operations used in this project.

**Purpose:** Provide easy access to essential Git commands for branch management, commits, and pushing to multiple remotes.

---

## 🌿 Branch Management

### View Branches
```bash
# List local branches
git branch

# List all branches (local + remote)
git branch -a

# Show current branch
git branch --show-current
```

### Create & Switch Branches
```bash
# Create a new branch
git branch <branch-name>

# Switch to a branch
git checkout <branch-name>

# Create and switch in one command
git checkout -b <branch-name>

# Example: Create and switch to feature branch
git checkout -b feature/add-notifications
```

### Delete Branches
```bash
# Delete local branch (safe - won't delete if unmerged)
git branch -d <branch-name>

# Force delete local branch
git branch -D <branch-name>

# Delete remote branch
git push origin --delete <branch-name>
```

---

## 📝 Staging & Committing

### Check Status
```bash
# Full status
git status

# Short status
git status --short

# View changes (diff)
git diff
```

### Stage Changes
```bash
# Stage specific file
git add <file-path>

# Stage all changes
git add -A

# Stage all changes in current directory
git add .

# Stage only modified files (not new files)
git add -u
```

### Commit Changes
```bash
# Commit with message
git commit -m "type(scope): subject"

# Commit with multi-line message
git commit -m "type(scope): subject

- Detail 1
- Detail 2"

# Amend last commit (change message or add files)
git commit --amend -m "new message"

# Amend without changing message
git commit --amend --no-edit
```

---

## 🔄 Merging Branches

### Merge into Current Branch
```bash
# First, switch to target branch (e.g., main)
git checkout main

# Merge source branch into current branch
git merge <source-branch>

# Merge with commit message
git merge <source-branch> -m "chore: merge <source-branch> into main"

# Example: Merge frontend into main
git checkout main
git merge frontend -m "chore: merge frontend branch into main"
```

### Abort Merge (if conflicts)
```bash
git merge --abort
```

---

## ⬆️ Pushing to Remotes

### This Project's Remotes
| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `https://github.com/CertiCodeIntern/rental_Sample.git` | Main repository |
| `vercel` | `https://github.com/Aki1104/ccintern_rentalsystem.git` | Vercel deployment |

### View Remotes
```bash
git remote -v
```

### Add Remote
```bash
git remote add <remote-name> <url>

# Example
git remote add vercel https://github.com/Aki1104/ccintern_rentalsystem.git
```

### Push to Remotes
```bash
# Push to origin
git push origin <branch-name>

# Push to vercel
git push vercel <branch-name>

# Push to both (run separately)
git push origin main
git push vercel main

# Force push (use with caution!)
git push origin <branch-name> --force
```

### Pull from Remotes
```bash
# Pull latest changes
git pull origin <branch-name>

# Pull with rebase (cleaner history)
git pull origin <branch-name> --rebase
```

---

## 📜 View History

### Log Commands
```bash
# View commit history
git log

# Compact one-line view
git log --oneline

# Show last N commits
git log -n 5

# Show last commit message
git log -1 --pretty=format:"%B"

# Visual branch graph
git log --oneline --graph --all
```

---

## 🔧 Common Workflows

### Workflow 1: Make Changes & Push
```bash
# 1. Make your code changes
# 2. Check what changed
git status

# 3. Stage all changes
git add -A

# 4. Commit with conventional format
git commit -m "feat(client): add notification system"

# 5. Push to origin
git push origin frontend

# 6. Push to vercel (if needed)
git push vercel frontend
```

### Workflow 2: Merge Feature Branch to Main
```bash
# 1. Switch to main
git checkout main

# 2. Pull latest main (just in case)
git pull origin main

# 3. Merge feature branch
git merge frontend -m "chore: merge frontend into main"

# 4. Push to origin
git push origin main

# 5. Push to vercel
git push vercel main
```

### Workflow 3: Sync Both Remotes
```bash
# After committing to main
git push origin main
git push vercel main

# After committing to frontend
git push origin frontend
git push vercel frontend
```

### Workflow 4: Update Frontend from Main
```bash
# Switch to frontend
git checkout frontend

# Merge main into frontend
git merge main

# Push updated frontend
git push origin frontend
```

---

## ⚠️ Troubleshooting

### Push Rejected Error
```bash
# If push is rejected, pull first then push
git pull origin <branch-name> --rebase
git push origin <branch-name>
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Discard Uncommitted Changes
```bash
# Discard changes in specific file
git checkout -- <file-path>

# Discard all changes
git checkout -- .
```

### Stash Changes (Save for Later)
```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply and keep stash
git stash apply
```

---

## 📌 Quick Reference Cheatsheet

| Task | Command |
|------|---------|
| Check current branch | `git branch --show-current` |
| Switch branch | `git checkout <branch>` |
| Create & switch | `git checkout -b <branch>` |
| Stage all | `git add -A` |
| Commit | `git commit -m "message"` |
| Push origin | `git push origin <branch>` |
| Push vercel | `git push vercel <branch>` |
| Merge to main | `git checkout main && git merge <branch>` |
| Pull latest | `git pull origin <branch>` |
| View log | `git log --oneline` |
| Check status | `git status --short` |

---

*Last Updated: February 2, 2026*
