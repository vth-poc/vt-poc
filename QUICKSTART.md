# 🚀 Quick Setup Guide - Secure Dashboard with GitHub Actions

Your dashboard now uses **GitHub Actions to fetch issues securely**. No tokens needed in the browser!

## How It Works

1. **GitHub Actions runs every 30 minutes** (or when you push to main)
2. **Fetches all issues** from your repository using the built-in `GITHUB_TOKEN`
3. **Saves data** to `docs/data/issues.json` (static file)
4. **Deploys to GitHub Pages** with the updated data
5. **Dashboard reads** from the static JSON file (no API calls, no tokens exposed!)

## Setup Steps

### Step 1: Enable GitHub Pages

1. Go to your repository **Settings**
2. Click **Pages** in the left sidebar
3. Under "Build and deployment":
   - Source: **GitHub Actions** (not "Deploy from a branch")
4. Save (if there's a save button)

### Step 2: Run the Workflow Manually (First Time)

Since the workflow runs every 30 minutes, let's trigger it manually for the first time:

1. Go to the **Actions** tab in your repository
2. Click on "Fetch Issues and Deploy Dashboard" workflow
3. Click **Run workflow** button
4. Select branch: `main`
5. Click **Run workflow**

Wait 1-2 minutes for the workflow to complete.

### Step 3: Access Your Dashboard

Your dashboard will be available at:

```
https://vth-poc.github.io/vt-poc/
```

Or check the Actions run output for the exact URL.

### Step 4: Create Some Issues (If You Haven't Already)

1. Go to your repository **Issues** tab
2. Click **New issue**
3. Use the issue templates (Project, BAU, Bug)
4. Make sure to:
   - ✅ Assign the issue to someone
   - ✅ Add appropriate labels (project, bau, bug, etc.)

## Customizing Labels

Edit `docs/config.js` to match your team's labels:

```javascript
WORK_TYPES: {
    'project': ['project', 'feature', 'epic'],
    'bau': ['bau', 'support', 'maintenance'],
    'bug': ['bug', 'defect'],
    'enhancement': ['enhancement', 'improvement'],
},
```

## Customizing Colors

Edit `docs/config.js`:

```javascript
COLORS: {
    project: '#3b82f6',      // Blue
    bau: '#10b981',          // Green
    bug: '#ef4444',          // Red
    enhancement: '#f59e0b',  // Orange
    other: '#6b7280',        // Gray
},
```

## Workflow Schedule

The workflow runs:
- ✅ Every 30 minutes (automatic)
- ✅ When you push to `main` branch
- ✅ Manually via the Actions tab

To change the schedule, edit `.github/workflows/deploy.yml`:

```yaml
schedule:
  - cron: '*/30 * * * *'  # Every 30 minutes
  # - cron: '0 * * * *'   # Every hour
  # - cron: '0 */2 * * *' # Every 2 hours
  # - cron: '0 9-17 * * *' # Every hour during work hours (9am-5pm)
```

## Security Benefits

✅ **No tokens in browser code** - GitHub token stays in GitHub Actions
✅ **No API rate limits** - Users read static files, not API
✅ **Fast loading** - Pre-fetched data loads instantly
✅ **Automatic updates** - Refreshes every 30 minutes
✅ **Works for private repos** - Uses built-in `GITHUB_TOKEN`

## Troubleshooting

### Dashboard shows "Failed to load issues"

**Solution**: The workflow hasn't run yet. Go to Actions tab and run it manually.

### Workflow fails with "404 Not Found"

**Solution**: Make sure you have at least one issue in your repository.

### Data is not updating

**Solution**:
1. Check the Actions tab to see if the workflow is running
2. If it's not running, click "Enable workflow" if you see that button
3. Run the workflow manually to test

### Dashboard shows old data

**Solution**:
1. Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Check the "Data: Issues fetched at..." timestamp on the dashboard
3. Check the latest Actions run to see when it last succeeded

## Viewing Workflow Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on "fetch-and-deploy" job
4. Expand the steps to see details
5. Look for "✅ Fetched X issues successfully"

## Manual Data Refresh

Want to refresh the data immediately?

1. Go to **Actions** tab
2. Click "Fetch Issues and Deploy Dashboard"
3. Click **Run workflow**
4. Wait ~1 minute
5. Hard refresh your dashboard

## File Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Fetches issues every 30 min
├── docs/
│   ├── data/                   # Created by GitHub Actions
│   │   ├── issues.json         # Your issues data (auto-updated)
│   │   └── last-update.txt     # Timestamp of last fetch
│   ├── index.html              # Dashboard UI
│   ├── styles.css              # Styling
│   ├── app.js                  # Dashboard logic
│   └── config.js               # Your customization
└── README.md
```

## Next Steps

1. ✅ Create issues with assignees and labels
2. ✅ Wait 30 minutes or run workflow manually
3. ✅ Visit your dashboard
4. ✅ Customize colors and labels in `config.js`
5. ✅ Share the dashboard URL with your team!

---

**🎉 That's it! Your secure dashboard is ready to use!**

No tokens to manage, no API limits to worry about, just a beautiful dashboard that updates automatically every 30 minutes.
