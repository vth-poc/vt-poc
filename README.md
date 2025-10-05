# Engineering Team Dashboard 🚀

A beautiful, real-time dashboard for visualizing team capacity and work distribution based on GitHub Issues. Perfect for engineering managers to track what their team is working on at a glance.

## Features

✨ **Real-time Data**: Fetches live data from GitHub Issues API
📊 **Visual Analytics**: Charts showing work distribution by type and team capacity
👥 **Team Overview**: See each team member's workload and work breakdown
🏷️ **Label-based Categorization**: Automatically categorizes work (Project, BAU, Bugs, Enhancement)
🔍 **Advanced Filtering**: Filter issues by assignee, label, and state
📱 **Responsive Design**: Works beautifully on desktop and mobile
🎨 **Modern UI**: Clean, professional interface with smooth interactions

## Dashboard Preview

The dashboard includes:
- **Summary Cards**: Quick stats on total issues, active team members, projects, and BAU work
- **Work Distribution Chart**: Pie chart showing breakdown of work types
- **Team Capacity Chart**: Bar chart showing open issues per team member
- **Team Member Details**: Cards with each member's workload and work type breakdown
- **Issues List**: Filterable, detailed list of all issues with assignees and labels

## Quick Start

### 1. Configuration

Edit `docs/config.js` and update the following:

```javascript
const CONFIG = {
    // Your GitHub repository (format: "owner/repo")
    GITHUB_REPO: 'ISEngineering/eng.team.dashboard',
    
    // Optional: GitHub Personal Access Token
    // Required for private repos or to increase rate limits
    GITHUB_TOKEN: '', 
    
    // Customize work type labels to match your workflow
    WORK_TYPES: {
        'project': ['project', 'feature', 'epic'],
        'bau': ['bau', 'support', 'maintenance'],
        'bug': ['bug', 'defect'],
        'enhancement': ['enhancement', 'improvement'],
    },
};
```

### 2. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** (under "Code and automation")
3. Under "Source", select **Deploy from a branch**
4. Select branch: `main` (or your default branch)
5. Select folder: `/docs`
6. Click **Save**

Your dashboard will be available at: `https://[your-username].github.io/[repo-name]/`

### 3. GitHub Token (Optional but Recommended)

For private repositories or to avoid rate limits:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Team Dashboard")
4. Select scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories only)
5. Click "Generate token"
6. Copy the token and add it to `docs/config.js`

**Security Note**: Never commit your token to a public repository! Consider using GitHub Actions secrets for production deployments.

## Label Configuration

The dashboard categorizes issues based on labels. Update the `WORK_TYPES` in `config.js` to match your team's labels:

### Default Label Mapping:
- **Project**: `project`, `feature`, `epic`
- **BAU (Business as Usual)**: `bau`, `support`, `maintenance`
- **Bug**: `bug`, `defect`
- **Enhancement**: `enhancement`, `improvement`

Issues without matching labels are categorized as "Other".

## Usage

### Creating Issues for the Dashboard

1. **Assign Issues**: Use GitHub assignees to indicate who's working on what
2. **Add Labels**: Tag issues with appropriate labels (project, bau, bug, etc.)
3. **Keep Updated**: The dashboard refreshes on page load and has a manual refresh button

### Example Issue Workflow:

```
Title: Implement user authentication
Assignee: @johndoe
Labels: project, feature
```

```
Title: Fix login button styling
Assignee: @janedoe
Labels: bug
```

```
Title: Database maintenance
Assignee: @johndoe
Labels: bau, maintenance
```

## Dashboard Features Explained

### Summary Cards
- **Total Issues**: Count of all open issues
- **Active Team Members**: Number of team members with assigned issues
- **Projects**: Open issues tagged as projects
- **BAU Support**: Open issues tagged as BAU work

### Work Distribution Chart
Doughnut chart showing the proportion of different work types (Projects, BAU, Bugs, Enhancements, Other)

### Team Capacity Overview
Bar chart displaying the number of open issues assigned to each team member

### Team Member Details
Individual cards for each team member showing:
- Avatar and name
- Count of open and closed issues
- Breakdown of work by type

### Issues List
Filterable table showing:
- Issue title (clickable to GitHub)
- Issue number
- Assignee with avatar
- Labels with colors
- Issue state (open/closed)

Filters available:
- Team member (assignee)
- Label/work type
- Issue state (open/closed/all)

## Customization

### Colors

Edit `docs/config.js` to customize chart colors:

```javascript
COLORS: {
    project: '#3b82f6',    // Blue
    bau: '#10b981',        // Green
    bug: '#ef4444',        // Red
    enhancement: '#f59e0b', // Orange
    other: '#6b7280',      // Gray
}
```

### Styling

Edit `docs/styles.css` to customize the look and feel. CSS variables are defined at the top:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #3b82f6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    /* ... more variables */
}
```

## Troubleshooting

### Dashboard shows "Configuration Required"
- Make sure you've updated `GITHUB_REPO` in `config.js`
- Format should be `"owner/repo"` (e.g., `"ISEngineering/eng.team.dashboard"`)

### "Repository not found" error
- Check that the repository name is correct
- For private repos, ensure you've added a valid `GITHUB_TOKEN`

### "Authentication failed" error
- Your GitHub token may be invalid or expired
- Generate a new token with the correct scopes

### Rate Limit Issues
- GitHub API has rate limits (60 requests/hour without token, 5000 with token)
- Add a `GITHUB_TOKEN` to increase your rate limit
- Reduce `MAX_PAGES` in config if you have many issues

### No team members showing
- Ensure issues have assignees
- Check that labels match your `WORK_TYPES` configuration

## File Structure

```
eng.team.dashboard/
├── docs/
│   ├── index.html      # Main dashboard HTML
│   ├── styles.css      # Dashboard styling
│   ├── app.js          # Dashboard logic & GitHub API integration
│   └── config.js       # Configuration file (update this!)
└── README.md           # This file
```

## API Rate Limits

- **Without token**: 60 requests per hour
- **With token**: 5,000 requests per hour

The dashboard makes 1 request per 100 issues (pagination). Adjust `ISSUES_PER_PAGE` and `MAX_PAGES` in config if needed.

## Local Development

To test locally:

1. Clone the repository
2. Update `docs/config.js` with your settings
3. Open `docs/index.html` in a web browser
   - Or use a local server: `cd docs && python3 -m http.server 8000`
4. Navigate to `http://localhost:8000`

## Security Best Practices

1. **Never commit tokens**: Don't add your `GITHUB_TOKEN` to version control
2. **Use environment variables**: For production, consider using GitHub Actions with secrets
3. **Token scopes**: Only grant minimum required scopes
4. **Rotate tokens**: Regularly regenerate your tokens
5. **Public repos**: You may not need a token for public repositories

## Contributing

Feel free to customize this dashboard for your team's needs! Some ideas:
- Add milestone tracking
- Include issue age/staleness indicators
- Add sprint/iteration views
- Integrate with other project management tools
- Add time tracking based on comments

## Technologies Used

- **Chart.js**: For data visualization
- **GitHub REST API**: For fetching issues
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid & Flexbox**: For responsive layout

## License

MIT License - feel free to use and modify for your team!

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review GitHub Issues API documentation: https://docs.github.com/en/rest/issues
3. Create an issue in this repository

---

**Happy tracking! 📊**
