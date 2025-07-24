#!/usr/bin/env python3
"""
Git Merge Conflict Resolution Script
Automatically resolves merge conflicts by choosing the master/main version 
while preserving file structure and functionality.
"""

import os
import re
import glob
from typing import List

def find_conflicted_files() -> List[str]:
    """Find all files with Git merge conflicts."""
    conflicted_files = []
    
    # Search for files containing conflict markers
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other unnecessary directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'coverage']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if '<<<<<<< HEAD' in content:
                            conflicted_files.append(file_path)
                except (UnicodeDecodeError, PermissionError):
                    continue
    
    return conflicted_files

def resolve_conflict(content: str) -> str:
    """
    Resolve merge conflicts by choosing the master version (after =======)
    and cleaning up conflict markers.
    """
    # Pattern to match conflict blocks
    conflict_pattern = r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> master'
    
    def replace_conflict(match):
        head_content = match.group(1)
        master_content = match.group(2)
        
        # Choose master content (after =======) as it's usually more recent
        return master_content
    
    # Replace all conflict blocks
    resolved = re.sub(conflict_pattern, replace_conflict, content, flags=re.DOTALL)
    
    # Clean up any remaining conflict markers that might not have been caught
    resolved = re.sub(r'<<<<<<< HEAD\n', '', resolved)
    resolved = re.sub(r'\n=======\n', '\n', resolved)
    resolved = re.sub(r'\n>>>>>>> master', '', resolved)
    
    # Clean up excessive newlines
    resolved = re.sub(r'\n{3,}', '\n\n', resolved)
    
    return resolved

def fix_typescript_syntax_errors(content: str) -> str:
    """Fix common TypeScript syntax errors that might result from conflict resolution."""
    
    # Fix semicolons that should be commas in object/array contexts
    content = re.sub(r'(\w+):\s*([^;,}]+);(\s*[}\]])', r'\1: \2\3', content)
    content = re.sub(r'(\w+):\s*([^;,}]+);(\s*\w+:)', r'\1: \2,\3', content)
    
    # Fix missing commas in object properties
    content = re.sub(r'([\'"][^\'";]+[\'"])\s*:\s*([^,};]+)\s*\n\s*([\'"][^\'";]+[\'"])\s*:', r'\1: \2,\n    \3:', content)
    
    return content

def main():
    """Main function to fix all merge conflicts."""
    print("🔍 Scanning for Git merge conflicts...")
    
    conflicted_files = find_conflicted_files()
    
    if not conflicted_files:
        print("✅ No merge conflicts found!")
        return
    
    print(f"📁 Found {len(conflicted_files)} files with conflicts:")
    for file_path in conflicted_files:
        print(f"  - {file_path}")
    
    print("\n🔧 Resolving conflicts...")
    
    fixed_count = 0
    for file_path in conflicted_files:
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Resolve conflicts
            resolved_content = resolve_conflict(original_content)
            
            # Apply TypeScript syntax fixes if it's a TS/JS file
            if file_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
                resolved_content = fix_typescript_syntax_errors(resolved_content)
            
            # Write back the resolved content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(resolved_content)
            
            print(f"✅ Fixed: {file_path}")
            fixed_count += 1
            
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"\n🎉 Successfully fixed {fixed_count} files!")
    print("\n📝 Next steps:")
    print("  1. Review the changes with 'git diff'")
    print("  2. Test the application with 'pnpm type-check'")
    print("  3. Run 'pnpm build' to verify everything compiles")
    print("  4. Commit the changes")

if __name__ == "__main__":
    main()
