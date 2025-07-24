#!/usr/bin/env python3
"""
JSX Syntax Error Fixer
Fixes common JSX syntax errors that result from merge conflict resolution.
"""

import os
import re
from typing import List

def find_jsx_files() -> List[str]:
    """Find all JSX/TSX files."""
    jsx_files = []
    
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other unnecessary directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'coverage']]
        
        for file in files:
            if file.endswith(('.tsx', '.jsx')):
                file_path = os.path.join(root, file)
                jsx_files.append(file_path)
    
    return jsx_files

def fix_react_component_arrows(content: str) -> str:
    """Fix missing => in React functional components."""
    
    # Pattern: export const ComponentName = ({ props }: Type) {
    # Should be: export const ComponentName = ({ props }: Type) => {
    content = re.sub(
        r'(export const \w+\s*=\s*\([^)]*\)\s*:\s*\w+\s*)\s*{',
        r'\1 => {',
        content
    )
    
    # Pattern: export const ComponentName = ({ props }: Type) {
    # Should be: export const ComponentName = ({ props }: Type) => {  
    content = re.sub(
        r'(export const \w+\s*=\s*\([^)]*\s*:\s*[^)]*Props[^)]*\))\s*{',
        r'\1 => {',
        content
    )
    
    # Pattern: export const ComponentName = () {
    # Should be: export const ComponentName = () => {
    content = re.sub(
        r'(export const \w+\s*=\s*\(\s*\))\s*{',
        r'\1 => {',
        content
    )
    
    return content

def fix_jsx_attribute_syntax(content: str) -> str:
    """Fix JSX attribute syntax errors."""
    
    # Fix SVG attributes with semicolons: xmlns="..."; -> xmlns="..."
    content = re.sub(r'(\w+="[^"]*");', r'\1', content)
    
    # Fix className syntax: className="..."; -> className="..."
    content = re.sub(r'(className="[^"]*");', r'\1', content)
    
    # Fix other JSX attributes: prop="value"; -> prop="value"
    content = re.sub(r'(\w+="[^"]*");(\s*[>\n])', r'\1\2', content)
    
    return content

def fix_jsx_element_structure(content: str) -> str:
    """Fix JSX element structure issues."""
    
    # Fix malformed JSX elements like <svg> with attributes on separate lines
    # Replace pattern where <svg> is followed by attributes
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Check for opening JSX tag that might be incomplete
        if re.match(r'^\s*<(svg|div|span|path|line|circle)\s*>\s*$', line):
            # This is an opening tag, check next lines for attributes
            tag_match = re.match(r'^\s*<(\w+)\s*>\s*$', line)
            if tag_match:
                tag_name = tag_match.group(1)
                full_tag = f'<{tag_name}'
                j = i + 1
                
                # Collect attributes from following lines
                while j < len(lines) and not re.match(r'^\s*</', lines[j]):
                    next_line = lines[j].strip()
                    if re.match(r'^\w+="[^"]*"', next_line):
                        full_tag += f' {next_line}'
                        j += 1
                    elif next_line == '>':
                        full_tag += '>'
                        j += 1
                        break
                    else:
                        break
                
                fixed_lines.append(full_tag)
                i = j
                continue
        
        fixed_lines.append(lines[i])
        i += 1
    
    return '\n'.join(fixed_lines)

def fix_jsx_closing_syntax(content: str) -> str:
    """Fix JSX closing element syntax."""
    
    # Fix semicolons at end of JSX content: >Content; -> >Content
    content = re.sub(r'>([^<]*);(\s*</)', r'>\1\2', content)
    
    # Fix self-closing tags: <Component />; -> <Component />
    content = re.sub(r'(/>\s*);', r'\1', content)
    
    return content

def fix_function_parameter_syntax(content: str) -> str:
    """Fix function parameter syntax in destructuring."""
    
    # Fix patterns like: { prop1, prop2; } -> { prop1, prop2 }
    content = re.sub(r'{\s*([^}]*);(\s*}\s*:\s*\w+Props)', r'{ \1\2', content)
    
    return content

def fix_switch_statement_syntax(content: str) -> str:
    """Fix switch statement syntax in JSX."""
    
    # Fix switch cases that lost their colons
    content = re.sub(r'(case\s+[^:]+)\s+return', r'\1: return', content)
    content = re.sub(r'(default)\s+return', r'\1: return', content)
    
    return content

def main():
    """Main function to fix JSX syntax errors."""
    print("🔍 Scanning for JSX syntax errors...")
    
    jsx_files = find_jsx_files()
    
    print(f"📁 Found {len(jsx_files)} JSX/TSX files")
    print("🔧 Fixing JSX syntax errors...")
    
    fixed_count = 0
    for file_path in jsx_files:
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Apply fixes
            content = original_content
            content = fix_react_component_arrows(content)
            content = fix_jsx_attribute_syntax(content)
            content = fix_jsx_element_structure(content)
            content = fix_jsx_closing_syntax(content)
            content = fix_function_parameter_syntax(content)
            content = fix_switch_statement_syntax(content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"\n🎉 Successfully fixed {fixed_count} JSX files!")
    print("\n📝 Next steps:")
    print("  1. Run 'pnpm type-check' to verify fixes")
    print("  2. Check components manually for any remaining issues")
    print("  3. Commit the changes")

if __name__ == "__main__":
    main()
