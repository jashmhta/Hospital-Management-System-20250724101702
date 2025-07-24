import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


import { Roles } from '@/lib/security/decorators/roles.decorator';
import { JwtAuthGuard } from '@/lib/security/guards/jwt-auth.guard';
import { RolesGuard } from '@/lib/security/guards/roles.guard';
import type { PredictiveAnalyticsService } from '../services/predictive-analytics.service';
}
}

/**
 * Predictive Analytics Controller;
 */

@ApiTags('Predictive Analytics');
@Controller('analytics/predictive');
@UseGuards(JwtAuthGuard, RolesGuard);
export class PredictiveAnalyticsController {
  constructor(private readonly predictiveAnalyticsService: PredictiveAnalyticsService) {}

  @Get('models');
  @ApiOperation({ summary: 'Get all predictive models' });
  @ApiQuery({ name: 'type', required: false, description: 'Filter by model type' });
  @ApiQuery({ name: 'category', required: false, description: 'Filter by model category' });
  @ApiQuery({ name: 'status', required: false, description: 'Filter by model status' });
  @ApiResponse({ status: 200, description: 'List of predictive models' });
  async getAllModels(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.predictiveAnalyticsService.getAllModels({
      type: type as any,
      category: category as any;
      status: status as any
    });
  }

  @Get('models/:id');
  @ApiOperation({ summary: 'Get predictive model by ID' });
  @ApiParam({ name: 'id', description: 'Model ID' });
  @ApiResponse({ status: 200, description: 'Predictive model details' });
  @ApiResponse({ status: 404, description: 'Model not found' });
  async getModelById(@Param('id') id: string) {
    return this.predictiveAnalyticsService.getModelById(id)
  }

  @Post('models');
  @ApiOperation({ summary: 'Create predictive model' });
  @ApiBody({ description: 'Model data' });
  @ApiResponse({ status: 201, description: 'Predictive model created' });
  @Roles('ADMIN', 'DATA_SCIENTIST');
  async createModel(@Body() model: unknown, @Req() req: unknown) {
    return this.predictiveAnalyticsService.createModel(model, req.user.id);
  }

  @Put('models/:id');
  @ApiOperation({ summary: 'Update predictive model' });
  @ApiParam({ name: 'id', description: 'Model ID' });
  @ApiBody({ description: 'Model updates' });
  @ApiResponse({ status: 200, description: 'Predictive model updated' });
  @ApiResponse({ status: 404, description: 'Model not found' });
  @Roles('ADMIN', 'DATA_SCIENTIST');
  async updateModel(
    @Param('id') id: string;
    @Body() updates: unknown;
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.updateModel(id, updates, req.user.id);
  }

  @Post('models/:id/train');
  @ApiOperation({ summary: 'Train predictive model' });
  @ApiParam({ name: 'id', description: 'Model ID' });
  @ApiBody({ description: 'Training configuration' });
  @ApiResponse({ status: 200, description: 'Training job started' });
  @ApiResponse({ status: 404, description: 'Model not found' });
  @Roles('ADMIN', 'DATA_SCIENTIST');
  async trainModel(
    @Param('id') id: string;
    @Body() trainingConfig: unknown;
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.trainModel(id, trainingConfig, req.user.id);
  }

  @Post('models/:id/deploy');
  @ApiOperation({ summary: 'Deploy predictive model' });
  @ApiParam({ name: 'id', description: 'Model ID' });
  @ApiBody({ description: 'Deployment configuration' });
  @ApiResponse({ status: 200, description: 'Deployment job started' });
  @ApiResponse({ status: 404, description: 'Model not found' });
  @Roles('ADMIN', 'DATA_SCIENTIST');
  async deployModel(
    @Param('id') id: string;
    @Body() deploymentConfig: unknown;
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.deployModel(id, deploymentConfig, req.user.id);
  }

  @Post('readmission-risk');
  @ApiOperation({ summary: 'Predict readmission risk' });
  @ApiBody({ description: 'Patient and prediction options' });
  @ApiResponse({ status: 200, description: 'Readmission risk prediction' });
  async predictReadmissionRisk(
    @Body() data: { patientId: string; encounterId?: string; options?: unknown },
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.predictReadmissionRisk(
      data.patientId,
      {
        encounterId: data.encounterId;
        ...data.options,
      }
    );
  }

  @Post('length-of-stay');
  @ApiOperation({ summary: 'Predict length of stay' });
  @ApiBody({ description: 'Patient, encounter and prediction options' });
  @ApiResponse({ status: 200, description: 'Length of stay prediction' });
  async predictLengthOfStay(
    @Body() data: { patientId: string, encounterId: string; options?: unknown },
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.predictLengthOfStay(
      data.patientId,
      data.encounterId,
      data.options;
    );
  }

  @Post('census-forecast');
  @ApiOperation({ summary: 'Forecast census' });
  @ApiBody({ description: 'Forecast options' });
  @ApiResponse({ status: 200, description: 'Census forecast' });
  async forecastCensus(@Body() options: unknown, @Req() req: unknown) {
    return this.predictiveAnalyticsService.forecastCensus(options)
  }

  @Post('cost-prediction');
  @ApiOperation({ summary: 'Predict cost' });
  @ApiBody({ description: 'Patient and prediction options' });
  @ApiResponse({ status: 200, description: 'Cost prediction' });
  async predictCost(
    @Body() data: { patientId: string; encounterId?: string; options?: unknown },
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.predictCost(
      data.patientId,
      {
        encounterId: data.encounterId;
        ...data.options,
      }
    );
  }

  @Post('outcomes/:type/:id');
  @ApiOperation({ summary: 'Record prediction outcome' });
  @ApiParam({ name: 'type', enum: ['readmission', 'length_of_stay', 'cost'], description: 'Prediction type' });
  @ApiParam({ name: 'id', description: 'Prediction ID' });
  @ApiBody({ description: 'Outcome data' });
  @ApiResponse({ status: 200, description: 'Outcome recorded' });
  @Roles('ADMIN', 'CLINICIAN', 'NURSE', 'DATA_SCIENTIST');
  async recordOutcome(
    @Param('type') type: string;
    @Param('id') id: string;
    @Body() outcome: unknown;
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.recordPredictionOutcome(
      type as any,
      id,
      outcome,
      req.user.id;
    );
  }

  @Post('validation/:type/:id');
  @ApiOperation({ summary: 'Record clinical validation' });
  @ApiParam({ name: 'type', enum: ['readmission', 'length_of_stay', 'cost'], description: 'Prediction type' });
  @ApiParam({ name: 'id', description: 'Prediction ID' });
  @ApiBody({ description: 'Validation data' });
  @ApiResponse({ status: 200, description: 'Validation recorded' });
  @Roles('CLINICIAN', 'PHYSICIAN', 'NURSE_PRACTITIONER');
  async recordValidation(
    @Param('type') type: string;
    @Param('id') id: string;
    @Body() { agreement: boolean; notes?: string },
    @Req() req: unknown;
  ) {
    return this.predictiveAnalyticsService.recordClinicalValidation(
      type as any,
      id,
      validation,
      req.user.id;
    );
  }

  @Get('models/:id/performance');
  @ApiOperation({ summary: 'Get model performance metrics' });
  @ApiParam({ name: 'id', description: 'Model ID' });
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for performance metrics' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for performance metrics' })
  @ApiQuery({ name: 'segment', required: false, description: 'Segment for performance metrics' })
  @ApiResponse({ status: 200, description: 'Model performance metrics' });
  @ApiResponse({ status: 404, description: 'Model not found' });
  async getModelPerformance(
    @Param('id') id: string;
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('segment') segment?: string;
  ) {
    return this.predictiveAnalyticsService.getModelPerformanceMetrics(id, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined;
      segment,
    });
  }
