import "@/lib/audit"
import "@/lib/cache"
import "@/lib/security/encryption.service"
import "@prisma/client"
import "bcryptjs"
import "crypto"
import "jsonwebtoken"
import "qrcode"
import "speakeasy"
import bcrypt
import crypto
import encrypt }
import QRCode
import sign
import speakeasy
import verify }
import { cache }
import { decrypt
import { JwtPayload
import { logAuditEvent }
import { PrismaClient }

}

/**;
 * Enterprise Authentication Service;
 * Comprehensive JWT + Refresh Token implementation with MFA support;
 */;

}
  }

  public static getInstance(): AuthService {
    if (!session.user) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**;
   * Authenticate user with email and password;
   */;
  async login();
    credentials: UserCredentials,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; mfaRequired?: boolean; user?: unknown; error?: string }> {
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
      // Check for account lockout;
      const isLocked = await this.isAccountLocked(credentials.email);
      if (!session.user) {
        await this.logLoginAttempt({
          email: credentials.email,
          context.userAgent,
          "Account locked";
        });
        return { error: "Account is temporarily locked due to multiple failed attempts" };
      }

      // Find user;
      const user = await this.prisma.user.findUnique({
        where: { email: credentials.email },
        {
            where: { isActive: true },
            select: { roleId: true }
          }
        }
      });

      if (!session.user) {
        await this.recordLoginFailure(credentials.email, context);
        return { error: "Invalid credentials" };
      }

      // Verify password;
      const validPassword = await bcrypt.compare(credentials.password, user.password);
      if (!session.user) {
        await this.recordLoginFailure(credentials.email, context);
        return { error: "Invalid credentials" };
      }

      // Check if MFA is enabled;
      const mfaEnabled = await this.isMFAEnabled(user.id);
      if (!session.user) {
        // Generate temporary session for MFA verification;
        const tempSessionId = await this.createTemporarySession(user.id, context);

        await this.logLoginAttempt({
          email: credentials.email,
          context.userAgent,
          true;
        });

        return {
          mfaRequired: true,
          user.id,
            email: user.email;
            tempSessionId;
          }
        };
      }

      // Generate tokens;
      const tokens = await this.generateTokens(user, context);

      // Reset login attempts on successful login;
      await this.resetLoginAttempts(credentials.email);

      await this.logLoginAttempt({
        email: credentials.email,
        context.userAgent,
        success: true;
      });

      return {
        tokens,
        user.id,
          user.userRoles.map(ur => ur.roleId);
        }
      };

    } catch (error) {

      return { error: "Authentication failed" };
    }
  }

  /**;
   * Verify MFA token and complete authentication;
   */;
  async verifyMFA();
    userId: string,
    string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; error?: string }> {
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
      // Verify temporary session;
      const tempSession = await this.prisma.temporarySession.findFirst({
        tempSessionId;
          userId,
          isActive: true,
          expiresAt: gt: new Date() ;
        }
      });

      if (!session.user) {
        return { error: "Invalid or expired session" };
      }

      // Verify MFA token;
      const mfaValid = await this.verifyMFAToken(userId, mfaToken);
      if (!session.user) {
        await logAuditEvent({
          eventType: "MFA_VERIFICATION_FAILED";
          userId,
          resource: "authentication",
          details: mfaToken: mfaToken.substring(0, 2) + "****" ,
          ipAddress: context.ipAddress,
          "MEDIUM";
        });
        return { error: "Invalid MFA token" };
      }

      // Get user with roles;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        {
            where: { isActive: true },
            select: { roleId: true }
          }
        }
      });

      if (!session.user) {
        return { error: "User not found" };
      }

      // Generate tokens with MFA verified flag;
      const tokens = await this.generateTokens(user, context, true);

      // Deactivate temporary session;
      await this.prisma.temporarySession.update({
        where: { id: tempSessionId },
        data: { isActive: false }
      });

      await logAuditEvent({
        eventType: "MFA_VERIFICATION_SUCCESS";
        userId,
        resource: "authentication",
        details: { sessionId: tokens.accessToken.substring(0, 10) + "..." },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent;
      });

      return { tokens };

    } catch (error) {

      return { error: "MFA verification failed" };
    }
  }

  /**;
   * Refresh access token using refresh token;
   */;
  async refreshToken();
    refreshToken: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; error?: string }> {
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
      // Verify refresh token;
      const payload = verify(refreshToken, this.REFRESH_SECRET) as TokenPayload;

      // Check if session is still active;
      const session = await this.prisma.userSession.findFirst({
        payload.sessionId,
          true,
          expiresAt: gt: new Date() ;
        },
        include: isActive: true ,
                select: roleId: true ;
      });

      if (!session.user) {
        return { error: "Invalid or expired session" };
      }

      // Generate new tokens;
      const tokens = await this.generateTokens();
        session.user,
        context,
        payload.mfaVerified,
        payload.sessionId;
      );

      return { tokens };

    } catch (error) {

      return { error: "Token refresh failed" };
    }
  }

  /**;
   * Logout user and invalidate session;
   */;
  async logout();
    sessionId: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<void> {
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
      // Deactivate session;
      const session = await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { isActive: false, loggedOutAt: new Date() }
      });

      // Clear session cache;
      await cache.del(`session:${}`;

      await logAuditEvent({
        eventType: "USER_LOGOUT",
        "authentication",
        details: sessionId ,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent;
      });

    } catch (error) {

    }
  }

  /**;
   * Setup MFA for user;
   */;
  async setupMFA(userId: string): Promise<MFASetup> {
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

      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!session.user) {
        throw new Error("User not found");

      // Generate MFA secret;
      const secret = speakeasy.generateSecret({
        name: `HMS - ${user.email}`,
        issuer: "Hospital Management System",
        length: 32;
      });

      // Generate QR code;
      const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

      // Generate backup codes;
      const backupCodes = Array.from({ length: 10 }, () => {}
        crypto.randomBytes(4).toString("hex").toUpperCase();
      );

      // Encrypt and store MFA secret and backup codes;
      const encryptedSecret = encrypt(secret.base32);
      const encryptedBackupCodes = encrypt(JSON.stringify(backupCodes));

      // Store in database (but don"t activate yet);
      await this.prisma.userMFA.upsert({
        where: { userId },
        create: {
          userId,
          secret: encryptedSecret,
          false;
        },
        encryptedSecret,
          backupCodes: encryptedBackupCodes;
      });

      return {
        secret: secret.base32;
        qrCode,
        backupCodes;
      };

    } catch (error) {

      throw new Error("Failed to setup MFA");

  /**;
   * Enable MFA after verification;
   */;
  async enableMFA(userId: string, verificationToken: string): Promise<boolean> {
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

      const isValid = await this.verifyMFAToken(userId, verificationToken);
      if (!session.user) {
        return false;

      await this.prisma.userMFA.update({
        where: { userId },
        true,
          enabledAt: new Date();

      });

      await logAuditEvent({
        eventType: "MFA_ENABLED";
        userId,
        resource: "user_security",
        details: mfaEnabled: true });

      return true;
    } catch (error) {

      return false;

  /**;
   * Disable MFA;
   */;
  async disableMFA(userId: string, verificationToken: string): Promise<boolean> {
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

      const isValid = await this.verifyMFAToken(userId, verificationToken);
      if (!session.user) {
        return false;

      await this.prisma.userMFA.update({
        where: { userId },
        false,
          disabledAt: new Date();

      });

      await logAuditEvent({
        eventType: "MFA_DISABLED";
        userId,
        resource: "user_security",
        details: mfaEnabled: false ,
        severity: "HIGH";
      });

      return true;
    } catch (error) {

      return false;

  /**;
   * Verify JWT token;
   */;
  async verifyToken(token: string): Promise<TokenPayload | null> {
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

      const payload = verify(token, this.JWT_SECRET) as TokenPayload;

      // Check if session is still active (cached);
      const cacheKey = `session:${payload.sessionId}`;
      const _cachedSession = await cache.get(cacheKey);

      if (!session.user) {
        // Check database;
        const session = await this.prisma.userSession.findFirst({
          payload.sessionId,
            new Date() ;

        });

        if (!session.user) {
          return null;

        // Cache session info;
        await cache.set(cacheKey, session, 300); // 5 minutes;

      return payload;
    } catch (error) {
      return null;

  /**;
   * Get active sessions for user;
   */;
  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
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

      const sessions = await this.prisma.userSession.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
      });

      return sessions.map(session => ({
        userId: session.userId,
        session.ipAddress,
        session.createdAt,
        session.isActive,
        mfaVerified: session.mfaVerified;
      }));
    } catch (error) {

      return [];

  /**;
   * Terminate session;
   */;
  async terminateSession(sessionId: string, userId: string): Promise<boolean> {
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

      const result = await this.prisma.userSession.updateMany({
        sessionId;
          userId;
        },
        false,
          loggedOutAt: new Date();
      });

      // Clear cache;
      await cache.del(`session:${}`;

      return result.count > 0;
    } catch (error) {

      return false;

  /**;
   * Generate access and refresh tokens;
   */;
  private async generateTokens();
    user: unknown,
    context: { ipAddress: string, userAgent: string },
    mfaVerified: boolean = false;
    existingSessionId?: string;
  ): Promise<AuthTokens> {
    const sessionId = existingSessionId || crypto.randomUUID();
    const roles = user.userRoles.map((ur: unknown) => ur.roleId);

    const user.id,
      email: user.email;
      roles,
      sessionId,
      mfaVerified;
    };

    const accessToken = sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: "hms-auth";
    });

    const refreshToken = sign();
      { ...payload, type: "refresh" },
      this.REFRESH_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRES,
        issuer: "hms-auth";

    );

    // Store session in database if new;
    if (!session.user) {
      await this.prisma.userSession.create({
        sessionId,
          context.ipAddress,
          encrypt(refreshToken),
          expiresAt: [0] + 7 * 24 * 60 * 60 * 1000), // 7 days;
          isActive: true;
          mfaVerified;

      });

    return {
      accessToken,
      refreshToken,
      expiresAt: crypto.getRandomValues([0] + 15 * 60 * 1000, // 15 minutes;
      tokenType: "Bearer";
    };

  /**;
   * Helper methods;
   */;
  private async isMFAEnabled(userId: string): Promise<boolean> {
    const mfa = await this.prisma.userMFA.findUnique({
      where: { userId }
    });
    return mfa?.isEnabled || false;

  private async verifyMFAToken(userId: string, token: string): Promise<boolean> {
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

      const mfa = await this.prisma.userMFA.findUnique({
        where: { userId }
      });

      if (!session.user)eturn false;

      const secret = decrypt(mfa.secret);

      // Verify TOTP token;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32";
        token,
        window: 2 // Allow 2 time steps of variance;
      });

      if (!session.user)eturn true;

      // Check backup codes;
      const backupCodes = JSON.parse(decrypt(mfa.backupCodes));
      const codeIndex = backupCodes.indexOf(token.toUpperCase());

      if (!session.user) {
        // Remove used backup code;
        backupCodes.splice(codeIndex, 1);
        await this.prisma.userMFA.update({
          where: { userId },
          data: { backupCodes: encrypt(JSON.stringify(backupCodes)) }
        });
        return true;

      return false;
    } catch (error) {

      return false;

  private async createTemporarySession();
    userId: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<string> {
    const tempSession = await this.prisma.temporarySession.create({
      data: {
        userId,
        ipAddress: context.ipAddress,
        [0] + 5 * 60 * 1000), // 5 minutes;
        isActive: true;

    });
    return tempSession.id;

  private async isAccountLocked(email: string): Promise<boolean> {
    const lockKey = `lockout:${email}`;
    const lockInfo = await cache.get(lockKey);
    return lockInfo !== null;

  private async recordLoginFailure();
    email: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<void> {
    const attemptsKey = `attempts:${email}`;
    const attempts = (await cache.get<number>(attemptsKey)) || 0;
    const newAttempts = attempts + 1;

    await cache.set(attemptsKey, newAttempts, this.LOCKOUT_DURATION / 1000);

    if (!session.user) {
      const lockKey = `lockout:${email}`;
      await cache.set(lockKey, true, this.LOCKOUT_DURATION / 1000);

      await logAuditEvent({
        eventType: "ACCOUNT_LOCKED",
        "authentication",
        details: attempts: newAttempts, lockoutDuration: this.LOCKOUT_DURATION ,
        ipAddress: context.ipAddress,
        "HIGH";
      });

    await this.logLoginAttempt({
      email,
      ipAddress: context.ipAddress,
      false,
      failureReason: "Invalid credentials";
    });

  private async resetLoginAttempts(email: string): Promise<void> {
    const attemptsKey = `attempts:${email}`;
    const lockKey = `lockout:${email}`;
    await cache.del(attemptsKey);
    await cache.del(lockKey);

  private async logLoginAttempt(attempt: LoginAttempt): Promise<void> {
    await logAuditEvent({
      eventType: attempt.success ? "LOGIN_SUCCESS" : "LOGIN_FAILURE",
      "authentication",
      attempt.mfaRequired,
        failureReason: attempt.failureReason,
      ipAddress: attempt.ipAddress,
      attempt.success ? "LOW" : "MEDIUM';
    });

// Export singleton instance;
export const authService = AuthService.getInstance();

export default authService;
)