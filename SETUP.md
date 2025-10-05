# Quick Setup Guide

## Step 1: Configure the Dashboard

Edit `docs/config.js`:

```javascript
const CONFIG = {
    GITHUB_REPO: 'YOUR_ORG/YOUR_REPO', // e.g., 'ISEngineering/eng.team.dashboard'
    GITHUB_TOKEN: '',                  // Optional: add for private repos
};
```

## Step 2: Set Up Labels

Make sure your GitHub issues use these labels (or customize in config.js):

- `project`, `feature`, `epic` → Tracked as **Projects**
- `bau`, `support`, `maintenance` → Tracked as **BAU Support**
- `bug`, `defect` → Tracked as **Bugs**
- `enhancement`, `improvement` → Tracked as **Enhancements**

## Step 3: Enable GitHub Pages

1. Go to Repository **Settings**
2. Click **Pages** in sidebar
3. Set Source to: **Deploy from a branch**
4. Branch: `main`, Folder: `/docs`
5. Click **Save**

🎉 Your dashboard will be live at: `https://YOUR_ORG.github.io/YOUR_REPO/`

## Step 4: Start Using

1. Create issues with assignees
2. Add appropriate labels
3. Visit your dashboard
4. Click refresh to see updates

## Optional: Add GitHub Token

For private repos or higher rate limits:

1. Visit <https://github.com/settings/tokens>
2. Generate new token (classic)
3. Add `repo` or `public_repo` scope
4. Copy token to `docs/config.js`

**⚠️ Warning**: Don't commit tokens to public repos!

## Testing Locally

```bash
cd docs
python3 -m http.server 8000
```

Then visit: <http://localhost:8000>
