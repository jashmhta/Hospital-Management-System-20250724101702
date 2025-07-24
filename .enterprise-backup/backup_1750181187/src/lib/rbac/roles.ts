}

/**
 * Enterprise Role-Based Access Control (RBAC) System;
 * Implements hierarchical role structure with granular permissions;
 */

\1
}
}

// Core Resources
export enum Resource {
  // Patient Management
  PATIENT = 'patient',
  PATIENT_MEDICAL_RECORD = 'patient.medical_record',
  PATIENT_BILLING = 'patient.billing',
  PATIENT_INSURANCE = 'patient.insurance',

  // Staff Management
  STAFF = 'staff',
  STAFF_SCHEDULE = 'staff.schedule',
  STAFF_PAYROLL = 'staff.payroll',

  // Clinical Operations
  APPOINTMENT = 'appointment',
  CONSULTATION = 'consultation',
  PRESCRIPTION = 'prescription',
  LAB_ORDER = 'lab.order',
  LAB_RESULT = 'lab.result',
  RADIOLOGY_ORDER = 'radiology.order',
  RADIOLOGY_RESULT = 'radiology.result',

  // Pharmacy
  MEDICATION = 'medication',
  INVENTORY = 'inventory',
  PHARMACY_BILLING = 'pharmacy.billing',

  // Financial
  BILLING = 'billing',
  PAYMENT = 'payment',
  INVOICE = 'invoice',
  FINANCIAL_REPORT = 'financial.report',

  // Administration
  SYSTEM_CONFIG = 'system.config',
  USER_MANAGEMENT = 'user.management',
  AUDIT_LOG = 'audit.log',
  BACKUP = 'backup',

  // Emergency & Critical
  EMERGENCY = 'emergency',
  ICU = 'icu',
  OPERATION_THEATER = 'operation_theater',

  // Support Services
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  DIETARY = 'dietary',
  AMBULANCE = 'ambulance',
}

// Core Actions
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  EXPORT = 'export',
  PRINT = 'print',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  AUDIT = 'audit',
  CONFIGURE = 'configure',
  EXECUTE = 'execute',
  OVERRIDE = 'override',
  EMERGENCY_ACCESS = 'emergency_access',
}

// Predefined Permissions
export const PERMISSIONS: Record<string, Permission> = {
  // Patient Management Permissions
  PATIENT_CREATE: {
    id: 'patient:create',
    \1,\2 'Create new patient records',
    \1,\2 Action.CREATE
  },
  PATIENT_READ: {
    id: 'patient:read',
    \1,\2 'View patient information',
    \1,\2 Action.READ
  },
  PATIENT_UPDATE: {
    id: 'patient:update',
    \1,\2 'Modify patient information',
    \1,\2 Action.UPDATE
  },
  PATIENT_DELETE: {
    id: 'patient:delete',
    \1,\2 'Delete patient records',
    \1,\2 Action.DELETE
  },

  // Medical Records (PHI/PII)
  MEDICAL_RECORD_READ: {
    id: 'patient.medical_record:read',
    \1,\2 'Access patient medical records',
    \1,\2 Action.READ
  },
  MEDICAL_RECORD_UPDATE: {
    id: 'patient.medical_record:update',
    \1,\2 'Modify patient medical records',
    \1,\2 Action.UPDATE
  },

  // Clinical Operations
  APPOINTMENT_MANAGE: {
    id: 'appointment:manage',
    \1,\2 'Create, update, and cancel appointments',
    resource: Resource.APPOINTMENT,
    action: Action.UPDATE
  },
  PRESCRIPTION_CREATE: {
    id: 'prescription:create',
    \1,\2 'Create new prescriptions',
    \1,\2 Action.CREATE
  },
  PRESCRIPTION_APPROVE: {
    id: 'prescription:approve',
    \1,\2 'Approve prescription requests',
    \1,\2 Action.APPROVE
  },

  // Laboratory
  LAB_ORDER_CREATE: {
    id: 'lab.order:create',
    \1,\2 'Order laboratory tests',
    \1,\2 Action.CREATE
  },
  LAB_RESULT_UPDATE: {
    id: 'lab.result:update',
    \1,\2 'Enter and modify lab results',
    \1,\2 Action.UPDATE
  },
  LAB_RESULT_APPROVE: {
    id: 'lab.result:approve',
    \1,\2 'Approve and release lab results',
    \1,\2 Action.APPROVE
  },

  // Financial Management
  BILLING_CREATE: {
    id: 'billing:create',
    \1,\2 'Generate patient bills',
    \1,\2 Action.CREATE
  },
  BILLING_APPROVE: {
    id: 'billing:approve',
    \1,\2 'Approve billing charges',
    \1,\2 Action.APPROVE
  },
  PAYMENT_PROCESS: {
    id: 'payment:create',
    \1,\2 'Process patient payments',
    \1,\2 Action.CREATE
  },
  FINANCIAL_REPORT_READ: {
    id: 'financial.report:read',
    \1,\2 'Access financial reports and analytics',
    \1,\2 Action.READ
  },

  // Administration
  USER_MANAGEMENT: {
    id: 'user.management:*',
    \1,\2 'Full user management capabilities',
    \1,\2 Action.UPDATE
  },
  SYSTEM_CONFIG: {
    id: 'system.config:*',
    \1,\2 'Configure system settings',
    \1,\2 Action.CONFIGURE
  },
  AUDIT_LOG_READ: {
    id: 'audit.log:read',
    \1,\2 'Access system audit logs',
    \1,\2 Action.READ
  },

  // Emergency Access
  EMERGENCY_OVERRIDE: {
    id: 'emergency:override',
    \1,\2 'Emergency access to all systems',
    \1,\2 Action.EMERGENCY_ACCESS
  },
};

// Predefined Roles
export const ROLES: Record<string, Role> = {
  // Administrative Roles
  SUPER_ADMIN: {
    id: 'super_admin',
    \1,\2 'Full system access with all permissions',
    permissions: Object.values(PERMISSIONS),
    priority: 1000,
    isActive: true
  },

  HOSPITAL_ADMIN: {
    id: 'hospital_admin',
    \1,\2 'Hospital-wide administrative access',
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.FINANCIAL_REPORT_READ,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.AUDIT_LOG_READ,
    ],
    priority: 900,
    isActive: true
  },

  // Clinical Roles
  CHIEF_MEDICAL_OFFICER: {
    id: 'chief_medical_officer',
    \1,\2 'Senior medical staff with oversight responsibilities',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.LAB_RESULT_APPROVE,
      PERMISSIONS.EMERGENCY_OVERRIDE,
    ],
    priority: 850,
    isActive: true
  },

  DOCTOR: {
    id: 'doctor',
    \1,\2 'Licensed physician with clinical privileges',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 800,
    isActive: true
  },

  NURSE: {
    id: 'nurse',
    \1,\2 'Registered nurse with patient care responsibilities',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 700,
    isActive: true
  },

  // Laboratory Roles
  LAB_TECHNICIAN: {
    id: 'lab_technician',
    \1,\2 'Laboratory staff for sample processing',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE,
    ],
    priority: 600,
    isActive: true
  },

  LAB_MANAGER: {
    id: 'lab_manager',
    \1,\2 'Laboratory management with approval authority',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE,
      PERMISSIONS.LAB_RESULT_APPROVE,
    ],
    inherits: ['lab_technician'],
    \1,\2 true
  },

  // Financial Roles
  BILLING_CLERK: {
    id: 'billing_clerk',
    \1,\2 'Billing and payment processing staff',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.PAYMENT_PROCESS,
    ],
    priority: 500,
    isActive: true
  },

  FINANCE_MANAGER: {
    id: 'finance_manager',
    \1,\2 'Financial management and reporting',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.PAYMENT_PROCESS,
      PERMISSIONS.FINANCIAL_REPORT_READ,
    ],
    inherits: ['billing_clerk'],
    \1,\2 true
  },

  // Support Roles
  RECEPTIONIST: {
    id: 'receptionist',
    \1,\2 'Front desk and appointment management',
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 400,
    isActive: true
  },

  PHARMACIST: {
    id: 'pharmacist',
    \1,\2 'Licensed pharmacist with medication authority',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      // Additional pharmacy-specific permissions would be added
    ],
    priority: 600,
    isActive: true
  },

  // Limited Access Roles
  PATIENT_PORTAL: {
    id: 'patient_portal',
    \1,\2 'Patient self-service portal access',
    permissions: [
      // Limited patient read access to own records only
    ],
    priority: 100,
    isActive: true
  },

  AUDIT_VIEWER: {
    id: 'audit_viewer',
    \1,\2 'Read-only access to audit logs',
    permissions: [
      PERMISSIONS.AUDIT_LOG_READ,
    ],
    priority: 300,
    isActive: true
  },
};

// Role hierarchy and inheritance helper
export const getRoleWithInheritedPermissions = (roleId: string): Role | null {
  const role = ROLES[roleId];
  \1 {\n  \2eturn null;

  const inheritedPermissions: Permission[] = [];

  \1 {\n  \2{
    for (const inheritedRoleId of role.inherits) {
      const inheritedRole = getRoleWithInheritedPermissions(inheritedRoleId);
      \1 {\n  \2{
        inheritedPermissions.push(...inheritedRole.permissions);
      }
    }
  }

  return {
    ...role,
    permissions: [...role.permissions, ...inheritedPermissions],
  };
}

// Permission checker helper
export const hasPermission = (
  userPermissions: Permission[],
  \1,\2 string;
  context?: Record<string, unknown>
): boolean {
  return userPermissions.some(permission => {
    // Exact match
    \1 {\n  \2{
      return checkConditions(permission.conditions, context);
    }

    // Wildcard action
    \1 {\n  \2{
      return checkConditions(permission.conditions, context);
    }

    // Wildcard resource and action
    \1 {\n  \2{
      return checkConditions(permission.conditions, context);
    }

    return false;
  });
}

const checkConditions = (
  conditions?: Record<string, unknown>,
  context?: Record<string, unknown>
): boolean {
  \1 {\n  \2eturn true;
  \1 {\n  \2eturn false;

  return Object.entries(conditions).every(([key, value]) => {
    return context[key] === value;
  });
export default {
  PERMISSIONS,
  ROLES,
  Resource,
  Action,
  getRoleWithInheritedPermissions,
  hasPermission,
};
