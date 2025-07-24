#!/usr/bin/env python3
"""
HMS Code Quality Fixer
Comprehensive code quality analysis and fixes for the Hospital Management System
"""

import os
import re
import json
import subprocess
import logging
from pathlib import Path
from typing import List, Dict, Tuple

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CodeQualityFixer:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.issues_found = []
        self.fixes_applied = []
        
    def run_comprehensive_fix(self):
        """Run comprehensive code quality fixes"""
        logger.info("🚀 Starting comprehensive code quality fixes...")
        
        # Phase 1: Fix package.json dependency conflicts
        self.fix_package_json_conflicts()
        
        # Phase 2: Fix TypeScript syntax errors
        self.fix_typescript_issues()
        
        # Phase 3: Fix import/export issues
        self.fix_import_export_issues()
        
        # Phase 4: Fix common code quality issues
        self.fix_common_issues()
        
        # Phase 5: Fix CI/CD workflow issues
        self.fix_cicd_workflow_issues()
        
        # Phase 6: Generate summary report
        self.generate_summary_report()
        
    def fix_package_json_conflicts(self):
        """Fix package.json dependency conflicts"""
        logger.info("1️⃣ Fixing package.json dependency conflicts...")
        
        package_json_path = self.project_root / "package.json"
        if not package_json_path.exists():
            logger.warning("package.json not found")
            return
            
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            # Fix known conflicts
            fixes = {
                "prom-client": "^13.2.0",  # Compatible with express-prometheus-middleware
                "express-prom-bundle": "^6.6.0",  # Compatible version
            }
            
            changes_made = False
            for dep, version in fixes.items():
                if dep in package_data.get("dependencies", {}):
                    old_version = package_data["dependencies"][dep]
                    package_data["dependencies"][dep] = version
                    logger.info(f"   Updated {dep}: {old_version} → {version}")
                    changes_made = True
                    
            if changes_made:
                with open(package_json_path, 'w') as f:
                    json.dump(package_data, f, indent=2)
                self.fixes_applied.append("Fixed package.json dependency conflicts")
                
        except Exception as e:
            logger.error(f"Error fixing package.json: {e}")
            self.issues_found.append(f"package.json error: {e}")
    
    def fix_typescript_issues(self):
        """Fix common TypeScript syntax and type errors"""
        logger.info("2️⃣ Fixing TypeScript issues...")
        
        ts_files = list(self.project_root.rglob("*.ts")) + list(self.project_root.rglob("*.tsx"))
        
        for file_path in ts_files:
            if "node_modules" in str(file_path) or ".next" in str(file_path):
                continue
                
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
                
                original_content = content
                
                # Fix common TypeScript issues
                content = self.fix_ts_syntax_errors(content)
                content = self.fix_ts_type_errors(content)
                content = self.fix_ts_import_errors(content)
                
                if content != original_content:
                    with open(file_path, 'w') as f:
                        f.write(content)
                    logger.info(f"   Fixed TypeScript issues in {file_path.name}")
                    self.fixes_applied.append(f"Fixed TypeScript issues in {file_path.name}")
                    
            except Exception as e:
                logger.error(f"Error processing {file_path}: {e}")
                self.issues_found.append(f"TypeScript error in {file_path.name}: {e}")
    
    def fix_ts_syntax_errors(self, content: str) -> str:
        """Fix common TypeScript syntax errors"""
        # Fix missing semicolons
        content = re.sub(r'(\w)\n', r'\1;\n', content)
        
        # Fix console.log in production (replace with proper logging)
        content = re.sub(r'console\.log\((.*?)\)', r'// TODO: Replace with proper logging - console.log(\1)', content)
        
        # Fix any/unknown types
        content = re.sub(r': any\b', r': unknown', content)
        
        # Fix == to ===
        content = re.sub(r'(\w+)\s*==\s*(\w+)', r'\1 === \2', content)
        content = re.sub(r'(\w+)\s*!=\s*(\w+)', r'\1 !== \2', content)
        
        return content
    
    def fix_ts_type_errors(self, content: str) -> str:
        """Fix common TypeScript type errors"""
        # Add proper type annotations for common patterns
        
        # Fix useState without type
        content = re.sub(
            r'useState\(\[\]\)',
            r'useState<any[]>([])',
            content
        )
        
        # Fix useState with null
        content = re.sub(
            r'useState\(null\)',
            r'useState<any | null>(null)',
            content
        )
        
        # Fix event handlers
        content = re.sub(
            r'const (\w+) = \((\w+)\) =>',
            r'const \1 = (\2: any) =>',
            content
        )
        
        return content
    
    def fix_ts_import_errors(self, content: str) -> str:
        """Fix common import/export errors"""
        # Fix relative imports without file extensions
        content = re.sub(
            r"from ['\"](\./[^'\"]*)['\"]",
            lambda m: f"from '{m.group(1)}.ts'" if not m.group(1).endswith(('.ts', '.tsx', '.js', '.jsx')) else m.group(0),
            content
        )
        
        return content
    
    def fix_import_export_issues(self):
        """Fix import/export issues across the codebase"""
        logger.info("3️⃣ Fixing import/export issues...")
        
        # Common issues and fixes
        all_files = list(self.project_root.rglob("*.ts")) + list(self.project_root.rglob("*.tsx")) + list(self.project_root.rglob("*.js")) + list(self.project_root.rglob("*.jsx"))
        
        for file_path in all_files:
            if "node_modules" in str(file_path) or ".next" in str(file_path):
                continue
                
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
                
                original_content = content
                
                # Fix unused imports
                content = self.remove_unused_imports(content)
                
                # Fix missing imports
                content = self.add_missing_imports(content)
                
                if content != original_content:
                    with open(file_path, 'w') as f:
                        f.write(content)
                    logger.info(f"   Fixed imports in {file_path.name}")
                    self.fixes_applied.append(f"Fixed imports in {file_path.name}")
                    
            except Exception as e:
                logger.error(f"Error fixing imports in {file_path}: {e}")
                self.issues_found.append(f"Import error in {file_path.name}: {e}")
    
    def remove_unused_imports(self, content: str) -> str:
        """Remove unused imports"""
        lines = content.split('\n')
        new_lines = []
        
        for line in lines:
            # Check if it's an import line
            if line.strip().startswith('import ') and ' from ' in line:
                # Extract imported items
                import_match = re.match(r'import\s+{([^}]+)}\s+from', line)
                if import_match:
                    imported_items = [item.strip() for item in import_match.group(1).split(',')]
                    # Check which items are actually used
                    used_items = [item for item in imported_items if item in content and content.count(item) > 1]
                    
                    if used_items:
                        if len(used_items) != len(imported_items):
                            # Reconstruct import with only used items
                            from_part = line.split(' from ')[1]
                            new_line = f"import {{ {', '.join(used_items)} }} from {from_part}"
                            new_lines.append(new_line)
                        else:
                            new_lines.append(line)
                    # else: skip the line (unused import)
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        
        return '\n'.join(new_lines)
    
    def add_missing_imports(self, content: str) -> str:
        """Add common missing imports"""
        # Common React imports
        if 'useState' in content and 'import React' not in content and 'from "react"' not in content:
            content = 'import React, { useState } from "react";\n' + content
        
        if 'useEffect' in content and 'useEffect' not in content[:200]:  # Check if not already imported
            content = content.replace('import React', 'import React, { useEffect }')
        
        return content
    
    def fix_common_issues(self):
        """Fix common code quality issues"""
        logger.info("4️⃣ Fixing common code quality issues...")
        
        # Fix specific file issues
        fixes = [
            self.fix_eslint_config,
            self.fix_prettier_config,
            self.fix_next_config,
            self.fix_env_files,
        ]
        
        for fix_func in fixes:
            try:
                fix_func()
            except Exception as e:
                logger.error(f"Error in {fix_func.__name__}: {e}")
                self.issues_found.append(f"Fix error in {fix_func.__name__}: {e}")
    
    def fix_eslint_config(self):
        """Fix ESLint configuration issues"""
        eslint_config_path = self.project_root / "eslint.config.js"
        
        if eslint_config_path.exists():
            with open(eslint_config_path, 'r') as f:
                content = f.read()
            
            # Ensure proper module.exports syntax
            if 'export default' in content and 'module.exports' not in content:
                content = content.replace('export default', 'module.exports =')
                
                with open(eslint_config_path, 'w') as f:
                    f.write(content)
                self.fixes_applied.append("Fixed ESLint config syntax")
    
    def fix_prettier_config(self):
        """Fix Prettier configuration"""
        prettier_config_path = self.project_root / ".prettierrc.js"
        
        if prettier_config_path.exists():
            with open(prettier_config_path, 'r') as f:
                content = f.read()
            
            # Ensure proper module.exports syntax
            if 'export default' in content and 'module.exports' not in content:
                content = content.replace('export default', 'module.exports =')
                
                with open(prettier_config_path, 'w') as f:
                    f.write(content)
                self.fixes_applied.append("Fixed Prettier config syntax")
    
    def fix_next_config(self):
        """Fix Next.js configuration issues"""
        next_config_path = self.project_root / "next.config.js"
        
        if next_config_path.exists():
            with open(next_config_path, 'r') as f:
                content = f.read()
            
            # Fix common Next.js config issues
            if 'module.exports' not in content and 'export default' in content:
                content = content.replace('export default', 'module.exports =')
                
                with open(next_config_path, 'w') as f:
                    f.write(content)
                self.fixes_applied.append("Fixed Next.js config syntax")
    
    def fix_env_files(self):
        """Fix environment file issues"""
        env_files = [".env", ".env.local", ".env.example"]
        
        for env_file in env_files:
            env_path = self.project_root / env_file
            if env_path.exists():
                with open(env_path, 'r') as f:
                    content = f.read()
                
                # Remove quotes around values that don't need them
                content = re.sub(r'^(\w+)="([^"]*)"$', r'\1=\2', content, flags=re.MULTILINE)
                
                # Ensure no spaces around =
                content = re.sub(r'^(\w+)\s*=\s*(.*)$', r'\1=\2', content, flags=re.MULTILINE)
                
                with open(env_path, 'w') as f:
                    f.write(content)
                self.fixes_applied.append(f"Fixed {env_file} formatting")
    
    def fix_cicd_workflow_issues(self):
        """Fix CI/CD workflow issues"""
        logger.info("5️⃣ Fixing CI/CD workflow issues...")
        
        workflow_dir = self.project_root / ".github" / "workflows"
        if not workflow_dir.exists():
            return
        
        for workflow_file in workflow_dir.glob("*.yml"):
            try:
                with open(workflow_file, 'r') as f:
                    content = f.read()
                
                original_content = content
                
                # Fix common YAML issues
                content = self.fix_yaml_issues(content)
                
                # Fix workflow-specific issues
                content = self.fix_workflow_specific_issues(content)
                
                if content != original_content:
                    with open(workflow_file, 'w') as f:
                        f.write(content)
                    logger.info(f"   Fixed workflow {workflow_file.name}")
                    self.fixes_applied.append(f"Fixed workflow {workflow_file.name}")
                    
            except Exception as e:
                logger.error(f"Error fixing workflow {workflow_file}: {e}")
                self.issues_found.append(f"Workflow error in {workflow_file.name}: {e}")
    
    def fix_yaml_issues(self, content: str) -> str:
        """Fix common YAML syntax issues"""
        # Fix indentation issues (basic)
        lines = content.split('\n')
        fixed_lines = []
        
        for line in lines:
            # Ensure consistent spacing
            if ':' in line and not line.strip().startswith('#'):
                key, value = line.split(':', 1)
                if value.strip():
                    fixed_lines.append(f"{key}: {value.strip()}")
                else:
                    fixed_lines.append(f"{key}:")
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    def fix_workflow_specific_issues(self, content: str) -> str:
        """Fix workflow-specific issues"""
        # Fix node version references
        content = re.sub(r'node-version:\s*["\']?(\d+)\.x["\']?', r'node-version: \1', content)
        
        # Fix action versions to specific versions instead of wildcards
        common_fixes = {
            'actions/checkout@v*': 'actions/checkout@v4',
            'actions/setup-node@v*': 'actions/setup-node@v4',
            'actions/setup-java@v*': 'actions/setup-java@v4',
            'actions/setup-python@v*': 'actions/setup-python@v5'
        }
        
        for old_ref, new_ref in common_fixes.items():
            content = re.sub(old_ref.replace('*', r'\d+'), new_ref, content)
        
        return content
    
    def generate_summary_report(self):
        """Generate a summary report of all fixes applied"""
        logger.info("6️⃣ Generating summary report...")
        
        report_path = self.project_root / "code-quality-fixes-report.md"
        
        with open(report_path, 'w') as f:
            f.write("# Code Quality Fixes Report\n\n")
            f.write(f"Generated: {logger.info.__self__.name}\n\n")
            
            f.write("## Fixes Applied\n\n")
            for fix in self.fixes_applied:
                f.write(f"- ✅ {fix}\n")
            
            f.write(f"\n**Total fixes applied:** {len(self.fixes_applied)}\n\n")
            
            if self.issues_found:
                f.write("## Issues Found (Requiring Manual Review)\n\n")
                for issue in self.issues_found:
                    f.write(f"- ⚠️ {issue}\n")
                f.write(f"\n**Total issues requiring review:** {len(self.issues_found)}\n\n")
            
            f.write("## Next Steps\n\n")
            f.write("1. Review all applied fixes\n")
            f.write("2. Run comprehensive tests\n")
            f.write("3. Address any remaining issues\n")
            f.write("4. Commit changes\n")
        
        logger.info(f"Summary report generated: {report_path}")
        logger.info(f"✅ Applied {len(self.fixes_applied)} fixes")
        logger.info(f"⚠️ Found {len(self.issues_found)} issues requiring review")

if __name__ == "__main__":
    fixer = CodeQualityFixer()
    fixer.run_comprehensive_fix()
