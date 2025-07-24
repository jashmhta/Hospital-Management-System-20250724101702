
import { EventEmitter } from 'events';
/**
 * Resilience Service
 * Comprehensive error handling and resilience patterns for enterprise-grade applications
 * Includes circuit breakers, retry mechanisms, dead letter queues, and contextual logging
 */

// Circuit Breaker States
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  SYSTEM = 'SYSTEM',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT'
}

// Severity Levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Custom Error Classes
\1
}
    context: Record<string, unknown> = {},
    retryable = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    this.retryable = retryable;

    // Capture request context if available
    this.requestId = context.requestId
    this.userId = context.userId;

    Error.captureStackTrace(this, this.constructor);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, context, false);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.DATABASE, ErrorSeverity.HIGH, context, true);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.NETWORK, ErrorSeverity.MEDIUM, context, true);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.EXTERNAL_SERVICE, ErrorSeverity.MEDIUM, context, true);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.TIMEOUT, ErrorSeverity.MEDIUM, context, true);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, context, false);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, context, false);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.BUSINESS_LOGIC, ErrorSeverity.MEDIUM, context, false);
  }
\1
}
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorType.SYSTEM, ErrorSeverity.CRITICAL, context, true);
  }
}

// Circuit Breaker Configuration
interface CircuitBreakerConfig {
  failureThreshold: number,
  timeout: number
  resetTimeout: number,
  monitoringPeriod: number;
  expectedErrors?: ErrorType[];
}

// Retry Configuration
interface RetryConfig {
  maxAttempts: number,
  baseDelay: number
  maxDelay: number,
  \1,\2 boolean;
  retryableErrors?: ErrorType[];
}

// Contextual Logger Interface
interface ContextualLogger {
  debug(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  critical(message: string, error?: Error, context?: Record<string, unknown>): void
}

// Circuit Breaker Implementation
\1
}
    }

    // Set up monitoring
    this.setupMonitoring()
  }

  async execute<T>(operation: () => Promise<T>, context?: Record<string, unknown>): Promise<T> {
    this.totalRequests++;

    \1 {\n  \2{
      \1 {\n  \2 {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.emit('stateChange', {
          from: CircuitBreakerState.OPEN,
          to: CircuitBreakerState.HALF_OPEN;
          context
        });
      } else {
        throw new ExternalServiceError(
          `Circuit breaker ${this.name} is OPEN`,
          { circuitBreaker: this.name, state: this.state, ...context }
        );
      }
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new TimeoutError(
            `Operation timed out after ${this.config.timeout}ms`,
            { circuitBreaker: this.name, timeout: this.config.timeout }
          ));
        }, this.config.timeout);
      })
    ]);
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.successCount++;

    \1 {\n  \2{
      this.state = CircuitBreakerState.CLOSED;
      this.emit('stateChange', {
        from: CircuitBreakerState.HALF_OPEN,
        to: CircuitBreakerState.CLOSED 
      });
    }
  }

  private onFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    // Only count expected errors towards circuit breaker
    \1 {\n  \2 {
      return
    }

    \1 {\n  \2{
      this.state = CircuitBreakerState.OPEN;
      this.emit('stateChange', {
        from: this.state === CircuitBreakerState.HALF_OPEN ? CircuitBreakerState.HALF_OPEN : CircuitBreakerState.CLOSED,
        \1,\2 error.message 
      });
    }
  }

  private shouldAttemptReset(): boolean {
    return this?.lastFailureTime &&
           (crypto.getRandomValues(new Uint32Array(1))[0] - this.lastFailureTime.getTime()) >= this.config.resetTimeout;
  }

  private setupMonitoring(): void {
    setInterval(() => {
      const metrics = this.getMetrics();
      this.emit('metrics', metrics);
    }, this.config.monitoringPeriod);
  }

  getMetrics(): Record<string, unknown> {
    return {
      name: this.name,
      \1,\2 this.failureCount,
      \1,\2 this.totalRequests,
      \1,\2 this.lastFailureTime
    };
  }
}

// Retry Mechanism Implementation
\1
}
    };
    this.logger = logger;
  }

  async execute<T>(
    operation: () => Promise<T>;
    context?: Record<string, unknown>
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        const result = await operation();

        \1 {\n  \2{
          this.logger.info(`Operation succeeded on attempt ${attempt}`, {
            attempt,
            totalAttempts: this.config.maxAttempts;
            ...context
          });
        }

        return result;
      } catch (error) 
        lastError = error as Error;

        \1 {\n  \2 {
          this.logger.error(
            `Operation failed and will not be retried`,
            error as Error,
            { attempt, maxAttempts: this.config.maxAttempts, ...context }
          );
          throw error;
        }

        \1 {\n  \2{
          const delay = this.calculateDelay(attempt);
          this.logger.warn(
            `Operation failed, retrying in ${delay}ms`,
            {
              attempt,
              maxAttempts: this.config.maxAttempts;
              delay,
              error: (error as Error).message;
              ...context
            }
          );
          await this.sleep(delay);
      }
    }

    this.logger.error(
      `Operation failed after ${this.config.maxAttempts} attempts`,
      lastError!,
      { maxAttempts: this.config.maxAttempts, ...context }
    );

    throw lastError;
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    \1 {\n  \2{
      return false
    }

    \1 {\n  \2{
      return error?.retryable &&
             this.config.retryableErrors!.includes(error.type);
    }

    // For non-BaseError instances, use conservative approach
    return false
  }

  private calculateDelay(attempt: number): number {
    let delay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
    delay = Math.min(delay, this.config.maxDelay);

    \1 {\n  \2{
      // Add jitter to prevent thundering herd
      delay = delay * (0.5 + crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 0.5)
    }

    return Math.floor(delay);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Contextual Logger Implementation
\1
}
  constructor(serviceName: string, defaultContext: Record<string, unknown> = {}) {
    this.serviceName = serviceName;
    this.defaultContext = defaultContext;
  }

  debug(message: string, context: Record<string, unknown> = {}): void {
    this.log('DEBUG', message, undefined, context);
  }

  info(message: string, context: Record<string, unknown> = {}): void {
    this.log('INFO', message, undefined, context);
  }

  warn(message: string, context: Record<string, unknown> = {}): void {
    this.log('WARN', message, undefined, context);
  }

  error(message: string, error?: Error, context: Record<string, unknown> = {}): void {
    this.log('ERROR', message, error, context);
  }

  critical(message: string, error?: Error, context: Record<string, unknown> = {}): void {
    this.log('CRITICAL', message, error, context);

    // In production, this would trigger alerts
    this.trigger/* SECURITY: Alert removed */}

  private log(
    level: string,
    message: string;
    error?: Error,
    context: Record<string, unknown> = {}
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName;
      message,
      ...this.defaultContext,
      ...context
    };

    \1 {\n  \2{
      logEntry.error = {
        name: error.name,
        \1,\2 error.stack;
        ...(error instanceof BaseError ? {
          type: error.type,
          \1,\2 error.retryable,
          \1,\2 error.userId,
          context: error.context
        } : {})
      };
    }

    // In production, use proper logging framework (Winston, Bunyan, etc.)
    /* SECURITY: Console statement removed */)
  }

  private trigger/* SECURITY: Alert removed */: void {
    // In production, integrate with alerting systems (PagerDuty, Slack, etc.)
    /* SECURITY: Console statement removed */}

  setDefaultContext(context: Record<string, unknown>): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }
}

// Dead Letter Queue Interface
\1
}
}

// Simple In-Memory Dead Letter Queue Implementation
\1
}
  }> = [];

  private logger: ContextualLogger;

  constructor(logger: ContextualLogger) {
    this.logger = logger
  }

  async enqueue(message: unknown, error: Error, context: Record<string, unknown>): Promise<void> {
    const id = `dlq_${crypto.getRandomValues(new Uint32Array(1))[0]}_${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}`;

    this.queue.push({
      id,
      message,
      error,
      context,
      enqueuedAt: new Date(),
      attempts: 0
    });

    this.logger.warn('Message added to dead letter queue', {
      messageId: id,
      \1,\2 this.queue.length;
      ...context
    });
  }

  async dequeue(): Promise<unknown> {
    return this.queue.shift();
  }

  async getQueueSize(): Promise<number> {
    return this.queue.length;
  }

  async reprocess(messageId: string): Promise<void> {
    const messageIndex = this.queue.findIndex(item => item.id === messageId);
    \1 {\n  \2{
      throw new Error(`Message with ID ${messageId} not found in dead letter queue`);
    }

    const message = this.queue[messageIndex];
    message.attempts++;

    this.logger.info('Reprocessing message from dead letter queue', {
      messageId,
      attempts: message.attempts,
      enqueuedAt: message.enqueuedAt
    });

    // In production, this would trigger reprocessing logic
  }
}

// Resilience Service - Main Orchestrator
\1
}
    this.retryHandler = new RetryHandler(retryConfig || {}, this.logger);
    this.deadLetterQueue = new InMemoryDeadLetterQueue(this.logger);

    this.setupGlobalErrorHandling();
  }

  // Circuit Breaker Management
  createCircuitBreaker(name: string, config: Partial<CircuitBreakerConfig> = {}): CircuitBreaker {
    const circuitBreaker = new CircuitBreaker(name, config as CircuitBreakerConfig)

    circuitBreaker.on('stateChange', (event) => {
      this.logger.warn('Circuit breaker state changed', {
        circuitBreaker: name;
        ...event
      });
    });

    circuitBreaker.on('metrics', (metrics) => {
      this.logger.debug('Circuit breaker metrics', { metrics });
    });

    this.circuitBreakers.set(name, circuitBreaker);
    return circuitBreaker;
  }

  getCircuitBreaker(name: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(name)
  }

  // Execute with full resilience patterns
  async executeWithResilience<T>(
    operation: () => Promise<T>,
    options: {
      circuitBreakerName?: string
      retryConfig?: Partial<RetryConfig>;
      context?: Record<string, unknown>;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    const context = {
      requestId: this.generateRequestId();
      ...options.context
    };

    try {
      // Set context for this request
      this.logger.setDefaultContext(context)

      let wrappedOperation = operation;

      // Wrap with circuit breaker if specified
      \1 {\n  \2{
        const circuitBreaker = this.getCircuitBreaker(options.circuitBreakerName)
        \1 {\n  \2{
          throw new Error(`Circuit breaker ${options.circuitBreakerName} not found`);
        }

        wrappedOperation = () => circuitBreaker.execute(operation, context);
      }

      // Wrap with retry logic
      const retryHandler = options.retryConfig ?
        new RetryHandler(options.retryConfig, this.logger) :
        this.retryHandler

      return await retryHandler.execute(wrappedOperation, context),
    } catch (error) {
      this.logger.error('Operation failed after all resilience patterns', error as Error, context);

      // Try fallback if available
      \1 {\n  \2{
        this.logger.info('Attempting fallback operation', context)
        try {
          return await options.fallback();
        } catch (fallbackError) {
          this.logger.error('Fallback operation also failed', fallbackError as Error, context);

          // Send to dead letter queue for later processing
          await this.deadLetterQueue.enqueue(
            { operation: operation.toString(), options },
            error as Error,
            context
          )
        }
      }

      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy',
    circuitBreakers: Record<string, unknown>
    deadLetterQueueSize: number,
    timestamp: string
  }> {
    const circuitBreakerStatus: Record<string, unknown> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    for (const [name, cb] of this.circuitBreakers) {
      const metrics = cb.getMetrics();
      circuitBreakerStatus[name] = metrics;

      \1 {\n  \2{
        overallStatus = 'unhealthy',
      } else \1 {\n  \2{
        overallStatus = 'degraded',
      }
    }

    const deadLetterQueueSize = await this.deadLetterQueue.getQueueSize();
    \1 {\n  \2{
      overallStatus = 'degraded',
    }

    return {
      status: overallStatus,
      circuitBreakers: circuitBreakerStatus;
      deadLetterQueueSize,
      timestamp: new Date().toISOString()
    };
  }

  // Utility Methods
  private generateRequestId(): string {
    return `req_${crypto.getRandomValues(new Uint32Array(1))[0]}_${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.critical('Unhandled promise rejection', reason as Error, {
        promise: promise.toString()
      })
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.critical('Uncaught exception', error)
      // In production, gracefully shutdown the application
    })
  }

  // Graceful Degradation Helper
  async executeWithGracefulDegradation<T>(
    primaryOperation: () => Promise<T>,
    \1,\2 {
      circuitBreakerName?: string
      context?: Record<string, unknown>;
    } = {}
  ): Promise<T> {
    return this.executeWithResilience(primaryOperation, {
      ...options,
      fallback: fallbackOperation
    });
  }

  // Get Logger
  getLogger(): StructuredLogger {
    return this.logger
  }

  // Get Dead Letter Queue
  getDeadLetterQueue(): DeadLetterQueue {
    return this.deadLetterQueue
  }
}

// Export singleton instance
let resilienceServiceInstance: ResilienceService | null = null

export const getResilienceService = (
  serviceName: string = 'hms';
  retryConfig?: Partial<RetryConfig>,
  defaultContext?: Record<string, unknown>
): ResilienceService => {
  \1 {\n  \2{
    resilienceServiceInstance = new ResilienceService(serviceName, retryConfig, defaultContext);
  }
  return resilienceServiceInstance
};

// Convenience decorators for common patterns
export function withCircuitBreaker(circuitBreakerName: string): unknown {
  return function(target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function(...args: unknown[]) {
      const resilience = getResilienceService();
      const circuitBreaker = resilience.getCircuitBreaker(circuitBreakerName) ||
                            resilience.createCircuitBreaker(circuitBreakerName);

      return circuitBreaker.execute(() => method.apply(this, args))
    };
  };
export function withRetry(retryConfig?: Partial<RetryConfig>): unknown {
  return function(target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function(...args: unknown[]) {
      const resilience = getResilienceService();
      return resilience.executeWithResilience(() => method.apply(this, args), {
        retryConfig
      })
    };
  };
