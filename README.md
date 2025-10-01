# Feature Flag Viewer

A static, read-only feature flag management system styled after Flipt/LaunchDarkly, built with React + Vite + TypeScript and hosted on GitHub Pages.

## Features

- **Environment Switching**: Toggle between dev, uat, and prod environments
- **Read-Only Interface**: View-only mode with edits via GitHub PR workflow
- **Search & Filter**: Live search on flag names and descriptions
- **Pagination**: Display 25 flags per page with navigation
- **Context Rules**: Support for equals and start_with matching rules
- **Dark/Light Theme**: Toggle between themes with preference persistence
- **GitHub Integration**: Create new flags through GitHub's edit file flow
- **Client-Side Evaluation**: Helper functions to evaluate flags with context

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons
- **GitHub Pages** for hosting

## Getting Started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- npm or yarn

> **Note:** This project uses Vite 7 which requires Node.js 20.19+. If you're using an older version of Node.js, you'll need to upgrade to run the development server.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Install dependencies:
```bash
npm install
```

3. Configure your repository in `src/App.tsx`:
```typescript
const GITHUB_REPO_OWNER = "your-github-username"
const GITHUB_REPO_NAME = "your-repo-name"
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

### Initial Setup

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Set **Source** to "GitHub Actions"
4. Push to main branch - the workflow will automatically deploy

### Deployment Workflow

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Triggers on push to main branch
- Builds the project
- Deploys to GitHub Pages

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Base Path Configuration

If deploying to a subdirectory (e.g., `username.github.io/repo-name`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

## Managing Feature Flags

### JSON Structure

Flags are stored in `public/flags/<env>.json`:

```json
{
  "environment": "dev",
  "updatedAt": "2025-10-01T00:00:00Z",
  "flags": [
    {
      "featureName": "feature_name",
      "featureValue": true,
      "featureDescription": "Description of the feature",
      "featureContext": [
        {
          "type": "equals",
          "field_name": "domain",
          "field_value": "example.com"
        }
      ]
    }
  ]
}
```

### Context Rules

- **`equals`**: Exact string match
- **`start_with`**: Starts with match
- **Multiple rules**: All rules must pass (AND logic)

### Adding New Flags

1. Click "New Flag" button in the UI
2. Copy the flag template
3. Click "Open in GitHub" to edit the environment's JSON file
4. Paste and customize your flag
5. Create a pull request
6. Merge after review

## Client-Side Evaluation

Use the evaluation helpers in your application:

```typescript
import { evaluateFlag, evaluateAll } from '@/lib/evaluateFlags'

// Evaluate a single flag
const isEnabled = evaluateFlag(flag, { email: 'test@example.com' })

// Evaluate all flags
const allFlags = evaluateAll(flags, { domain: 'internal.company.com' })
```

## Project Structure

```
├── public/
│   └── flags/          # Environment flag files
│       ├── dev.json
│       ├── uat.json
│       └── prod.json
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── FlagsTable.tsx
│   │   └── NewFlagModal.tsx
│   ├── contexts/      # React contexts
│   │   └── ThemeContext.tsx
│   ├── lib/           # Utility functions
│   │   ├── utils.ts
│   │   └── evaluateFlags.ts
│   ├── types/         # TypeScript types
│   │   └── flags.ts
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions workflow
```

## Customization

### Theme Colors

Modify theme colors in `src/index.css` and `tailwind.config.js`.

### Items Per Page

Change pagination size in `src/components/FlagsTable.tsx`:

```typescript
const ITEMS_PER_PAGE = 25 // Change this value
```

### GitHub Repository

Update repository details in `src/App.tsx`:

```typescript
const GITHUB_REPO_OWNER = "your-username"
const GITHUB_REPO_NAME = "your-repo"
```

## Accessibility

- ARIA-friendly components
- Keyboard navigation support
- Focus rings for interactive elements
- Screen reader compatible

## Browser Support

- Modern browsers with ES2022 support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
