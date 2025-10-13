
<p align="center">
  <img src="docs/assets/img/dashboard.png" alt="Engineering Team Dashboard" width="128">
</p>

# IS Engineering Team Dashboard

A beautiful, real-time dashboard for visualizing team capacity and work distribution based on GitHub Issues. Perfect for engineering managers to track what their team is working on at a glance.

## 🌟 Features

- **Multiple Assignees Support**: Full support for GitHub's multiple assignees feature with overlapping avatar display
- **Smart Issue Categorization**: Fetches all issues, categorizes by labels in the dashboard
- **Blocked Work Tracking**: Identifies blocked work needing manager intervention with visual indicators
- **Win Highlighting**: Highlights high-value work items with gold badges
- **Real-time Updates**: Automatically refreshes when issues are created, edited, closed, or assigned
- **Date Filtering**: Filter issues by last updated date to focus on recent work (configured via TOML)
- **Team Capacity Visualization**: See at-a-glance who's working on what with bar chart
- **Work Type Distribution**: Visualize projects vs enhancements vs other work with doughnut chart
- **Interactive Workload Heatmap**: Visualize team workload intensity with bubble chart
- **Name Mapping**: Map GitHub usernames to preferred display names
- **Dark/Light Theme**: Toggle between themes with automatic system preference detection
- **Manual Refresh**: Force data reload with cache-busting
- **Filterable Issue List**: Filter by assignee, label, or state

## 🚀 Quick Start

This dashboard is automatically deployed via GitHub Actions to GitHub Pages.

**Live Dashboard**: `https://literate-adventure-1ek48rr.pages.github.io/`

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
   # Work Type Labels - Used for categorization in the dashboard
   [work-types]
   project = ["project"]
   enhancement = ["enhancement"]
   
   # Special Status Labels - Can be combined with work types
   [status-labels]
   blocked = "blocked"   # Work needing manager intervention
   win = "win"           # High value-add work

   [colors]
   project = "02cecb"      # Teal
   enhancement = "7209b7"  # Purple
   other = "6b7280"        # Gray
   blocked = "ef4444"      # Red (for blocked indicator)
   win = "ffbf00"          # Gold (for win indicator)
   ```

5. **Create and Assign Issues**:
   - Create issues and assign to one or more team members
   - Add `project` or `enhancement` labels for categorization
   - Optionally add `blocked` label for blocked work
   - Optionally add `win` label for high-value work
   - Issues without labels or non-project/enhancement labels will appear under "Other" category

## 🔄 How It Works

1. **GitHub Actions Workflow** (`.github/workflows/dashboard.yml`):
   - Triggers on issue events (opened, edited, closed, labeled, assigned, etc.)
   - Installs `dasel` for TOML parsing
   - Reads date filter from `config.toml` using `dasel` (`.issues-api.since`)
   - Fetches **all issues** (no label filtering) via GitHub API
   - Uses `since` parameter for date filtering
   - Paginates through all results (100 issues per page)
   - Saves to `docs/data/issues.json`
   - Generates deployment summary with issue counts and stats
   - Deploys to GitHub Pages

2. **Dashboard** (`docs/index.html` + `docs/assets/script/app.js`):
   - Loads configuration from `docs/config.toml`
   - Fetches `issues.json` with cache-busting
   - Categorizes issues by work type (project, enhancement, or other)
   - Handles multiple assignees with overlapping avatar display
   - Identifies blocked and win items
   - Renders charts using Chart.js
   - Displays team member cards with blocked/win indicators
   - Shows filterable issue list with visual status badges

## 📊 Dashboard Components

### Summary Cards (2-Row Layout)

**Top Row (Large Cards)**:

- **Total Assigned**: Count of open issues with assignee
- **Total Unassigned**: Count of open issues without assignee

**Bottom Row (4 Cards)**:

- **Projects**: Count of issues with `project` label
- **Enhancements**: Count of issues with `enhancement` label
- **Blocked**: Count of issues with `blocked` label (needs intervention)
- **Wins**: Count of issues with `win` label (high-value work)

### Charts (2-Column Layout)

**Left Column**:

- **Work Distribution by Type**: Doughnut chart showing breakdown of:
  - Project work
  - Enhancement work
  - Other work (issues with both labels)
  - Blocked work
  - Win work

**Right Column (Stacked)**:

- **Team Capacity Overview**: Bar chart showing open issues per team member
  
- **Team Workload Heatmap**: Bubble chart visualization showing workload intensity by team member and work type

### Team Member Details

- Individual cards for each team member with assigned issues
- Work breakdown by type (Project, Enhancement, Other)
- **Blocked work indicator** (red ribbon)
- **Win work indicator** (gold ribbon)

### Issues List

- All tracked issues displayed with full details
- **Multiple assignees support**: Issues can have multiple assignees with overlapping avatar display
- Assignee avatars with preferred names
- All labels with original GitHub colors
- **Visual blocked badge**
- **Visual win badge**
- State indicator (open/closed)
- Filterable by:
  - Team member (using preferred names) - matches any assignee
  - Label
  - State (open/closed/all)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js 4.4.0
- **Icons**: Font Awesome 6.4.2
- **Config Format**: TOML (parsed by dasel in GitHub Actions)
- **Config Parser**: dasel (latest) for TOML parsing in workflow
- **Deployment**: GitHub Actions + GitHub Pages
- **API**: GitHub REST API v3 with multiple assignees support

## 📝 Label Strategy

The dashboard uses a flexible label strategy:

### Work Type Labels (Optional)

These labels are used for categorization in the dashboard:

- **`project`**: Major projects, initiatives, or feature development
- **`enhancement`**: Improvements, POCs, tech debt removal, performance work

Issues without these labels are categorized as **"Other"** in the Work Distribution chart.

### Status Labels (Optional)

These labels can be added to any issue:

- **`blocked`**: Work is blocked and needs manager intervention or escalation
  - Displays in red on dashboard
  - Counted separately in summary cards
  - Shows on team member cards

- **`win`**: High-value work that delivers significant impact
  - Displays in gold on dashboard
  - Counted separately in summary cards
  - Shows on team member cards

### Example Combinations

- `project` + `blocked` = Blocked project work
- `enhancement` + `win` = High-value enhancement
- `project` + `blocked` + `win` = Blocked high-value project
- No labels = Appears under "Other" category

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

# Work type mappings - Used for categorization
[work-types]
project = ["project"]
enhancement = ["enhancement"]

# Special Status Labels - Can be combined with work types
[status-labels]
blocked = "blocked"     # Work is blocked, needs manager intervention
win = "win"            # High value-add work

# Color scheme (hex codes without #)
[colors]
project = "02cecb"      # Teal
enhancement = "7209b7"  # Purple
other = "6b7280"        # Gray (for issues with no label or no work type label)
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
│       └── dashboard.yml     # Deployment workflow (fetches all issues, uses dasel for TOML parsing)
├── docs/                     # GitHub Pages root
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css     # Styles with theme support and hover effects
│   │   ├── img/
│   │   │   └── favicon.ico  # Dashboard icon
│   │   └── script/
│   │       └── app.js       # Main application logic with multiple assignees support
│   ├── data/                # Created by workflow
│   │   └── issues.json      # Fetched issues data
│   ├── config.toml          # Dashboard configuration (parsed by dasel)
│   └── index.html           # Dashboard UI with stacked chart layout
├── .gitignore
└── README.md
```

## 🔐 Security

- **No Tokens Required**: Uses GitHub's built-in `GITHUB_TOKEN`
- **Read-Only Access**: Workflow only reads issue data
- **Client-Side Only**: No server-side processing or data storage
- **HTTPS Only**: Served via GitHub Pages with HTTPS

## 🤝 Contributing

Pull requests welcome!

## 📄 License

This dashboard is for internal team use.
