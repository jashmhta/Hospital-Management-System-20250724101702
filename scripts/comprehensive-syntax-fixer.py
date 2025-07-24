#!/usr/bin/env python3
"""
Comprehensive Syntax Fixer for Hospital Management System
=====================================

This script provides enterprise-grade syntax error resolution for the HMS codebase.
It systematically identifies and fixes various categories of syntax issues that prevent
successful TypeScript compilation and Next.js builds.

Categories of fixes:
1. Comment syntax cleanup
2. Route handler function syntax
3. Global type declaration cleanup  
4. Object/array syntax normalization
5. JSX attribute and element fixes
6. Import/export statement corrections
"""

import os
import re
import logging
from typing import List, Dict, Tuple
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComprehensiveSyntaxFixer:
    """
    Enterprise-grade syntax fixer with comprehensive error detection and resolution.
    """
    
    def __init__(self):
        self.stats = {
            'files_processed': 0,
            'files_fixed': 0,
            'errors_found': 0,
            'errors_fixed': 0
        }
        
    def find_source_files(self) -> List[str]:
        """Find all TypeScript and JavaScript source files."""
        source_files = []
        
        # Define patterns for source files
        patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']
        exclude_dirs = {'node_modules', '.git', '.next', 'dist', 'coverage', '.nx'}
        
        for pattern in patterns:
            for file_path in Path('.').rglob(pattern):
                # Skip if in excluded directory
                if any(exclude_dir in file_path.parts for exclude_dir in exclude_dirs):
                    continue
                source_files.append(str(file_path))
        
        return sorted(source_files)
    
    def fix_comment_syntax(self, content: str) -> Tuple[str, int]:
        """Fix syntax errors in comments."""
        fixes_applied = 0
        
        # Remove semicolons at end of single-line comments
        before = content
        content = re.sub(r'(//[^;]*);(\s*$)', r'\1\2', content, flags=re.MULTILINE)
        if content != before:
            fixes_applied += 1
            
        # Fix comment blocks with syntax errors
        before = content
        content = re.sub(r'(/\*\*?[^*]*\*/)(\s*);', r'\1\2', content)
        if content != before:
            fixes_applied += 1
            
        return content, fixes_applied
    
    def fix_route_handler_syntax(self, content: str) -> Tuple[str, int]:
        """Fix Next.js API route handler syntax issues."""
        fixes_applied = 0
        
        # Fix export async const handlers that lost arrow functions
        patterns = [
            # Pattern: export async const GET = (params) {
            (r'(export\s+async\s+const\s+(?:GET|POST|PUT|DELETE|PATCH)\s*=\s*\([^)]*\))\s*{', r'\1 => {'),
            # Pattern: export const handler = async (params) {  
            (r'(export\s+const\s+\w+\s*=\s*async\s*\([^)]*\))\s*{', r'\1 => {'),
        ]
        
        for pattern, replacement in patterns:
            before = content
            content = re.sub(pattern, replacement, content)
            if content != before:
                fixes_applied += 1
                
        return content, fixes_applied
    
    def fix_global_declarations(self, content: str) -> Tuple[str, int]:
        """Remove misplaced global type declarations from component files."""
        fixes_applied = 0
        
        # Pattern to match global declarations that shouldn't be in component files
        global_patterns = [
            r'var\s+__DEV__:\s*boolean;?\s*',
            r'interface\s+Window\s*{[^}]*}\s*',
            r'namespace\s+NodeJS\s*{[^}]*}\s*',
            r'}\s*(?=import|export|\s*$)'  # Orphaned closing braces
        ]
        
        for pattern in global_patterns:
            before = content
            content = re.sub(pattern, '', content, flags=re.DOTALL)
            if content != before:
                fixes_applied += 1
                
        return content, fixes_applied
    
    def fix_object_array_syntax(self, content: str) -> Tuple[str, int]:
        """Fix object and array syntax issues."""
        fixes_applied = 0
        
        # Fix semicolons in Promise.all arrays
        before = content
        content = re.sub(
            r'(\w+\([^)]*\))\s*;\s*\n(\s*\]\s*\))',
            r'\1\n\2',
            content
        )
        if content != before:
            fixes_applied += 1
            
        # Fix object property semicolons that should be commas
        before = content
        content = re.sub(
            r'(\w+):\s*([^;,}]+);\s*\n(\s*)(\w+:)',
            r'\1: \2,\n\3\4',
            content
        )
        if content != before:
            fixes_applied += 1
            
        return content, fixes_applied
    
    def fix_jsx_attributes(self, content: str) -> Tuple[str, int]:
        """Fix JSX attribute syntax errors."""
        fixes_applied = 0
        
        # Fix JSX attributes with trailing semicolons
        before = content
        content = re.sub(r'(\w+="[^"]*");\s*(?=[>\s])', r'\1', content)
        if content != before:
            fixes_applied += 1
            
        # Fix className and other attribute syntax
        before = content
        content = re.sub(r'(className="[^"]*");\s*(?=>)', r'\1', content)
        if content != before:
            fixes_applied += 1
            
        return content, fixes_applied
    
    def fix_switch_statements(self, content: str) -> Tuple[str, int]:
        """Fix switch statement syntax in JSX components."""
        fixes_applied = 0
        
        # Fix switch cases missing colons
        before = content
        content = re.sub(r'(case\s+[^:]+)\s+(return)', r'\1: \2', content)
        if content != before:
            fixes_applied += 1
            
        before = content
        content = re.sub(r'(default)\s+(return)', r'\1: \2', content)
        if content != before:
            fixes_applied += 1
            
        return content, fixes_applied
    
    def fix_import_export_syntax(self, content: str) -> Tuple[str, int]:
        """Fix import/export statement syntax issues."""
        fixes_applied = 0
        
        # Fix trailing semicolons in export statements that shouldn't have them
        before = content
        content = re.sub(r'(export\s+\{[^}]+\})\s*;\s*from', r'\1 from', content)
        if content != before:
            fixes_applied += 1
            
        return content, fixes_applied
    
    def normalize_whitespace(self, content: str) -> Tuple[str, int]:
        """Normalize whitespace and remove excessive blank lines."""
        fixes_applied = 0
        
        # Remove excessive blank lines (more than 2 consecutive)
        before = content
        content = re.sub(r'\n{3,}', '\n\n', content)
        if content != before:
            fixes_applied += 1
            
        # Ensure files end with single newline
        if not content.endswith('\n'):
            content += '\n'
            fixes_applied += 1
            
        return content, fixes_applied
    
    def process_file(self, file_path: str) -> bool:
        """Process a single file and apply all fixes."""
        self.stats['files_processed'] += 1
        
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            total_fixes = 0
            
            # Apply all fix categories
            content, fixes = self.fix_comment_syntax(content)
            total_fixes += fixes
            
            content, fixes = self.fix_route_handler_syntax(content)
            total_fixes += fixes
            
            content, fixes = self.fix_global_declarations(content)
            total_fixes += fixes
            
            content, fixes = self.fix_object_array_syntax(content)
            total_fixes += fixes
            
            if file_path.endswith(('.tsx', '.jsx')):
                content, fixes = self.fix_jsx_attributes(content)
                total_fixes += fixes
                
                content, fixes = self.fix_switch_statements(content)
                total_fixes += fixes
            
            content, fixes = self.fix_import_export_syntax(content)
            total_fixes += fixes
            
            content, fixes = self.normalize_whitespace(content)
            total_fixes += fixes
            
            # Write back if changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.stats['files_fixed'] += 1
                self.stats['errors_fixed'] += total_fixes
                logger.info(f"✅ Fixed {total_fixes} issues in: {file_path}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Error processing {file_path}: {e}")
            return False
    
    def run(self):
        """Execute the comprehensive syntax fixing process."""
        logger.info("🔍 Starting comprehensive syntax analysis...")
        
        source_files = self.find_source_files()
        logger.info(f"📁 Found {len(source_files)} source files to analyze")
        
        logger.info("🔧 Applying enterprise-grade syntax fixes...")
        
        for file_path in source_files:
            self.process_file(file_path)
        
        # Print comprehensive summary
        self.print_summary()
    
    def print_summary(self):
        """Print detailed summary of fixes applied."""
        print("\n" + "="*80)
        print("COMPREHENSIVE SYNTAX FIXING SUMMARY")
        print("="*80)
        print(f"📊 Files Processed: {self.stats['files_processed']}")
        print(f"✅ Files Fixed: {self.stats['files_fixed']}")
        print(f"🔧 Total Errors Fixed: {self.stats['errors_fixed']}")
        print(f"📈 Success Rate: {(self.stats['files_fixed']/self.stats['files_processed']*100):.1f}%")
        print("\n🎯 NEXT STEPS:")
        print("  1. Run 'pnpm type-check' to verify TypeScript compilation")
        print("  2. Run 'pnpm build' to test Next.js build process")
        print("  3. Run 'pnpm lint' to check code quality")
        print("  4. Commit the fixes if successful")
        print("="*80)

def main():
    """Main execution function."""
    fixer = ComprehensiveSyntaxFixer()
    fixer.run()

if __name__ == "__main__":
    main()
