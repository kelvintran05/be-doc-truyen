import sys
from pypdf import PdfReader

pdf_path = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/frontend/public/English for Kids/LV1/lv01-001_This Is My Body.pdf"

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    print(f"--- PAGE {i+1} ---")
    print(repr(text))
