#!/usr/bin/env python3
"""
Route File Closure Fixer
=========================

This script specifically fixes missing closing braces in API route files.
Many route files are missing the final closing brace for their export functions.
"""

import os
import re
from pathlib import Path

def fix_route_file(file_path: str) -> bool:
    """Fix missing closing braces in a route file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern: function ends with error handling but missing final brace
        pattern = r'(\s+return\s+sendErrorResponse\([^)]+\);\s*\n\s*}\s*)$'
        
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1\n}', content)
            
            # Write back if changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
                
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Find and fix all route files with missing closures."""
    print("🔧 Fixing route file closures...")
    
    # Find all route.ts files
    route_files = []
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other unnecessary directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'coverage']]
        
        for file in files:
            if file == 'route.ts':
                route_files.append(os.path.join(root, file))
    
    fixed_count = 0
    for file_path in route_files:
        if fix_route_file(file_path):
            print(f"✅ Fixed: {file_path}")
            fixed_count += 1
    
    print(f"\n🎉 Fixed {fixed_count} route files!")

if __name__ == "__main__":
    main()
