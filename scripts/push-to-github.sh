#!/usr/bin/env bash
# usage: ./push-to-github.sh "<commit message>" "<remote-url>" [branch]
set -euo pipefail

COMMIT_MSG="${1:-"chore: update project"}"
REMOTE_URL="${2:-}"
BRANCH="${3:-main}"

if [ -z "$REMOTE_URL" ]; then
  echo "Error: specify remote URL as second argument. Example:"
  echo "./push-to-github.sh \"feat: deploy\" https://github.com/username/repo.git main"
  exit 1
fi

# Stage all changes
git add .

# Commit (allow empty commit if nothing to commit)
git commit -m "$COMMIT_MSG" || echo "No changes to commit."

# Ensure local branch name
git branch --show-current >/dev/null 2>&1 || git checkout -b "$BRANCH"

# Set remote if not exists or update it
if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already exists. Updating URL..."
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# Push
git push -u origin "$BRANCH"

echo "Push completed to $REMOTE_URL (branch: $BRANCH)."
