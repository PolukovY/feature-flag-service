# Quick Start Guide

## Development

✅ **Already configured for polukovy/feature-flag-service**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**

   **Option A - Node.js 20+:**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

   **Option B - Node.js 18 (workaround):**
   ```bash
   npm run build && npm run preview
   # Open http://localhost:4173
   ```

3. **Configuration** (already set in `src/App.tsx`):
   ```typescript
   const GITHUB_REPO_OWNER = "polukovy"
   const GITHUB_REPO_NAME = "feature-flag-service"
   ```

## Deploy to GitHub Pages

### One-Time Setup

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository** and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

4. **Base path** (already configured):
   - ✅ Uses `/` for local development
   - ✅ Uses `/feature-flag-service/` for production builds
   - No changes needed for polukovy/feature-flag-service

   (See `vite.config.ts` for the auto-switching logic)

5. **Push to trigger deployment:**
   ```bash
   git push
   ```

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Managing Flags

### View Flags
- Switch environments: dev / uat / prod
- Search flags by name or description
- Filter: All / Enabled / Disabled / Has Context / No Context
- Sort by name, value, or description

### Add New Flag
1. Click "New Flag" button
2. Copy the JSON template
3. Click "Open in GitHub"
4. Edit the flags file and paste your flag
5. Create pull request
6. Merge after review

### Flag Structure
```json
{
  "featureName": "my_feature",
  "featureValue": true,
  "featureDescription": "My new feature",
  "featureContext": [
    {
      "type": "equals",
      "field_name": "domain",
      "field_value": "example.com"
    }
  ]
}
```

## Using Evaluation Helpers

```typescript
import { evaluateFlag, evaluateAll } from '@/lib/evaluateFlags'
import type { FeatureFlag } from '@/types/flags'

const flag: FeatureFlag = {
  featureName: "beta_feature",
  featureValue: true,
  featureContext: [
    {
      type: "start_with",
      field_name: "email",
      field_value: "test"
    }
  ]
}

// Evaluate single flag
const isEnabled = evaluateFlag(flag, { email: "test@example.com" })
console.log(isEnabled) // true

// Evaluate all flags
const allResults = evaluateAll(flags, { email: "user@example.com" })
```

## Tips

- **Dark mode**: Click moon/sun icon in top bar
- **View JSON**: Click "Open JSON" to see raw flag file
- **Keyboard navigation**: All interactive elements support keyboard access
- **Environment persistence**: Selected environment is saved to localStorage

## Troubleshooting

**Build fails with Node.js version error:**
- Note: Vite 7 requires Node.js 20+, but the project will build successfully despite the warning

**Can't see flags:**
- Verify JSON files exist in `public/flags/`
- Check browser console for errors
- Ensure JSON is valid

**GitHub PR flow not working:**
- Update `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` in `src/App.tsx`
- Verify repository is public or you have access
