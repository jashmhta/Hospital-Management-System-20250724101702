#!/usr/bin/env python3
"""
TypeScript Syntax Error Fixer
Fixes common TypeScript syntax errors that result from merge conflict resolution.
"""

import os
import re
import glob
from typing import List

def find_typescript_files() -> List[str]:
    """Find all TypeScript/JavaScript files."""
    ts_files = []
    
    # Search for TypeScript/JavaScript files
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other unnecessary directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'coverage']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                ts_files.append(file_path)
    
    return ts_files

def fix_arrow_function_syntax(content: str) -> str:
    """Fix missing arrow function syntax in route handlers."""
    
    # Fix export async const VERB = (params) { -> export async const VERB = (params) => {
    content = re.sub(
        r'(export async const \w+\s*=\s*\([^)]*\))\s*{',
        r'\1 => {',
        content
    )
    
    return content

def fix_promise_all_syntax(content: str) -> str:
    """Fix semicolons in Promise.all arrays that should be commas."""
    
    # Fix semicolons at end of Promise.all array items
    content = re.sub(
        r'(\w+\([^)]*\))\s*;\s*\n(\s*\]\);)',
        r'\1\n\2',
        content
    )
    
    # Fix semicolons in middle of Promise.all array items
    content = re.sub(
        r'(\w+\([^)]*\))\s*;\s*\n(\s*\w+\([^)]*\))',
        r'\1,\n\2',
        content
    )
    
    return content

def fix_object_property_syntax(content: str) -> str:
    """Fix semicolons in object properties that should be commas."""
    
    # Fix object properties with semicolons
    content = re.sub(
        r'(\w+):\s*([^;,}]+);\s*\n(\s*)(\w+:)',
        r'\1: \2,\n\3\4',
        content
    )
    
    # Fix last property in object with semicolon
    content = re.sub(
        r'(\w+):\s*([^;,}]+);\s*\n(\s*})',
        r'\1: \2\n\3',
        content
    )
    
    return content

def fix_jsx_syntax_errors(content: str) -> str:
    """Fix common JSX syntax errors."""
    
    # Fix incomplete JSX elements like <div; -> <div>
    content = re.sub(r'<(\w+);', r'<\1>', content)
    
    # Fix incomplete SVG elements like <svg; -> <svg>
    content = re.sub(r'<(svg|path|circle|rect|line);', r'<\1>', content)
    
    return content

def fix_try_catch_syntax(content: str) -> str:
    """Fix broken try-catch blocks."""
    
    # Fix isolated catch blocks by ensuring they follow try blocks
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check for isolated catch statement
        if re.match(r'\s*}\s*catch\s*\(', line):
            # Look backwards for the try block
            j = i - 1
            while j >= 0 and not re.search(r'\btry\b', lines[j]):
                j -= 1
            
            if j >= 0:
                # Found a try block, this is okay
                fixed_lines.append(line)
            else:
                # No try block found, wrap in try
                indent = re.match(r'(\s*)', line).group(1)
                fixed_lines.insert(-1, f'{indent}try {{')
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
        
        i += 1
    
    return '\n'.join(fixed_lines)

def fix_route_context_type(content: str) -> str:
    """Fix RouteContext type issues in Next.js route handlers."""
    
    # Add RouteContext type definition if missing
    if 'RouteContext' in content and 'interface RouteContext' not in content:
        import_section = content.split('\n')
        insert_index = 0
        
        # Find where to insert the type definition
        for i, line in enumerate(import_section):
            if line.startswith('import ') or line.startswith('export '):
                insert_index = i + 1
        
        type_def = """
interface RouteContext {
  params: { [key: string]: string };
}
"""
        
        content_lines = content.split('\n')
        content_lines.insert(insert_index, type_def)
        content = '\n'.join(content_lines)
    
    return content

def main():
    """Main function to fix TypeScript syntax errors."""
    print("🔍 Scanning for TypeScript syntax errors...")
    
    ts_files = find_typescript_files()
    
    print(f"📁 Found {len(ts_files)} TypeScript/JavaScript files")
    print("🔧 Fixing syntax errors...")
    
    fixed_count = 0
    for file_path in ts_files:
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Apply fixes
            content = original_content
            content = fix_arrow_function_syntax(content)
            content = fix_promise_all_syntax(content)
            content = fix_object_property_syntax(content)
            content = fix_jsx_syntax_errors(content)
            content = fix_try_catch_syntax(content)
            content = fix_route_context_type(content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"\n🎉 Successfully fixed {fixed_count} files!")
    print("\n📝 Next steps:")
    print("  1. Run 'pnpm type-check' to verify fixes")
    print("  2. Run 'pnpm build' to test compilation")
    print("  3. Review and commit changes")

if __name__ == "__main__":
    main()
