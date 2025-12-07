# GitHub Pages Deployment Guide

This guide will help you deploy your romantic website to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your project already initialized as a git repository

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `romantic-gallery` or `gokhan-saving-the-day`)
5. Choose **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

Run these commands in your terminal (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
# Check if you already have a remote
git remote -v

# If no remote exists, add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if you already have a remote, update it
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 3: Push Your Code to GitHub

```bash
# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Romantic gallery website"

# Push to GitHub
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Save the settings

## Step 5: Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your project when you push to `main` branch
- Deploy it to GitHub Pages
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Step 6: Access Your Website

After the first deployment (usually takes 1-2 minutes):
- Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- The URL will be shown in your repository's Settings > Pages section

## Updating Your Website

Whenever you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

The website will automatically rebuild and redeploy!

## Troubleshooting

- **Build fails?** Check the Actions tab in your GitHub repository for error messages
- **Site not loading?** Wait a few minutes for the first deployment to complete
- **404 errors?** Make sure the base path in `vite.config.js` matches your repository name

## Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with your custom domain

Enjoy your romantic website! 💕

