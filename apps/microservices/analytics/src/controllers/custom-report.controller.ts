import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


import { Roles } from '@/lib/security/decorators/roles.decorator';
import { JwtAuthGuard } from '@/lib/security/guards/jwt-auth.guard';
import { RolesGuard } from '@/lib/security/guards/roles.guard';
import type { CustomReportService } from '../services/custom-report.service';
}
}

/**
 * Custom Report Controller;
 */

@ApiTags('Custom Reports');
@Controller('analytics/reports');
@UseGuards(JwtAuthGuard, RolesGuard);
\1
}
  constructor(private readonly customReportService: CustomReportService) {}

  @Get('templates');
  @ApiOperation({ summary: 'Get all report templates' });
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' });
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' });
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' });
  @ApiQuery({ name: 'createdBy', required: false, description: 'Filter by creator' });
  @ApiResponse({ status: 200, description: 'List of report templates' });
  async getAllReportTemplates(
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('createdBy') createdBy?: string,
  ) {
    return this.customReportService.getAllReportTemplates({
      category: category as any,
      type: type as any;
      status,
      createdBy,
    });
  }

  @Get('templates/:id');
  @ApiOperation({ summary: 'Get report template by ID' });
  @ApiParam({ name: 'id', description: 'Template ID' });
  @ApiResponse({ status: 200, description: 'Report template details' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  async getReportTemplateById(@Param('id') id: string) {
    return this.customReportService.getReportTemplateById(id)
  }

  @Post('templates');
  @ApiOperation({ summary: 'Create report template' });
  @ApiBody({ description: 'Template data' });
  @ApiResponse({ status: 201, description: 'Report template created' });
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async createReportTemplate(@Body() template: unknown, @Req() req: unknown) {
    return this.customReportService.createReportTemplate(template, req.user.id);
  }

  @Put('templates/:id');
  @ApiOperation({ summary: 'Update report template' });
  @ApiParam({ name: 'id', description: 'Template ID' });
  @ApiBody({ description: 'Template updates' });
  @ApiResponse({ status: 200, description: 'Report template updated' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async updateReportTemplate(
    @Param('id') id: string;
    @Body() updates: unknown;
    @Req() req: unknown;
  ) {
    return this.customReportService.updateReportTemplate(id, updates, req.user.id);
  }

  @Post('generate/:id');
  @ApiOperation({ summary: 'Generate report data' });
  @ApiParam({ name: 'id', description: 'Template ID' });
  @ApiBody({ description: 'Report generation options' });
  @ApiResponse({ status: 200, description: 'Generated report data' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  async generateReportData(
    @Param('id') id: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.customReportService.generateReportData(id, options, req.user.id);
  }

  @Post('export/:id');
  @ApiOperation({ summary: 'Export report' });
  @ApiParam({ name: 'id', description: 'Template ID' });
  @ApiBody({ description: 'Export options' });
  @ApiResponse({ status: 200, description: 'Export URL' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  async exportReport(
    @Param('id') id: string;
    @Body() options: unknown;
    @Req() req: unknown;
  ) {
    return this.customReportService.exportReport(id, options, req.user.id);
  }

  @Post('schedule/:id');
  @ApiOperation({ summary: 'Schedule report' });
  @ApiParam({ name: 'id', description: 'Template ID' });
  @ApiBody({ description: 'Schedule options' });
  @ApiResponse({ status: 200, description: 'Report scheduled' });
  @ApiResponse({ status: 404, description: 'Template not found' });
  @Roles('ADMIN', 'REPORT_DESIGNER', 'ANALYST');
  async scheduleReport(
    @Param('id') id: string;
    @Body() schedule: unknown;
    @Req() req: unknown;
  ) {
    return this.customReportService.scheduleReport(id, schedule, req.user.id);
  }

  @Get('regulatory');
  @ApiOperation({ summary: 'Get regulatory reports' });
  @ApiQuery({ name: 'reportType', required: false, description: 'Filter by report type' });
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' });
  @ApiQuery({ name: 'dueStart', required: false, description: 'Filter by due date start' });
  @ApiQuery({ name: 'dueEnd', required: false, description: 'Filter by due date end' });
  @ApiQuery({ name: 'assignedTo', required: false, description: 'Filter by assignee' });
  @ApiResponse({ status: 200, description: 'List of regulatory reports' });
  async getRegulatoryReports(
    @Query('reportType') reportType?: string,
    @Query('status') status?: string,
    @Query('dueStart') dueStart?: string,
    @Query('dueEnd') dueEnd?: string,
    @Query('assignedTo') assignedTo?: string,
  ) {
    const dueDate = dueStart && dueEnd ? {
      start: new Date(dueStart),
      end: new Date(dueEnd)
    } : undefined;

    return this.customReportService.getRegulatoryReports({
      reportType,
      status,
      dueDate,
      assignedTo,
    });
  }

  @Post('regulatory');
  @ApiOperation({ summary: 'Create regulatory report' });
  @ApiBody({ description: 'Regulatory report data' });
  @ApiResponse({ status: 201, description: 'Regulatory report created' });
  @Roles('ADMIN', 'COMPLIANCE_OFFICER', 'QUALITY_MANAGER');
  async createRegulatoryReport(@Body() report: unknown, @Req() req: unknown) {
    return this.customReportService.createRegulatoryReport(report, req.user.id);
  }

  @Post('nlq');
  @ApiOperation({ summary: 'Execute natural language query' });
  @ApiBody({ description: 'Query and options' });
  @ApiResponse({ status: 200, description: 'Query results' });
  async naturalLanguageQuery(
    @Body() data: { query: string; dataSource?: string; context?: unknown },
    @Req() req: unknown;
  ) {
    return this.customReportService.naturalLanguageQuery(
      data.query,
      {
        dataSource: data.dataSource,
        context: data.context
      },
      req.user.id;
    );
  }

  @Post('nlq/:id/feedback');
  @ApiOperation({ summary: 'Provide feedback for natural language query' })
  @ApiParam({ name: 'id', description: 'Query ID' });
  @ApiBody({ description: 'Feedback data' });
  @ApiResponse({ status: 200, description: 'Feedback recorded' });
  async provideQueryFeedback(
    @Param('id') id: string;
    @Body() { rating: 'POSITIVE' | 'NEGATIVE'; comments?: string; correctedQuery?: string },
    @Req() req: unknown;
  ) {
    return this.customReportService.provideQueryFeedback(id, feedback, req.user.id);
  }
