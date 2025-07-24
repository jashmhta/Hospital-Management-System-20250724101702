#!/usr/bin/env python3
"""
Fix Remaining TypeScript Errors
===============================

This script addresses the specific remaining TypeScript compilation errors
identified in the type-check output.
"""

import os
import re
from typing import List

def fix_api_route_files():
    """Fix API route files with missing closing braces."""
    route_files = [
        'apps/hms-web/src/app/api/lis/orders/route.ts',
        'apps/hms-web/src/app/api/lis/reports/route.ts', 
        'apps/hms-web/src/app/api/lis/reports/[reportId]/route.ts',
        'apps/hms-web/src/app/api/radiology/requests/route.ts'
    ]
    
    for file_path in route_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Count braces
                open_braces = content.count('{')
                close_braces = content.count('}')
                
                if open_braces > close_braces:
                    missing = open_braces - close_braces
                    content += '\n' + '}' * missing
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    print(f"✅ Fixed missing braces in: {file_path}")
                    
            except Exception as e:
                print(f"❌ Error fixing {file_path}: {e}")

def fix_jsx_select_components():
    """Fix JSX Select components with missing closing tags."""
    jsx_files = [
        'apps/hms-web/src/components/er/er-registration-modal.tsx',
        'apps/hms-web/src/components/er/er-triage-form.tsx',
        'apps/hms-web/src/components/ipd/admission-form.tsx'
    ]
    
    for file_path in jsx_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Fix Select components - replace self-closing with proper closing
                content = re.sub(
                    r'<Select>\s*([^<]*)\s*/>', 
                    r'<Select>\1</Select>', 
                    content
                )
                
                # Fix orphaned braces at start
                lines = content.split('\n')
                while lines and lines[0].strip() in ['}', '};']:
                    lines.pop(0)
                
                # Ensure proper closing
                open_braces = content.count('{')
                close_braces = content.count('}')
                if open_braces > close_braces:
                    lines.append('}' * (open_braces - close_braces))
                
                new_content = '\n'.join(lines)
                
                if new_content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✅ Fixed JSX Select in: {file_path}")
                    
            except Exception as e:
                print(f"❌ Error fixing {file_path}: {e}")

def fix_patient_tracking_board():
    """Fix specific issues in patient tracking board component."""
    file_path = 'apps/hms-web/src/components/er-extracted/er-patient-tracking-board.tsx'
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix switch statement default case
            content = re.sub(
                r'default\s+return\s+<Badge>Unknown</Badge>',
                'default: return <Badge>Unknown</Badge>',
                content
            )
            
            # Fix array map ending syntax
            content = re.sub(
                r'\)\);\s*\n\s*\)\}',
                '))\n          )}\n        </div>\n      </CardContent>\n    </Card>\n  );\n}',
                content
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Fixed patient tracking board")
            
        except Exception as e:
            print(f"❌ Error fixing patient tracking board: {e}")

def fix_federation_file():
    """Fix the federation.ts file structure issues."""
    file_path = 'apps/api-gateway/src/federation.ts'
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # If the file has exports outside of a proper module structure
            if 'export interface FederationConfig' in content:
                # Check if it's properly structured
                lines = content.split('\n')
                
                # Find first export line
                first_export_line = -1
                for i, line in enumerate(lines):
                    if line.strip().startswith('export'):
                        first_export_line = i
                        break
                
                if first_export_line > 0:
                    # Check if there are orphaned declarations before exports
                    for i in range(first_export_line):
                        if lines[i].strip() in ['}', '};'] or 'var __DEV__' in lines[i]:
                            lines[i] = ''
                    
                    # Clean up empty lines
                    cleaned_lines = [line for line in lines if line.strip() or line == '\n']
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(cleaned_lines))
                    
                    print(f"✅ Fixed federation file structure")
            
        except Exception as e:
            print(f"❌ Error fixing federation file: {e}")

def add_route_interfaces():
    """Add missing RouteContext interfaces to API routes."""
    route_files_needing_interface = [
        'apps/hms-web/src/app/api/lis/orders/[orderId]/status/route.ts',
        'apps/hms-web/src/app/api/lis/reports/[reportId]/download/route.ts'
    ]
    
    interface_definition = """
interface RouteContext {
  params: { [key: string]: string };
}
"""
    
    for file_path in route_files_needing_interface:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'interface RouteContext' not in content and 'RouteContext' in content:
                    # Find where to insert interface (after imports)
                    lines = content.split('\n')
                    insert_index = 0
                    
                    for i, line in enumerate(lines):
                        if line.startswith('import ') or line.startswith('//'):
                            insert_index = i + 1
                        elif line.strip() == '':
                            continue
                        else:
                            break
                    
                    lines.insert(insert_index, interface_definition)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(lines))
                    
                    print(f"✅ Added RouteContext interface to: {file_path}")
                    
            except Exception as e:
                print(f"❌ Error adding interface to {file_path}: {e}")

def main():
    """Execute all remaining error fixes."""
    print("🔧 Fixing remaining TypeScript errors...")
    
    # Fix API route files
    fix_api_route_files()
    
    # Fix JSX Select components
    fix_jsx_select_components()
    
    # Fix patient tracking board
    fix_patient_tracking_board()
    
    # Fix federation file
    fix_federation_file()
    
    # Add route interfaces
    add_route_interfaces()
    
    print("\n✅ All remaining error fixes applied!")
    print("🔍 Run 'pnpm type-check' to verify fixes")

if __name__ == "__main__":
    main()
