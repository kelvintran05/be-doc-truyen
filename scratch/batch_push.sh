#!/bin/bash
set -e

# Go to repo root
cd "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront"

# Total files to process (listing all untracked files individually)
total_files=$(git status --porcelain -uall | wc -l)
echo "-> Total files to batch push: $total_files"

# Small chunk size (25 files) to keep payload tiny (~10MB) and prevent GitHub HTTP 400 RPC errors
chunk_size=25
counter=1

while true; do
  unstaged_count=$(git status --porcelain -uall | wc -l)
  if [ "$unstaged_count" -eq 0 ]; then
    echo "-> No more changes to push!"
    break
  fi

  echo "----------------------------------------"
  echo "PROCESSING BATCH $counter ($unstaged_count files left)"
  echo "----------------------------------------"

  # Stage up to chunk_size files by cutting status prefix from individual untracked files
  git status --porcelain -uall | head -n "$chunk_size" | cut -c4- | while read -r file_path; do
    # Strip wrapping quotes if any
    file_path="${file_path%\"}"
    file_path="${file_path#\"}"
    if [ -n "$file_path" ]; then
      git add "$file_path" || echo "Warning: could not add $file_path"
    fi
  done

  staged_count=$(git diff --name-only --cached | wc -l)
  if [ "$staged_count" -eq 0 ]; then
    echo "-> No files were successfully staged in this batch. Exiting."
    break
  fi

  echo "-> Committing batch $counter ($staged_count files)..."
  git commit -m "deploy: push chunk $counter"

  echo "-> Pushing batch $counter to GitHub..."
  git push -u origin main

  counter=$((counter + 1))
  sleep 1
done

echo "-> Batch push complete!"
