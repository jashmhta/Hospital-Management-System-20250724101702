#!/usr/bin/env python3
"""
Ultimate CI/CD Setup Validation Script for HMS Enterprise
Validates the complete CI/CD pipeline configuration and enterprise setup
"""

import os
import sys
import json
import yaml
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class ValidationResult:
    """Validation result for a specific check"""
    name: str
    category: str
    passed: bool
    severity: str
    message: str
    details: Optional[str] = None
    fix_suggestion: Optional[str] = None

@dataclass
class ValidationReport:
    """Complete validation report"""
    timestamp: datetime
    overall_passed: bool
    total_checks: int
    passed_checks: int
    failed_checks: int
    critical_failures: int
    high_failures: int
    medium_failures: int
    low_failures: int
    results: List[ValidationResult]
    score: float

class CICDValidator:
    """Validates HMS Enterprise CI/CD setup"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.results: List[ValidationResult] = []
        
        # Required files and directories
        self.required_structure = {
            # GitHub workflows
            ".github/workflows/enterprise-cicd-ultimate.yml": "Ultimate CI/CD pipeline",
            ".github/workflows/security-scan.yml": "Security scanning workflow",
            ".github/workflows/healthcare-compliance.yml": "Healthcare compliance workflow",
            ".github/dependabot.yml": "Dependency management configuration",
            
            # Actions
            ".github/actions/setup-environment/action.yml": "Environment setup action",
            ".github/actions/setup-test-environment/action.yml": "Test environment setup action",
            
            # Configuration files
            "tsconfig.enterprise.json": "Enterprise TypeScript configuration",
            "jest.config.enterprise.js": "Enterprise Jest configuration",
            "playwright.enterprise.config.ts": "Enterprise Playwright configuration",
            ".prettierrc.enterprise.json": "Enterprise Prettier configuration",
            "eslint.config.enterprise.js": "Enterprise ESLint configuration",
            "sonar-project.properties": "SonarQube project configuration",
            
            # Scripts
            "scripts/quality/enforce-quality-gates.py": "Quality gates enforcement script",
            "scripts/compliance/hipaa-validation.py": "HIPAA compliance validation",
            "scripts/monitoring/performance-check.js": "Performance monitoring script",
            "scripts/monitoring/health-check.js": "Health check script",
            
            # Package configuration
            "package.json": "Package configuration with enterprise scripts",
            
            # Documentation
            "docs/ENTERPRISE_CICD_ULTIMATE_GUIDE.md": "Ultimate CI/CD guide",
            
            # Docker files
            "Dockerfile": "Application Docker configuration",
            "docker-compose.yml": "Docker Compose configuration",
            
            # Kubernetes
            "k8s/base/namespace.yaml": "Kubernetes namespace configuration",
            "k8s/monitoring/prometheus-grafana.yaml": "Monitoring configuration",
            
            # Microservices
            "microservices/service-discovery/pom.xml": "Service discovery configuration",
            "microservices/config-server/pom.xml": "Config server configuration",
            "microservices/graphql-federation-gateway/pom.xml": "GraphQL gateway configuration",
            "microservices/provider-mobile-backend/pom.xml": "Provider mobile backend",
            "microservices/patient-portal-backend/pom.xml": "Patient portal backend",
            "microservices/analytics-data-ingestion/pom.xml": "Analytics data ingestion",
            "microservices/procedure-management/pom.xml": "Procedure management service",
        }
        
        # Required npm packages
        self.required_npm_packages = [
            "@typescript-eslint/parser",
            "@typescript-eslint/eslint-plugin",
            "prettier",
            "husky",
            "jest",
            "@playwright/test",
            "typescript",
            "eslint",
            "next",
            "react",
            "@testing-library/react",
            "@testing-library/jest-dom"
        ]
        
        # Required Python packages
        self.required_python_packages = [
            "bandit",
            "safety",
            "semgrep",
            "checkov"
        ]

    def validate_file_structure(self) -> None:
        """Validate required file structure"""
        logger.info("🔍 Validating file structure...")
        
        for file_path, description in self.required_structure.items():
            full_path = self.project_root / file_path
            
            if full_path.exists():
                self.results.append(ValidationResult(
                    name=f"File: {file_path}",
                    category="File Structure",
                    passed=True,
                    severity="medium",
                    message=f"{description} exists"
                ))
            else:
                self.results.append(ValidationResult(
                    name=f"File: {file_path}",
                    category="File Structure",
                    passed=False,
                    severity="high" if file_path.startswith(".github/workflows") else "medium",
                    message=f"Missing required file: {file_path}",
                    details=description,
                    fix_suggestion=f"Create {file_path} according to enterprise standards"
                ))

    def validate_package_json(self) -> None:
        """Validate package.json configuration"""
        logger.info("📦 Validating package.json...")
        
        package_json_path = self.project_root / "package.json"
        
        if not package_json_path.exists():
            self.results.append(ValidationResult(
                name="Package JSON",
                category="Configuration",
                passed=False,
                severity="critical",
                message="package.json not found",
                fix_suggestion="Create package.json with enterprise configuration"
            ))
            return
            
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            # Check required scripts
            required_scripts = [
                "lint:enterprise",
                "test:ci",
                "validate:enterprise",
                "security:scan",
                "compliance:hipaa",
                "fhir:validate:r4",
                "build:production",
                "type-check:enterprise"
            ]
            
            scripts = package_data.get("scripts", {})
            
            for script in required_scripts:
                if script in scripts:
                    self.results.append(ValidationResult(
                        name=f"Script: {script}",
                        category="Package Scripts",
                        passed=True,
                        severity="medium",
                        message=f"Enterprise script '{script}' configured"
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"Script: {script}",
                        category="Package Scripts",
                        passed=False,
                        severity="high",
                        message=f"Missing enterprise script: {script}",
                        fix_suggestion=f"Add '{script}' script to package.json"
                    ))
            
            # Check dependencies
            dependencies = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
            
            for package in self.required_npm_packages:
                if package in dependencies:
                    self.results.append(ValidationResult(
                        name=f"NPM Package: {package}",
                        category="Dependencies",
                        passed=True,
                        severity="low",
                        message=f"Required package '{package}' installed"
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"NPM Package: {package}",
                        category="Dependencies",
                        passed=False,
                        severity="medium",
                        message=f"Missing required package: {package}",
                        fix_suggestion=f"Install {package}: npm install {package}"
                    ))
                    
        except Exception as e:
            self.results.append(ValidationResult(
                name="Package JSON Parsing",
                category="Configuration",
                passed=False,
                severity="high",
                message=f"Error parsing package.json: {str(e)}",
                fix_suggestion="Fix package.json syntax errors"
            ))

    def validate_typescript_config(self) -> None:
        """Validate TypeScript configuration"""
        logger.info("📘 Validating TypeScript configuration...")
        
        ts_config_path = self.project_root / "tsconfig.enterprise.json"
        
        if not ts_config_path.exists():
            self.results.append(ValidationResult(
                name="TypeScript Enterprise Config",
                category="Configuration",
                passed=False,
                severity="high",
                message="tsconfig.enterprise.json not found",
                fix_suggestion="Create enterprise TypeScript configuration"
            ))
            return
            
        try:
            with open(ts_config_path, 'r') as f:
                ts_config = json.load(f)
            
            # Check strict mode settings
            compiler_options = ts_config.get("compilerOptions", {})
            
            strict_settings = {
                "strict": True,
                "noImplicitAny": True,
                "strictNullChecks": True,
                "noImplicitReturns": True,
                "noUnusedLocals": True,
                "noUnusedParameters": True,
                "exactOptionalPropertyTypes": True
            }
            
            for setting, expected_value in strict_settings.items():
                actual_value = compiler_options.get(setting)
                
                if actual_value == expected_value:
                    self.results.append(ValidationResult(
                        name=f"TypeScript: {setting}",
                        category="TypeScript Config",
                        passed=True,
                        severity="medium",
                        message=f"Strict setting '{setting}' properly configured"
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"TypeScript: {setting}",
                        category="TypeScript Config",
                        passed=False,
                        severity="high",
                        message=f"TypeScript setting '{setting}' not properly configured",
                        details=f"Expected: {expected_value}, Actual: {actual_value}",
                        fix_suggestion=f"Set '{setting}': {expected_value} in tsconfig.enterprise.json"
                    ))
                    
        except Exception as e:
            self.results.append(ValidationResult(
                name="TypeScript Config Parsing",
                category="Configuration",
                passed=False,
                severity="high",
                message=f"Error parsing tsconfig.enterprise.json: {str(e)}",
                fix_suggestion="Fix TypeScript configuration syntax"
            ))

    def validate_github_workflows(self) -> None:
        """Validate GitHub Actions workflows"""
        logger.info("🔄 Validating GitHub workflows...")
        
        workflows_dir = self.project_root / ".github" / "workflows"
        
        if not workflows_dir.exists():
            self.results.append(ValidationResult(
                name="Workflows Directory",
                category="CI/CD",
                passed=False,
                severity="critical",
                message="GitHub workflows directory not found",
                fix_suggestion="Create .github/workflows directory"
            ))
            return
        
        # Check main workflow
        main_workflow = workflows_dir / "enterprise-cicd-ultimate.yml"
        
        if main_workflow.exists():
            try:
                with open(main_workflow, 'r') as f:
                    workflow_content = yaml.safe_load(f)
                
                # Check required jobs
                required_jobs = [
                    "pipeline-init",
                    "enterprise-code-quality",
                    "comprehensive-testing",
                    "healthcare-compliance",
                    "container-security",
                    "deploy-production"
                ]
                
                jobs = workflow_content.get("jobs", {})
                
                for job in required_jobs:
                    if job in jobs:
                        self.results.append(ValidationResult(
                            name=f"Workflow Job: {job}",
                            category="CI/CD",
                            passed=True,
                            severity="high",
                            message=f"Required workflow job '{job}' configured"
                        ))
                    else:
                        self.results.append(ValidationResult(
                            name=f"Workflow Job: {job}",
                            category="CI/CD",
                            passed=False,
                            severity="critical",
                            message=f"Missing required workflow job: {job}",
                            fix_suggestion=f"Add '{job}' job to main workflow"
                        ))
                
                # Check environment variables
                env_vars = workflow_content.get("env", {})
                required_env_vars = [
                    "SONAR_TOKEN",
                    "SNYK_TOKEN",
                    "CODECOV_TOKEN",
                    "KUBERNETES_NAMESPACE"
                ]
                
                for env_var in required_env_vars:
                    if env_var in env_vars:
                        self.results.append(ValidationResult(
                            name=f"Env Var: {env_var}",
                            category="CI/CD",
                            passed=True,
                            severity="medium",
                            message=f"Environment variable '{env_var}' configured"
                        ))
                    else:
                        self.results.append(ValidationResult(
                            name=f"Env Var: {env_var}",
                            category="CI/CD",
                            passed=False,
                            severity="high",
                            message=f"Missing environment variable: {env_var}",
                            fix_suggestion=f"Add '{env_var}' to workflow environment"
                        ))
                        
            except Exception as e:
                self.results.append(ValidationResult(
                    name="Main Workflow Parsing",
                    category="CI/CD",
                    passed=False,
                    severity="critical",
                    message=f"Error parsing main workflow: {str(e)}",
                    fix_suggestion="Fix YAML syntax in enterprise-cicd-ultimate.yml"
                ))
        else:
            self.results.append(ValidationResult(
                name="Main Workflow",
                category="CI/CD",
                passed=False,
                severity="critical",
                message="Main CI/CD workflow not found",
                fix_suggestion="Create enterprise-cicd-ultimate.yml workflow"
            ))

    def validate_microservices(self) -> None:
        """Validate microservices configuration"""
        logger.info("🔧 Validating microservices...")
        
        microservices_dir = self.project_root / "microservices"
        
        if not microservices_dir.exists():
            self.results.append(ValidationResult(
                name="Microservices Directory",
                category="Microservices",
                passed=False,
                severity="critical",
                message="Microservices directory not found",
                fix_suggestion="Create microservices directory structure"
            ))
            return
        
        required_services = [
            "service-discovery",
            "config-server",
            "graphql-federation-gateway",
            "provider-mobile-backend",
            "patient-portal-backend",
            "analytics-data-ingestion",
            "procedure-management"
        ]
        
        for service in required_services:
            service_dir = microservices_dir / service
            pom_file = service_dir / "pom.xml"
            dockerfile = service_dir / "Dockerfile"
            
            if service_dir.exists():
                self.results.append(ValidationResult(
                    name=f"Service: {service}",
                    category="Microservices",
                    passed=True,
                    severity="high",
                    message=f"Microservice '{service}' directory exists"
                ))
                
                if pom_file.exists():
                    self.results.append(ValidationResult(
                        name=f"POM: {service}",
                        category="Microservices",
                        passed=True,
                        severity="medium",
                        message=f"POM file exists for '{service}'"
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"POM: {service}",
                        category="Microservices",
                        passed=False,
                        severity="high",
                        message=f"Missing POM file for '{service}'",
                        fix_suggestion=f"Create pom.xml for {service}"
                    ))
                
                if dockerfile.exists():
                    self.results.append(ValidationResult(
                        name=f"Dockerfile: {service}",
                        category="Microservices",
                        passed=True,
                        severity="medium",
                        message=f"Dockerfile exists for '{service}'"
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"Dockerfile: {service}",
                        category="Microservices",
                        passed=False,
                        severity="medium",
                        message=f"Missing Dockerfile for '{service}'",
                        fix_suggestion=f"Create Dockerfile for {service}"
                    ))
            else:
                self.results.append(ValidationResult(
                    name=f"Service: {service}",
                    category="Microservices",
                    passed=False,
                    severity="critical",
                    message=f"Missing microservice: {service}",
                    fix_suggestion=f"Implement {service} microservice"
                ))

    def validate_security_tools(self) -> None:
        """Validate security tools configuration"""
        logger.info("🔐 Validating security tools...")
        
        # Check for security configuration files
        security_files = {
            ".github/workflows/security-scan.yml": "Security scanning workflow",
            "scripts/security/generate-security-report.py": "Security report generation",
            "scripts/compliance/hipaa-validation.py": "HIPAA validation script"
        }
        
        for file_path, description in security_files.items():
            full_path = self.project_root / file_path
            
            if full_path.exists():
                self.results.append(ValidationResult(
                    name=f"Security File: {file_path}",
                    category="Security",
                    passed=True,
                    severity="high",
                    message=f"{description} configured"
                ))
            else:
                self.results.append(ValidationResult(
                    name=f"Security File: {file_path}",
                    category="Security",
                    passed=False,
                    severity="high",
                    message=f"Missing security file: {file_path}",
                    fix_suggestion=f"Create {description.lower()}"
                ))

    def validate_monitoring_setup(self) -> None:
        """Validate monitoring and observability setup"""
        logger.info("📊 Validating monitoring setup...")
        
        monitoring_files = {
            "k8s/monitoring/prometheus-grafana.yaml": "Prometheus and Grafana configuration",
            "scripts/monitoring/health-check.js": "Health check script",
            "scripts/monitoring/performance-check.js": "Performance monitoring script"
        }
        
        for file_path, description in monitoring_files.items():
            full_path = self.project_root / file_path
            
            if full_path.exists():
                self.results.append(ValidationResult(
                    name=f"Monitoring: {file_path}",
                    category="Monitoring",
                    passed=True,
                    severity="medium",
                    message=f"{description} configured"
                ))
            else:
                self.results.append(ValidationResult(
                    name=f"Monitoring: {file_path}",
                    category="Monitoring",
                    passed=False,
                    severity="medium",
                    message=f"Missing monitoring file: {file_path}",
                    fix_suggestion=f"Create {description.lower()}"
                ))

    def validate_documentation(self) -> None:
        """Validate documentation completeness"""
        logger.info("📚 Validating documentation...")
        
        docs = {
            "docs/ENTERPRISE_CICD_ULTIMATE_GUIDE.md": "Ultimate CI/CD guide",
            "README.md": "Project README",
            "docs/production-readiness-checklist.md": "Production readiness checklist"
        }
        
        for doc_path, description in docs.items():
            full_path = self.project_root / doc_path
            
            if full_path.exists():
                self.results.append(ValidationResult(
                    name=f"Documentation: {doc_path}",
                    category="Documentation",
                    passed=True,
                    severity="low",
                    message=f"{description} exists"
                ))
            else:
                self.results.append(ValidationResult(
                    name=f"Documentation: {doc_path}",
                    category="Documentation",
                    passed=False,
                    severity="low",
                    message=f"Missing documentation: {doc_path}",
                    fix_suggestion=f"Create {description.lower()}"
                ))

    def check_tool_availability(self) -> None:
        """Check if required tools are available"""
        logger.info("🛠️ Checking tool availability...")
        
        tools = {
            "node": "Node.js runtime",
            "npm": "NPM package manager",
            "java": "Java runtime",
            "mvn": "Maven build tool",
            "docker": "Docker container runtime",
            "kubectl": "Kubernetes CLI",
            "python3": "Python runtime",
            "git": "Git version control"
        }
        
        for tool, description in tools.items():
            try:
                result = subprocess.run([tool, "--version"], capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    self.results.append(ValidationResult(
                        name=f"Tool: {tool}",
                        category="Tools",
                        passed=True,
                        severity="high",
                        message=f"{description} available",
                        details=result.stdout.strip().split('\n')[0]
                    ))
                else:
                    self.results.append(ValidationResult(
                        name=f"Tool: {tool}",
                        category="Tools",
                        passed=False,
                        severity="high",
                        message=f"{description} not available or not working",
                        fix_suggestion=f"Install {tool}"
                    ))
            except (subprocess.TimeoutExpired, FileNotFoundError):
                self.results.append(ValidationResult(
                    name=f"Tool: {tool}",
                    category="Tools",
                    passed=False,
                    severity="high",
                    message=f"{description} not found",
                    fix_suggestion=f"Install {tool}"
                ))

    def run_all_validations(self) -> ValidationReport:
        """Run all validation checks"""
        logger.info("🚀 Starting HMS Enterprise CI/CD validation...")
        
        # Run all validation checks
        self.validate_file_structure()
        self.validate_package_json()
        self.validate_typescript_config()
        self.validate_github_workflows()
        self.validate_microservices()
        self.validate_security_tools()
        self.validate_monitoring_setup()
        self.validate_documentation()
        self.check_tool_availability()
        
        # Calculate results
        total_checks = len(self.results)
        passed_checks = sum(1 for r in self.results if r.passed)
        failed_checks = total_checks - passed_checks
        
        # Count by severity
        critical_failures = sum(1 for r in self.results if not r.passed and r.severity == "critical")
        high_failures = sum(1 for r in self.results if not r.passed and r.severity == "high")
        medium_failures = sum(1 for r in self.results if not r.passed and r.severity == "medium")
        low_failures = sum(1 for r in self.results if not r.passed and r.severity == "low")
        
        # Calculate score
        score = (passed_checks / total_checks * 100) if total_checks > 0 else 100
        
        # Determine overall pass/fail
        overall_passed = critical_failures == 0 and high_failures <= 2
        
        report = ValidationReport(
            timestamp=datetime.now(),
            overall_passed=overall_passed,
            total_checks=total_checks,
            passed_checks=passed_checks,
            failed_checks=failed_checks,
            critical_failures=critical_failures,
            high_failures=high_failures,
            medium_failures=medium_failures,
            low_failures=low_failures,
            results=self.results,
            score=score
        )
        
        logger.info(f"✅ Validation complete: {passed_checks}/{total_checks} checks passed ({score:.1f}%)")
        
        return report

    def save_report(self, report: ValidationReport, output_path: str) -> None:
        """Save validation report to JSON file"""
        report_data = {
            "timestamp": report.timestamp.isoformat(),
            "summary": {
                "overall_passed": report.overall_passed,
                "total_checks": report.total_checks,
                "passed_checks": report.passed_checks,
                "failed_checks": report.failed_checks,
                "score": report.score,
                "failures_by_severity": {
                    "critical": report.critical_failures,
                    "high": report.high_failures,
                    "medium": report.medium_failures,
                    "low": report.low_failures
                }
            },
            "results": [
                {
                    "name": r.name,
                    "category": r.category,
                    "passed": r.passed,
                    "severity": r.severity,
                    "message": r.message,
                    "details": r.details,
                    "fix_suggestion": r.fix_suggestion
                }
                for r in report.results
            ]
        }
        
        with open(output_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        logger.info(f"📄 Report saved to {output_path}")

    def print_summary(self, report: ValidationReport) -> None:
        """Print validation summary"""
        print("\n" + "="*80)
        print("🏥⚡ HMS ENTERPRISE CI/CD VALIDATION REPORT")
        print("="*80)
        print(f"Timestamp: {report.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}")
        print(f"Overall Status: {'✅ PASSED' if report.overall_passed else '❌ FAILED'}")
        print(f"Score: {report.score:.1f}/100")
        print(f"Checks: {report.passed_checks}/{report.total_checks} passed")
        
        print(f"\nFailures by Severity:")
        print(f"  🔴 Critical: {report.critical_failures}")
        print(f"  🟠 High: {report.high_failures}")
        print(f"  🟡 Medium: {report.medium_failures}")
        print(f"  🔵 Low: {report.low_failures}")
        
        if report.failed_checks > 0:
            print(f"\n❌ FAILED CHECKS:")
            for result in report.results:
                if not result.passed:
                    severity_icon = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "🔵"}
                    print(f"  {severity_icon.get(result.severity, '⚪')} [{result.category}] {result.name}")
                    print(f"     {result.message}")
                    if result.fix_suggestion:
                        print(f"     💡 Fix: {result.fix_suggestion}")
        
        print("\n" + "="*80)

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="HMS Enterprise CI/CD Validation")
    parser.add_argument("--project-root", default=".", help="Project root directory")
    parser.add_argument("--output-report", help="Output JSON report file")
    parser.add_argument("--fail-on-error", action="store_true", help="Exit with error if validation fails")
    
    args = parser.parse_args()
    
    try:
        validator = CICDValidator(args.project_root)
        report = validator.run_all_validations()
        
        # Print summary
        validator.print_summary(report)
        
        # Save report if requested
        if args.output_report:
            validator.save_report(report, args.output_report)
        
        # Exit with appropriate code
        if args.fail_on_error and not report.overall_passed:
            sys.exit(1)
        else:
            sys.exit(0)
            
    except Exception as e:
        logger.error(f"💥 Validation failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
