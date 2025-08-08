# GitHub Workflows Guide

This repository includes three main GitHub workflows for building and deploying your application:

## 🚀 Main Workflows

### 1. Build and Deploy (`deploy-and-build.yml`)
**Triggers:** Push to main, manual trigger, pull requests

**What it does:**
- ✅ Builds the project for production
- ✅ Runs linting
- ✅ Deploys to GitHub Pages automatically
- ✅ Creates cPanel deployment package
- ✅ Tests pull requests

**GitHub Pages URL:** `https://yourusername.github.io/ethiopian-opportunities-hub/`

### 2. Create Release (`release.yml`)
**Triggers:** Version tags (v1.0.0), manual trigger

**What it does:**
- ✅ Creates downloadable deployment packages
- ✅ Generates release notes
- ✅ Deploys to GitHub Pages
- ✅ Creates GitHub release with files

**Usage:**
```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

### 3. Preview Deployment (`preview.yml`)
**Triggers:** Pull requests

**What it does:**
- ✅ Creates preview deployments
- ✅ Comments on PR with preview URL
- ✅ Allows testing changes before merge

## 📦 Deployment Packages

### GitHub Pages Package
- **File:** `github-pages-v1.0.0.zip`
- **Use:** GitHub Pages deployment
- **Auto-deploys:** Yes

### cPanel Package
- **File:** `cpanel-hosting-v1.0.0.zip`
- **Use:** Upload to cPanel hosting
- **Contains:** All files + .htaccess

## 🔧 Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository Settings
2. Click Pages in sidebar
3. Source: Deploy from a branch
4. Branch: `gh-pages` or `main`
5. Click Save

### 2. Setup Secrets (Optional for preview)
For preview deployments, add these secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### 3. Repository Settings
Enable these permissions in Settings > Actions:
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

## 🚦 Workflow Status

You can monitor workflows in the "Actions" tab of your repository.

### Common Commands

```bash
# Deploy to production (auto-triggers on push)
git push origin main

# Create a release
git tag v1.0.0
git push origin v1.0.0

# Manual trigger (via GitHub UI)
# Go to Actions > Select workflow > Run workflow
```

## 📋 File Structure

```
.github/
├── workflows/
│   ├── deploy-and-build.yml    # Main deployment
│   ├── release.yml             # Release creation
│   └── preview.yml             # PR previews
└── WORKFLOW_GUIDE.md           # This guide
```

## 🛠️ Customization

### Change Base Path
Edit `vite.config.ts`:
```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### Add Environment Variables
Add to workflow files under `env:` section:
```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_APP_NAME: "Your App Name"
```

### Custom Build Commands
Modify in workflow files:
```yaml
- name: Build project
  run: npm run build:custom
```

## 🔍 Troubleshooting

### Build Failures
1. Check Actions tab for error logs
2. Verify all dependencies are in package.json
3. Ensure environment variables are set

### GitHub Pages Not Working
1. Enable GitHub Pages in repository settings
2. Check if gh-pages branch exists
3. Verify workflow permissions

### cPanel Package Issues
1. Download from Releases page
2. Extract all contents to public_html
3. Ensure .htaccess file is included

---

Generated for: Ethiopian Opportunities Hub
Last updated: ${new Date().toISOString()}