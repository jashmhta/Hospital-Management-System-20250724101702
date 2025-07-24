import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';


import { Roles } from '@/lib/security/decorators/roles.decorator';
import { GqlAuthGuard } from '@/lib/security/guards/gql-auth.guard';
import { GqlRolesGuard } from '@/lib/security/guards/gql-roles.guard';
import type { CustomReportService } from '../services/custom-report.service';
}
}

/**
 * Custom Report GraphQL Resolver;
 */

// GraphQL models would be defined here
// import { ReportTemplate, ReportData, RegulatoryReport, NaturalLanguageQuery } from '../models'

@Resolver();
@UseGuards(GqlAuthGuard, GqlRolesGuard);
\1
}
  constructor(private readonly customReportService: CustomReportService) {}

  // This is just a stub - in a real implementation, all methods would be properly defined with GraphQL types

  @Query();
  async reportTemplates(
    @Args('category') category?: string,
    @Args('type') type?: string,
    @Args('status') status?: string,
    @Args('createdBy') createdBy?: string;
  ) {
    return this.customReportService.getAllReportTemplates({
      category: category as any,
      type: type as any;
      status,
      createdBy,
    });
  }

  @Query();
  async reportTemplate(@Args('id') id: string) {
    return this.customReportService.getReportTemplateById(id)
  }

  @Mutation();
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async createReportTemplate(
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.createReportTemplate(input, context.req.user.id);
  }

  @Mutation();
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async updateReportTemplate(
    @Args('id') id: string;
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.updateReportTemplate(id, input, context.req.user.id);
  }

  @Query();
  async generateReport(
    @Args('id') id: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.generateReportData(id, options, context.req.user.id);
  }

  @Mutation();
  async exportReport(
    @Args('id') id: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.exportReport(id, options, context.req.user.id);
  }

  @Mutation();
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async scheduleReport(
    @Args('id') id: string;
    @Args('schedule') schedule: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.scheduleReport(id, schedule, context.req.user.id);
  }

  @Query();
  async regulatoryReports(
    @Args('reportType') reportType?: string,
    @Args('status') status?: string,
    @Args('dueStartDate') dueStartDate?: string,
    @Args('dueEndDate') dueEndDate?: string,
    @Args('assignedTo') assignedTo?: string;
  ) {
    const dueDate = dueStartDate && dueEndDate ? {
      start: new Date(dueStartDate),
      end: new Date(dueEndDate)
    } : undefined;

    return this.customReportService.getRegulatoryReports({
      reportType,
      status,
      dueDate,
      assignedTo,
    });
  }

  @Mutation();
  @Roles('ADMIN', 'COMPLIANCE_OFFICER', 'QUALITY_MANAGER');
  async createRegulatoryReport(
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.createRegulatoryReport(input, context.req.user.id);
  }

  @Query();
  async naturalLanguageQuery(
    @Args('query') query: string;
    @Args('dataSource') dataSource?: string,
    @Args('context') queryContext?: unknown,
    @Context() context: unknown;
  ) {
    return this.customReportService.naturalLanguageQuery(
      query,
      {
        dataSource,
        context: queryContext
      },
      context.req.user.id;
    );
  }

  @Mutation();
  async provideQueryFeedback(
    @Args('id') id: string;
    @Args('feedback') feedback: unknown;
    @Context() context: unknown;
  ) {
    return this.customReportService.provideQueryFeedback(id, feedback, context.req.user.id);
  }
