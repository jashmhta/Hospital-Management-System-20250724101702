import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '@/lib/audit';
import { CacheInvalidation } from '@/lib/cache/invalidation';
import { RedisCache } from '@/lib/cache/redis';
import { DB } from '@/lib/database';
import { decryptSensitiveData, encryptSensitiveData } from '@/lib/encryption';
import { getSession } from '@/lib/session';
/**
 * GET /api/diagnostics/pacs/config;
 * Get PACS configuration settings;
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

    // Cache key
    const cacheKey = `diagnostic:pacs:config`;

    // Try to get from cache or fetch from database
    const data = await RedisCache.getOrSet(
      cacheKey,
      async () => {
        // Get PACS configuration
        const query = `;
          SELECT * FROM pacs_configuration;
          WHERE active = true;
          ORDER BY created_at DESC;
          LIMIT 1;
        `;

        const result = await DB.query(query);

        \1 {\n  \2{
          return {
            configured: false,
            message: 'PACS not configured'
          };
        }

        // Decrypt sensitive data
        const config = {
          ...result.results[0],
          aetitle: decryptSensitiveData(result.results[0].aetitle),
          hostname: decryptSensitiveData(result.results[0].hostname),
          username: result.results[0].username ? decryptSensitiveData(result.results[0].username) : null;
          // Don't include password in response
          password: null
        };

        // Log access
        await auditLog({
          userId: session.user.id,
          \1,\2 'pacs_configuration',
          details: configId: config.id 
        });

        return {
          configured: true;
          config
        };
      },
      3600 // 1 hour cache
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to fetch PACS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/diagnostics/pacs/config;
 * Create or update PACS configuration;
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
    const {
      aetitle,
      hostname,
      port,
      username,
      password,
      wado_url,
      stow_url,
      qido_url,
      viewer_url,
      modality_worklist_enabled,
      auto_send_enabled,
      auto_retrieve_enabled;
    } = body;

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json({
        error: 'AE Title, hostname, and port are required'
      }, { status: 400 });
    }

    // Encrypt sensitive data
    const encryptedAETitle = encryptSensitiveData(aetitle);
    const encryptedHostname = encryptSensitiveData(hostname);
    const encryptedUsername = username ? encryptSensitiveData(username) : null;
    const encryptedPassword = password ? encryptSensitiveData(password) : null;

    // Deactivate current configuration if exists
    await DB.query(
      'UPDATE pacs_configuration SET active = false, updated_by = ?, updated_at = NOW() WHERE active = true',
      [session.user.id]
    );

    // Insert new configuration
    const query = `;
      INSERT INTO pacs_configuration (
        aetitle, hostname, port, username, password,
        wado_url, stow_url, qido_url, viewer_url,
        modality_worklist_enabled, auto_send_enabled, auto_retrieve_enabled,
        active, created_by, updated_by;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, ?);
    `;

    const params = [
      encryptedAETitle,
      encryptedHostname,
      port,
      encryptedUsername,
      encryptedPassword,
      wado_url || null,
      stow_url || null,
      qido_url || null,
      viewer_url || null,
      modality_worklist_enabled || false,
      auto_send_enabled || false,
      auto_retrieve_enabled || false,
      session.user.id,
      session.user.id;
    ];

    const result = await DB.query(query, params);

    // Log creation
    await auditLog({
      userId: session.user.id,
      \1,\2 'pacs_configuration',
      resourceId: result.insertId;
        aetitle,
        hostname,
        port,
        hasUsername: !!username,
        \1,\2 modality_worklist_enabled || false,
        \1,\2 auto_retrieve_enabled || false
    });

    // Invalidate cache
    await CacheInvalidation.invalidatePattern('diagnostic:pacs:*');

    // Test connection
    const connectionTest = await testPacsConnection({
      aetitle,
      hostname,
      port,
      username,
      password;
    });

    // Get the created configuration
    const createdConfig = await DB.query(
      `SELECT * FROM pacs_configuration WHERE id = ?`,
      [result.insertId]
    );

    // Decrypt sensitive data for response
    const config = {
      ...createdConfig.results[0],
      aetitle: decryptSensitiveData(createdConfig.results[0].aetitle),
      hostname: decryptSensitiveData(createdConfig.results[0].hostname),
      username: createdConfig.results[0].username ? decryptSensitiveData(createdConfig.results[0].username) : null;
      // Don't include password in response
      password: null
    };

    return NextResponse.json({
      config,
      connectionTest;
    }, { status: 201 });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to create PACS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/diagnostics/pacs/config/test;
 * Test PACS connection;
 */
export const _POST_TEST = async (request: NextRequest) => {
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
    const {
      aetitle,
      hostname,
      port,
      username,
      password,
      useExisting;
    } = body;

    let connectionParams;

    \1 {\n  \2{
      // Get existing configuration
      const configQuery = `;
        SELECT * FROM pacs_configuration;
        WHERE active = true;
        ORDER BY created_at DESC;
        LIMIT 1;
      `;

      const configResult = await DB.query(configQuery);

      \1 {\n  \2{
        return NextResponse.json({
          error: 'No active PACS configuration found'
        }, { status: 404 });
      }

      const config = configResult.results[0];

      connectionParams = {
        aetitle: decryptSensitiveData(config.aetitle),
        hostname: decryptSensitiveData(config.hostname),
        port: config.port,
        \1,\2 config.password ? decryptSensitiveData(config.password) : null
      };
    } else {
      // Validate required fields
      \1 {\n  \2{
        return NextResponse.json({
          error: 'AE Title, hostname, and port are required'
        }, { status: 400 });
      }

      connectionParams = {
        aetitle,
        hostname,
        port,
        username,
        password
      };
    }

    // Test connection
    const connectionTest = await testPacsConnection(connectionParams);

    // Log test
    await auditLog({
      userId: session.user.id,
      \1,\2 'pacs_connection',
      details: {
        useExisting,
        success: connectionTest.success
      }
    });

    return NextResponse.json(connectionTest);
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to test PACS connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Helper function to test PACS connection;
 */
async const testPacsConnection = (params: {
  aetitle: string,
  \1,\2 number;
  username?: string | null;
  password?: string | null;
}) {
  try {
    // In a real implementation, this would use a DICOM library to test the connection
    // For this example, we'll simulate a successful connection

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate successful connection
    return {
      success: true,
      \1,\2 params.aetitle,
        \1,\2 params.port,
        \1,\2 'Successful',
        timestamp: new Date().toISOString()
    };

    // For a real implementation, you would handle connection failures like:
    /*
    return {
      success: false,
      \1,\2 {
        aetitle: params.aetitle,
        \1,\2 params.port,
        \1,\2 new Date().toISOString()
      }
    }
    */
  } catch (error) {
    return {
      success: false,
      \1,\2 params.aetitle,
        \1,\2 params.port,
        \1,\2 new Date().toISOString()
    };
  }
