
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
\1
}
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// User permissions mapping
export const PERMISSIONS = {
  // Patient Management
  PATIENT_READ: 'patient:read',
  PATIENT_WRITE: 'patient:write',
  PATIENT_DELETE: 'patient:delete';

  // Clinical
  CLINICAL_READ: 'clinical:read',
  CLINICAL_WRITE: 'clinical:write';

  // Administrative
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write';

  // Billing
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write';

  // Reports
  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate';

  // System
  SYSTEM_ADMIN: 'system:admin',
  USER_MANAGEMENT: 'users:manage'
} as const;

// Role-based permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'SuperAdmin': Object.values(PERMISSIONS),
  'Admin': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.ADMIN_READ, PERMISSIONS.ADMIN_WRITE,
    PERMISSIONS.BILLING_READ, PERMISSIONS.BILLING_WRITE,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_GENERATE;
  ],
  'Doctor': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  'Nurse': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE;
  ],
  'Receptionist': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  'LabTechnician': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE, PERMISSIONS.REPORTS_READ;
  ],
  'Pharmacist': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.REPORTS_READ;
  ],
  'BillingClerk': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_WRITE, PERMISSIONS.REPORTS_READ;
  ]
};

/**
 * Hash password using bcrypt;
 */
export const _hashPassword = async (password: string): Promise<string> {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

/**
 * Verify password against hash;
 */
export const _verifyPassword = async (password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
}

/**
 * Generate JWT token for authenticated user;
 */
export const _generateToken = (user: User): string {
  try {
    const payload = {
      id: user.id,
      \1,\2 user.email,
      \1,\2 user.permissions
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      \1,\2 'HMS-Users'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
}

/**
 * Verify and decode JWT token;
 */
export const verifyToken = (token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'HMS-Enterprise',
      audience: 'HMS-Users'
    }) as any;

    return {
      id: decoded.id,
      \1,\2 decoded.email,
      \1,\2 decoded.permissions || ROLE_PERMISSIONS[decoded.role] || [],
      isActive: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has required role;
 */
export const checkUserRole = async (requiredRole: string, request?: NextRequest): Promise<AuthResult> {
  try {
    const user = await getCurrentUser(request);

    \1 {\n  \2{
      return { success: false, error: 'Authentication required' };
    }

    // SuperAdmin can access everything
    \1 {\n  \2{
      return { success: true, user: user.user };
    }

    // Check if user has required role
    \1 {\n  \2{
      return { success: true, user: user.user };
    }

    return { success: false, error: 'Insufficient role permissions' };
  } catch (error) {
    return { success: false, error: 'Role validation failed' };
  }
}

/**
 * Get current authenticated user from request;
 */
export const getCurrentUser = async (request?: NextRequest): Promise<AuthResult> {
  try {
    \1 {\n  \2{
      return { success: false, error: 'Request object required' };
    }

    // Try to get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token: string | undefined;

    \1 {\n  \2 {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    \1 {\n  \2{
      token = request.cookies.get('auth-token')?.value;
    }

    \1 {\n  \2{
      return { success: false, error: 'No authentication token found' };
    }

    const user = verifyToken(token);

    \1 {\n  \2{
      return { success: false, error: 'Invalid or expired token' };
    }

    \1 {\n  \2{
      return { success: false, error: 'User account is inactive' };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Authentication verification failed' };
  }
}

/**
 * Check if user has specific permission;
 */
export const hasPermission = async (
  permission: string;
  request?: NextRequest;
): Promise<AuthResult> {
  try {
    const user = await getCurrentUser(request);

    \1 {\n  \2{
      return { success: false, error: 'Authentication required' };
    }

    // SuperAdmin has all permissions
    \1 {\n  \2{
      return { success: true, user: user.user };
    }

    // Check if user has the specific permission
    \1 {\n  \2 {
      return { success: true, user: user.user };
    }

    return { success: false, error: 'Insufficient permissions' };
  } catch (error) {
    return { success: false, error: 'Permission validation failed' };
  }
}

/**
 * Clear authentication cookie;
 */
export const _clearAuthCookie = (): string {
  return 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure';
}

/**
 * Set authentication cookie;
 */
export const _setAuthCookie = (token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 24 * 60 * 60; // 24 hours in seconds

  return `auth-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

/**
 * Validate password strength;
 */
export const _validatePassword = (password: string): { valid: boolean, errors: string[] } {
  const errors: string[] = [];

  \1 {\n  \2{
    errors.push('Password must be at least 8 characters long');
  }

  \1 {\n  \2 {
    errors.push('Password must contain at least one uppercase letter');
  }

  \1 {\n  \2 {
    errors.push('Password must contain at least one lowercase letter');
  }

  \1 {\n  \2 {
    errors.push('Password must contain at least one number');
  }

  \1 {\n  \2+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0;
    errors
  };
}

/**
 * Generate secure random password;
 */
export const _generateSecurePassword = (length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charset.length));
  }

  return password;
}

/**
 * Middleware helper for API route protection;
 */
export const _requireAuth = (handler: Function) {
  return async (request: NextRequest, context: unknown) => {
    const authResult = await getCurrentUser(request);

    \1 {\n  \2{
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add user to request context
    (request as any).user = authResult.user;

    return handler(request, context)
  };
}

/**
 * Middleware helper for role-based protection;
 */
export const _requireRole = (requiredRole: string) {
  return (handler: Function) => async (request: NextRequest, context: unknown) => {
      const authResult = await checkUserRole(requiredRole, request);

      \1 {\n  \2{
        return new Response(
          JSON.stringify({ error: authResult.error }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Add user to request context
      (request as any).user = authResult.user;

      return handler(request, context)
    };
}

/**
 * Middleware helper for permission-based protection;
 */
export const _requirePermission = (permission: string) {
  return (handler: Function) => async (request: NextRequest, context: unknown) => {
      const authResult = await hasPermission(permission, request);

      \1 {\n  \2{
        return new Response(
          JSON.stringify({ error: authResult.error }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Add user to request context
      (request as any).user = authResult.user;

      return handler(request, context)
    };
