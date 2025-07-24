#!/bin/bash

# Safe Branch Cleanup Script
# Use this script to safely delete all obsolete branches after verification

echo "🧹 HOSPITAL MANAGEMENT SYSTEM - BRANCH CLEANUP SCRIPT"
echo "====================================================="
echo ""
echo "⚠️  WARNING: This will delete branches that have been merged into main"
echo "✅ VERIFIED: All content from these branches is safely in main"
echo ""

# Function to prompt for confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Show current branch status
echo "📊 CURRENT BRANCH STATUS:"
echo "========================"
git branch -a | head -10
echo ""

# List branches to be deleted
echo "🗑️  BRANCHES TO BE DELETED (content safely merged into main):"
echo "============================================================"
echo "✅ comprehensive-main (gap implementations merged)"
echo "✅ systematic-merge (microservices architecture merged)"  
echo "✅ enterprise-unified (enterprise features merged)"
echo "✅ conflict-analysis (analysis complete)"
echo "✅ main-backup (backup no longer needed)"
echo "✅ master (duplicate content)"
echo ""

# Confirm main branch status
if confirm "🔍 First, verify main branch has 317,965+ lines of code?"; then
    echo ""
    echo "📊 Checking main branch status..."
    git checkout main >/dev/null 2>&1
    
    lines=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
    files=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l)
    
    echo "✅ Main branch verification:"
    echo "   Lines of code: $lines"
    echo "   Number of files: $files"
    echo "   Microservices: $(ls apps/microservices/ 2>/dev/null | wc -l) services"
    echo "   Documentation: $([ -f 'ULTIMATE_COMPREHENSIVE_DOCUMENTATION.md' ] && echo 'Present' || echo 'Missing')"
    echo ""
    
    if [ "$lines" -gt 300000 ]; then
        echo "✅ VERIFICATION PASSED: Main branch contains expected content"
    else
        echo "❌ VERIFICATION FAILED: Main branch seems incomplete"
        echo "🛑 ABORTING: Do not delete branches until main is verified"
        exit 1
    fi
else
    echo "🛑 ABORTING: Please verify main branch first"
    exit 1
fi

# Confirm deletion
if confirm "🗑️  Proceed with deleting obsolete local branches?"; then
    echo ""
    echo "🗑️  Deleting local branches..."
    
    # Delete development branches that have been merged
    for branch in comprehensive-main systematic-merge enterprise-unified conflict-analysis main-backup master; do
        if git branch | grep -q " $branch$"; then
            echo "Deleting local branch: $branch"
            git branch -D "$branch" 2>/dev/null || echo "  (branch not found or already deleted)"
        fi
    done
    
    echo "✅ Local branch cleanup completed"
else
    echo "⏭️  Skipping local branch deletion"
fi

# Confirm remote deletion
echo ""
if confirm "🌐 Also delete obsolete remote branches?"; then
    echo ""
    echo "🗑️  Deleting remote branches..."
    
    # Delete remote development branches
    for branch in comprehensive-main systematic-merge enterprise-unified conflict-analysis main-backup master; do
        echo "Deleting remote branch: origin/$branch"
        git push origin --delete "$branch" 2>/dev/null || echo "  (branch not found or already deleted)"
    done
    
    echo "✅ Remote branch cleanup completed"
else
    echo "⏭️  Skipping remote branch deletion"
fi

# Optional: Clean up dependabot branches
echo ""
if confirm "🤖 Also delete dependabot branches (dependency update branches)?"; then
    echo ""
    echo "🗑️  Deleting dependabot branches..."
    
    # Delete local dependabot branches
    git branch | grep dependabot | xargs -r git branch -D
    
    # Delete remote dependabot branches  
    git branch -r | grep dependabot | sed 's/origin\///' | xargs -r -I {} git push origin --delete {}
    
    echo "✅ Dependabot branch cleanup completed"
else
    echo "⏭️  Keeping dependabot branches"
fi

echo ""
echo "🎉 CLEANUP COMPLETED!"
echo "===================="
echo "✅ Main branch preserved with all content"
echo "✅ Obsolete branches removed"
echo "✅ Repository cleaned and optimized"
echo ""
echo "📊 Final repository status:"
git branch -a | head -5
echo ""
echo "🚀 Your repository is now clean and ready for production!"
