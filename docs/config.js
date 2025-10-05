// Configuration file for the dashboard
// Update these values to match your repository

const CONFIG = {
    // GitHub repository information
    // Format: "owner/repo" (e.g., "ISEngineering/eng.team.dashboard")
    GITHUB_REPO: 'vth-poc/vt-poc', // Replace with your repo
    
    // GitHub Personal Access Token (optional for public repos, required for private)
    // Create at: https://github.com/settings/tokens
    // Scopes needed: repo (for private repos) or public_repo (for public repos)
    GITHUB_TOKEN: '', // Leave empty for public repos or add your token
    
    // Work type labels mapping
    // Map GitHub labels to work categories
    WORK_TYPES: {
        'project': ['project', 'feature', 'epic'],
        'bau': ['bau', 'support', 'maintenance'],
        'bug': ['bug', 'defect'],
        'enhancement': ['enhancement', 'improvement'],
    },
    
    // Chart colors
    COLORS: {
        project: '#3b82f6',
        bau: '#10b981',
        bug: '#ef4444',
        enhancement: '#f59e0b',
        other: '#6b7280',
    },
    
    // API settings
    ISSUES_PER_PAGE: 100,
    MAX_PAGES: 10, // Maximum number of pages to fetch
};
