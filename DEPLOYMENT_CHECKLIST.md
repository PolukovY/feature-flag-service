# Deployment Checklist

Use this checklist to deploy your Feature Flag Viewer to GitHub Pages.

## Pre-Deployment Setup

### 1. Configure Repository Settings

- [ ] Update `GITHUB_REPO_OWNER` in `src/App.tsx` (line 11)
- [ ] Update `GITHUB_REPO_NAME` in `src/App.tsx` (line 12)

```typescript
// src/App.tsx
const GITHUB_REPO_OWNER = "your-github-username"  // ← Change this
const GITHUB_REPO_NAME = "your-repo-name"         // ← Change this
```

### 2. Configure Vite Base Path (if using subdirectory)

If deploying to `username.github.io/repo-name`:

- [ ] Update `base` in `vite.config.ts` (line 13)

```typescript
// vite.config.ts
export default defineConfig({
  base: '/your-repo-name/',  // ← Change this to match your repo name
  // ...
})
```

If deploying to custom domain or root:
- [ ] Keep `base: '/'` as is

### 3. Customize Flag Data (Optional)

- [ ] Update `public/flags/dev.json` with your dev flags
- [ ] Update `public/flags/uat.json` with your uat flags
- [ ] Update `public/flags/prod.json` with your prod flags

### 4. Test Build Locally

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` to verify build succeeds
- [ ] Check `dist/` folder is created with files
- [ ] (Optional) Run `npm run preview` to test the production build

## GitHub Setup

### 5. Create GitHub Repository

- [ ] Create a new repository on GitHub
- [ ] Copy the repository URL

### 6. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Feature Flag Viewer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

- [ ] All files committed to Git
- [ ] Pushed to GitHub main branch

### 7. Enable GitHub Pages

1. [ ] Go to your repository on GitHub
2. [ ] Click **Settings** tab
3. [ ] Click **Pages** in the left sidebar
4. [ ] Under **Source**, select **"GitHub Actions"**
5. [ ] Save the settings

### 8. Verify Workflow

- [ ] Go to **Actions** tab in your repository
- [ ] Verify the "Deploy to GitHub Pages" workflow is running
- [ ] Wait for the workflow to complete (green checkmark)
- [ ] Check for any errors in the workflow logs

### 9. Access Your Site

- [ ] Visit `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- [ ] Verify the site loads correctly
- [ ] Test environment switching (dev, uat, prod)
- [ ] Test search functionality
- [ ] Test theme toggle (light/dark)
- [ ] Test "New Flag" modal
- [ ] Test "Open JSON" button

## Post-Deployment

### 10. Update README (Optional)

- [ ] Add your live site URL to README.md
- [ ] Add screenshot or demo GIF
- [ ] Commit and push changes

### 11. Configure Custom Domain (Optional)

If using a custom domain:

1. [ ] Add CNAME file to `public/` folder
2. [ ] Add custom domain in repository Settings → Pages
3. [ ] Update DNS records with your domain provider
4. [ ] Update `base` in `vite.config.ts` to `'/'`

## Ongoing Maintenance

### Adding New Flags

1. [ ] Create a new branch
2. [ ] Edit the appropriate `public/flags/<env>.json` file
3. [ ] Commit changes
4. [ ] Push and create Pull Request
5. [ ] Review and merge PR
6. [ ] GitHub Actions will automatically redeploy

### Updating the Application

- [ ] Make code changes
- [ ] Test locally with `npm run build`
- [ ] Commit and push to main branch
- [ ] GitHub Actions will automatically redeploy
- [ ] Verify deployment at your site URL

## Troubleshooting

### Build fails in GitHub Actions

**Error: "Cannot find module @rollup/rollup-linux-x64-gnu"**
- ✅ Fixed: Workflow removes node_modules and package-lock.json before installing
- This is a known npm bug with optional dependencies
- The workflow now does a clean install on every build

**Error: "npm ci can only install packages when..."**
- ✅ Fixed: Workflow uses `npm install` instead of `npm ci`
- Ensure `package-lock.json` is committed to repository

**Error: "Node.js version"**
- ✅ GitHub Actions uses Node.js 20
- Ignore local Node.js warnings if using older version

**Error: "Failed to load flags"**
- Verify JSON files exist in `public/flags/`
- Check JSON syntax is valid
- Ensure file names match: `dev.json`, `uat.json`, `prod.json`

### Site loads but features don't work

**"New Flag" button opens wrong GitHub URL**
- Update `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` in `src/App.tsx`
- Rebuild and redeploy

**404 errors on navigation**
- Verify `base` path in `vite.config.ts` matches repository name
- Rebuild and redeploy

**Flags not loading**
- Check browser console for errors
- Verify JSON files are in `public/flags/` directory
- Check Network tab to see if files are being fetched correctly

### GitHub Pages not enabled

- Ensure you selected "GitHub Actions" as source (not "Deploy from a branch")
- Check repository Settings → Pages
- Verify workflow has "pages: write" permission (already configured)

## Security Notes

- [ ] Repository can be public or private
- [ ] GitHub Pages sites from private repos require GitHub Pro/Team/Enterprise
- [ ] Flag data is publicly accessible once deployed
- [ ] Do not store sensitive data in flag files
- [ ] Use environment variables for sensitive configuration if needed

## Performance Optimization (Optional)

- [ ] Enable Cloudflare or CDN in front of GitHub Pages
- [ ] Add cache headers for JSON files
- [ ] Compress flag files if they become large
- [ ] Consider code splitting for large applications

## Success Criteria

Your deployment is successful when:

- ✅ Site is accessible at GitHub Pages URL
- ✅ All three environments (dev/uat/prod) load
- ✅ Search and filters work correctly
- ✅ Theme toggle persists preference
- ✅ "New Flag" modal opens with correct GitHub URL
- ✅ "Open JSON" button opens correct files
- ✅ No console errors in browser
- ✅ Mobile-responsive layout works

---

## Quick Deploy Command Summary

```bash
# 1. Configure repository in src/App.tsx
# 2. Commit everything
git add .
git commit -m "Initial commit"

# 3. Create and push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages (Actions) in repository settings

# 5. Wait for deployment and visit:
# https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

That's it! 🚀
