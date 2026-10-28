# Downloads the three background images from your current Figma site into .\assets
# Run once from this folder in PowerShell:  powershell -ExecutionPolicy Bypass -File .\download-assets.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path assets | Out-Null
$base = "https://gslikith.figma.site/_assets/v11"
Invoke-WebRequest "$base/7858deb713f19b0f38844569d37d354415616879.png" -OutFile "assets\education-bg.png"
Invoke-WebRequest "$base/f88b97a82d412e50d475a9e0361f74e42af9b263.png" -OutFile "assets\skills-bg.png"
Invoke-WebRequest "$base/7390deae480cf23e2c3e3a01d5947f2ea2eb88aa.png" -OutFile "assets\contact-bg.png"
Get-ChildItem assets
Write-Host "Done."
