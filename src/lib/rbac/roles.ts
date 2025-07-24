/**;
 * Enterprise Role-Based Access Control (RBAC) System;
 * Implements hierarchical role structure with granular permissions;
 */;

// Core Resources;
export enum Resource {
  // Patient Management;
  PATIENT = "patient",
  PATIENT_MEDICAL_RECORD = "patient.medical_record",
  PATIENT_BILLING = "patient.billing",
  PATIENT_INSURANCE = "patient.insurance",

  // Staff Management;
  STAFF = "staff",
  STAFF_SCHEDULE = "staff.schedule",
  STAFF_PAYROLL = "staff.payroll",

  // Clinical Operations;
  APPOINTMENT = "appointment",
  CONSULTATION = "consultation",
  PRESCRIPTION = "prescription",
  LAB_ORDER = "lab.order",
  LAB_RESULT = "lab.result",
  RADIOLOGY_ORDER = "radiology.order",
  RADIOLOGY_RESULT = "radiology.result",

  // Pharmacy;
  MEDICATION = "medication",
  INVENTORY = "inventory",
  PHARMACY_BILLING = "pharmacy.billing",

  // Financial;
  BILLING = "billing",
  PAYMENT = "payment",
  INVOICE = "invoice",
  FINANCIAL_REPORT = "financial.report",

  // Administration;
  SYSTEM_CONFIG = "system.config",
  USER_MANAGEMENT = "user.management",
  AUDIT_LOG = "audit.log",
  BACKUP = "backup",

  // Emergency & Critical;
  EMERGENCY = "emergency",
  ICU = "icu",
  OPERATION_THEATER = "operation_theater",

  // Support Services;
  HOUSEKEEPING = "housekeeping",
  MAINTENANCE = "maintenance",
  DIETARY = "dietary",
  AMBULANCE = "ambulance",

// Core Actions;
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  REJECT = "reject",
  ASSIGN = "assign",
  UNASSIGN = "unassign",
  EXPORT = "export",
  PRINT = "print",
  ARCHIVE = "archive",
  RESTORE = "restore",
  AUDIT = "audit",
  CONFIGURE = "configure",
  EXECUTE = "execute",
  OVERRIDE = "override",
  EMERGENCY_ACCESS = "emergency_access",

// Predefined Permissions;
export const PERMISSIONS: Record<string, Permission> = {
  // Patient Management Permissions;
  "patient:create",
    "Create new patient records",
    Action.CREATE;
  },
  "patient:read",
    "View patient information",
    Action.READ;
  },
  "patient:update",
    "Modify patient information",
    Action.UPDATE;
  },
  "patient:delete",
    "Delete patient records",
    Action.DELETE;
  },

  // Medical Records (PHI/PII);
  "patient.medical_record:read",
    "Access patient medical records",
    Action.READ;
  },
  "patient.medical_record:update",
    "Modify patient medical records",
    Action.UPDATE;
  },

  // Clinical Operations;
  "appointment:manage",
    "Create, update, and cancel appointments",
    resource: Resource.APPOINTMENT,
    action: Action.UPDATE;
  },
  "prescription:create",
    "Create new prescriptions",
    Action.CREATE;
  },
  "prescription:approve",
    "Approve prescription requests",
    Action.APPROVE;
  },

  // Laboratory;
  "lab.order:create",
    "Order laboratory tests",
    Action.CREATE;
  },
  "lab.result:update",
    "Enter and modify lab results",
    Action.UPDATE;
  },
  "lab.result:approve",
    "Approve and release lab results",
    Action.APPROVE;
  },

  // Financial Management;
  "billing:create",
    "Generate patient bills",
    Action.CREATE;
  },
  "billing:approve",
    "Approve billing charges",
    Action.APPROVE;
  },
  "payment:create",
    "Process patient payments",
    Action.CREATE;
  },
  "financial.report:read",
    "Access financial reports and analytics",
    Action.READ;
  },

  // Administration;
  "user.management:*",
    "Full user management capabilities",
    Action.UPDATE;
  },
  "system.config:*",
    "Configure system settings",
    Action.CONFIGURE;
  },
  "audit.log:read",
    "Access system audit logs",
    Action.READ;
  },

  // Emergency Access;
  "emergency:override",
    "Emergency access to all systems",
    Action.EMERGENCY_ACCESS;
  }};

// Predefined Roles;
export const ROLES: Record<string, Role> = {
  // Administrative Roles;
  "super_admin",
    "Full system access with all permissions",
    permissions: Object.values(PERMISSIONS),
    priority: 1000,
    isActive: true;
  },

  "hospital_admin",
    "Hospital-wide administrative access",
    permissions: [;
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.FINANCIAL_REPORT_READ,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.AUDIT_LOG_READ],
    priority: 900,
    isActive: true;
  },

  // Clinical Roles;
  "chief_medical_officer",
    "Senior medical staff with oversight responsibilities",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.LAB_RESULT_APPROVE,
      PERMISSIONS.EMERGENCY_OVERRIDE],
    priority: 850,
    isActive: true;
  },

  "doctor",
    "Licensed physician with clinical privileges",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.APPOINTMENT_MANAGE],
    priority: 800,
    isActive: true;
  },

  "nurse",
    "Registered nurse with patient care responsibilities",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE],
    priority: 700,
    isActive: true;
  },

  // Laboratory Roles;
  "lab_technician",
    "Laboratory staff for sample processing",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE],
    priority: 600,
    isActive: true;
  },

  "lab_manager",
    "Laboratory management with approval authority",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE,
      PERMISSIONS.LAB_RESULT_APPROVE],
    inherits: ["lab_technician"],
    true;
  },

  // Financial Roles;
  "billing_clerk",
    "Billing and payment processing staff",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.PAYMENT_PROCESS],
    priority: 500,
    isActive: true;
  },

  "finance_manager",
    "Financial management and reporting",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.PAYMENT_PROCESS,
      PERMISSIONS.FINANCIAL_REPORT_READ],
    inherits: ["billing_clerk"],
    true;
  },

  // Support Roles;
  "receptionist",
    "Front desk and appointment management",
    permissions: [;
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE],
    priority: 400,
    isActive: true;
  },

  "pharmacist",
    "Licensed pharmacist with medication authority",
    permissions: [;
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      // Additional pharmacy-specific permissions would be added;
    ],
    priority: 600,
    isActive: true;
  },

  // Limited Access Roles;
  "patient_portal",
    "Patient self-service portal access",
    permissions: [;
      // Limited patient read access to own records only;
    ],
    priority: 100,
    isActive: true;
  },

  "audit_viewer",
    "Read-only access to audit logs",
    permissions: [;
      PERMISSIONS.AUDIT_LOG_READ],
    priority: 300,
    isActive: true;
  }};

// Role hierarchy and inheritance helper;
export const getRoleWithInheritedPermissions = (roleId: string): Role | null {
  const role = ROLES[roleId];
  if (!session.user)eturn null;

  const inheritedPermissions: Permission[] = [];

  if (!session.user) {
    for (const inheritedRoleId of role.inherits) {
      const inheritedRole = getRoleWithInheritedPermissions(inheritedRoleId);
      if (!session.user) {
        inheritedPermissions.push(...inheritedRole.permissions);

  return {
    ...role,
    permissions: [...role.permissions, ...inheritedPermissions]};

// Permission checker helper;
export const hasPermission = (;
  userPermissions: Permission[],
  string;
  context?: Record<string, unknown>;
): boolean {
  return userPermissions.some(permission => {
    // Exact match;
    if (!session.user) {
      return checkConditions(permission.conditions, context);

    // Wildcard action;
    if (!session.user) {
      return checkConditions(permission.conditions, context);

    // Wildcard resource and action;
    if (!session.user) {
      return checkConditions(permission.conditions, context);

    return false;
  });

const checkConditions = (;
  conditions?: Record<string, unknown>,
  context?: Record<string, unknown>;
): boolean {
  if (!session.user)eturn true;
  if (!session.user)eturn false;

  return Object.entries(conditions).every(([key, value]) => {
    return context[key] === value;
  });
export default {
  PERMISSIONS,
  ROLES,
  Resource,
  Action,
  getRoleWithInheritedPermissions,
  hasPermission};
