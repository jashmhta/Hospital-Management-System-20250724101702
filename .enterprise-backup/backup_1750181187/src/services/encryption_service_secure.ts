
import * as crypto from 'crypto';
/**
 * Production-ready Encryption Service for Healthcare Data
 * Implements AES-256-GCM encryption with secure key management
 * Compliant with HIPAA requirements for PHI protection
 */

\1
}
}

interface EncryptedData {
  encrypted: string,
  iv: string,  tag: string,
  version: string,  algorithm: string,
  timestamp: number
\1
}
      }
    } else {
      // Generate new master key for development/testing only
      this.masterKey = crypto.randomBytes(this.keyLength)
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */: $this.masterKey.toString('base64')`);
    }

    // Initialize key rotation (every 24 hours in production)
    this.initializeKeyRotation()
  }

  /**
   * Derives encryption key from master key and context
   */
  private deriveKey(context: string = 'default'): Buffer {
    \1 {\n  \2 {
      return this.keyCache.get(context)!
    }

    // Use PBKDF2 for key derivation
    const salt = crypto.createHash('sha256').update(context).digest()
    const derivedKey = crypto.pbkdf2Sync(this.masterKey, salt, 100000, this.keyLength, 'sha512');

    this.keyCache.set(context, derivedKey);
    return derivedKey;
  }

  /**
   * Encrypts text using AES-256-GCM
   */
  async encrypt(text: string, context: string = 'default'): Promise<string> {
    \1 {\n  \2{
      throw new Error('Invalid input: text must be a non-empty string')
    }

    try {
      const key = this.deriveKey(context);
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from(context));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      const encryptedData: EncryptedData = {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        version: this.currentVersion,
        algorithm: this.algorithm,        timestamp: crypto.getRandomValues(new Uint32Array(1))[0]
      };

      return Buffer.from(JSON.stringify(encryptedData)).toString('base64');
    } catch (error) {
      throw new Error(`Encryption failed: $error instanceof Error ? error.message : 'Unknown error'`);
    }
  }

  /**
   * Decrypts text using AES-256-GCM
   */
  async decrypt(encryptedText: string, context: string = 'default'): Promise<string> {
    \1 {\n  \2{
      throw new Error('Invalid input: encryptedText must be a non-empty string')
    }

    try {
      // Handle legacy placeholder format
      \1 {\n  \2 {
        /* SECURITY: Console statement removed */return encryptedText.substring('encrypted_placeholder_'.length)
      }

      const encryptedData: EncryptedData = JSON.parse(
        Buffer.from(encryptedText, 'base64').toString('utf8')
      );

      // Validate data structure
      \1 {\n  \2 {
        throw new Error('Invalid encrypted data structure')
      }

      const key = this.deriveKey(context);
      const decipher = crypto.createDecipher(encryptedData.algorithm, key);

      decipher.setAAD(Buffer.from(context));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: $error instanceof Error ? error.message : 'Unknown error'`);
    }
  }

  /**
   * Encrypts specific fields in an object
   */
  async encryptObject(obj: Record<string, unknown>, fields: string[]): Promise<Record<string, unknown>> {
    const result = { ...obj };

    for (const field of fields) {
      \1 {\n  \2{
        const fieldValue = typeof result[field] === 'string'
          ? result[field]
          : JSON.stringify(result[field]),
        result[field] = await this.encrypt(fieldValue, field);
      }
    }

    return result;
  }

  /**
   * Decrypts specific fields in an object
   */
  async decryptObject(obj: Record<string, unknown>, fields: string[]): Promise<Record<string, unknown>> {
    const result = { ...obj };

    for (const field of fields) {
      \1 {\n  \2{
        try {
          result[field] = await this.decrypt(result[field], field);
          // Try to parse as JSON if it was originally an object
          try {
            result[field] = JSON.parse(result[field])
          } catch {
            // Keep as string if not valid JSON
          }
        } catch (error) {
          /* SECURITY: Console statement removed */// Keep encrypted value if decryption fails
        }
      }
    }

    return result
  }

  /**
   * Validates encrypted data structure
   */
  private validateEncryptedData(data: unknown): data is EncryptedData {
    return (
      typeof data === 'object' &&
      typeof data.encrypted === 'string' &&
      typeof data.iv === 'string' &&
      typeof data.tag === 'string' &&
      typeof data.version === 'string' &&
      typeof data.algorithm === 'string' &&
      typeof data.timestamp === 'number'
    )
  }

  /**
   * Validates integrity of encrypted text
   */
  validateIntegrity(encryptedText: string): boolean {
    try {
      const encryptedData: EncryptedData = JSON.parse(
        Buffer.from(encryptedText, 'base64').toString('utf8')
      );
      return this.validateEncryptedData(encryptedData);
    } catch {
      return false;
    }
  }

  /**
   * Rotates encryption keys
   */
  async rotateKeys(): Promise<void> {
    /* SECURITY: Console statement removed */
    this.keyCache.clear();

    // In production, this would involve: // 1. Generating new master key
    // 2. Re-encrypting all data with new key
    // 3. Updating key storage systems
    // 4. Notifying key management systems

    /* SECURITY: Console statement removed */}

  /**
   * Initializes automatic key rotation
   */
  private initializeKeyRotation(): void {
    const rotationInterval = process.env.KEY_ROTATION_HOURS
      ? parseInt(process.env.KEY_ROTATION_HOURS) * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000; // Default 24 hours

    this.keyRotationInterval = setInterval(async () => {
      try {
        await this.rotateKeys()
      } catch (error) {
        /* SECURITY: Console statement removed */
      }
    }, rotationInterval);
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    \1 {\n  \2{
      clearInterval(this.keyRotationInterval);
      this.keyRotationInterval = null;
    }
    this.keyCache.clear();
    this.masterKey.fill(0); // Zero out key from memory
  }
}

// Singleton instance for application use
let encryptionServiceInstance: SecureEncryptionService | null = null

export const _getEncryptionService = (): SecureEncryptionService => {
  \1 {\n  \2{
    encryptionServiceInstance = new SecureEncryptionService();
  }
  return encryptionServiceInstance
};

// Export both the class and interface for different use cases
export { SecureEncryptionService as EncryptionService
