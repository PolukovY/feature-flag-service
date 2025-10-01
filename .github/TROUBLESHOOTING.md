# GitHub Actions Troubleshooting Guide

## Common Build Errors

### 1. Rollup Module Not Found Error

**Error Message:**
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

**Cause:**
This is a known npm bug with optional dependencies ([npm/cli#4828](https://github.com/npm/cli/issues/4828)). It occurs when package-lock.json was created on a different platform (macOS/Windows) and is being used on Linux (GitHub Actions).

**Solution:**
✅ **Already Fixed** - The workflow now does a clean install:
```yaml
- name: Clean install dependencies
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

This removes the lock file and node_modules before installing, ensuring platform-specific dependencies are correctly installed.

---

### 2. Package Lock Sync Error

**Error Message:**
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

**Cause:**
Dependencies were updated locally without updating package-lock.json, or the lock file is out of sync.

**Solution:**
✅ **Already Fixed** - The workflow uses `npm install` instead of `npm ci`:
```yaml
- name: Install dependencies
  run: npm install
```

**Alternative Solution (if you prefer npm ci):**
Before committing, run:
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

---

### 3. Node Version Mismatch

**Error Message:**
```
You are using Node.js 18.x. Vite requires Node.js version 20.19+
```

**Cause:**
GitHub Actions is using Node.js 18 or the workflow configuration is incorrect.

**Solution:**
✅ **Already Fixed** - The workflow uses Node.js 20:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

---

### 4. Permission Denied for GitHub Pages

**Error Message:**
```
Error: Resource not accessible by integration
```

**Cause:**
The workflow doesn't have permission to deploy to GitHub Pages.

**Solution:**
✅ **Already Fixed** - The workflow has correct permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Additional Steps Required:**
1. Go to repository Settings → Pages
2. Set Source to **"GitHub Actions"** (not "Deploy from a branch")
3. Save settings

---

### 5. Build Succeeds but Site Shows 404

**Possible Causes:**
1. Wrong base path in vite.config.ts
2. GitHub Pages not enabled
3. Deployment hasn't finished yet

**Solution:**

**A. Check Base Path**
In `vite.config.ts`, ensure base path matches your repository name:
```typescript
// For username.github.io/repo-name:
export default defineConfig({
  base: '/repo-name/',  // Must match your repo name
})

// For custom domain or username.github.io:
export default defineConfig({
  base: '/',
})
```

**B. Verify GitHub Pages Settings**
1. Go to Settings → Pages
2. Verify Source is "GitHub Actions"
3. Check that deployment is complete (Actions tab)

**C. Wait for Deployment**
- First deployment can take 2-5 minutes
- Check Actions tab for deployment status
- Green checkmark = successful deployment

---

### 6. TypeScript Compilation Errors

**Error Message:**
```
error TS2307: Cannot find module '@/...' or its corresponding type declarations
```

**Cause:**
Path aliases not configured correctly or @types/node not installed.

**Solution:**
✅ **Already Fixed** - The project has:
1. `@types/node` in devDependencies
2. Path aliases in tsconfig.app.json:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
3. Path aliases in vite.config.ts:
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

---

### 7. Workflow Not Running

**Symptoms:**
- Push to main, but no workflow appears in Actions tab

**Possible Causes:**
1. Workflow file in wrong location
2. Syntax error in workflow YAML
3. Actions disabled for repository

**Solution:**

**A. Verify File Location**
Workflow must be at: `.github/workflows/deploy.yml`

**B. Check YAML Syntax**
Use a YAML validator or GitHub's workflow editor to check for syntax errors.

**C. Enable Actions**
1. Go to Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save settings

---

### 8. Deployment Stuck or Pending

**Symptoms:**
- Build succeeds but deployment job is pending/waiting

**Possible Causes:**
1. GitHub Pages environment needs approval
2. Concurrent deployments
3. GitHub status issues

**Solution:**

**A. Check Environment Protection Rules**
1. Go to Settings → Environments → github-pages
2. Remove any required reviewers (for automatic deployment)
3. Or approve the deployment manually

**B. Cancel Concurrent Deployments**
The workflow has concurrency control:
```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

Change to `true` if you want to cancel in-progress deployments:
```yaml
cancel-in-progress: true
```

---

## Debugging Workflow Issues

### Enable Debug Logging

Add secrets to your repository for verbose logging:

1. Go to Settings → Secrets and variables → Actions
2. Add repository secret:
   - Name: `ACTIONS_STEP_DEBUG`
   - Value: `true`
3. Re-run workflow to see detailed logs

### Manual Workflow Dispatch

Test the workflow manually:

1. Go to Actions tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch and run

### Check Workflow Logs

1. Go to Actions tab
2. Click on the failed workflow run
3. Click on the job that failed
4. Expand the failed step to see detailed error

---

## Testing Locally

### Build Locally

Test the build before pushing:

```bash
# Clean install
rm -rf node_modules package-lock.json dist
npm install

# Build
npm run build

# Verify dist folder
ls -la dist/

# Preview
npm run preview
```

### Test Production Build

```bash
# Install serve globally
npm install -g serve

# Serve the dist folder
serve -s dist

# Or use Vite preview
npm run preview
```

---

## Getting Help

If you encounter an issue not covered here:

1. **Check Workflow Logs**: Actions tab → Failed run → Job details
2. **Check Build Output**: Look for specific error messages
3. **Verify Configuration**: Double-check all configuration files
4. **Test Locally**: Run `npm run build` locally to isolate the issue
5. **GitHub Status**: Check https://www.githubstatus.com/ for service issues

---

## Quick Fix Checklist

When deployment fails, try these in order:

- [ ] Check Actions tab for error message
- [ ] Verify GitHub Pages is enabled (Settings → Pages)
- [ ] Verify Source is "GitHub Actions" (not "Deploy from a branch")
- [ ] Check base path in vite.config.ts matches repository name
- [ ] Ensure all required files are committed and pushed
- [ ] Wait 2-5 minutes for initial deployment
- [ ] Check GitHub status page for service issues
- [ ] Try manual workflow dispatch from Actions tab

---

## Successful Deployment Indicators

You know deployment succeeded when:

✅ Workflow shows green checkmark in Actions tab
✅ Both "build" and "deploy" jobs completed successfully
✅ Site is accessible at GitHub Pages URL
✅ No 404 errors when navigating
✅ All assets (CSS, JS, images) load correctly
✅ No console errors in browser developer tools

---

## Workflow Configuration Reference

Current workflow configuration:

- **Trigger**: Push to main branch, manual dispatch
- **Node Version**: 20
- **Install Method**: Clean install (removes lock file)
- **Build Command**: `npm run build`
- **Deploy Location**: `./dist` folder
- **Permissions**: Read contents, write pages, write id-token

This configuration should work out of the box for most scenarios.
