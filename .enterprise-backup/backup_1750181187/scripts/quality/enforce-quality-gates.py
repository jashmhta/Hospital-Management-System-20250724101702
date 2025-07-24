#!/usr/bin/env python3
"""
Enterprise Quality Gates Enforcement Script
Enforces comprehensive quality gates for HMS Enterprise
"""

import json
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class QualityGate:
    """Quality gate definition"""
    name: str
    threshold: float
    current_value: float
    unit: str
    passed: bool
    description: str

@dataclass
class QualityReport:
    """Quality report summary"""
    timestamp: datetime
    overall_passed: bool
    total_gates: int
    passed_gates: int
    failed_gates: int
    quality_score: float
    gates: List[QualityGate]

class QualityGateEnforcer:
    """Enforces quality gates for enterprise healthcare systems"""
    
    def __init__(self, strict_mode: bool = False):
        self.strict_mode = strict_mode
        self.quality_gates: List[QualityGate] = []
        
        # Define quality gate thresholds
        self.thresholds = self._get_quality_thresholds()
    
    def _get_quality_thresholds(self) -> Dict[str, Any]:
        """Get quality gate thresholds based on mode"""
        if self.strict_mode:
            return {
                # Code Coverage
                "line_coverage": 90.0,
                "branch_coverage": 85.0,
                "function_coverage": 90.0,
                "statement_coverage": 90.0,
                
                # Code Quality
                "eslint_error_threshold": 0,
                "eslint_warning_threshold": 5,
                "typescript_errors": 0,
                "sonarqube_bugs": 0,
                "sonarqube_vulnerabilities": 0,
                "sonarqube_code_smells": 10,
                "sonarqube_duplicated_lines": 3.0,
                "sonarqube_maintainability_rating": "A",
                "sonarqube_reliability_rating": "A",
                "sonarqube_security_rating": "A",
                
                # Security
                "npm_audit_high": 0,
                "npm_audit_critical": 0,
                "snyk_high": 0,
                "snyk_critical": 0,
                "dependency_check_high": 0,
                "dependency_check_critical": 0,
                
                # Performance
                "lighthouse_performance": 90,
                "lighthouse_accessibility": 95,
                "lighthouse_best_practices": 90,
                "lighthouse_seo": 80,
                "bundle_size_mb": 2.0,
                "load_time_ms": 2000,
                
                # Healthcare Compliance
                "hipaa_critical_violations": 0,
                "hipaa_high_violations": 2,
                "fhir_compliance_score": 95.0,
                "phi_exposure_incidents": 0,
                
                # Test Quality
                "test_pass_rate": 100.0,
                "e2e_test_pass_rate": 95.0,
                "api_test_pass_rate": 100.0,
                "unit_test_count_minimum": 100,
                "integration_test_count_minimum": 20,
                
                # Documentation
                "api_documentation_coverage": 90.0,
                "code_documentation_coverage": 80.0,
            }
        else:
            return {
                # Standard mode with more tolerance
                "line_coverage": 80.0,
                "branch_coverage": 75.0,
                "function_coverage": 80.0,
                "statement_coverage": 80.0,
                
                "eslint_error_threshold": 2,
                "eslint_warning_threshold": 10,
                "typescript_errors": 5,
                "sonarqube_bugs": 5,
                "sonarqube_vulnerabilities": 2,
                "sonarqube_code_smells": 20,
                "sonarqube_duplicated_lines": 5.0,
                "sonarqube_maintainability_rating": "B",
                "sonarqube_reliability_rating": "A",
                "sonarqube_security_rating": "A",
                
                "npm_audit_high": 2,
                "npm_audit_critical": 0,
                "snyk_high": 3,
                "snyk_critical": 0,
                "dependency_check_high": 2,
                "dependency_check_critical": 0,
                
                "lighthouse_performance": 80,
                "lighthouse_accessibility": 90,
                "lighthouse_best_practices": 80,
                "lighthouse_seo": 70,
                "bundle_size_mb": 3.0,
                "load_time_ms": 3000,
                
                "hipaa_critical_violations": 1,
                "hipaa_high_violations": 5,
                "fhir_compliance_score": 85.0,
                "phi_exposure_incidents": 0,
                
                "test_pass_rate": 95.0,
                "e2e_test_pass_rate": 90.0,
                "api_test_pass_rate": 95.0,
                "unit_test_count_minimum": 50,
                "integration_test_count_minimum": 10,
                
                "api_documentation_coverage": 80.0,
                "code_documentation_coverage": 70.0,
            }
    
    def check_eslint_report(self, eslint_report_path: str) -> None:
        """Check ESLint report against quality gates"""
        try:
            with open(eslint_report_path, 'r') as f:
                eslint_data = json.load(f)
            
            error_count = sum(
                len([msg for msg in file_data.get('messages', []) if msg['severity'] == 2])
                for file_data in eslint_data
            )
            warning_count = sum(
                len([msg for msg in file_data.get('messages', []) if msg['severity'] == 1])
                for file_data in eslint_data
            )
            
            # ESLint errors gate
            self.quality_gates.append(QualityGate(
                name="ESLint Errors",
                threshold=self.thresholds["eslint_error_threshold"],
                current_value=error_count,
                unit="errors",
                passed=error_count <= self.thresholds["eslint_error_threshold"],
                description="Number of ESLint errors must be below threshold"
            ))
            
            # ESLint warnings gate
            self.quality_gates.append(QualityGate(
                name="ESLint Warnings",
                threshold=self.thresholds["eslint_warning_threshold"],
                current_value=warning_count,
                unit="warnings",
                passed=warning_count <= self.thresholds["eslint_warning_threshold"],
                description="Number of ESLint warnings must be below threshold"
            ))
            
        except Exception as e:
            logger.warning(f"Could not process ESLint report: {e}")
    
    def check_coverage_report(self, coverage_report_path: str) -> None:
        """Check test coverage against quality gates"""
        try:
            with open(coverage_report_path, 'r') as f:
                coverage_data = json.load(f)
            
            total = coverage_data.get('total', {})
            
            # Line coverage
            line_coverage = total.get('lines', {}).get('pct', 0)
            self.quality_gates.append(QualityGate(
                name="Line Coverage",
                threshold=self.thresholds["line_coverage"],
                current_value=line_coverage,
                unit="%",
                passed=line_coverage >= self.thresholds["line_coverage"],
                description="Line coverage must meet minimum threshold"
            ))
            
            # Branch coverage
            branch_coverage = total.get('branches', {}).get('pct', 0)
            self.quality_gates.append(QualityGate(
                name="Branch Coverage",
                threshold=self.thresholds["branch_coverage"],
                current_value=branch_coverage,
                unit="%",
                passed=branch_coverage >= self.thresholds["branch_coverage"],
                description="Branch coverage must meet minimum threshold"
            ))
            
            # Function coverage
            function_coverage = total.get('functions', {}).get('pct', 0)
            self.quality_gates.append(QualityGate(
                name="Function Coverage",
                threshold=self.thresholds["function_coverage"],
                current_value=function_coverage,
                unit="%",
                passed=function_coverage >= self.thresholds["function_coverage"],
                description="Function coverage must meet minimum threshold"
            ))
            
            # Statement coverage
            statement_coverage = total.get('statements', {}).get('pct', 0)
            self.quality_gates.append(QualityGate(
                name="Statement Coverage",
                threshold=self.thresholds["statement_coverage"],
                current_value=statement_coverage,
                unit="%",
                passed=statement_coverage >= self.thresholds["statement_coverage"],
                description="Statement coverage must meet minimum threshold"
            ))
            
        except Exception as e:
            logger.warning(f"Could not process coverage report: {e}")
    
    def check_security_report(self, security_report_path: str) -> None:
        """Check security audit results against quality gates"""
        try:
            with open(security_report_path, 'r') as f:
                security_data = json.load(f)
            
            # NPM Audit results
            if 'vulnerabilities' in security_data:
                high_vulns = security_data['vulnerabilities'].get('high', 0)
                critical_vulns = security_data['vulnerabilities'].get('critical', 0)
                
                self.quality_gates.append(QualityGate(
                    name="NPM Audit High",
                    threshold=self.thresholds["npm_audit_high"],
                    current_value=high_vulns,
                    unit="vulnerabilities",
                    passed=high_vulns <= self.thresholds["npm_audit_high"],
                    description="High severity NPM vulnerabilities must be below threshold"
                ))
                
                self.quality_gates.append(QualityGate(
                    name="NPM Audit Critical",
                    threshold=self.thresholds["npm_audit_critical"],
                    current_value=critical_vulns,
                    unit="vulnerabilities",
                    passed=critical_vulns <= self.thresholds["npm_audit_critical"],
                    description="Critical NPM vulnerabilities must be below threshold"
                ))
            
        except Exception as e:
            logger.warning(f"Could not process security report: {e}")
    
    def check_sonarqube_report(self, sonar_report_path: str) -> None:
        """Check SonarQube quality metrics against gates"""
        try:
            with open(sonar_report_path, 'r') as f:
                sonar_data = json.load(f)
            
            measures = {m['metric']: m['value'] for m in sonar_data.get('measures', [])}
            
            # Bugs
            bugs = int(measures.get('bugs', 0))
            self.quality_gates.append(QualityGate(
                name="SonarQube Bugs",
                threshold=self.thresholds["sonarqube_bugs"],
                current_value=bugs,
                unit="bugs",
                passed=bugs <= self.thresholds["sonarqube_bugs"],
                description="Number of bugs must be below threshold"
            ))
            
            # Vulnerabilities
            vulnerabilities = int(measures.get('vulnerabilities', 0))
            self.quality_gates.append(QualityGate(
                name="SonarQube Vulnerabilities",
                threshold=self.thresholds["sonarqube_vulnerabilities"],
                current_value=vulnerabilities,
                unit="vulnerabilities",
                passed=vulnerabilities <= self.thresholds["sonarqube_vulnerabilities"],
                description="Number of vulnerabilities must be below threshold"
            ))
            
            # Code smells
            code_smells = int(measures.get('code_smells', 0))
            self.quality_gates.append(QualityGate(
                name="SonarQube Code Smells",
                threshold=self.thresholds["sonarqube_code_smells"],
                current_value=code_smells,
                unit="code_smells",
                passed=code_smells <= self.thresholds["sonarqube_code_smells"],
                description="Number of code smells must be below threshold"
            ))
            
            # Duplicated lines
            duplicated_lines = float(measures.get('duplicated_lines_density', 0))
            self.quality_gates.append(QualityGate(
                name="SonarQube Duplicated Lines",
                threshold=self.thresholds["sonarqube_duplicated_lines"],
                current_value=duplicated_lines,
                unit="%",
                passed=duplicated_lines <= self.thresholds["sonarqube_duplicated_lines"],
                description="Duplicated lines percentage must be below threshold"
            ))
            
        except Exception as e:
            logger.warning(f"Could not process SonarQube report: {e}")
    
    def check_hipaa_compliance_report(self, hipaa_report_path: str) -> None:
        """Check HIPAA compliance against quality gates"""
        try:
            with open(hipaa_report_path, 'r') as f:
                hipaa_data = json.load(f)
            
            summary = hipaa_data.get('summary', {})
            
            critical_violations = summary.get('critical_violations', 0)
            high_violations = summary.get('high_violations', 0)
            compliance_score = summary.get('compliance_score', 0)
            
            self.quality_gates.append(QualityGate(
                name="HIPAA Critical Violations",
                threshold=self.thresholds["hipaa_critical_violations"],
                current_value=critical_violations,
                unit="violations",
                passed=critical_violations <= self.thresholds["hipaa_critical_violations"],
                description="HIPAA critical violations must be below threshold"
            ))
            
            self.quality_gates.append(QualityGate(
                name="HIPAA High Violations",
                threshold=self.thresholds["hipaa_high_violations"],
                current_value=high_violations,
                unit="violations",
                passed=high_violations <= self.thresholds["hipaa_high_violations"],
                description="HIPAA high violations must be below threshold"
            ))
            
        except Exception as e:
            logger.warning(f"Could not process HIPAA compliance report: {e}")
    
    def check_performance_report(self, performance_report_path: str) -> None:
        """Check performance metrics against quality gates"""
        try:
            with open(performance_report_path, 'r') as f:
                perf_data = json.load(f)
            
            # Lighthouse scores
            lighthouse = perf_data.get('lighthouse', {})
            if lighthouse:
                performance_score = lighthouse.get('performance', 0) * 100
                accessibility_score = lighthouse.get('accessibility', 0) * 100
                
                self.quality_gates.append(QualityGate(
                    name="Lighthouse Performance",
                    threshold=self.thresholds["lighthouse_performance"],
                    current_value=performance_score,
                    unit="score",
                    passed=performance_score >= self.thresholds["lighthouse_performance"],
                    description="Lighthouse performance score must meet minimum threshold"
                ))
                
                self.quality_gates.append(QualityGate(
                    name="Lighthouse Accessibility",
                    threshold=self.thresholds["lighthouse_accessibility"],
                    current_value=accessibility_score,
                    unit="score",
                    passed=accessibility_score >= self.thresholds["lighthouse_accessibility"],
                    description="Lighthouse accessibility score must meet minimum threshold"
                ))
            
        except Exception as e:
            logger.warning(f"Could not process performance report: {e}")
    
    def generate_quality_report(self) -> QualityReport:
        """Generate comprehensive quality report"""
        passed_gates = sum(1 for gate in self.quality_gates if gate.passed)
        failed_gates = len(self.quality_gates) - passed_gates
        overall_passed = failed_gates == 0
        
        # Calculate quality score
        quality_score = (passed_gates / len(self.quality_gates) * 100) if self.quality_gates else 100
        
        return QualityReport(
            timestamp=datetime.now(),
            overall_passed=overall_passed,
            total_gates=len(self.quality_gates),
            passed_gates=passed_gates,
            failed_gates=failed_gates,
            quality_score=quality_score,
            gates=self.quality_gates
        )
    
    def enforce_gates(self, fail_on_violation: bool = True) -> bool:
        """Enforce quality gates and optionally fail on violations"""
        report = self.generate_quality_report()
        
        logger.info(f"Quality Gates Report:")
        logger.info(f"Overall Status: {'PASSED' if report.overall_passed else 'FAILED'}")
        logger.info(f"Quality Score: {report.quality_score:.2f}%")
        logger.info(f"Gates: {report.passed_gates}/{report.total_gates} passed")
        
        if not report.overall_passed:
            logger.error("Quality gates failed:")
            for gate in report.gates:
                if not gate.passed:
                    logger.error(f"  ❌ {gate.name}: {gate.current_value} {gate.unit} (threshold: {gate.threshold} {gate.unit})")
        
        if fail_on_violation and not report.overall_passed:
            return False
        
        return True
    
    def save_report(self, output_path: str) -> None:
        """Save quality report to file"""
        report = self.generate_quality_report()
        
        report_data = {
            "timestamp": report.timestamp.isoformat(),
            "summary": {
                "overall_passed": report.overall_passed,
                "total_gates": report.total_gates,
                "passed_gates": report.passed_gates,
                "failed_gates": report.failed_gates,
                "quality_score": report.quality_score
            },
            "gates": [
                {
                    "name": gate.name,
                    "threshold": gate.threshold,
                    "current_value": gate.current_value,
                    "unit": gate.unit,
                    "passed": gate.passed,
                    "description": gate.description
                }
                for gate in report.gates
            ]
        }
        
        with open(output_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        logger.info(f"Quality report saved to {output_path}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Enterprise Quality Gates Enforcer")
    parser.add_argument("--eslint-report", help="Path to ESLint JSON report")
    parser.add_argument("--coverage-report", help="Path to coverage JSON report")
    parser.add_argument("--security-report", help="Path to security audit JSON report")
    parser.add_argument("--sonarqube-report", help="Path to SonarQube JSON report")
    parser.add_argument("--hipaa-report", help="Path to HIPAA compliance JSON report")
    parser.add_argument("--performance-report", help="Path to performance JSON report")
    parser.add_argument("--output-report", help="Path to save quality gates report")
    parser.add_argument("--strict-mode", action="store_true", help="Enable strict quality gates")
    parser.add_argument("--fail-on-high-severity", action="store_true", help="Fail on high severity violations")
    
    args = parser.parse_args()
    
    enforcer = QualityGateEnforcer(strict_mode=args.strict_mode)
    
    # Check various reports
    if args.eslint_report:
        enforcer.check_eslint_report(args.eslint_report)
    
    if args.coverage_report:
        enforcer.check_coverage_report(args.coverage_report)
    
    if args.security_report:
        enforcer.check_security_report(args.security_report)
    
    if args.sonarqube_report:
        enforcer.check_sonarqube_report(args.sonarqube_report)
    
    if args.hipaa_report:
        enforcer.check_hipaa_compliance_report(args.hipaa_report)
    
    if args.performance_report:
        enforcer.check_performance_report(args.performance_report)
    
    # Save report if requested
    if args.output_report:
        enforcer.save_report(args.output_report)
    
    # Enforce gates
    success = enforcer.enforce_gates(fail_on_violation=args.fail_on_high_severity)
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
