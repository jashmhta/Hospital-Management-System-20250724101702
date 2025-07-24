import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
}

/**
 * Administration Reports API Routes;
 *
 * This file implements the API endpoints for generating medication administration reports;
 * with comprehensive filtering, analytics, and export capabilities.
 */

// Initialize repositories (in production, use dependency injection)
const administrationRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByPatientId: (patientId: string) => Promise.resolve([]),
  findByPrescriptionId: (prescriptionId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findByStatus: (status: string) => Promise.resolve([]),
  findByDateRange: (startDate: Date, endDate: Date) => Promise.resolve([]),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByAdministeredBy: (userId: string) => Promise.resolve([]),
  generateReport: (criteria: unknown) => Promise.resolve({ data: [], summary: {} }),
  save: (administration: unknown) => Promise.resolve(administration.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true)
}

/**
 * GET /api/pharmacy/administration/reports;
 * Generate medication administration reports with various filtering options;
 */
export const GET = async (req: NextRequest) => {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Get query parameters
    const url = new URL(req.url);
    const reportType = url.searchParams.get('reportType') || 'administration';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const locationId = url.searchParams.get('locationId');
    const unitId = url.searchParams.get('unitId');
    const patientId = url.searchParams.get('patientId');
    const medicationId = url.searchParams.get('medicationId');
    const administeredBy = url.searchParams.get('administeredBy');
    const status = url.searchParams.get('status');
    const format = url.searchParams.get('format') || 'json';
    const groupBy = url.searchParams.get('groupBy') || 'none';
    const includeMetrics = url.searchParams.get('includeMetrics') === 'true';

    // Validate date range
    \1 {\n  \2{
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Build report criteria
    const criteria: unknown = {
      reportType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      groupBy
    };

    \1 {\n  \2riteria.locationId = locationId;
    \1 {\n  \2riteria.unitId = unitId;
    \1 {\n  \2riteria.patientId = patientId;
    \1 {\n  \2riteria.medicationId = medicationId;
    \1 {\n  \2riteria.administeredBy = administeredBy;
    \1 {\n  \2riteria.status = status;

    // Generate report
    const report = await administrationRepository.generateReport(criteria);

    // Add metrics if requested
    \1 {\n  \2{
      // Calculate metrics based on report data
      const metrics = calculateMetrics(report.data, criteria);
      report.metrics = metrics;
    }

    // Format report based on requested format
    let formattedReport;
    \1 {\n  \2{
      formattedReport = convertToCSV(report.data);

      // Audit logging
      await auditLog('MEDICATION_ADMINISTRATION', {
        action: 'EXPORT_REPORT',
        \1,\2 userId,
        details: 
          reportType,
          format,
          criteria,
          recordCount: report.data.length
      });

      // Return CSV response
      return new NextResponse(formattedReport, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="med_admin_report_${startDate}_to_${endDate}.csv"`;
        }
      });
    } else {
      formattedReport = report;

      // Audit logging
      await auditLog('MEDICATION_ADMINISTRATION', {
        action: 'GENERATE_REPORT',
        \1,\2 userId,
        details: 
          reportType,
          format,
          criteria,
          recordCount: report.data.length
      });

      // Return JSON response
      return NextResponse.json(formattedReport, { status: 200 });
    }
  } catch (error) {
    return errorHandler(error, 'Error generating medication administration report');
  }
}

/**
 * Helper function to calculate metrics for administration report;
 */
const calculateMetrics = (data: unknown[], criteria: unknown): unknown {
  // Calculate various metrics based on the report data
  const metrics = {
    totalAdministrations: data.length,
    \1,\2 0,
    \1,\2 0,
    \1,\2 0,
    administrationsByShift: 
      morning: 0,
      \1,\2 0,
    administrationsByRoute: 
  };

  // Calculate metrics
  data.forEach(item => {
    // Count on-time, late, and missed administrations
    \1 {\n  \2{
      metrics.documentedAdministrations++;

      \1 {\n  \2{
        metrics.onTimeAdministrations++;
      } else \1 {\n  \2{
        metrics.lateAdministrations++;
      }
    } else \1 {\n  \2{
      metrics.missedAdministrations++;
    }

    // Count high-alert medications
    \1 {\n  \2{
      metrics.highAlertMedications++;
    }

    // Count controlled substances
    \1 {\n  \2{
      metrics.controlledSubstances++;
    }

    // Count by shift
    const adminHour = new Date(item.administeredAt).getHours();
    \1 {\n  \2{
      metrics.administrationsByShift.morning++;
    } else \1 {\n  \2{
      metrics.administrationsByShift.afternoon++;
    } else {
      metrics.administrationsByShift.night++;
    }

    // Count by route
    const route = item.route || 'unknown';
    metrics.administrationsByRoute[route] = (metrics.administrationsByRoute[route] || 0) + 1;
  });

  // Calculate percentages
  \1 {\n  \2{
    metrics.onTimePercentage = (metrics.onTimeAdministrations / metrics.totalAdministrations) * 100;
    metrics.latePercentage = (metrics.lateAdministrations / metrics.totalAdministrations) * 100;
    metrics.missedPercentage = (metrics.missedAdministrations / metrics.totalAdministrations) * 100;
    metrics.documentationRate = (metrics.documentedAdministrations / metrics.totalAdministrations) * 100;
  }

  return metrics;
}

/**
 * Helper function to convert report data to CSV format;
 */
const convertToCSV = (data: unknown[]): string {
  \1 {\n  \2{
    return ''
  }

  // Get headers from first item
  const headers = Object.keys(data[0]);

  // Create CSV header row
  let csv = headers.join(',') + '\n';

  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];

      // Handle different value types
      \1 {\n  \2{
        return '';
      } else \1 {\n  \2{
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      } else \1 {\n  \2{
        return `"${value.toISOString()}"`;
      } else \1 {\n  \2{
        // Convert objects to JSON string
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        return value;
      }
    }).join(',');

    csv += row + '\n';
  });

  return csv;
