#!/bin/bash
# Interview Pass NexusJS - Quick Setup Script
# Run this to set up the monorepo locally

set -e

echo "🚀 Interview Pass - NexusJS Setup"
echo "=================================="
echo ""

# Check prerequisites
if ! command -v git &> /dev/null; then
  echo "❌ Git not found. Install from https://git-scm.com/"
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org/"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

echo "✅ Prerequisites OK (git, node, pnpm)"
echo ""

# Clone the new repo
if [ ! -d "Interview-Pass-NexusJS" ]; then
  echo "📥 Cloning Interview-Pass-NexusJS..."
  git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
  cd Interview-Pass-NexusJS
else
  cd Interview-Pass-NexusJS
  echo "✅ Directory Interview-Pass-NexusJS already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies (this may take a few minutes)..."
pnpm install

# Copy env template
if [ ! -f ".env.local" ]; then
  echo ""
  echo "📋 Copying .env.example to .env.local..."
  cp .env.example .env.local
  echo "   ℹ️  Update .env.local with your credentials (Phase 2+)"
else
  echo "✅ .env.local already exists"
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Run dev server:"
echo "   pnpm dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. To type-check & build:"
echo "   pnpm typecheck && pnpm build"
echo ""
echo "4. For more info, see:"
echo "   - README.md"
echo "   - docs/MIGRATION.md"
echo "   - docs/legacy-inventory.md"
echo ""
