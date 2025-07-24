-- Migration: Add Persistent Services Schema
-- Description: Adds all necessary tables for persistent EHR, Quality Management, and IPD services
-- Version: 1.0
-- Date: 2025-06-07

-- Quality Management Tables
CREATE TABLE IF NOT EXISTS QualityIndicator (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('clinical', 'patient_safety', 'operational', 'financial')),
    source TEXT NOT NULL CHECK (source IN ('jcaho_core_measures', 'nabh', 'jci', 'internal')),
    dataSource TEXT NOT NULL DEFAULT 'manual' CHECK (dataSource IN ('manual', 'automated', 'integrated')),
    numeratorDefinition TEXT NOT NULL,
    denominatorDefinition TEXT NOT NULL,
    targetValue REAL,
    targetOperator TEXT CHECK (targetOperator IN ('>=', '<=', '=', '>', '<')),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually')),
    reportingLevel TEXT NOT NULL CHECK (reportingLevel IN ('department', 'hospital', 'system')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
    stratificationCriteria TEXT, -- JSON string
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL,
    updatedBy TEXT
);

CREATE TABLE IF NOT EXISTS QualityEvent (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    eventType TEXT NOT NULL CHECK (eventType IN ('incident', 'near_miss', 'adverse_event', 'sentinel_event')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    patientId TEXT,
    departmentId TEXT,
    locationId TEXT,
    eventDateTime DATETIME NOT NULL,
    reportedDateTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reportedBy TEXT NOT NULL,
    categoryCode TEXT,
    subcategoryCode TEXT,
    rootCause TEXT,
    contributingFactors TEXT, -- JSON array
    investigationNotes TEXT,
    correctiveActions TEXT, -- JSON array
    preventiveActions TEXT, -- JSON array
    lessonsLearned TEXT,
    qualityIndicatorId TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL,
    updatedBy TEXT,
    FOREIGN KEY (qualityIndicatorId) REFERENCES QualityIndicator(id)
);

CREATE TABLE IF NOT EXISTS QualityAssessment (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    type TEXT NOT NULL CHECK (type IN ('nabh', 'jci', 'internal_audit', 'peer_review')),
    title TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL CHECK (scope IN ('department', 'hospital', 'service_line')),
    standardVersion TEXT,
    assessmentDate DATETIME NOT NULL,
    dueDate DATETIME,
    completedDate DATETIME,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    leadAssessor TEXT NOT NULL,
    assessors TEXT NOT NULL, -- JSON array
    overallScore REAL,
    maxScore REAL,
    overallCompliance REAL, -- Percentage
    findings TEXT, -- JSON array
    recommendations TEXT, -- JSON array
    certificationBody TEXT,
    certificationStatus TEXT CHECK (certificationStatus IN ('pending', 'achieved', 'expired', 'suspended')),
    certificationDate DATETIME,
    expiryDate DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL,
    updatedBy TEXT
);

CREATE TABLE IF NOT EXISTS QualityMetrics (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    indicatorId TEXT NOT NULL,
    measurementPeriod DATETIME NOT NULL,
    periodType TEXT NOT NULL CHECK (periodType IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually')),
    numeratorValue REAL NOT NULL,
    denominatorValue REAL NOT NULL,
    rate REAL,
    targetValue REAL,
    varianceFromTarget REAL,
    stratificationData TEXT, -- JSON object
    dataQualityScore REAL,
    dataCompletenessRate REAL,
    dataSource TEXT NOT NULL CHECK (dataSource IN ('manual', 'automated', 'integrated')),
    verificationStatus TEXT NOT NULL DEFAULT 'pending' CHECK (verificationStatus IN ('pending', 'verified', 'rejected')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enteredBy TEXT NOT NULL,
    verifiedBy TEXT,
    FOREIGN KEY (indicatorId) REFERENCES QualityIndicator(id) ON DELETE CASCADE,
    UNIQUE(indicatorId, measurementPeriod, periodType)
);

CREATE TABLE IF NOT EXISTS ComplianceReport (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    assessmentId TEXT,
    title TEXT NOT NULL,
    reportType TEXT NOT NULL CHECK (reportType IN ('nabh', 'jci', 'regulatory', 'internal')),
    regulatoryBody TEXT NOT NULL,
    standard TEXT NOT NULL,
    reportingPeriod TEXT NOT NULL,
    overallCompliance REAL NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'conditional')),
    requirements TEXT NOT NULL, -- JSON array
    findings TEXT, -- JSON array
    gaps TEXT, -- JSON array
    actionPlanId TEXT,
    submissionDate DATETIME,
    submittedBy TEXT,
    approvalStatus TEXT NOT NULL DEFAULT 'draft' CHECK (approvalStatus IN ('draft', 'submitted', 'approved', 'rejected')),
    approvedBy TEXT,
    approvalDate DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL,
    updatedBy TEXT,
    FOREIGN KEY (assessmentId) REFERENCES QualityAssessment(id)
);

CREATE TABLE IF NOT EXISTS ActionPlan (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('corrective', 'preventive', 'improvement')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'approved', 'in_progress', 'completed', 'cancelled')),
    departmentId TEXT,
    impactedAreas TEXT, -- JSON array
    targetDate DATETIME NOT NULL,
    startDate DATETIME,
    completedDate DATETIME,
    ownerId TEXT NOT NULL,
    teamMembers TEXT, -- JSON array
    estimatedCost REAL,
    actualCost REAL,
    budgetApproved BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL,
    updatedBy TEXT
);

CREATE TABLE IF NOT EXISTS ActionItem (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    actionPlanId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    assignedTo TEXT NOT NULL,
    estimatedHours REAL,
    actualHours REAL,
    dueDate DATETIME NOT NULL,
    completedDate DATETIME,
    dependencies TEXT, -- JSON array
    blockers TEXT, -- JSON array
    progressPercentage REAL NOT NULL DEFAULT 0,
    notes TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actionPlanId) REFERENCES ActionPlan(id) ON DELETE CASCADE
);

-- IPD Management Tables
CREATE TABLE IF NOT EXISTS Ward (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL,
    wardType TEXT NOT NULL CHECK (wardType IN ('general', 'icu', 'maternity', 'pediatric', 'psychiatric', 'isolation')),
    departmentId TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Bed (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    wardId TEXT NOT NULL,
    bedNumber TEXT NOT NULL,
    roomNumber TEXT,
    bedType TEXT NOT NULL CHECK (bedType IN ('general', 'icu', 'isolation', 'maternity', 'pediatric', 'psychiatric')),
    accommodationClass TEXT NOT NULL CHECK (accommodationClass IN ('general', 'semi_private', 'private', 'icu', 'isolation')),
    bedStatus TEXT NOT NULL DEFAULT 'available' CHECK (bedStatus IN ('available', 'occupied', 'maintenance', 'cleaning', 'reserved')),
    equipment TEXT, -- JSON array
    features TEXT, -- JSON array
    isolationCapable BOOLEAN NOT NULL DEFAULT FALSE,
    availableFrom DATETIME,
    reservedUntil DATETIME,
    reservedForPatient TEXT,
    occupiedByAdmissionId TEXT,
    lastCleaned DATETIME,
    lastMaintenance DATETIME,
    maintenanceNotes TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wardId) REFERENCES Ward(id),
    UNIQUE(wardId, bedNumber)
);

CREATE TABLE IF NOT EXISTS Admission (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    patientId TEXT NOT NULL,
    admissionDate DATETIME NOT NULL,
    admissionTime TEXT,
    admissionType TEXT NOT NULL CHECK (admissionType IN ('emergency', 'elective', 'transfer', 'delivery', 'observation')),
    admissionSource TEXT NOT NULL CHECK (admissionSource IN ('emergency_room', 'outpatient', 'transfer_from_other_facility', 'direct_admission', 'referral')),
    chiefComplaint TEXT NOT NULL,
    admittingDiagnosis TEXT NOT NULL,
    secondaryDiagnoses TEXT, -- JSON array
    icd10Codes TEXT, -- JSON array
    attendingDoctorId TEXT NOT NULL,
    referringDoctorId TEXT,
    consultingDoctors TEXT, -- JSON array
    wardId TEXT NOT NULL,
    roomNumber TEXT,
    bedNumber TEXT NOT NULL,
    accommodationClass TEXT NOT NULL CHECK (accommodationClass IN ('general', 'semi_private', 'private', 'icu', 'isolation')),
    insuranceDetails TEXT, -- JSON object
    emergencyContact TEXT NOT NULL, -- JSON object
    admissionNotes TEXT,
    estimatedLengthOfStay INTEGER,
    priorityLevel TEXT NOT NULL DEFAULT 'routine' CHECK (priorityLevel IN ('routine', 'urgent', 'emergent')),
    isolationRequired BOOLEAN NOT NULL DEFAULT FALSE,
    isolationType TEXT,
    admittedBy TEXT NOT NULL,
    admissionStatus TEXT NOT NULL DEFAULT 'active' CHECK (admissionStatus IN ('active', 'discharged', 'transferred', 'cancelled')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wardId) REFERENCES Ward(id),
    FOREIGN KEY (patientId) REFERENCES Patient(id)
);

CREATE TABLE IF NOT EXISTS Discharge (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    admissionId TEXT NOT NULL,
    dischargeDate DATETIME NOT NULL,
    dischargeTime TEXT,
    dischargeType TEXT NOT NULL CHECK (dischargeType IN ('routine', 'against_medical_advice', 'transfer', 'death', 'absconded')),
    dischargeDisposition TEXT NOT NULL CHECK (dischargeDisposition IN ('home', 'home_with_services', 'skilled_nursing_facility', 'rehabilitation', 'hospice', 'deceased', 'other')),
    finalDiagnosis TEXT NOT NULL,
    secondaryDiagnoses TEXT, -- JSON array
    proceduresPerformed TEXT, -- JSON array
    dischargeInstructions TEXT NOT NULL,
    medicationsOnDischarge TEXT, -- JSON array
    followUpAppointments TEXT, -- JSON array
    functionalStatusOnAdmission TEXT,
    functionalStatusOnDischarge TEXT,
    readmissionRisk TEXT CHECK (readmissionRisk IN ('low', 'medium', 'high')),
    patientSatisfactionScore INTEGER CHECK (patientSatisfactionScore BETWEEN 1 AND 10),
    dischargeSummary TEXT,
    complications TEXT,
    lengthOfStay INTEGER,
    totalCharges REAL,
    dischargedBy TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admissionId) REFERENCES Admission(id)
);

CREATE TABLE IF NOT EXISTS Transfer (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    admissionId TEXT NOT NULL,
    transferDate DATETIME NOT NULL,
    transferTime TEXT,
    transferType TEXT NOT NULL CHECK (transferType IN ('internal', 'external', 'icu_to_ward', 'ward_to_icu', 'ward_to_ward')),
    fromWardId TEXT NOT NULL,
    fromRoom TEXT,
    fromBed TEXT NOT NULL,
    toWardId TEXT NOT NULL,
    toRoom TEXT,
    toBed TEXT NOT NULL,
    reasonForTransfer TEXT NOT NULL,
    clinicalCondition TEXT,
    transferDiagnosis TEXT,
    transferringDoctor TEXT NOT NULL,
    receivingDoctor TEXT NOT NULL,
    externalFacilityName TEXT,
    externalFacilityAddress TEXT,
    transportMethod TEXT CHECK (transportMethod IN ('ambulance', 'private_vehicle', 'wheelchair', 'stretcher', 'walking')),
    transferNotes TEXT,
    equipmentTransferred TEXT, -- JSON array
    medicationsDuringTransfer TEXT,
    initiatedBy TEXT NOT NULL,
    approvedBy TEXT,
    transferStatus TEXT NOT NULL DEFAULT 'pending' CHECK (transferStatus IN ('pending', 'approved', 'completed', 'cancelled')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admissionId) REFERENCES Admission(id),
    FOREIGN KEY (fromWardId) REFERENCES Ward(id),
    FOREIGN KEY (toWardId) REFERENCES Ward(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_quality_indicator_category ON QualityIndicator(category);
CREATE INDEX IF NOT EXISTS idx_quality_indicator_source ON QualityIndicator(source);
CREATE INDEX IF NOT EXISTS idx_quality_indicator_status ON QualityIndicator(status);
CREATE INDEX IF NOT EXISTS idx_quality_event_type ON QualityEvent(eventType);
CREATE INDEX IF NOT EXISTS idx_quality_event_severity ON QualityEvent(severity);
CREATE INDEX IF NOT EXISTS idx_quality_event_status ON QualityEvent(status);
CREATE INDEX IF NOT EXISTS idx_quality_event_datetime ON QualityEvent(eventDateTime);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_indicator ON QualityMetrics(indicatorId);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_period ON QualityMetrics(measurementPeriod);
CREATE INDEX IF NOT EXISTS idx_admission_patient ON Admission(patientId);
CREATE INDEX IF NOT EXISTS idx_admission_doctor ON Admission(attendingDoctorId);
CREATE INDEX IF NOT EXISTS idx_admission_ward ON Admission(wardId);
CREATE INDEX IF NOT EXISTS idx_admission_date ON Admission(admissionDate);
CREATE INDEX IF NOT EXISTS idx_admission_status ON Admission(admissionStatus);
CREATE INDEX IF NOT EXISTS idx_bed_ward ON Bed(wardId);
CREATE INDEX IF NOT EXISTS idx_bed_status ON Bed(bedStatus);
CREATE INDEX IF NOT EXISTS idx_bed_ward_number ON Bed(wardId, bedNumber);
CREATE INDEX IF NOT EXISTS idx_discharge_admission ON Discharge(admissionId);
CREATE INDEX IF NOT EXISTS idx_discharge_date ON Discharge(dischargeDate);
CREATE INDEX IF NOT EXISTS idx_transfer_admission ON Transfer(admissionId);
CREATE INDEX IF NOT EXISTS idx_transfer_date ON Transfer(transferDate);
CREATE INDEX IF NOT EXISTS idx_action_plan_status ON ActionPlan(status);
CREATE INDEX IF NOT EXISTS idx_action_plan_priority ON ActionPlan(priority);
CREATE INDEX IF NOT EXISTS idx_action_item_plan ON ActionItem(actionPlanId);
CREATE INDEX IF NOT EXISTS idx_action_item_assigned ON ActionItem(assignedTo);
CREATE INDEX IF NOT EXISTS idx_action_item_due ON ActionItem(dueDate);

-- Add triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_quality_indicator_timestamp 
    AFTER UPDATE ON QualityIndicator
    FOR EACH ROW
    BEGIN
        UPDATE QualityIndicator SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_quality_event_timestamp 
    AFTER UPDATE ON QualityEvent
    FOR EACH ROW
    BEGIN
        UPDATE QualityEvent SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_quality_assessment_timestamp 
    AFTER UPDATE ON QualityAssessment
    FOR EACH ROW
    BEGIN
        UPDATE QualityAssessment SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_quality_metrics_timestamp 
    AFTER UPDATE ON QualityMetrics
    FOR EACH ROW
    BEGIN
        UPDATE QualityMetrics SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_compliance_report_timestamp 
    AFTER UPDATE ON ComplianceReport
    FOR EACH ROW
    BEGIN
        UPDATE ComplianceReport SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_action_plan_timestamp 
    AFTER UPDATE ON ActionPlan
    FOR EACH ROW
    BEGIN
        UPDATE ActionPlan SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_action_item_timestamp 
    AFTER UPDATE ON ActionItem
    FOR EACH ROW
    BEGIN
        UPDATE ActionItem SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_ward_timestamp 
    AFTER UPDATE ON Ward
    FOR EACH ROW
    BEGIN
        UPDATE Ward SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_bed_timestamp 
    AFTER UPDATE ON Bed
    FOR EACH ROW
    BEGIN
        UPDATE Bed SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_admission_timestamp 
    AFTER UPDATE ON Admission
    FOR EACH ROW
    BEGIN
        UPDATE Admission SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_discharge_timestamp 
    AFTER UPDATE ON Discharge
    FOR EACH ROW
    BEGIN
        UPDATE Discharge SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_transfer_timestamp 
    AFTER UPDATE ON Transfer
    FOR EACH ROW
    BEGIN
        UPDATE Transfer SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Insert sample data for testing
INSERT OR IGNORE INTO Ward (id, name, description, capacity, wardType) VALUES
('ward_001', 'General Medicine Ward A', 'General medicine ward for adult patients', 24, 'general'),
('ward_002', 'ICU Ward', 'Intensive Care Unit', 12, 'icu'),
('ward_003', 'Maternity Ward', 'Maternity and obstetrics ward', 16, 'maternity'),
('ward_004', 'Pediatric Ward', 'Children and adolescent ward', 20, 'pediatric');

INSERT OR IGNORE INTO Bed (wardId, bedNumber, roomNumber, bedType, accommodationClass) VALUES
('ward_001', 'B001', 'R101', 'general', 'general'),
('ward_001', 'B002', 'R101', 'general', 'general'),
('ward_001', 'B003', 'R102', 'general', 'semi_private'),
('ward_001', 'B004', 'R102', 'general', 'semi_private'),
('ward_002', 'ICU001', 'ICU1', 'icu', 'icu'),
('ward_002', 'ICU002', 'ICU2', 'icu', 'icu'),
('ward_003', 'MAT001', 'M101', 'general', 'private'),
('ward_003', 'MAT002', 'M102', 'general', 'private'),
('ward_004', 'PED001', 'P101', 'pediatric', 'general'),
('ward_004', 'PED002', 'P101', 'pediatric', 'general');

-- Sample Quality Indicators
INSERT OR IGNORE INTO QualityIndicator (id, name, description, category, source, numeratorDefinition, denominatorDefinition, frequency, reportingLevel, createdBy) VALUES
('qi_001', 'Hospital Acquired Infection Rate', 'Rate of hospital-acquired infections per 1000 patient days', 'patient_safety', 'jcaho_core_measures', 'Number of hospital-acquired infections', 'Total patient days', 'monthly', 'hospital', 'system'),
('qi_002', 'Patient Fall Rate', 'Rate of patient falls per 1000 patient days', 'patient_safety', 'nabh', 'Number of patient falls', 'Total patient days', 'monthly', 'hospital', 'system'),
('qi_003', 'Average Length of Stay', 'Average length of stay for discharged patients', 'operational', 'internal', 'Total length of stay days', 'Number of discharged patients', 'monthly', 'hospital', 'system'),
('qi_004', 'Readmission Rate', '30-day readmission rate', 'clinical', 'jci', 'Number of 30-day readmissions', 'Total discharges', 'monthly', 'hospital', 'system');

COMMIT;
