#!/usr/bin/env python3
"""
Workflow Fixer - Fixes GitHub Actions workflow issues
"""

import os
import re
import yaml
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class WorkflowFixer:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.fixes_applied = 0
        
    def fix_all_workflows(self):
        """Fix all workflow files"""
        logger.info("🔧 STARTING WORKFLOW FIXES...")
        
        workflow_dir = self.project_root / ".github" / "workflows"
        if not workflow_dir.exists():
            logger.error("No workflows directory found")
            return
        
        for workflow_file in workflow_dir.glob("*.yml"):
            try:
                self.fix_workflow_file(workflow_file)
            except Exception as e:
                logger.error(f"Error fixing {workflow_file.name}: {e}")
        
        logger.info(f"🎯 WORKFLOW FIXES COMPLETE - {self.fixes_applied} FIXES APPLIED")
    
    def fix_workflow_file(self, workflow_file: Path):
        """Fix a specific workflow file"""
        logger.info(f"🔧 Fixing {workflow_file.name}...")
        
        with open(workflow_file, 'r') as f:
            content = f.read()
        
        original_content = content
        
        # Fix common YAML issues
        content = self.fix_yaml_formatting(content)
        
        # Try to parse and validate
        try:
            workflow_data = yaml.safe_load(content)
            
            # Fix missing 'on' triggers
            if not workflow_data.get('on'):
                workflow_data['on'] = {
                    'push': {'branches': ['main', 'develop']},
                    'pull_request': {'branches': ['main', 'develop']}
                }
                logger.info(f"   ✅ Added missing 'on' trigger to {workflow_file.name}")
                self.fixes_applied += 1
            
            # Fix missing checkout steps
            jobs = workflow_data.get('jobs', {})
            for job_name, job_config in jobs.items():
                if self.fix_missing_checkout(job_name, job_config):
                    self.fixes_applied += 1
                    logger.info(f"   ✅ Added checkout step to job {job_name}")
            
            # Write back the fixed workflow
            with open(workflow_file, 'w') as f:
                yaml.dump(workflow_data, f, default_flow_style=False, sort_keys=False)
            
        except yaml.YAMLError as e:
            logger.error(f"YAML error in {workflow_file.name}: {e}")
            # Try to fix basic YAML syntax issues
            content = self.fix_yaml_syntax_issues(content)
            
            if content != original_content:
                with open(workflow_file, 'w') as f:
                    f.write(content)
                self.fixes_applied += 1
                logger.info(f"   ✅ Fixed YAML syntax in {workflow_file.name}")
    
    def fix_yaml_formatting(self, content: str) -> str:
        """Fix basic YAML formatting issues"""
        lines = content.split('\\n')
        fixed_lines = []
        
        for line in lines:
            # Fix indentation issues
            if line.strip() and not line.startswith('#'):
                # Ensure proper spacing around colons
                if ':' in line and not line.strip().startswith('http'):
                    line = re.sub(r'\\s*:\\s*', ': ', line)
                
                # Fix list items
                if line.strip().startswith('-') and not line.strip().startswith('- '):
                    line = line.replace('-', '- ', 1)
            
            fixed_lines.append(line)
        
        return '\\n'.join(fixed_lines)
    
    def fix_yaml_syntax_issues(self, content: str) -> str:
        """Fix common YAML syntax issues"""
        # Fix missing quotes for strings with special characters
        content = re.sub(r'name: ([^\\n]*[!@#$%^&*()][^\\n]*)', r'name: "\\1"', content)
        
        # Fix environment variable syntax
        content = re.sub(r'\\$\\{\\{ ([^}]+) \\}\\}', r'${{ \\1 }}', content)
        
        # Fix step names
        content = re.sub(r'- name: ([^\\n]*)', lambda m: f'- name: "{m.group(1).strip()}"' if not m.group(1).strip().startswith('"') else m.group(0), content)
        
        return content
    
    def fix_missing_checkout(self, job_name: str, job_config: dict) -> bool:
        """Fix missing checkout step in a job"""
        steps = job_config.get('steps', [])
        
        # Check if checkout step exists
        has_checkout = False
        for step in steps:
            if isinstance(step, dict):
                uses = step.get('uses', '')
                if 'checkout' in uses.lower():
                    has_checkout = True
                    break
        
        # Add checkout step if missing
        if not has_checkout and steps:
            checkout_step = {
                'name': 'Checkout Repository',
                'uses': 'actions/checkout@v4',
                'with': {
                    'fetch-depth': 0
                }
            }
            
            # Insert at the beginning
            steps.insert(0, checkout_step)
            job_config['steps'] = steps
            return True
        
        return False

if __name__ == "__main__":
    fixer = WorkflowFixer()
    fixer.fix_all_workflows()
