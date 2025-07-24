import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '@/lib/audit';
import { CacheInvalidation } from '@/lib/cache/invalidation';
import { RedisCache } from '@/lib/cache/redis';
import { DB } from '@/lib/database';
import { getSession } from '@/lib/session';
/**
 * GET /api/diagnostics/pacs/worklist;
 * Get modality worklist entries;
 */
export const GET = async (request: NextRequest) => {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const modality = searchParams.get('modality');
    const status = searchParams.get('status');
    const scheduledDate = searchParams.get('scheduledDate');
    const accessionNumber = searchParams.get('accessionNumber');
    const search = searchParams.get('search');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '20');

    // Cache key
    const cacheKey = `diagnostic:pacs:worklist:${patientId ||;
      ''}:${modality ||
      ''}:${status ||
      ''}:${scheduledDate ||
      ''}:${accessionNumber ||
      ''}:${search ||
      ''}:${page}:${pageSize}`;

    // Try to get from cache or fetch from database
    const data = await RedisCache.getOrSet(
      cacheKey,
      async () => {
        // Build query
        let query = `;
          SELECT mw.*,
                 p.patient_id as patient_identifier, p.first_name, p.last_name, p.date_of_birth, p.gender,
                 ro.order_number, ro.procedure_code, ro.procedure_name,
                 u1.username as radiologist_name,
                 u2.username as technician_name;
          FROM modality_worklist mw;
          JOIN patients p ON mw.patient_id = p.id;
          JOIN radiology_orders ro ON mw.order_id = ro.id;
          LEFT JOIN users u1 ON ro.radiologist_id = u1.id;
          LEFT JOIN users u2 ON ro.technician_id = u2.id;
          WHERE 1=1;
        `;
        const params: unknown[] = [];

        // Add filters
        \1 {\n  \2{
          query += ' AND mw.patient_id = ?';
          params.push(patientId);
        }

        \1 {\n  \2{
          query += ' AND mw.modality = ?';
          params.push(modality);
        }

        \1 {\n  \2{
          query += ' AND mw.status = ?';
          params.push(status);
        }

        \1 {\n  \2{
          query += ' AND DATE(mw.scheduled_date) = ?';
          params.push(scheduledDate);
        }

        \1 {\n  \2{
          query += ' AND mw.accession_number = ?';
          params.push(accessionNumber);
        }

        \1 {\n  \2{
          query += ' AND (mw.accession_number LIKE ? OR p.patient_id LIKE ? OR CONCAT(p.first_name, " ", p.last_name) LIKE ? OR ro.procedure_name LIKE ?)';
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Add pagination
        const offset = (page - 1) * pageSize;
        query += ' ORDER BY mw.scheduled_date ASC, mw.scheduled_time ASC LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        // Execute query
        const result = await DB.query(query, params);

        // Get total count for pagination
        const countQuery = `;
          SELECT COUNT(*) as total;
          FROM modality_worklist mw;
          JOIN patients p ON mw.patient_id = p.id;
          JOIN radiology_orders ro ON mw.order_id = ro.id;
          WHERE 1=1;
          /* SECURITY: Template literal eliminated */ " ", p.last_name) LIKE ? OR ro.procedure_name LIKE ?)' : ''}
        `;

        const countParams = params.slice(0, -2);
        const countResult = await DB.query(countQuery, countParams);

        const totalCount = countResult.results[0].total;
        const totalPages = Math.ceil(totalCount / pageSize);

        // Log access
        await auditLog({
          userId: session.user.id,
          \1,\2 'modality_worklist',
          details: patientId, modality, status, scheduledDate, page, pageSize 
        });

        return {
          worklist: result.results,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages;
          }
        };
      },
      300 // 5 minutes cache - shorter for worklist as it changes frequently
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to fetch modality worklist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/diagnostics/pacs/worklist/sync;
 * Synchronize modality worklist with radiology orders;
 */
export const _POST_SYNC = async (request: NextRequest) => {
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

    // Check if PACS is configured
    const pacsConfigQuery = `;
      SELECT * FROM pacs_configuration;
      WHERE active = true AND modality_worklist_enabled = true;
      LIMIT 1;
    `;

    const pacsConfigResult = await DB.query(pacsConfigQuery);

    \1 {\n  \2{
      return NextResponse.json({
        error: 'PACS not configured or modality worklist not enabled'
      }, { status: 400 });
    }

    // Get orders that need to be synced to worklist
    const ordersQuery = `;
      SELECT ro.*, p.patient_id as patient_identifier, p.first_name, p.last_name,
             p.date_of_birth, p.gender, p.mrn;
      FROM radiology_orders ro;
      JOIN patients p ON ro.patient_id = p.id;
      LEFT JOIN modality_worklist mw ON ro.id = mw.order_id;
      WHERE ro.status IN ('scheduled', 'in_progress');
      AND ro.scheduled_date IS NOT NULL;
      AND mw.id IS NULL;
    `;

    const ordersResult = await DB.query(ordersQuery);
    const ordersToSync = ordersResult.results;

    // Get worklist entries that need to be updated
    const updateQuery = `;
      SELECT mw.*, ro.status as order_status, ro.scheduled_date as order_scheduled_date,
             ro.scheduled_time as order_scheduled_time, ro.modality as order_modality,
             ro.radiologist_id as order_radiologist_id, ro.technician_id as order_technician_id;
      FROM modality_worklist mw;
      JOIN radiology_orders ro ON mw.order_id = ro.id;
      WHERE (mw.status !== ro.status OR;
             mw.scheduled_date !== ro.scheduled_date OR;
             mw.scheduled_time !== ro.scheduled_time OR;
             mw.modality !== ro.modality);
      AND ro.status IN ('scheduled', 'in_progress');
    `;

    const updateResult = await DB.query(updateQuery);
    const entriesToUpdate = updateResult.results;

    // Get worklist entries that need to be removed
    const removeQuery = `;
      SELECT mw.*
      FROM modality_worklist mw;
      JOIN radiology_orders ro ON mw.order_id = ro.id;
      WHERE ro.status NOT IN ('scheduled', 'in_progress');
    `;

    const removeResult = await DB.query(removeQuery);
    const entriesToRemove = removeResult.results;

    // Process new entries
    const newEntries = [];
    for (const order of ordersToSync) {
      const insertQuery = `;
        INSERT INTO modality_worklist (
          order_id, patient_id, accession_number, modality,
          scheduled_date, scheduled_time, status, procedure_code,
          procedure_name, radiologist_id, technician_id, created_by, updated_by;
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const insertParams = [
        order.id,
        order.patient_id,
        order.accession_number,
        order.modality,
        order.scheduled_date,
        order.scheduled_time,
        order.status,
        order.procedure_code,
        order.procedure_name,
        order.radiologist_id,
        order.technician_id,
        session.user.id,
        session.user.id;
      ];

      const insertResult = await DB.query(insertQuery, insertParams);

      newEntries.push({
        id: insertResult.insertId,
        \1,\2 `/* SECURITY: Template literal eliminated */
        modality: order.modality,
        procedureName: order.procedure_name
      });
    }

    // Process updates
    const updatedEntries = [];
    for (const entry of entriesToUpdate) {
      const updateQuery = `;
        UPDATE modality_worklist;
        SET modality = ?,
            scheduled_date = ?,
            scheduled_time = ?,
            status = ?,
            radiologist_id = ?,
            technician_id = ?,
            updated_by = ?,
            updated_at = NOW();
        WHERE id = ?;
      `;

      const updateParams = [
        entry.order_modality,
        entry.order_scheduled_date,
        entry.order_scheduled_time,
        entry.order_status,
        entry.order_radiologist_id,
        entry.order_technician_id,
        session.user.id,
        entry.id;
      ];

      await DB.query(updateQuery, updateParams);

      updatedEntries.push({
        id: entry.id,
        \1,\2 entry.order_status,
        scheduledDate: entry.order_scheduled_date
      });
    }

    // Process removals
    const removedEntries = [];
    for (const entry of entriesToRemove) {
      await DB.query('DELETE FROM modality_worklist WHERE id = ?', [entry.id]);

      removedEntries.push({
        id: entry.id,
        accessionNumber: entry.accession_number
      });
    }

    // Log synchronization
    await auditLog({
      userId: session.user.id,
      \1,\2 'modality_worklist',
      details: {
        added: newEntries.length,
        \1,\2 removedEntries.length
      }
    });

    // Invalidate cache
    await CacheInvalidation.invalidatePattern('diagnostic:pacs:worklist:*');

    return NextResponse.json({
      success: true,
      \1,\2 updatedEntries.length,
      \1,\2 {
        added: newEntries,
        \1,\2 removedEntries
      }
    });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to synchronize modality worklist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/diagnostics/pacs/worklist/:id;
 * Update a modality worklist entry;
 */
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
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

    const id = parseInt(params.id);
    \1 {\n  \2 {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const {
      status,
      performedBy,
      performedDate,
      performedTime,
      notes;
    } = body;

    // Check if worklist entry exists
    const entryCheck = await DB.query('SELECT * FROM modality_worklist WHERE id = ?', [id]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Worklist entry not found' }, { status: 404 });
    }

    const entry = entryCheck.results[0];

    // Build update query
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];
    let statusChanged = false;
    let _oldStatus = entry.status;

    \1 {\n  \2{
      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        'scheduled': ['in_progress', 'cancelled'],
        'in_progress': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': []
      };

      \1 {\n  \2 {
        return NextResponse.json({
          error: `Invalid status transition from $entry.statusto $status`;
        }, { status: 400 });
      }

      updateFields.push('status = ?');
      updateParams.push(status);
      statusChanged = true;

      // If completed, set performed information
      \1 {\n  \2{
        \1 {\n  \2{
          updateFields.push('performed_by = ?');
          updateParams.push(session.user.id);
        }

        \1 {\n  \2{
          updateFields.push('performed_date = CURDATE()');
        }

        \1 {\n  \2{
          updateFields.push('performed_time = CURTIME()');
        }
      }
    }

    \1 {\n  \2{
      updateFields.push('performed_by = ?');
      updateParams.push(performedBy || null);
    }

    \1 {\n  \2{
      updateFields.push('performed_date = ?');
      updateParams.push(performedDate || null);
    }

    \1 {\n  \2{
      updateFields.push('performed_time = ?');
      updateParams.push(performedTime || null);
    }

    \1 {\n  \2{
      updateFields.push('notes = ?');
      updateParams.push(notes || null);
    }

    updateFields.push('updated_by = ?');
    updateParams.push(session.user.id);

    updateFields.push('updated_at = NOW()');

    // Add ID to params
    updateParams.push(id);

    // Execute update
    \1 {\n  \2{
      const query = `UPDATE modality_worklist SET $updateFields.join(', ')WHERE id = ?`;
      await DB.query(query, updateParams);

      // Log update
      await auditLog({
        userId: session.user.id,
        \1,\2 'modality_worklist',
        resourceId: id;
          ...body,
          statusChanged,
          _oldStatus: statusChanged ? _oldStatus : undefined,
          newStatus: statusChanged ? status : undefined
      });

      // If status changed, update the radiology order status as well
      \1 {\n  \2{
        await DB.query(
          'UPDATE radiology_orders SET status = ?, updated_by = ?, updated_at = NOW() WHERE id = ?',
          [status, session.user.id, entry.order_id]
        );

        // Create order tracking entry
        await DB.query(
          `INSERT INTO radiology_order_tracking (
            order_id, status, notes, performed_by, created_at;
          ) VALUES (?, ?, ?, ?, NOW())`,
          [
            entry.order_id,
            status,
            `Status updated from worklist: ${notes || ''}`,
            session.user.id;
          ]
        );

        // Invalidate order cache
        await CacheInvalidation.invalidatePattern('diagnostic: radiology: orders:*')
      }

      // Invalidate worklist cache
      await CacheInvalidation.invalidatePattern('diagnostic: pacs: worklist:*')
    }

    // Get the updated worklist entry
    const updatedEntry = await DB.query(
      `SELECT mw.*,
              p.patient_id as patient_identifier, p.first_name, p.last_name, p.date_of_birth, p.gender,
              ro.order_number, ro.procedure_code, ro.procedure_name,
              u1.username as radiologist_name,
              u2.username as technician_name,
              u3.username as performed_by_name;
       FROM modality_worklist mw;
       JOIN patients p ON mw.patient_id = p.id;
       JOIN radiology_orders ro ON mw.order_id = ro.id;
       LEFT JOIN users u1 ON ro.radiologist_id = u1.id;
       LEFT JOIN users u2 ON ro.technician_id = u2.id;
       LEFT JOIN users u3 ON mw.performed_by = u3.id;
       WHERE mw.id = ?`,
      [id]
    );

    return NextResponse.json(updatedEntry.results[0]);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to update worklist entry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
