# Interview Pass NexusJS - Quick Setup Script (PowerShell)
# Run in PowerShell to set up the monorepo locally

param(
    [switch]$SkipClone = $false
)

Write-Host "🚀 Interview Pass - NexusJS Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
$missing = @()

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $missing += "Git"
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $missing += "Node.js"
}

if ($missing) {
    Write-Host "❌ Missing prerequisites:" -ForegroundColor Red
    $missing | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Install from:" -ForegroundColor Yellow
    Write-Host "   - Git: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "   - Node.js: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites OK (git, node)" -ForegroundColor Green
Write-Host ""

# Install pnpm if needed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Cyan
    npm install -g pnpm
}

# Navigate to repo
if (-not $SkipClone -and -not (Test-Path "Interview-Pass-NexusJS")) {
    Write-Host "📥 Cloning Interview-Pass-NexusJS..." -ForegroundColor Cyan
    git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
}

if (Test-Path "Interview-Pass-NexusJS") {
    Set-Location "Interview-Pass-NexusJS"
} else {
    Write-Host "⚠️  Please run this script from the parent directory of Interview-Pass-NexusJS" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Directory Interview-Pass-NexusJS OK" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies (this may take a few minutes)..." -ForegroundColor Cyan
pnpm install

# Copy env template
if (-not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "📋 Copying .env.example to .env.local..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env.local"
    Write-Host "   ℹ️  Update .env.local with your credentials (Phase 2+)" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Run dev server:" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. To type-check & build:" -ForegroundColor White
Write-Host "   pnpm typecheck && pnpm build" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. For more info, see:" -ForegroundColor White
Write-Host "   - README.md" -ForegroundColor Yellow
Write-Host "   - docs/MIGRATION.md" -ForegroundColor Yellow
Write-Host "   - docs/legacy-inventory.md" -ForegroundColor Yellow
Write-Host ""
