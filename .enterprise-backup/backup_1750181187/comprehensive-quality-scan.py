#!/usr/bin/env python3
"""
Comprehensive Quality Scanner
Advanced code quality analysis without requiring full dependency installation
"""

import os
import re
import json
import subprocess
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Set
import ast

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComprehensiveQualityScanner:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.issues = []
        self.fixes = []
        self.summary = {
            'typescript_errors': 0,
            'syntax_errors': 0,
            'import_errors': 0,
            'linting_issues': 0,
            'build_issues': 0,
            'total_files_scanned': 0
        }
        
    def run_comprehensive_scan(self):
        """Run comprehensive quality scanning"""
        logger.info("🚀 Starting comprehensive quality scan...")
        
        # Phase 1: Syntax Analysis
        self.scan_typescript_syntax()
        
        # Phase 2: Import/Export Analysis
        self.scan_import_exports()
        
        # Phase 3: Build Configuration Analysis
        self.scan_build_configs()
        
        # Phase 4: Code Quality Analysis
        self.scan_code_quality()
        
        # Phase 5: CI/CD Analysis
        self.scan_cicd_configs()
        
        # Phase 6: Generate comprehensive report
        self.generate_comprehensive_report()
        
    def scan_typescript_syntax(self):
        """Scan TypeScript files for syntax errors"""
        logger.info("1️⃣ Scanning TypeScript syntax...")
        
        ts_files = list(self.project_root.rglob("*.ts")) + list(self.project_root.rglob("*.tsx"))
        
        for file_path in ts_files:
            if self.should_skip_file(file_path):
                continue
                
            self.summary['total_files_scanned'] += 1
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check for common syntax issues
                syntax_issues = self.check_typescript_syntax(content, file_path)
                if syntax_issues:
                    self.issues.extend(syntax_issues)
                    self.summary['typescript_errors'] += len(syntax_issues)
                    
            except Exception as e:
                error = f"Error reading {file_path}: {e}"
                self.issues.append(error)
                logger.error(error)
    
    def check_typescript_syntax(self, content: str, file_path: Path) -> List[str]:
        """Check TypeScript syntax issues"""
        issues = []
        lines = content.split('\\n')
        
        for i, line in enumerate(lines, 1):
            line_stripped = line.strip()
            
            # Check for common syntax errors
            if line_stripped.endswith('{') and not line_stripped.endswith('=> {'):
                next_line = lines[i] if i < len(lines) else ""
                if next_line.strip() and not next_line.strip().startswith('}'):
                    # Missing semicolon after statement before block
                    prev_line = lines[i-2] if i > 1 else ""
                    if prev_line.strip() and not prev_line.strip().endswith((';', '{', '}', ':')):
                        issues.append(f"{file_path}:{i-1} - Missing semicolon")
            
            # Check for double equals
            if ' == ' in line or ' != ' in line:
                issues.append(f"{file_path}:{i} - Use === or !== instead of == or !=")
            
            # Check for console.log in production code
            if 'console.log' in line and 'TODO' not in line:
                issues.append(f"{file_path}:{i} - Remove console.log from production code")
            
            # Check for any types
            if ': any' in line and not line_stripped.startswith('//'):
                issues.append(f"{file_path}:{i} - Avoid using 'any' type")
            
            # Check for unused variables (basic check)
            var_match = re.match(r'\\s*(const|let|var)\\s+(\\w+)', line)
            if var_match:
                var_name = var_match.group(2)
                if content.count(var_name) == 1:  # Only declared, never used
                    issues.append(f"{file_path}:{i} - Unused variable: {var_name}")
        
        return issues
    
    def scan_import_exports(self):
        """Scan import/export issues"""
        logger.info("2️⃣ Scanning import/export issues...")
        
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
                
                import_issues = self.check_import_issues(content, file_path)
                if import_issues:
                    self.issues.extend(import_issues)
                    self.summary['import_errors'] += len(import_issues)
                    
            except Exception as e:
                error = f"Import scan error in {file_path}: {e}"
                self.issues.append(error)
                logger.error(error)
    
    def check_import_issues(self, content: str, file_path: Path) -> List[str]:
        """Check import/export issues"""
        issues = []
        lines = content.split('\\n')
        
        imported_items = set()
        used_items = set()
        
        for i, line in enumerate(lines, 1):
            line_stripped = line.strip()
            
            # Extract imports
            if line_stripped.startswith('import ') and ' from ' in line:
                # Extract imported items
                import_match = re.search(r'import\\s+{([^}]+)}', line)
                if import_match:
                    items = [item.strip() for item in import_match.group(1).split(',')]
                    imported_items.update(items)
                
                # Check for missing file extensions in relative imports
                if "from './" in line or "from '../" in line:
                    path_match = re.search(r"from ['\\\"]([^'\\\"]+)['\\\"]", line)
                    if path_match:
                        import_path = path_match.group(1)
                        if not import_path.endswith(('.ts', '.tsx', '.js', '.jsx', '.json')):
                            issues.append(f"{file_path}:{i} - Missing file extension in import: {import_path}")
            
            # Check for usage of imported items
            for item in imported_items:
                if item in line and line != f"import {{ {item} }}":
                    used_items.add(item)
        
        # Check for unused imports
        unused_imports = imported_items - used_items
        for unused in unused_imports:
            issues.append(f"{file_path} - Unused import: {unused}")
        
        return issues
    
    def scan_build_configs(self):
        """Scan build configuration files"""
        logger.info("3️⃣ Scanning build configurations...")
        
        config_files = [
            'package.json',
            'tsconfig.json',
            'next.config.js',
            'next.config.ts',
            'tailwind.config.js',
            'tailwind.config.ts',
            'eslint.config.js',
            '.eslintrc.js',
            '.prettierrc.js'
        ]
        
        for config_file in config_files:
            config_path = self.project_root / config_file
            if config_path.exists():
                try:
                    config_issues = self.check_config_file(config_path)
                    if config_issues:
                        self.issues.extend(config_issues)
                        self.summary['build_issues'] += len(config_issues)
                except Exception as e:
                    error = f"Error checking {config_file}: {e}"
                    self.issues.append(error)
                    logger.error(error)
    
    def check_config_file(self, file_path: Path) -> List[str]:
        """Check configuration file issues"""
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if file_path.suffix == '.json':
                # Validate JSON syntax
                try:
                    json.loads(content)
                except json.JSONDecodeError as e:
                    issues.append(f"{file_path} - JSON syntax error: {e}")
            
            elif file_path.suffix == '.js' or file_path.suffix == '.ts':
                # Check for common JavaScript/TypeScript config issues
                if 'module.exports' in content and 'export default' in content:
                    issues.append(f"{file_path} - Mixed module.exports and export default")
                
                # Check for proper TypeScript configuration
                if 'tsconfig' in file_path.name:
                    if '"strict": false' in content:
                        issues.append(f"{file_path} - Consider enabling strict mode")
                    if '"noUnusedLocals": false' in content:
                        issues.append(f"{file_path} - Consider enabling noUnusedLocals")
        
        except Exception as e:
            issues.append(f"{file_path} - Error reading config: {e}")
        
        return issues
    
    def scan_code_quality(self):
        """Scan for code quality issues"""
        logger.info("4️⃣ Scanning code quality...")
        
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
                
                quality_issues = self.check_code_quality_issues(content, file_path)
                if quality_issues:
                    self.issues.extend(quality_issues)
                    self.summary['linting_issues'] += len(quality_issues)
                    
            except Exception as e:
                error = f"Quality scan error in {file_path}: {e}"
                self.issues.append(error)
                logger.error(error)
    
    def check_code_quality_issues(self, content: str, file_path: Path) -> List[str]:
        """Check code quality issues"""
        issues = []
        lines = content.split('\\n')
        
        for i, line in enumerate(lines, 1):
            line_stripped = line.strip()
            
            # Check for TODO/FIXME comments
            if 'TODO' in line_stripped or 'FIXME' in line_stripped:
                issues.append(f"{file_path}:{i} - TODO/FIXME comment needs attention")
            
            # Check for empty catch blocks
            if line_stripped == 'catch {' or line_stripped == 'catch () {':
                next_line = lines[i] if i < len(lines) else ""
                if next_line.strip() == '}':
                    issues.append(f"{file_path}:{i} - Empty catch block")
            
            # Check for hardcoded strings that should be constants
            if re.search(r'["\'][A-Z_]{3,}["\']', line) and 'const' not in line:
                issues.append(f"{file_path}:{i} - Consider using constants for hardcoded strings")
            
            # Check for long lines
            if len(line) > 120:
                issues.append(f"{file_path}:{i} - Line too long ({len(line)} characters)")
            
            # Check for missing error handling
            if 'fetch(' in line and 'catch' not in content[content.find(line):content.find(line) + 200]:
                issues.append(f"{file_path}:{i} - Missing error handling for fetch")
        
        return issues
    
    def scan_cicd_configs(self):
        """Scan CI/CD configuration files"""
        logger.info("5️⃣ Scanning CI/CD configurations...")
        
        workflow_dir = self.project_root / ".github" / "workflows"
        if workflow_dir.exists():
            for workflow_file in workflow_dir.glob("*.yml"):
                try:
                    with open(workflow_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    cicd_issues = self.check_cicd_issues(content, workflow_file)
                    if cicd_issues:
                        self.issues.extend(cicd_issues)
                        
                except Exception as e:
                    error = f"Error scanning {workflow_file}: {e}"
                    self.issues.append(error)
                    logger.error(error)
    
    def check_cicd_issues(self, content: str, file_path: Path) -> List[str]:
        """Check CI/CD configuration issues"""
        issues = []
        
        # Check for outdated action versions
        outdated_actions = {
            'actions/checkout@v2': 'actions/checkout@v4',
            'actions/checkout@v3': 'actions/checkout@v4',
            'actions/setup-node@v2': 'actions/setup-node@v4',
            'actions/setup-node@v3': 'actions/setup-node@v4',
            'actions/setup-java@v2': 'actions/setup-java@v4',
            'actions/setup-java@v3': 'actions/setup-java@v4'
        }
        
        for old_action, new_action in outdated_actions.items():
            if old_action in content:
                issues.append(f"{file_path} - Outdated action: {old_action} should be {new_action}")
        
        # Check for missing security practices
        if 'permissions:' not in content:
            issues.append(f"{file_path} - Missing permissions configuration")
        
        # Check for hardcoded secrets
        secret_patterns = [
            r'password\\s*:\\s*["\'][^"\']+["\']',
            r'token\\s*:\\s*["\'][^"\']+["\']',
            r'key\\s*:\\s*["\'][^"\']+["\']'
        ]
        
        for pattern in secret_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(f"{file_path} - Potential hardcoded secret")
        
        return issues
    
    def should_skip_file(self, file_path: Path) -> bool:
        """Check if file should be skipped"""
        skip_patterns = [
            'node_modules',
            '.next',
            '.git',
            'dist',
            'build',
            '.nyc_output',
            'coverage'
        ]
        
        return any(pattern in str(file_path) for pattern in skip_patterns)
    
    def generate_comprehensive_report(self):
        """Generate comprehensive quality report"""
        logger.info("6️⃣ Generating comprehensive report...")
        
        report_path = self.project_root / "comprehensive-quality-report.md"
        
        with open(report_path, 'w') as f:
            f.write("# Comprehensive Code Quality Report\\n\\n")
            f.write(f"Generated: {logger.info.__self__.name}\\n\\n")
            
            # Summary section
            f.write("## Summary\\n\\n")
            f.write(f"- **Total Files Scanned:** {self.summary['total_files_scanned']}\\n")
            f.write(f"- **TypeScript Errors:** {self.summary['typescript_errors']}\\n")
            f.write(f"- **Syntax Errors:** {self.summary['syntax_errors']}\\n")
            f.write(f"- **Import Errors:** {self.summary['import_errors']}\\n")
            f.write(f"- **Linting Issues:** {self.summary['linting_issues']}\\n")
            f.write(f"- **Build Issues:** {self.summary['build_issues']}\\n")
            
            total_issues = len(self.issues)
            f.write(f"- **Total Issues Found:** {total_issues}\\n\\n")
            
            # Quality score calculation
            if self.summary['total_files_scanned'] > 0:
                quality_score = max(0, 100 - (total_issues / self.summary['total_files_scanned'] * 10))
                f.write(f"## Quality Score: {quality_score:.1f}/100\\n\\n")
            
            # Issues section
            if self.issues:
                f.write("## Issues Found\\n\\n")
                
                # Group issues by type
                issue_groups = {}
                for issue in self.issues:
                    if ' - ' in issue:
                        issue_type = issue.split(' - ')[1].split(':')[0] if ':' in issue else issue.split(' - ')[1]
                    else:
                        issue_type = "General"
                    
                    if issue_type not in issue_groups:
                        issue_groups[issue_type] = []
                    issue_groups[issue_type].append(issue)
                
                for issue_type, issues in issue_groups.items():
                    f.write(f"### {issue_type} ({len(issues)} issues)\\n\\n")
                    for issue in issues[:10]:  # Limit to first 10 per type
                        f.write(f"- ⚠️ {issue}\\n")
                    if len(issues) > 10:
                        f.write(f"- ... and {len(issues) - 10} more\\n")
                    f.write("\\n")
            else:
                f.write("## 🎉 No Issues Found!\\n\\n")
                f.write("Your code quality is excellent!\\n\\n")
            
            # Recommendations section
            f.write("## Recommendations\\n\\n")
            f.write("1. Fix all TypeScript compilation errors\\n")
            f.write("2. Address import/export issues\\n")
            f.write("3. Resolve linting violations\\n")
            f.write("4. Update CI/CD configurations\\n")
            f.write("5. Run comprehensive tests\\n")
            f.write("6. Enable strict TypeScript mode\\n")
            f.write("7. Set up automated quality gates\\n")
        
        logger.info(f"Comprehensive report generated: {report_path}")
        logger.info(f"📊 Quality Summary:")
        logger.info(f"   Files Scanned: {self.summary['total_files_scanned']}")
        logger.info(f"   Total Issues: {len(self.issues)}")
        if self.summary['total_files_scanned'] > 0:
            quality_score = max(0, 100 - (len(self.issues) / self.summary['total_files_scanned'] * 10))
            logger.info(f"   Quality Score: {quality_score:.1f}/100")

if __name__ == "__main__":
    scanner = ComprehensiveQualityScanner()
    scanner.run_comprehensive_scan()
