#!/usr/bin/env bash
# Downloads the three background images from your current Figma site into ./assets
# Run once from this folder:  bash download-assets.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets
BASE="https://gslikith.figma.site/_assets/v11"
curl -fsSL "$BASE/7858deb713f19b0f38844569d37d354415616879.png" -o assets/education-bg.png
curl -fsSL "$BASE/f88b97a82d412e50d475a9e0361f74e42af9b263.png" -o assets/skills-bg.png
curl -fsSL "$BASE/7390deae480cf23e2c3e3a01d5947f2ea2eb88aa.png" -o assets/contact-bg.png
ls -lh assets
echo "Done."
