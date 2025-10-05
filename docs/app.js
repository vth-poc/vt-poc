// Main application logic
let allIssues = [];
let teamData = {};
let workTypeChart = null;
let teamCapacityChart = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadDashboardData();
    });

    document.getElementById('filterAssignee').addEventListener('change', filterIssues);
    document.getElementById('filterLabel').addEventListener('change', filterIssues);
    document.getElementById('filterState').addEventListener('change', filterIssues);
}

async function initializeDashboard() {
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
        updateLastUpdated();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError(`Failed to load data: ${error.message}`);
    }
}

async function fetchAllIssues() {
    try {
        // Fetch from pre-fetched static data (updated every 30 minutes by GitHub Actions)
        const response = await fetch('data/issues.json');
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Data file not found. Please run the GitHub Actions workflow first:\n\n1. Go to the "Actions" tab\n2. Select "Fetch Issues and Deploy Dashboard"\n3. Click "Run workflow"\n4. Wait 1-2 minutes and refresh this page');
            }
            throw new Error(`Could not load issues data (HTTP ${response.status}). The GitHub Action may not have run yet.`);
        }
        
        // Check if response has content
        const text = await response.text();
        if (!text || text.trim() === '') {
            throw new Error('Data file is empty. Please run the GitHub Actions workflow:\n\n1. Go to the "Actions" tab\n2. Select "Fetch Issues and Deploy Dashboard"\n3. Click "Run workflow"\n4. Wait 1-2 minutes and refresh this page');
        }
        
        // Parse JSON
        let issues;
        try {
            issues = JSON.parse(text);
        } catch (parseError) {
            throw new Error('Data file is corrupted. Please re-run the GitHub Actions workflow.');
        }
        
        // Validate that issues is an array
        if (!Array.isArray(issues)) {
            throw new Error('Invalid data format. Please re-run the GitHub Actions workflow.');
        }
        
        // Filter out pull requests (they appear in the issues endpoint)
        return issues.filter(issue => !issue.pull_request);
        
    } catch (error) {
        // Re-throw with better context
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
    }
}

function processTeamData() {
    teamData = {};
    
    allIssues.forEach(issue => {
        // Get assignee
        const assignee = issue.assignee ? issue.assignee.login : 'Unassigned';
        
        if (!teamData[assignee]) {
            teamData[assignee] = {
                name: assignee,
                avatar: issue.assignee ? issue.assignee.avatar_url : null,
                issues: [],
                workBreakdown: {
                    project: 0,
                    bau: 0,
                    bug: 0,
                    enhancement: 0,
                    other: 0,
                },
            };
        }
        
        teamData[assignee].issues.push(issue);
        
        // Categorize work type
        const workType = categorizeIssue(issue);
        teamData[assignee].workBreakdown[workType]++;
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
    const activeMembers = Object.keys(teamData).filter(member => member !== 'Unassigned').length;
    
    let projectCount = 0;
    let bauCount = 0;
    
    openIssues.forEach(issue => {
        const type = categorizeIssue(issue);
        if (type === 'project') projectCount++;
        if (type === 'bau') bauCount++;
    });
    
    document.getElementById('totalIssues').textContent = openIssues.length;
    document.getElementById('activeMembers').textContent = activeMembers;
    document.getElementById('projectCount').textContent = projectCount;
    document.getElementById('bauCount').textContent = bauCount;
}

function updateCharts() {
    updateWorkTypeChart();
    updateTeamCapacityChart();
}

function updateWorkTypeChart() {
    const openIssues = allIssues.filter(i => i.state === 'open');
    const typeCounts = {
        project: 0,
        bau: 0,
        bug: 0,
        enhancement: 0,
        other: 0,
    };
    
    openIssues.forEach(issue => {
        const type = categorizeIssue(issue);
        typeCounts[type]++;
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
    const openIssues = allIssues.filter(i => i.state === 'open');
    const teamMembers = Object.keys(teamData).filter(m => m !== 'Unassigned');
    const issueCounts = teamMembers.map(member => 
        teamData[member].issues.filter(i => i.state === 'open').length
    );
    
    const ctx = document.getElementById('teamCapacityChart').getContext('2d');
    
    if (teamCapacityChart) {
        teamCapacityChart.destroy();
    }
    
    teamCapacityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teamMembers,
            datasets: [{
                label: 'Open Issues',
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
                        <p>${openIssues} open, ${closedIssues} closed issues</p>
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
                </div>
            </div>
        `;
    }).join('');
}

function renderIssues(issues) {
    const container = document.getElementById('issuesContainer');
    
    if (issues.length === 0) {
        container.innerHTML = '<p class="loading">No issues found.</p>';
        return;
    }
    
    container.innerHTML = issues.map(issue => {
        const workType = categorizeIssue(issue);
        const assigneeName = issue.assignee ? issue.assignee.login : 'Unassigned';
        
        return `
            <div class="issue-item" style="border-left-color: ${CONFIG.COLORS[workType]}">
                <div class="issue-header">
                    <div>
                        <div class="issue-title">
                            <a href="${issue.html_url}" target="_blank">${issue.title}</a>
                            <span class="issue-number">#${issue.number}</span>
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
    // Update assignee filter
    const assigneeFilter = document.getElementById('filterAssignee');
    const assignees = [...new Set(allIssues.map(i => i.assignee ? i.assignee.login : 'Unassigned'))];
    
    assigneeFilter.innerHTML = '<option value="">All Team Members</option>' +
        assignees.map(assignee => `<option value="${assignee}">${assignee}</option>`).join('');
    
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

function updateLastUpdated() {
    // Try to get the last update time from the GitHub Actions workflow
    fetch('data/last-update.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('lastUpdated').textContent = `Data: ${text.trim()}`;
        })
        .catch(() => {
            // Fallback if the file doesn't exist yet
            const now = new Date();
            document.getElementById('lastUpdated').textContent = `Last Loaded: ${now.toLocaleString()}`;
        });
}

function showLoading() {
    document.getElementById('teamMembersContainer').innerHTML = '<p class="loading">Loading team data...</p>';
    document.getElementById('issuesContainer').innerHTML = '<p class="loading">Loading issues...</p>';
}

function showError(message) {
    const modal = document.getElementById('errorModal');
    const errorMessageDiv = document.getElementById('errorMessage');
    
    // Convert newlines to <br> tags for better formatting
    const formattedMessage = message.replace(/\n/g, '<br>');
    errorMessageDiv.innerHTML = formattedMessage;
    
    modal.classList.add('show');
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.classList.remove('show');
}
