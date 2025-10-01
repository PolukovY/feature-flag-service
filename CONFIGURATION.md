# Configuration Guide

This document explains the configuration for **polukovy/feature-flag-service**.

## ✅ Current Configuration

### Repository Settings

**GitHub Repository** (configured in `src/App.tsx`):
```typescript
const GITHUB_REPO_OWNER = "polukovy"
const GITHUB_REPO_NAME = "feature-flag-service"
```

This enables the "New Flag" button to open the correct GitHub edit URL:
- `https://github.com/polukovy/feature-flag-service/edit/main/public/flags/{env}.json`

### Base Path (Smart Configuration)

**Configured in `vite.config.ts`** to work both locally and on GitHub Pages:

```typescript
export default defineConfig(({ command, mode }) => {
  // Automatically uses correct base path
  const base = command === 'build' && mode === 'production'
    ? '/feature-flag-service/'  // GitHub Pages
    : '/'                        // Local development

  return {
    base,
    // ... rest of config
  }
})
```

**How it works:**
- **Development** (`npm run dev` or `npm run preview`): Uses `/` for local testing
- **Production Build** (`npm run build`): Uses `/feature-flag-service/` for GitHub Pages
- **No manual switching needed** - it's automatic!

## 🚀 Deployment

### GitHub Pages URL
Your site will be available at:
**https://polukovy.github.io/feature-flag-service/**

### Prerequisites
- Repository: `polukovy/feature-flag-service`
- Branch: `main`
- GitHub Pages enabled with "GitHub Actions" as source

### Deployment Steps

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **GitHub Actions automatically:**
   - Installs dependencies (with clean install to fix npm bugs)
   - Builds with production base path `/feature-flag-service/`
   - Deploys to GitHub Pages

3. **Visit your site:**
   - https://polukovy.github.io/feature-flag-service/

## 💻 Local Development

### Option 1: Node.js 20+ (Recommended)

```bash
npm install
npm run dev
# Open http://localhost:5173
```

Features:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Instant updates

### Option 2: Node.js 18 (Workaround)

If you have Node.js 18 and cannot upgrade:

```bash
npm install
npm run build && npm run preview
# Open http://localhost:4173
```

Features:
- ✅ Works on Node.js 18
- ✅ Tests production build locally
- ⚠️ No HMR (must rebuild to see changes)

**Why this works:**
- `npm run dev` uses Vite dev server (requires Node 20+)
- `npm run build` compiles code (works on Node 18+)
- `npm run preview` serves the built files (works on Node 18+)

## 🔧 Configuration Files

### 1. GitHub Repository (`src/App.tsx`)

```typescript
// Lines 11-12
const GITHUB_REPO_OWNER = "polukovy"
const GITHUB_REPO_NAME = "feature-flag-service"
```

**Used for:**
- "New Flag" button GitHub edit URL
- Modal instructions

**To change:** Edit these two constants

### 2. Base Path (`vite.config.ts`)

```typescript
// Lines 8-10
const base = command === 'build' && mode === 'production'
  ? '/feature-flag-service/'  // ← Change this for different repo
  : '/'
```

**Used for:**
- Asset loading (JS, CSS, images)
- Routing
- Flag JSON file paths

**To change:** Update `/feature-flag-service/` to your repo name

### 3. Package Metadata (`package.json`)

```json
{
  "name": "feature-flag-viewer",
  "version": "1.0.0",
  "engines": {
    "node": ">=20.19.0"
  }
}
```

**Note:** This is advisory. The build works on Node 18 despite the warning.

## 🎯 Testing Configuration

### Test Local Development

```bash
# Clean install
rm -rf node_modules dist
npm install

# Test dev server (Node 20+)
npm run dev
# Visit http://localhost:5173

# OR test preview (Node 18+)
npm run build
npm run preview
# Visit http://localhost:4173
```

**Verify:**
- ✅ Site loads at root URL
- ✅ Environment switching works
- ✅ Flags load from `/flags/{env}.json`
- ✅ Search and filters work
- ✅ Theme toggle works

### Test Production Build

```bash
# Build
npm run build

# Check dist folder
ls -la dist/

# Verify base path in HTML
grep 'src=' dist/index.html
# Should show: /feature-flag-service/assets/...

# Test with preview
npm run preview
# Visit http://localhost:4173
```

**Verify:**
- ✅ Build succeeds without errors
- ✅ Assets use `/feature-flag-service/` prefix
- ✅ All features work in preview mode

## 🐛 Troubleshooting

### Dev Server Won't Start

**Error:** `crypto.hash is not a function`

**Cause:** Node.js 18 doesn't support Vite 7 dev server

**Solution:**
```bash
# Use build + preview instead
npm run build && npm run preview
```

### Assets Not Loading (404 errors)

**Cause:** Base path mismatch

**Check:**
1. View page source in browser
2. Look at `<script>` and `<link>` tags
3. Should see `/feature-flag-service/assets/...`

**Fix:** Ensure `vite.config.ts` has correct base path

### "New Flag" Opens Wrong URL

**Cause:** GitHub repo settings incorrect

**Fix:** Update `src/App.tsx` lines 11-12:
```typescript
const GITHUB_REPO_OWNER = "polukovy"
const GITHUB_REPO_NAME = "feature-flag-service"
```

### Build Works Locally But Fails in CI

**Cause:** npm optional dependencies bug

**Solution:** ✅ Already fixed in `.github/workflows/deploy.yml`

The workflow does a clean install:
```yaml
- name: Clean install dependencies
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

## 📊 Configuration Summary

| Setting | Value | Location |
|---------|-------|----------|
| GitHub Owner | `polukovy` | `src/App.tsx:11` |
| GitHub Repo | `feature-flag-service` | `src/App.tsx:12` |
| Local Base Path | `/` | `vite.config.ts:10` (auto) |
| Production Base Path | `/feature-flag-service/` | `vite.config.ts:9` (auto) |
| Site URL | `https://polukovy.github.io/feature-flag-service/` | GitHub Pages |
| Node Version (CI) | 20 | `.github/workflows/deploy.yml` |
| Node Version (Local) | 18+ (build), 20+ (dev) | Advisory |

## 🔄 Changing Configuration for a Different Repository

If you want to use this for a different repository:

1. **Update GitHub settings** in `src/App.tsx`:
   ```typescript
   const GITHUB_REPO_OWNER = "your-username"
   const GITHUB_REPO_NAME = "your-repo-name"
   ```

2. **Update base path** in `vite.config.ts` line 9:
   ```typescript
   const base = command === 'build' && mode === 'production'
     ? '/your-repo-name/'  // ← Change this
     : '/'
   ```

3. **Rebuild and deploy:**
   ```bash
   npm run build
   git add .
   git commit -m "Update configuration"
   git push origin main
   ```

4. **Enable GitHub Pages** for your repository:
   - Settings → Pages → Source: "GitHub Actions"

That's it! Your customized feature flag viewer is ready. 🚀
