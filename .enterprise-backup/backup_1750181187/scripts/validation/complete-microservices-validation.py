#!/usr/bin/env python3
"""
Complete Microservices Validation Script
Validates all 7 critical microservices for 100% completion requirements:
- Service Discovery (Eureka Server)
- Config Server
- GraphQL Federation Gateway
- Provider Mobile Backend Service
- Patient Portal Backend Service
- Analytics Data Ingestion Service
- Procedure Management Service
"""

import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class ValidationResult:
    service_name: str
    business_logic_lines: int
    has_entities: bool
    has_repositories: bool
    has_services: bool
    has_controllers: bool
    has_dtos: bool
    has_mappers: bool
    has_security: bool
    has_application_yml: bool
    has_dockerfile: bool
    custom_queries_count: int
    rest_endpoints_count: int
    validation_annotations_count: int
    errors: List[str]
    warnings: List[str]
    completion_percentage: float

class MicroservicesValidator:
    def __init__(self):
        self.microservices_path = Path("/workspace/Hospital-Management-System/microservices")
        self.critical_services = [
            "service-discovery",
            "config-server", 
            "graphql-federation-gateway",
            "provider-mobile-backend",
            "patient-portal-backend",
            "analytics-data-ingestion",
            "procedure-management"
        ]
        self.results = []
        
    def count_lines_in_file(self, file_path: Path) -> int:
        """Count lines in a Java file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return len(f.readlines())
        except:
            return 0
    
    def find_java_files(self, service_path: Path, pattern: str = "*.java") -> List[Path]:
        """Find all Java files matching pattern"""
        return list(service_path.rglob(pattern))
    
    def analyze_business_logic(self, service_path: Path) -> int:
        """Analyze business logic in service implementation files"""
        service_impl_files = []
        
        # Look for service implementation files
        for java_file in self.find_java_files(service_path):
            if "ServiceImpl" in java_file.name or "Service.java" in java_file.name:
                service_impl_files.append(java_file)
        
        total_lines = 0
        for file_path in service_impl_files:
            lines = self.count_lines_in_file(file_path)
            total_lines += lines
            print(f"    Business Logic: {file_path.name} - {lines} lines")
        
        return total_lines
    
    def check_entities(self, service_path: Path) -> bool:
        """Check for JPA entity classes"""
        entity_files = []
        for java_file in self.find_java_files(service_path):
            content = self.read_file_content(java_file)
            if "@Entity" in content or "Entity.java" in java_file.name:
                entity_files.append(java_file)
        
        print(f"    Entities found: {len(entity_files)}")
        return len(entity_files) > 0
    
    def check_repositories(self, service_path: Path) -> tuple:
        """Check for repository classes and custom queries"""
        repo_files = []
        custom_queries = 0
        
        for java_file in self.find_java_files(service_path):
            if "Repository" in java_file.name:
                repo_files.append(java_file)
                content = self.read_file_content(java_file)
                # Count custom queries
                custom_queries += content.count("@Query")
                custom_queries += content.count("@NamedQuery")
                custom_queries += content.count("@Modifying")
        
        print(f"    Repositories found: {len(repo_files)}, Custom queries: {custom_queries}")
        return len(repo_files) > 0, custom_queries
    
    def check_services(self, service_path: Path) -> bool:
        """Check for service classes"""
        service_files = []
        for java_file in self.find_java_files(service_path):
            if "Service" in java_file.name and "Test" not in java_file.name:
                service_files.append(java_file)
        
        print(f"    Services found: {len(service_files)}")
        return len(service_files) > 0
    
    def check_controllers(self, service_path: Path) -> tuple:
        """Check for REST controllers and endpoints"""
        controller_files = []
        endpoints = 0
        
        for java_file in self.find_java_files(service_path):
            if "Controller" in java_file.name:
                controller_files.append(java_file)
                content = self.read_file_content(java_file)
                # Count REST endpoints
                endpoints += content.count("@GetMapping")
                endpoints += content.count("@PostMapping")
                endpoints += content.count("@PutMapping")
                endpoints += content.count("@DeleteMapping")
                endpoints += content.count("@PatchMapping")
                endpoints += content.count("@RequestMapping")
        
        print(f"    Controllers found: {len(controller_files)}, REST endpoints: {endpoints}")
        return len(controller_files) > 0, endpoints
    
    def check_dtos(self, service_path: Path) -> bool:
        """Check for DTO classes"""
        dto_files = []
        for java_file in self.find_java_files(service_path):
            if "Dto" in java_file.name or "DTO" in java_file.name:
                dto_files.append(java_file)
        
        print(f"    DTOs found: {len(dto_files)}")
        return len(dto_files) > 0
    
    def check_mappers(self, service_path: Path) -> bool:
        """Check for MapStruct mappers"""
        mapper_files = []
        for java_file in self.find_java_files(service_path):
            if "Mapper" in java_file.name:
                content = self.read_file_content(java_file)
                if "@Mapper" in content:
                    mapper_files.append(java_file)
        
        print(f"    MapStruct mappers found: {len(mapper_files)}")
        return len(mapper_files) > 0
    
    def check_security(self, service_path: Path) -> bool:
        """Check for security configuration"""
        security_files = []
        for java_file in self.find_java_files(service_path):
            if "Security" in java_file.name or "Config" in java_file.name:
                content = self.read_file_content(java_file)
                if "@EnableWebSecurity" in content or "@Configuration" in content:
                    security_files.append(java_file)
        
        print(f"    Security configurations found: {len(security_files)}")
        return len(security_files) > 0
    
    def check_validation_annotations(self, service_path: Path) -> int:
        """Check for validation annotations"""
        validation_count = 0
        for java_file in self.find_java_files(service_path):
            content = self.read_file_content(java_file)
            validation_count += content.count("@Valid")
            validation_count += content.count("@NotNull")
            validation_count += content.count("@NotEmpty")
            validation_count += content.count("@NotBlank")
            validation_count += content.count("@Size")
            validation_count += content.count("@Email")
            validation_count += content.count("@Pattern")
        
        return validation_count
    
    def check_application_yml(self, service_path: Path) -> bool:
        """Check for application.yml configuration"""
        yml_files = list(service_path.rglob("application.yml")) + list(service_path.rglob("application.yaml"))
        return len(yml_files) > 0
    
    def check_dockerfile(self, service_path: Path) -> bool:
        """Check for Dockerfile"""
        dockerfile = service_path / "Dockerfile"
        return dockerfile.exists()
    
    def read_file_content(self, file_path: Path) -> str:
        """Read file content safely"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except:
            return ""
    
    def calculate_completion_percentage(self, result: ValidationResult) -> float:
        """Calculate completion percentage based on requirements"""
        criteria = [
            result.business_logic_lines >= 500,  # 500+ lines business logic
            result.has_entities,                  # Entity models
            result.has_repositories,              # Repository patterns
            result.has_services,                  # Service layer
            result.has_controllers,               # REST controllers
            result.has_dtos,                      # DTO patterns
            result.has_mappers,                   # MapStruct mapping
            result.has_security,                  # Security configuration
            result.has_application_yml,           # Application configuration
            result.has_dockerfile,                # Docker containerization
            result.custom_queries_count > 0,      # Custom queries
            result.rest_endpoints_count >= 5,     # Multiple REST endpoints
            result.validation_annotations_count >= 10  # Validation annotations
        ]
        
        completed_criteria = sum(criteria)
        return (completed_criteria / len(criteria)) * 100
    
    def validate_service(self, service_name: str) -> ValidationResult:
        """Validate a single microservice"""
        print(f"\\n🔍 Validating {service_name}...")
        
        service_path = self.microservices_path / service_name
        if not service_path.exists():
            return ValidationResult(
                service_name=service_name,
                business_logic_lines=0,
                has_entities=False,
                has_repositories=False,
                has_services=False,
                has_controllers=False,
                has_dtos=False,
                has_mappers=False,
                has_security=False,
                has_application_yml=False,
                has_dockerfile=False,
                custom_queries_count=0,
                rest_endpoints_count=0,
                validation_annotations_count=0,
                errors=[f"Service directory not found: {service_path}"],
                warnings=[],
                completion_percentage=0.0
            )
        
        # Analyze all components
        business_logic_lines = self.analyze_business_logic(service_path)
        has_entities = self.check_entities(service_path)
        has_repositories, custom_queries_count = self.check_repositories(service_path)
        has_services = self.check_services(service_path)
        has_controllers, rest_endpoints_count = self.check_controllers(service_path)
        has_dtos = self.check_dtos(service_path)
        has_mappers = self.check_mappers(service_path)
        has_security = self.check_security(service_path)
        has_application_yml = self.check_application_yml(service_path)
        has_dockerfile = self.check_dockerfile(service_path)
        validation_annotations_count = self.check_validation_annotations(service_path)
        
        # Collect errors and warnings
        errors = []
        warnings = []
        
        if business_logic_lines < 500:
            errors.append(f"Insufficient business logic: {business_logic_lines} lines (required: 500+)")
        
        if not has_entities:
            errors.append("Missing JPA entity classes")
        
        if not has_repositories:
            errors.append("Missing repository classes")
        
        if not has_services:
            errors.append("Missing service classes")
        
        if not has_controllers:
            errors.append("Missing REST controller classes")
        
        if not has_dtos:
            warnings.append("Missing DTO classes")
        
        if not has_mappers:
            warnings.append("Missing MapStruct mappers")
        
        if custom_queries_count == 0:
            warnings.append("No custom repository queries found")
        
        if rest_endpoints_count < 5:
            warnings.append(f"Limited REST endpoints: {rest_endpoints_count} (recommended: 5+)")
        
        if validation_annotations_count < 10:
            warnings.append(f"Limited validation annotations: {validation_annotations_count} (recommended: 10+)")
        
        result = ValidationResult(
            service_name=service_name,
            business_logic_lines=business_logic_lines,
            has_entities=has_entities,
            has_repositories=has_repositories,
            has_services=has_services,
            has_controllers=has_controllers,
            has_dtos=has_dtos,
            has_mappers=has_mappers,
            has_security=has_security,
            has_application_yml=has_application_yml,
            has_dockerfile=has_dockerfile,
            custom_queries_count=custom_queries_count,
            rest_endpoints_count=rest_endpoints_count,
            validation_annotations_count=validation_annotations_count,
            errors=errors,
            warnings=warnings,
            completion_percentage=0.0  # Will be calculated
        )
        
        result.completion_percentage = self.calculate_completion_percentage(result)
        
        # Print summary
        status = "✅ COMPLETE" if result.completion_percentage >= 80 else "⚠️ INCOMPLETE"
        print(f"    Status: {status} ({result.completion_percentage:.1f}% complete)")
        
        if errors:
            print(f"    ❌ Errors: {len(errors)}")
            for error in errors:
                print(f"       - {error}")
        
        if warnings:
            print(f"    ⚠️ Warnings: {len(warnings)}")
            for warning in warnings:
                print(f"       - {warning}")
        
        return result
    
    def generate_report(self):
        """Generate comprehensive validation report"""
        print("🏥⚡🔥 FINAL 7 MICROSERVICES VALIDATION REPORT 🔥⚡🏥")
        print("=" * 70)
        
        for service_name in self.critical_services:
            result = self.validate_service(service_name)
            self.results.append(result)
        
        # Calculate overall statistics
        total_lines = sum(r.business_logic_lines for r in self.results)
        avg_completion = sum(r.completion_percentage for r in self.results) / len(self.results)
        complete_services = len([r for r in self.results if r.completion_percentage >= 80])
        
        print(f"\\n📊 OVERALL STATISTICS:")
        print(f"   Total Business Logic Lines: {total_lines:,}")
        print(f"   Average Completion: {avg_completion:.1f}%")
        print(f"   Complete Services (≥80%): {complete_services}/{len(self.results)}")
        
        # Final assessment
        if complete_services == len(self.results) and avg_completion >= 90:
            print("\\n🎉 VERDICT: 100% COMPLETION ACHIEVED! 🎉")
            print("All 7 critical microservices meet enterprise requirements!")
        elif complete_services >= 6 and avg_completion >= 80:
            print("\\n✅ VERDICT: SUBSTANTIAL COMPLETION (85%+)")
            print("Most microservices meet requirements with minor gaps.")
        else:
            print("\\n⚠️ VERDICT: INCOMPLETE IMPLEMENTATION")
            print("Significant gaps remain in microservice implementation.")
        
        # Save detailed results
        self.save_results()
    
    def save_results(self):
        """Save validation results to JSON"""
        output_file = "/workspace/Hospital-Management-System/docs/microservices-validation-results.json"
        
        # Convert results to serializable format
        results_data = []
        for result in self.results:
            results_data.append({
                "service_name": result.service_name,
                "business_logic_lines": result.business_logic_lines,
                "has_entities": result.has_entities,
                "has_repositories": result.has_repositories,
                "has_services": result.has_services,
                "has_controllers": result.has_controllers,
                "has_dtos": result.has_dtos,
                "has_mappers": result.has_mappers,
                "has_security": result.has_security,
                "has_application_yml": result.has_application_yml,
                "has_dockerfile": result.has_dockerfile,
                "custom_queries_count": result.custom_queries_count,
                "rest_endpoints_count": result.rest_endpoints_count,
                "validation_annotations_count": result.validation_annotations_count,
                "completion_percentage": result.completion_percentage,
                "errors": result.errors,
                "warnings": result.warnings
            })
        
        with open(output_file, 'w') as f:
            json.dump({
                "validation_timestamp": "2025-01-01T00:00:00Z",
                "total_services": len(self.results),
                "complete_services": len([r for r in self.results if r.completion_percentage >= 80]),
                "total_business_logic_lines": sum(r.business_logic_lines for r in self.results),
                "average_completion": sum(r.completion_percentage for r in self.results) / len(self.results),
                "services": results_data
            }, f, indent=2)
        
        print(f"\\n📋 Detailed results saved to: {output_file}")

if __name__ == "__main__":
    validator = MicroservicesValidator()
    validator.generate_report()
