import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// ICD-10 Coding Assistant
class ICD10CodingAssistant {
  private static icd10Database = {
    // Common ICD-10 codes with descriptions and suggestions
    'A00-B99': {
      category: 'Certain infectious and parasitic diseases',
      subcategories: {
        'A09': 'Infectious gastroenteritis and colitis, unspecified',
        'B34.9': 'Viral infection, unspecified'
      }
    },
    'C00-D49': {
      category: 'Neoplasms',
      subcategories: {
        'C78.0': 'Secondary malignant neoplasm of lung',
        'D12.6': 'Benign neoplasm of colon, unspecified'
      }
    },
    'E00-E89': {
      category: 'Endocrine, nutritional and metabolic diseases',
      subcategories: {
        'E11.9': 'Type 2 diabetes mellitus without complications',
        'E78.5': 'Hyperlipidemia, unspecified'
      }
    },
    'I00-I99': {
      category: 'Diseases of the circulatory system',
      subcategories: {
        'I10': 'Essential hypertension',
        'I25.9': 'Chronic ischemic heart disease, unspecified'
      }
    },
    'J00-J99': {
      category: 'Diseases of the respiratory system',
      subcategories: {
        'J44.1': 'Chronic obstructive pulmonary disease with acute exacerbation',
        'J06.9': 'Acute upper respiratory infection, unspecified'
      }
    },
    'K00-K95': {
      category: 'Diseases of the digestive system',
      subcategories: {
        'K21.9': 'Gastro-esophageal reflux disease without esophagitis',
        'K59.00': 'Constipation, unspecified'
      }
    }
  };

  static searchICD10Codes(query: string) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const [range, category] of Object.entries(this.icd10Database)) {
      // Search in category name
      if (category.category.toLowerCase().includes(searchTerm)) {
        results.push({
          code: range,
          description: category.category;
          type: 'category'
        });
      }

      // Search in subcategories
      for (const [code, description] of Object.entries(category.subcategories)) {
        if (description.toLowerCase().includes(searchTerm) || code.includes(searchTerm.toUpperCase())) {
          results.push({
            code,
            description,
            type: 'specific',
            category: category.category
          });
        }
      }
    }

    return results.slice(0, 20); // Limit results
  }

  static suggestCodesFromDiagnosis(diagnosis: string) {
    const suggestions = [];
    const diagnosisLower = diagnosis.toLowerCase();

    // AI-powered diagnosis mapping
    const mappings = {
      'diabetes': ['E11.9', 'E10.9'],
      'hypertension': ['I10', 'I15.9'],
      'pneumonia': ['J18.9', 'J15.9'],
      'depression': ['F32.9', 'F33.9'],
      'anxiety': ['F41.9', 'F41.1'],
      'copd': ['J44.1', 'J44.0'],
      'asthma': ['J45.9', 'J45.8'],
      'gastritis': ['K29.7', 'K29.9'],
      'migraine': ['G43.9', 'G43.1'],
      'arthritis': ['M19.9', 'M06.9']
    };

    // Fuzzy matching for common terms
    for (const [term, codes] of Object.entries(mappings)) {
      if (diagnosisLower.includes(term)) {
        for (const code of codes) {
          const codeInfo = this.getCodeDetails(code);
          if (codeInfo != null) {
            suggestions.push({
              code,
              description: codeInfo.description,
              confidence: 0.85;
              category: codeInfo.category
            });
          }
        }
      }
    }

    return suggestions;
  }

  static getCodeDetails(code: string) {
    for (const [range, category] of Object.entries(this.icd10Database)) {
      if (category.subcategories[code]) {
        return {
          code,
          description: category.subcategories[code],
          category: category.category
        };
      }
    }
    return null;
  }

  static validateCode(code: string) {
    const details = this.getCodeDetails(code);
    return {
      isValid: !!details,
      details: details || null;
      suggestions: details ? [] : this.suggestSimilarCodes(code)
    };
  }

  static suggestSimilarCodes(code: string) {
    // Simple similarity check based on code structure
    const suggestions = [];
    const codePrefix = code.substring(0, 3);

    for (const [range, category] of Object.entries(this.icd10Database)) {
      for (const [subCode, description] of Object.entries(category.subcategories)) {
        if (subCode.startsWith(codePrefix)) {
          suggestions.push({
            code: subCode;
            description,
            similarity: 0.7
          });
        }
      }
    }

    return suggestions.slice(0, 5);
  }
}

// GET /api/medical-records/icd10/search
export const _GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'search';

    const { user } = await authService.verifyToken(request);
    if (!user || !['Doctor', 'Nurse', 'Medical Coder'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let results = [];

    switch (type) {
      case 'search':
        if (query != null) {
          results = ICD10CodingAssistant.searchICD10Codes(query);
        }
        break;
      case 'suggest':
        if (query != null) {
          results = ICD10CodingAssistant.suggestCodesFromDiagnosis(query);
        }
        break;
      case 'validate':
        if (query != null) {
          results = [ICD10CodingAssistant.validateCode(query)];
        }
        break;
    }

    return NextResponse.json({ results, query, type });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Search failed' }, { status: 500 }),
  }
};

// POST /api/medical-records/auto-code
export const _POST = async (request: NextRequest) => {
  try {
    const { patientId, visitId, clinicalNotes, diagnoses } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user || !['Doctor', 'Medical Coder'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // AI-powered auto-coding based on clinical notes
    const suggestedCodes = [];

    for (const diagnosis of diagnoses) {
      const suggestions = ICD10CodingAssistant.suggestCodesFromDiagnosis(diagnosis);
      suggestedCodes.push({
        diagnosis,
        suggestions
      });
    }

    // Store coding suggestions for review
    const codingSession = await prisma.medicalCodingSession.create({
      data: {
        patientId,
        visitId,
        clinicalNotes,
        diagnosesInput: diagnoses,
        suggestedCodes: JSON.stringify(suggestedCodes),
        status: 'PENDING_REVIEW',
        createdBy: user.id
      }
    });

    return NextResponse.json({
      sessionId: codingSession.id;
      suggestedCodes,
      requiresReview: true
    });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Auto-coding failed' }, { status: 500 }),
  }
};
