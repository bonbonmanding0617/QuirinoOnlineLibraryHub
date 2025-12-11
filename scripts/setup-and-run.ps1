# PowerShell helper: installs deps, runs migrations, starts server, runs smoke tests
# Usage: Open PowerShell in project root and run: .\scripts\setup-and-run.ps1

param(
    [switch]$NoSmoke
)

function Check-Node {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        Write-Error "Node.js is not installed or not in PATH. Install Node 18+ from https://nodejs.org/"
        exit 1
    }
    $ver = node -v
    Write-Host "Node version: $ver"
}

Check-Node

Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed"; exit 1 }

Write-Host "Running migrations..."
npm run migrate
if ($LASTEXITCODE -ne 0) { Write-Error "migrations failed"; exit 1 }

Write-Host "Starting server (in background)..."
# Start the server in a new PowerShell window
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command','npm run dev' -WindowStyle Hidden
Start-Sleep -Seconds 2

if (-not $NoSmoke) {
    Write-Host "Running smoke tests..."
    npm run smoke
    if ($LASTEXITCODE -ne 0) { Write-Warning "Smoke tests failed" }
}

Write-Host "Setup complete. Server started and smoke tests executed (if enabled)."