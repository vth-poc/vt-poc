# 🚨 Fixing "Failed to load issues" Error

## The Problem

You're seeing this error:
```
Failed to load data: Failed to load issues: Unexpected end of JSON input
```

**Cause**: The `data/issues.json` file doesn't exist yet because the GitHub Actions workflow hasn't run.

## The Solution

You need to run the GitHub Actions workflow to fetch the issues and create the data file.

### Step-by-Step Fix

#### 1. Go to Actions Tab

In your repository, click on the **Actions** tab at the top.

#### 2. Find the Workflow

Look for the workflow named **"Fetch Issues and Deploy Dashboard"** in the left sidebar.

#### 3. Run the Workflow

1. Click on "Fetch Issues and Deploy Dashboard"
2. Click the **"Run workflow"** button (top right)
3. Make sure `main` branch is selected
4. Click the green **"Run workflow"** button

#### 4. Wait for Completion

- The workflow will take 1-2 minutes to complete
- You'll see a yellow dot (running) → green checkmark (success)
- If you see a red X, click on it to see error logs

#### 5. Refresh the Dashboard

Once the workflow completes successfully:
1. Go back to your dashboard URL
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. The dashboard should now load!

## Troubleshooting

### Workflow Doesn't Appear

**Issue**: You don't see the workflow in the Actions tab.

**Fix**: The workflow file might not be in the right place. Check that `.github/workflows/deploy.yml` exists in your repository.

### Workflow Fails

**Issue**: Workflow runs but shows a red X.

**Common causes:**

1. **No issues in repository**
   - Solution: Create at least one issue
   
2. **Permissions error**
   - Solution: Go to Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"
   - Click Save

3. **GitHub Pages not enabled**
   - Solution: Go to Settings → Pages
   - Source: Select "GitHub Actions"
   - Click Save

### Still Getting JSON Error

**Issue**: Workflow succeeded but still getting the error.

**Fix**:
1. Check the workflow run logs:
   - Go to Actions → Click on the latest run
   - Click on "fetch-and-deploy" job
   - Look for "✅ Fetched X issues successfully"
   
2. If you see "Fetched 0 issues":
   - Create some issues in your repository
   - Re-run the workflow

3. Clear browser cache:
   - Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`
   - Or open in incognito/private window

## Verification

After running the workflow successfully, you should see:

1. ✅ Green checkmark in Actions tab
2. ✅ Dashboard loads without errors
3. ✅ "Data: Issues fetched at [timestamp]" in the header
4. ✅ Issues displayed in the dashboard

## Ongoing Updates

Once the initial workflow runs successfully:
- ✅ Workflow runs automatically every 30 minutes
- ✅ Dashboard data stays fresh
- ✅ No manual intervention needed

## Quick Commands

If you're comfortable with command line, you can trigger the workflow using GitHub CLI:

```bash
# Install GitHub CLI if you don't have it
# brew install gh  # macOS
# Or download from https://cli.github.com

# Login
gh auth login

# Trigger the workflow
gh workflow run deploy.yml

# Check status
gh run list --workflow=deploy.yml
```

## Need More Help?

1. Check workflow logs in Actions tab
2. Look for error messages
3. Ensure you have issues in your repository
4. Verify GitHub Pages is enabled
5. Check that workflow permissions are set correctly

---

**Once the workflow runs successfully, your dashboard will work perfectly! 🎉**
