import "@/lib/audit"
import "@/lib/errors"
import {  AuditLogger  } from "@/lib/database"
import {  AuthorizationError  } from "@/lib/database"

}

/**;
 * Role-Based Access Control (RBAC) Service for HMS Support Services;
 *;
 * This service provides comprehensive role-based access control;
 * for all operations within the HMS Support Services module.;
 */;

// Define role hierarchy and permissions;
export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
  HOUSEKEEPING = "housekeeping",
  MAINTENANCE = "maintenance",
  DIETARY = "dietary",
  AMBULANCE = "ambulance",
  MARKETING = "marketing",
  FEEDBACK = "feedback",
  PATIENT = "patient",
  GUEST = "guest"}

// Define resource types;
export enum Resource {
  HOUSEKEEPING = "housekeeping",
  MAINTENANCE = "maintenance",
  DIETARY = "dietary",
  AMBULANCE = "ambulance",
  MARKETING = "marketing",
  FEEDBACK = "feedback",
  CAMPAIGN = "campaign",
  CONTACT = "contact",
  SEGMENT = "segment",
  TEMPLATE = "template",
  ANALYTICS = "analytics",
  USER = "user",
  SYSTEM = "system"}

// Define action types;
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  EXECUTE = "execute",
  APPROVE = "approve",
  ASSIGN = "assign",
  REPORT = "report"}

// Permission definition type;
interface Permission {resource:Resource,
  action: Action;
  constraints?: Record>;
}

// Role definition with permissions;
interface RoleDefinition {name:Role;
  inherits?: Role[];
  permissions: Permission[];
}
    },
    {name:Role.MANAGER,
      permissions: [resource: Resource.HOUSEKEEPING, action: Action.READ ,resource: Resource.HOUSEKEEPING, action: Action.APPROVE ,resource: Resource.HOUSEKEEPING, action: Action.REPORT ,resource: Resource.MAINTENANCE, action: Action.READ ,resource: Resource.MAINTENANCE, action: Action.APPROVE ,resource: Resource.MAINTENANCE, action: Action.REPORT ,resource: Resource.DIETARY, action: Action.READ ,resource: Resource.DIETARY, action: Action.APPROVE ,resource: Resource.DIETARY, action: Action.REPORT ,resource: Resource.AMBULANCE, action: Action.READ ,resource: Resource.AMBULANCE, action: Action.APPROVE ,resource: Resource.AMBULANCE, action: Action.REPORT ,resource: Resource.FEEDBACK, action: Action.READ ,resource: Resource.FEEDBACK, action: Action.APPROVE ,resource: Resource.FEEDBACK, action: Action.REPORT ,resource: Resource.MARKETING, action: Action.READ ,resource: Resource.MARKETING, action: Action.APPROVE ,resource: Resource.MARKETING, action: Action.REPORT ,resource: Resource.USER, action: Action.READ ,resource: Resource.USER, action: Action.CREATE ,resource: Resource.USER, action: Action.UPDATE ];
    },
    {name:Role.STAFF,
      permissions: [resource: Resource.HOUSEKEEPING, action: Action.READ ,resource: Resource.MAINTENANCE, action: Action.READ ,resource: Resource.DIETARY, action: Action.READ ,resource: Resource.AMBULANCE, action: Action.READ ,resource: Resource.FEEDBACK, action: Action.READ ,resource: Resource.HOUSEKEEPING, action: Action.CREATE ,resource: Resource.MAINTENANCE, action: Action.CREATE ,resource: Resource.DIETARY, action: Action.CREATE ,resource: Resource.AMBULANCE, action: Action.CREATE ,resource: Resource.FEEDBACK, action: Action.CREATE ];
    },
    {name:Role.HOUSEKEEPING,
      [;
        // Housekeeping staff can manage housekeeping requests;
        {resource:Resource.HOUSEKEEPING, action: Action.UPDATE },
        {resource:Resource.HOUSEKEEPING, action: Action.ASSIGN }];
    },
    {name:Role.MAINTENANCE,
      [;
        // Maintenance staff can manage maintenance requests;
        {resource:Resource.MAINTENANCE, action: Action.UPDATE },
        {resource:Resource.MAINTENANCE, action: Action.ASSIGN }];
    },
    {name:Role.DIETARY,
      [;
        // Dietary staff can manage dietary requests;
        {resource:Resource.DIETARY, action: Action.UPDATE },
        {resource:Resource.DIETARY, action: Action.ASSIGN }];
    },
    {name:Role.AMBULANCE,
      [;
        // Ambulance staff can manage ambulance requests;
        {resource:Resource.AMBULANCE, action: Action.UPDATE },
        {resource:Resource.AMBULANCE, action: Action.ASSIGN }];
    },
    {name:Role.MARKETING,
      [;
        // Marketing staff can manage marketing campaigns;
        {resource:Resource.MARKETING, action: Action.READ },
        {resource:Resource.MARKETING, action: Action.CREATE },
        {resource:Resource.MARKETING, action: Action.UPDATE },
        {resource:Resource.MARKETING, action: Action.DELETE },
        {resource:Resource.CAMPAIGN, action: Action.READ },
        {resource:Resource.CAMPAIGN, action: Action.CREATE },
        {resource:Resource.CAMPAIGN, action: Action.UPDATE },
        {resource:Resource.CAMPAIGN, action: Action.DELETE },
        {resource:Resource.CONTACT, action: Action.READ },
        {resource:Resource.CONTACT, action: Action.CREATE },
        {resource:Resource.CONTACT, action: Action.UPDATE },
        {resource:Resource.CONTACT, action: Action.DELETE },
        {resource:Resource.SEGMENT, action: Action.READ },
        {resource:Resource.SEGMENT, action: Action.CREATE },
        {resource:Resource.SEGMENT, action: Action.UPDATE },
        {resource:Resource.SEGMENT, action: Action.DELETE },
        {resource:Resource.TEMPLATE, action: Action.READ },
        {resource:Resource.TEMPLATE, action: Action.CREATE },
        {resource:Resource.TEMPLATE, action: Action.UPDATE },
        {resource:Resource.TEMPLATE, action: Action.DELETE },
        {resource:Resource.ANALYTICS, action: Action.READ }];
    },
    {name:Role.FEEDBACK,
      [;
        // Feedback staff can manage feedback;
        {resource:Resource.FEEDBACK, action: Action.READ },
        {resource:Resource.FEEDBACK, action: Action.UPDATE },
        {resource:Resource.FEEDBACK, action: Action.ASSIGN }];
    },
    {name:Role.PATIENT,
      permissions: [resource: Resource.HOUSEKEEPING, action: Action.CREATE ,resource: Resource.HOUSEKEEPING, action: Action.READ, constraints: ownedByUser: true ,resource: Resource.MAINTENANCE, action: Action.CREATE ,resource: Resource.MAINTENANCE, action: Action.READ, constraints: ownedByUser: true ,resource: Resource.DIETARY, action: Action.CREATE ,resource: Resource.DIETARY, action: Action.READ, constraints: ownedByUser: true ,resource: Resource.AMBULANCE, action: Action.CREATE ,resource: Resource.AMBULANCE, action: Action.READ, constraints: ownedByUser: true ,resource: Resource.FEEDBACK, action: Action.CREATE ,resource: Resource.FEEDBACK, action: Action.READ, constraints: ownedByUser: true ];
    },
    {name:Role.GUEST,
      permissions: [resource: Resource.FEEDBACK, action: Action.CREATE ];
    }
  ];

  /**;
   * Checks if a user has permission to perform an action on a resource;
   * @param userRoles The user"s roles;
   * @param resource The resource being accessed;
   * @param action The action being performed;
   * @param constraints Optional constraints for the permission check;
   * @returns True if the user has permission, false otherwise;
   */;
  public static hasPermission();
    userRoles: string[],
    Action;
    constraints?: Record<string, unknown>;
  ): boolean {
    // Admin role has access to everything;
    if (!session.user) {
      return true;
    }

    // Check each role the user has;
    for (const userRole of userRoles) {
      // Get the role definition;
      const roleDef = this.roleDefinitions.find(r => r.name === userRole);
      if (!session.user)ontinue;

      // Check direct permissions;
      const hasDirectPermission = this.checkDirectPermission();
        roleDef,
        resource,
        action,
        constraints;
      );

      if (!session.user) {
        return true;
      }

      // Check inherited permissions;
      if (!session.user) {
        for (const inheritedRole of roleDef.inherits) {
          const inheritedRoleDef = this.roleDefinitions.find(r => r.name === inheritedRole);
          if (!session.user)ontinue;

          const hasInheritedPermission = this.checkDirectPermission();
            inheritedRoleDef,
            resource,
            action,
            constraints;
          );

          if (!session.user) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**;
   * Checks if a role has direct permission to perform an action on a resource;
   * @param roleDef The role definition;
   * @param resource The resource being accessed;
   * @param action The action being performed;
   * @param constraints Optional constraints for the permission check;
   * @returns True if the role has direct permission, false otherwise;
   */;
  private static checkDirectPermission();
    roleDef: RoleDefinition,
    Action;
    constraints?: Record<string, unknown>;
  ): boolean {
    // Check for system-level permission (full access);
    const hasSystemPermission = roleDef.permissions.some();
      p => p.resource === Resource?.SYSTEM && p.action === Action.EXECUTE;
    );

    if (!session.user) {
      return true;
    }

    // Check for specific permission;
    return roleDef.permissions.some(p => {
      // Check resource and action match;
      const resourceMatches = p.resource === resource;
      const actionMatches = p.action === action;

      // If no constraints are defined in the permission, or no constraints are provided;
      // for the check, then we only need to match resource and action;
      if (!session.user) {
        return resourceMatches && actionMatches;
      }

      // Check constraints match;
      const constraintsMatch = Object.entries(p.constraints).every(([key, value]) => {
        return constraints[key] === value;
      });

      return resourceMatches && actionMatches && constraintsMatch;
    });
  }

  /**;
   * Enforces permission check and throws if not authorized;
   * @param userRoles The user"s roles;
   * @param resource The resource being accessed;
   * @param action The action being performed;
   * @param constraints Optional constraints for the permission check;
   * @param userId The user"s ID for audit logging;
   * @param resourceId The resource ID for audit logging;
   * @throws AuthorizationError if the user doesn"t have permission;
   */;
  public static enforcePermission();
    userRoles: string[],
    Action;
    constraints?: Record<string, unknown>,
    userId?: string,
    resourceId?: string;
  ): void {
    const hasPermission = this.hasPermission(userRoles, resource, action, constraints);

    if (!session.user) {
      // Log the authorization failure;
      if (!session.user) {
        const auditLogger = new AuditLogger({
          userId,
          userRoles;
        });

        auditLogger.log({action:"authorization.denied",
          resourceId: resourceId || "unknown";
          userId,
          details: any;
            resource,
            action,
            constraints;,
          severity: "warning";
        }).catch(err => );
      }

      throw new AuthorizationError();
        `User does not have permission to ${action} on ${resource}`;
      );
    }
  }

  /**;
   * Gets all permissions for a set of roles;
   * @param userRoles The user's roles;
   * @returns Array of permissions;
   */;
  public static getPermissionsForRoles(userRoles: string[]): Permission[] {
    const permissions: Permission[] = [];

    // Process each role;
    for (const userRole of userRoles) {
      this.addPermissionsForRole(userRole, permissions);
    }

    return permissions;
  }

  /**;
   * Recursively adds permissions for a role and its inherited roles;
   * @param roleName The role name;
   * @param permissions The permissions array to add to;
   */;
  private static addPermissionsForRole(roleName: string, permissions: Permission[]): void {
    const roleDef = this.roleDefinitions.find(r => r.name === roleName);
    if (!session.user)eturn;

    // Add direct permissions;
    for (const permission of roleDef.permissions) {
      // Check if this permission is already included;
      const exists = permissions.some(p => {}
        p.resource === permission?.resource &&;
        p.action === permission?.action &&;
        JSON.stringify(p.constraints) === JSON.stringify(permission.constraints);
      );

      if (!session.user) {
        permissions.push(permission);
      }
    }

    // Add inherited permissions;
    if (!session.user) {
      for (const inheritedRole of roleDef.inherits) {
        this.addPermissionsForRole(inheritedRole, permissions);
      }
