// Configuration Template
// Copy this to config.js and update with your settings

const CONFIG = {
    // REQUIRED: Your GitHub repository
    // Format: "owner/repo" (e.g., "microsoft/vscode")
    GITHUB_REPO: 'OWNER/REPO',
    
    // OPTIONAL: GitHub Personal Access Token
    // Leave empty for public repos (subject to rate limits: 60 requests/hour)
    // Add token for private repos or to increase limits to 5000 requests/hour
    // Create token at: https://github.com/settings/tokens
    // Required scopes: 'repo' (private) or 'public_repo' (public)
    GITHUB_TOKEN: '',
    
    // Work type labels mapping
    // Customize these to match your team's GitHub labels
    WORK_TYPES: {
        'project': ['project', 'feature', 'epic'],
        'bau': ['bau', 'support', 'maintenance'],
        'bug': ['bug', 'defect'],
        'enhancement': ['enhancement', 'improvement'],
    },
    
    // Chart colors (hex codes)
    COLORS: {
        project: '#3b82f6',      // Blue
        bau: '#10b981',          // Green
        bug: '#ef4444',          // Red
        enhancement: '#f59e0b',  // Orange
        other: '#6b7280',        // Gray
    },
    
    // API settings
    ISSUES_PER_PAGE: 100,  // Number of issues to fetch per API call (max 100)
    MAX_PAGES: 10,         // Maximum pages to fetch (prevents excessive API calls)
};
