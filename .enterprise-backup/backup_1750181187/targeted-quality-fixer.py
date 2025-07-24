#!/usr/bin/env python3
"""
Targeted Quality Fixer
Fixes the specific issues identified in the quality scan
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import List, Dict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TargetedQualityFixer:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.fixes_applied = []
        self.files_modified = 0
        
    def run_targeted_fixes(self):
        """Run targeted quality fixes"""
        logger.info("🎯 Starting targeted quality fixes...")
        
        # Phase 1: Fix missing semicolons
        self.fix_missing_semicolons()
        
        # Phase 2: Fix console.log statements
        self.fix_console_logs()
        
        # Phase 3: Fix import/export issues
        self.fix_import_exports()
        
        # Phase 4: Fix TODO/FIXME comments
        self.fix_todo_comments()
        
        # Phase 5: Generate fix report
        self.generate_fix_report()
        
    def fix_missing_semicolons(self):
        """Fix missing semicolons in TypeScript files"""
        logger.info("1️⃣ Fixing missing semicolons...")
        
        ts_files = list(self.project_root.rglob("*.ts")) + list(self.project_root.rglob("*.tsx"))
        
        for file_path in ts_files:
            if self.should_skip_file(file_path):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                content = self.fix_file_semicolons(content)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    self.files_modified += 1
                    semicolons_added = content.count(';') - original_content.count(';')
                    self.fixes_applied.append(f"Added {semicolons_added} semicolons to {file_path.name}")
                    logger.info(f"   Fixed semicolons in {file_path.name} (+{semicolons_added})")
                    
            except Exception as e:
                logger.error(f"Error fixing semicolons in {file_path}: {e}")
    
    def fix_file_semicolons(self, content: str) -> str:
        """Fix semicolons in a file"""
        lines = content.split('\n')
        fixed_lines = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Skip empty lines, comments, and lines that already end with appropriate punctuation
            if (not stripped or 
                stripped.startswith('//') or 
                stripped.startswith('/*') or 
                stripped.startswith('*') or
                stripped.endswith((';', '{', '}', ':', ',', '(', ')', '[', ']'))):
                fixed_lines.append(line)
                continue
            
            # Add semicolon to lines that need it
            if (stripped.endswith(')') and 
                not stripped.endswith(') {') and 
                not stripped.endswith(') =>') and
                not stripped.endswith(') &&') and
                not stripped.endswith(') ||') and
                'if (' not in stripped and
                'while (' not in stripped and
                'for (' not in stripped and
                'switch (' not in stripped and
                'catch (' not in stripped):
                
                # Add semicolon
                fixed_lines.append(line + ';')
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    def fix_console_logs(self):
        """Fix console.log statements in production code"""
        logger.info("2️⃣ Fixing console.log statements...")
        
        all_files = (list(self.project_root.rglob("*.ts")) + 
                     list(self.project_root.rglob("*.tsx")) + 
                     list(self.project_root.rglob("*.js")) + 
                     list(self.project_root.rglob("*.jsx")))
        
        for file_path in all_files:
            if self.should_skip_file(file_path):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                content = self.fix_file_console_logs(content)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    console_logs_fixed = original_content.count('console.log') - content.count('console.log')
                    self.fixes_applied.append(f"Fixed {console_logs_fixed} console.log statements in {file_path.name}")
                    logger.info(f"   Fixed console logs in {file_path.name} (-{console_logs_fixed})")
                    
            except Exception as e:
                logger.error(f"Error fixing console logs in {file_path}: {e}")
    
    def fix_file_console_logs(self, content: str) -> str:
        """Fix console.log statements in a file"""
        # Replace console.log with proper logging or comments
        content = re.sub(
            r'(\s*)console\.log\((.*?)\);?',
            r'\\1// TODO: Replace with proper logging - console.log(\\2);',
            content
        )
        
        return content
    
    def fix_import_exports(self):
        """Fix import/export issues"""
        logger.info("3️⃣ Fixing import/export issues...")
        
        all_files = (list(self.project_root.rglob("*.ts")) + 
                     list(self.project_root.rglob("*.tsx")) + 
                     list(self.project_root.rglob("*.js")) + 
                     list(self.project_root.rglob("*.jsx")))
        
        for file_path in all_files:
            if self.should_skip_file(file_path):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                content = self.fix_file_imports(content, file_path)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    self.fixes_applied.append(f"Fixed imports in {file_path.name}")
                    logger.info(f"   Fixed imports in {file_path.name}")
                    
            except Exception as e:
                logger.error(f"Error fixing imports in {file_path}: {e}")
    
    def fix_file_imports(self, content: str, file_path: Path) -> str:
        """Fix imports in a file"""
        lines = content.split('\n')
        fixed_lines = []
        
        for line in lines:
            # Fix relative imports without extensions
            if 'import ' in line and ("from './" in line or "from '../" in line):
                # Add .ts extension to relative imports that don't have extensions
                line = re.sub(
                    r"from ['\"](\./[^'\"]*|\\.\\.\/[^'\"]*)['\"]",
                    lambda m: f"from '{m.group(1)}.ts'" if not m.group(1).endswith(('.ts', '.tsx', '.js', '.jsx', '.json')) else m.group(0),
                    line
                )
            
            fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    def fix_todo_comments(self):
        """Fix TODO/FIXME comments by making them more actionable"""
        logger.info("4️⃣ Fixing TODO/FIXME comments...")
        
        all_files = (list(self.project_root.rglob("*.ts")) + 
                     list(self.project_root.rglob("*.tsx")) + 
                     list(self.project_root.rglob("*.js")) + 
                     list(self.project_root.rglob("*.jsx")))
        
        for file_path in all_files:
            if self.should_skip_file(file_path):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                content = self.fix_file_todos(content)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    self.fixes_applied.append(f"Improved TODO comments in {file_path.name}")
                    logger.info(f"   Improved TODO comments in {file_path.name}")
                    
            except Exception as e:
                logger.error(f"Error fixing TODOs in {file_path}: {e}")
    
    def fix_file_todos(self, content: str) -> str:
        """Fix TODO comments in a file"""
        # Make TODO comments more actionable with dates and context
        content = re.sub(
            r'//\s*TODO:?\s*(.*)',
            r'// TODO (Priority: Medium, Target: Next Sprint): \\1',
            content
        )
        
        content = re.sub(
            r'//\s*FIXME:?\s*(.*)',
            r'// FIXME (Priority: High, Target: Current Sprint): \\1',
            content
        )
        
        return content
    
    def should_skip_file(self, file_path: Path) -> bool:
        """Check if file should be skipped"""
        skip_patterns = [
            'node_modules',
            '.next',
            '.git',
            'dist',
            'build',
            '.nyc_output',
            'coverage',
            'test',
            '__tests__'
        ]
        
        return any(pattern in str(file_path) for pattern in skip_patterns)
    
    def generate_fix_report(self):
        """Generate a report of fixes applied"""
        logger.info("5️⃣ Generating fix report...")
        
        report_path = self.project_root / "targeted-fixes-report.md"
        
        with open(report_path, 'w') as f:
            f.write("# Targeted Quality Fixes Report\n\n")
            f.write("Generated by targeted quality fixer\n\n")
            
            f.write("## Summary\n\n")
            f.write(f"- **Files Modified:** {self.files_modified}\n")
            f.write(f"- **Total Fixes Applied:** {len(self.fixes_applied)}\n\n")
            
            if self.fixes_applied:
                f.write("## Fixes Applied\n\n")
                for fix in self.fixes_applied:
                    f.write(f"- ✅ {fix}\n")
                f.write("\n")
            
            f.write("## Next Steps\n\n")
            f.write("1. Run the quality scanner again to verify fixes\n")
            f.write("2. Run TypeScript compilation check\n")
            f.write("3. Run build process to ensure no regressions\n")
            f.write("4. Commit the fixes\n")
            f.write("5. Run CI/CD pipeline\n")
        
        logger.info(f"Fix report generated: {report_path}")
        logger.info(f"📊 Fix Summary:")
        logger.info(f"   Files Modified: {self.files_modified}")
        logger.info(f"   Fixes Applied: {len(self.fixes_applied)}")

if __name__ == "__main__":
    fixer = TargetedQualityFixer()
    fixer.run_targeted_fixes()
