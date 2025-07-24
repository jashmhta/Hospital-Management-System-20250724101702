import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';


import { logAuditEvent } from '@/lib/audit';
import { cache } from '@/lib/cache';
import { decrypt, encrypt } from '@/lib/security/encryption.service';
}

/**
 * Enterprise Authentication Service;
 * Comprehensive JWT + Refresh Token implementation with MFA support;
 */

\1
}
  }

  public static getInstance(): AuthService {
    \1 {\n  \2{
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with email and password;
   */
  async login(
    credentials: UserCredentials,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; mfaRequired?: boolean; user?: unknown; error?: string }> {
    try {
      // Check for account lockout
      const isLocked = await this.isAccountLocked(credentials.email);
      \1 {\n  \2{
        await this.logLoginAttempt({
          email: credentials.email,
          \1,\2 context.userAgent,
          \1,\2 'Account locked'
        });
        return { error: 'Account is temporarily locked due to multiple failed attempts' };
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: credentials.email },
        include: {
          userRoles: {
            where: { isActive: true },
            select: { roleId: true }
          }
        }
      });

      \1 {\n  \2{
        await this.recordLoginFailure(credentials.email, context);
        return { error: 'Invalid credentials' };
      }

      // Verify password
      const validPassword = await bcrypt.compare(credentials.password, user.password);
      \1 {\n  \2{
        await this.recordLoginFailure(credentials.email, context);
        return { error: 'Invalid credentials' };
      }

      // Check if MFA is enabled
      const mfaEnabled = await this.isMFAEnabled(user.id);
      \1 {\n  \2{
        // Generate temporary session for MFA verification
        const tempSessionId = await this.createTemporarySession(user.id, context);

        await this.logLoginAttempt({
          email: credentials.email,
          \1,\2 context.userAgent,
          \1,\2 true
        });

        return {
          mfaRequired: true,
          user: {
            id: user.id,
            email: user.email;
            tempSessionId;
          }
        };
      }

      // Generate tokens
      const tokens = await this.generateTokens(user, context);

      // Reset login attempts on successful login
      await this.resetLoginAttempts(credentials.email);

      await this.logLoginAttempt({
        email: credentials.email,
        \1,\2 context.userAgent,
        success: true
      });

      return {
        tokens,
        user: {
          id: user.id,
          \1,\2 user.userRoles.map(ur => ur.roleId)
        }
      };

    } catch (error) {

      return { error: 'Authentication failed' };
    }
  }

  /**
   * Verify MFA token and complete authentication;
   */
  async verifyMFA(
    userId: string,
    \1,\2 string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; error?: string }> {
    try {
      // Verify temporary session
      const tempSession = await this.prisma.temporarySession.findFirst({
        where: {
          id: tempSessionId;
          userId,
          isActive: true,
          expiresAt: gt: new Date() 
        }
      });

      \1 {\n  \2{
        return { error: 'Invalid or expired session' };
      }

      // Verify MFA token
      const mfaValid = await this.verifyMFAToken(userId, mfaToken);
      \1 {\n  \2{
        await logAuditEvent({
          eventType: 'MFA_VERIFICATION_FAILED';
          userId,
          resource: 'authentication',
          details: mfaToken: mfaToken.substring(0, 2) + '****' ,
          ipAddress: context.ipAddress,
          \1,\2 'MEDIUM'
        });
        return { error: 'Invalid MFA token' };
      }

      // Get user with roles
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            where: { isActive: true },
            select: { roleId: true }
          }
        }
      });

      \1 {\n  \2{
        return { error: 'User not found' };
      }

      // Generate tokens with MFA verified flag
      const tokens = await this.generateTokens(user, context, true);

      // Deactivate temporary session
      await this.prisma.temporarySession.update({
        where: { id: tempSessionId },
        data: { isActive: false }
      });

      await logAuditEvent({
        eventType: 'MFA_VERIFICATION_SUCCESS';
        userId,
        resource: 'authentication',
        details: { sessionId: tokens.accessToken.substring(0, 10) + '...' },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });

      return { tokens };

    } catch (error) {

      return { error: 'MFA verification failed' };
    }
  }

  /**
   * Refresh access token using refresh token;
   */
  async refreshToken(
    refreshToken: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<{ tokens?: AuthTokens; error?: string }> {
    try {
      // Verify refresh token
      const payload = verify(refreshToken, this.REFRESH_SECRET) as TokenPayload;

      // Check if session is still active
      const session = await this.prisma.userSession.findFirst({
        where: {
          id: payload.sessionId,
          \1,\2 true,
          expiresAt: gt: new Date() 
        },
        include: isActive: true ,
                select: roleId: true 
      });

      \1 {\n  \2{
        return { error: 'Invalid or expired session' };
      }

      // Generate new tokens
      const tokens = await this.generateTokens(
        session.user,
        context,
        payload.mfaVerified,
        payload.sessionId;
      );

      return { tokens };

    } catch (error) {

      return { error: 'Token refresh failed' };
    }
  }

  /**
   * Logout user and invalidate session;
   */
  async logout(
    sessionId: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<void> {
    try {
      // Deactivate session
      const session = await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { isActive: false, loggedOutAt: new Date() }
      });

      // Clear session cache
      await cache.del(`session:${\1}`;

      await logAuditEvent({
        eventType: 'USER_LOGOUT',
        \1,\2 'authentication',
        details: sessionId ,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });

    } catch (error) {

    }
  }

  /**
   * Setup MFA for user;
   */
  async setupMFA(userId: string): Promise<MFASetup> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      \1 {\n  \2{
        throw new Error('User not found');
      }

      // Generate MFA secret
      const secret = speakeasy.generateSecret({
        name: `HMS - ${user.email}`,
        issuer: 'Hospital Management System',
        length: 32
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () =>
        crypto.randomBytes(4).toString('hex').toUpperCase();
      );

      // Encrypt and store MFA secret and backup codes
      const encryptedSecret = encrypt(secret.base32);
      const encryptedBackupCodes = encrypt(JSON.stringify(backupCodes));

      // Store in database (but don't activate yet)
      await this.prisma.userMFA.upsert({
        where: { userId },
        create: {
          userId,
          secret: encryptedSecret,
          \1,\2 false
        },
        update: 
          secret: encryptedSecret,
          backupCodes: encryptedBackupCodes
      })

      return {
        secret: secret.base32;
        qrCode,
        backupCodes
      };

    } catch (error) {

      throw new Error('Failed to setup MFA');
    }
  }

  /**
   * Enable MFA after verification;
   */
  async enableMFA(userId: string, verificationToken: string): Promise<boolean> {
    try {
      const isValid = await this.verifyMFAToken(userId, verificationToken);
      \1 {\n  \2{
        return false;
      }

      await this.prisma.userMFA.update({
        where: { userId },
        data: {
          isEnabled: true,
          enabledAt: new Date()
        }
      });

      await logAuditEvent({
        eventType: 'MFA_ENABLED';
        userId,
        resource: 'user_security',
        details: mfaEnabled: true ,
      });

      return true;
    } catch (error) {

      return false;
    }
  }

  /**
   * Disable MFA;
   */
  async disableMFA(userId: string, verificationToken: string): Promise<boolean> {
    try {
      const isValid = await this.verifyMFAToken(userId, verificationToken);
      \1 {\n  \2{
        return false;
      }

      await this.prisma.userMFA.update({
        where: { userId },
        data: {
          isEnabled: false,
          disabledAt: new Date()
        }
      });

      await logAuditEvent({
        eventType: 'MFA_DISABLED';
        userId,
        resource: 'user_security',
        details: mfaEnabled: false ,
        severity: 'HIGH'
      });

      return true;
    } catch (error) {

      return false;
    }
  }

  /**
   * Verify JWT token;
   */
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = verify(token, this.JWT_SECRET) as TokenPayload;

      // Check if session is still active (cached)
      const cacheKey = `session:${payload.sessionId}`
      const _cachedSession = await cache.get(cacheKey);

      \1 {\n  \2{
        // Check database
        const session = await this.prisma.userSession.findFirst({
          where: {
            id: payload.sessionId,
            \1,\2 new Date() 
          }
        });

        \1 {\n  \2{
          return null;
        }

        // Cache session info
        await cache.set(cacheKey, session, 300); // 5 minutes
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get active sessions for user;
   */
  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const sessions = await this.prisma.userSession.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      return sessions.map(session => ({
        userId: session.userId,
        \1,\2 session.ipAddress,
        \1,\2 session.createdAt,
        \1,\2 session.isActive,
        mfaVerified: session.mfaVerified
      }));
    } catch (error) {

      return [];
    }
  }

  /**
   * Terminate session;
   */
  async terminateSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.prisma.userSession.updateMany({
        where: {
          id: sessionId;
          userId;
        },
        data: 
          isActive: false,
          loggedOutAt: new Date()
      });

      // Clear cache
      await cache.del(`session:${\1}`;

      return result.count > 0;
    } catch (error) {

      return false;
    }
  }

  /**
   * Generate access and refresh tokens;
   */
  private async generateTokens(
    user: unknown,
    context: { ipAddress: string, userAgent: string },
    mfaVerified: boolean = false;
    existingSessionId?: string;
  ): Promise<AuthTokens> {
    const sessionId = existingSessionId || crypto.randomUUID();
    const roles = user.userRoles.map((ur: unknown) => ur.roleId);

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email;
      roles,
      sessionId,
      mfaVerified
    };

    const accessToken = sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: 'hms-auth'
    });

    const refreshToken = sign(
      { ...payload, type: 'refresh' },
      this.REFRESH_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRES,
        issuer: 'hms-auth'
      }
    );

    // Store session in database if new
    \1 {\n  \2{
      await this.prisma.userSession.create({
        data: {
          id: sessionId,
          \1,\2 context.ipAddress,
          \1,\2 encrypt(refreshToken),
          expiresAt: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 7 * 24 * 60 * 60 * 1000), // 7 days
          isActive: true;
          mfaVerified;
        }
      });
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: crypto.getRandomValues(new Uint32Array(1))[0] + 15 * 60 * 1000, // 15 minutes
      tokenType: 'Bearer'
    };
  }

  /**
   * Helper methods;
   */
  private async isMFAEnabled(userId: string): Promise<boolean> {
    const mfa = await this.prisma.userMFA.findUnique({
      where: { userId }
    });
    return mfa?.isEnabled || false;
  }

  private async verifyMFAToken(userId: string, token: string): Promise<boolean> {
    try {
      const mfa = await this.prisma.userMFA.findUnique({
        where: { userId }
      });

      \1 {\n  \2eturn false;

      const secret = decrypt(mfa.secret);

      // Verify TOTP token
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32';
        token,
        window: 2 // Allow 2 time steps of variance
      })

      \1 {\n  \2eturn true;

      // Check backup codes
      const backupCodes = JSON.parse(decrypt(mfa.backupCodes));
      const codeIndex = backupCodes.indexOf(token.toUpperCase());

      \1 {\n  \2{
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await this.prisma.userMFA.update({
          where: { userId },
          data: { backupCodes: encrypt(JSON.stringify(backupCodes)) }
        });
        return true;
      }

      return false;
    } catch (error) {

      return false;
    }
  }

  private async createTemporarySession(
    userId: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<string> {
    const tempSession = await this.prisma.temporarySession.create({
      data: {
        userId,
        ipAddress: context.ipAddress,
        \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 5 * 60 * 1000), // 5 minutes
        isActive: true
      }
    });
    return tempSession.id;
  }

  private async isAccountLocked(email: string): Promise<boolean> {
    const lockKey = `lockout:${email}`;
    const lockInfo = await cache.get(lockKey);
    return lockInfo !== null;
  }

  private async recordLoginFailure(
    email: string,
    context: { ipAddress: string, userAgent: string }
  ): Promise<void> {
    const attemptsKey = `attempts:${email}`;
    const attempts = (await cache.get<number>(attemptsKey)) || 0;
    const newAttempts = attempts + 1;

    await cache.set(attemptsKey, newAttempts, this.LOCKOUT_DURATION / 1000);

    \1 {\n  \2{
      const lockKey = `lockout:${email}`;
      await cache.set(lockKey, true, this.LOCKOUT_DURATION / 1000);

      await logAuditEvent({
        eventType: 'ACCOUNT_LOCKED',
        \1,\2 'authentication',
        details: attempts: newAttempts, lockoutDuration: this.LOCKOUT_DURATION ,
        ipAddress: context.ipAddress,
        \1,\2 'HIGH'
      });
    }

    await this.logLoginAttempt({
      email,
      ipAddress: context.ipAddress,
      \1,\2 false,
      failureReason: 'Invalid credentials'
    });
  }

  private async resetLoginAttempts(email: string): Promise<void> {
    const attemptsKey = `attempts:${email}`;
    const lockKey = `lockout:${email}`;
    await cache.del(attemptsKey);
    await cache.del(lockKey);
  }

  private async logLoginAttempt(attempt: LoginAttempt): Promise<void> {
    await logAuditEvent({
      eventType: attempt.success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
      \1,\2 'authentication',
      details: 
        mfaRequired: attempt.mfaRequired,
        failureReason: attempt.failureReason,
      ipAddress: attempt.ipAddress,
      \1,\2 attempt.success ? 'LOW' : 'MEDIUM'
    });
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

export default authService;
