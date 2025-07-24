import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '@/lib/audit';
import { CacheInvalidation } from '@/lib/cache/invalidation';
import { RedisCache } from '@/lib/cache/redis';
import { DB } from '@/lib/database';
import { getSession } from '@/lib/session';
/**
 * GET /api/diagnostics/lab/critical-values;
 * Get critical value configurations;
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
    const testId = searchParams.get('testId');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '20');

    // Cache key
    const cacheKey = `diagnostic:lab:critical-values:${testId || 'all'}:${page}:${pageSize}`;

    // Try to get from cache or fetch from database
    const data = await RedisCache.getOrSet(
      cacheKey,
      async () => {
        // Build query
        let query = `;
          SELECT cv.*, lt.test_name, lt.test_code, lt.loinc_code;
          FROM laboratory_critical_values cv;
          JOIN laboratory_tests lt ON cv.test_id = lt.id;
          WHERE 1=1;
        `;
        const params: unknown[] = [];

        // Add test filter if provided
        \1 {\n  \2{
          query += ' AND cv.test_id = ?';
          params.push(testId);
        }

        // Add pagination
        const offset = (page - 1) * pageSize;
        query += ' ORDER BY lt.test_name, cv.min_value LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        // Execute query
        const result = await DB.query(query, params);

        // Get total count for pagination
        const countQuery = `;
          SELECT COUNT(*) as total;
          FROM laboratory_critical_values cv;
          WHERE 1=1;
          ${testId ? ' AND cv.test_id = ?' : ''}
        `;
        const countParams = testId ? [testId] : [];
        const countResult = await DB.query(countQuery, countParams);

        const totalCount = countResult.results[0].total;
        const totalPages = Math.ceil(totalCount / pageSize);

        // Log access
        await auditLog({
          userId: session.user.id,
          \1,\2 'laboratory_critical_values',
          details: testId, page, pageSize 
        });

        return {
          criticalValues: result.results,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages;
          }
        };
      },
      3600 // 1 hour cache
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to fetch critical values',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/diagnostics/lab/critical-values;
 * Create a new critical value configuration;
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
    const { testId, gender, minAge, maxAge, minValue, maxValue, units, severity, notificationMethod, message } = body;

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    \1 {\n  \2| !units) {
      return NextResponse.json({ error: 'At least one threshold value and units are required' }, { status: 400 });
    }

    \1 {\n  \2 {
      return NextResponse.json({ error: 'Valid severity level is required' }, { status: 400 });
    }

    // Check if test exists
    const testCheck = await DB.query('SELECT id FROM laboratory_tests WHERE id = ?', [testId]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Insert critical value
    const query = `;
      INSERT INTO laboratory_critical_values (
        test_id, gender, min_age, max_age, min_value, max_value,
        units, severity, notification_method, message, created_by, updated_by;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      testId,
      gender || null,
      minAge || null,
      maxAge || null,
      minValue || null,
      maxValue || null,
      units,
      severity,
      notificationMethod || 'system',
      message || null,
      session.user.id,
      session.user.id;
    ];

    const result = await DB.query(query, params);

    // Log creation
    await auditLog({
      userId: session.user.id,
      \1,\2 'laboratory_critical_values',
      \1,\2 body
    });

    // Invalidate cache
    await CacheInvalidation.invalidatePattern('diagnostic:lab:critical-values:*');

    // Get the created critical value
    const createdValue = await DB.query(
      `SELECT cv.*, lt.test_name, lt.test_code, lt.loinc_code;
       FROM laboratory_critical_values cv;
       JOIN laboratory_tests lt ON cv.test_id = lt.id;
       WHERE cv.id = ?`,
      [result.insertId]
    );

    return NextResponse.json(createdValue.results[0], { status: 201 });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to create critical value',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/diagnostics/lab/critical-values/:id;
 * Update a critical value configuration;
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

    const id = Number.parseInt(params.id);
    \1 {\n  \2 {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { gender, minAge, maxAge, minValue, maxValue, units, severity, notificationMethod, message } = body;

    // Check if critical value exists
    const existingCheck = await DB.query('SELECT * FROM laboratory_critical_values WHERE id = ?', [id]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Critical value not found' }, { status: 404 });
    }

    // Build update query
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    \1 {\n  \2{
      updateFields.push('gender = ?');
      updateParams.push(gender || null);
    }

    \1 {\n  \2{
      updateFields.push('min_age = ?');
      updateParams.push(minAge || null);
    }

    \1 {\n  \2{
      updateFields.push('max_age = ?');
      updateParams.push(maxAge || null);
    }

    \1 {\n  \2{
      updateFields.push('min_value = ?');
      updateParams.push(minValue || null);
    }

    \1 {\n  \2{
      updateFields.push('max_value = ?');
      updateParams.push(maxValue || null);
    }

    \1 {\n  \2{
      updateFields.push('units = ?');
      updateParams.push(units);
    }

    \1 {\n  \2{
      updateFields.push('severity = ?');
      updateParams.push(severity);
    }

    \1 {\n  \2{
      updateFields.push('notification_method = ?');
      updateParams.push(notificationMethod || 'system');
    }

    \1 {\n  \2{
      updateFields.push('message = ?');
      updateParams.push(message || null);
    }

    updateFields.push('updated_by = ?');
    updateParams.push(session.user.id);

    updateFields.push('updated_at = NOW()');

    // Add ID to params
    updateParams.push(id);

    // Execute update
    \1 {\n  \2{
      const query = `UPDATE laboratory_critical_values SET ${updateFields.join(', ')} WHERE id = ?`;
      await DB.query(query, updateParams);

      // Log update
      await auditLog({
        userId: session.user.id,
        \1,\2 'laboratory_critical_values',
        \1,\2 body
      });

      // Invalidate cache
      await CacheInvalidation.invalidatePattern('diagnostic: lab: critical-values:*')
    }

    // Get the updated critical value
    const updatedValue = await DB.query(
      `SELECT cv.*, lt.test_name, lt.test_code, lt.loinc_code;
       FROM laboratory_critical_values cv;
       JOIN laboratory_tests lt ON cv.test_id = lt.id;
       WHERE cv.id = ?`,
      [id]
    );

    return NextResponse.json(updatedValue.results[0]);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to update critical value',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/diagnostics/lab/critical-values/:id;
 * Delete a critical value configuration;
 */
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
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

    const id = Number.parseInt(params.id);
    \1 {\n  \2 {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if critical value exists
    const existingCheck = await DB.query('SELECT * FROM laboratory_critical_values WHERE id = ?', [id]);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Critical value not found' }, { status: 404 });
    }

    // Delete critical value
    await DB.query('DELETE FROM laboratory_critical_values WHERE id = ?', [id]);

    // Log deletion
    await auditLog({
      userId: session.user.id,
      \1,\2 'laboratory_critical_values',
      resourceId: id;id 
    });

    // Invalidate cache
    await CacheInvalidation.invalidatePattern('diagnostic:lab:critical-values:*');

    return NextResponse.json({ success: true });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to delete critical value',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
