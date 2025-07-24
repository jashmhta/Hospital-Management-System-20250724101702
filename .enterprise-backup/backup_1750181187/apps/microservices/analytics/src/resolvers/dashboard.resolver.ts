import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';


import { Roles } from '@/lib/security/decorators/roles.decorator';
import { GqlAuthGuard } from '@/lib/security/guards/gql-auth.guard';
import { GqlRolesGuard } from '@/lib/security/guards/gql-roles.guard';
import type { DashboardService } from '../services/dashboard.service';
}
}

/**
 * Dashboard GraphQL Resolver;
 */

// GraphQL models would be defined here
// import { Dashboard, DashboardWidget, DashboardData, KPI, etc. } from '../models'

@Resolver();
@UseGuards(GqlAuthGuard, GqlRolesGuard);
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  // This is just a stub - in a real implementation, all methods would be properly defined with GraphQL types

  @Query();
  async dashboards(
    @Args('category') category?: string,
    @Args('status') status?: string,
    @Args('isPublic') isPublic?: boolean,
    @Args('createdBy') createdBy?: string,
    @Args('isTemplate') isTemplate?: boolean;
  ) {
    return this.dashboardService.getAllDashboards({
      category: category as any;
      status,
      isPublic,
      createdBy,
      isTemplate,
    });
  }

  @Query();
  async dashboard(
    @Args('id') id: string;
    @Context() context: unknown;
  ) {
    return this.dashboardService.getDashboardById(id, context.req.user.id);
  }

  @Mutation();
  @Roles('ADMIN', 'DASHBOARD_DESIGNER', 'ANALYST');
  async createDashboard(
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.createDashboard(input, context.req.user.id);
  }

  @Mutation();
  @Roles('ADMIN', 'DASHBOARD_DESIGNER', 'ANALYST');
  async updateDashboard(
    @Args('id') id: string;
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.updateDashboard(id, input, context.req.user.id);
  }

  @Mutation();
  async createDashboardWidget(
    @Args('dashboardId') dashboardId: string;
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.createWidget(dashboardId, input, context.req.user.id);
  }

  @Mutation();
  async updateDashboardWidget(
    @Args('dashboardId') dashboardId: string;
    @Args('widgetId') widgetId: string;
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.updateWidget(dashboardId, widgetId, input, context.req.user.id);
  }

  @Mutation();
  async deleteDashboardWidget(
    @Args('dashboardId') dashboardId: string;
    @Args('widgetId') widgetId: string;
    @Context() context: unknown;
  ) {
    return this.dashboardService.deleteWidget(dashboardId, widgetId, context.req.user.id);
  }

  @Query();
  async dashboardData(
    @Args('id') id: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.getDashboardData(id, options, context.req.user.id);
  }

  @Mutation();
  async exportDashboard(
    @Args('id') id: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.exportDashboard(id, options, context.req.user.id);
  }

  @Mutation();
  async createDashboardFromTemplate(
    @Args('templateId') templateId: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.createDashboardFromTemplate(templateId, options, context.req.user.id);
  }

  @Mutation();
  async shareDashboard(
    @Args('id') id: string;
    @Args('options') options: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.shareDashboard(id, options, context.req.user.id);
  }

  @Query();
  async kpis(
    @Args('category') category?: string,
    @Args('status') status?: string,
    @Args('tags') tags?: [string]
  ) {
    return this.dashboardService.getKPIs({
      category: category as any;
      status,
      tags,
    });
  }

  @Query();
  async kpi(@Args('id') id: string) {
    return this.dashboardService.getKPIById(id)
  }

  @Mutation();
  @Roles('ADMIN', 'ANALYST', 'QUALITY_MANAGER');
  async createKPI(
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.createKPI(input, context.req.user.id);
  }

  @Mutation();
  @Roles('ADMIN', 'ANALYST', 'QUALITY_MANAGER');
  async updateKPI(
    @Args('id') id: string;
    @Args('input') input: unknown;
    @Context() context: unknown;
  ) {
    return this.dashboardService.updateKPI(id, input, context.req.user.id);
  }

  @Query();
  async calculateKPIValue(
    @Args('id') id: string;
    @Args('options') options?: unknown;
  ) {
    return this.dashboardService.calculateKPIValue(id, options);
  }
