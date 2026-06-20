# setup.ps1 - Setup script for local Node.js environment
$ErrorActionPreference = "Stop"

# Create tools directory if it doesn't exist
$toolsDir = Join-Path $PSScriptRoot "tools"
if (-not (Test-Path $toolsDir)) {
    Write-Host "Creating tools directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$nodeDir = Join-Path $toolsDir "node"
$nodeExe = Join-Path $nodeDir "node.exe"

if (-not (Test-Path $nodeExe)) {
    Write-Host "Portable Node.js not found. Downloading v22.12.0..." -ForegroundColor Cyan
    $zipPath = Join-Path $toolsDir "node.zip"
    
    # Download Node.js zip
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.12.0/node-v22.12.0-win-x64.zip" -OutFile $zipPath
    
    Write-Host "Extracting Node.js archive..." -ForegroundColor Cyan
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir
    
    $extractedFolder = Join-Path $toolsDir "node-v22.12.0-win-x64"
    if (Test-Path $extractedFolder) {
        Rename-Item -Path $extractedFolder -NewName "node"
    }
    
    # Clean up zip
    Remove-Item $zipPath -Force
    Write-Host "Node.js installed successfully in tools\node." -ForegroundColor Green
} else {
    Write-Host "Portable Node.js is already installed." -ForegroundColor Green
}

# Verify installation
Write-Host "Verifying Node.js version..." -ForegroundColor Cyan
& $nodeExe -v

Write-Host "Setup Completed Successfully!" -ForegroundColor Green
