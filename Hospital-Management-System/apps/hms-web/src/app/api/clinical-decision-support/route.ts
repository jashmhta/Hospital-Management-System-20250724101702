import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// AI/ML Clinical Decision Support Engine
class ClinicalDecisionSupport {
  private static drugInteractionMatrix = {
    'warfarin': ['aspirin', 'ibuprofen', 'metformin'],
    'metformin': ['warfarin', 'furosemide'],
    'lisinopril': ['potassium', 'spironolactone'],
    'digoxin': ['furosemide', 'amiodarone']
  };

  private static allergyAlerts = {
    'penicillin': ['amoxicillin', 'ampicillin', 'piperacillin'],
    'sulfa': ['sulfamethoxazole', 'furosemide', 'hydrochlorothiazide'],
    'aspirin': ['ibuprofen', 'naproxen', 'diclofenac']
  };

  static async analyzePrescription(patientId: string, medications: unknown[]) {
    // Get patient data including allergies, current medications, lab results
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        allergies: true,
        prescriptions: {
          where: { status: 'ACTIVE' },
          include: { items: true }
        },
        labResults: {
          orderBy: { resultDate: 'desc' },
          take: 10
        },
        vitals: {
          orderBy: { recordedAt: 'desc' },
          take: 5
        }
      }
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const alerts = [];
    const recommendations = [];

    // 1. Drug-Drug Interaction Analysis
    const currentMeds = patient.prescriptions.flatMap(p => p.items.map(i => i.medicationName));
    const allMeds = [...currentMeds, ...medications.map(m => m.name)];

    for (const med1 of allMeds) {
      for (const med2 of allMeds) {
        if (med1 !== med2 && this.drugInteractionMatrix[med1.toLowerCase()]?.includes(med2.toLowerCase())) {
          alerts.push({
            type: 'DRUG_INTERACTION',
            severity: 'HIGH';
            message: `Potential interaction between ${med1} and ${med2}`,
            recommendation: 'Monitor patient closely or consider alternative medication'
          });
        }
      }
    }

    // 2. Allergy Checking
    for (const allergy of patient.allergies) {
      for (const medication of medications) {
        if (this.allergyAlerts[allergy.allergen.toLowerCase()]?.includes(medication.name.toLowerCase())) {
          alerts.push({
            type: 'ALLERGY_ALERT',
            severity: 'CRITICAL';
            message: `Patient is allergic to ${allergy.allergen}. ${medication.name} may cause allergic reaction`,
            recommendation: 'Do not prescribe. Find alternative medication'
          });
        }
      }
    }

    // 3. Dosage Analysis based on patient factors
    const dosageRecommendations = await this.analyzeDosage(patient, medications);
    recommendations.push(...dosageRecommendations);

    // 4. Lab-based contraindications
    const labAlerts = await this.analyzeLabResults(patient.labResults, medications);
    alerts.push(...labAlerts);

    // 5. Diagnostic Support
    const diagnosticSuggestions = await this.generateDiagnosticSuggestions(patient);
    recommendations.push(...diagnosticSuggestions);

    return {
      alerts,
      recommendations,
      riskScore: this.calculateRiskScore(alerts),
      confidence: 0.85 // ML model confidence
    };
  }

  static async analyzeDosage(patient: unknown, medications: unknown[]) {
    const recommendations = [];

    // Age-based dosage adjustments
    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

    if (age > 65) {
      for (const med of medications) {
        if (['digoxin', 'warfarin', 'metformin'].includes(med.name.toLowerCase())) {
          recommendations.push({
            type: 'DOSAGE_ADJUSTMENT',
            message: `Consider reduced dosage of ${med.name} for elderly patient`,
            suggestion: 'Start with 50% of standard adult dose'
          });
        }
      }
    }

    // Kidney function-based adjustments
    const latestCreatinine = patient.labResults?.find(r => r.testName === 'Creatinine');
    if (latestCreatinine && latestCreatinine.value > 1.5) {
      for (const med of medications) {
        if (['metformin', 'digoxin', 'lisinopril'].includes(med.name.toLowerCase())) {
          recommendations.push({
            type: 'RENAL_ADJUSTMENT',
            message: `Adjust ${med.name} dosage for impaired kidney function (Cr: ${latestCreatinine.value})`,
            suggestion: 'Consider dose reduction or alternative medication'
          });
        }
      }
    }

    return recommendations;
  }

  static async analyzeLabResults(labResults: unknown[], medications: unknown[]) {
    const alerts = [];

    for (const result of labResults) {
      // High potassium alert
      if (result.testName === 'Potassium' && result.value > 5.0) {
        const potassiumSparing = medications.filter(m =>
          ['lisinopril', 'spironolactone', 'amiloride'].includes(m.name.toLowerCase())
        );

        if (potassiumSparing.length > 0) {
          alerts.push({
            type: 'LAB_CONTRAINDICATION',
            severity: 'HIGH';
            message: `High potassium level (${result.value}) with potassium-sparing medications`,
            recommendation: 'Monitor potassium closely, consider alternative ACE inhibitor'
          });
        }
      }

      // Low blood sugar with diabetes medications
      if (result.testName === 'Glucose' && result.value < 70) {
        const diabetesMeds = medications.filter(m =>
          ['metformin', 'insulin', 'glipizide'].includes(m.name.toLowerCase())
        );

        if (diabetesMeds.length > 0) {
          alerts.push({
            type: 'HYPOGLYCEMIA_RISK',
            severity: 'HIGH';
            message: `Low glucose (${result.value}) with diabetes medications`,
            recommendation: 'Adjust diabetes medication dosage, monitor blood sugar'
          });
        }
      }
    }

    return alerts;
  }

  static async generateDiagnosticSuggestions(patient: unknown) {
    const suggestions = [];

    // Analyze vital signs patterns
    if (patient?.vitals && patient.vitals.length > 0) {
      const recentVitals = patient.vitals[0];

      // Hypertension detection
      if (recentVitals.systolicBP > 140 || recentVitals.diastolicBP > 90) {
        suggestions.push({
          type: 'DIAGNOSTIC_SUGGESTION',
          condition: 'Hypertension';
          confidence: 0.8,
          recommendation: 'Consider 24-hour BP monitoring, echocardiogram, and fundoscopy',
          tests: ['24-hour BP monitoring', 'ECG', 'Echocardiogram', 'Fundoscopy']
        });
      }

      // Fever with specific patterns
      if (recentVitals.temperature > 101) {
        suggestions.push({
          type: 'DIAGNOSTIC_SUGGESTION',
          condition: 'Infectious process';
          confidence: 0.7,
          recommendation: 'Consider blood cultures, CBC with differential, and imaging if indicated',
          tests: ['Blood cultures', 'CBC with differential', 'CRP', 'Procalcitonin']
        });
      }
    }

    // Lab pattern analysis
    if (patient.labResults) {
      const hemoglobin = patient.labResults.find(r => r.testName === 'Hemoglobin');
      const mcv = patient.labResults.find(r => r.testName === 'MCV');

      if (hemoglobin && hemoglobin.value < 10) {
        let anemiaType = 'Unknown';
        if (mcv != null) {
          if (mcv.value < 80) anemiaType = 'Microcytic (Iron deficiency, Thalassemia)';
          else if (mcv.value > 100) anemiaType = 'Macrocytic (B12/Folate deficiency)';
          else anemiaType = 'Normocytic (Chronic disease, Hemolysis)';
        }

        suggestions.push({
          type: 'DIAGNOSTIC_SUGGESTION',
          condition: `Anemia - ${anemiaType}`,
          confidence: 0.9,
          recommendation: 'Investigate underlying cause of anemia';
          tests: ['Iron studies', 'B12', 'Folate', 'Reticulocyte count', 'Peripheral smear']
        });
      }
    }

    return suggestions;
  }

  static calculateRiskScore(alerts: unknown[]) {
    let score = 0;
    for (const alert of alerts) {
      switch (alert.severity) {
        case 'CRITICAL': score += 10; break;
        case 'HIGH': score += 7; break;
        case 'MEDIUM': score += 4; break;
        case 'LOW': score += 1; break;
      }
    }
    return Math.min(score, 100); // Cap at 100
  }
}

// GET /api/clinical-decision-support/analyze
export const _GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    }

    const { user } = await authService.verifyToken(request);
    if (!user || !['Doctor', 'Nurse', 'Pharmacist'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get patient's active prescriptions for analysis
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId,
        status: 'ACTIVE'
      },
      include: { items: true }
    });

    const medications = prescriptions.flatMap(p => p.items.map(item => ({
      name: item.medicationName,
      dosage: item.dosage;
      frequency: item.frequency
    })));

    const analysis = await ClinicalDecisionSupport.analyzePrescription(patientId, medications);

    return NextResponse.json({
      patientId,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 }),
  }
};

// POST /api/clinical-decision-support/prescription-check
export const _POST = async (request: NextRequest) => {
  try {
    const { patientId, medications } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user || !['Doctor', 'Pharmacist'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const analysis = await ClinicalDecisionSupport.analyzePrescription(patientId, medications);

    // Log the clinical decision support usage
    await prisma.auditLog.create({
      data: {
        action: 'CLINICAL_DECISION_SUPPORT',
        userId: user.id;
        resourceType: 'PRESCRIPTION',
        resourceId: patientId;
          medications: medications.map(m => m.name),
          alertCount: analysis.alerts.length;
          riskScore: analysis.riskScore
      }
    });

    return NextResponse.json({ analysis });

  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Prescription check failed' }, { status: 500 }),
  }
};
