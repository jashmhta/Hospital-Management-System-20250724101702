import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


import { Roles } from '@/lib/security/decorators/roles.decorator';
import { JwtAuthGuard } from '@/lib/security/guards/jwt-auth.guard';
import { RolesGuard } from '@/lib/security/guards/roles.guard';
import type { DashboardService } from '../services/dashboard.service';
}
}

/**
 * Dashboard Controller;
 */

@ApiTags('Dashboards');
@Controller('analytics/dashboards');
@UseGuards(JwtAuthGuard, RolesGuard);
\1
}
  constructor(private readonly dashboardService: DashboardService) {}

  @Get();
  @ApiOperation({ summary: 'Get all dashboards' });
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' });
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' });
  @ApiQuery({ name: 'isPublic', required: false, description: 'Filter by public status' });
  @ApiQuery({ name: 'createdBy', required: false, description: 'Filter by creator' });
  @ApiQuery({ name: 'isTemplate', required: false, description: 'Filter by template status' });
  @ApiResponse({ status: 200, description: 'List of dashboards' });
  async getAllDashboards(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('isPublic') isPublic?: string,
    @Query('createdBy') createdBy?: string,
    @Query('isTemplate') isTemplate?: string,
  ) {
    return this.dashboardService.getAllDashboards({
      category: category as any;
      status,
      isPublic: isPublic !== undefined ? isPublic === 'true' : undefined;
      createdBy,
      isTemplate: isTemplate !== undefined ? isTemplate === 'true' : undefined
    });
  }

  @Get(':id');
  @ApiOperation({ summary: 'Get dashboard by ID' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiResponse({ status: 200, description: 'Dashboard details' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async getDashboardById(@Param('id') id: string, @Req() req: unknown) {
    return this.dashboardService.getDashboardById(id, req.user.id);
  }

  @Post();
  @ApiOperation({ summary: 'Create dashboard' });
  @ApiBody({ description: 'Dashboard data' });
  @ApiResponse({ status: 201, description: 'Dashboard created' });
  @Roles('ADMIN', 'DASHBOARD_DESIGNER', 'ANALYST');
  async createDashboard(@Body() dashboard: unknown, @Req() req: unknown) {
    return this.dashboardService.createDashboard(dashboard, req.user.id);
  }

  @Put(':id');
  @ApiOperation({ summary: 'Update dashboard' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiBody({ description: 'Dashboard updates' });
  @ApiResponse({ status: 200, description: 'Dashboard updated' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async updateDashboard(
    @Param('id') id: string;
    @Body() updates: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.updateDashboard(id, updates, req.user.id);
  }

  @Post(':id/widgets');
  @ApiOperation({ summary: 'Create dashboard widget' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiBody({ description: 'Widget data' });
  @ApiResponse({ status: 201, description: 'Widget created' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async createWidget(
    @Param('id') id: string;
    @Body() widget: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.createWidget(id, widget, req.user.id);
  }

  @Put(':id/widgets/:widgetId');
  @ApiOperation({ summary: 'Update dashboard widget' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiParam({ name: 'widgetId', description: 'Widget ID' });
  @ApiBody({ description: 'Widget updates' });
  @ApiResponse({ status: 200, description: 'Widget updated' });
  @ApiResponse({ status: 404, description: 'Dashboard or widget not found' });
  async updateWidget(
    @Param('id') id: string;
    @Param('widgetId') widgetId: string;
    @Body() updates: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.updateWidget(id, widgetId, updates, req.user.id);
  }

  @Delete(':id/widgets/:widgetId');
  @ApiOperation({ summary: 'Delete dashboard widget' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiParam({ name: 'widgetId', description: 'Widget ID' });
  @ApiResponse({ status: 200, description: 'Widget deleted' });
  @ApiResponse({ status: 404, description: 'Dashboard or widget not found' });
  async deleteWidget(
    @Param('id') id: string;
    @Param('widgetId') widgetId: string;
    @Req() req: unknown;
  ) {
    return this.dashboardService.deleteWidget(id, widgetId, req.user.id);
  }

  @Post(':id/data');
  @ApiOperation({ summary: 'Get dashboard data' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiBody({ description: 'Data fetch options' });
  @ApiResponse({ status: 200, description: 'Dashboard data' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async getDashboardData(
    @Param('id') id: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.getDashboardData(id, options, req.user.id);
  }

  @Post(':id/export');
  @ApiOperation({ summary: 'Export dashboard' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiBody({ description: 'Export options' });
  @ApiResponse({ status: 200, description: 'Export URL' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async exportDashboard(
    @Param('id') id: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.exportDashboard(id, options, req.user.id);
  }

  @Post('create-from-template/:templateId');
  @ApiOperation({ summary: 'Create dashboard from template' });
  @ApiParam({ name: 'templateId', description: 'Template dashboard ID' });
  @ApiBody({ description: 'Dashboard customization options' });
  @ApiResponse({ status: 201, description: 'Dashboard created from template' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  async createDashboardFromTemplate(
    @Param('templateId') templateId: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.createDashboardFromTemplate(templateId, options, req.user.id);
  }

  @Post(':id/share');
  @ApiOperation({ summary: 'Share dashboard' });
  @ApiParam({ name: 'id', description: 'Dashboard ID' });
  @ApiBody({ description: 'Share options' });
  @ApiResponse({ status: 200, description: 'Share link and details' });
  @ApiResponse({ status: 404, description: 'Dashboard not found' });
  async shareDashboard(
    @Param('id') id: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.shareDashboard(id, options, req.user.id);
  }

  @Get('kpis');
  @ApiOperation({ summary: 'Get KPIs' });
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' });
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' });
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' });
  @ApiResponse({ status: 200, description: 'List of KPIs' });
  async getKPIs(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('tags') tags?: string,
  ) {
    return this.dashboardService.getKPIs({
      category: category as any;
      status,
      tags: tags ? tags.split(',') : undefined,
    });
  }

  @Get('kpis/:id');
  @ApiOperation({ summary: 'Get KPI by ID' });
  @ApiParam({ name: 'id', description: 'KPI ID' });
  @ApiResponse({ status: 200, description: 'KPI details' });
  @ApiResponse({ status: 404, description: 'KPI not found' });
  async getKPIById(@Param('id') id: string) {
    return this.dashboardService.getKPIById(id)
  }

  @Post('kpis');
  @ApiOperation({ summary: 'Create KPI' });
  @ApiBody({ description: 'KPI data' });
  @ApiResponse({ status: 201, description: 'KPI created' });
  @Roles('ADMIN', 'ANALYST', 'QUALITY_MANAGER');
  async createKPI(@Body() kpi: unknown, @Req() req: unknown) {
    return this.dashboardService.createKPI(kpi, req.user.id);
  }

  @Put('kpis/:id');
  @ApiOperation({ summary: 'Update KPI' });
  @ApiParam({ name: 'id', description: 'KPI ID' });
  @ApiBody({ description: 'KPI updates' });
  @ApiResponse({ status: 200, description: 'KPI updated' });
  @ApiResponse({ status: 404, description: 'KPI not found' });
  @Roles('ADMIN', 'ANALYST', 'QUALITY_MANAGER');
  async updateKPI(
    @Param('id') id: string;
    @Body() updates: unknown;
    @Req() req: unknown;
  ) {
    return this.dashboardService.updateKPI(id, updates, req.user.id);
  }

  @Post('kpis/:id/calculate');
  @ApiOperation({ summary: 'Calculate KPI value' });
  @ApiParam({ name: 'id', description: 'KPI ID' });
  @ApiBody({ description: 'Calculation options' });
  @ApiResponse({ status: 200, description: 'KPI value' });
  @ApiResponse({ status: 404, description: 'KPI not found' });
  async calculateKPIValue(
    @Param('id') id: string;
    @Body() options: unknown;
  ) {
    return this.dashboardService.calculateKPIValue(id, options);
  }
