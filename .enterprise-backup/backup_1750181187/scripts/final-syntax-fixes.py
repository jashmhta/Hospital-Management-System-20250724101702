#!/usr/bin/env python3
"""
Final Targeted Syntax Fixes
===========================

This script addresses the remaining specific syntax issues identified in the TypeScript compilation.
It focuses on:
1. Missing closing braces in configuration objects
2. Orphaned opening/closing braces at file boundaries
3. Specific JSX component fixes
4. Route handler export fixes
"""

import os
import re
from typing import List, Tuple

def fix_orphaned_braces(content: str) -> Tuple[str, int]:
    """Remove orphaned braces at beginning/end of files."""
    fixes = 0
    
    # Remove orphaned closing braces at start of file
    lines = content.split('\n')
    while lines and lines[0].strip() in ['}', '};']:
        lines.pop(0)
        fixes += 1
    
    # Remove orphaned opening braces at end of file
    while lines and lines[-1].strip() in ['{']:
        lines.pop()
        fixes += 1
    
    return '\n'.join(lines), fixes

def fix_missing_closing_braces(content: str) -> Tuple[str, int]:
    """Fix missing closing braces in configuration objects."""
    fixes = 0
    
    # Fix pattern: array item followed by export without closing brace
    pattern = r'(\s+\],)\s*(export\s+default)'
    if re.search(pattern, content):
        content = re.sub(pattern, r'\1\n};\n\n\2', content)
        fixes += 1
    
    return content, fixes

def fix_jsx_semicolon_issues(content: str) -> Tuple[str, int]:
    """Fix JSX elements with semicolons in className attributes."""
    fixes = 0
    
    # Fix className attributes with semicolons
    pattern = r'className="([^"]*)";\s*>'
    matches = re.findall(pattern, content)
    if matches:
        content = re.sub(pattern, r'className="\1">', content)
        fixes += len(matches)
    
    return content, fixes

def fix_route_export_structure(content: str) -> Tuple[str, int]:
    """Fix route handler export structure issues."""
    fixes = 0
    
    # Check if this is a route file
    if 'export async const' in content and ('GET' in content or 'POST' in content or 'PUT' in content or 'DELETE' in content):
        # Count opening and closing braces in export functions
        export_pattern = r'export async const \w+ = \([^)]*\) => \{'
        matches = list(re.finditer(export_pattern, content))
        
        for match in matches:
            start = match.end() - 1  # Position of opening brace
            brace_count = 1
            pos = start + 1
            
            # Find the matching closing brace
            while pos < len(content) and brace_count > 0:
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                pos += 1
            
            # If we reached end of file without closing, add closing brace
            if brace_count > 0:
                content += '\n' + '}' * brace_count
                fixes += brace_count
    
    return content, fixes

def process_specific_files():
    """Process files with known specific issues."""
    fixes_applied = 0
    
    specific_files = [
        'apps/api-gateway/src/federation.ts',
        'apps/hms-web/src/components/er-extracted/er-dashboard-stats.tsx',
        'apps/hms-web/src/components/er-extracted/er-patient-tracking-board.tsx',
        'apps/hms-web/src/components/er/er-critical-alerts.tsx',
    ]
    
    for file_path in specific_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                total_fixes = 0
                
                content, fixes = fix_orphaned_braces(content)
                total_fixes += fixes
                
                content, fixes = fix_missing_closing_braces(content)
                total_fixes += fixes
                
                if file_path.endswith('.tsx'):
                    content, fixes = fix_jsx_semicolon_issues(content)
                    total_fixes += fixes
                
                if 'route.ts' in file_path:
                    content, fixes = fix_route_export_structure(content)
                    total_fixes += fixes
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ Fixed {total_fixes} issues in: {file_path}")
                    fixes_applied += total_fixes
                    
            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")
    
    return fixes_applied

def main():
    """Execute final targeted fixes."""
    print("🎯 Applying final targeted syntax fixes...")
    
    total_fixes = process_specific_files()
    
    print(f"\n🎉 Applied {total_fixes} final fixes!")
    print("\n📝 Next steps:")
    print("  1. Run 'pnpm type-check' to verify TypeScript compilation")
    print("  2. Run 'pnpm build' to test Next.js build")

if __name__ == "__main__":
    main()
