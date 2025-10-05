# Example Issues Setup

This document provides examples of how to structure your GitHub issues for optimal dashboard visualization.

## Example 1: Project Work

**Title:** Implement User Authentication System

**Assignee:** @johndoe

**Labels:** `project`, `feature`

**Description:**
```markdown
## Overview
Build a complete authentication system for the application.

## Tasks
- [ ] Design database schema
- [ ] Implement user registration
- [ ] Implement login/logout
- [ ] Add password reset functionality
- [ ] Add 2FA support

## Acceptance Criteria
- Users can register with email
- Secure password hashing
- Session management
- Token-based authentication
```

---

## Example 2: BAU Support

**Title:** Weekly Database Backup and Maintenance

**Assignee:** @janedoe

**Labels:** `bau`, `maintenance`

**Description:**
```markdown
## Task
Perform weekly database maintenance tasks

## Activities
- Run database backup
- Check disk space
- Optimize tables
- Review slow query log
- Update monitoring dashboards

## Schedule
Every Monday morning
```

---

## Example 3: Bug Fix

**Title:** Login button not responsive on mobile devices

**Assignee:** @bobsmith

**Labels:** `bug`, `ui`

**Description:**
```markdown
## Bug Description
The login button doesn't respond to touch events on iOS devices.

## Steps to Reproduce
1. Open app on iPhone
2. Navigate to login page
3. Tap login button
4. Nothing happens

## Expected Behavior
Button should trigger login process

## Actual Behavior
Button doesn't respond to touch

## Environment
- Device: iPhone 13
- OS: iOS 16.4
- Browser: Safari
```

---

## Example 4: Enhancement

**Title:** Add dark mode to dashboard

**Assignee:** @alicejones

**Labels:** `enhancement`, `ui`

**Description:**
```markdown
## Enhancement Request
Add dark mode theme option to improve user experience in low-light environments.

## Proposed Changes
- Add theme toggle button
- Create dark mode color palette
- Persist user preference
- Update all components for dark mode support

## Benefits
- Better user experience
- Reduced eye strain
- Modern UI feature
```

---

## Example 5: Multiple Team Members on Project

**Title:** API Performance Optimization Sprint

**Assignee:** @teamlead

**Labels:** `project`, `performance`

**Description:**
```markdown
## Sprint Goal
Improve API response times by 50%

## Team
- @teamlead - Project coordination
- @dev1 - Database optimization
- @dev2 - Caching implementation
- @dev3 - Load testing

## Deliverables
- Optimized database queries
- Redis caching layer
- Load testing results
- Performance monitoring dashboard
```

**Note:** For the dashboard, only the primary assignee is tracked. Consider creating separate issues for individual tasks if you want granular tracking.

---

## Label Strategy Recommendations

### Recommended Labels to Create

1. **Work Type Labels** (used by dashboard):
   - `project` - Major features or initiatives
   - `bau` - Business as usual / recurring work
   - `bug` - Something is broken
   - `enhancement` - Improve existing feature
   - `feature` - New functionality

2. **Priority Labels**:
   - `priority-critical`
   - `priority-high`
   - `priority-medium`
   - `priority-low`

3. **Status Labels**:
   - `in-progress`
   - `blocked`
   - `ready-for-review`
   - `needs-testing`

4. **Domain Labels**:
   - `frontend`
   - `backend`
   - `database`
   - `infrastructure`
   - `documentation`

### Example Label Color Scheme

```
project:        #3b82f6 (blue)
bau:            #10b981 (green)
bug:            #ef4444 (red)
enhancement:    #f59e0b (orange)
feature:        #8b5cf6 (purple)

priority-critical: #dc2626 (dark red)
priority-high:     #f59e0b (orange)
priority-medium:   #eab308 (yellow)
priority-low:      #94a3b8 (gray)

in-progress:       #3b82f6 (blue)
blocked:           #dc2626 (red)
ready-for-review:  #8b5cf6 (purple)
needs-testing:     #f59e0b (orange)
```

## Dashboard Configuration for These Examples

Update your `docs/config.js`:

```javascript
const CONFIG = {
    GITHUB_REPO: 'your-org/your-repo',
    
    WORK_TYPES: {
        'project': ['project', 'feature', 'epic'],
        'bau': ['bau', 'maintenance', 'support'],
        'bug': ['bug', 'defect', 'issue'],
        'enhancement': ['enhancement', 'improvement'],
    },
};
```

## Tips for Effective Issue Management

1. **Assign Immediately**: Assign issues as soon as someone starts working on them
2. **Use Consistent Labels**: Stick to your label strategy for accurate categorization
3. **Keep Issues Updated**: Close issues when work is complete
4. **One Owner**: Use a single assignee for clearest capacity tracking
5. **Break Down Large Work**: Split epics into smaller, assignable issues
6. **Regular Review**: Review unassigned issues weekly in team meetings

## Sample Issue Queries

Use these GitHub search queries to audit your issues:

```
# Unassigned open issues
is:issue is:open no:assignee

# Issues without labels
is:issue is:open no:label

# Stale issues (no activity in 30 days)
is:issue is:open updated:<2024-09-01

# All project work
is:issue is:open label:project

# Team member's workload
is:issue is:open assignee:@username
```

---

**Pro Tip:** Use GitHub issue templates to ensure consistent issue creation with proper labels and structure!
