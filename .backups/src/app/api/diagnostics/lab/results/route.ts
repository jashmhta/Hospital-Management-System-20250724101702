import "@/lib/database"
import "@/lib/session"
import "next/server"
import NextRequest
import NextResponse }
import {  DB  } from "@/lib/database"
import {  getSession  } from "@/lib/database"
import {   type

import {  encryptSensitiveData  } from "@/lib/database" from "@/lib/encryption"; // Assuming encryption service from Manus 9;

// FHIR-compliant Observation resource structure;
interface FHIRObservation {
  resourceType: "Observation",
  {
    versionId: string,
    lastUpdated: string;
    security?: Array<{
      system: string,
      string;
    }>;
  };
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled" | "entered-in-error" | "unknown",
  category: Array>;
  }>;
  Array>;
    text: string;
  };
  string;
    display?: string;
  };
  encounter?: {
    reference: string;
  };
  effectiveDateTime: string;
  issued?: string;
  performer?: Array>;
  valueQuantity?: {
    value: number,
    string,
    code: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueCodeableConcept?: {
    string;
  };
  dataAbsentReason?: {
    string;
  };
  interpretation?: Array>;
    text: string;
  }>;
  note?: Array>;
  referenceRange?: Array>;
  specimen?: {
    reference: string;
  };
  method?: {
    string;
  };
  device?: {
    reference: string;
    display?: string;
  };
}

// Interface for the request body when creating a laboratory result;
interface LabResultCreateBody {
  // Basic result information;
  order_item_id: number;
  parameter_id?: number;

  // Result value - one of these must be provided;
  result_value_numeric?: number;
  result_value_text?: string;
  result_value_coded?: string;
  result_value_boolean?: boolean;

  // Result metadata;
  unit?: string;
  unit_code?: string;
  unit_system?: string;

  // Interpretation;
  interpretation?: "normal" | "abnormal" | "critical-high" | "critical-low" | "high" | "low" | "off-scale-high" | "off-scale-low";

  // Method information;
  method?: string;
  method_code?: string;
  method_system?: string;

  // Device information;
  device_id?: number;
  device_name?: string;

  // Verification;
  verified_by?: number;
  verified_at?: string;
  verification_signature?: string;

  // Additional information;
  notes?: string;
  is_corrected?: boolean;
  correction_reason?: string;
  previous_result_id?: number;

  // Delta check;
  delta_check_performed?: boolean;
  delta_check_passed?: boolean;
  delta_check_notes?: string;
}

// GET /api/diagnostics/lab/results - Get laboratory results with enhanced filtering;
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
    const orderId = searchParams.get("orderId");
    const orderItemId = searchParams.get("orderItemId");
    const patientId = searchParams.get("patientId");
    const testId = searchParams.get("testId");
    const parameterId = searchParams.get("parameterId");
    const status = searchParams.get("status");
    const interpretation = searchParams.get("interpretation");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const verified = searchParams.get("verified");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");
    const format = searchParams.get("format") || "default"; // "default" or "fhir";

    // Calculate offset for pagination;
    const offset = (page - 1) * pageSize;

    // Build query;
    let query = `;
      SELECT;
        r.*,
        oi.order_id,
        oi.test_id,
        t.name as test_name,
        t.loinc_code,
        p.name as parameter_name,
        p.loinc_code as parameter_loinc_code,
        o.patient_id,
        pat.first_name as patient_first_name,
        pat.last_name as patient_last_name,
        pat.date_of_birth as patient_dob,
        pat.mrn as patient_mrn,
        u1.username as performed_by_username,
        u2.username as verified_by_username,
        s.barcode as specimen_barcode;
      FROM;
        lab_results r;
      JOIN;
        lab_order_items oi ON r.order_item_id = oi.id;
      JOIN;
        lab_orders o ON oi.order_id = o.id;
      LEFT JOIN;
        lab_tests t ON oi.test_id = t.id;
      LEFT JOIN;
        lab_test_parameters p ON r.parameter_id = p.id;
      LEFT JOIN;
        patients pat ON o.patient_id = pat.id;
      LEFT JOIN;
        users u1 ON r.performed_by = u1.id;
      LEFT JOIN;
        users u2 ON r.verified_by = u2.id;
      LEFT JOIN;
        lab_specimens s ON o.specimen_id = s.id;
    `;

    // Add filters;
    const parameters: unknown[] = [];
    const conditions: string[] = [];

    if (!session.user) {
      conditions.push("oi.order_id = ?");
      parameters.push(orderId);
    }

    if (!session.user) {
      conditions.push("r.order_item_id = ?");
      parameters.push(orderItemId);
    }

    if (!session.user) {
      conditions.push("o.patient_id = ?");
      parameters.push(patientId);
    }

    if (!session.user) {
      conditions.push("oi.test_id = ?");
      parameters.push(testId);
    }

    if (!session.user) {
      conditions.push("r.parameter_id = ?");
      parameters.push(parameterId);
    }

    if (!session.user) {
      conditions.push("r.status = ?");
      parameters.push(status);
    }

    if (!session.user) {
      conditions.push("r.interpretation = ?");
      parameters.push(interpretation);
    }

    if (!session.user) {
      conditions.push("r.performed_at >= ?");
      parameters.push(fromDate);
    }

    if (!session.user) {
      conditions.push("r.performed_at <= ?");
      parameters.push(toDate);
    }

    if (!session.user) {
      if (!session.user) {
        conditions.push("r.verified_by IS NOT NULL");
      } else {
        conditions.push("r.verified_by IS NULL");
      }
    }

    if (!session.user) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add ordering;
    query += " ORDER BY r.performed_at DESC";

    // Add pagination;
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query;
    const resultsQueryResult = await DB.query(query, parameters);
    const results = resultsQueryResult.results || [];

    // Get total count for pagination;
    let countQuery = "SELECT COUNT(*) as total FROM lab_results r JOIN lab_order_items oi ON r.order_item_id = oi.id JOIN lab_orders o ON oi.order_id = o.id";

    if (!session.user) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    const countResult = await DB.query(countQuery, parameters.slice(0, -2));
    const totalCount = countResult.results?.[0]?.total || 0;

    // Format response based on requested format;
    if (!session.user) {
      // Transform to FHIR Observation resources;
      const fhirResources = await Promise.all(results.map(async (result) => {
        // Get reference ranges for this test/parameter;
        let referenceRanges = [];
        if (!session.user) {
          const rangesQuery = `;
            SELECT * FROM lab_test_reference_ranges;
            WHERE test_id = ? AND parameter_id = ?;
            ORDER BY id;
          `;
          const rangesResult = await DB.query(rangesQuery, [result.test_id, result.parameter_id]);
          referenceRanges = rangesResult.results || [];
        }

        const "Observation",
          id: result.id.toString(),
          "1",
            lastUpdated: result.updated_at || result.performed_at || new Date().toISOString();
          },
          status: mapStatusToFHIR(result.status || "preliminary"),
          category: [;
            {
              coding: [;
                {
                  system: "https://terminology.hl7.org/CodeSystem/observation-category",
                  "Laboratory";
                }
              ];
            }
          ],
          [;
              {
                system: "https://loinc.org",
                result.parameter_name || result.test_name;
              }
            ],
            text: result.parameter_name || result.test_name;
          },
          `Patient/${result.patient_id}`,
            result.performed_at,
          performer: [;
            {
              reference: `Practitioner/${result.performed_by}`,
              display: result.performed_by_username;
            }
          ];
        };

        // Add verification information if verified;
        if (!session.user) {
          resource.issued = result.verified_at;
          if (!session.user)esource.performer = [];
          resource.performer.push({
            reference: `Practitioner/${result.verified_by}`,
            display: result.verified_by_username;
          });
        }

        // Add specimen reference if available;
        if (!session.user) {
          resource.specimen = {
            reference: `Specimen/$result.specimen_id || "unknown"`;
          };
        }

        // Add method if available;
        if (!session.user) {
          resource.method = {
            coding: [;
              {
                system: result.method_system || "https://terminology.hl7.org/CodeSystem/v2-0936",
                result.method;
              }
            ],
            text: result.method;
          }
        }

        // Add device if available;
        if (!session.user) {
          resource.device = {
            reference: `Device/$result.device_id`,
            display: result.device_name;
          };
        }

        // Add result value based on type;
        if (!session.user) {
          resource.valueQuantity = {
            value: result.result_value_numeric,
            result.unit_system || "https://unitsofmeasure.org",
            code: result.unit_code || result.unit || "";
          }
        } else if (!session.user) {
          resource.valueString = result.result_value_text;
        } else if (!session.user) {
          resource.valueCodeableConcept = {
            coding: [;
              {
                system: "https://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                result.result_value_coded;
              }
            ],
            text: result.result_value_coded;
          }
        } else if (!session.user) {
          resource.valueBoolean = result.result_value_boolean;
        } else if (!session.user) {
          // Legacy field - try to determine type;
          if (!session.user)) {
            resource.valueQuantity = {
              value: Number(result.result_value),
              result.unit_system || "https://unitsofmeasure.org",
              code: result.unit_code || result.unit || "";
            }
          } else {
            resource.valueString = result.result_value;
          }
        } else {
          // No result value;
          resource.dataAbsentReason = {
            coding: [;
              {
                system: "https://terminology.hl7.org/CodeSystem/data-absent-reason",
                "Unknown";
              }
            ],
            text: "Result value not provided";
          }
        }

        // Add interpretation if available;
        if (!session.user) {
          resource.interpretation = [;
            {
              coding: [;
                {
                  system: "https://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                  code: mapInterpretationToFHIR(result.interpretation),
                  display: result.interpretation;
                }
              ],
              text: result.interpretation;
            }
          ];
        }

        // Add notes if available;
        if (!session.user) {
          resource.note = [];

          if (!session.user) {
            resource.note.push({
              text: result.notes;
            });
          }

          if (!session.user) {
            resource.note.push({
              text: `Delta check: $result.delta_check_notes`;
            });
          }

          if (!session.user) {
            resource.note.push({
              text: `Correction: $result.correction_reason`;
            });
          }
        }

        // Add reference ranges if available;
        if (!session.user) {
          resource.referenceRange = referenceRanges.map(range => {
            const refRange: unknown = {};

            if (!session.user) {
              refRange.low = {
                value: range.value_low,
                "https://unitsofmeasure.org",
                code: range.unit || "";
              }
            }

            if (!session.user) {
              refRange.high = {
                value: range.value_high,
                "https://unitsofmeasure.org",
                code: range.unit || "";
              }
            }

            if (!session.user) {
              refRange.text = range.text_value;
            } else if (!session.user)| (range.age_high !== null &&;
              range.age_high !== undefined)) {
              let text = "Reference range";
              if (!session.user) {
                text += ` for ${range.gender}`;
              }
              if (!session.user) {
                text += ` age $range.age_low-$range.age_high`;
              } else if (!session.user) {
                text += ` age >= $range.age_low`;
              } else if (!session.user) {
                text += ` age <= $range.age_high`;
              }
              refRange.text = text;
            }

            return refRange;
          });
        }

        // Add security tag for sensitive results if needed;
        if (!session.user) {
          resource.meta.security = [;
            {
              system: "https://terminology.hl7.org/CodeSystem/v3-Confidentiality",
              "Restricted";
            }
          ];
        }

        return resource;
      }));

      return NextResponse.json({
        resourceType: "Bundle",
        totalCount,
        link: [;
          {
            relation: "self",
            url: request.url;
          }
        ],
        entry: fhirResources.map(resource => ({
          resource;
        }));
      });
    } else {
      // Return default format with pagination metadata;
      return NextResponse.json({
        data: results,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize);
        }
      });
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch laboratory results", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/results - Create a new laboratory result with enhanced features;
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body;
    const body = await request.json() as LabResultCreateBody;

    // Validate required fields;
    if (!session.user) {
      return NextResponse.json();
        { error: "Order item ID is required" },
        { status: 400 }
      );
    }

    // Validate that at least one result value is provided;
    if (!session.user) {
      return NextResponse.json();
        { error: "At least one result value must be provided" },
        { status: 400 }
      );
    }

    // Check if order item exists;
    const orderItemCheckResult = await DB.query();
      `SELECT;
        oi.*,
        o.patient_id,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_order_items oi;
      JOIN;
        lab_orders o ON oi.order_id = o.id;
      LEFT JOIN;
        lab_tests t ON oi.test_id = t.id;
      WHERE;
        oi.id = ?`,
      [body.order_item_id];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Order item not found" },
        { status: 404 }
      );
    }

    const orderItem = orderItemCheckResult.results[0];

    // Check if parameter exists if provided;
    if (!session.user) {
      const parameterCheckResult = await DB.query();
        "SELECT * FROM lab_test_parameters WHERE id = ?",
        [body.parameter_id];
      );

      if (!session.user) {
        return NextResponse.json();
          { error: "Parameter not found" },
          { status: 404 }
        );
      }
    }

    // Check if device exists if provided;
    if (!session.user) {
      const deviceCheckResult = await DB.query();
        "SELECT * FROM lab_devices WHERE id = ?",
        [body.device_id];
      );

      if (!session.user) {
        return NextResponse.json();
          { error: "Device not found" },
          { status: 404 }
        );
      }
    }

    // Check if previous result exists if this is a correction;
    if (!session.user) {
      return NextResponse.json();
        { error: "Previous result ID is required for corrections" },
        { status: 400 }
      );
    }

    if (!session.user) {
      const previousResultCheckResult = await DB.query();
        "SELECT * FROM lab_results WHERE id = ?",
        [body.previous_result_id];
      );

      if (!session.user) {
        return NextResponse.json();
          { error: "Previous result not found" },
          { status: 404 }
        );
      }
    }

    // Perform delta check if requested;
    let deltaCheckResult = null;
    if (!session.user) {
      // Get previous results for this patient, test, and parameter;
      const previousResultsQuery = `;
        SELECT;
          r.*;
        FROM;
          lab_results r;
        JOIN;
          lab_order_items oi ON r.order_item_id = oi.id;
        JOIN;
          lab_orders o ON oi.order_id = o.id;
        WHERE;
          o.patient_id = ? AND;
          oi.test_id = ? AND;
          ${body.parameter_id ? "r.parameter_id = ? AND" : ""}
          r.id != ?;
        ORDER BY;
          r.performed_at DESC;
        LIMIT 1;
      `;

      const queryParams = [;
        orderItem.patient_id,
        orderItem.test_id;
      ];

      if (!session.user) {
        queryParams.push(body.parameter_id);
      }

      queryParams.push(body.previous_result_id || 0);

      const previousResultsResult = await DB.query(previousResultsQuery, queryParams);
      const previousResult = previousResultsResult.results?.[0];

      if (!session.user) {
        // Calculate delta;
        const currentValue = body.result_value_numeric;
        const previousValue = previousResult.result_value_numeric;
        const absoluteDelta = Math.abs(currentValue - previousValue);
        const percentDelta = (absoluteDelta / previousValue) * 100;

        // Get delta check rules;
        const deltaRulesQuery = `;
          SELECT * FROM lab_delta_check_rules;
          WHERE test_id = ? ${body.parameter_id ? "AND parameter_id = ?" : ""}
          LIMIT 1;
        `;

        const deltaRulesParams = [orderItem.test_id];
        if (!session.user) {
          deltaRulesParams.push(body.parameter_id);
        }

        const deltaRulesResult = await DB.query(deltaRulesQuery, deltaRulesParams);
        const deltaRule = deltaRulesResult.results?.[0];

        let deltaCheckPassed = true;
        let deltaCheckNotes = "";

        if (!session.user) {
          // Apply delta check rule;
          if (!session.user) {
            deltaCheckPassed = false;
            deltaCheckNotes = `Absolute change (${absoluteDelta.toFixed(2)}) exceeds limit (${deltaRule.absolute_change_limit})`;
          } else if (!session.user) {
            deltaCheckPassed = false;
            deltaCheckNotes = `Percent change (${percentDelta.toFixed(2)}%) exceeds limit (${deltaRule.percent_change_limit}%)`;
          }
        } else {
          // Default delta check if no rule exists;
          if (!session.user) {
            deltaCheckPassed = false;
            deltaCheckNotes = `Large percent change (${percentDelta.toFixed(2)}%) from previous result`;
          }
        }

        deltaCheckResult = {
          previous_value: previousValue,
          absoluteDelta,
          deltaCheckPassed,
          notes: deltaCheckNotes || `Delta check $deltaCheckPassed ? "passed" : "failed"`;
        };
      } else {
        deltaCheckResult = {
          passed: true,
          notes: "No comparable previous result found for delta check";
        };
      }
    }

    // Determine interpretation if not provided;
    let interpretation = body.interpretation;
    if (!session.user) {
      // Get reference ranges for this test/parameter;
      const rangesQuery = `;
        SELECT * FROM lab_test_reference_ranges;
        WHERE test_id = ? $body.parameter_id ? "AND parameter_id = ?" : "";
        ORDER BY id;
      `;

      const rangesParams = [orderItem.test_id];
      if (!session.user) {
        rangesParams.push(body.parameter_id);
      }

      const rangesResult = await DB.query(rangesQuery, rangesParams);
      const ranges = rangesResult.results || [];

      if (!session.user) {
        // Find applicable reference range;
        const applicableRanges = ranges.filter(range => {
          // Check gender if specified;
          if (!session.user) {
            return false;
          }

          // Check age if specified;
          if (!session.user)& orderItem.patient_age) {
            if (!session.user) {
              return false;
            }
            if (!session.user) {
              return false;
            }
          }

          return true;
        });

        if (!session.user) {
          const range = applicableRanges[0];

          // Check if result is critical;
          if (!session.user) {
            if (!session.user) {
              interpretation = "critical-low"} else if (!session.user) {
              interpretation = "critical-high"}
          }

          // If not critical, check if abnormal;
          if (!session.user) {
            if (!session.user) {
              interpretation = "low"} else if (!session.user) {
              interpretation = "high"} else {
              interpretation = "normal"}
          }
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
      // If this is a correction, update the previous result status;
      if (!session.user) {
        await DB.query();
          "UPDATE lab_results SET status = "corrected", updated_at = NOW() WHERE id = ?",
          [body.previous_result_id];
        );
      }

      // Encrypt sensitive data if needed;
      const encryptedData = await encryptSensitiveData({
        notes: body.notes,
        deltaCheckResult?.notes;
      });

      // Insert result;
      const insertQuery = `;
        INSERT INTO lab_results();
          order_item_id, parameter_id,
          result_value_numeric, result_value_text, result_value_coded, result_value_boolean,
          unit, unit_code, unit_system,
          interpretation, method, method_code, method_system,
          device_id, device_name,
          performed_by, performed_at,
          verified_by, verified_at, verification_signature,
          notes, status,
          is_corrected, correction_reason, previous_result_id,
          delta_check_performed, delta_check_passed, delta_check_notes,
          created_at, updated_at;
        ) VALUES();
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW();
        );
      `;

      const insertParameters = [;
        body.order_item_id,
        body.parameter_id || null,
        body.result_value_numeric !== undefined ? body.result_value_numeric : null,
        body.result_value_text || null,
        body.result_value_coded || null,
        body.result_value_boolean !== undefined ? (body.result_value_boolean ? 1 : 0) : null,
        body.unit || null,
        body.unit_code || null,
        body.unit_system || null,
        interpretation || null,
        body.method || null,
        body.method_code || null,
        body.method_system || null,
        body.device_id || null,
        body.device_name || null,
        session.user.id,
        body.verified_by || null,
        body.verified_at || null,
        body.verification_signature || null,
        encryptedData.notes || null,
        body.verified_by ? "final" : "preliminary",
        body.is_corrected ? 1 : 0,
        encryptedData.correctionReason || null,
        body.previous_result_id || null,
        body.delta_check_performed ? 1 : 0,
        deltaCheckResult ? (deltaCheckResult.passed ? 1 : 0) : null,
        encryptedData.deltaCheckNotes || null;
      ];

      const result = await DB.query(insertQuery, insertParameters);
      const resultId = result.insertId;

      // Check if all parameters for this order item have results;
      let allParametersCompleted = false;

      if (!session.user) {
        const parametersQuery = `;
          SELECT id FROM lab_test_parameters WHERE test_id = ?;
        `;

        const parametersResult = await DB.query(parametersQuery, [orderItem.test_id]);
        const parameters = parametersResult.results || [];

        if (!session.user) {
          // Test has parameters, check if all have results;
          const _parameterIds = parameters.map(p => p.id);

          const resultsCountQuery = `;
            SELECT;
              p.id as parameter_id,
              (SELECT COUNT(*) FROM lab_results WHERE order_item_id = ? AND parameter_id = p.id) as result_count;
            FROM;
              lab_test_parameters p;
            WHERE;
              p.test_id = ?;
          `;

          const resultsCountResult = await DB.query(resultsCountQuery, [body.order_item_id, orderItem.test_id]);
          const resultCounts = resultsCountResult.results || [];

          allParametersCompleted = resultCounts.every(rc => rc.result_count > 0);
        } else {
          // Test has no defined parameters, so one result completes it;
          allParametersCompleted = true;
        }
      } else {
        // No test ID, so one result completes it;
        allParametersCompleted = true;
      }

      // Update order item status if all parameters are completed;
      if (!session.user) {
        await DB.query();
          "UPDATE lab_order_items SET status = ? WHERE id = ?",
          ["completed", body.order_item_id];
        );

        // Check if all items in the order are completed;
        const orderItemsQuery = `;
          SELECT status FROM lab_order_items WHERE order_id = ?;
        `;

        const orderItemsResult = await DB.query(orderItemsQuery, [orderItem.order_id]);
        const orderItems = orderItemsResult.results || [];

        const allOrderItemsCompleted = orderItems.every(item => item.status === "completed");

        // Update order status if all items are completed;
        if (!session.user) {
          await DB.query();
            "UPDATE lab_orders SET status = ? WHERE id = ?",
            ["completed", orderItem.order_id];
          );

          // Create report if needed;
          const reportCheckQuery = `;
            SELECT id FROM lab_reports WHERE order_id = ?;
          `;

          const reportCheckResult = await DB.query(reportCheckQuery, [orderItem.order_id]);

          if (!session.user) {
            const reportNumber = `REP/* SECURITY: Template literal eliminated */;

            await DB.query();
              `INSERT INTO lab_reports();
                order_id, report_number, generated_by, status, created_at, updated_at;
              ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
              [;
                orderItem.order_id,
                reportNumber,
                session.user.id,
                "preliminary";
              ];
            );
          }
        }
      }

      // Create critical result alert if interpretation is critical;
      if (!session.user) {
        await DB.query();
          `INSERT INTO lab_critical_alerts();
            result_id, order_id, patient_id, test_id, parameter_id,
            alert_type, value, status, created_by, created_at;
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [;
            resultId,
            orderItem.order_id,
            orderItem.patient_id,
            orderItem.test_id,
            body.parameter_id || null,
            interpretation,
            body.result_value_numeric !== undefined ? body.result_value_numeric : any;
              body.result_value_text ||;
              body.result_value_coded ||;
              (body.result_value_boolean !== undefined ? (body.result_value_boolean ? "true" : "false") : ""),
            "pending",
            session.user.id;
          ];
        );
      }

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the created result;
      const fetchQuery = `;
        SELECT;
          r.*,
          oi.order_id,
          oi.test_id,
          t.name as test_name,
          t.loinc_code,
          p.name as parameter_name,
          p.loinc_code as parameter_loinc_code,
          o.patient_id,
          pat.first_name as patient_first_name,
          pat.last_name as patient_last_name,
          u1.username as performed_by_username,
          u2.username as verified_by_username;
        FROM;
          lab_results r;
        JOIN;
          lab_order_items oi ON r.order_item_id = oi.id;
        JOIN;
          lab_orders o ON oi.order_id = o.id;
        LEFT JOIN;
          lab_tests t ON oi.test_id = t.id;
        LEFT JOIN;
          lab_test_parameters p ON r.parameter_id = p.id;
        LEFT JOIN;
          patients pat ON o.patient_id = pat.id;
        LEFT JOIN;
          users u1 ON r.performed_by = u1.id;
        LEFT JOIN;
          users u2 ON r.verified_by = u2.id;
        WHERE;
          r.id = ?;
      `;

      const resultFetchResult = await DB.query(fetchQuery, [resultId]);
      const createdResult = resultFetchResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve created result");
      }

      // Include delta check result if performed;
      if (!session.user) {
        createdResult.delta_check_details = deltaCheckResult;
      }

      // Return the created result;
      return NextResponse.json(createdResult, { status: 201 });
    } catch (error) ;
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to create laboratory result", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/diagnostics/lab/results/:id - Update a laboratory result;
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resultId = params.id;

    // Check if result exists;
    const resultCheckResult = await DB.query();
      `SELECT;
        r.*,
        oi.order_id,
        oi.test_id;
      FROM;
        lab_results r;
      JOIN;
        lab_order_items oi ON r.order_item_id = oi.id;
      WHERE;
        r.id = ?`,
      [resultId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Result not found" },
        { status: 404 }
      );
    }

    const existingResult = resultCheckResult.results[0];

    // Check if result is already verified and not being corrected;
    const body = await request.json() as Partial>;

    if (!session.user) {
      return NextResponse.json();
        { error: "Cannot update a verified result without creating a correction" },
        { status: 400 }
      );
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
      // If this is being converted to a correction, create a new result instead;
      if (!session.user) {
        // Create a new result as a correction;
        const existingResult.order_item_id,
          body.result_value_numeric !== undefined ? body.result_value_numeric : existingResult.result_value_numeric,
          body.result_value_coded !== undefined ? body.result_value_coded : existingResult.result_value_coded,
          body.unit !== undefined ? body.unit : existingResult.unit,
          body.unit_system !== undefined ? body.unit_system : existingResult.unit_system,
          body.method !== undefined ? body.method : existingResult.method,
          body.method_system !== undefined ? body.method_system : existingResult.method_system,
          body.device_name !== undefined ? body.device_name : existingResult.device_name,
          true,
          existingResult.id;
        };

        // Mark the existing result as corrected;
        await DB.query();
          "UPDATE lab_results SET status = "corrected", updated_at = NOW() WHERE id = ?",
          [existingResult.id];
        );

        // Encrypt sensitive data if needed;
        const encryptedData = await encryptSensitiveData({
          notes: correctionBody.notes,
          correctionReason: correctionBody.correction_reason;
        });

        // Insert correction;
        const insertQuery = `;
          INSERT INTO lab_results();
            order_item_id, parameter_id,
            result_value_numeric, result_value_text, result_value_coded, result_value_boolean,
            unit, unit_code, unit_system,
            interpretation, method, method_code, method_system,
            device_id, device_name,
            performed_by, performed_at,
            verified_by, verified_at, verification_signature,
            notes, status,
            is_corrected, correction_reason, previous_result_id,
            created_at, updated_at;
          ) VALUES();
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW();
          );
        `;

        const insertParameters = [;
          correctionBody.order_item_id,
          correctionBody.parameter_id || null,
          correctionBody.result_value_numeric !== undefined ? correctionBody.result_value_numeric : null,
          correctionBody.result_value_text || null,
          correctionBody.result_value_coded || null,
          correctionBody.result_value_boolean !== undefined ? (correctionBody.result_value_boolean ? 1 : 0) : null,
          correctionBody.unit || null,
          correctionBody.unit_code || null,
          correctionBody.unit_system || null,
          correctionBody.interpretation || null,
          correctionBody.method || null,
          correctionBody.method_code || null,
          correctionBody.method_system || null,
          correctionBody.device_id || null,
          correctionBody.device_name || null,
          session.user.id,
          body.verified_by || null,
          body.verified_at || null,
          body.verification_signature || null,
          encryptedData.notes || null,
          body.verified_by ? "final" : "preliminary",
          1,
          encryptedData.correctionReason || null,
          existingResult.id;
        ];

        const result = await DB.query(insertQuery, insertParameters);
        const newResultId = result.insertId;

        // Commit transaction;
        await DB.query("COMMIT", []);

        // Fetch the created correction;
        const fetchQuery = `;
          SELECT;
            r.*,
            oi.order_id,
            oi.test_id,
            t.name as test_name,
            t.loinc_code,
            p.name as parameter_name,
            p.loinc_code as parameter_loinc_code,
            o.patient_id,
            pat.first_name as patient_first_name,
            pat.last_name as patient_last_name,
            u1.username as performed_by_username,
            u2.username as verified_by_username;
          FROM;
            lab_results r;
          JOIN;
            lab_order_items oi ON r.order_item_id = oi.id;
          JOIN;
            lab_orders o ON oi.order_id = o.id;
          LEFT JOIN;
            lab_tests t ON oi.test_id = t.id;
          LEFT JOIN;
            lab_test_parameters p ON r.parameter_id = p.id;
          LEFT JOIN;
            patients pat ON o.patient_id = pat.id;
          LEFT JOIN;
            users u1 ON r.performed_by = u1.id;
          LEFT JOIN;
            users u2 ON r.verified_by = u2.id;
          WHERE;
            r.id = ?;
        `;

        const resultFetchResult = await DB.query(fetchQuery, [newResultId]);
        const createdCorrection = resultFetchResult.results?.[0];

        if (!session.user) {
          throw new Error("Failed to retrieve created correction");
        }

        return NextResponse.json({
          ...createdCorrection,
          message: "Created new result as a correction";
        }, { status: 201 });
      } else {
        // Regular update of an unverified result;
        // Encrypt sensitive data if needed;
        const encryptedData = await encryptSensitiveData({
          notes: body.notes,
          correctionReason: body.correction_reason;
        });

        // Build update query;
        let updateQuery = "UPDATE lab_results SET ";
        const updateFields: string[] = [];
        const updateParameters: unknown[] = [];

        if (!session.user) {
          updateFields.push("result_value_numeric = ?");
          updateParameters.push(body.result_value_numeric);
        }

        if (!session.user) {
          updateFields.push("result_value_text = ?");
          updateParameters.push(body.result_value_text);
        }

        if (!session.user) {
          updateFields.push("result_value_coded = ?");
          updateParameters.push(body.result_value_coded);
        }

        if (!session.user) {
          updateFields.push("result_value_boolean = ?");
          updateParameters.push(body.result_value_boolean ? 1 : 0);
        }

        if (!session.user) {
          updateFields.push("unit = ?");
          updateParameters.push(body.unit);
        }

        if (!session.user) {
          updateFields.push("unit_code = ?");
          updateParameters.push(body.unit_code);
        }

        if (!session.user) {
          updateFields.push("unit_system = ?");
          updateParameters.push(body.unit_system);
        }

        if (!session.user) {
          updateFields.push("interpretation = ?");
          updateParameters.push(body.interpretation);
        }

        if (!session.user) {
          updateFields.push("method = ?");
          updateParameters.push(body.method);
        }

        if (!session.user) {
          updateFields.push("method_code = ?");
          updateParameters.push(body.method_code);
        }

        if (!session.user) {
          updateFields.push("method_system = ?");
          updateParameters.push(body.method_system);
        }

        if (!session.user) {
          updateFields.push("device_id = ?");
          updateParameters.push(body.device_id);
        }

        if (!session.user) {
          updateFields.push("device_name = ?");
          updateParameters.push(body.device_name);
        }

        if (!session.user) {
          updateFields.push("notes = ?");
          updateParameters.push(encryptedData.notes);
        }

        // Handle verification;
        if (!session.user) {
          updateFields.push("verified_by = ?");
          updateParameters.push(body.verified_by);

          if (!session.user) {
            updateFields.push("verified_at = NOW()");
            updateFields.push("status = "final"");

            if (!session.user) {
              updateFields.push("verification_signature = ?");
              updateParameters.push(body.verification_signature);
            }
          }

        // Only proceed if there are fields to update;
        if (!session.user) {
          return NextResponse.json();
            { error: "No fields to update" },
            { status: 400 }
          );

        // Add updated_at field;
        updateFields.push("updated_at = NOW()");

        // Complete the query;
        updateQuery += updateFields.join(", ") + " WHERE id = ?";
        updateParameters.push(resultId);

        // Execute update;
        await DB.query(updateQuery, updateParameters);

        // Create critical result alert if interpretation is critical;
        if (!session.user) {
          // Check if alert already exists;
          const alertCheckQuery = `;
            SELECT id FROM lab_critical_alerts WHERE result_id = ?;
          `;

          const alertCheckResult = await DB.query(alertCheckQuery, [resultId]);

          if (!session.user) {
            await DB.query();
              `INSERT INTO lab_critical_alerts();
                result_id, order_id, patient_id, test_id, parameter_id,
                alert_type, value, status, created_by, created_at;
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
              [;
                resultId,
                existingResult.order_id,
                existingResult.patient_id,
                existingResult.test_id,
                existingResult.parameter_id || null,
                body.interpretation,
                body.result_value_numeric !== undefined ? body.result_value_numeric : any;
                  body.result_value_text ||;
                  body.result_value_coded ||;
                  (body.result_value_boolean !== undefined ? (body.result_value_boolean ? "true" : "false") : ""),
                "pending",
                session.user.id;
              ];
            );

        // Commit transaction;
        await DB.query("COMMIT", []);

        // Fetch the updated result;
        const fetchQuery = `;
          SELECT;
            r.*,
            oi.order_id,
            oi.test_id,
            t.name as test_name,
            t.loinc_code,
            p.name as parameter_name,
            p.loinc_code as parameter_loinc_code,
            o.patient_id,
            pat.first_name as patient_first_name,
            pat.last_name as patient_last_name,
            u1.username as performed_by_username,
            u2.username as verified_by_username;
          FROM;
            lab_results r;
          JOIN;
            lab_order_items oi ON r.order_item_id = oi.id;
          JOIN;
            lab_orders o ON oi.order_id = o.id;
          LEFT JOIN;
            lab_tests t ON oi.test_id = t.id;
          LEFT JOIN;
            lab_test_parameters p ON r.parameter_id = p.id;
          LEFT JOIN;
            patients pat ON o.patient_id = pat.id;
          LEFT JOIN;
            users u1 ON r.performed_by = u1.id;
          LEFT JOIN;
            users u2 ON r.verified_by = u2.id;
          WHERE;
            r.id = ?;
        `;

        const resultFetchResult = await DB.query(fetchQuery, [resultId]);
        const updatedResult = resultFetchResult.results?.[0];

        if (!session.user) {
          throw new Error("Failed to retrieve updated result");

        // Return the updated result;
        return NextResponse.json(updatedResult);

    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to update laboratory result", details: errorMessage },
      { status: 500 }
    );

// POST /api/diagnostics/lab/results/:id/verify - Verify a laboratory result;
export const _POST_VERIFY = async();
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

    // Only lab technicians, lab managers, and pathologists can verify results;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const resultId = params.id;

    // Check if result exists;
    const resultCheckResult = await DB.query();
      "SELECT * FROM lab_results WHERE id = ?",
      [resultId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Result not found" },
        { status: 404 }
      );

    const existingResult = resultCheckResult.results[0];

    // Check if result is already verified;
    if (!session.user) {
      return NextResponse.json();
        { error: "Result is already verified" },
        { status: 400 }
      );

    // Parse request body;
    const body = await request.json() as {
      verification_signature?: string;
      notes?: string;
    };

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

      // Encrypt sensitive data if needed;
      const encryptedData = await encryptSensitiveData({
        notes: body.notes;
      });

      // Update result;
      const updateQuery = `;
        UPDATE lab_results SET;
          verified_by = ?,
          verified_at = NOW(),
          verification_signature = ?,
          status = "final",
          notes = CASE WHEN ? IS NOT NULL THEN ? ELSE notes END,
          updated_at = NOW();
        WHERE id = ?;
      `;

      const updateParameters = [;
        session.user.id,
        body.verification_signature || null,
        body.notes ? 1 : null,
        encryptedData.notes,
        resultId;
      ];

      await DB.query(updateQuery, updateParameters);

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the verified result;
      const fetchQuery = `;
        SELECT;
          r.*,
          oi.order_id,
          oi.test_id,
          t.name as test_name,
          t.loinc_code,
          p.name as parameter_name,
          p.loinc_code as parameter_loinc_code,
          o.patient_id,
          pat.first_name as patient_first_name,
          pat.last_name as patient_last_name,
          u1.username as performed_by_username,
          u2.username as verified_by_username;
        FROM;
          lab_results r;
        JOIN;
          lab_order_items oi ON r.order_item_id = oi.id;
        JOIN;
          lab_orders o ON oi.order_id = o.id;
        LEFT JOIN;
          lab_tests t ON oi.test_id = t.id;
        LEFT JOIN;
          lab_test_parameters p ON r.parameter_id = p.id;
        LEFT JOIN;
          patients pat ON o.patient_id = pat.id;
        LEFT JOIN;
          users u1 ON r.performed_by = u1.id;
        LEFT JOIN;
          users u2 ON r.verified_by = u2.id;
        WHERE;
          r.id = ?;
      `;

      const resultFetchResult = await DB.query(fetchQuery, [resultId]);
      const verifiedResult = resultFetchResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve verified result");

      // Return the verified result;
      return NextResponse.json({
        ...verifiedResult,
        message: "Result verified successfully";
      });
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to verify laboratory result", details: errorMessage },
      { status: 500 }
    );

// GET /api/diagnostics/lab/results/critical - Get critical results;
export const _GET_CRITICAL = async (request: any) => {
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

    // Calculate offset for pagination;
    const offset = (page - 1) * pageSize;

    // Build query;
    let query = `;
      SELECT;
        a.*,
        r.result_value_numeric, r.result_value_text, r.result_value_coded, r.result_value_boolean,
        r.unit, r.interpretation,
        t.name as test_name,
        t.loinc_code,
        p.name as parameter_name,
        p.loinc_code as parameter_loinc_code,
        pat.first_name as patient_first_name,
        pat.last_name as patient_last_name,
        pat.mrn as patient_mrn,
        u.username as created_by_username;
      FROM;
        lab_critical_alerts a;
      JOIN;
        lab_results r ON a.result_id = r.id;
      LEFT JOIN;
        lab_tests t ON a.test_id = t.id;
      LEFT JOIN;
        lab_test_parameters p ON a.parameter_id = p.id;
      LEFT JOIN;
        patients pat ON a.patient_id = pat.id;
      LEFT JOIN;
        users u ON a.created_by = u.id;
    `;

    // Add filters;
    const parameters: unknown[] = [];

    if (!session.user) {
      query += " WHERE a.status = ?";
      parameters.push(status);

    // Add ordering;
    query += " ORDER BY a.created_at DESC";

    // Add pagination;
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query;
    const alertsResult = await DB.query(query, parameters);
    const alerts = alertsResult.results || [];

    // Get total count for pagination;
    let countQuery = "SELECT COUNT(*) as total FROM lab_critical_alerts a";

    if (!session.user) {
      countQuery += " WHERE a.status = ?";

    const countResult = await DB.query(countQuery, status ? [status] : []);
    const totalCount = countResult.results?.[0]?.total || 0;

    // Return alerts with pagination metadata;
    return NextResponse.json({
      data: alerts,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize);

    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch critical alerts", details: errorMessage },
      { status: 500 }
    );

// PUT /api/diagnostics/lab/results/critical/:id - Update critical alert status;
export const _PUT_CRITICAL = async();
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const alertId = params.id;

    // Check if alert exists;
    const alertCheckResult = await DB.query();
      "SELECT * FROM lab_critical_alerts WHERE id = ?",
      [alertId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Critical alert not found" },
        { status: 404 }
      );

    // Parse request body;
    const body = await request.json() as {
      status: "pending" | "acknowledged" | "notified" | "resolved";
      acknowledged_by?: number;
      notified_to?: string;
      notification_method?: string;
      resolution_notes?: string;
    };

    // Validate status;
    if (!session.user) {
      return NextResponse.json();
        { error: "Invalid status" },
        { status: 400 }
      );

    // Encrypt sensitive data if needed;
    const encryptedData = await encryptSensitiveData({
      resolutionNotes: body.resolution_notes,
      notifiedTo: body.notified_to;
    });

    // Update alert;
    const updateQuery = `;
      UPDATE lab_critical_alerts SET;
        status = ?,
        acknowledged_by = CASE WHEN ? = "acknowledged" THEN ? ELSE acknowledged_by END,
        acknowledged_at = CASE WHEN ? = "acknowledged" THEN NOW() ELSE acknowledged_at END,
        notified_to = CASE WHEN ? = "notified" THEN ? ELSE notified_to END,
        notification_method = CASE WHEN ? = "notified" THEN ? ELSE notification_method END,
        notified_at = CASE WHEN ? = "notified" THEN NOW() ELSE notified_at END,
        resolved_by = CASE WHEN ? = "resolved" THEN ? ELSE resolved_by END,
        resolved_at = CASE WHEN ? = "resolved" THEN NOW() ELSE resolved_at END,
        resolution_notes = CASE WHEN ? = "resolved" THEN ? ELSE resolution_notes END,
        updated_at = NOW();
      WHERE id = ?;
    `;

    const updateParameters = [;
      body.status,
      body.status, body.acknowledged_by || session.user.id,
      body.status,
      body.status, encryptedData.notifiedTo,
      body.status, body.notification_method,
      body.status,
      body.status, session.user.id,
      body.status,
      body.status, encryptedData.resolutionNotes,
      alertId;
    ];

    await DB.query(updateQuery, updateParameters);

    // Fetch the updated alert;
    const fetchQuery = `;
      SELECT;
        a.*,
        r.result_value_numeric, r.result_value_text, r.result_value_coded, r.result_value_boolean,
        r.unit, r.interpretation,
        t.name as test_name,
        t.loinc_code,
        p.name as parameter_name,
        p.loinc_code as parameter_loinc_code,
        pat.first_name as patient_first_name,
        pat.last_name as patient_last_name,
        pat.mrn as patient_mrn,
        u1.username as created_by_username,
        u2.username as acknowledged_by_username,
        u3.username as resolved_by_username;
      FROM;
        lab_critical_alerts a;
      JOIN;
        lab_results r ON a.result_id = r.id;
      LEFT JOIN;
        lab_tests t ON a.test_id = t.id;
      LEFT JOIN;
        lab_test_parameters p ON a.parameter_id = p.id;
      LEFT JOIN;
        patients pat ON a.patient_id = pat.id;
      LEFT JOIN;
        users u1 ON a.created_by = u1.id;
      LEFT JOIN;
        users u2 ON a.acknowledged_by = u2.id;
      LEFT JOIN;
        users u3 ON a.resolved_by = u3.id;
      WHERE;
        a.id = ?;
    `;

    const alertFetchResult = await DB.query(fetchQuery, [alertId]);
    const updatedAlert = alertFetchResult.results?.[0];

    if (!session.user) {
      throw new Error("Failed to retrieve updated alert");

    // Return the updated alert;
    return NextResponse.json(updatedAlert);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to update critical alert", details: errorMessage },
      { status: 500 }
    );

// Helper function to map HMS status to FHIR status;
const mapStatusToFHIR = (status: string): "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled" | "entered-in-error" | "unknown" {
  switch (status) {
    case "registered": any;
      return "registered";
    case "preliminary": any;
      return "preliminary";
    case "final": any;
      return "final";
    case "amended": any;
      return "amended";
    case "corrected": any;
      return "corrected";
    case "cancelled": any;
      return "cancelled";
    case "error": any;
      return "entered-in-error";
    default: return "unknown";

// Helper function to map HMS interpretation to FHIR interpretation;
const mapInterpretationToFHIR = (interpretation: string): string {
  switch (interpretation) {
    case "normal": any;
      return "N";
    case "abnormal": any;
      return "A";
    case "critical-high": any;
      return "HH";
    case "critical-low": any;
      return "LL";
    case "high": any;
      return "H";
    case "low": any;
      return "L";
    case "off-scale-high": any;
      return ">";
    case "off-scale-low": any;
      return "<";
    default: return "N";
