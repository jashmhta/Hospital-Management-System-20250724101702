
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';





import { CacheModule } from '@/lib/cache/cache.module';
import { MonitoringModule } from '@/lib/monitoring/monitoring.module';
import { PrismaModule } from '@/lib/prisma/prisma.module';
import { SecurityModule } from '@/lib/security/security.module';
import { CustomReportController } from './controllers/custom-report.controller.ts';
import { DashboardController } from './controllers/dashboard.controller.ts';
import { PredictiveAnalyticsController } from './controllers/predictive-analytics.controller.ts';
import { CustomReportResolver } from './resolvers/custom-report.resolver.ts';
import { DashboardResolver } from './resolvers/dashboard.resolver.ts';
import { PredictiveAnalyticsResolver } from './resolvers/predictive-analytics.resolver.ts';
import { CustomReportService } from './services/custom-report.service.ts';
import { DashboardService } from './services/dashboard.service.ts';
import { PredictiveAnalyticsService } from './services/predictive-analytics.service.ts';
}
}

/**
 * Analytics Microservice Module;
 * Enterprise-grade advanced analytics, dashboards, and business intelligence;
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      \1,\2 true,
      \1,\2 ({ req, connection }) =>
        connection ? { req: { headers: connection.context } } : { req },
    }),
    PrismaModule,
    SecurityModule,
    MonitoringModule,
    CacheModule,
    CoreGraphQLModule,
  ],
  controllers: [
    PredictiveAnalyticsController,
    CustomReportController,
    DashboardController,
  ],
  providers: [
    PredictiveAnalyticsService,
    CustomReportService,
    DashboardService,
    PredictiveAnalyticsResolver,
    CustomReportResolver,
    DashboardResolver,
  ],
  exports: [
    PredictiveAnalyticsService,
    CustomReportService,
    DashboardService,
  ],
});
\1
}