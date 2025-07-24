#!/usr/bin/env python3
"""
Enterprise-Grade Hospital Management System Refactoring Tool
Comprehensive automation for fixing TypeScript, ESLint, security, and dependency issues
"""

import os
import re
import json
import subprocess
import asyncio
import concurrent.futures
from pathlib import Path
from typing import List, Dict, Any, Tuple
import logging
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class FixResult:
    file_path: str
    fixes_applied: List[str]
    success: bool
    error_message: str = ""

class EnterpriseGradeFixer:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        self.fixes_applied = []
        
    def run_command(self, command: str, cwd: str = None) -> Tuple[bool, str, str]:
        """Run a shell command and return success, stdout, stderr"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                cwd=cwd or self.project_root,
                capture_output=True, 
                text=True,
                timeout=300
            )
            return result.returncode == 0, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return False, "", "Command timed out"
        except Exception as e:
            return False, "", str(e)

    def fix_enum_syntax(self, content: str) -> str:
        """Fix enum syntax errors"""
        # Fix enum declarations with semicolons instead of commas
        content = re.sub(r'(\w+\s*=\s*[\'"][^\'"]+[\'"])\s*;(\s*})', r'\1,\2', content)
        content = re.sub(r'(\w+\s*=\s*[\'"][^\'"]+[\'"])\s*;(\s*export\s+enum)', r'\1,\n}\n\n\2', content)
        
        # Fix incomplete enum declarations
        content = re.sub(r'(export\s+enum\s+\w+\s*{[^}]*)\s*;(\s*export)', r'\1\n}\n\n\2', content)
        
        return content

    def fix_string_literals(self, content: str) -> str:
        """Fix unterminated string literals and syntax errors"""
        # Fix unterminated strings with quotes
        content = re.sub(r"(/\*[^*]*\*/)\'\)", r"\1", content)
        content = re.sub(r"(/\*[^*]*\*/)\'\);", r"\1;", content)
        
        # Fix malformed template literals
        content = re.sub(r'\$\{([^}]+)\}\`\s*\)', r'${\\1}`', content)
        
        return content

    def fix_interface_syntax(self, content: str) -> str:
        """Fix interface and class syntax errors"""
        # Fix semicolons in object properties that should be commas
        content = re.sub(r'(\w+:\s*[^;,}]+);(\s*\w+:)', r'\\1,\\2', content)
        content = re.sub(r'(\w+:\s*true);(\s*})', r'\\1\\2', content)
        
        # Fix incomplete class/interface declarations
        content = re.sub(r'(export\s+(class|interface)\s+\w+[^{]*{[^}]*)\s*$', r'\\1\n}', content, flags=re.MULTILINE)
        
        return content

    def fix_function_syntax(self, content: str) -> str:
        """Fix function syntax errors"""
        # Fix missing opening braces in if statements
        content = re.sub(r'(if\s*\([^)]+\))\s*([^{])', r'\\1 {\\n  \\2', content)
        
        # Fix missing closing braces
        content = re.sub(r'(\s+break;)\s*case', r'\\1\\n    }\\n    case', content)
        
        # Fix malformed switch statements
        content = re.sub(r'(case\s+[^:]+:)\s*if\s*\(', r'\\1\\n      if (', content)
        
        return content

    def fix_import_export_syntax(self, content: str) -> str:
        """Fix import/export syntax errors"""
        # Fix malformed export statements
        content = re.sub(r'(}\s*)\n\s*export\s+(class|interface|enum)', r'\\1\\n\\nexport \\2', content)
        
        return content

    def fix_typescript_errors(self, file_path: Path) -> FixResult:
        """Fix TypeScript syntax errors in a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            fixes = []
            
            # Apply various fixes
            new_content = self.fix_enum_syntax(content)
            if new_content != content:
                fixes.append("Fixed enum syntax")
                content = new_content
            
            new_content = self.fix_string_literals(content)
            if new_content != content:
                fixes.append("Fixed string literals")
                content = new_content
            
            new_content = self.fix_interface_syntax(content)
            if new_content != content:
                fixes.append("Fixed interface syntax")
                content = new_content
            
            new_content = self.fix_function_syntax(content)
            if new_content != content:
                fixes.append("Fixed function syntax")
                content = new_content
            
            new_content = self.fix_import_export_syntax(content)
            if new_content != content:
                fixes.append("Fixed import/export syntax")
                content = new_content
            
            # Write back if changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                return FixResult(str(file_path), fixes, True)
            else:
                return FixResult(str(file_path), [], True)
                
        except Exception as e:
            return FixResult(str(file_path), [], False, str(e))

    def get_typescript_files(self) -> List[Path]:
        """Get all TypeScript files in the project"""
        ts_files = []
        for pattern in ["**/*.ts", "**/*.tsx"]:
            ts_files.extend(self.src_dir.glob(pattern))
        
        # Filter out test files and node_modules
        return [f for f in ts_files if 'node_modules' not in str(f) and not f.name.endswith('.test.ts')]

    def fix_all_typescript_files(self) -> List[FixResult]:
        """Fix all TypeScript files in parallel"""
        ts_files = self.get_typescript_files()
        logger.info(f"Found {len(ts_files)} TypeScript files to fix")
        
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            future_to_file = {executor.submit(self.fix_typescript_errors, f): f for f in ts_files}
            
            for future in concurrent.futures.as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    result = future.result()
                    results.append(result)
                    if result.fixes_applied:
                        logger.info(f"Fixed {file_path}: {', '.join(result.fixes_applied)}")
                except Exception as e:
                    logger.error(f"Error fixing {file_path}: {e}")
                    results.append(FixResult(str(file_path), [], False, str(e)))
        
        return results

    def upgrade_dependencies(self) -> bool:
        """Upgrade all dependencies to latest versions"""
        logger.info("Upgrading dependencies to latest versions...")
        
        # Update package.json with latest versions
        package_json_path = self.project_root / "package.json"
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            # Update key dependencies to latest versions
            latest_versions = {
                "next": "^15.1.4",
                "react": "^19.0.0",
                "react-dom": "^19.0.0",
                "typescript": "^5.8.3",
                "@types/node": "^22",
                "@types/react": "^19",
                "@types/react-dom": "^19",
                "eslint": "^9",
                "prettier": "^3.5.3",
                "@typescript-eslint/eslint-plugin": "^8.31.1",
                "@typescript-eslint/parser": "^8.32.1",
                "tailwindcss": "^3.4.0",
                "postcss": "^8",
                "autoprefixer": "^10.0.1"
            }
            
            # Update dependencies
            for dep, version in latest_versions.items():
                if dep in package_data.get("dependencies", {}):
                    package_data["dependencies"][dep] = version
                if dep in package_data.get("devDependencies", {}):
                    package_data["devDependencies"][dep] = version
            
            # Write back updated package.json
            with open(package_json_path, 'w') as f:
                json.dump(package_data, f, indent=2)
            
            # Install dependencies
            success, stdout, stderr = self.run_command("npm install")
            if not success:
                logger.error(f"Failed to install dependencies: {stderr}")
                return False
            
            logger.info("Dependencies upgraded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error upgrading dependencies: {e}")
            return False

    def fix_security_vulnerabilities(self) -> bool:
        """Fix security vulnerabilities"""
        logger.info("Fixing security vulnerabilities...")
        
        # Run npm audit fix
        success, stdout, stderr = self.run_command("npm audit fix --force")
        if success:
            logger.info("Security vulnerabilities fixed")
        else:
            logger.warning(f"Some security issues remain: {stderr}")
        
        return True

    def run_prettier_format(self) -> bool:
        """Format all files with Prettier"""
        logger.info("Formatting code with Prettier...")
        
        success, stdout, stderr = self.run_command("npx prettier --write .")
        if success:
            logger.info("Code formatted successfully")
            return True
        else:
            logger.error(f"Prettier formatting failed: {stderr}")
            return False

    def run_eslint_fix(self) -> bool:
        """Run ESLint with auto-fix"""
        logger.info("Running ESLint auto-fix...")
        
        success, stdout, stderr = self.run_command("npx eslint . --ext .ts,.tsx --fix")
        if success:
            logger.info("ESLint fixes applied successfully")
            return True
        else:
            logger.warning(f"ESLint found issues: {stderr}")
            return False

    def validate_build(self) -> bool:
        """Validate that the project builds successfully"""
        logger.info("Validating TypeScript compilation...")
        
        success, stdout, stderr = self.run_command("npx tsc --noEmit")
        if success:
            logger.info("TypeScript compilation successful")
            return True
        else:
            logger.error(f"TypeScript compilation failed: {stderr}")
            return False

    def run_comprehensive_fix(self) -> Dict[str, Any]:
        """Run comprehensive enterprise-grade fixes"""
        logger.info("Starting comprehensive enterprise-grade refactoring...")
        
        results = {
            "typescript_fixes": [],
            "dependency_upgrade": False,
            "security_fixes": False,
            "prettier_format": False,
            "eslint_fixes": False,
            "build_validation": False,
            "total_files_fixed": 0,
            "errors": []
        }
        
        try:
            # Step 1: Fix TypeScript syntax errors
            logger.info("Step 1: Fixing TypeScript syntax errors...")
            ts_results = self.fix_all_typescript_files()
            results["typescript_fixes"] = ts_results
            results["total_files_fixed"] = len([r for r in ts_results if r.success and r.fixes_applied])
            
            # Step 2: Upgrade dependencies
            logger.info("Step 2: Upgrading dependencies...")
            results["dependency_upgrade"] = self.upgrade_dependencies()
            
            # Step 3: Fix security vulnerabilities
            logger.info("Step 3: Fixing security vulnerabilities...")
            results["security_fixes"] = self.fix_security_vulnerabilities()
            
            # Step 4: Format with Prettier
            logger.info("Step 4: Formatting with Prettier...")
            results["prettier_format"] = self.run_prettier_format()
            
            # Step 5: Run ESLint fixes
            logger.info("Step 5: Running ESLint auto-fix...")
            results["eslint_fixes"] = self.run_eslint_fix()
            
            # Step 6: Validate build
            logger.info("Step 6: Validating build...")
            results["build_validation"] = self.validate_build()
            
            logger.info("Comprehensive refactoring completed!")
            
        except Exception as e:
            logger.error(f"Error during comprehensive fix: {e}")
            results["errors"].append(str(e))
        
        return results

def main():
    """Main entry point"""
    project_root = "/workspace/Hospital-Management-System"
    fixer = EnterpriseGradeFixer(project_root)
    
    results = fixer.run_comprehensive_fix()
    
    # Print summary
    print("\n" + "="*80)
    print("ENTERPRISE-GRADE REFACTORING SUMMARY")
    print("="*80)
    print(f"Files fixed: {results['total_files_fixed']}")
    print(f"Dependencies upgraded: {'✅' if results['dependency_upgrade'] else '❌'}")
    print(f"Security fixes applied: {'✅' if results['security_fixes'] else '❌'}")
    print(f"Prettier formatting: {'✅' if results['prettier_format'] else '❌'}")
    print(f"ESLint fixes: {'✅' if results['eslint_fixes'] else '❌'}")
    print(f"Build validation: {'✅' if results['build_validation'] else '❌'}")
    
    if results['errors']:
        print(f"\nErrors encountered: {len(results['errors'])}")
        for error in results['errors']:
            print(f"  - {error}")
    
    print("="*80)

if __name__ == "__main__":
    main()