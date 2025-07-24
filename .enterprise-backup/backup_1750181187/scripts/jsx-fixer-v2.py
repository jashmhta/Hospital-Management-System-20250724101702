#!/usr/bin/env python3
"""
JSX Component Fixer V2
======================
"""

import os
import re

def fix_orphaned_braces(content):
    """Remove orphaned braces at start of files."""
    lines = content.split('\n')
    while lines and lines[0].strip() in ['}', '};']:
        lines.pop(0)
    return '\n'.join(lines)

def fix_switch_statements(content):
    """Fix switch statement syntax."""
    return re.sub(
        r'(default)\s+(return\s+<[^>]+>.*?</[^>]+>)',
        r'\1: \2',
        content
    )

def fix_jsx_attributes(content):
    """Fix malformed JSX attributes."""
    # Fix className with semicolons
    content = re.sub(r'className="([^"]*)";\\s*>', r'className="\1">', content)
    return content

def fix_component_structure(content):
    """Fix component structure."""
    # Ensure arrow function syntax
    content = re.sub(
        r'(export const \w+ = \([^)]*Props[^)]*\))\s*{',
        r'\1 => {',
        content
    )
    return content

def balance_braces(content):
    """Balance braces."""
    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces > close_braces:
        content += '\n' + '}' * (open_braces - close_braces)
    return content

def fix_jsx_file(file_path):
    """Fix a single JSX file."""
    if not os.path.exists(file_path):
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Apply fixes
        content = fix_orphaned_braces(content)
        content = fix_switch_statements(content)
        content = fix_jsx_attributes(content)
        content = fix_component_structure(content)
        content = balance_braces(content)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        else:
            print(f"ℹ️ No changes: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {file_path}: {e}")
        return False

def main():
    """Main execution."""
    print("🔧 Fixing JSX components...")
    
    jsx_files = [
        'apps/hms-web/src/components/er-extracted/er-patient-tracking-board.tsx',
        'apps/hms-web/src/components/er/er-dashboard-stats.tsx',
        'apps/hms-web/src/components/er/er-patient-tracking-board.tsx',
        'apps/hms-web/src/components/er/er-triage-form.tsx',
        'apps/hms-web/src/components/ipd/admission-form.tsx',
        'apps/hms-web/src/components/ipd/bed-management-dashboard.tsx',
        'apps/hms-web/src/components/ipd/discharge-summary.tsx',
        'apps/hms-web/src/components/ipd/ipd-patient-list.tsx',
        'apps/hms-web/src/components/ipd/medication-administration.tsx',
        'apps/hms-web/src/components/ipd/nursing-notes.tsx',
        'apps/hms-web/src/components/ipd/patient-progress-notes.tsx'
    ]
    
    fixed_count = 0
    for file_path in jsx_files:
        if fix_jsx_file(file_path):
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} JSX files")

if __name__ == "__main__":
    main()
