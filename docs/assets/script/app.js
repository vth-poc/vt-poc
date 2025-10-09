// Main application logic
let allIssues = [];
let teamData = {};
let workTypeChart = null;
let teamCapacityChart = null;
let nameMapping = {}; // Maps git-name to preferred-name

// Configuration loaded from config.toml
const CONFIG = {
    WORK_TYPES: {},
    COLORS: {},
    STATUS_LABELS: {
        blocked: 'blocked',
        win: 'win'
    }
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeDashboard();
    setupEventListeners();
});

async function loadConfiguration() {
    try {
        // Add cache busting to ensure fresh config on refresh
        const cacheBuster = new Date().getTime();
        const response = await fetch(`config.toml?_=${cacheBuster}`, {
            cache: 'no-store'
        });
        const tomlText = await response.text();
        
        // Parse work types
        const workTypesSection = tomlText.match(/\[work-types\]([\s\S]*?)(?=\n\[|$)/);
        if (workTypesSection) {
            const lines = workTypesSection[1].trim().split('\n');
            lines.forEach(line => {
                const match = line.match(/(\w+)\s*=\s*\[(.*?)\]/);
                if (match) {
                    const [, key, values] = match;
                    CONFIG.WORK_TYPES[key] = values.split(',').map(v => v.trim().replace(/"/g, ''));
                }
            });
        }
        
        // Parse colors
        const colorsSection = tomlText.match(/\[colors\]([\s\S]*?)(?=\n\[|$)/);
        if (colorsSection) {
            const lines = colorsSection[1].trim().split('\n');
            lines.forEach(line => {
                const match = line.match(/(\w+)\s*=\s*"([^"]+)"/);
                if (match) {
                    const [, key, value] = match;
                    CONFIG.COLORS[key] = '#' + value;
                }
            });
        }
        
        // Parse status labels
        const statusLabelsSection = tomlText.match(/\[status-labels\]([\s\S]*?)(?=\n\[|$)/);
        if (statusLabelsSection) {
            const lines = statusLabelsSection[1].trim().split('\n');
            lines.forEach(line => {
                const match = line.match(/(\w+)\s*=\s*"([^"]+)"/);
                if (match) {
                    const [, key, value] = match;
                    CONFIG.STATUS_LABELS[key] = value;
                }
            });
        }
        
        // Parse member mappings
        const memberBlocks = tomlText.split('[[member]]').filter(block => block.trim());
        memberBlocks.forEach(block => {
            const gitNameMatch = block.match(/git-name\s*=\s*"([^"]+)"/);
            const preferredNameMatch = block.match(/preferred-name\s*=\s*"([^"]+)"/);
            
            if (gitNameMatch && preferredNameMatch) {
                nameMapping[gitNameMatch[1]] = preferredNameMatch[1];
            }
        });
        
        console.log('Configuration loaded:', { CONFIG, nameMapping });
    } catch (error) {
        console.error('Could not load config.toml, using defaults:', error);
        // Set defaults if loading fails
        CONFIG.WORK_TYPES = {
            'project': ['project'],
            'enhancement': ['enhancement'],
        };
        CONFIG.COLORS = {
            project: '#02cecb',
            enhancement: '#7209b7',
            other: '#6b7280',
            blocked: '#ef4444',
            win: '#ffbf00',
        };
        CONFIG.STATUS_LABELS = {
            blocked: 'blocked',
            win: 'win'
        };
    }
}

function getDisplayName(gitLogin) {
    return nameMapping[gitLogin] || gitLogin;
}

function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(theme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button with Font Awesome icons
    const themeIcon = document.getElementById('themeIcon');
    
    if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-rotate fa-spin"></i> Refreshing...';
        
        try {
            // Reload configuration to pick up any changes
            await loadConfiguration();
            await loadDashboardData();
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Refresh';
        }
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    document.getElementById('filterAssignee').addEventListener('change', filterIssues);
    document.getElementById('filterLabel').addEventListener('change', filterIssues);
    document.getElementById('filterState').addEventListener('change', filterIssues);
}

async function initializeDashboard() {
    await loadConfiguration();
    await loadDashboardData();
}

async function loadDashboardData() {
    try {
        showLoading();
        
        // Fetch issues from pre-fetched static data
        allIssues = await fetchAllIssues();
        
        // Process data
        processTeamData();
        
        // Update UI
        updateSummaryCards();
        updateCharts();
        renderTeamMembers();
        renderIssues(allIssues);
        updateFilterOptions();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError(`Failed to load data: ${error.message}`);
    }
}

async function fetchAllIssues() {
    try {
        // Fetch from pre-fetched static data with cache busting
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data/issues.json?_=${cacheBuster}`, {
            cache: 'no-store',  // Disable all caching
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error('Could not load issues data. The GitHub Action may not have run yet. Please check the Actions tab or run the workflow manually.');
        }
        
        const issues = await response.json();
        
        // Filter out pull requests (they appear in the issues endpoint)
        return issues.filter(issue => !issue.pull_request);
        
    } catch (error) {
        throw new Error(`Failed to load issues: ${error.message}`);
    }
}

function processTeamData() {
    teamData = {};
    
    allIssues.forEach(issue => {
        // Get assignee (use git login as key)
        const assignee = issue.assignee ? issue.assignee.login : 'Unassigned';
        const displayName = assignee !== 'Unassigned' ? getDisplayName(assignee) : 'Unassigned';
        
        if (!teamData[assignee]) {
            teamData[assignee] = {
                name: displayName,  // Use preferred name for display
                gitLogin: assignee,  // Keep git login for reference
                avatar: issue.assignee ? issue.assignee.avatar_url : null,
                issues: [],
                workBreakdown: {
                    project: 0,
                    enhancement: 0,
                    other: 0,
                },
                blockedCount: 0,
                winCount: 0,
            };
        }
        
        teamData[assignee].issues.push(issue);
        
        // Categorize work type
        const workType = categorizeIssue(issue);
        teamData[assignee].workBreakdown[workType]++;
        
        // Track blocked and win status
        const labels = issue.labels.map(l => l.name.toLowerCase());
        if (labels.includes(CONFIG.STATUS_LABELS.blocked.toLowerCase())) {
            teamData[assignee].blockedCount++;
        }
        if (labels.includes(CONFIG.STATUS_LABELS.win.toLowerCase())) {
            teamData[assignee].winCount++;
        }
    });
}

function categorizeIssue(issue) {
    const labels = issue.labels.map(label => label.name.toLowerCase());
    
    for (const [category, keywords] of Object.entries(CONFIG.WORK_TYPES)) {
        if (labels.some(label => keywords.some(keyword => label.includes(keyword)))) {
            return category;
        }
    }
    
    return 'other';
}

function updateSummaryCards() {
    const openIssues = allIssues.filter(i => i.state === 'open');
    const assignedIssues = openIssues.filter(i => i.assignee);
    const unassignedIssues = openIssues.filter(i => !i.assignee);
    
    let projectCount = 0;
    let enhancementCount = 0;
    let blockedCount = 0;
    let winCount = 0;
    
    openIssues.forEach(issue => {
        const type = categorizeIssue(issue);
        if (type === 'project') projectCount++;
        if (type === 'enhancement') enhancementCount++;
        
        const labels = issue.labels.map(l => l.name.toLowerCase());
        if (labels.includes(CONFIG.STATUS_LABELS.blocked.toLowerCase())) blockedCount++;
        if (labels.includes(CONFIG.STATUS_LABELS.win.toLowerCase())) winCount++;
    });
    
    document.getElementById('totalAssigned').textContent = assignedIssues.length;
    document.getElementById('totalUnassigned').textContent = unassignedIssues.length;
    document.getElementById('projectCount').textContent = projectCount;
    document.getElementById('enhancementCount').textContent = enhancementCount;
    document.getElementById('blockedCount').textContent = blockedCount;
    document.getElementById('winCount').textContent = winCount;
}

function updateCharts() {
    updateWorkTypeChart();
    updateTeamCapacityChart();
}

function updateWorkTypeChart() {
    const openIssues = allIssues.filter(i => i.state === 'open');
    const typeCounts = {
        project: 0,
        enhancement: 0,
        other: 0,
        blocked: 0,
        win: 0,
    };
    
    openIssues.forEach(issue => {
        const type = categorizeIssue(issue);
        const labels = issue.labels.map(l => l.name.toLowerCase());
        const isBlocked = labels.includes(CONFIG.STATUS_LABELS.blocked.toLowerCase());
        const isWin = labels.includes(CONFIG.STATUS_LABELS.win.toLowerCase());
        
        // Count by work type
        typeCounts[type]++;
        
        // Additionally count blocked and win
        if (isBlocked) typeCounts.blocked++;
        if (isWin) typeCounts.win++;
    });
    
    const ctx = document.getElementById('workTypeChart').getContext('2d');
    
    if (workTypeChart) {
        workTypeChart.destroy();
    }
    
    workTypeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(typeCounts).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: Object.keys(typeCounts).map(type => CONFIG.COLORS[type]),
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function updateTeamCapacityChart() {
    const teamMembers = Object.keys(teamData).filter(m => m !== 'Unassigned');
    const issueCounts = teamMembers.map(member => 
        teamData[member].issues.filter(i => i.state === 'open').length
    );
    
    // Map team members to their preferred names for display
    const displayNames = teamMembers.map(member => teamData[member].name);
    
    const ctx = document.getElementById('teamCapacityChart').getContext('2d');
    
    if (teamCapacityChart) {
        teamCapacityChart.destroy();
    }
    
    teamCapacityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayNames,  // Use preferred names instead of git logins
            datasets: [{
                label: 'Open Work Items',
                data: issueCounts,
                backgroundColor: CONFIG.COLORS.project,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    }
                }
            }
        }
    });
}

function renderTeamMembers() {
    const container = document.getElementById('teamMembersContainer');
    const teamMembers = Object.keys(teamData).filter(m => m !== 'Unassigned');
    
    if (teamMembers.length === 0) {
        container.innerHTML = '<p class="loading">No team members found with assigned issues.</p>';
        return;
    }
    
    container.innerHTML = teamMembers.map(memberName => {
        const member = teamData[memberName];
        const openIssues = member.issues.filter(i => i.state === 'open').length;
        const closedIssues = member.issues.filter(i => i.state === 'closed').length;
        
        return `
            <div class="team-member">
                <div class="team-member-header">
                    ${member.avatar ? `<img src="${member.avatar}" alt="${member.name}" class="team-member-avatar">` : ''}
                    <div class="team-member-info">
                        <h3>${member.name}</h3>
                        <p>${openIssues} open, ${closedIssues} closed work items</p>
                    </div>
                </div>
                <div class="work-breakdown">
                    ${Object.entries(member.workBreakdown)
                        .filter(([type, count]) => count > 0)
                        .map(([type, count]) => `
                            <span class="work-badge ${type}">
                                ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}
                            </span>
                        `).join('')}
                    ${member.blockedCount > 0 ? `
                        <span class="work-badge blocked">
                            <i class="fa-solid fa-ban"></i> Blocked: ${member.blockedCount}
                        </span>
                    ` : ''}
                    ${member.winCount > 0 ? `
                        <span class="work-badge win">
                            <i class="fa-solid fa-trophy"></i> Wins: ${member.winCount}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderIssues(issues) {
    const container = document.getElementById('issuesContainer');
    
    if (issues.length === 0) {
        container.innerHTML = '<p class="loading">No work items found.</p>';
        return;
    }
    
    container.innerHTML = issues.map(issue => {
        const workType = categorizeIssue(issue);
        const assigneeLogin = issue.assignee ? issue.assignee.login : 'Unassigned';
        const assigneeName = assigneeLogin !== 'Unassigned' ? getDisplayName(assigneeLogin) : 'Unassigned';
        
        // Check for blocked and win labels
        const labels = issue.labels.map(l => l.name.toLowerCase());
        const isBlocked = labels.includes(CONFIG.STATUS_LABELS.blocked.toLowerCase());
        const isWin = labels.includes(CONFIG.STATUS_LABELS.win.toLowerCase());
        
        return `
            <div class="issue-item" style="border-left-color: ${CONFIG.COLORS[workType]}">
                <div class="issue-header">
                    <div>
                        <div class="issue-title">
                            <a href="${issue.html_url}" target="_blank">${issue.title}</a>
                            <span class="issue-number">#${issue.number}</span>
                            ${isBlocked ? '<span style="margin-left: 8px; color: #ef4444; font-weight: bold;"><i class="fa-solid fa-ban"></i> BLOCKED</span>' : ''}
                            ${isWin ? '<span style="margin-left: 8px; color: #ffbf00; font-weight: bold;"><i class="fa-solid fa-trophy"></i> WIN</span>' : ''}
                        </div>
                        <div class="issue-meta">
                            <div class="issue-assignee">
                                ${issue.assignee ? `
                                    <img src="${issue.assignee.avatar_url}" alt="${assigneeName}" class="assignee-avatar">
                                    <span>${assigneeName}</span>
                                ` : '<span>Unassigned</span>'}
                            </div>
                            <div class="issue-labels">
                                ${issue.labels.map(label => `
                                    <span class="label" style="background-color: #${label.color}; color: ${getContrastColor(label.color)}">
                                        ${label.name}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <span class="issue-state ${issue.state}">${issue.state}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateFilterOptions() {
    // Update assignee filter with preferred names
    const assigneeFilter = document.getElementById('filterAssignee');
    const assignees = [...new Set(allIssues.map(i => i.assignee ? i.assignee.login : 'Unassigned'))];
    
    assigneeFilter.innerHTML = '<option value="">All Team Members</option>' +
        assignees.map(assigneeLogin => {
            const displayName = assigneeLogin !== 'Unassigned' ? getDisplayName(assigneeLogin) : 'Unassigned';
            return `<option value="${assigneeLogin}">${displayName}</option>`;
        }).join('');
    
    // Update label filter
    const labelFilter = document.getElementById('filterLabel');
    const allLabels = [...new Set(allIssues.flatMap(i => i.labels.map(l => l.name)))];
    
    labelFilter.innerHTML = '<option value="">All Work Types</option>' +
        allLabels.map(label => `<option value="${label}">${label}</option>`).join('');
}

function filterIssues() {
    const assigneeFilter = document.getElementById('filterAssignee').value;
    const labelFilter = document.getElementById('filterLabel').value;
    const stateFilter = document.getElementById('filterState').value;
    
    let filtered = allIssues;
    
    if (assigneeFilter) {
        filtered = filtered.filter(i => {
            const assignee = i.assignee ? i.assignee.login : 'Unassigned';
            return assignee === assigneeFilter;
        });
    }
    
    if (labelFilter) {
        filtered = filtered.filter(i => 
            i.labels.some(l => l.name === labelFilter)
        );
    }
    
    if (stateFilter !== 'all') {
        filtered = filtered.filter(i => i.state === stateFilter);
    }
    
    renderIssues(filtered);
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function showLoading() {
    document.getElementById('teamMembersContainer').innerHTML = '<p class="loading">Loading team data...</p>';
    document.getElementById('issuesContainer').innerHTML = '<p class="loading">Loading work items...</p>';
}

function showError(message) {
    const modal = document.getElementById('errorModal');
    document.getElementById('errorMessage').textContent = message;
    modal.classList.add('show');
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.classList.remove('show');
}
