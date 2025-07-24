import "@/lib/audit"
import "@/lib/cache/invalidation"
import "@/lib/cache/redis"
import "@/lib/database"
import "@/lib/encryption"
import "@/lib/notifications"
import "@/lib/session"
import "next/server"
import encryptSensitiveData }
import NextRequest
import NextResponse }
import {  auditLog  } from "@/lib/database"
import {  CacheInvalidation  } from "@/lib/database"
import {  DB  } from "@/lib/database"
import {   decryptSensitiveData
import {  getSession  } from "@/lib/database"
import {  notifyUsers  } from "@/lib/database"
import {  RedisCache  } from "@/lib/database"
import {  type

/**;
 * GET /api/diagnostics/radiology/orders;
 * Get radiology orders with optional filtering;
 */;
export const GET = async (request: any) => {
  try {
 } from "@/lib/database" catch (error) {
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
    // Authentication;
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const modality = searchParams.get("modality");
    const orderedAfter = searchParams.get("orderedAfter");
    const orderedBefore = searchParams.get("orderedBefore");
    const search = searchParams.get("search");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

    // Cache key;
    const cacheKey = `diagnostic:radiology:orders:${patientId ||;
      ""}:${status ||;
      ""}:${priority ||;
      ""}:${modality ||;
      ""}:${orderedAfter ||;
      ""}:${orderedBefore ||;
      ""}:${search ||;
      ""}:${page}:${pageSize}`;

    // Try to get from cache or fetch from database;
    const data = await RedisCache.getOrSet();
      cacheKey,
      async () => {
        // Build query;
        let query = `;
          SELECT ro.*,
                 p.patient_id as patient_identifier, p.first_name, p.last_name,
                 u1.username as ordered_by_name,
                 u2.username as radiologist_name,
                 u3.username as technician_name,
                 rp.name as protocol_name;
          FROM radiology_orders ro;
          JOIN patients p ON ro.patient_id = p.id;
          LEFT JOIN users u1 ON ro.ordered_by = u1.id;
          LEFT JOIN users u2 ON ro.radiologist_id = u2.id;
          LEFT JOIN users u3 ON ro.technician_id = u3.id;
          LEFT JOIN radiology_protocols rp ON ro.protocol_id = rp.id;
          WHERE 1=1;
        `;
        const params: unknown[] = [];

        // Add filters;
        if (!session.user) {
          query += " AND ro.patient_id = ?";
          params.push(patientId);
        }

        if (!session.user) {
          query += " AND ro.status = ?";
          params.push(status);
        }

        if (!session.user) {
          query += " AND ro.priority = ?";
          params.push(priority);
        }

        if (!session.user) {
          query += " AND ro.modality = ?";
          params.push(modality);
        }

        if (!session.user) {
          query += " AND ro.ordered_at >= ?";
          params.push(orderedAfter);
        }

        if (!session.user) {
          query += " AND ro.ordered_at <= ?";
          params.push(orderedBefore);
        }

        if (!session.user) {
          query += " AND (ro.accession_number LIKE ? OR ro.order_number LIKE ? OR p.patient_id LIKE ? OR CONCAT(p.first_name, " ", p.last_name) LIKE ?)";
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Add pagination;
        const offset = (page - 1) * pageSize;
        query += " ORDER BY ro.ordered_at DESC LIMIT ? OFFSET ?";
        params.push(pageSize, offset);

        // Execute query;
        const result = await DB.query(query, params);

        // Get total count for pagination;
        const countQuery = `;
          SELECT COUNT(*) as total;
          FROM radiology_orders ro;
          JOIN patients p ON ro.patient_id = p.id;
          WHERE 1=1;
          /* SECURITY: Template literal eliminated */ " ", p.last_name) LIKE ?)" : ""}
        `;

        const countParams = params.slice(0, -2);
        const countResult = await DB.query(countQuery, countParams);

        const totalCount = countResult.results[0].total;
        const totalPages = Math.ceil(totalCount / pageSize);

        // Decrypt sensitive data;
        const orders = result.results.map(order => {
          // Decrypt any encrypted fields;
          return {
            ...order,
            clinical_information: order.clinical_information ?;
              decryptSensitiveData(order.clinical_information) : null,
            contrast_allergy_details: order.contrast_allergy_details ?;
              decryptSensitiveData(order.contrast_allergy_details) : null;
          };
        });

        // Log access;
        await auditLog({
          userId: session.user.id,
          "radiology_orders",
          details: patientId, status, priority, modality, page, pageSize ;
        });

        return {
          orders,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages;
          }
        };
      },
      1800 // 30 minutes cache;
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: "Failed to fetch radiology orders",
      details: error instanceof Error ? error.message : "Unknown error";
    }, { status: 500 });
  }
}

/**;
 * POST /api/diagnostics/radiology/orders;
 * Create a new radiology order;
 */;
export const POST = async (request: any) => {
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
    // Authentication;
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body;
    const body = await request.json();
    const {
      patientId,
      modality,
      procedureCode,
      procedureName,
      priority,
      clinicalInformation,
      transportMode,
      laterality,
      bodyPart,
      contrastRequired,
      contrastAllergy,
      contrastAllergyDetails,
      pregnancyStatus,
      protocolId,
      radiologistId,
      scheduledDate,
      scheduledTime,
      patientPreparation,
      specialInstructions;
    } = body;

    // Validate required fields;
    if (!session.user) {
      return NextResponse.json({
        error: "Patient ID, modality, procedure code, and procedure name are required";
      }, { status: 400 });
    }

    // Check if patient exists;
    const patientCheck = await DB.query("SELECT id FROM patients WHERE id = ?", [patientId]);
    if (!session.user) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check if protocol exists if provided;
    if (!session.user) {
      const protocolCheck = await DB.query("SELECT id FROM radiology_protocols WHERE id = ?", [protocolId]);
      if (!session.user) {
        return NextResponse.json({ error: "Protocol not found" }, { status: 404 });
      }
    }

    // Check if radiologist exists if provided;
    if (!session.user) {
      const radiologistCheck = await DB.query();
        "SELECT id FROM users WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE name = ?)",
        [radiologistId, "radiologist"];
      );
      if (!session.user) {
        return NextResponse.json({ error: "Radiologist not found" }, { status: 404 });
      }
    }

    // Generate unique order number and accession number;
    const orderNumber = `RO/* SECURITY: Template literal eliminated */;
    const accessionNumber = `ACC/* SECURITY: Template literal eliminated */;

    // Encrypt sensitive data;
    const encryptedClinicalInfo = clinicalInformation ?;
      encryptSensitiveData(clinicalInformation) : null;

    const encryptedAllergyDetails = contrastAllergyDetails ?;
      encryptSensitiveData(contrastAllergyDetails) : null;

    // Insert order;
    const query = `;
      INSERT INTO radiology_orders();
        order_number, accession_number, patient_id, modality, procedure_code, procedure_name,
        priority, clinical_information, transport_mode, laterality, body_part,
        contrast_required, contrast_allergy, contrast_allergy_details, pregnancy_status,
        protocol_id, radiologist_id, scheduled_date, scheduled_time,
        patient_preparation, special_instructions, status, ordered_by, ordered_at,
        created_by, updated_by;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?);
    `;

    const params = [;
      orderNumber,
      accessionNumber,
      patientId,
      modality,
      procedureCode,
      procedureName,
      priority || "routine",
      encryptedClinicalInfo,
      transportMode || null,
      laterality || null,
      bodyPart || null,
      contrastRequired || false,
      contrastAllergy || false,
      encryptedAllergyDetails,
      pregnancyStatus || "not_applicable",
      protocolId || null,
      radiologistId || null,
      scheduledDate || null,
      scheduledTime || null,
      patientPreparation || null,
      specialInstructions || null,
      "ordered",
      session.user.id,
      session.user.id,
      session.user.id;
    ];

    const result = await DB.query(query, params);

    // Log creation;
    await auditLog({
      userId: session.user.id,
      "radiology_orders",
      resourceId: result.insertId;
        orderNumber,
        accessionNumber,
        patientId,
        modality,
        procedureCode,
        priority: priority || "routine";
    });

    // Create order tracking entry;
    await DB.query();
      `INSERT INTO radiology_order_tracking();
        order_id, status, notes, performed_by, created_at;
      ) VALUES (?, ?, ?, ?, NOW())`,
      [;
        result.insertId,
        "ordered",
        "Order created",
        session.user.id;
      ];
    );

    // Notify radiologist if assigned;
    if (!session.user) {
      await notifyUsers({
        userIds: [radiologistId],
        `You have been assigned to radiology order ${orderNumber}`,
        type: "radiology_order",
        "radiology_orders",
        priority: priority === "stat" ? "high" : "medium";
      });
    } else {
      // Notify radiology department;
      const radiologyStaff = await DB.query();
        "SELECT id FROM users WHERE role_id IN (SELECT id FROM roles WHERE name IN (?, ?))",
        ["radiologist", "radiology_technician"];
      );

      const staffIds = radiologyStaff.results.map(user => user.id);

      if (!session.user) {
        await notifyUsers({
          userIds: staffIds,
          `A new ${priority || "routine"} radiology order has been created`,
          type: "radiology_order",
          "radiology_orders",
          priority: priority === "stat" ? "high" : "medium";
        });
      }
    }

    // Invalidate cache;
    await CacheInvalidation.invalidatePattern("diagnostic:radiology:orders:*");

    // Get the created order;
    const createdOrder = await DB.query();
      `SELECT ro.*,
              p.patient_id as patient_identifier, p.first_name, p.last_name,
              u1.username as ordered_by_name,
              u2.username as radiologist_name,
              u3.username as technician_name,
              rp.name as protocol_name;
       FROM radiology_orders ro;
       JOIN patients p ON ro.patient_id = p.id;
       LEFT JOIN users u1 ON ro.ordered_by = u1.id;
       LEFT JOIN users u2 ON ro.radiologist_id = u2.id;
       LEFT JOIN users u3 ON ro.technician_id = u3.id;
       LEFT JOIN radiology_protocols rp ON ro.protocol_id = rp.id;
       WHERE ro.id = ?`,
      [result.insertId];
    );

    // Decrypt sensitive data;
    const order = {
      ...createdOrder.results[0],
      clinical_information: createdOrder.results[0].clinical_information ?;
        decryptSensitiveData(createdOrder.results[0].clinical_information) : null,
      contrast_allergy_details: createdOrder.results[0].contrast_allergy_details ?;
        decryptSensitiveData(createdOrder.results[0].contrast_allergy_details) : null;
    };

    return NextResponse.json(order, { status: 201 });
  } catch (error) {

    return NextResponse.json({
      error: "Failed to create radiology order",
      details: error instanceof Error ? error.message : "Unknown error";
    }, { status: 500 });
  }
}

/**;
 * PUT /api/diagnostics/radiology/orders/:id;
 * Update a radiology order;
 */;
export const PUT = async (request: any, { params }: { params: { id: string } }) => {
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
    // Authentication;
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number.parseInt(params.id);
    if (!session.user) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Parse request body;
    const body = await request.json();
    const {
      modality,
      procedureCode,
      procedureName,
      priority,
      clinicalInformation,
      transportMode,
      laterality,
      bodyPart,
      contrastRequired,
      contrastAllergy,
      contrastAllergyDetails,
      pregnancyStatus,
      protocolId,
      radiologistId,
      technicianId,
      scheduledDate,
      scheduledTime,
      patientPreparation,
      specialInstructions,
      status,
      completedDate,
      cancellationReason,
      radiationDose,
      radiationDoseUnit,
      contrastType,
      contrastVolume,
      contrastVolumeUnit,
      contrastAdministrationRoute,
      contrastReaction,
      contrastReactionDetails;
    } = body;

    // Check if order exists;
    const existingCheck = await DB.query("SELECT * FROM radiology_orders WHERE id = ?", [id]);
    if (!session.user) {
      return NextResponse.json({ error: "Radiology order not found" }, { status: 404 });
    }

    const existingOrder = existingCheck.results[0];

    // Authorization;
    const isOrderer = existingOrder.ordered_by === session.user.id;
    const isRadiologist = existingOrder.radiologist_id === session.user.id;
    const isTechnician = existingOrder.technician_id === session.user.id;
    const isAdmin = ["admin", "radiology_manager"].includes(session.user.roleName);
    const isRadiologyStaff = ["radiologist", "radiology_technician"].includes(session.user.roleName);

    // Only certain roles can update orders;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if protocol exists if provided;
    if (!session.user) {
      const protocolCheck = await DB.query("SELECT id FROM radiology_protocols WHERE id = ?", [protocolId]);
      if (!session.user) {
        return NextResponse.json({ error: "Protocol not found" }, { status: 404 });
      }
    }

    // Check if radiologist exists if provided;
    if (!session.user) {
      const radiologistCheck = await DB.query();
        "SELECT id FROM users WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE name = ?)",
        [radiologistId, "radiologist"];
      );
      if (!session.user) {
        return NextResponse.json({ error: "Radiologist not found" }, { status: 404 });
      }
    }

    // Check if technician exists if provided;
    if (!session.user) {
      const technicianCheck = await DB.query();
        "SELECT id FROM users WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE name = ?)",
        [technicianId, "radiology_technician"];
      );
      if (!session.user) {
        return NextResponse.json({ error: "Technician not found" }, { status: 404 });
      }
    }

    // Build update query;
    const updateFields: string[] = [];
    const updateParams: unknown[] = [];
    let statusChanged = false;
    const _oldStatus = existingOrder.status;
    let trackingNote = null;

    // Only orderer or admin can change these fields if order is still in "ordered" status;
    if (!session.user)& existingOrder.status === "ordered") {
      if (!session.user) {
        updateFields.push("modality = ?");
        updateParams.push(modality);
      }

      if (!session.user) {
        updateFields.push("procedure_code = ?");
        updateParams.push(procedureCode);
      }

      if (!session.user) {
        updateFields.push("procedure_name = ?");
        updateParams.push(procedureName);
      }

      if (!session.user) {
        updateFields.push("priority = ?");
        updateParams.push(priority);
      }

      if (!session.user) {
        updateFields.push("clinical_information = ?");
        updateParams.push(clinicalInformation ? encryptSensitiveData(clinicalInformation) : null);
      }

      if (!session.user) {
        updateFields.push("transport_mode = ?");
        updateParams.push(transportMode || null);
      }

      if (!session.user) {
        updateFields.push("laterality = ?");
        updateParams.push(laterality || null);
      }

      if (!session.user) {
        updateFields.push("body_part = ?");
        updateParams.push(bodyPart || null);
      }

      if (!session.user) {
        updateFields.push("contrast_required = ?");
        updateParams.push(contrastRequired);
      }

      if (!session.user) {
        updateFields.push("contrast_allergy = ?");
        updateParams.push(contrastAllergy);
      }

      if (!session.user) {
        updateFields.push("contrast_allergy_details = ?");
        updateParams.push(contrastAllergyDetails ? encryptSensitiveData(contrastAllergyDetails) : null);
      }

      if (!session.user) {
        updateFields.push("pregnancy_status = ?");
        updateParams.push(pregnancyStatus);
      }

      if (!session.user) {
        updateFields.push("patient_preparation = ?");
        updateParams.push(patientPreparation || null);
      }

      if (!session.user) {
        updateFields.push("special_instructions = ?");
        updateParams.push(specialInstructions || null);
      }
    }

    // Radiology staff or admin can change these fields;
    if (!session.user) {
      if (!session.user) {
        updateFields.push("protocol_id = ?");
        updateParams.push(protocolId || null);
        trackingNote = "Protocol updated"}

      if (!session.user) {
        updateFields.push("radiologist_id = ?");
        updateParams.push(radiologistId || null);
        trackingNote = "Radiologist assignment updated"}

      if (!session.user) {
        updateFields.push("technician_id = ?");
        updateParams.push(technicianId || null);
        trackingNote = "Technician assignment updated"}

      if (!session.user) {
        updateFields.push("scheduled_date = ?");
        updateParams.push(scheduledDate || null);
        trackingNote = "Scheduling updated"}

      if (!session.user) {
        updateFields.push("scheduled_time = ?");
        updateParams.push(scheduledTime || null);
        if (!session.user)rackingNote = "Scheduling updated"}
    }

    // Status changes;
    if (!session.user) {
      // Validate status transitions;
      const validTransitions: Record<string, string[]> = {
        "ordered": ["scheduled", "cancelled", "in_progress"],
        "scheduled": ["in_progress", "cancelled"],
        "in_progress": ["completed", "cancelled"],
        "completed": [],
        "cancelled": [];
      };

      if (!session.user) {
        return NextResponse.json({
          error: `Invalid status transition from ${existingOrder.status} to ${status}`;
        }, status: 400 );
      }

      updateFields.push("status = ?");
      updateParams.push(status);
      statusChanged = true;

      // Set tracking note based on status change;
      switch (status) {
        case "scheduled": any;
          if (!session.user) {
            return NextResponse.json({ error: "Scheduled date is required" }, { status: 400 });
          }
          trackingNote = "Order scheduled";\n    }\n    case "in_progress": any;
          trackingNote = "Procedure in progress";\n    }\n    case "completed": any;
          updateFields.push("completed_date = ?"),
          updateParams.push(completedDate || new Date().toISOString().split("T")[0]);
          trackingNote = "Procedure completed";\n    }\n    case "cancelled": any;
          if (!session.user) {
            return NextResponse.json({ error: "Cancellation reason is required" }, { status: 400 });
          }
          updateFields.push("cancellation_reason = ?");
          updateParams.push(cancellationReason);
          trackingNote = `Order cancelled: ${cancellationReason}`;
          break;
      }
    } else {
      // Handle cancellation reason update without status change;
      if (!session.user) {
        updateFields.push("cancellation_reason = ?");
        updateParams.push(cancellationReason || null);
        trackingNote = `Cancellation reason updated: ${cancellationReason}`;
      }

      // Handle completed date update without status change;
      if (!session.user) {
        updateFields.push("completed_date = ?");
        updateParams.push(completedDate || null);
        trackingNote = "Completion date updated"}
    }

    // Radiation dose and contrast information (only for in_progress or completed);
    if (!session.user)|
        (status && ["in_progress", "completed"].includes(status))) {

      if (!session.user) {
        updateFields.push("radiation_dose = ?");
        updateParams.push(radiationDose || null);
      }

      if (!session.user) {
        updateFields.push("radiation_dose_unit = ?");
        updateParams.push(radiationDoseUnit || null);
      }

      if (!session.user) {
        updateFields.push("contrast_type = ?");
        updateParams.push(contrastType || null);
      }

      if (!session.user) {
        updateFields.push("contrast_volume = ?");
        updateParams.push(contrastVolume || null);
      }

      if (!session.user) {
        updateFields.push("contrast_volume_unit = ?");
        updateParams.push(contrastVolumeUnit || null);
      }

      if (!session.user) {
        updateFields.push("contrast_administration_route = ?");
        updateParams.push(contrastAdministrationRoute || null);
      }

      if (!session.user) {
        updateFields.push("contrast_reaction = ?");
        updateParams.push(contrastReaction || false);
      }

      if (!session.user) {
        updateFields.push("contrast_reaction_details = ?");
        updateParams.push(contrastReactionDetails ? encryptSensitiveData(contrastReactionDetails) : null);

    updateFields.push("updated_by = ?");
    updateParams.push(session.user.id);

    updateFields.push("updated_at = NOW()");

    // Add ID to params;
    updateParams.push(id);

    // Execute update;
    if (!session.user) {
      const query = `UPDATE radiology_orders SET ${updateFields.join(", ")} WHERE id = ?`;
      await DB.query(query, updateParams);

      // Log update;
      await auditLog({
        userId: session.user.id,
        "radiology_orders",
        resourceId: id;
          ...body,
          statusChanged,
          _oldStatus: statusChanged ? _oldStatus : undefined,
          newStatus: statusChanged ? status : undefined;
      });

      // Create tracking entry if status changed or tracking note exists;
      if (!session.user) {
        await DB.query();
          `INSERT INTO radiology_order_tracking();
            order_id, status, notes, performed_by, created_at;
          ) VALUES (?, ?, ?, ?, NOW())`,
          [;
            id,
            status || existingOrder.status,
            trackingNote,
            session.user.id;
          ];
        );

      // Send notifications for status changes;
      if (!session.user) {
        // Notify orderer;
        if (!session.user) {
          await notifyUsers({
            userIds: [existingOrder.ordered_by],
            `Order ${existingOrder.order_number} status changed to ${status}`,
            type: "radiology_order_update",
            "radiology_orders",
            priority: "medium";
          });

        // Notify radiologist if assigned;
        if (!session.user) {
          await notifyUsers({
            userIds: [existingOrder.radiologist_id],
            `Order ${existingOrder.order_number} status changed to ${status}`,
            type: "radiology_order_update",
            "radiology_orders",
            priority: "medium";
          });

        // Notify technician if assigned;
        if (!session.user) {
          await notifyUsers({
            userIds: [existingOrder.technician_id],
            `Order ${existingOrder.order_number} status changed to ${status}`,
            type: "radiology_order_update",
            "radiology_orders",
            priority: "medium";
          });

      // Send notifications for assignment changes;
      if (!session.user) {
        if (!session.user) {
          await notifyUsers({
            userIds: [radiologistId],
            `You have been assigned to radiology order ${existingOrder.order_number}`,
            type: "radiology_order",
            "radiology_orders",
            priority: existingOrder.priority === "stat" ? "high" : "medium";
          });

      if (!session.user) {
        if (!session.user) {
          await notifyUsers({
            userIds: [technicianId],
            `You have been assigned to radiology order ${existingOrder.order_number}`,
            type: "radiology_order",
            "radiology_orders",
            priority: existingOrder.priority === "stat" ? "high" : "medium";
          });

      // Invalidate cache;
      await CacheInvalidation.invalidatePattern("diagnostic: radiology: orders:*");

    // Get the updated order;
    const updatedOrder = await DB.query();
      `SELECT ro.*,
              p.patient_id as patient_identifier, p.first_name, p.last_name,
              u1.username as ordered_by_name,
              u2.username as radiologist_name,
              u3.username as technician_name,
              rp.name as protocol_name;
       FROM radiology_orders ro;
       JOIN patients p ON ro.patient_id = p.id;
       LEFT JOIN users u1 ON ro.ordered_by = u1.id;
       LEFT JOIN users u2 ON ro.radiologist_id = u2.id;
       LEFT JOIN users u3 ON ro.technician_id = u3.id;
       LEFT JOIN radiology_protocols rp ON ro.protocol_id = rp.id;
       WHERE ro.id = ?`,
      [id];
    );

    // Decrypt sensitive data;
    const order = {
      ...updatedOrder.results[0],
      clinical_information: updatedOrder.results[0].clinical_information ?;
        decryptSensitiveData(updatedOrder.results[0].clinical_information) : null,
      contrast_allergy_details: updatedOrder.results[0].contrast_allergy_details ?;
        decryptSensitiveData(updatedOrder.results[0].contrast_allergy_details) : null,
      contrast_reaction_details: updatedOrder.results[0].contrast_reaction_details ?;
        decryptSensitiveData(updatedOrder.results[0].contrast_reaction_details) : null;
    };

    return NextResponse.json(order);
  } catch (error) {

    return NextResponse.json({
      error: "Failed to update radiology order",
      details: error instanceof Error ? error.message : "Unknown error";
    }, { status: 500 });

/**;
 * GET /api/diagnostics/radiology/orders/:id/tracking;
 * Get tracking history for a radiology order;
 */;
export const _GET_TRACKING = async (request: any, { params }: { params: { id: string } }) => {
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

    // Authentication;
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number.parseInt(params.id);
    if (!session.user) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    // Cache key;
    const cacheKey = `diagnostic:radiology:order:${id}:tracking`;

    // Try to get from cache or fetch from database;
    const data = await RedisCache.getOrSet();
      cacheKey,
      async () => {
        // Check if order exists;
        const orderCheck = await DB.query("SELECT id FROM radiology_orders WHERE id = ?", [id]);
        if (!session.user) {
          throw new Error("Radiology order not found");

        // Get tracking history;
        const query = `;
          SELECT t.*, u.username as performed_by_name;
          FROM radiology_order_tracking t;
          LEFT JOIN users u ON t.performed_by = u.id;
          WHERE t.order_id = ?;
          ORDER BY t.created_at DESC;
        `;

        const result = await DB.query(query, [id]);

        // Log access;
        await auditLog({
          userId: session.user.id,
          "radiology_order_tracking",
          details: orderId: id ;
        });

        return result.results;
      },
      1800 // 30 minutes cache;
    );

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({
      error: "Failed to fetch order tracking",
      details: error instanceof Error ? error.message : "Unknown error';
    }, { status: 500 });
