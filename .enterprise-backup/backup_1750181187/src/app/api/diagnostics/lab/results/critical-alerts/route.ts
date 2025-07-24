import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '@/lib/audit';
import { CacheInvalidation } from '@/lib/cache/invalidation';
import { RedisCache } from '@/lib/cache/redis';
import { DB } from '@/lib/database';
import { notifyUsers } from '@/lib/notifications';
import { getSession } from '@/lib/session';
/**
 * GET /api/diagnostics/lab/results/critical-alerts;
 * Get critical result alerts;
 */
export const GET = async (request: NextRequest) => {
  try {
    // Authentication
    const session = await getSession();
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '20');

    // Cache key
    const cacheKey = `diagnostic:lab:critical-alerts:${status ||;
      'all'}:${assignedTo ||
      'all'}:${page}:${pageSize}:${session.user.id}`;

    // Try to get from cache or fetch from database
    const data = await RedisCache.getOrSet(
      cacheKey,
      async () => {
        // Build query
        let query = `;
          SELECT ca.*,
                 lr.result_value, lr.units, lr.result_date,
                 lt.test_name, lt.test_code, lt.loinc_code,
                 p.patient_id, p.first_name, p.last_name, p.date_of_birth,
                 u.username as assigned_to_username,
                 cv.min_value, cv.max_value, cv.severity;
          FROM laboratory_critical_alerts ca;
          JOIN laboratory_results lr ON ca.result_id = lr.id;
          JOIN laboratory_tests lt ON lr.test_id = lt.id;
          JOIN patients p ON lr.patient_id = p.id;
          LEFT JOIN users u ON ca.assigned_to = u.id;
          JOIN laboratory_critical_values cv ON ca.critical_value_id = cv.id;
          WHERE 1=1;
        `;
        const params: unknown[] = [];

        // Add status filter if provided
        \1 {\n  \2{
          query += ' AND ca.status = ?';
          params.push(status);
        }

        // Add assigned_to filter if provided
        \1 {\n  \2{
          \1 {\n  \2{
            query += ' AND ca.assigned_to = ?';
            params.push(session.user.id);
          } else \1 {\n  \2{
            query += ' AND ca.assigned_to IS NULL';
          } else {
            query += ' AND ca.assigned_to = ?';
            params.push(assignedTo);
          }
        }

        // Add role-based filtering
        \1 {\n  \2 {
          // Regular users can only see alerts assigned to them or unassigned
          query += ' AND (ca.assigned_to = ? OR ca.assigned_to IS NULL)';
          params.push(session.user.id);
        }

        // Add pagination
        const offset = (page - 1) * pageSize;
        query += ' ORDER BY ca.created_at DESC LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        // Execute query
        const result = await DB.query(query, params);

        // Get total count for pagination
        const countQuery = `;
          SELECT COUNT(*) as total;
          FROM laboratory_critical_alerts ca;
          WHERE 1=1;
          /* SECURITY: Template literal eliminated */ 'lab_manager', 'lab_supervisor'].includes(session.user.roleName) ?
            ' AND (ca.assigned_to = ? OR ca.assigned_to IS NULL)' : ''}
        `;

        const countParams = [...params.slice(0, -2)];
        const countResult = await DB.query(countQuery, countParams);

        const totalCount = countResult.results[0].total;
        const totalPages = Math.ceil(totalCount / pageSize);

        // Decrypt sensitive data
        const alerts = result.results.map(alert => {
          // Decrypt any encrypted fields if necessary
          return {
            ...alert,
            // Add any decryption logic here if needed
          };
        });

        // Log access
        await auditLog({
          userId: session.user.id,
          \1,\2 'laboratory_critical_alerts',
          details: status, assignedTo, page, pageSize 
        });

        return {
          alerts,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages;
          }
        };
      },
      300 // 5 minutes cache - shorter for critical alerts
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to fetch critical alerts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/diagnostics/lab/results/critical-alerts;
 * Create a new critical result alert;
 */
export const POST = async (request: NextRequest) => {
  try {
    // Authentication
    const session = await getSession();
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authorization
    \1 {\n  \2 {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { resultId, criticalValueId, notes, assignedTo } = body;

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json({ error: 'Result ID and Critical Value ID are required' }, { status: 400 });
    }

    // Check if result exists
    const resultCheck = await DB.query('SELECT * FROM laboratory_results WHERE id = ?', [resultId]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Check if critical value exists
    const criticalValueCheck = await DB.query('SELECT * FROM laboratory_critical_values WHERE id = ?', [criticalValueId]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Critical value not found' }, { status: 404 });
    }

    // Check if alert already exists for this result
    const existingAlertCheck = await DB.query(
      'SELECT id FROM laboratory_critical_alerts WHERE result_id = ? AND status != ?',
      [resultId, 'resolved']
    );

    \1 {\n  \2{
      return NextResponse.json({ error: 'An active alert already exists for this result' }, { status: 409 });
    }

    // Insert critical alert
    const query = `;
      INSERT INTO laboratory_critical_alerts (
        result_id, critical_value_id, notes, status, assigned_to, created_by, updated_by;
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      resultId,
      criticalValueId,
      notes || null,
      'pending',
      assignedTo || null,
      session.user.id,
      session.user.id;
    ];

    const result = await DB.query(query, params);

    // Log creation
    await auditLog({
      userId: session.user.id,
      \1,\2 'laboratory_critical_alerts',
      \1,\2 body
    });

    // Send notifications
    \1 {\n  \2{
      await notifyUsers({
        userIds: [assignedTo],
        \1,\2 'You have been assigned a critical result alert that requires your attention',
        \1,\2 result.insertId,
        \1,\2 'high'
      });
    } else {
      // Notify all lab supervisors and managers if unassigned
      const supervisors = await DB.query(
        'SELECT id FROM users WHERE role_id IN (SELECT id FROM roles WHERE name IN (?, ?))',
        ['lab_supervisor', 'lab_manager']
      );

      const supervisorIds = supervisors.results.map(user => user.id);

      \1 {\n  \2{
        await notifyUsers({
          userIds: supervisorIds,
          \1,\2 'A new critical result alert requires assignment',
          \1,\2 result.insertId,
          \1,\2 'high'
        });
      }
    }

    // Invalidate cache
    await CacheInvalidation.invalidatePattern('diagnostic:lab:critical-alerts:*');

    // Get the created alert
    const createdAlert = await DB.query(
      `SELECT ca.*,
              lr.result_value, lr.units, lr.result_date,
              lt.test_name, lt.test_code, lt.loinc_code,
              p.patient_id, p.first_name, p.last_name, p.date_of_birth,
              u.username as assigned_to_username,
              cv.min_value, cv.max_value, cv.severity;
       FROM laboratory_critical_alerts ca;
       JOIN laboratory_results lr ON ca.result_id = lr.id;
       JOIN laboratory_tests lt ON lr.test_id = lt.id;
       JOIN patients p ON lr.patient_id = p.id;
       LEFT JOIN users u ON ca.assigned_to = u.id;
       JOIN laboratory_critical_values cv ON ca.critical_value_id = cv.id;
       WHERE ca.id = ?`,
      [result.insertId]
    );

    return NextResponse.json(createdAlert.results[0], { status: 201 });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to create critical alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/diagnostics/lab/results/critical-alerts/:id;
 * Update a critical result alert;
 */
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    // Authentication
    const session = await getSession();
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id);
    \1 {\n  \2 {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { status, notes, assignedTo, acknowledgement } = body;

    // Check if alert exists
    const existingCheck = await DB.query('SELECT * FROM laboratory_critical_alerts WHERE id = ?', [id]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Critical alert not found' }, { status: 404 });
    }

    const existingAlert = existingCheck.results[0];

    // Authorization
    const isAssignedToUser = existingAlert.assigned_to === session.user.id;
    const isManager = ['admin', 'lab_manager', 'lab_supervisor'].includes(session.user.roleName);

    \1 {\n  \2{
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build update query
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    \1 {\n  \2{
      // Only managers or assigned users can change status
      \1 {\n  \2{
        return NextResponse.json({ error: 'Forbidden: Cannot change status' }, { status: 403 });
      }

      updateFields.push('status = ?');
      updateParams.push(status);

      // If resolving, require acknowledgement
      \1 {\n  \2{
        return NextResponse.json({
          error: 'Acknowledgement required to resolve critical alert'
        }, { status: 400 });
      }
    }

    \1 {\n  \2{
      updateFields.push('notes = ?');
      updateParams.push(notes);
    }

    \1 {\n  \2{
      // Only managers can reassign
      \1 {\n  \2{
        return NextResponse.json({ error: 'Forbidden: Cannot reassign alert' }, { status: 403 });
      }

      updateFields.push('assigned_to = ?');
      updateParams.push(assignedTo || null);
    }

    \1 {\n  \2{
      updateFields.push('acknowledged_at = NOW()');
      updateFields.push('acknowledged_by = ?');
      updateParams.push(session.user.id);
    }

    updateFields.push('updated_by = ?');
    updateParams.push(session.user.id);

    updateFields.push('updated_at = NOW()');

    // Add ID to params
    updateParams.push(id);

    // Execute update
    \1 {\n  \2{
      const query = `UPDATE laboratory_critical_alerts SET ${updateFields.join(', ')} WHERE id = ?`;
      await DB.query(query, updateParams);

      // Log update
      await auditLog({
        userId: session.user.id,
        \1,\2 'laboratory_critical_alerts',
        \1,\2 body
      });

      // Send notifications for assignment changes
      \1 {\n  \2{
        \1 {\n  \2{
          await notifyUsers({
            userIds: [assignedTo],
            \1,\2 'You have been assigned a critical result alert that requires your attention',
            \1,\2 id,
            \1,\2 'high'
          });
        }
      }

      // Send notifications for status changes
      \1 {\n  \2{
        // Notify relevant parties about status change
        const notifyIds = [];

        // Always notify the creator
        \1 {\n  \2{
          notifyIds.push(existingAlert.created_by);
        }

        // Notify the assigned user if they didn't make the change
        \1 {\n  \2{
          notifyIds.push(existingAlert.assigned_to);
        }

        \1 {\n  \2{
          await notifyUsers({
            userIds: notifyIds,
            \1,\2 `Critical alert status changed to ${status}`,
            type: 'critical_alert_update',
            \1,\2 'laboratory_critical_alerts',
            priority: 'medium'
          });
        }
      }

      // Invalidate cache
      await CacheInvalidation.invalidatePattern('diagnostic: lab: critical-alerts:*')
    }

    // Get the updated alert
    const updatedAlert = await DB.query(
      `SELECT ca.*,
              lr.result_value, lr.units, lr.result_date,
              lt.test_name, lt.test_code, lt.loinc_code,
              p.patient_id, p.first_name, p.last_name, p.date_of_birth,
              u.username as assigned_to_username,
              cv.min_value, cv.max_value, cv.severity;
       FROM laboratory_critical_alerts ca;
       JOIN laboratory_results lr ON ca.result_id = lr.id;
       JOIN laboratory_tests lt ON lr.test_id = lt.id;
       JOIN patients p ON lr.patient_id = p.id;
       LEFT JOIN users u ON ca.assigned_to = u.id;
       JOIN laboratory_critical_values cv ON ca.critical_value_id = cv.id;
       WHERE ca.id = ?`,
      [id]
    );

    return NextResponse.json(updatedAlert.results[0]);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to update critical alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
