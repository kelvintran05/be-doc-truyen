import os
import subprocess
import sys

# Configurations
MAX_BATCH_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB
MAX_BATCH_FILES = 80
REPO_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront"

def get_git_status():
    print("-> Fetching git status...")
    result = subprocess.run(
        ["git", "status", "--porcelain", "-uall"],
        cwd=REPO_DIR,
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout.splitlines()

def parse_line(line):
    if len(line) < 4:
        return None, None
    status = line[:2]
    path = line[3:].strip()
    # Strip quotes if git quoted the path
    if path.startswith('"') and path.endswith('"'):
        path = path[1:-1]
    
    # Handle escape sequences if any
    # Git core.quotepath is false, so it should be raw UTF-8, but let's be safe
    return status, path

def run_git_add(path):
    print(f"Staging: {path}")
    subprocess.run(["git", "add", path], cwd=REPO_DIR, check=True)

def run_git_commit(batch_num, count):
    msg = f"deploy: push chunk {batch_num} ({count} files)"
    print(f"-> Committing: {msg}")
    subprocess.run(["git", "commit", "-m", msg], cwd=REPO_DIR, check=True)

def run_git_push():
    print("-> Pushing to origin main...")
    subprocess.run(["git", "push", "-u", "origin", "main"], cwd=REPO_DIR, check=True)

def main():
    os.chdir(REPO_DIR)
    
    dry_run = "--dry-run" in sys.argv
    if dry_run:
        print("!!! DRY RUN MODE - No git stage, commit, or push will be executed !!!\n")

    lines = get_git_status()
    if not lines:
        print("-> No changes to push!")
        return

    print(f"-> Found {len(lines)} files to process.")
    
    current_batch_size = 0
    current_batch_files = []
    batch_counter = 22  # Start from chunk 22 since chunk 1 to 21 are already done and pushed previously
    
    for line in lines:
        status, path = parse_line(line)
        if not path:
            continue
        
        # Calculate file size
        file_size = 0
        full_path = os.path.join(REPO_DIR, path)
        if os.path.exists(full_path):
            file_size = os.path.getsize(full_path)
        
        # Check if adding this file exceeds limits
        will_exceed_size = (current_batch_size + file_size > MAX_BATCH_SIZE_BYTES)
        will_exceed_count = (len(current_batch_files) >= MAX_BATCH_FILES)
        
        if (will_exceed_size or will_exceed_count) and current_batch_files:
            # Commit and push current batch first
            print(f"\n--- Batch {batch_counter} Limit Reached (Size: {current_batch_size / (1024*1024):.2f}MB, Files: {len(current_batch_files)}) ---")
            if not dry_run:
                for p in current_batch_files:
                    run_git_add(p)
                run_git_commit(batch_counter, len(current_batch_files))
                run_git_push()
            else:
                print(f"[DRY-RUN] Would stage {len(current_batch_files)} files and push Batch {batch_counter}")
            
            # Reset batch
            current_batch_files = []
            current_batch_size = 0
            batch_counter += 1
        
        current_batch_files.append(path)
        current_batch_size += file_size

    # Push final batch
    if current_batch_files:
        print(f"\n--- Final Batch {batch_counter} (Size: {current_batch_size / (1024*1024):.2f}MB, Files: {len(current_batch_files)}) ---")
        if not dry_run:
            for p in current_batch_files:
                run_git_add(p)
            run_git_commit(batch_counter, len(current_batch_files))
            run_git_push()
            print("\n-> All batches pushed successfully!")
        else:
            print(f"[DRY-RUN] Would stage {len(current_batch_files)} files and push final Batch {batch_counter}")
            print("\n-> Dry run complete!")
    else:
        print("\n-> No remaining files to push.")

if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Git command failed: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)
