import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// NABH Compliance Standards
const _NABH_STANDARDS = {
  'ACC': 'Access, Assessment and Continuity of Care',
  'COP': 'Care of Patients',
  'ASC': 'Anesthesia and Surgical Care',
  'MMU': 'Medication Management and Use',
  'PFR': 'Patient and Family Rights',
  'PFE': 'Patient and Family Education',
  'HCW': 'Hospital Infection Control',
  'COC': 'Continuous Quality Improvement',
  'RME': 'Responsibility of Management and Education',
  'FMS': 'Facility Management and Safety',
  'HIS': 'Hospital Information System',
  'HRM': 'Human Resource Management'
};

const _JCI_STANDARDS = {
  'ACC': 'Access to Care and Continuity of Care',
  'PFR': 'Patient and Family Rights',
  'AOP': 'Assessment of Patients',
  'COP': 'Care of Patients',
  'ASC': 'Anesthesia and Surgical Care',
  'MMU': 'Medication Management and Use',
  'PFE': 'Patient and Family Education',
  'QPS': 'Quality Improvement and Patient Safety',
  'PCI': 'Prevention and Control of Infections',
  'GLD': 'Governance, Leadership, and Direction',
  'FMS': 'Facility Management and Safety',
  'SQE': 'Staff Qualifications and Education',
  'MCI': 'Management of Communication and Information'
};

// GET /api/compliance/nabh/standards
export const _GET = async (request: NextRequest) => {
  try {
    const { user } = await authService.verifyToken(request);

    if (!user || !['Admin', 'Quality Manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const standards = await prisma.complianceStandard.findMany({
      where: { type: 'NABH' },
      include: {
        checklistItems: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json({ standards });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
  }
};

// POST /api/compliance/nabh/assessment
export const _POST = async (request: NextRequest) => {
  try {
    const { user } = await authService.verifyToken(request);
    const body = await request.json();

    if (!user || !['Admin', 'Quality Manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { standardId, assessmentData, notes } = body;

    // Create compliance assessment
    const assessment = await prisma.complianceAssessment.create({
      data: {
        standardId,
        assessorId: user.id,
        assessmentDate: new Date(),
        status: assessmentData.status,
        score: assessmentData.score;
        findings: assessmentData.findings,
        recommendations: assessmentData.recommendations;
        notes,
        evidenceDocuments: assessmentData.evidenceDocuments || [],
        correctiveActions: assessmentData.correctiveActions || []
      }
    });

    // Update department compliance score
    await updateDepartmentComplianceScore(standardId);

    return NextResponse.json({ assessment });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
  }
};

async function updateDepartmentComplianceScore(standardId: string): unknown {
  // Calculate overall compliance score based on assessments
  const assessments = await prisma.complianceAssessment.findMany({
    where: { standardId },
    orderBy: { createdAt: 'desc' }
  });

  if (assessments.length > 0) {
    const latestAssessment = assessments[0];
    const averageScore = assessments.reduce((sum, assessment) => sum + assessment.score, 0) / assessments.length;

    await prisma.complianceStandard.update({
      where: { id: standardId },
      data: {
        currentScore: averageScore,
        lastAssessmentDate: latestAssessment.assessmentDate;
        status: averageScore >= 80 ? 'COMPLIANT' : averageScore >= 60 ? 'PARTIAL' : 'NON_COMPLIANT'
      }
    });
  }
}
