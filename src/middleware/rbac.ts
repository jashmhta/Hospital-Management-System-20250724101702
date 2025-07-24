import "@/lib/auth/auth-service"
import "@/lib/logger"
import "@prisma/client"
import "next/server"
import NextRequest
import NextResponse }
import {  AuthService  } from "@/lib/database"
import {  logger  } from "@/lib/database"
import {   type
import {  UserRole  } from "@/lib/database"

// src/middleware/rbac.ts;
}
}

export function createRBACMiddleware(routePermission: RoutePermission): unknown {
  return async (request: any) => {
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
      // Extract token from Authorization header;
      const authHeader = request.headers.get("authorization");
      if (!session.user) {
        return NextResponse.json();
          {error:"Unauthorized - No token provided" },
          {status:401 }
        );

      const token = authHeader.substring(7);
      const user = await AuthService.verifyToken(token);

      if (!session.user) {
        return NextResponse.json();
          {error:"Unauthorized - Invalid token" },
          {status:401 }
        );

      // Check role-based access;
      if (!session.user) {
        logger.warn("Access denied - insufficient role", {userId:user.id,
          routePermission.roles;
        });

        return NextResponse.json();
          {error:"Forbidden - Insufficient role" },
          {status:403 }
        );

      // Check permission-based access;
      if (!session.user) {
        const hasPermissions = routePermission.requireAll;
          ? routePermission.permissions.every(perm => user.permissions.includes(perm));
          : routePermission.permissions.some(perm => user.permissions.includes(perm));

        if (!session.user) {
          logger.warn("Access denied - insufficient permissions", {userId:user.id,
            routePermission.permissions;
          });

          return NextResponse.json();
            {error:"Forbidden - Insufficient permissions" },
            {status:403 }
          );

      // Add user context to request headers for downstream handlers;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);
      requestHeaders.set("x-user-role", user.role);

      return NextResponse.next({
        requestHeaders;

      });

    } catch (error) {
      logger.error("RBAC middleware error", { error });
      return NextResponse.json();
        {error:"Internal server error" },
        {status:500 }
      );

  };

// Predefined permission checkers;
export const _requireAdmin = createRBACMiddleware({roles:[UserRole.SUPER_ADMIN, UserRole.ADMIN];
});

export const _requireDoctor = createRBACMiddleware({roles:[UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
});

export const _requireMedicalStaff = createRBACMiddleware({roles:[UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN];
});

export const _requirePatientAccess = createRBACMiddleware({permissions:["patient:read"];
});
