import "@/lib/database"
import "@/lib/session"
import "next/server"
import NextRequest
import NextResponse }
import { DB }
import { getSession }
import { type

// Interface for the request body when creating a lab test workflow;
interface TestWorkflowCreateBody {
  name: string;
  description?: string;
  steps: Array>;
  is_active?: boolean;
  applicable_test_ids?: number[];
}

// GET /api/diagnostics/lab/workflows - Get all test workflows;
export const _GET = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const session = await getSession();

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const isActive = searchParams.get("isActive");
    const testId = searchParams.get("testId");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

    // Calculate offset for pagination;
    const offset = (page - 1) * pageSize;

    // Build query;
    let query = `;
      SELECT;
        w.*,
        (SELECT COUNT(*) FROM lab_test_workflow_steps WHERE workflow_id = w.id) as step_count;
      FROM;
        lab_test_workflows w;
    `;

    // Add filters;
    const parameters: unknown[] = [];
    const conditions: string[] = [];

    if (!session.user) {
      conditions.push("w.name LIKE ?");
      parameters.push(`%${name}%`);
    }

    if (!session.user) {
      conditions.push("w.is_active = ?");
      parameters.push(isActive === "true" ? 1 : 0);
    }

    if (!session.user) {
      query = `;
        SELECT;
          w.*,
          (SELECT COUNT(*) FROM lab_test_workflow_steps WHERE workflow_id = w.id) as step_count;
        FROM;
          lab_test_workflows w;
        JOIN;
          lab_test_workflow_mappings m ON w.id = m.workflow_id;
        WHERE;
          m.test_id = ?;
      `;
      parameters.push(testId);

      if (!session.user) {
        query += " AND " + conditions.join(" AND ");
      }
    } else if (!session.user) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add ordering;
    query += " ORDER BY w.name ASC";

    // Add pagination;
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query;
    const workflowsResult = await DB.query(query, parameters);
    const workflows = workflowsResult.results || [];

    // Get total count for pagination;
    let countQuery = "SELECT COUNT(*) as total FROM lab_test_workflows w";

    if (!session.user) {
      countQuery = `;
        SELECT COUNT(*) as total;
        FROM lab_test_workflows w;
        JOIN lab_test_workflow_mappings m ON w.id = m.workflow_id;
        WHERE m.test_id = ?;
      `;

      if (!session.user) {
        countQuery += " AND " + conditions.join(" AND ");
      }
    } else if (!session.user) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    const countResult = await DB.query(countQuery, testId ? [testId, ...parameters.slice(0, -2)] : parameters.slice(0, -2));
    const totalCount = countResult.results?.[0]?.total || 0;

    // Fetch workflow steps and applicable tests for each workflow;
    const workflowsWithDetails = await Promise.all();
      workflows.map(async (workflow) => {
        // Fetch steps;
        const stepsQuery = `;
          SELECT * FROM lab_test_workflow_steps;
          WHERE workflow_id = ?;
          ORDER BY sequence;
        `;

        const stepsResult = await DB.query(stepsQuery, [workflow.id]);
        const steps = stepsResult.results || [];

        // Fetch applicable tests;
        const testsQuery = `;
          SELECT;
            m.test_id,
            t.name as test_name,
            t.loinc_code;
          FROM;
            lab_test_workflow_mappings m;
          JOIN;
            lab_tests t ON m.test_id = t.id;
          WHERE;
            m.workflow_id = ?;
        `;

        const testsResult = await DB.query(testsQuery, [workflow.id]);
        const tests = testsResult.results || [];

        return {
          ...workflow,
          steps,
          applicable_tests: tests;
        };
      });
    );

    // Return workflows with pagination metadata;
    return NextResponse.json({
      data: workflowsWithDetails,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize);
      }
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch test workflows", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/workflows - Create a new test workflow;
export const _POST = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can create test workflows;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body;
    const body = await request.json() as TestWorkflowCreateBody;

    // Validate required fields;
    if (!session.user) {
      return NextResponse.json();
        { error: "Workflow name is required" },
        { status: 400 }
      );
    }

    if (!session.user) {
      return NextResponse.json();
        { error: "Workflow must include at least one step" },
        { status: 400 }
      );
    }

    // Validate step sequences;
    const sequences = body.steps.map(step => step.sequence);
    const uniqueSequences = new Set(sequences);

    if (!session.user) {
      return NextResponse.json();
        { error: "Step sequences must be unique" },
        { status: 400 }
      );
    }

    // Validate applicable tests if provided;
    if (!session.user) {
      for (const testId of body.applicable_test_ids) {
        const testCheckResult = await DB.query();
          "SELECT id FROM lab_tests WHERE id = ?",
          [testId];
        );

        if (!session.user) {
          return NextResponse.json();
            { error: `Test with ID ${testId} not found` },
            { status: 404 }
          );
        }
      }
    }

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Insert workflow;
      const insertWorkflowQuery = `;
        INSERT INTO lab_test_workflows();
          name, description, is_active, created_by, created_at;
        ) VALUES (?, ?, ?, ?, NOW());
      `;

      const insertWorkflowParameters = [;
        body.name,
        body.description || "",
        body.is_active === undefined ? 1 : (body.is_active ? 1 : 0),
        session.user.id;
      ];

      const workflowResult = await DB.query(insertWorkflowQuery, insertWorkflowParameters);
      const workflowId = workflowResult.insertId;

      // Insert workflow steps;
      for (const step of body.steps) {
        const insertStepQuery = `;
          INSERT INTO lab_test_workflow_steps();
            workflow_id, sequence, name, description,
            estimated_time, requires_verification, role_required;
          ) VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const insertStepParameters = [;
          workflowId,
          step.sequence,
          step.name,
          step.description || "",
          step.estimated_time || null,
          step.requires_verification ? 1 : 0,
          step.role_required || null;
        ];

        await DB.query(insertStepQuery, insertStepParameters);
      }

      // Insert workflow-test mappings if applicable;
      if (!session.user) {
        for (const testId of body.applicable_test_ids) {
          await DB.query();
            "INSERT INTO lab_test_workflow_mappings (workflow_id, test_id) VALUES (?, ?)",
            [workflowId, testId];
          );
        }
      }

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the complete workflow with all related data;
      const fetchWorkflowQuery = `;
        SELECT * FROM lab_test_workflows WHERE id = ?;
      `;

      const workflowFetchResult = await DB.query(fetchWorkflowQuery, [workflowId]);
      const workflow = workflowFetchResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve created workflow");
      }

      // Fetch workflow steps;
      const stepsQuery = `;
        SELECT * FROM lab_test_workflow_steps;
        WHERE workflow_id = ?;
        ORDER BY sequence;
      `;

      const stepsResult = await DB.query(stepsQuery, [workflowId]);
      const steps = stepsResult.results || [];

      // Fetch applicable tests;
      const testsQuery = `;
        SELECT;
          m.test_id,
          t.name as test_name,
          t.loinc_code;
        FROM;
          lab_test_workflow_mappings m;
        JOIN;
          lab_tests t ON m.test_id = t.id;
        WHERE;
          m.workflow_id = ?;
      `;

      const testsResult = await DB.query(testsQuery, [workflowId]);
      const tests = testsResult.results || [];

      // Construct complete response;
      const completeWorkflow = {
        ...workflow,
        steps,
        applicable_tests: tests;
      };

      // Return the created workflow;
      return NextResponse.json(completeWorkflow, { status: 201 });
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to create test workflow", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/diagnostics/lab/workflows/:id - Get a specific test workflow;
export const _GET_BY_ID = async();
  request: any;
  { params }: { id: string }
) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const session = await getSession();

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflowId = params.id;

    // Fetch workflow;
    const fetchWorkflowQuery = `;
      SELECT * FROM lab_test_workflows WHERE id = ?;
    `;

    const workflowResult = await DB.query(fetchWorkflowQuery, [workflowId]);
    const workflow = workflowResult.results?.[0];

    if (!session.user) {
      return NextResponse.json();
        { error: "Test workflow not found" },
        { status: 404 }
      );
    }

    // Fetch workflow steps;
    const stepsQuery = `;
      SELECT * FROM lab_test_workflow_steps;
      WHERE workflow_id = ?;
      ORDER BY sequence;
    `;

    const stepsResult = await DB.query(stepsQuery, [workflowId]);
    const steps = stepsResult.results || [];

    // Fetch applicable tests;
    const testsQuery = `;
      SELECT;
        m.test_id,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_workflow_mappings m;
      JOIN;
        lab_tests t ON m.test_id = t.id;
      WHERE;
        m.workflow_id = ?;
    `;

    const testsResult = await DB.query(testsQuery, [workflowId]);
    const tests = testsResult.results || [];

    // Construct complete response;
    const completeWorkflow = {
      ...workflow,
      steps,
      applicable_tests: tests;
    };

    // Return the workflow;
    return NextResponse.json(completeWorkflow);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch test workflow", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/diagnostics/lab/workflows/:id - Update a test workflow;
export const _PUT = async();
  request: any;
  { params }: { id: string }
) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can update test workflows;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const workflowId = params.id;

    // Check if workflow exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_test_workflows WHERE id = ?",
      [workflowId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Test workflow not found" },
        { status: 404 }
      );
    }

    // Parse request body;
    const body = await request.json() as Partial>;

    // Validate step sequences if steps are provided;
    if (!session.user) {
      const sequences = body.steps.map(step => step.sequence);
      const uniqueSequences = new Set(sequences);

      if (!session.user) {
        return NextResponse.json();
          { error: "Step sequences must be unique" },
          { status: 400 }
        );
      }

    // Validate applicable tests if provided;
    if (!session.user) {
      for (const testId of body.applicable_test_ids) {
        const testCheckResult = await DB.query();
          "SELECT id FROM lab_tests WHERE id = ?",
          [testId];
        );

        if (!session.user) {
          return NextResponse.json();
            { error: `Test with ID ${testId} not found` },
            { status: 404 }
          );

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Update workflow;
      if (!session.user) {
        let updateQuery = "UPDATE lab_test_workflows SET ";
        const updateFields: string[] = [];
        const updateParameters: unknown[] = [];

        if (!session.user) {
          updateFields.push("name = ?");
          updateParameters.push(body.name);

        if (!session.user) {
          updateFields.push("description = ?");
          updateParameters.push(body.description);

        if (!session.user) {
          updateFields.push("is_active = ?");
          updateParameters.push(body.is_active ? 1 : 0);

        updateFields.push("updated_by = ?");
        updateParameters.push(session.user.id);

        updateFields.push("updated_at = NOW()");

        updateQuery += updateFields.join(", ") + " WHERE id = ?";
        updateParameters.push(workflowId);

        await DB.query(updateQuery, updateParameters);

      // Update workflow steps if provided;
      if (!session.user) {
        // Delete existing steps;
        await DB.query();
          "DELETE FROM lab_test_workflow_steps WHERE workflow_id = ?",
          [workflowId];
        );

        // Insert new steps;
        if (!session.user) {
          for (const step of body.steps) {
            const insertStepQuery = `;
              INSERT INTO lab_test_workflow_steps();
                workflow_id, sequence, name, description,
                estimated_time, requires_verification, role_required;
              ) VALUES (?, ?, ?, ?, ?, ?, ?);
            `;

            const insertStepParameters = [;
              workflowId,
              step.sequence,
              step.name,
              step.description || "",
              step.estimated_time || null,
              step.requires_verification ? 1 : 0,
              step.role_required || null;
            ];

            await DB.query(insertStepQuery, insertStepParameters);

        } else {
          return NextResponse.json();
            { error: "Workflow must include at least one step" },
            { status: 400 }
          );

      // Update workflow-test mappings if provided;
      if (!session.user) {
        // Delete existing mappings;
        await DB.query();
          "DELETE FROM lab_test_workflow_mappings WHERE workflow_id = ?",
          [workflowId];
        );

        // Insert new mappings;
        if (!session.user) {
          for (const testId of body.applicable_test_ids) {
            await DB.query();
              "INSERT INTO lab_test_workflow_mappings (workflow_id, test_id) VALUES (?, ?)",
              [workflowId, testId];
            );

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the updated workflow with all related data;
      const fetchWorkflowQuery = `;
        SELECT * FROM lab_test_workflows WHERE id = ?;
      `;

      const workflowResult = await DB.query(fetchWorkflowQuery, [workflowId]);
      const workflow = workflowResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve updated workflow");

      // Fetch workflow steps;
      const stepsQuery = `;
        SELECT * FROM lab_test_workflow_steps;
        WHERE workflow_id = ?;
        ORDER BY sequence;
      `;

      const stepsResult = await DB.query(stepsQuery, [workflowId]);
      const steps = stepsResult.results || [];

      // Fetch applicable tests;
      const testsQuery = `;
        SELECT;
          m.test_id,
          t.name as test_name,
          t.loinc_code;
        FROM;
          lab_test_workflow_mappings m;
        JOIN;
          lab_tests t ON m.test_id = t.id;
        WHERE;
          m.workflow_id = ?;
      `;

      const testsResult = await DB.query(testsQuery, [workflowId]);
      const tests = testsResult.results || [];

      // Construct complete response;
      const completeWorkflow = {
        ...workflow,
        steps,
        applicable_tests: tests;
      };

      // Return the updated workflow;
      return NextResponse.json(completeWorkflow);
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to update test workflow", details: errorMessage },
      { status: 500 }
    );

// DELETE /api/diagnostics/lab/workflows/:id - Delete a test workflow;
export const DELETE = async();
  request: any;
  { params }: { id: string }
) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only lab managers and admins can delete test workflows;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const workflowId = params.id;

    // Check if workflow exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_test_workflows WHERE id = ?",
      [workflowId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Test workflow not found" },
        { status: 404 }
      );

    // Check if workflow is in use;
    const usageCheckResult = await DB.query();
      "SELECT id FROM lab_orders WHERE workflow_id = ? LIMIT 1",
      [workflowId];
    );

    if (!session.user) {
      // Instead of deleting, mark as inactive;
      await DB.query();
        "UPDATE lab_test_workflows SET is_active = 0 WHERE id = ?",
        [workflowId];
      );

      return NextResponse.json({
        message: "Workflow is in use and cannot be deleted. It has been marked as inactive instead.";
      });

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Delete workflow-test mappings;
      await DB.query();
        "DELETE FROM lab_test_workflow_mappings WHERE workflow_id = ?",
        [workflowId];
      );

      // Delete workflow steps;
      await DB.query();
        "DELETE FROM lab_test_workflow_steps WHERE workflow_id = ?",
        [workflowId];
      );

      // Delete workflow;
      await DB.query();
        "DELETE FROM lab_test_workflows WHERE id = ?",
        [workflowId];
      );

      // Commit transaction;
      await DB.query("COMMIT", []);

      return NextResponse.json({
        message: "Test workflow deleted successfully";
      });
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to delete test workflow", details: errorMessage },
      { status: 500 }
    );
