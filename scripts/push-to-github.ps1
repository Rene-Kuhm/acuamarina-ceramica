param(
  [string]$CommitMessage = "chore: update project",
  [string]$RemoteUrl,
  [string]$Branch = "main"
)

if (-not $RemoteUrl) {
  Write-Host "Specify remote URL: .\push-to-github.ps1 -CommitMessage 'msg' -RemoteUrl 'https://github.com/user/repo.git' -Branch main"
  exit 1
}

# Stage all
git add .

# Commit (ignore if nothing to commit)
try {
  git commit -m $CommitMessage
} catch {
  Write-Host "No changes to commit."
}

# Ensure branch
$current = git rev-parse --abbrev-ref HEAD
if (-not $current) {
  git checkout -b $Branch
}

# Set remote
$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Remote 'origin' exists. Updating URL..."
  git remote set-url origin $RemoteUrl
} else {
  git remote add origin $RemoteUrl
}

# Push
git push -u origin $Branch

Write-Host "Push completed to $RemoteUrl (branch: $Branch)."
