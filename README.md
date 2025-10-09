
# Engineering Team Dashboard

<p align="center">
  <img src="docs/assets/img/dashboard.png" alt="Engineering Team Dashboard" width="600">
</p>

A beautiful, real-time dashboard for visualizing team capacity and work distribution based on GitHub Issues. Perfect for engineering managers to track what their team is working on at a glance.

## 🌟 Features

- **Label-Based Filtering**: Only tracks issues with `project` or `enhancement` labels
- **Blocked Work Tracking**: Identifies blocked work needing manager intervention
- **Win Highlighting**: Highlights high-value work items
- **Real-time Updates**: Automatically refreshes when issues are created, edited, or closed
- **Date Filtering**: Filter issues by last updated date to focus on recent work
- **Team Capacity Visualization**: See at-a-glance who's working on what
- **Work Type Distribution**: Visualize projects vs enhancements vs other work
- **Name Mapping**: Map GitHub usernames to preferred display names
- **Dark/Light Theme**: Toggle between themes with automatic system preference detection
- **Manual Refresh**: Force data reload with cache-busting
- **Filterable Issue List**: Filter by assignee, label, or state

## 🚀 Quick Start

This dashboard is automatically deployed via GitHub Actions to GitHub Pages.

**Live Dashboard**: `https://<your-org>.github.io/<your-repo>/`

### Setup

1. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` → `/docs` folder
   - Save

2. **Configure Issue Date Filter** (optional but recommended):
   Edit `docs/config.toml` to set the date range for fetching issues:

   ```toml
   [issues-api]
   # Only show issues updated after this date (ISO 8601 format)
   since = "2025-07-01T00:00:00Z"
   ```

3. **Configure Team Members** (optional):
   Edit `docs/config.toml` to map GitHub usernames to preferred names:

   ```toml
   [[member]]
   git-name = "github-username"
   preferred-name = "Display Name"
   ```

4. **Customize Work Types and Labels**:
   Edit `docs/config.toml` to define work categories and special labels:

   ```toml
   # Work Type Labels - Only these labels are tracked
   [work-types]
   project = ["project"]
   enhancement = ["enhancement"]
   
   # Special Status Labels - Can be combined with work types
   [status-labels]
   blocked = "blocked"   # Work needing manager intervention
   win = "win"          # High value-add work

   [colors]
   project = "3b82f6"      # Blue (hex without #)
   enhancement = "f59e0b"  # Orange
   other = "6b7280"        # Gray
   blocked = "ef4444"      # Red (indicator color)
   win = "10b981"          # Green (indicator color)
   ```

5. **Create Issues**:
   - Add `project` or `enhancement` label to track issues
   - Optionally add `blocked` label for blocked work
   - Optionally add `win` label for high-value work
   - Issues without `project` or `enhancement` labels will be ignored

## 🔄 How It Works

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Triggers on issue events (opened, edited, closed, labeled, etc.)
   - Reads date filter from `config.toml` under `[issues-api]` section
   - Fetches **only** issues with `project` or `enhancement` labels via GitHub API
   - Uses `since` parameter for date filtering
   - Paginates through all results (100 issues per page)
   - Removes duplicates (issues with both labels)
   - Tracks blocked and win counts
   - Saves to `docs/data/issues.json`
   - Generates deployment summary with issue counts, blocked/win stats
   - Deploys to GitHub Pages

2. **Dashboard** (`docs/index.html` + `docs/assets/script/app.js`):
   - Loads configuration from `docs/config.toml`
   - Fetches `issues.json` with cache-busting
   - Categorizes issues by work type
   - Identifies blocked and win items
   - Renders charts using Chart.js
   - Displays team member cards with blocked/win indicators
   - Shows filterable issue list with visual status badges

## 📊 Dashboard Components

### Summary Cards

- Total assigned work items (open issues with assignee)
- Total unassigned work items (open issues without assignee)
- Project count
- Enhancement count
- **Blocked count** (work needing intervention)
- **Win count** (high-value work)

### Charts

- **Work Distribution**: Pie chart showing breakdown by work type
- **Team Capacity**: Bar chart showing open issues per team member

### Team Members

- Cards showing each team member's work breakdown
- Avatar, name, and open/closed issue counts
- **Blocked work indicator** (red, with count)
- **Win work indicator** (green, with count)

### Issues List

- All issues with assignee, labels, and state
- Filterable by team member, label, and state
- **Visual blocked badge** (red "BLOCKED" indicator)
- **Visual win badge** (green "WIN" indicator)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js 4.4.0
- **Icons**: Font Awesome 6.4.2
- **Config Format**: TOML
- **Deployment**: GitHub Actions + GitHub Pages
- **API**: GitHub REST API v3

## 📝 Label Strategy

The dashboard uses a focused label strategy:

### Work Type Labels (Required)

Issues **must** have one of these labels to appear on the dashboard:

- **`project`**: Major projects, initiatives, or feature development
- **`enhancement`**: Improvements, POCs, tech debt removal, performance work

Issues without these labels are **not tracked**.

### Status Labels (Optional)

These labels can be added to any tracked issue:

- **`blocked`**: Work is blocked and needs manager intervention or escalation
  - Displays in red on dashboard
  - Counted separately in summary cards
  - Shows on team member cards

- **`win`**: High-value work that delivers significant impact
  - Displays in green on dashboard
  - Counted separately in summary cards
  - Shows on team member cards

### Example Combinations

- `project` + `blocked` = Blocked project work
- `enhancement` + `win` = High-value enhancement
- `project` + `blocked` + `win` = Blocked high-value project
- Neither `project` nor `enhancement` = Not tracked (ignored)

## 🎨 Theming

The dashboard supports both light and dark themes:

- Automatically detects system preference
- Manual toggle via moon/sun icon
- Preference saved in localStorage

## 🔧 Configuration File

`docs/config.toml` contains all dashboard configuration:

```toml
# Issue API Settings
[issues-api]
# Only show issues updated after this date (ISO 8601 format)
since = "2025-07-01T00:00:00Z"

# Work type mappings - ONLY these labels are tracked
[work-types]
project = ["project"]
enhancement = ["enhancement"]

# Special Status Labels - Can be combined with work types
[status-labels]
blocked = "blocked"     # Work is blocked, needs manager intervention
win = "win"            # High value-add work

# Color scheme (hex codes without #)
[colors]
project = "3b82f6"      # Blue
enhancement = "02cecb"  # Teal
other = "6b7280"        # Gray (for issues with both labels)
blocked = "ef4444"      # Red (for blocked indicator)
win = "ffbf00"          # Gold (for win indicator)

# Team member name mappings
[[member]]
git-name = "github-username"
preferred-name = "Preferred Display Name"
```

## 🚀 Deployment

The dashboard automatically deploys when:

- Issues are created, edited, or closed
- Code is pushed to the `main` branch
- Manually triggered via Actions tab

Deployment typically takes 30-60 seconds.

## 📦 Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # Deployment workflow with label filtering
├── docs/                     # GitHub Pages root
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css     # Styles with theme support
│   │   ├── img/
│   │   │   └── favicon.ico  # Dashboard icon
│   │   └── script/
│   │       └── app.js       # Main application logic
│   ├── data/                # Created by workflow
│   │   └── issues.json      # Fetched issues data
│   ├── config.toml          # Dashboard configuration
│   └── index.html           # Dashboard UI
├── .gitignore
└── README.md
```

## 🔐 Security

- **No Tokens Required**: Uses GitHub's built-in `GITHUB_TOKEN`
- **Read-Only Access**: Workflow only reads issue data
- **Client-Side Only**: No server-side processing or data storage
- **HTTPS Only**: Served via GitHub Pages with HTTPS

## 🤝 Contributing

1. Create issues with `project` or `enhancement` labels for tracking
2. Add `blocked` label when work is blocked
3. Add `win` label for high-value work
4. Assign issues to team members
5. Dashboard updates automatically on issue changes

## 📄 License

This dashboard is for internal team use.

## 🙋 Support

For issues or questions about the dashboard:

- Check the [GitHub Issues](../../issues)
- Review the workflow runs in [Actions](../../actions)
