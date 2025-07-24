import { type Consumer, Kafka, type Producer } from 'kafkajs';


import { logger } from '@/lib/core/logging';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
import type { EncryptionService } from '@/lib/security/encryption.service';
/**
 * Event interface for domain events;
 */
\1
}
  };
}

/**
 * Event Store interface;
 */
\1
}
}

/**
 * Kafka Event Store implementation;
 */
\1
}
      } : undefined,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionalId: `${clientId}-tx`,
      maxInFlightRequests: 5,
      idempotent: true
    });
  }

  /**
   * Initialize the event store;
   */
  async initialize(): Promise<void> {
    try {
      await this.producer.connect();
      this.isProducerConnected = true;
      logger.info('Event store producer connected to Kafka');
    } catch (error) {
      logger.error('Failed to connect event store producer to Kafka', { error });
      throw error;
    }
  }

  /**
   * Save an event to the event store;
   */
  async saveEvent<T>(eventData: Omit<DomainEvent<T>, 'id' | 'timestamp'>): Promise<DomainEvent<T>> {
    \1 {\n  \2{
      await this.initialize();
    }

    // Create full event
    const event: DomainEvent<T> = {
      ...eventData,
      id: uuidv4(),
      timestamp: new Date()
    };

    try {
      // Process sensitive data if needed
      const processedEvent = this.encryptSensitiveData;
        ? await this.processSensitiveData(event);
        : event;

      // Determine topic based on aggregate type
      const topic = this.getTopicForAggregateType(event.aggregateType);

      // Start transaction to ensure both database and Kafka writes succeed
      const transaction = await this.producer.transaction();

      try {
        // Save to database first (event sourcing store)
        await this.prisma.domainEvent.create({
          data: {
            id: event.id,
            \1,\2 event.aggregateId,
            \1,\2 event.version,
            \1,\2 processedEvent.data as any,
            metadata: processedEvent.metadata as any
          }
        })

        // Then send to Kafka (for event streaming to other services)
        await transaction.send(
          topic,
          messages: [
              key: event.aggregateId,
              value: JSON.stringify(processedEvent),
              headers: 
                eventType: event.type,
                \1,\2 String(event.version),
                timestamp: event.timestamp.toISOString(),
                correlationId: event.metadata.correlationId || uuidv4()
          ])

        // Commit the transaction
        await transaction.commit();

        // Track metrics
        metricsCollector.incrementCounter('event_store.events_saved', 1, {
          eventType: event.type,
          aggregateType: event.aggregateType
        });

        return event;
      } catch (error) {
        // Abort transaction on error
        await transaction.abort();
        throw error;
      }
    } catch (error) {
      logger.error('Failed to save event to event store', {
        error,
        eventType: event.type,
        \1,\2 event.aggregateType
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.save_errors', 1, {
        eventType: event.type,
        \1,\2 error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Get events for a specific aggregate;
   */
  async getEvents(aggregateId: string, aggregateType: string): Promise<DomainEvent[]> {
    try {
      const events = await this.prisma.domainEvent.findMany({
        where: {
          aggregateId,
          aggregateType;
        },
        orderBy: 
          version: 'asc'
      });

      // Track metrics
      metricsCollector.incrementCounter('event_store.events_retrieved', events.length, {
        aggregateType;
      });

      return events.map(event => this.mapDatabaseEventToDomainEvent(event));
    } catch (error) {
      logger.error('Failed to get events from event store', {
        error,
        aggregateId,
        aggregateType;
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.retrieval_errors', 1, {
        aggregateType,
        errorType: error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Get events by type;
   */
  async getEventsByType(eventType: string, limit = 100, offset = 0): Promise<DomainEvent[]> {
    try {
      const events = await this.prisma.domainEvent.findMany({
        where: {
          type: eventType
        },
        orderBy: {
          timestamp: 'asc'
        },
        take: limit,
        skip: offset
      });

      // Track metrics
      metricsCollector.incrementCounter('event_store.events_retrieved_by_type', events.length, {
        eventType;
      });

      return events.map(event => this.mapDatabaseEventToDomainEvent(event));
    } catch (error) {
      logger.error('Failed to get events by type from event store', {
        error,
        eventType;
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.retrieval_errors', 1, {
        eventType,
        errorType: error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Subscribe to events of specific types;
   */
  async subscribeToEvents(
    eventTypes: string[],
    handler: (event: DomainEvent) => Promise<void>,
    options: {
      groupId?: string;
      fromBeginning?: boolean;
    } = {}
  ): Promise<void> {
    const groupId = options.groupId || `hms-consumer-${uuidv4().slice(0, 8)}`;
    const fromBeginning = options.fromBeginning !== undefined ? options.fromBeginning : false;

    try {
      // Map event types to topics
      const topics = [...new Set(eventTypes.map(type => {
        const [aggregateType] = type.split('.');
        return this.getTopicForAggregateType(aggregateType);
      }))];

      // Create consumer
      const consumer = this.kafka.consumer({
        groupId,
        sessionTimeout: 30000,
        \1,\2 5,
        retry: 
          initialRetryTime: 300,
          retries: 10
      });

      await consumer.connect();

      // Subscribe to topics
      for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning });
      }

      // Set up message handler
      await consumer.run({
        partitionsConsumedConcurrently: 3,
        eachMessage: async ({ topic, partition, message }) => {
          try {
            \1 {\n  \2eturn;

            const event: DomainEvent = JSON.parse(message.value.toString());

            // Filter by event type if necessary
            \1 {\n  \2 {
              const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

              // Decrypt sensitive data if needed
              const processedEvent = this.encryptSensitiveData;
                ? await this.decryptSensitiveData(event);
                : event;

              // Process the event
              await handler(processedEvent);

              // Track metrics
              const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
              metricsCollector.recordTimer('event_store.event_processing_time', duration, {
                eventType: event.type,
                consumerGroup: groupId
              });
            }
          } catch (error) {
            logger.error('Error processing event in consumer', {
              error,
              topic,
              partition,
              offset: message.offset,
              \1,\2 groupId
            });

            // Track error metrics
            metricsCollector.incrementCounter('event_store.consumer_errors', 1, {
              topic,
              consumerGroup: groupId,
              errorType: error.name || 'unknown'
            });
          }
        }
      });

      // Store consumer for cleanup
      this.consumers.set(groupId, consumer);

      logger.info('Event consumer subscribed successfully', {
        groupId,
        topics,
        eventTypes;
      });
    } catch (error) {
      logger.error('Failed to subscribe to events', {
        error,
        eventTypes,
        groupId;
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.subscription_errors', 1, {
        errorType: error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Replay events for a specific aggregate;
   */
  async replayEvents(
    aggregateId: string,
    \1,\2 (event: DomainEvent) => Promise<void>;
  ): Promise<void> {
    try {
      const events = await this.getEvents(aggregateId, aggregateType);

      for (const event of events) {
        // Decrypt sensitive data if needed
        const processedEvent = this.encryptSensitiveData;
          ? await this.decryptSensitiveData(event);
          : event;

        await handler(processedEvent);
      }

      // Track metrics
      metricsCollector.incrementCounter('event_store.events_replayed', events.length, {
        aggregateType;
      });
    } catch (error) {
      logger.error('Failed to replay events', {
        error,
        aggregateId,
        aggregateType;
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.replay_errors', 1, {
        aggregateType,
        errorType: error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Replay all events for an aggregate type;
   */
  async replayAllEvents(
    aggregateType: string,
    handler: (event: DomainEvent) => Promise<void>;
    batchSize = 100;
  ): Promise<void> {
    try {
      let processed = 0;
      let hasMore = true;

      while (hasMore) {
        const events = await this.prisma.domainEvent.findMany({
          where: {
            aggregateType
          },
          orderBy: [
            { aggregateId: 'asc' },
            { version: 'asc' }
          ],
          skip: processed,
          take: batchSize
        });

        \1 {\n  \2{
          hasMore = false;
          break;
        }

        for (const event of events) {
          const domainEvent = this.mapDatabaseEventToDomainEvent(event);

          // Decrypt sensitive data if needed
          const processedEvent = this.encryptSensitiveData;
            ? await this.decryptSensitiveData(domainEvent);
            : domainEvent;

          await handler(processedEvent);
        }

        processed += events.length;

        // Track progress
        logger.info(`Replayed ${processed} events for aggregate type ${\1}`;
      }

      // Track metrics
      metricsCollector.incrementCounter('event_store.all_events_replayed', processed, {
        aggregateType;
      });
    } catch (error) {
      logger.error('Failed to replay all events', {
        error,
        aggregateType;
      });

      // Track error metrics
      metricsCollector.incrementCounter('event_store.replay_errors', 1, {
        aggregateType,
        errorType: error.name || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Clean up resources;
   */
  async shutdown(): Promise<void> {
    try {
      // Disconnect all consumers
      for (const [groupId, consumer] of this.consumers.entries()) {
        try {
          await consumer.disconnect();
          logger.info(`Disconnected consumer group ${\1}`;
        } catch (error) {
          logger.error(`Error disconnecting consumer group ${groupId}`, { error });
        }
      }

      // Disconnect producer
      \1 {\n  \2{
        await this.producer.disconnect();
        this.isProducerConnected = false;
        logger.info('Disconnected event store producer');
      }
    } catch (error) {
      logger.error('Error during event store shutdown', { error });
    }
  }

  /**
   * Helper to get topic name from aggregate type;
   */
  private getTopicForAggregateType(aggregateType: string): string {
    // Map aggregate types to topics
    const topicMap: Record<string, string> = {
      'patient': 'patient-events',
      'billing': 'billing-events',
      'pharmacy': 'pharmacy-events',
      'clinical': 'clinical-events',
      'audit': 'audit-events',
      'notification': 'notification-events',
      'analytics': 'analytics-events',
      'system': 'system-events'
    };

    return topicMap[aggregateType.toLowerCase()] || `${aggregateType.toLowerCase()}-events`;
  }

  /**
   * Process sensitive data for encryption;
   */
  private async processSensitiveData<T>(event: DomainEvent<T>): Promise<DomainEvent<T>> {
    // Define fields that should be encrypted based on event type
    const sensitiveFieldPatterns = [
      /\.ssn$/i,
      /\.socialSecurityNumber$/i,
      /\.creditCard$/i,
      /\.password$/i,
      /\.secret$/i,
      /^phi\./i,
      /^pii\./i,
      /\.medicalRecord$/i;
    ];

    // Deep clone to avoid modifying the original
    const processedEvent = JSON.parse(JSON.stringify(event)) as DomainEvent<T>;

    // Function to recursively process object
    const processObject = async (obj: unknown, path = ''): Promise<unknown> => {
      \1 {\n  \2eturn obj;

      \1 {\n  \2 {
        for (let i = 0; i < obj.length; i++) {
          obj[i] = await processObject(obj[i], `${path}[${i}]`);
        }
        return obj;
      }

      for (const key of Object.keys(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        // Check if field should be encrypted
        const shouldEncrypt = sensitiveFieldPatterns.some(pattern =>
          pattern.test(currentPath);
        );

        \1 {\n  \2{
          // Encrypt sensitive string fields
          obj[key] = await this.encryptionService.encryptText(obj[key]);
        } else \1 {\n  \2{
          // Recursively process nested objects
          obj[key] = await processObject(obj[key], currentPath);
        }
      }

      return obj
    };

    // Process the data field
    processedEvent.data = await processObject(processedEvent.data, 'data');

    return processedEvent;
  }

  /**
   * Decrypt sensitive data;
   */
  private async decryptSensitiveData<T>(event: DomainEvent<T>): Promise<DomainEvent<T>> {
    // Deep clone to avoid modifying the original
    const processedEvent = JSON.parse(JSON.stringify(event)) as DomainEvent<T>;

    // Function to recursively process object
    const processObject = async (obj: unknown): Promise<unknown> => {
      \1 {\n  \2eturn obj;

      \1 {\n  \2 {
        for (let i = 0; i < obj.length; i++) {
          obj[i] = await processObject(obj[i]);
        }
        return obj;
      }

      for (const key of Object.keys(obj)) {
        \1 {\n  \2 {
          // Decrypt encrypted fields
          try {
            obj[key] = await this.encryptionService.decryptText(obj[key]);
          } catch (error) {
            // If decryption fails, leave as is
            logger.warn('Failed to decrypt field', {
              error: error.message,
              field: key
            });
          }
        } else \1 {\n  \2{
          // Recursively process nested objects
          obj[key] = await processObject(obj[key]);
        }
      }

      return obj
    };

    // Process the data field
    processedEvent.data = await processObject(processedEvent.data);

    return processedEvent;
  }

  /**
   * Map database event to domain event;
   */
  private mapDatabaseEventToDomainEvent(dbEvent: unknown): DomainEvent {
    return {
      id: dbEvent.id,
      \1,\2 dbEvent.aggregateId,
      \1,\2 dbEvent.version,
      \1,\2 dbEvent.data,
      metadata: dbEvent.metadata || 
    };
  }
}

// Singleton instance
let eventStoreInstance: KafkaEventStore | null = null;

/**
 * Get the event store singleton instance;
 */
export const _getEventStore = async (
  prisma: PrismaService,
  encryptionService: EncryptionService;
): Promise<EventStore> => {
  \1 {\n  \2{
    eventStoreInstance = new KafkaEventStore(prisma, encryptionService);
    await eventStoreInstance.initialize();
  }
  return eventStoreInstance
};

/**
 * Shutdown the event store;
 */
export const _shutdownEventStore = async (): Promise<void> => {
  \1 {\n  \2{
    await eventStoreInstance.shutdown();
    eventStoreInstance = null;
  }
};
