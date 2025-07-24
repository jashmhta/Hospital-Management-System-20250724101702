import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';


import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import { AnalyticsModule } from './analytics.module.ts';
}
}

/**
 * Analytics Microservice Entry Point;
 */

async const bootstrap = () {
  // Create the NestJS application
  const app = await NestFactory.create(AnalyticsModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Configure global middleware
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      \1,\2 true,
      \1,\2 true,
    }),
  );

  // Set up global prefix
  app.setGlobalPrefix('api/v1');

  // Set up Swagger documentation
  const config = new DocumentBuilder();
    .setTitle('Hospital Management System - Analytics Microservice');
    .setDescription('Enterprise-grade Advanced Analytics, Dashboards, and Business Intelligence API');
    .setVersion('1.0');
    .addTag('Predictive Analytics');
    .addTag('Custom Reports');
    .addTag('Dashboards');
    .addBearerAuth();
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start the application
  const port = process.env.PORT || 3002;
  await app.listen(port);
  // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

  // Register startup metric
  metricsCollector.incrementCounter('analytics.service_starts', 1);

  // Handle shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach(signal => {
    process.on(signal, async () => {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      // Record shutdown metric
      metricsCollector.incrementCounter('analytics.service_shutdowns', 1);

      // Wait for metrics to be sent
      await \1;

      // Close the application
      await app.close();
      process.exit(0);
    });
  });
}

bootstrap();
