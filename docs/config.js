// Configuration file for the dashboard
// Data is automatically fetched by GitHub Actions every 30 minutes
// No GitHub token needed in the browser - keeps your credentials secure!

const CONFIG = {
    // Work type labels mapping
    // Customize these to match your GitHub issue labels
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
};
