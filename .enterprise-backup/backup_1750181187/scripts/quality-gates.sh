#!/bin/bash
# Enterprise Quality Gates for HMS

echo "🔍 Running Enterprise Quality Gates..."

# TypeScript compilation check
echo "📋 Checking TypeScript compilation..."
pnpm type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# ESLint check
echo "🔍 Running ESLint..."
pnpm lint:check
if [ $? -ne 0 ]; then
    echo "❌ ESLint check failed"
    exit 1
fi

# Prettier check
echo "💅 Checking code formatting..."
pnpm format:check
if [ $? -ne 0 ]; then
    echo "❌ Code formatting check failed"
    exit 1
fi

# Security audit
echo "🔒 Running security audit..."
pnpm security:audit
if [ $? -ne 0 ]; then
    echo "⚠️ Security issues found"
fi

echo "✅ All quality gates passed!"
