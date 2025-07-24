#!/usr/bin/env python3
"""
Fix Orphaned Braces at Start of Files
====================================
"""

import os
import glob

def fix_orphaned_braces():
    """Fix files that start with orphaned closing braces."""
    print("🔧 Fixing orphaned braces...")
    
    # Find all TypeScript and TSX files
    file_patterns = ['src/**/*.ts', 'src/**/*.tsx']
    
    fixed_count = 0
    
    for pattern in file_patterns:
        for file_path in glob.glob(pattern, recursive=True):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                if lines and lines[0].strip() in ['}', '};']:
                    # Remove orphaned brace at start
                    lines = lines[1:]
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.writelines(lines)
                    
                    print(f"✅ Fixed: {file_path}")
                    fixed_count += 1
                    
            except Exception as e:
                print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"🎯 Fixed {fixed_count} files with orphaned braces")

if __name__ == "__main__":
    fix_orphaned_braces()
