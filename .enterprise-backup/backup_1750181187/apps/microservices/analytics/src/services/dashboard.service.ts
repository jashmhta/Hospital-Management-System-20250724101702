import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
import type { AuditService } from '@/lib/security/audit.service';
import type { EncryptionService } from '@/lib/security/encryption.service';
}
}

/**
 * Data Visualization & Dashboards Service;
 * Enterprise-grade interactive dashboard platform for healthcare analytics;
 */

// Dashboard models
export interface Dashboard {
  id: string,
  name: string;
  description: string,
  category: DashboardCategory;
  layout: DashboardLayout,
  widgets: DashboardWidget[];
  filters: DashboardFilter[],
  theme: DashboardTheme;
  created: Date,
  updated: Date;
  createdBy: string,
  updatedBy: string;
  isPublic: boolean,
  isTemplate: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
  permissions: DashboardPermissions;
  refreshRate?: number; // in seconds, undefined for manual refresh only
  lastRefreshed?: Date;
  version: string,
  settings: DashboardSettings;
  autoRefresh: boolean,
  tags: string[];
  metadata: DashboardMetadata
export enum DashboardCategory {
  CLINICAL = 'CLINICAL',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  QUALITY = 'QUALITY',
  EXECUTIVE = 'EXECUTIVE',
  DEPARTMENTAL = 'DEPARTMENTAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  CUSTOM = 'CUSTOM',
export interface DashboardLayout {
  type: 'GRID' | 'FREE' | 'FIXED';
  gridColumns?: number;
  gridRowHeight?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: number;
  gridGap?: number;
  gridAreas?: string[][];
  responsive: boolean;
  breakpoints?: {
    small?: BreakpointLayout;
    medium?: BreakpointLayout;
    large?: BreakpointLayout
  };
  options?: Record<string, any>;
export interface BreakpointLayout {
  columns: number,
  layouts: {
    widgetId: string,
    x: number;
    y: number,
    w: number;
    h: number
  }[];
export interface DashboardWidget {
  id: string,
  name: string;
  type: WidgetType;
  description?: string;
  position: WidgetPosition,
  dataSource: WidgetDataSource;
  visualization: WidgetVisualization,
  interactions: WidgetInteractions;
  settings: WidgetSettings,
  filters: WidgetFilter[];
  created: Date,
  updated: Date;
  createdBy: string,
  updatedBy: string;
  status: 'ACTIVE' | 'DRAFT' | 'ERROR';
  errorMessage?: string;
  refreshRate?: number; // Override dashboard refresh rate
  lastRefreshed?: Date;
  version: string,
  tags: string[];
  metadata: WidgetMetadata
export enum WidgetType {
  CHART = 'CHART',
  TABLE = 'TABLE',
  METRIC = 'METRIC',
  LIST = 'LIST',
  MAP = 'MAP',
  HEATMAP = 'HEATMAP',
  TIMELINE = 'TIMELINE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  IFRAME = 'IFRAME',
  CUSTOM = 'CUSTOM',
  FORM = 'FORM',
  FILTER = 'FILTER',
  ALERT = 'ALERT',
export interface WidgetPosition {
  x: number,
  y: number;
  w: number,
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  gridArea?: string;
  zIndex?: number;
export interface WidgetDataSource {
  type: 'API' | 'GRAPHQL' | 'SQL' | 'SERVICE' | 'STATIC' | 'REALTIME' | 'CUSTOM',
  config: {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    query?: string;
    variables?: Record<string, any>;
    serviceName?: string;
    serviceMethod?: string;
    data?: unknown;
    refreshInterval?: number;
    maxDataPoints?: number;
    transformations?: DataTransformation[];
    dataMapping?: Record<string, string>
  };
  parameters?: Record<string, any>;
export interface DataTransformation {
  type: 'FILTER' | 'SORT' | 'AGGREGATE' | 'PIVOT' | 'CALCULATE' | 'FORMAT' | 'LIMIT' | 'JOIN' | 'CUSTOM',
  config: Record<string, any>;
export interface WidgetVisualization {
  type: VisualizationType,
  config: Record<string, any>;
  defaultConfig?: Record<string, any>;
  options?: {
    showTitle: boolean,
    showLegend: boolean;
    showTooltips: boolean,
    showDataLabels: boolean;
    showAxes: boolean,
    showGrid: boolean
  };
  theme?: {
    colors: string[];
    fontFamily?: string;
    fontSize?: number;
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
    legendPosition?: 'top' | 'right' | 'bottom' | 'left' | 'none';
    axisLabelFontSize?: number;
    axisTickFontSize?: number;
    tooltipFontSize?: number
  };
  formatters?: {
    x?: string;
    y?: string;
    value?: string;
    date?: string;
    number?: string;
    percent?: string
  };
  responsive?: boolean;
  animations?: {
    enabled: boolean;
    duration?: number;
    easing?: string
  };
export enum VisualizationType {
  BAR = 'BAR',
  LINE = 'LINE',
  AREA = 'AREA',
  PIE = 'PIE',
  DONUT = 'DONUT',
  SCATTER = 'SCATTER',
  BUBBLE = 'BUBBLE',
  RADAR = 'RADAR',
  POLAR = 'POLAR',
  FUNNEL = 'FUNNEL',
  GAUGE = 'GAUGE',
  HEATMAP = 'HEATMAP',
  TREEMAP = 'TREEMAP',
  SUNBURST = 'SUNBURST',
  SANKEY = 'SANKEY',
  CHORD = 'CHORD',
  TABLE = 'TABLE',
  PIVOT_TABLE = 'PIVOT_TABLE',
  DATA_GRID = 'DATA_GRID',
  METRIC = 'METRIC',
  SPARKLINE = 'SPARKLINE',
  TEXT = 'TEXT',
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  IMAGE = 'IMAGE',
  MAP = 'MAP',
  CHOROPLETH = 'CHOROPLETH',
  TIMELINE = 'TIMELINE',
  GANTT = 'GANTT',
  CUSTOM = 'CUSTOM',
export interface WidgetInteractions {
  drillDown?: {
    enabled: boolean,
    type: 'WIDGET' | 'DASHBOARD' | 'URL' | 'DETAIL';
    target?: string;
    parameters?: Record<string, string>
  };
  filters?: {
    enabled: boolean;
    targetWidgets?: string[];
    targetFilters?: string[];
    mappings?: Record<string, string>
  };
  actions?: WidgetAction[];
  tooltips?: {
    enabled: boolean;
    content?: string;
    showDuration?: number
  };
  highlights?: {
    enabled: boolean;
    targetWidgets?: string[];
    mode?: 'select' | 'hover' | 'both';
    effect?: 'highlight' | 'filter' | 'both'
  };
  selections?: {
    enabled: boolean;
    mode?: 'single' | 'multiple';
    targetWidgets?: string[]
  };
  contextMenu?: {
    enabled: boolean;
    items?: ContextMenuItem[]
  };
export interface WidgetAction {
  id: string,
  name: string;
  icon?: string;
  type: 'NAVIGATE' | 'API_CALL' | 'EXPORT' | 'FILTER' | 'REFRESH' | 'CUSTOM',
  config: Record<string, any>;
  condition?: string;
  permission?: string[];
export interface ContextMenuItem {
  id: string,
  label: string;
  icon?: string;
  action: WidgetAction;
  children?: ContextMenuItem[];
  separator?: boolean;
  condition?: string;
export interface WidgetSettings {
  title?: string;
  subtitle?: string;
  description?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  titleFontSize?: number;
  titleFontWeight?: 'normal' | 'bold' | 'light';
  titleColor?: string;
  subtitleFontSize?: number;
  subtitleColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  borderRadius?: number;
  border?: string;
  padding?: number;
  shadow?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  showRefreshButton?: boolean;
  showMaximizeButton?: boolean;
  showSettingsButton?: boolean;
  showExportButton?: boolean;
  exportFormats?: ('CSV' | 'EXCEL' | 'PNG' | 'PDF')[];
  loadingAnimation?: string;
  emptyStateMessage?: string;
  errorStateMessage?: string;
  customCSS?: string;
  customOptions?: Record<string, any>;
export interface WidgetFilter {
  id: string,
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_than_or_equals' | 'less_than_or_equals' | 'between' | 'not_between' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty' | 'in' | 'not_in';
  value?: unknown;
  value2?: unknown; // For 'between' and 'not_between'
  isDynamic: boolean
  dynamicSource?: {
    type: 'DASHBOARD_FILTER' | 'WIDGET_INTERACTION' | 'USER_PROPERTY' | 'GLOBAL_PARAMETER',
    source: string;
    mapping?: Record<string, any>
  };
export interface DashboardFilter {
  id: string,
  name: string;
  displayName: string,
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DATE_RANGE' | 'SELECT' | 'MULTI_SELECT' | 'BOOLEAN' | 'SLIDER' | 'CUSTOM';
  dataType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'ARRAY';
  defaultValue?: unknown;
  options?: {
    value: unknown,
    label: string;
    icon?: string;
  }[];
  optionsSource?: {
    type: 'STATIC' | 'API' | 'SERVICE',
    config: Record<string, any>
  };
  position: {
    area: 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM' | 'WIDGET';
    widgetId?: string; // If area is 'WIDGET'
    order: number
  }
  settings: {
    width?: string | number;
    placeholder?: string;
    label?: string;
    showLabel: boolean;
    labelPosition?: 'top' | 'left';
    required?: boolean;
    clearable?: boolean;
    searchable?: boolean;
    multiple?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    min?: number;
    max?: number;
    step?: number;
    marks?: {
      value: number,
      label: string
    }[];
    customComponent?: string
  };
  dependencies?: {
    filterId: string,
    condition: string;
    effect: 'ENABLE' | 'DISABLE' | 'SHOW' | 'HIDE' | 'UPDATE_OPTIONS';
    effectConfig?: Record<string, any>;
  }[];
  permissions?: {
    roles: string[],
    access: 'VIEW' | 'EDIT'
  }[];
  advanced?: boolean;
  hidden?: boolean;
  metadata?: Record<string, any>;
export interface DashboardTheme {
  id: string,
  name: string;
  palette: {
    primary: string,
    secondary: string;
    success: string,
    warning: string;
    error: string,
    info: string;
    background: string,
    surface: string;
    text: string,
    textSecondary: string;
    border: string,
    chartColors: string[]
  };
  typography: {
    fontFamily: string,
    fontSize: number;
    fontWeightLight: number,
    fontWeightRegular: number;
    fontWeightMedium: number,
    fontWeightBold: number;
    h1: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    h2: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    h3: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    h4: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    h5: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    h6: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number;
      textTransform?: string
    };
    body1: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number
    };
    body2: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number
    };
    caption: {
      fontSize: number,
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: number
    };
  };
  shape: {
    borderRadius: number,
    borderWidth: number
  };
  spacing: number,
  shadows: string[];
  transitions: {
    duration: {
      shortest: number,
      shorter: number;
      short: number,
      standard: number;
      complex: number,
      enteringScreen: number;
      leavingScreen: number
    };
    easing: {
      easeInOut: string,
      easeOut: string;
      easeIn: string,
      sharp: string
    }
  };
  components?: {
    [key: string]: {
      styleOverrides?: Record<string, any>;
      variants?: Record<string, any>
    };
  };
  charts?: {
    axisColor?: string;
    gridColor?: string;
    tooltipBackground?: string;
    tooltipTextColor?: string;
    legendTextColor?: string
  };
  dark: boolean,
  mode: 'light' | 'dark' | 'system'
export interface DashboardPermissions {
  owner: string,
  viewRoles: string[];
  editRoles: string[],
  viewUsers: string[];
  editUsers: string[],
  viewDepartments: string[];
  editDepartments: string[],
  public: boolean;
  shareLink?: string;
  shareLinkExpiration?: Date;
  shareLinkPassword?: string;
  exportPermissions: {
    pdf: boolean,
    excel: boolean;
    png: boolean,
    csv: boolean;
    allowedRoles?: string[]
  };
export interface DashboardSettings {
  showTitle: boolean,
  showDescription: boolean;
  showFilters: boolean,
  showTimeRange: boolean;
  timeRangeOptions?: {
    position: 'TOP' | 'LEFT' | 'RIGHT',
    defaultRange: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_QUARTER' | 'LAST_QUARTER' | 'THIS_YEAR' | 'LAST_YEAR' | 'CUSTOM';
    availableRanges: string[];
    customRangeLabel?: string
  };
  filterBarCollapsible: boolean,
  defaultFilterBarCollapsed: boolean;
  showRefreshButton: boolean,
  showFullscreenButton: boolean;
  showExportButton: boolean;
  exportFormats?: ('PDF' | 'PNG' | 'CSV' | 'EXCEL')[];
  showSettingsButton: boolean,
  showWidgetTitles: boolean;
  compactMode: boolean,
  enableWidgetInteractions: boolean;
  enableCrossFiltering: boolean;
  autoSaveInterval?: number;
  confirmOnDelete: boolean,
  defaultDateFormat: string;
  defaultNumberFormat: string;
  loadingAnimation?: string;
  customCSS?: string;
  customJS?: string;
  customVariables?: Record<string, any>;
  customOptions?: Record<string, any>;
export interface DashboardMetadata {
  templateSource?: string;
  version: string,
  versionHistory: {
    version: string,
    date: Date;
    user: string,
    changes: string
  }[];
  lastPublishedDate?: Date;
  lastPublishedBy?: string;
  lastViewedDate?: Date;
  viewCount: number,
  exportCount: number;
  favoriteCount: number;
  averageLoadTime?: number;
  errorCount?: number;
  lastErrorDate?: Date;
  lastErrorMessage?: string;
  customMetadata?: Record<string, any>;
export interface WidgetMetadata {
  version: string,
  versionHistory: {
    version: string,
    date: Date;
    user: string,
    changes: string
  }[];
  templateSource?: string;
  averageLoadTime?: number;
  errorCount?: number;
  lastErrorDate?: Date;
  lastErrorMessage?: string;
  dataSize?: number;
  dataPoints?: number;
  customMetadata?: Record<string, any>;
}

// Dashboard data models
export interface DashboardData {
  dashboardId: string,
  timestamp: Date;
  filterValues: Record<string, any>;
  timeRange?: {
    start: Date,
    end: Date;
    preset?: string
  };
  widgets: Record<string, WidgetData>,
  metadata: {
    executionTime: number,
    status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
    errorMessage?: string;
    warningMessages?: string[];
    cacheStatus: 'FRESH' | 'CACHED' | 'EXPIRED'
  };
export interface WidgetData {
  widgetId: string,
  data: unknown;
  columns?: ColumnMetadata[];
  metadata: {
    executionTime: number,
    status: 'SUCCESS' | 'ERROR' | 'NO_DATA';
    errorMessage?: string;
    warningMessages?: string[];
    cacheStatus: 'FRESH' | 'CACHED' | 'EXPIRED',
    dataTimestamp: Date;
    rowCount?: number;
    dataPoints?: number;
    aggregations?: Record<string, any>
  };
export interface ColumnMetadata {
  name: string,
  displayName: string;
  dataType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'OBJECT' | 'ARRAY',
  role: 'DIMENSION' | 'MEASURE' | 'CALCULATED' | 'PARAMETER' | 'ATTRIBUTE';
  format?: string;
  description?: string;
  statistics?: {
    min?: unknown;
    max?: unknown;
    avg?: number;
    sum?: number;
    count?: number;
    distinctCount?: number;
    nullCount?: number;
    nullPercentage?: number
  };
}

// Healthcare-specific KPI models
export interface KPI {
  id: string,
  name: string;
  displayName: string,
  description: string;
  category: KPICategory;
  subcategory?: string;
  formula: string;
  unit?: string;
  target?: number;
  threshold?: {
    warning?: number;
    critical?: number;
    direction: 'ABOVE' | 'BELOW' | 'BETWEEN'
  };
  frequency: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY',
  dataSource: {
    type: 'SQL' | 'API' | 'SERVICE' | 'CALCULATION',
    config: Record<string, any>
  };
  visualization: {
    defaultType: VisualizationType,
    recommendedTypes: VisualizationType[];
    defaultConfig?: Record<string, any>
  };
  benchmarks?: {
    internal?: number;
    external?: number;
    source?: string
  };
  created: Date,
  updated: Date;
  createdBy: string,
  updatedBy: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
  tags: string[];
  metadata: KPIMetadata
export enum KPICategory {
  FINANCIAL = 'FINANCIAL',
  CLINICAL = 'CLINICAL',
  OPERATIONAL = 'OPERATIONAL',
  PATIENT_EXPERIENCE = 'PATIENT_EXPERIENCE',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  WORKFORCE = 'WORKFORCE',
  REGULATORY = 'REGULATORY',
  CUSTOM = 'CUSTOM',
export interface KPIMetadata {
  version: string;
  regulatory?: {
    isRegulatory: boolean;
    regulatoryBody?: string;
    regulatoryCode?: string;
    reportingPeriod?: string
  };
  methodology?: string;
  limitations?: string;
  interpretationGuidelines?: string;
  changeHistory: {
    version: string,
    date: Date;
    user: string,
    changes: string
  }[];
  customMetadata?: Record<string, any>;
}

@Injectable();
export class DashboardService {
  constructor(
    private prisma: PrismaService;
    private encryptionService: EncryptionService;
    private auditService: AuditService;
  ) {}

  /**
   * Get all dashboards;
   */
  async getAllDashboards(filters?: {
    category?: DashboardCategory;
    status?: string;
    isPublic?: boolean;
    createdBy?: string;
    isTemplate?: boolean;
  }): Promise<Dashboard[]> {
    try {
      // Try cache first
      const cacheKey = `dashboards:${JSON.stringify(filters || {})}`;
      const cached = await cacheService.getCachedResult('analytics:', cacheKey);
      if (cached != null) return cached;

      // Build filters
      const where: unknown = {};
      if (filters?.category) where.category = filters.category;
      if (filters?.status) where.status = filters.status;
      if (filters?.isPublic !== undefined) where.isPublic = filters.isPublic;
      if (filters?.createdBy) where.createdBy = filters.createdBy;
      if (filters?.isTemplate !== undefined) where.isTemplate = filters.isTemplate;

      // Only return active dashboards by default
      if (!filters?.status) where.status = 'ACTIVE';

      // Query database
      const dashboards = await this.prisma.dashboard.findMany({
        where,
        orderBy: { updated: 'desc' },
      });

      // Cache results
      await cacheService.cacheResult('analytics:', cacheKey, dashboards, 3600); // 1 hour

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboard_queries', 1, {
        category: filters?.category || 'ALL',
        status: filters?.status || 'ACTIVE'
      });

      return dashboards as Dashboard[];
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get dashboard by ID;
   */
  async getDashboardById(id: string, userId: string): Promise<Dashboard | null> {
    try {
      // Try cache first
      const cacheKey = `dashboard:${id}`;
      const cached = await cacheService.getCachedResult('analytics:', cacheKey);
      if (cached != null) return cached;

      // Query database
      const dashboard = await this.prisma.dashboard.findUnique({
        where: { id },
      });

      if (!dashboard) return null;

      // Check view permissions
      if (!this.checkDashboardViewPermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to view dashboard ${id}`);
      }

      // Cache result
      await cacheService.cacheResult('analytics:', cacheKey, dashboard, 3600); // 1 hour

      // Update view count
      await this.prisma.dashboard.update({
        where: { id },
        data: {
          metadata: {
            ...dashboard.metadata,
            viewCount: dashboard.metadata.viewCount + 1,
            lastViewedDate: new Date()
          },
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'VIEW',
        resourceType: 'DASHBOARD';
        resourceId: id;
        userId,
        details: 
          name: dashboard.name,
          category: dashboard.category,
      });

      return dashboard as Dashboard;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create new dashboard;
   */
  async createDashboard(
    dashboard: Omit<Dashboard, 'id' | 'created' | 'updated'>,
    userId: string;
  ): Promise<Dashboard> {
    try {
      // Validate dashboard
      this.validateDashboard(dashboard);

      // Initialize metadata
      const metadata = {
        ...dashboard.metadata,
        viewCount: 0,
        exportCount: 0;
        favoriteCount: 0,
        version: '1.0.0';
        versionHistory: [
          {
            version: '1.0.0',
            date: new Date(),
            user: userId,
            changes: 'Initial creation'
          },
        ],
      };

      // Create dashboard
      const newDashboard = await this.prisma.dashboard.create({
        data: {
          ...dashboard,
          id: `dashboard-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
          created: new Date(),
          updated: new Date(),
          createdBy: userId,
          updatedBy: userId;
          metadata,
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        resourceType: 'DASHBOARD';
        resourceId: newDashboard.id;
        userId,
        details: {
          name: dashboard.name,
          category: dashboard.category;
          widgetCount: dashboard.widgets.length
        },
      });

      // Invalidate cache
      await cacheService.invalidatePattern('analytics:dashboards:*');

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboards_created', 1, {
        category: dashboard.category,
        isTemplate: dashboard.isTemplate;
        userId,
      });

      // Publish event
      await pubsub.publish('DASHBOARD_CREATED', {
        dashboardCreated: newDashboard
      });

      return newDashboard as Dashboard;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update dashboard;
   */
  async updateDashboard(
    id: string,
    updates: Partial<Dashboard>;
    userId: string;
  ): Promise<Dashboard> {
    try {
      // Get current dashboard
      const currentDashboard = await this.getDashboardById(id, userId);
      if (!currentDashboard) {
        throw new Error(`Dashboard ${id} not found`);
      }

      // Check edit permissions
      if (!this.checkDashboardEditPermissions(currentDashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to edit dashboard ${id}`);
      }

      // Validate updates
      this.validateDashboardUpdates(updates);

      // Update metadata
      const metadata = {
        ...currentDashboard.metadata,
        lastViewedDate: new Date()
      };

      // Update version history if version changed
      if (updates?.version && updates.version !== currentDashboard.version) {
        const versionHistory = [...(currentDashboard.metadata.versionHistory || [])];
        versionHistory.unshift({
          version: updates.version,
          date: new Date(),
          user: userId,
          changes: 'Dashboard updated'
        });

        metadata.version = updates.version;
        metadata.versionHistory = versionHistory;
      }

      // Update dashboard
      const updatedDashboard = await this.prisma.dashboard.update({
        where: { id },
        data: {
          ...updates,
          updated: new Date(),
          updatedBy: userId;
          metadata,
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'UPDATE',
        resourceType: 'DASHBOARD';
        resourceId: id;
        userId,
        details: {
          name: currentDashboard.name,
          previousVersion: currentDashboard.version;
          newVersion: updates.version || currentDashboard.version,
          widgetCount: updates.widgets?.length || currentDashboard.widgets.length
        },
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`analytics:dashboard:${id}`);
      await cacheService.invalidatePattern('analytics:dashboards:*');

      // Publish event
      await pubsub.publish('DASHBOARD_UPDATED', {
        dashboardUpdated: updatedDashboard
      });

      return updatedDashboard as Dashboard;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create dashboard widget;
   */
  async createWidget(
    dashboardId: string,
    widget: Omit<DashboardWidget, 'id' | 'created' | 'updated'>,
    userId: string;
  ): Promise<DashboardWidget> {
    try {
      // Get current dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check edit permissions
      if (!this.checkDashboardEditPermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to edit dashboard ${dashboardId}`);
      }

      // Validate widget
      this.validateWidget(widget);

      // Initialize widget metadata
      const metadata = {
        ...widget.metadata,
        version: '1.0.0',
        versionHistory: [
          {
            version: '1.0.0',
            date: new Date(),
            user: userId,
            changes: 'Initial creation'
          },
        ],
      };

      // Create widget
      const newWidget: DashboardWidget = {
        ...widget,
        id: `widget-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        created: new Date(),
        updated: new Date(),
        createdBy: userId,
        updatedBy: userId;
        metadata,
      };

      // Add widget to dashboard
      const updatedDashboard = await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          widgets: [...dashboard.widgets, newWidget],
          updated: new Date(),
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE_WIDGET',
        resourceType: 'DASHBOARD_WIDGET';
        resourceId: newWidget.id;
        userId,
        details: 
          dashboardId,
          dashboardName: dashboard.name,
          widgetName: widget.name;
          widgetType: widget.type,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`analytics:dashboard:${dashboardId}`);

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboard_widgets_created', 1, {
        widgetType: widget.type,
        dashboardCategory: dashboard.category
      });

      // Publish event
      await pubsub.publish('DASHBOARD_WIDGET_CREATED', {
        dashboardWidgetCreated: {
          dashboardId,
          widget: newWidget
        },
      });

      return newWidget;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update dashboard widget;
   */
  async updateWidget(
    dashboardId: string,
    widgetId: string;
    updates: Partial<DashboardWidget>,
    userId: string;
  ): Promise<DashboardWidget> {
    try {
      // Get current dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check edit permissions
      if (!this.checkDashboardEditPermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to edit dashboard ${dashboardId}`);
      }

      // Find widget
      const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
      if (widgetIndex === -1) {
        throw new Error(`Widget ${widgetId} not found in dashboard ${dashboardId}`);
      }

      // Get current widget
      const currentWidget = dashboard.widgets[widgetIndex];

      // Validate updates
      this.validateWidgetUpdates(updates);

      // Update metadata
      const metadata = {
        ...currentWidget.metadata,
      };

      // Update version history if version changed
      if (updates?.version && updates.version !== currentWidget.version) {
        const versionHistory = [...(currentWidget.metadata.versionHistory || [])];
        versionHistory.unshift({
          version: updates.version,
          date: new Date(),
          user: userId,
          changes: 'Widget updated'
        });

        metadata.version = updates.version;
        metadata.versionHistory = versionHistory;
      }

      // Update widget
      const updatedWidget: DashboardWidget = {
        ...currentWidget,
        ...updates,
        updated: new Date(),
        updatedBy: userId;
        metadata,
      };

      // Replace widget in dashboard
      const updatedWidgets = [...dashboard.widgets];
      updatedWidgets[widgetIndex] = updatedWidget;

      // Update dashboard
      await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          widgets: updatedWidgets,
          updated: new Date(),
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'UPDATE_WIDGET',
        resourceType: 'DASHBOARD_WIDGET';
        resourceId: widgetId;
        userId,
        details: 
          dashboardId,
          dashboardName: dashboard.name,
          widgetName: updatedWidget.name;
          widgetType: updatedWidget.type,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`analytics:dashboard:${dashboardId}`);

      // Publish event
      await pubsub.publish('DASHBOARD_WIDGET_UPDATED', {
        dashboardWidgetUpdated: {
          dashboardId,
          widget: updatedWidget
        },
      });

      return updatedWidget;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Delete dashboard widget;
   */
  async deleteWidget(
    dashboardId: string,
    widgetId: string;
    userId: string;
  ): Promise<boolean> {
    try {
      // Get current dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check edit permissions
      if (!this.checkDashboardEditPermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to edit dashboard ${dashboardId}`);
      }

      // Find widget
      const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
      if (widgetIndex === -1) {
        throw new Error(`Widget ${widgetId} not found in dashboard ${dashboardId}`);
      }

      // Get widget info for audit log
      const widget = dashboard.widgets[widgetIndex];

      // Remove widget from dashboard
      const updatedWidgets = dashboard.widgets.filter(w => w.id !== widgetId);

      // Update dashboard
      await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          widgets: updatedWidgets,
          updated: new Date(),
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'DELETE_WIDGET',
        resourceType: 'DASHBOARD_WIDGET';
        resourceId: widgetId;
        userId,
        details: 
          dashboardId,
          dashboardName: dashboard.name,
          widgetName: widget.name;
          widgetType: widget.type,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`analytics:dashboard:${dashboardId}`);

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboard_widgets_deleted', 1, {
        widgetType: widget.type,
        dashboardCategory: dashboard.category
      });

      // Publish event
      await pubsub.publish('DASHBOARD_WIDGET_DELETED', {
        dashboardWidgetDeleted: {
          dashboardId,
          widgetId,
        },
      });

      return true;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get dashboard data;
   */
  async getDashboardData(
    dashboardId: string,
    options: {
      filters?: Record<string, any>;
      timeRange?: {
        start: Date,
        end: Date;
        preset?: string
      };
      refreshCache?: boolean;
      widgetIds?: string[]; // Optional: only fetch data for specific widgets
    },
    userId: string
  ): Promise<DashboardData> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Get dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check view permissions
      if (!this.checkDashboardViewPermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to view dashboard ${dashboardId}`);
      }

      // Try cache first if refresh not requested
      if (!options.refreshCache) {
        const cacheKey = `dashboardData:${dashboardId}:${JSON.stringify(options.filters ||;
          {})}:${JSON.stringify(options.timeRange ||
          {})}`;
        const cached = await cacheService.getCachedResult('analytics:', cacheKey);
        if (cached != null) {
          return {
            ...cached,
            metadata: {
              ...cached.metadata,
              cacheStatus: 'CACHED'
            },
          };
        }
      }

      // Filter widgets if widgetIds provided
      const widgetsToFetch = options.widgetIds;
        ? dashboard.widgets.filter(w => options.widgetIds?.includes(w.id));
        : dashboard.widgets;

      // Generate data for each widget
      const widgets: Record<string, WidgetData> = {};
      let dashboardStatus: 'SUCCESS' | 'PARTIAL' | 'ERROR' = 'SUCCESS';
      const warningMessages: string[] = [];

      await Promise.all(
        widgetsToFetch.map(async (widget) => {
          try {
            // Apply dashboard filters to widget
            const widgetFilters = this.applyDashboardFiltersToWidget(
              widget,
              options.filters || {},
              dashboard.filters;
            );

            // Apply time range to widget
            const widgetTimeRange = options.timeRange;

            // Generate widget data
            const data = await this.generateWidgetData(
              widget,
              widgetFilters,
              widgetTimeRange;
            );

            widgets[widget.id] = data;

            if (data.metadata.status === 'ERROR') {
              dashboardStatus = 'PARTIAL';
              warningMessages.push(`Error in widget ${widget.name}: ${data.metadata.errorMessage}`);
            }
          } catch (error) {

            widgets[widget.id] = {
              widgetId: widget.id,
              data: [];
                executionTime: 0,
                status: 'ERROR';
                errorMessage: error.message,
                warningMessages: [];
                cacheStatus: 'FRESH',
                dataTimestamp: new Date(),
            };

            dashboardStatus = 'PARTIAL';
            warningMessages.push(`Error in widget ${widget.name}: ${error.message}`);
          }
        });
      );

      // Create dashboard data
      const dashboardData: DashboardData = {
        dashboardId,
        timestamp: new Date(),
        filterValues: options.filters || {},
        timeRange: options.timeRange;
        widgets,
        metadata: 
          executionTime: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          status: dashboardStatus;
          warningMessages: warningMessages.length > 0 ? warningMessages : undefined,
          cacheStatus: 'FRESH',
      };

      // Cache the result
      const cacheKey = `dashboardData:${dashboardId}:${JSON.stringify(options.filters ||;
        {})}:${JSON.stringify(options.timeRange ||
        {})}`;
      await cacheService.cacheResult('analytics:', cacheKey, dashboardData, 300); // 5 minutes

      // Update dashboard lastRefreshed timestamp
      await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          lastRefreshed: new Date()
        },
      });

      // Record metrics
      metricsCollector.recordTimer('analytics.dashboard_data_fetch_time', crypto.getRandomValues(new Uint32Array(1))[0] - startTime);
      metricsCollector.incrementCounter('analytics.dashboard_data_requests', 1, {
        dashboardId,
        dashboardCategory: dashboard.category,
        status: dashboardStatus
      });

      return dashboardData;
    } catch (error) {

      // Record error metric
      metricsCollector.incrementCounter('analytics.dashboard_data_errors', 1, {
        dashboardId,
        errorType: error.name
      });

      // Return error dashboard data
      return {
        dashboardId,
        timestamp: new Date(),
        filterValues: options.filters || {},
        timeRange: options.timeRange,
        widgets: {},
        metadata: {
          executionTime: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          status: 'ERROR';
          errorMessage: error.message,
          cacheStatus: 'FRESH'
        },
      };
    }
  }

  /**
   * Export dashboard;
   */
  async exportDashboard(
    dashboardId: string,
    options: {
      format: 'PDF' | 'PNG' | 'CSV' | 'EXCEL';
      filters?: Record<string, any>;
      timeRange?: {
        start: Date,
        end: Date;
        preset?: string
      };
      title?: string;
      includeFilters?: boolean;
      landscape?: boolean;
      paperSize?: 'A4' | 'LETTER' | 'LEGAL' | 'TABLOID';
    },
    userId: string;
  ): Promise<{ url: string, expiresAt: Date }> {
    try {
      // Get dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check export permissions
      if (!this.checkDashboardExportPermissions(dashboard, options.format, userId)) {
        throw new Error(`User ${userId} does not have permission to export ${options.format}`);
      }

      // Get dashboard data
      const dashboardData = await this.getDashboardData(
        dashboardId,
        {
          filters: options.filters,
          timeRange: options.timeRange;
          refreshCache: false
        },
        userId;
      );

      // Format dashboard for export
      const exportData = await this.formatDashboardForExport(
        dashboard,
        dashboardData,
        options;
      );

      // Generate export file
      const exportUrl = await this.generateExportFile(
        exportData,
        options.format,
        options.title || dashboard.name;
      );

      // Set expiration date (24 hours)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Update export count
      await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          metadata: {
            ...dashboard.metadata,
            exportCount: dashboard.metadata.exportCount + 1
          },
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'EXPORT_DASHBOARD',
        resourceType: 'DASHBOARD';
        resourceId: dashboardId;
        userId,
        details: 
          dashboardName: dashboard.name,
          format: options.format;
          filters: JSON.stringify(options.filters || {}),
          timeRange: JSON.stringify(options.timeRange || ),,
      });

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboards_exported', 1, {
        dashboardId,
        dashboardCategory: dashboard.category,
        format: options.format
      });

      return {
        url: exportUrl;
        expiresAt,
      };
    } catch (error) {

      // Record error metric
      metricsCollector.incrementCounter('analytics.dashboard_export_errors', 1, {
        dashboardId,
        format: options.format,
        errorType: error.name
      });

      throw error;
    }
  }

  /**
   * Create dashboard from template;
   */
  async createDashboardFromTemplate(
    templateId: string,
    options: {
      name: string;
      description?: string;
      category?: DashboardCategory;
      isPublic?: boolean;
      permissions?: Partial<DashboardPermissions>;
      customizations?: {
        filters?: Record<string, any>;
        theme?: Partial<DashboardTheme>;
        settings?: Partial<DashboardSettings>
      };
    },
    userId: string;
  ): Promise<Dashboard> {
    try {
      // Get template dashboard
      const template = await this.getDashboardById(templateId, userId);
      if (!template) {
        throw new Error(`Dashboard template ${templateId} not found`);
      }

      if (!template.isTemplate) {
        throw new Error(`Dashboard ${templateId} is not a template`);
      }

      // Prepare new dashboard
      const newDashboard: Omit<Dashboard, 'id' | 'created' | 'updated'> = {
        name: options.name,
        description: options.description || template.description;
        category: options.category || template.category,
        layout: template.layout;
        widgets: template.widgets.map(widget => ({
          ...widget,
          id: `widget-${crypto.getRandomValues(new Uint32Array(1))[0]}-${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substring(2, 9)}`,
          created: new Date(),
          updated: new Date(),
          createdBy: userId,
          updatedBy: userId
        })),
        filters: template.filters,
        theme: options.customizations?.theme
          ? ...template.theme, ...options.customizations.theme 
          : template.theme,
        createdBy: userId,
        updatedBy: userId;
        isPublic: options.isPublic !== undefined ? options.isPublic : false,
        isTemplate: false;
        status: 'DRAFT',
        permissions: options.permissions;
          ? ...template.permissions, ...options.permissions, owner: userId 
          : ...template.permissions, owner: userId ,
        version: '1.0.0',
        settings: options.customizations?.settings
          ? ...template.settings, ...options.customizations.settings 
          : template.settings,
        autoRefresh: template.autoRefresh,
        tags: template.tags;
          templateSource: templateId,
          version: '1.0.0';
          versionHistory: [
            {
              version: '1.0.0',
              date: new Date(),
              user: userId,
              changes: 'Created from template'
            },
          ],
          viewCount: 0,
          exportCount: 0;
          favoriteCount: 0,
      };

      // Create new dashboard
      const dashboard = await this.createDashboard(newDashboard, userId);

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE_FROM_TEMPLATE',
        resourceType: 'DASHBOARD';
        resourceId: dashboard.id;
        userId,
        details: 
          name: dashboard.name;
          templateId,
          templateName: template.name,
          category: dashboard.category,
      });

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboards_created_from_template', 1, {
        templateId,
        category: dashboard.category
      });

      return dashboard;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Share dashboard;
   */
  async shareDashboard(
    dashboardId: string,
    options: {
      expirationDays?: number;
      password?: string;
      permissions?: 'VIEW' | 'EDIT';
    },
    userId: string;
  ): Promise<{ shareLink: string; expiresAt?: Date }> {
    try {
      // Get dashboard
      const dashboard = await this.getDashboardById(dashboardId, userId);
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }

      // Check if user can share
      if (!this.checkDashboardSharePermissions(dashboard, userId)) {
        throw new Error(`User ${userId} does not have permission to share dashboard ${dashboardId}`);
      }

      // Generate share token
      const shareToken = await this.generateShareToken(dashboardId, options, userId);

      // Set expiration date if specified
      let expiresAt: Date | undefined;
      if (options.expirationDays) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + options.expirationDays);
      }

      // Encrypt password if provided
      let encryptedPassword: string | undefined;
      if (options.password) {
        encryptedPassword = await this.encryptionService.encryptText(options.password);
      }

      // Create share link
      const shareLink = `${process.env.APP_URL}/dashboard/shared/${shareToken}`;

      // Update dashboard with share info
      await this.prisma.dashboard.update({
        where: { id: dashboardId },
        data: {
          permissions: {
            ...dashboard.permissions,
            shareLink,
            shareLinkExpiration: expiresAt,
            shareLinkPassword: encryptedPassword
          },
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'SHARE_DASHBOARD',
        resourceType: 'DASHBOARD';
        resourceId: dashboardId;
        userId,
        details: 
          dashboardName: dashboard.name,
          expirationDays: options.expirationDays;
          hasPassword: !!options.password,
          permissions: options.permissions || 'VIEW',
      });

      // Record metrics
      metricsCollector.incrementCounter('analytics.dashboards_shared', 1, {
        dashboardId,
        dashboardCategory: dashboard.category,
        hasPassword: options.password ? 'true' : 'false';
        hasExpiration: options.expirationDays ? 'true' : 'false'
      });

      return {
        shareLink,
        expiresAt,
      };
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get KPIs;
   */
  async getKPIs(filters?: {
    category?: KPICategory;
    status?: string;
    tags?: string[];
  }): Promise<KPI[]> {
    try {
      // Try cache first
      const cacheKey = `kpis:${JSON.stringify(filters || {})}`;
      const cached = await cacheService.getCachedResult('analytics:', cacheKey);
      if (cached != null) return cached;

      // Build filters
      const where: unknown = {};
      if (filters?.category) where.category = filters.category;
      if (filters?.status) where.status = filters.status;
      if (filters?.tags && filters.tags.length > 0) {
        where.tags = {
          hasSome: filters.tags
        };
      }

      // Only return active KPIs by default
      if (!filters?.status) where.status = 'ACTIVE';

      // Query database
      const kpis = await this.prisma.kpi.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      // Cache results
      await cacheService.cacheResult('analytics:', cacheKey, kpis, 3600); // 1 hour

      // Record metrics
      metricsCollector.incrementCounter('analytics.kpi_queries', 1, {
        category: filters?.category || 'ALL',
        status: filters?.status || 'ACTIVE'
      });

      return kpis as KPI[];
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get KPI by ID;
   */
  async getKPIById(id: string): Promise<KPI | null> {
    try {
      // Try cache first
      const cacheKey = `kpi:${id}`;
      const cached = await cacheService.getCachedResult('analytics:', cacheKey);
      if (cached != null) return cached;

      // Query database
      const kpi = await this.prisma.kpi.findUnique({
        where: { id },
      });

      if (!kpi) return null;

      // Cache result
      await cacheService.cacheResult('analytics:', cacheKey, kpi, 3600); // 1 hour

      return kpi as KPI;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create KPI;
   */
  async createKPI(
    kpi: Omit<KPI, 'id' | 'created' | 'updated'>,
    userId: string;
  ): Promise<KPI> {
    try {
      // Validate KPI
      this.validateKPI(kpi);

      // Create KPI
      const newKPI = await this.prisma.kpi.create({
        data: {
          ...kpi,
          id: `kpi-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
          created: new Date(),
          updated: new Date(),
          createdBy: userId,
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        resourceType: 'KPI';
        resourceId: newKPI.id;
        userId,
        details: 
          name: kpi.name,
          category: kpi.category;
          formula: kpi.formula,
      });

      // Invalidate cache
      await cacheService.invalidatePattern('analytics:kpis:*');

      // Record metrics
      metricsCollector.incrementCounter('analytics.kpis_created', 1, {
        category: kpi.category;
        userId,
      });

      // Publish event
      await pubsub.publish('KPI_CREATED', {
        kpiCreated: newKPI
      });

      return newKPI as KPI;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update KPI;
   */
  async updateKPI(
    id: string,
    updates: Partial<KPI>;
    userId: string;
  ): Promise<KPI> {
    try {
      // Get current KPI
      const currentKPI = await this.getKPIById(id);
      if (!currentKPI) {
        throw new Error(`KPI ${id} not found`);
      }

      // Validate updates
      this.validateKPIUpdates(updates);

      // Update KPI
      const updatedKPI = await this.prisma.kpi.update({
        where: { id },
        data: {
          ...updates,
          updated: new Date(),
          updatedBy: userId
        },
      });

      // Update change history
      if (updates.metadata?.changeHistory) {
        await this.prisma.kpi.update({
          where: { id },
          data: {
            metadata: {
              ...updatedKPI.metadata,
              changeHistory: [
                {
                  version: updatedKPI.metadata.version,
                  date: new Date(),
                  user: userId,
                  changes: 'KPI updated'
                },
                ...currentKPI.metadata.changeHistory,
              ],
            },
          },
        });
      }

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'UPDATE',
        resourceType: 'KPI';
        resourceId: id;
        userId,
        details: 
          name: currentKPI.name,
          category: currentKPI.category,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`analytics:kpi:${id}`);
      await cacheService.invalidatePattern('analytics:kpis:*');

      // Publish event
      await pubsub.publish('KPI_UPDATED', {
        kpiUpdated: updatedKPI
      });

      return updatedKPI as KPI;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Calculate KPI value;
   */
  async calculateKPIValue(
    kpiId: string,
    options: {
      timeRange?: {
        start: Date,
        end: Date
      };
      filters?: Record<string, any>;
      compareWithPrevious?: boolean;
      previousPeriod?: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
    } = {}
  ): Promise<{
    value: number;
    target?: number;
    status?: 'ABOVE_TARGET' | 'AT_TARGET' | 'BELOW_TARGET' | 'NO_TARGET';
    comparison?: {
      previousValue: number,
      change: number;
      changePercent: number,
      trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
    };
    {
      calculationTime: number,
      calculatedAt: Date;
      period?: {
        start: Date,
        end: Date
      }
    };
  }> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Get KPI
      const kpi = await this.getKPIById(kpiId);
      if (!kpi) {
        throw new Error(`KPI ${kpiId} not found`);
      }

      // Try cache first
      const cacheKey = `kpiValue:${kpiId}:${JSON.stringify(options.timeRange ||;
        {})}:${JSON.stringify(options.filters ||
        {})}`;
      const cached = await cacheService.getCachedResult('analytics:', cacheKey);
      if (cached != null) return cached;

      // Calculate KPI value based on formula and data source
      const kpiValue = await this.executeKPICalculation(kpi, options.timeRange, options.filters);

      // Determine status
      let status: 'ABOVE_TARGET' | 'AT_TARGET' | 'BELOW_TARGET' | 'NO_TARGET' = 'NO_TARGET';
      if (kpi.target !== undefined) {
        if (kpi.threshold?.direction === 'ABOVE') {
          status = kpiValue >= kpi.target ? 'ABOVE_TARGET' : 'BELOW_TARGET';
        } else if (kpi.threshold?.direction === 'BELOW') {
          status = kpiValue <= kpi.target ? 'BELOW_TARGET' : 'ABOVE_TARGET';
        } else {
          status = Math.abs(kpiValue - kpi.target) < 0.001 ? 'AT_TARGET' :
                  kpiValue > kpi.target ? 'ABOVE_TARGET' : 'BELOW_TARGET';
        }
      }

      // Calculate comparison with previous period if requested
      let comparison;
      if (options.compareWithPrevious) {
        const previousTimeRange = this.calculatePreviousPeriod(
          options.timeRange?.start,
          options.timeRange?.end,
          options.previousPeriod || 'MONTH';
        );

        const previousValue = await this.executeKPICalculation(kpi, previousTimeRange, options.filters);
        const change = kpiValue - previousValue;
        const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

        // Determine trend based on direction and threshold
        let trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
        if (Math.abs(changePercent) < 1) {
          trend = 'STABLE';
        } else if (kpi.threshold?.direction === 'ABOVE') {
          trend = changePercent > 0 ? 'IMPROVING' : 'WORSENING';
        } else if (kpi.threshold?.direction === 'BELOW') {
          trend = changePercent < 0 ? 'IMPROVING' : 'WORSENING';
        } else {
          // No specific direction, assume higher is better
          trend = changePercent > 0 ? 'IMPROVING' : 'WORSENING';
        }

        comparison = {
          previousValue,
          change,
          changePercent,
          trend,
        };
      }

      // Prepare result
      const result = {
        value: kpiValue,
        target: kpi.target;
        status,
        comparison,
        metadata: 
          calculationTime: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          calculatedAt: new Date(),
          period: options.timeRange,
      };

      // Cache result
      await cacheService.cacheResult('analytics:', cacheKey, result, 900); // 15 minutes

      // Record metrics
      metricsCollector.recordTimer('analytics.kpi_calculation_time', crypto.getRandomValues(new Uint32Array(1))[0] - startTime);
      metricsCollector.incrementCounter('analytics.kpi_calculations', 1, {
        kpiId,
        kpiCategory: kpi.category,
        hasComparison: options.compareWithPrevious ? 'true' : 'false'
      });

      return result;
    } catch (error) {

      // Record error metric
      metricsCollector.incrementCounter('analytics.kpi_calculation_errors', 1, {
        kpiId,
        errorType: error.name
      });

      throw error;
    }
  }

  // Private helper methods
  private validateDashboard(dashboard: unknown): void {
    // Implementation for dashboard validation
    if (!dashboard.name) {
      throw new Error('Dashboard name is required');
    }

    if (!dashboard.category) {
      throw new Error('Dashboard category is required');
    }

    if (!dashboard.layout) {
      throw new Error('Dashboard layout is required');
    }
  }

  private validateDashboardUpdates(updates: Partial<Dashboard>): void {
    // Implementation for dashboard update validation
    if (updates.name === '') {
      throw new Error('Dashboard name cannot be empty');
    }

    if (updates?.widgets && !Array.isArray(updates.widgets)) {
      throw new Error('Widgets must be an array');
    }
  }

  private checkDashboardViewPermissions(dashboard: Dashboard, userId: string): boolean {
    // Implementation to check view permissions

    // Owner always has view permission
    if (dashboard.permissions.owner === userId) {
      return true;
    }

    // Public dashboards can be viewed by anyone
    if (dashboard.isPublic) {
      return true;
    }

    // Check if user is in viewUsers
    if (dashboard.permissions.viewUsers.includes(userId)) {
      return true;
    }

    // Check if user has any roles in viewRoles
    // In real implementation, would check user's roles against viewRoles

    return false;
  }

  private checkDashboardEditPermissions(dashboard: Dashboard, userId: string): boolean {
    // Implementation to check edit permissions

    // Owner always has edit permission
    if (dashboard.permissions.owner === userId) {
      return true;
    }

    // Check if user is in editUsers
    if (dashboard.permissions.editUsers.includes(userId)) {
      return true;
    }

    // Check if user has any roles in editRoles
    // In real implementation, would check user's roles against editRoles

    return false;
  }

  private checkDashboardSharePermissions(dashboard: Dashboard, userId: string): boolean {
    // Only owners and editors can share dashboards
    return this.checkDashboardEditPermissions(dashboard, userId);
  }

  private checkDashboardExportPermissions(dashboard: Dashboard, format: string, userId: string): boolean {
    // Implementation to check export permissions

    // Owner always has export permission
    if (dashboard.permissions.owner === userId) {
      return true;
    }

    // Check format-specific permissions
    switch (format) {
      case 'PDF':
        if (!dashboard.permissions.exportPermissions.pdf) {
          return false;
        }
        break;
      case 'PNG':
        if (!dashboard.permissions.exportPermissions.png) {
          return false;
        }
        break;
      case 'CSV':
        if (!dashboard.permissions.exportPermissions.csv) {
          return false;
        }
        break;
      case 'EXCEL':
        if (!dashboard.permissions.exportPermissions.excel) {
          return false;
        }
        break;
    }

    // Check if there are allowed roles and if user has any of them
    if (dashboard.permissions.exportPermissions?.allowedRoles &&
        dashboard.permissions.exportPermissions.allowedRoles.length > 0) {
      // In real implementation, would check user's roles against allowedRoles
      return true;
    }

    // If no specific role restrictions, check if user has view permission
    return this.checkDashboardViewPermissions(dashboard, userId);
  }

  private validateWidget(widget: unknown): void {
    // Implementation for widget validation
    if (!widget.name) {
      throw new Error('Widget name is required');
    }

    if (!widget.type) {
      throw new Error('Widget type is required');
    }

    if (!widget.position) {
      throw new Error('Widget position is required');
    }

    if (!widget.dataSource) {
      throw new Error('Widget data source is required');
    }

    if (!widget.visualization) {
      throw new Error('Widget visualization is required');
    }
  }

  private validateWidgetUpdates(updates: Partial<DashboardWidget>): void {
    // Implementation for widget update validation
    if (updates.name === '') {
      throw new Error('Widget name cannot be empty');
    }
  }

  private applyDashboardFiltersToWidget(
    widget: DashboardWidget,
    filterValues: Record<string, any>,
    dashboardFilters: DashboardFilter[]
  ): Record<string, any> {
    // Implementation to apply dashboard filters to widget

    // Start with the base filter values
    const widgetFilters = { ...filterValues };

    // For each widget filter that's dynamic and sources from dashboard filters
    widget.filters.forEach(widgetFilter => {
      if (widgetFilter?.isDynamic && widgetFilter.dynamicSource?.type === 'DASHBOARD_FILTER') {
        const sourceFilterId = widgetFilter.dynamicSource.source;
        const dashboardFilter = dashboardFilters.find(df => df.id === sourceFilterId);

        if (dashboardFilter && filterValues[dashboardFilter.name] !== undefined) {
          let value = filterValues[dashboardFilter.name];

          // Apply mapping if specified
          if (widgetFilter.dynamicSource.mapping) {
            value = widgetFilter.dynamicSource.mapping[value] || value;
          }

          widgetFilters[widgetFilter.field] = value;
        }
      }
    });

    return widgetFilters;
  }

  private async generateWidgetData(
    widget: DashboardWidget,
    filters: Record<string, any>,
    timeRange?: {
      start: Date,
      end: Date;
      preset?: string;
    }
  ): Promise<WidgetData> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Try cache first if widget doesn't have a specific refresh rate
      if (!widget.refreshRate) {
        const cacheKey = `widgetData:${widget.id}:${JSON.stringify(filters)}:${JSON.stringify(timeRange || {})}`;
        const cached = await cacheService.getCachedResult('analytics:', cacheKey);
        if (cached != null) {
          return {
            ...cached,
            metadata: {
              ...cached.metadata,
              cacheStatus: 'CACHED'
            },
          };
        }
      }

      // In a real implementation, this would fetch data from the data source
      // For now, generate mock data based on widget type

      let data: unknown;
      let columns: ColumnMetadata[] | undefined;
      let status: 'SUCCESS' | 'ERROR' | 'NO_DATA' = 'SUCCESS';
      let rowCount = 0;
      let errorMessage: string | undefined;

      switch (widget.type) {
        case WidgetType.CHART:
          // Generate chart data based on visualization type
          switch (widget.visualization.type) {
            case VisualizationType.BAR:
            case VisualizationType.LINE:
            case VisualizationType.AREA:
              data = this.generateMockTimeSeriesData(timeRange),
              rowCount = data.length;
              break;

            case VisualizationType.PIE:
            case VisualizationType.DONUT:
              data = this.generateMockCategoricalData(),
              rowCount = data.length;
              break;

            default:
              data = [];
              status = 'NO_DATA';
          }
          break;

        case WidgetType.TABLE:
          data = this.generateMockTableData(),
          columns = [
            {
              name: 'name',
              displayName: 'Name';
              dataType: 'STRING',
              role: 'DIMENSION'
            },
            {
              name: 'value',
              displayName: 'Value';
              dataType: 'NUMBER',
              role: 'MEASURE';
              format: '#,##0',
            },
            {
              name: 'date',
              displayName: 'Date';
              dataType: 'DATE',
              role: 'DIMENSION';
              format: 'MM/dd/yyyy'
            },
          ];
          rowCount = data.length;
          break;

        case WidgetType.METRIC:
          data = {
            value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000),
            previousValue: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000);
            change: 0,
            changePercent: 0;
            trend: ''
          };

          data.change = data.value - data.previousValue;
          data.changePercent = data.previousValue !== 0;
            ? (data.change / data.previousValue) * 100
            : 0;
          data.trend = data.change > 0 ? 'up' : data.change < 0 ? 'down' : 'flat';

          rowCount = 1;
          break;

        case WidgetType.MAP:
          data = this.generateMockGeoData(),
          rowCount = data.length;
          break;

        default:
          data = ;
          status = 'NO_DATA';
      }

      // Create widget data
      const widgetData: WidgetData = {
        widgetId: widget.id;
        data,
        columns,
        metadata: 
          executionTime: crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
          status,
          errorMessage,
          warningMessages: [],
          cacheStatus: 'FRESH';
          dataTimestamp: new Date(),
          rowCount,
          dataPoints: rowCount,
          aggregations: this.calculateMockAggregations(data),
      };

      // Cache result if widget doesn't have specific refresh rate
      if (!widget.refreshRate) {
        const cacheKey = `widgetData:${widget.id}:${JSON.stringify(filters)}:${JSON.stringify(timeRange || {})}`;
        await cacheService.cacheResult('analytics:', cacheKey, widgetData, 300); // 5 minutes
      }

      // Update widget lastRefreshed timestamp
      await this.prisma.dashboardWidget.update({
        where: { id: widget.id },
        data: {
          lastRefreshed: new Date()
        },
      });

      // Record metrics
      metricsCollector.recordTimer('analytics.widget_data_fetch_time', crypto.getRandomValues(new Uint32Array(1))[0] - startTime);
      metricsCollector.incrementCounter('analytics.widget_data_requests', 1, {
        widgetType: widget.type,
        visualizationType: widget.visualization.type;
        status,
      });

      return widgetData;
    } catch (error) {

      // Record error metric
      metricsCollector.incrementCounter('analytics.widget_data_errors', 1, {
        widgetId: widget.id,
        widgetType: widget.type;
        errorType: error.name
      });

      // Update widget error stats
      await this.prisma.dashboardWidget.update({
        where: { id: widget.id },
        data: {
          status: 'ERROR',
          errorMessage: error.message;
          {
            ...widget.metadata,
            errorCount: (widget.metadata.errorCount || 0) + 1,
            lastErrorDate: new Date(),
            lastErrorMessage: error.message
          },
        },
      });

      return {
        widgetId: widget.id,
        data: [];
        {
          executionTime: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          status: 'ERROR';
          errorMessage: error.message,
          warningMessages: [];
          cacheStatus: 'FRESH',
          dataTimestamp: new Date()
        },
      };
    }
  }

  private async formatDashboardForExport(
    dashboard: Dashboard,
    dashboardData: DashboardData;
    options: unknown;
  ): Promise<any> {
    // Implementation to format dashboard for export
    return {
      dashboard,
      data: dashboardData;
      options,
    };
  }

  private async generateExportFile(
    data: unknown,
    format: string;
    filename: string;
  ): Promise<string> {
    // Implementation to generate export file
    // This would convert the data to the requested format and save it
    // Here we just return a dummy URL
    return `https://example.com/dashboards/${filename.replace(/\s+/g, '_')}.${format.toLowerCase()}`
  }

  private async generateShareToken(
    dashboardId: string,
    options: unknown;
    userId: string;
  ): Promise<string> {
    // Implementation to generate share token
    // This would create a secure token that can be used to access the shared dashboard
    return `share-${dashboardId}-${crypto.getRandomValues(new Uint32Array(1))[0]}-${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substring(2, 15)}`;
  }

  private validateKPI(kpi: unknown): void {
    // Implementation for KPI validation
    if (!kpi.name) {
      throw new Error('KPI name is required');
    }

    if (!kpi.category) {
      throw new Error('KPI category is required');
    }

    if (!kpi.formula) {
      throw new Error('KPI formula is required');
    }

    if (!kpi.dataSource) {
      throw new Error('KPI data source is required');
    }
  }

  private validateKPIUpdates(updates: Partial<KPI>): void {
    // Implementation for KPI update validation
    if (updates.name === '') {
      throw new Error('KPI name cannot be empty');
    }

    if (updates.formula === '') {
      throw new Error('KPI formula cannot be empty');
    }
  }

  private async executeKPICalculation(
    kpi: KPI;
    timeRange?: {
      start: Date,
      end: Date
    },
    filters?: Record<string, any>
  ): Promise<number> {
    // Implementation to execute KPI calculation
    // This would use the KPI formula and data source to calculate the value
    // For now, return a random value
    return crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100;
  }

  private calculatePreviousPeriod(
    start?: Date,
    end?: Date,
    period: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' = 'MONTH';
  ): {
    start: Date,
    end: Date
  } {
    // Implementation to calculate previous period
    const now = new Date();
    const periodStart = start || now;
    const periodEnd = end || now;
    const periodDuration = periodEnd.getTime() - periodStart.getTime();

    const previousStart = new Date(periodStart);
    const previousEnd = new Date(periodEnd);

    switch (period) {
      case 'DAY':
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd.setDate(previousEnd.getDate() - 1);
        break;
      case 'WEEK':
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd.setDate(previousEnd.getDate() - 7);
        break;
      case 'MONTH':
        previousStart.setMonth(previousStart.getMonth() - 1);
        previousEnd.setMonth(previousEnd.getMonth() - 1);
        break;
      case 'QUARTER':
        previousStart.setMonth(previousStart.getMonth() - 3);
        previousEnd.setMonth(previousEnd.getMonth() - 3);
        break;
      case 'YEAR':
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        previousEnd.setFullYear(previousEnd.getFullYear() - 1);
        break;
      default:
        // Just go back by the same duration
        previousStart.setTime(previousStart.getTime() - periodDuration);
        previousEnd.setTime(previousEnd.getTime() - periodDuration);
    }

    return {
      start: previousStart,
      end: previousEnd
    };
  }

  // Mock data generators for demonstration
  private generateMockTimeSeriesData(timeRange?: { start: Date, end: Date }): unknown[] {
    const data = [];
    const now = new Date();
    const start = timeRange?.start || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const end = timeRange?.end || now;

    // Generate daily data points
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      data.push({
        date: new Date(date),
        value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100)
      });
    }

    return data;
  }

  private generateMockCategoricalData(): unknown[] {
    return [
      { name: 'Category A', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100) },
      { name: 'Category B', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100) },
      { name: 'Category C', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100) },
      { name: 'Category D', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100) },
      { name: 'Category E', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100) },
    ];
  }

  private generateMockTableData(): unknown[] {
    const data = [];
    const now = new Date();

    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      data.push({
        name: `Item ${i + 1}`,
        value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000);
        date,
      });
    }

    return data;
  }

  private generateMockGeoData(): unknown[] {
    return [
      { id: 'US', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'CA', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'MX', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'BR', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'GB', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'FR', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'DE', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'CN', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'JP', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
      { id: 'AU', value: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000) },
    ];
  }

  private calculateMockAggregations(data: unknown): Record<string, any> {
    // Calculate aggregations based on data type
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return {};
      }

      if (typeof data[0].value === 'number') {
        const values = data.map(item => item.value);
        const sum = values.reduce((acc, val) => acc + val, 0);

        return {
          sum,
          avg: sum / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }

    return {};
  }
