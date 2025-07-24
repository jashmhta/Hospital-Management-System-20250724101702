#!/usr/bin/env python3
"""
Comprehensive Quality Scanner for Hospital Management System
Performs TypeScript, ESLint, Build, Security, and Advanced Quality Scans
"""

import subprocess
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
import time

class QualityScanner:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results = {
            'typescript_errors': [],
            'eslint_errors': [],
            'build_errors': [],
            'security_vulnerabilities': [],
            'test_failures': [],
            'format_issues': [],
            'summary': {}
        }
        
        # Create reports directory
        self.reports_dir = self.project_root / 'reports'
        self.reports_dir.mkdir(exist_ok=True)
        
    def run_command(self, command: List[str], capture_output=True, timeout=None) -> Dict[str, Any]:
        """Run a command and return results"""
        print(f"🔍 Running: {' '.join(command)}")
        
        try:
            result = subprocess.run(
                command,
                cwd=self.project_root,
                capture_output=capture_output,
                text=True,
                timeout=timeout
            )
            
            return {
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'stdout': '',
                'stderr': 'Command timed out',
                'returncode': -1
            }
        except Exception as e:
            return {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'returncode': -1
            }
    
    def scan_typescript(self):
        """Run TypeScript compilation checks"""
        print("\n🔍 TYPESCRIPT SCAN")
        print("=" * 50)
        
        # Standard TypeScript check
        result = self.run_command(['npx', 'tsc', '--noEmit'])
        if not result['success']:
            print("❌ TypeScript errors found:")
            print(result['stderr'])
            self.results['typescript_errors'].append({
                'type': 'compilation',
                'output': result['stderr']
            })
        
        # Enterprise TypeScript check
        result = self.run_command(['npx', 'pnpm', 'run', 'type-check:enterprise'])
        if not result['success']:
            print("❌ Enterprise TypeScript errors found:")
            print(result['stderr'])
            self.results['typescript_errors'].append({
                'type': 'enterprise',
                'output': result['stderr']
            })
        
        # Strict TypeScript check
        result = self.run_command(['npx', 'pnpm', 'run', 'type-check:strict'])
        if not result['success']:
            print("❌ Strict TypeScript errors found:")
            print(result['stderr'])
            self.results['typescript_errors'].append({
                'type': 'strict',
                'output': result['stderr']
            })
        
        if not self.results['typescript_errors']:
            print("✅ TypeScript compilation successful!")
    
    def scan_eslint(self):
        """Run ESLint scans"""
        print("\n🔍 ESLINT SCAN")
        print("=" * 50)
        
        # Standard ESLint
        result = self.run_command(['npx', 'pnpm', 'run', 'lint:check'])
        if not result['success']:
            print("❌ ESLint errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['eslint_errors'].append({
                'type': 'standard',
                'output': result['stdout'] + result['stderr']
            })
        
        # Enterprise ESLint
        result = self.run_command(['npx', 'pnpm', 'run', 'lint:enterprise'])
        if not result['success']:
            print("❌ Enterprise ESLint errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['eslint_errors'].append({
                'type': 'enterprise',
                'output': result['stdout'] + result['stderr']
            })
        
        # Security ESLint
        result = self.run_command(['npx', 'pnpm', 'run', 'lint:security'])
        if not result['success']:
            print("❌ Security ESLint errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['eslint_errors'].append({
                'type': 'security',
                'output': result['stdout'] + result['stderr']
            })
        
        # Generate ESLint report
        result = self.run_command(['npx', 'pnpm', 'run', 'lint:ci'])
        if os.path.exists(self.project_root / 'eslint-report.json'):
            with open(self.project_root / 'eslint-report.json', 'r') as f:
                eslint_json = json.load(f)
                total_errors = sum(len(file['messages']) for file in eslint_json)
                if total_errors > 0:
                    print(f"❌ ESLint JSON report: {total_errors} issues found")
                    self.results['eslint_errors'].append({
                        'type': 'json_report',
                        'count': total_errors,
                        'data': eslint_json
                    })
        
        if not self.results['eslint_errors']:
            print("✅ ESLint scan passed!")
    
    def scan_build(self):
        """Run build scans"""
        print("\n🔍 BUILD SCAN")
        print("=" * 50)
        
        # Standard build
        result = self.run_command(['npx', 'pnpm', 'run', 'build'])
        if not result['success']:
            print("❌ Build errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['build_errors'].append({
                'type': 'standard',
                'output': result['stdout'] + result['stderr']
            })
        
        # Production build
        result = self.run_command(['npx', 'pnpm', 'run', 'build:production'])
        if not result['success']:
            print("❌ Production build errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['build_errors'].append({
                'type': 'production',
                'output': result['stdout'] + result['stderr']
            })
        
        # Secure build
        result = self.run_command(['npx', 'pnpm', 'run', 'build:secure'])
        if not result['success']:
            print("❌ Secure build errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['build_errors'].append({
                'type': 'secure',
                'output': result['stdout'] + result['stderr']
            })
        
        if not self.results['build_errors']:
            print("✅ Build scan passed!")
    
    def scan_security(self):
        """Run security scans"""
        print("\n🔍 SECURITY SCAN")
        print("=" * 50)
        
        # NPM Audit
        result = self.run_command(['npm', 'audit', '--json'])
        if result['stdout']:
            try:
                audit_data = json.loads(result['stdout'])
                vulnerabilities = audit_data.get('vulnerabilities', {})
                if vulnerabilities:
                    print(f"❌ NPM Audit found {len(vulnerabilities)} vulnerabilities")
                    self.results['security_vulnerabilities'].append({
                        'type': 'npm_audit',
                        'data': audit_data
                    })
            except json.JSONDecodeError:
                if 'found 0 vulnerabilities' not in result['stdout']:
                    print("❌ NPM Audit errors:")
                    print(result['stdout'])
                    self.results['security_vulnerabilities'].append({
                        'type': 'npm_audit_error',
                        'output': result['stdout']
                    })
        
        # Security scan with custom script
        result = self.run_command(['npx', 'pnpm', 'run', 'security:scan:full'])
        if not result['success']:
            print("❌ Full security scan errors found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['security_vulnerabilities'].append({
                'type': 'full_scan',
                'output': result['stdout'] + result['stderr']
            })
        
        if not self.results['security_vulnerabilities']:
            print("✅ Security scan passed!")
    
    def scan_tests(self):
        """Run test scans"""
        print("\n🔍 TEST SCAN")
        print("=" * 50)
        
        # Unit tests
        result = self.run_command(['npx', 'pnpm', 'run', 'test:ci'])
        if not result['success']:
            print("❌ Test failures found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['test_failures'].append({
                'type': 'unit',
                'output': result['stdout'] + result['stderr']
            })
        
        # Enterprise tests
        result = self.run_command(['npx', 'pnpm', 'run', 'test:unit'])
        if not result['success']:
            print("❌ Enterprise test failures found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['test_failures'].append({
                'type': 'enterprise',
                'output': result['stdout'] + result['stderr']
            })
        
        if not self.results['test_failures']:
            print("✅ Test scan passed!")
    
    def scan_format(self):
        """Run format scans"""
        print("\n🔍 FORMAT SCAN")
        print("=" * 50)
        
        # Prettier check
        result = self.run_command(['npx', 'pnpm', 'run', 'format:check'])
        if not result['success']:
            print("❌ Format issues found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['format_issues'].append({
                'type': 'prettier',
                'output': result['stdout'] + result['stderr']
            })
        
        # Enterprise format check
        result = self.run_command(['npx', 'pnpm', 'run', 'prettier:check:enterprise'])
        if not result['success']:
            print("❌ Enterprise format issues found:")
            print(result['stdout'])
            print(result['stderr'])
            self.results['format_issues'].append({
                'type': 'enterprise',
                'output': result['stdout'] + result['stderr']
            })
        
        if not self.results['format_issues']:
            print("✅ Format scan passed!")
    
    def generate_summary(self):
        """Generate comprehensive summary"""
        self.results['summary'] = {
            'typescript_error_count': len(self.results['typescript_errors']),
            'eslint_error_count': len(self.results['eslint_errors']),
            'build_error_count': len(self.results['build_errors']),
            'security_vulnerability_count': len(self.results['security_vulnerabilities']),
            'test_failure_count': len(self.results['test_failures']),
            'format_issue_count': len(self.results['format_issues']),
            'total_issues': (
                len(self.results['typescript_errors']) +
                len(self.results['eslint_errors']) +
                len(self.results['build_errors']) +
                len(self.results['security_vulnerabilities']) +
                len(self.results['test_failures']) +
                len(self.results['format_issues'])
            )
        }
        
        print("\n📊 SCAN SUMMARY")
        print("=" * 50)
        for key, value in self.results['summary'].items():
            print(f"{key}: {value}")
        
        return self.results['summary']['total_issues'] == 0
    
    def save_results(self):
        """Save scan results to files"""
        timestamp = int(time.time())
        
        # Save JSON results
        results_file = self.reports_dir / f'quality_scan_{timestamp}.json'
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n💾 Results saved to: {results_file}")
        return results_file
    
    def run_full_scan(self):
        """Run all scans"""
        print("🚀 STARTING COMPREHENSIVE QUALITY SCAN")
        print("=" * 80)
        
        self.scan_typescript()
        self.scan_eslint()
        self.scan_format()
        self.scan_build()
        self.scan_security()
        self.scan_tests()
        
        is_clean = self.generate_summary()
        results_file = self.save_results()
        
        return is_clean, results_file

def main():
    if len(sys.argv) > 1:
        project_root = sys.argv[1]
    else:
        project_root = os.getcwd()
    
    scanner = QualityScanner(project_root)
    is_clean, results_file = scanner.run_full_scan()
    
    if is_clean:
        print("\n🎉 ALL SCANS PASSED! Zero issues found.")
        sys.exit(0)
    else:
        print(f"\n⚠️  Issues found. Check {results_file} for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()
