#!/usr/bin/env python3
"""
Fix Async Function Syntax Errors
==============================
"""

import os
import glob
import re

def fix_async_syntax():
    """Fix async function syntax errors."""
    print("🔧 Fixing async function syntax...")
    
    # Find all TypeScript files
    file_patterns = ['src/**/*.ts', 'src/**/*.tsx']
    
    fixed_count = 0
    
    for pattern in file_patterns:
        for file_path in glob.glob(pattern, recursive=True):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Fix: export async const FUNC = (...) => {
                # To:  export const FUNC = async (...) => {
                pattern1 = r'export async const (\w+) = \('
                replacement1 = r'export const \1 = async ('
                
                new_content = re.sub(pattern1, replacement1, content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✅ Fixed: {file_path}")
                    fixed_count += 1
                    
            except Exception as e:
                print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"🎯 Fixed {fixed_count} files with async syntax errors")

if __name__ == "__main__":
    fix_async_syntax()
