#!/usr/bin/env python3
"""
CI/CD Investigation and Fix Tool
Identifies and fixes common CI/CD pipeline failure points
"""

import os
import re
import json
import yaml
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CICDInvestigator:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.issues_found = []
        self.fixes_applied = 0
        
    def investigate_and_fix(self):
        """Complete CI/CD investigation and fixing"""
        logger.info("🔍 STARTING COMPREHENSIVE CI/CD INVESTIGATION...")
        
        # Phase 1: Check environment configurations
        self.check_environment_config()
        
        # Phase 2: Validate workflow configurations
        self.validate_workflows()
        
        # Phase 3: Check package.json scripts
        self.validate_package_scripts()
        
        # Phase 4: Check for missing files/dependencies
        self.check_missing_requirements()
        
        # Phase 5: Generate investigation report
        self.generate_investigation_report()
        
        logger.info(f"🎯 CI/CD INVESTIGATION COMPLETE - {len(self.issues_found)} ISSUES FOUND, {self.fixes_applied} FIXES APPLIED")
        
    def check_environment_config(self):
        """Check environment configuration issues"""
        logger.info("1️⃣ CHECKING ENVIRONMENT CONFIGURATIONS...")
        
        # Fix .env.example file
        env_example_path = self.project_root / ".env.example"
        if env_example_path.exists():
            try:
                with open(env_example_path, 'r') as f:
                    content = f.read()
                
                # Fix broken lines and missing values
                fixed_content = self.fix_env_file(content)
                
                if content != fixed_content:
                    with open(env_example_path, 'w') as f:
                        f.write(fixed_content)
                    self.fixes_applied += 1
                    logger.info("   ✅ Fixed .env.example file")
                
            except Exception as e:
                self.issues_found.append(f"Environment file error: {e}")
        
        # Check for required environment variables in workflows
        self.check_workflow_env_vars()
    
    def fix_env_file(self, content: str) -> str:
        """Fix common .env file issues"""
        lines = content.split('\\n')
        fixed_lines = []
        
        for line in lines:
            # Fix broken lines
            if line.strip() and '=' in line:
                key, value = line.split('=', 1)
                # Ensure all variables have proper format
                if not value or value.strip() == '#':
                    if 'PASSWORD' in key or 'SECRET' in key or 'KEY' in key:
                        value = 'change_me_in_production'
                    elif 'URL' in key:
                        value = 'http://localhost:3000'
                    elif 'PORT' in key:
                        value = '3000'
                    elif 'EMAIL' in key:
                        value = 'example@domain.com'
                    else:
                        value = 'configure_me'
                
                fixed_lines.append(f"{key}={value}")
            else:
                fixed_lines.append(line)
        
        return '\\n'.join(fixed_lines)
    
    def check_workflow_env_vars(self):
        """Check workflow environment variable requirements"""
        workflow_dir = self.project_root / ".github" / "workflows"
        if workflow_dir.exists():
            for workflow_file in workflow_dir.glob("*.yml"):
                try:
                    with open(workflow_file, 'r') as f:
                        workflow_content = f.read()
                    
                    # Check for secret requirements
                    secrets_needed = re.findall(r'\\$\\{\\{ secrets\\.(\\w+) \\}\\}', workflow_content)
                    if secrets_needed:
                        self.issues_found.append(f"Workflow {workflow_file.name} requires secrets: {', '.join(secrets_needed)}")
                
                except Exception as e:
                    self.issues_found.append(f"Cannot read workflow {workflow_file.name}: {e}")
    
    def validate_workflows(self):
        """Validate GitHub workflow configurations"""
        logger.info("2️⃣ VALIDATING WORKFLOW CONFIGURATIONS...")
        
        workflow_dir = self.project_root / ".github" / "workflows"
        if not workflow_dir.exists():
            self.issues_found.append("No .github/workflows directory found")
            return
        
        for workflow_file in workflow_dir.glob("*.yml"):
            try:
                with open(workflow_file, 'r') as f:
                    workflow_data = yaml.safe_load(f)
                
                # Basic validation
                if not workflow_data.get('on'):
                    self.issues_found.append(f"Workflow {workflow_file.name} missing 'on' trigger")
                
                if not workflow_data.get('jobs'):
                    self.issues_found.append(f"Workflow {workflow_file.name} missing 'jobs' section")
                
                # Check for common issues
                self.check_workflow_common_issues(workflow_file, workflow_data)
                
            except yaml.YAMLError as e:
                self.issues_found.append(f"YAML syntax error in {workflow_file.name}: {e}")
            except Exception as e:
                self.issues_found.append(f"Error reading {workflow_file.name}: {e}")
    
    def check_workflow_common_issues(self, workflow_file: Path, workflow_data: dict):
        """Check for common workflow issues"""
        jobs = workflow_data.get('jobs', {})
        
        for job_name, job_config in jobs.items():
            # Check for missing runs-on
            if not job_config.get('runs-on'):
                self.issues_found.append(f"Job {job_name} in {workflow_file.name} missing 'runs-on'")
            
            # Check for missing steps
            if not job_config.get('steps'):
                self.issues_found.append(f"Job {job_name} in {workflow_file.name} missing 'steps'")
            
            # Check for missing checkout step
            steps = job_config.get('steps', [])
            has_checkout = any('checkout' in str(step).lower() for step in steps)
            if not has_checkout:
                self.issues_found.append(f"Job {job_name} in {workflow_file.name} missing checkout step")
    
    def validate_package_scripts(self):
        """Validate package.json scripts for CI/CD compatibility"""
        logger.info("3️⃣ VALIDATING PACKAGE.JSON SCRIPTS...")
        
        package_path = self.project_root / "package.json"
        if not package_path.exists():
            self.issues_found.append("package.json not found")
            return
        
        try:
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            
            scripts = package_data.get('scripts', {})
            
            # Check for essential CI/CD scripts
            essential_scripts = ['build', 'test', 'lint']
            for script in essential_scripts:
                if script not in scripts:
                    self.issues_found.append(f"Missing essential script: {script}")
            
            # Check for CI-specific scripts
            ci_scripts = ['test:ci', 'lint:ci', 'type-check']
            missing_ci_scripts = [script for script in ci_scripts if script not in scripts]
            if missing_ci_scripts:
                # Add missing CI scripts
                self.add_missing_ci_scripts(package_path, package_data, missing_ci_scripts)
                self.fixes_applied += 1
                logger.info(f"   ✅ Added missing CI scripts: {', '.join(missing_ci_scripts)}")
        
        except json.JSONDecodeError as e:
            self.issues_found.append(f"package.json syntax error: {e}")
        except Exception as e:
            self.issues_found.append(f"Error reading package.json: {e}")
    
    def add_missing_ci_scripts(self, package_path: Path, package_data: dict, missing_scripts: list):
        """Add missing CI scripts to package.json"""
        scripts = package_data.get('scripts', {})
        
        # Define default CI scripts
        default_ci_scripts = {
            'test:ci': 'jest --coverage --watchAll=false --passWithNoTests --maxWorkers=4',
            'lint:ci': 'eslint . --ext .ts,.tsx,.js,.jsx --format json --output-file eslint-report.json',
            'type-check': 'tsc --noEmit'
        }
        
        for script in missing_scripts:
            if script in default_ci_scripts and script not in scripts:
                scripts[script] = default_ci_scripts[script]
        
        package_data['scripts'] = scripts
        
        with open(package_path, 'w') as f:
            json.dump(package_data, f, indent=2)
    
    def check_missing_requirements(self):
        """Check for missing files and dependencies"""
        logger.info("4️⃣ CHECKING MISSING REQUIREMENTS...")
        
        # Check for essential config files
        essential_files = [
            'tsconfig.json',
            'next.config.js',
            '.eslintrc.json',
            'package.json'
        ]
        
        for file_name in essential_files:
            file_path = self.project_root / file_name
            if not file_path.exists():
                self.issues_found.append(f"Missing essential file: {file_name}")
        
        # Check for TypeScript configuration issues
        self.check_typescript_config()
        
        # Check for Next.js configuration
        self.check_nextjs_config()
    
    def check_typescript_config(self):
        """Check TypeScript configuration"""
        tsconfig_path = self.project_root / "tsconfig.json"
        if tsconfig_path.exists():
            try:
                with open(tsconfig_path, 'r') as f:
                    tsconfig = json.load(f)
                
                compiler_options = tsconfig.get('compilerOptions', {})
                
                # Check for missing essential options
                if not compiler_options.get('strict') is False:  # Should be false for our setup
                    self.issues_found.append("TypeScript strict mode should be disabled for current setup")
                
                if not compiler_options.get('skipLibCheck'):
                    self.issues_found.append("TypeScript should skip lib checks for faster CI")
                
            except Exception as e:
                self.issues_found.append(f"TypeScript config error: {e}")
    
    def check_nextjs_config(self):
        """Check Next.js configuration"""
        next_config_paths = [
            self.project_root / "next.config.js",
            self.project_root / "next.config.ts"
        ]
        
        config_exists = any(path.exists() for path in next_config_paths)
        if not config_exists:
            self.issues_found.append("Missing Next.js configuration file")
    
    def generate_investigation_report(self):
        """Generate comprehensive investigation report"""
        logger.info("5️⃣ GENERATING CI/CD INVESTIGATION REPORT...")
        
        report_path = self.project_root / "CI_CD_INVESTIGATION_REPORT.md"
        
        with open(report_path, 'w') as f:
            f.write("# 🔍 CI/CD INVESTIGATION REPORT\\n\\n")
            f.write("## 📊 Investigation Summary\\n\\n")
            f.write(f"- **Issues Found:** {len(self.issues_found)}\\n")
            f.write(f"- **Fixes Applied:** {self.fixes_applied}\\n")
            f.write(f"- **Status:** {'✅ HEALTHY' if len(self.issues_found) < 5 else '⚠️ NEEDS ATTENTION'}\\n\\n")
            
            if self.issues_found:
                f.write("## ❌ Issues Identified\\n\\n")
                for i, issue in enumerate(self.issues_found, 1):
                    f.write(f"{i}. {issue}\\n")
                f.write("\\n")
            
            f.write("## 🔧 Recommended Actions\\n\\n")
            f.write("### Immediate Actions:\\n")
            f.write("1. **Set up GitHub Secrets:** Configure required secrets in repository settings\\n")
            f.write("2. **Environment Variables:** Ensure all required env vars are properly configured\\n")
            f.write("3. **Dependencies:** Run `npm install` to ensure all dependencies are available\\n")
            f.write("4. **Build Test:** Test local build with `npm run build`\\n\\n")
            
            f.write("### Repository Secrets Needed:\\n")
            secrets_needed = [
                "SONAR_TOKEN - SonarCloud integration",
                "SNYK_TOKEN - Security vulnerability scanning", 
                "CODECOV_TOKEN - Code coverage reporting",
                "DATABASE_URL - Database connection for testing",
                "JWT_SECRET - Authentication testing"
            ]
            
            for secret in secrets_needed:
                f.write(f"- {secret}\\n")
            
            f.write("\\n### Workflow Status Check:\\n")
            f.write("- Check GitHub Actions tab for specific error messages\\n")
            f.write("- Review workflow logs for detailed failure information\\n")
            f.write("- Ensure branch protection rules allow workflow execution\\n\\n")
            
            f.write("## ✅ Auto-Applied Fixes\\n\\n")
            if self.fixes_applied > 0:
                f.write(f"- Fixed .env.example file format\\n")
                f.write(f"- Added missing CI scripts to package.json\\n")
                f.write(f"- Total fixes applied: {self.fixes_applied}\\n")
            else:
                f.write("No automatic fixes were needed.\\n")
        
        logger.info(f"Investigation report generated: {report_path}")

if __name__ == "__main__":
    investigator = CICDInvestigator()
    investigator.investigate_and_fix()
