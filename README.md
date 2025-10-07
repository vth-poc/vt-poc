# Engineering Team Dashboard 🚀

A beautiful, real-time dashboard for visualizing team capacity and work distribution based on GitHub Issues. Perfect for engineering managers to track what their team is working on at a glance.

## 🌟 Features

- **Real-time Updates**: Automatically refreshes when issues are created, edited, or closed
- **Date Filtering**: Filter issues by last updated date to focus on recent work
- **Team Capacity Visualization**: See at-a-glance who's working on what
- **Work Type Distribution**: Visualize projects vs BAU vs bugs vs enhancements vs admin tasks
- **Name Mapping**: Map GitHub usernames to preferred display names
- **Dark/Light Theme**: Toggle between themes with automatic system preference detection
- **Manual Refresh**: Force data reload with cache-busting
- **Filterable Issue List**: Filter by assignee, label, or state
- **Rich Issue Templates**: Pre-configured templates for projects, BAU, bugs, enhancements, and admin tasks

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

4. **Customize Work Types** (optional):
   Edit `docs/config.toml` to define work categories and colors:

   ```toml
   [work-types]
   project = ["project", "feature", "epic"]
   bau = ["bau", "support", "maintenance"]
   bug = ["bug", "defect"]
   enhancement = ["enhancement", "improvement"]

   [colors]
   project = "3b82f6"      # Blue (hex without #)
   bau = "10b981"          # Green
   bug = "ef4444"          # Red
   enhancement = "f59e0b"  # Orange
   other = "6b7280"        # Gray
   ```

5. **Create Issues**: Use GitHub Issues with provided templates to track work items

## 🔄 How It Works

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Triggers on issue events (opened, edited, closed, labeled, etc.)
   - Reads date filter from `config.toml` under `[issues-api]` section
   - Fetches issues via GitHub API with `since` parameter for date filtering
   - Paginates through all results (100 issues per page)
   - Saves to `docs/data/issues.json`
   - Generates deployment summary with issue counts and filter date
   - Deploys to GitHub Pages

2. **Dashboard** (`docs/index.html` + `docs/assets/script/app.js`):
   - Loads configuration from `docs/config.toml`
   - Fetches `issues.json` with cache-busting
   - Renders charts using Chart.js
   - Displays team member cards and filterable issue list

## 📊 Dashboard Components

### Summary Cards

- Total open work items
- Active team members (with assigned issues)
- Project count
- BAU support count

### Charts

- **Work Distribution**: Pie chart showing breakdown by work type
- **Team Capacity**: Bar chart showing open issues per team member

### Team Members

- Cards showing each team member's work breakdown
- Avatar, name, and open/closed issue counts

### Issues List

- All issues with assignee, labels, and state
- Filterable by team member, label, and state

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js 4.4.0
- **Icons**: Font Awesome 6.4.2
- **Config Format**: TOML
- **Deployment**: GitHub Actions + GitHub Pages
- **API**: GitHub REST API v3

## 📝 Issue Templates

The repository includes comprehensive issue templates for:

- **Project Work**: Major features or initiatives with tasks and acceptance criteria
- **BAU Support**: Business-as-usual and recurring support work with frequency tracking
- **Bug Report**: Defects and issues with reproduction steps and severity levels
- **Enhancement**: POCs, new features, tech debt removal, and performance improvements
- **Admin Task**: E-learning, housekeeping, and documentation updates

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

# Work type mappings
[work-types]
project = ["project", "feature", "epic"]
bau = ["bau", "support", "maintenance"]
bug = ["bug", "defect"]
enhancement = ["enhancement", "improvement"]

# Color scheme (hex codes without #)
[colors]
project = "3b82f6"      # Blue
bau = "10b981"          # Green
bug = "ef4444"          # Red
enhancement = "f59e0b"  # Orange
other = "6b7280"        # Gray

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
│   ├── ISSUE_TEMPLATE/       # Issue templates (5 types)
│   │   ├── project.yml      # Project work
│   │   ├── bau.yml          # BAU support
│   │   ├── bug.yml          # Bug reports
│   │   ├── enhancement.yml  # Enhancements/POCs
│   │   └── task.yml         # Admin tasks
│   └── workflows/
│       └── deploy.yml        # Deployment workflow
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

1. Create issues using the provided templates
2. Assign issues to team members
3. Use appropriate labels (project, bau, bug, enhancement)
4. Dashboard updates automatically

## 📄 License

This dashboard is for internal team use.

## 🙋 Support

For issues or questions about the dashboard:

- Check the [GitHub Issues](../../issues)
- Review the workflow runs in [Actions](../../actions)
