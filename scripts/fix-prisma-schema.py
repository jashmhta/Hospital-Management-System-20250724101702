#!/usr/bin/env python3
"""
Fix Prisma Schema - Remove Duplicates and Add Missing Models
==========================================================
"""

import os
import re

def fix_prisma_schema():
    """Fix the Prisma schema by removing duplicates and adding missing models."""
    print("🔧 Fixing Prisma schema...")
    
    schema_path = 'prisma/schema.prisma'
    if not os.path.exists(schema_path):
        print("❌ Prisma schema not found")
        return
    
    with open(schema_path, 'r') as f:
        content = f.read()
    
    # Remove the duplicated enhanced models section
    enhanced_section_start = content.find("// =========================================")
    enhanced_section_end = content.find("enum LogSeverity {")
    
    if enhanced_section_start != -1 and enhanced_section_end != -1:
        # Find the end of LogSeverity enum
        enum_end = content.find("}", enhanced_section_end) + 1
        
        # Remove the enhanced section
        content_before = content[:enhanced_section_start]
        content_after = content[enum_end:]
        content = content_before + content_after
        
        print("✅ Removed duplicate enhanced models section")
    
    # Add missing models that are referenced but don't exist
    missing_models = '''
// Missing models referenced in relations
model Admission {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  roomNumber  String?
  bedNumber   String?
  admissionDate DateTime @default(now())
  dischargeDate DateTime?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("admissions")
}

model EmergencyVisit {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  triageLevel String
  complaint   String
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("emergency_visits")
}

model LabOrder {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  testName    String
  status      String   @default("ORDERED")
  results     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("lab_orders")
}

model RadiologyOrder {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  examType    String
  status      String   @default("ORDERED")
  results     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("radiology_orders")
}

model Prescription {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  medication  String
  dosage      String
  frequency   String
  duration    String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("prescriptions")
}

model Bed {
  id           String      @id @default(cuid())
  bedNumber    String      @unique
  roomNumber   String
  departmentId String
  department   Department  @relation(fields: [departmentId], references: [id])
  isOccupied   Boolean     @default(false)
  bedType      String      @default("GENERAL")
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  @@map("beds")
}
'''
    
    # Add missing models before the last closing brace or at the end
    if not "model Admission {" in content:
        content += missing_models
        print("✅ Added missing referenced models")
    
    # Write the fixed schema
    with open(schema_path, 'w') as f:
        f.write(content)
    
    print("✅ Fixed Prisma schema")

def main():
    """Execute schema fixes."""
    fix_prisma_schema()

if __name__ == "__main__":
    main()
