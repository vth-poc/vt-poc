# How the Secure Dashboard Works

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
│                                                                   │
│  ┌──────────────┐         ┌──────────────────────┐              │
│  │   Issues     │         │  GitHub Actions      │              │
│  │              │         │  Workflow            │              │
│  │ #1 Feature   │◄────────│                      │              │
│  │ #2 Bug Fix   │  Reads  │  Runs every 30 min   │              │
│  │ #3 BAU Task  │         │                      │              │
│  └──────────────┘         └──────────┬───────────┘              │
│                                       │                          │
│                                       │ Fetches & Saves          │
│                                       ▼                          │
│                           ┌──────────────────────┐               │
│                           │   docs/data/         │               │
│                           │                      │               │
│                           │  issues.json         │               │
│                           │  last-update.txt     │               │
│                           └──────────┬───────────┘               │
│                                      │                           │
│                                      │ Deploys                   │
└──────────────────────────────────────┼───────────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │   GitHub Pages          │
                         │                         │
                         │  https://vth-poc        │
                         │    .github.io/vt-poc/   │
                         └─────────┬───────────────┘
                                   │
                                   │ Users visit
                                   ▼
                    ┌──────────────────────────────┐
                    │     Dashboard                │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │  Work Distribution     │  │
                    │  │  Team Capacity         │  │
                    │  │  Team Members          │  │
                    │  │  Issues List           │  │
                    │  └────────────────────────┘  │
                    │                              │
                    │  Reads: data/issues.json     │
                    │  (No API calls!)             │
                    └──────────────────────────────┘
```

## Data Flow

### Step 1: GitHub Actions (Every 30 minutes)

```
┌─────────────────────────────────────────────────────┐
│  GitHub Actions Workflow                            │
│                                                      │
│  1. Checkout repository                             │
│  2. Create docs/data/ directory                     │
│  3. Fetch issues using GitHub CLI:                  │
│     gh api /repos/vth-poc/vt-poc/issues             │
│     → Uses built-in GITHUB_TOKEN (secure!)          │
│  4. Save to docs/data/issues.json                   │
│  5. Save timestamp to docs/data/last-update.txt     │
│  6. Deploy to GitHub Pages                          │
└─────────────────────────────────────────────────────┘
```

### Step 2: User Visits Dashboard

```
┌─────────────────────────────────────────────────────┐
│  Browser                                             │
│                                                      │
│  1. Load index.html                                 │
│  2. Load config.js (work types & colors)            │
│  3. Load app.js                                     │
│  4. Fetch data/issues.json (static file!)           │
│     → No GitHub token needed                        │
│     → No API rate limits                            │
│     → Fast loading                                  │
│  5. Process data (categorize, count, etc.)          │
│  6. Render charts and tables                        │
└─────────────────────────────────────────────────────┘
```

## Security Comparison

### ❌ OLD WAY (Insecure)

```
User Browser → GitHub API (with token) → Issues
                    ↑
              Token exposed!
           Visible in browser code
```

**Problems:**
- Token visible in browser DevTools
- Token in git history if committed
- API rate limits per user
- Security risk

### ✅ NEW WAY (Secure)

```
GitHub Actions → GitHub API (with token) → Issues → JSON file
                      ↑                                ↓
                Secure token!                   GitHub Pages
              (never exposed)                          ↓
                                            User Browser → JSON file
                                                   ↑
                                             No token needed!
```

**Benefits:**
- Token stays in GitHub Actions (secure)
- No token in browser code
- No API rate limits for users
- Fast static file loading
- Works for private repos

## Timeline Example

```
00:00  │ Workflow runs → Fetches 50 issues → Deploys
       │ Data: Fresh (00:00)
       │
00:15  │ User visits dashboard
       │ Loads: issues.json (from 00:00)
       │ Age: 15 minutes old
       │
00:30  │ Workflow runs → Fetches 52 issues → Deploys
       │ Data: Fresh (00:30)
       │
00:45  │ User visits dashboard
       │ Loads: issues.json (from 00:30)
       │ Age: 15 minutes old
       │
01:00  │ Workflow runs → Fetches 53 issues → Deploys
       │ Data: Fresh (01:00)
       │
       ▼ Continues every 30 minutes...
```

## Customization Points

### 1. Update Frequency

Edit `.github/workflows/deploy.yml`:

```yaml
schedule:
  - cron: '*/30 * * * *'  # Every 30 minutes
  - cron: '*/15 * * * *'  # Every 15 minutes
  - cron: '0 * * * *'     # Every hour
  - cron: '0 */2 * * *'   # Every 2 hours
  - cron: '0 9-17 * * 1-5' # Hourly, work hours, weekdays
```

### 2. Work Categorization

Edit `docs/config.js`:

```javascript
WORK_TYPES: {
    'project': ['project', 'feature', 'epic'],
    'bau': ['bau', 'support', 'maintenance'],
    'bug': ['bug', 'defect'],
    'enhancement': ['enhancement', 'improvement'],
}
```

### 3. Visual Appearance

Edit `docs/config.js`:

```javascript
COLORS: {
    project: '#3b82f6',      // Blue
    bau: '#10b981',          // Green
    bug: '#ef4444',          // Red
    enhancement: '#f59e0b',  // Orange
    other: '#6b7280',        // Gray
}
```

## Monitoring

### Check Workflow Status

```
Go to Actions tab → Recent workflow runs
✅ Success: Green checkmark
❌ Failure: Red X (click for logs)
🟡 Running: Yellow dot
```

### Check Data Freshness

Dashboard displays: "Data: Issues fetched at YYYY-MM-DD HH:MM:SS UTC"

### Manual Refresh

```
Actions tab → "Fetch Issues and Deploy Dashboard" → Run workflow
Wait 1-2 minutes → Hard refresh dashboard (Cmd+Shift+R)
```

## Technical Details

### GitHub Actions Token

- Uses `${{ secrets.GITHUB_TOKEN }}`
- Automatically provided by GitHub
- Has `contents: read` permission by default
- Can access issues in the same repository
- No setup required!

### Static File Approach

- `issues.json`: Array of issue objects from GitHub API
- `last-update.txt`: Human-readable timestamp
- Files regenerated every workflow run
- Served by GitHub Pages (CDN-backed, fast)

### Browser Compatibility

- Modern browsers (ES6+ JavaScript)
- Chart.js for visualizations
- Responsive CSS Grid/Flexbox
- No build step required

---

**🎯 Result: A secure, fast, auto-updating dashboard with zero token management!**
