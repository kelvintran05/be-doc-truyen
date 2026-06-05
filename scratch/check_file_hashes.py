import os
import hashlib
from collections import defaultdict

IMAGES_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/backend/public/cdn/images"

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

files = [f for f in os.listdir(IMAGES_DIR) if os.path.isfile(os.path.join(IMAGES_DIR, f)) and not f.startswith("._")]
print(f"Total image files: {len(files)}")

hashes = {}
duplicates = defaultdict(list)

for f in files:
    path = os.path.join(IMAGES_DIR, f)
    md5 = get_md5(path)
    if md5 in hashes:
        duplicates[md5].append(f)
    else:
        hashes[md5] = f

print(f"\nUnique image count by MD5: {len(hashes)}")
print(f"Duplicate groups found: {len(duplicates)}")

# Print some duplicates
for md5, dup_list in list(duplicates.items())[:10]:
    original = hashes[md5]
    print(f"MD5 {md5}: original '{original}' has duplicates: {dup_list}")
