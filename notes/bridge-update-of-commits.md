# Bridge Update of Commits

## Repository Links

| Repository | URL | Purpose |
|------------|-----|---------|
| **Personal (Vercel)** | https://github.com/Aki1104/ccintern_rentalsystem | Connected to Vercel deployment |
| **Organization** | https://github.com/CertiCodeIntern/rental_Sample.git | Team collaboration repo |

---

## The Repository Sync Challenge

When Vercel creates a deployment, it often duplicates (clones) your project into your personal GitHub account. This creates **two separate repositories**:

- **Personal Repo** (Connected to Vercel) - Your deployment source
- **Organization Repo** (CertiCodeIntern) - Where the team collaborates

Moving code between these repositories requires manual synchronization - you become the "bridge" between them.

---

## The "Bridge" Workflow

### Understanding the Remote Connections

Your local project needs to know about both repositories:

- **`origin`** - Your personal repository (Connected to Vercel)
- **`upstream`** - The Organization's repository (Where the team works)

### Step 1: Add the Organization as "Upstream"

Open your terminal in your project folder and connect to the organization's repo:

```bash
# Syntax: git remote add upstream [URL_OF_CERTICODE_REPO]
git remote add upstream https://github.com/CertiCodeIntern/rental_Sample.git
```

### Step 2: The Sync Routine

**Do this whenever you want to update your Vercel site with team changes:**

Run these three commands in order:

1. **Download the latest team code:**
   ```bash
   git pull upstream main
   ```
   *(Note: Use `master` instead of `main` if that's the organization's branch name)*

2. **Upload it to YOUR personal repo:**
   ```bash
   git push origin main
   ```

### What Just Happened?

1. `git pull upstream` grabbed the new commits from the CertiCode organization
2. `git push origin` sent those commits to your personal GitHub
3. Vercel sees the update on your personal GitHub and **automatically redeploys**

---

## Alternative: The "Sync Fork" Button (Easier Method)

### If Your Repo is a Proper Fork:

1. Go to your **Personal Repository** on the GitHub website (the one Vercel created)
2. Look at the top of the page
3. If you see: **"Forked from CertiCodeIntern/rental_Sample"**
   - You will see a **"Sync fork"** button
   - Click that button, then click **"Update branch"**
   - This does the work instantly without commands!

### If Your Repo is NOT a Fork:

- If you **DO NOT** see "Forked from..." text
- Then Vercel created a "detached" copy
- You **MUST** use the Command Line method (Steps 1 & 2 above)

---

## Quick Reference Commands

```bash
# One-time setup
git remote add upstream https://github.com/CertiCodeIntern/rental_Sample.git

# Regular sync routine (run whenever team updates code)
git pull upstream main
git push origin main

# Check your remotes
git remote -v
```

---

## Workflow Summary

1. **Team pushes to CertiCodeIntern** → Organization repo gets updated
2. **You run sync commands** → Your local gets team changes  
3. **You push to your personal repo** → Vercel sees changes
4. **Vercel auto-deploys** → Your site updates with team's code

This way, your deployed site stays in sync with the team's latest work!

---

## Troubleshooting

### Check Your Remotes
```bash
git remote -v
```

Should show:
```
origin    https://github.com/YourUsername/rental_Sample.git (fetch)
origin    https://github.com/YourUsername/rental_Sample.git (push)
upstream  https://github.com/CertiCodeIntern/rental_Sample.git (fetch)
upstream  https://github.com/CertiCodeIntern/rental_Sample.git (push)
```

### If Branch Names Don't Match
- Organization uses `master`: `git pull upstream master`
- Organization uses `main`: `git pull upstream main`
- Check with: `git branch -r` to see remote branches

### Common Issues
- **Permission denied**: Make sure you have access to both repositories
- **Merge conflicts**: Resolve conflicts before pushing to origin
- **Branch mismatch**: Ensure you're on the correct branch locally

---

*Created: January 26, 2026*  
*Project: Rental Sample - CertiCode Internship*