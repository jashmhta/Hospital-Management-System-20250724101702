#!/bin/bash

# Setup Husky Git Hooks for Enterprise Development
# This script ensures proper permissions and initialization

echo "🔧 Setting up Husky Git Hooks..."

# Create .husky directory if it doesn't exist
mkdir -p .husky

# Initialize Husky
npx husky install

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Type checking
echo "📝 Type checking..."
npm run type-check

# Linting with auto-fix
echo "🧹 Linting and formatting..."
npm run lint:fix

# Run unit tests
echo "🧪 Running unit tests..."
npm run test:unit

# Security audit
echo "🔒 Security audit..."
npm audit --audit-level moderate

# Check for secrets
echo "🔐 Checking for secrets..."
npx secretlint "**/*"

# Database schema validation
echo "🗄️ Validating database schema..."
npm run db:validate

echo "✅ Pre-commit checks completed!"
EOF

# Create commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📝 Validating commit message..."
npx commitlint --edit $1
EOF

# Create pre-push hook
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Integration tests
echo "🧪 Running integration tests..."
npm run test:integration

# Build check
echo "🔨 Build verification..."
npm run build

# Security scan
echo "🔒 Security scanning..."
npm run security:scan

# Performance tests (quick)
echo "⚡ Quick performance check..."
npm run test:performance:quick

echo "✅ Pre-push checks completed!"
EOF

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push

echo "✅ Husky setup completed successfully!"
echo "📋 Git hooks are now active:"
echo "   • pre-commit: Type check, lint, test, security audit"
echo "   • commit-msg: Conventional commit validation"
echo "   • pre-push: Integration tests, build, security scan"
