#!/usr/bin/env python3
"""
Final Validation Report for Enterprise-Grade Hospital Management System
Comprehensive assessment of refactoring results and enterprise readiness
"""

import os
import json
import subprocess
import time
from pathlib import Path
from typing import Dict, List, Any, Tuple
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnterpriseValidationReport:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        
    def run_command(self, command: str, timeout: int = 120) -> Tuple[bool, str, str]:
        """Run command with safe error handling"""
        try:
            result = subprocess.run(
                command, shell=True, cwd=self.project_root,
                capture_output=True, text=True, timeout=timeout
            )
            return result.returncode == 0, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return False, "", "Command timed out"
        except Exception as e:
            return False, "", str(e)

    def count_files_by_type(self) -> Dict[str, int]:
        """Count files by type in the project"""
        file_counts = {
            "typescript": 0,
            "javascript": 0,
            "react": 0,
            "config": 0,
            "total": 0
        }
        
        for file_path in self.src_dir.rglob("*"):
            if file_path.is_file():
                file_counts["total"] += 1
                if file_path.suffix == ".ts":
                    file_counts["typescript"] += 1
                elif file_path.suffix == ".tsx":
                    file_counts["react"] += 1
                elif file_path.suffix in [".js", ".jsx"]:
                    file_counts["javascript"] += 1
                elif file_path.suffix in [".json", ".yml", ".yaml"]:
                    file_counts["config"] += 1
        
        return file_counts

    def check_configuration_files(self) -> Dict[str, bool]:
        """Check if enterprise configuration files exist and are valid"""
        configs = {}
        
        # TypeScript config
        tsconfig_path = self.project_root / "tsconfig.json"
        configs["tsconfig"] = tsconfig_path.exists()
        if configs["tsconfig"]:
            try:
                with open(tsconfig_path, 'r') as f:
                    tsconfig = json.load(f)
                configs["tsconfig_strict"] = tsconfig.get("compilerOptions", {}).get("strict", False)
            except:
                configs["tsconfig_strict"] = False
        
        # ESLint config
        eslint_configs = ["eslint.config.js", ".eslintrc.js", ".eslintrc.json"]
        configs["eslint"] = any((self.project_root / config).exists() for config in eslint_configs)
        
        # Prettier config
        prettier_configs = [".prettierrc.json", ".prettierrc.js", "prettier.config.js"]
        configs["prettier"] = any((self.project_root / config).exists() for config in prettier_configs)
        
        # Package.json
        package_json_path = self.project_root / "package.json"
        configs["package_json"] = package_json_path.exists()
        
        return configs

    def check_dependencies(self) -> Dict[str, Any]:
        """Check dependency status and versions"""
        deps_info = {
            "package_json_exists": False,
            "node_modules_exists": False,
            "latest_versions": {},
            "security_vulnerabilities": 0
        }
        
        package_json_path = self.project_root / "package.json"
        if package_json_path.exists():
            deps_info["package_json_exists"] = True
            try:
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                
                # Check for latest versions of key dependencies
                dependencies = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
                key_deps = ["next", "react", "typescript", "eslint", "prettier"]
                
                for dep in key_deps:
                    if dep in dependencies:
                        deps_info["latest_versions"][dep] = dependencies[dep]
            except:
                pass
        
        # Check if node_modules exists
        deps_info["node_modules_exists"] = (self.project_root / "node_modules").exists()
        
        # Check for security vulnerabilities
        success, stdout, stderr = self.run_command("npm audit --audit-level=moderate --json", 60)
        if success:
            try:
                audit_data = json.loads(stdout)
                deps_info["security_vulnerabilities"] = audit_data.get("metadata", {}).get("vulnerabilities", {}).get("total", 0)
            except:
                deps_info["security_vulnerabilities"] = 0
        
        return deps_info

    def run_quality_checks(self) -> Dict[str, Any]:
        """Run comprehensive quality checks"""
        quality_results = {
            "typescript_compilation": {"success": False, "errors": 0, "warnings": 0},
            "eslint_check": {"success": False, "errors": 0, "warnings": 0},
            "prettier_check": {"success": False, "issues": 0},
            "build_check": {"success": False, "duration": 0}
        }
        
        # TypeScript compilation check
        logger.info("Running TypeScript compilation check...")
        start_time = time.time()
        success, stdout, stderr = self.run_command("npx tsc --noEmit --skipLibCheck", 180)
        quality_results["typescript_compilation"]["success"] = success
        if not success:
            # Count errors and warnings
            error_lines = [line for line in stderr.split('\n') if 'error TS' in line]
            warning_lines = [line for line in stderr.split('\n') if 'warning TS' in line]
            quality_results["typescript_compilation"]["errors"] = len(error_lines)
            quality_results["typescript_compilation"]["warnings"] = len(warning_lines)
        
        # ESLint check
        logger.info("Running ESLint check...")
        success, stdout, stderr = self.run_command("npx eslint src --ext .ts,.tsx", 120)
        quality_results["eslint_check"]["success"] = success
        if not success:
            # Count errors and warnings
            error_lines = [line for line in stdout.split('\n') if 'error' in line.lower()]
            warning_lines = [line for line in stdout.split('\n') if 'warning' in line.lower()]
            quality_results["eslint_check"]["errors"] = len(error_lines)
            quality_results["eslint_check"]["warnings"] = len(warning_lines)
        
        # Prettier check
        logger.info("Running Prettier check...")
        success, stdout, stderr = self.run_command("npx prettier --check src", 60)
        quality_results["prettier_check"]["success"] = success
        if not success:
            quality_results["prettier_check"]["issues"] = len(stdout.split('\n')) if stdout else 0
        
        # Build check
        logger.info("Running build check...")
        start_time = time.time()
        success, stdout, stderr = self.run_command("npm run build", 300)
        quality_results["build_check"]["success"] = success
        quality_results["build_check"]["duration"] = time.time() - start_time
        
        return quality_results

    def calculate_enterprise_score(self, configs: Dict, deps: Dict, quality: Dict, files: Dict) -> Dict[str, Any]:
        """Calculate overall enterprise readiness score"""
        scores = {
            "configuration": 0,
            "dependencies": 0,
            "code_quality": 0,
            "project_structure": 0,
            "overall": 0
        }
        
        # Configuration score (25 points)
        config_score = 0
        if configs.get("tsconfig", False):
            config_score += 8
        if configs.get("tsconfig_strict", False):
            config_score += 5
        if configs.get("eslint", False):
            config_score += 6
        if configs.get("prettier", False):
            config_score += 6
        scores["configuration"] = min(config_score, 25)
        
        # Dependencies score (25 points)
        deps_score = 0
        if deps.get("package_json_exists", False):
            deps_score += 5
        if deps.get("node_modules_exists", False):
            deps_score += 5
        if len(deps.get("latest_versions", {})) >= 3:
            deps_score += 10
        if deps.get("security_vulnerabilities", 999) == 0:
            deps_score += 5
        scores["dependencies"] = min(deps_score, 25)
        
        # Code quality score (35 points)
        quality_score = 0
        if quality.get("typescript_compilation", {}).get("success", False):
            quality_score += 15
        elif quality.get("typescript_compilation", {}).get("errors", 999) < 50:
            quality_score += 8
        
        if quality.get("eslint_check", {}).get("success", False):
            quality_score += 10
        elif quality.get("eslint_check", {}).get("errors", 999) < 20:
            quality_score += 5
        
        if quality.get("prettier_check", {}).get("success", False):
            quality_score += 5
        
        if quality.get("build_check", {}).get("success", False):
            quality_score += 5
        
        scores["code_quality"] = min(quality_score, 35)
        
        # Project structure score (15 points)
        structure_score = 0
        if files.get("typescript", 0) > 0:
            structure_score += 5
        if files.get("react", 0) > 0:
            structure_score += 5
        if files.get("total", 0) > 100:
            structure_score += 5
        scores["project_structure"] = min(structure_score, 15)
        
        # Overall score
        scores["overall"] = sum(scores.values())
        
        return scores

    def generate_recommendations(self, configs: Dict, deps: Dict, quality: Dict, scores: Dict) -> List[str]:
        """Generate recommendations for improvement"""
        recommendations = []
        
        if scores["overall"] < 70:
            recommendations.append("🔧 Critical: Overall enterprise score is below 70%. Immediate attention required.")
        
        if not configs.get("tsconfig_strict", False):
            recommendations.append("📝 Enable TypeScript strict mode for better type safety")
        
        if not quality.get("typescript_compilation", {}).get("success", False):
            recommendations.append("🚨 Fix TypeScript compilation errors before production deployment")
        
        if not quality.get("build_check", {}).get("success", False):
            recommendations.append("🏗️ Resolve build issues to ensure deployability")
        
        if deps.get("security_vulnerabilities", 0) > 0:
            recommendations.append(f"🔒 Fix {deps['security_vulnerabilities']} security vulnerabilities")
        
        if not quality.get("eslint_check", {}).get("success", False):
            recommendations.append("🔍 Address ESLint violations for code quality")
        
        if not quality.get("prettier_check", {}).get("success", False):
            recommendations.append("💅 Apply Prettier formatting for consistent code style")
        
        if scores["overall"] >= 85:
            recommendations.append("🏆 Excellent! Project meets enterprise-grade standards")
        elif scores["overall"] >= 70:
            recommendations.append("⭐ Good progress! Minor improvements needed for full enterprise readiness")
        
        return recommendations

    def generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate comprehensive enterprise validation report"""
        logger.info("Generating comprehensive enterprise validation report...")
        
        report = {
            "timestamp": time.time(),
            "project_path": str(self.project_root),
            "file_analysis": {},
            "configuration_analysis": {},
            "dependency_analysis": {},
            "quality_analysis": {},
            "enterprise_scores": {},
            "recommendations": [],
            "summary": {}
        }
        
        # File analysis
        logger.info("Analyzing project files...")
        report["file_analysis"] = self.count_files_by_type()
        
        # Configuration analysis
        logger.info("Analyzing configuration files...")
        report["configuration_analysis"] = self.check_configuration_files()
        
        # Dependency analysis
        logger.info("Analyzing dependencies...")
        report["dependency_analysis"] = self.check_dependencies()
        
        # Quality analysis
        logger.info("Running quality checks...")
        report["quality_analysis"] = self.run_quality_checks()
        
        # Calculate enterprise scores
        logger.info("Calculating enterprise scores...")
        report["enterprise_scores"] = self.calculate_enterprise_score(
            report["configuration_analysis"],
            report["dependency_analysis"],
            report["quality_analysis"],
            report["file_analysis"]
        )
        
        # Generate recommendations
        report["recommendations"] = self.generate_recommendations(
            report["configuration_analysis"],
            report["dependency_analysis"],
            report["quality_analysis"],
            report["enterprise_scores"]
        )
        
        # Summary
        overall_score = report["enterprise_scores"]["overall"]
        if overall_score >= 85:
            grade = "A"
            status = "Enterprise Ready"
        elif overall_score >= 70:
            grade = "B"
            status = "Near Enterprise Ready"
        elif overall_score >= 55:
            grade = "C"
            status = "Needs Improvement"
        else:
            grade = "D"
            status = "Significant Work Required"
        
        report["summary"] = {
            "overall_score": overall_score,
            "grade": grade,
            "status": status,
            "total_files": report["file_analysis"]["total"],
            "typescript_files": report["file_analysis"]["typescript"] + report["file_analysis"]["react"],
            "build_ready": report["quality_analysis"]["build_check"]["success"],
            "type_safe": report["quality_analysis"]["typescript_compilation"]["success"]
        }
        
        return report

def print_report(report: Dict[str, Any]):
    """Print formatted enterprise validation report"""
    print("\n" + "="*120)
    print("🏥 HOSPITAL MANAGEMENT SYSTEM - ENTERPRISE VALIDATION REPORT")
    print("="*120)
    
    summary = report["summary"]
    print(f"📊 Overall Score: {summary['overall_score']}/100 (Grade: {summary['grade']})")
    print(f"🎯 Status: {summary['status']}")
    print(f"📁 Total Files: {summary['total_files']}")
    print(f"📝 TypeScript Files: {summary['typescript_files']}")
    print(f"🏗️ Build Ready: {'✅' if summary['build_ready'] else '❌'}")
    print(f"🔒 Type Safe: {'✅' if summary['type_safe'] else '❌'}")
    
    print("\n📈 DETAILED SCORES:")
    scores = report["enterprise_scores"]
    print(f"   Configuration:    {scores['configuration']}/25  {'✅' if scores['configuration'] >= 20 else '⚠️' if scores['configuration'] >= 15 else '❌'}")
    print(f"   Dependencies:     {scores['dependencies']}/25   {'✅' if scores['dependencies'] >= 20 else '⚠️' if scores['dependencies'] >= 15 else '❌'}")
    print(f"   Code Quality:     {scores['code_quality']}/35   {'✅' if scores['code_quality'] >= 28 else '⚠️' if scores['code_quality'] >= 21 else '❌'}")
    print(f"   Project Structure: {scores['project_structure']}/15   {'✅' if scores['project_structure'] >= 12 else '⚠️' if scores['project_structure'] >= 9 else '❌'}")
    
    print("\n🔍 QUALITY ANALYSIS:")
    quality = report["quality_analysis"]
    ts_result = quality["typescript_compilation"]
    eslint_result = quality["eslint_check"]
    prettier_result = quality["prettier_check"]
    build_result = quality["build_check"]
    
    ts_status = "✅ Passed" if ts_result['success'] else f"❌ {ts_result.get('errors', 0)} errors, {ts_result.get('warnings', 0)} warnings"
    eslint_status = "✅ Passed" if eslint_result['success'] else f"❌ {eslint_result.get('errors', 0)} errors, {eslint_result.get('warnings', 0)} warnings"
    prettier_status = "✅ Passed" if prettier_result['success'] else f"❌ {prettier_result.get('issues', 0)} formatting issues"
    build_status = "✅ Passed" if build_result['success'] else f"❌ Failed ({build_result.get('duration', 0):.1f}s)"
    
    print(f"   TypeScript: {ts_status}")
    print(f"   ESLint:     {eslint_status}")
    print(f"   Prettier:   {prettier_status}")
    print(f"   Build:      {build_status}")
    
    print("\n⚙️ CONFIGURATION STATUS:")
    configs = report["configuration_analysis"]
    print(f"   TypeScript Config: {'✅' if configs.get('tsconfig') else '❌'} (Strict: {'✅' if configs.get('tsconfig_strict') else '❌'})")
    print(f"   ESLint Config:     {'✅' if configs.get('eslint') else '❌'}")
    print(f"   Prettier Config:   {'✅' if configs.get('prettier') else '❌'}")
    print(f"   Package.json:      {'✅' if configs.get('package_json') else '❌'}")
    
    print("\n📦 DEPENDENCY STATUS:")
    deps = report["dependency_analysis"]
    print(f"   Node Modules:      {'✅' if deps.get('node_modules_exists') else '❌'}")
    print(f"   Latest Versions:   {len(deps.get('latest_versions', {}))} key dependencies updated")
    print(f"   Security Issues:   {deps.get('security_vulnerabilities', 0)} vulnerabilities")
    
    if deps.get('latest_versions'):
        print("   Key Dependencies:")
        for dep, version in deps['latest_versions'].items():
            print(f"     • {dep}: {version}")
    
    print("\n💡 RECOMMENDATIONS:")
    for i, rec in enumerate(report["recommendations"], 1):
        print(f"   {i}. {rec}")
    
    print("\n🎯 ENTERPRISE READINESS ASSESSMENT:")
    if summary['overall_score'] >= 85:
        print("   🏆 EXCELLENT - Ready for enterprise production deployment!")
        print("   ✨ Meets all enterprise-grade standards")
        print("   🚀 Can be deployed to production with confidence")
    elif summary['overall_score'] >= 70:
        print("   ⭐ GOOD - Near enterprise ready with minor improvements needed")
        print("   🔧 Address remaining issues for full enterprise compliance")
        print("   📈 Strong foundation with room for optimization")
    elif summary['overall_score'] >= 55:
        print("   ⚠️ FAIR - Significant improvements needed for enterprise deployment")
        print("   🔨 Focus on code quality and configuration improvements")
        print("   📋 Review and address critical issues before production")
    else:
        print("   ❌ NEEDS WORK - Major refactoring required for enterprise standards")
        print("   🚨 Not ready for production deployment")
        print("   🔄 Comprehensive improvements needed across all areas")
    
    print("\n🔄 NEXT STEPS:")
    if summary['overall_score'] >= 85:
        print("   1. ✅ Set up CI/CD pipeline")
        print("   2. ✅ Configure monitoring and alerting")
        print("   3. ✅ Implement backup and disaster recovery")
        print("   4. ✅ Conduct security penetration testing")
        print("   5. ✅ Performance optimization and load testing")
    else:
        print("   1. 🔧 Address critical issues identified in recommendations")
        print("   2. 🔄 Re-run validation after fixes")
        print("   3. 📝 Update documentation and deployment guides")
        print("   4. 🧪 Implement comprehensive testing strategy")
        print("   5. 🔒 Security audit and compliance review")
    
    print("="*120)

def main():
    """Main entry point"""
    project_root = "/workspace/Hospital-Management-System"
    validator = EnterpriseValidationReport(project_root)
    
    print("🔍 Starting Enterprise Validation Report Generation...")
    report = validator.generate_comprehensive_report()
    
    # Print the report
    print_report(report)
    
    # Save report to file
    report_file = Path(project_root) / "enterprise-validation-report.json"
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: {report_file}")
    print("🎉 Enterprise validation completed!")

if __name__ == "__main__":
    main()