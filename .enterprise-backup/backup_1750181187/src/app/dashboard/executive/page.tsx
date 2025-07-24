import React, { useEffect }, { useState, useEffect, useMemo } from 'react';
import {

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
}

/**
 * Executive Dashboard;
 * Strategic insights and high-level KPIs for C-level executives;
 * Comprehensive business intelligence for healthcare leadership;
 */

'use client';

  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Treemap;
} from 'recharts';
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Heart,
  Building,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  Zap,
  Shield,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Share,
  Filter,
  Eye,
  Star,
  Lightbulb,
  ThumbsUp,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus;
} from 'lucide-react';

interface ExecutiveDashboardData {
  strategicKPIs: StrategyMetric[],
  \1,\2 OperationalMetrics,
  \1,\2 MarketMetrics,
  \1,\2 BoardMetric[],
  \1,\2 ExecutiveAlert[],
  benchmarks: BenchmarkData[]
}

interface StrategyMetric {
  kpi: string,
  \1,\2 number,
  \1,\2 'positive' | 'negative' | 'neutral',
  \1,\2 'excellent' | 'good' | 'attention' | 'critical',
  \1,\2 'financial' | 'operational' | 'quality' | 'growth',
  \1,\2 'high' | 'medium' | 'low'
}

interface FinancialOverview {
  revenue: {
    current: number,
    \1,\2 number,
    trend: number[]
  };
  ebitda: {
    margin: number,
    \1,\2 number
  };
  cashFlow: {
    operating: number,
    \1,\2 number; // months
  };
  profitability: {
    grossMargin: number,
    \1,\2 number
  };
  costManagement: {
    costPerPatient: number,
    \1,\2 number
  };
  reimbursements: {
    commercial: number,
    \1,\2 number,
    denialRate: number
  };
}

interface OperationalMetrics {
  capacity: {
    bedUtilization: number,
    \1,\2 number,
    equipmentEfficiency: number
  };
  throughput: {
    patientVolume: number,
    \1,\2 number,
    dischargeEfficiency: number
  };
  technology: {
    ehrAdoption: number,
    \1,\2 number,
    cyberSecurityScore: number
  };
  staffing: {
    retention: number,
    \1,\2 number,
    trainingCompliance: number
  };
}

interface QualityOverview {
  patientSafety: {
    overallScore: number,
    \1,\2 number,
    infectionRate: number
  };
  patientExperience: {
    satisfaction: number,
    \1,\2 number,
    compliments: number
  };
  clinicalExcellence: {
    outcomeScores: number,
    \1,\2 number,
    evidenceBasedCare: number
  };
  accreditation: {
    jcahoScore: number,
    \1,\2 string,
    lastAuditScore: number
  };
}

interface MarketMetrics {
  marketShare: number,
  \1,\2 number,
  patientAcquisition: {
    newPatients: number,
    \1,\2 number,
    lifetimeValue: number
  };
  serviceLines: {
    name: string,
    \1,\2 number,
    marketPosition: number
  }[];
  partnerships: {
    strategic: number,
    \1,\2 number
  };
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical',
  \1,\2 {
    financial: number,
    \1,\2 number,
    \1,\2 number
  };
  mitigation: {
    active: number,
    \1,\2 number
  };
  compliance: {
    hipaa: number,
    \1,\2 number,
    overall: number
  };
}

interface BoardMetric {
  metric: string,
  \1,\2 number,
  \1,\2 string,
  priority: 'board' | 'executive' | 'operational'
}

interface StrategicInitiative {
  id: string,
  \1,\2 'growth' | 'efficiency' | 'quality' | 'innovation',
  \1,\2 'on-track' | 'at-risk' | 'delayed' | 'completed',
  \1,\2 number,
  \1,\2 string,
  \1,\2 string
}

interface ExecutiveAlert {
  id: string,
  \1,\2 'info' | 'warning' | 'critical',
  \1,\2 string,
  \1,\2 string,
  \1,\2 string
}

interface BenchmarkData {
  metric: string,
  \1,\2 number,
  \1,\2 number,
  percentile: number
}

const CHART_COLORS = {
  primary: '#1e40af',
  \1,\2 '#d97706',
  \1,\2 '#16a34a',
  \1,\2 '#7c3aed',
  pink: '#db2777'
};

export default const _ExecutiveDashboard = () {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('YTD');
  const [viewMode, setViewMode] = useState('summary');
  const [selectedCategory, setSelectedCategory] = useState('all'),
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(generateMockExecutiveData());
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'attention': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600'
    }
  };

  const getTrendIcon = (trend: string, change = 0) => {
    \1 {\n  \2{
      return <ArrowUpRight className="h-4 w-4 text-green-500" />
    } else \1 {\n  \2{
      return <ArrowDownRight className="h-4 w-4 text-red-500" />
    }
    return <Minus className="h-4 w-4 text-gray-500" />
  };

  \1 {\n  \2{
    return (
      <div className="flex items-center justify-center h-screen">;
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  \1 {\n  \2{
    return (
      <div className="flex items-center justify-center h-screen">;
        <Alert className="max-w-md">;
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load executive dashboard data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">;
      {/* Executive Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">;
        <div className="flex items-center justify-between">;
<div
            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>;
            <p className="text-gray-600 mt-1">;
              Strategic insights and performance metrics for healthcare leadership
            </p>
          </div>
          <div className="flex items-center space-x-4">;
            <Select value={timeframe} onValueChange={setTimeframe}>;
              <SelectTrigger className="w-32">;
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YTD">Year to Date</SelectItem>;
                <SelectItem value="QTD">Quarter to Date</SelectItem>;
                <SelectItem value="MTD">Month to Date</SelectItem>;
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">;
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">;
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">;
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">;
        {data.strategicKPIs.slice(0, 4).map((kpi, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">;
            <CardHeader className="pb-2">;
              <CardTitle className="text-sm text-gray-600">{kpi.kpi}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">;
                <div className="text-2xl font-bold">;
                  {kpi.current.toLocaleString()}{kpi.unit}
                </div>
                <div className="flex items-center space-x-1">;
                  {getTrendIcon(kpi.trend, kpi.changePercent)}
                  <span className={`text-sm font-medium ${
                    kpi.changePercent > 0 ? 'text-green-600' :
                    kpi.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">;
                <div className="flex justify-between text-xs text-gray-500">;
                  <span>Progress to Target</span>
                  <span>{Math.round((kpi.current / kpi.target) * 100)}%</span>
                </div>
                <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">;
                <span className="text-gray-500">Target: {kpi.target.toLocaleString()}{kpi.unit}</span>;
                <Badge variant={
                  kpi.status === 'excellent' ? 'default' :
                  kpi.status === 'good' ? 'secondary' :
                  kpi.status === 'attention' ? 'outline' : 'destructive';
                }>
                  {kpi.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="financial" className="space-y-6">;
        <TabsList className="grid w-full grid-cols-6">;
          <TabsTrigger value="financial">Financial</TabsTrigger>;
          <TabsTrigger value="operational">Operations</TabsTrigger>;
          <TabsTrigger value="quality">Quality</TabsTrigger>;
          <TabsTrigger value="market">Market</TabsTrigger>;
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>;
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>

        {/* Financial Performance */}
        <TabsContent value="financial" className="space-y-6">;
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            {/* Revenue Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">;
                  <DollarSign className="h-5 w-5" />
                  <span>Revenue Performance</span>
                </CardTitle>
                <CardDescription>Year-over-year revenue analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  <div className="grid grid-cols-2 gap-4">;
<div
                      <p className="text-sm text-gray-600">Current Revenue</p>;
                      <p className="text-2xl font-bold">;
                        ${(data.financialOverview.revenue.current / 1000000).toFixed(1)}M
                      </p>
                      <div className="flex items-center text-sm">;
                        {getTrendIcon('positive', data.financialOverview.revenue.growth)}
                        <span className="text-green-600 ml-1">;
                          +{data.financialOverview.revenue.growth}% YoY
                        </span>
                      </div>
                    </div>
<div
                      <p className="text-sm text-gray-600">Target</p>;
                      <p className="text-2xl font-bold">;
                        ${(data.financialOverview.revenue.target / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-gray-500">;
                        {Math.round((data.financialOverview.revenue.current / data.financialOverview.revenue.target) * 100)}% achieved
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>;
                    <LineChart data={data.financialOverview.revenue.trend.map((value, index) => ({
                      month: `Month ${index + 1}`,
                      revenue: value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}M`, 'Revenue']} />
                      <Line>
                        type="monotone"
                        dataKey="revenue"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Profitability Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Profitability Analysis</CardTitle>
                <CardDescription>EBITDA, margins, and cost management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  <div className="grid grid-cols-3 gap-4 text-center">;
<div
                      <p className="text-sm text-gray-600">EBITDA Margin</p>;
                      <p className="text-xl font-bold">{data.financialOverview.ebitda.margin}%</p>
                    </div>
<div
                      <p className="text-sm text-gray-600">Operating Margin</p>;
                      <p className="text-xl font-bold">{data.financialOverview.profitability.operatingMargin}%</p>
                    </div>
<div
                      <p className="text-sm text-gray-600">Net Margin</p>;
                      <p className="text-xl font-bold">{data.financialOverview.profitability.netMargin}%</p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={200}>;
                    <BarChart data={[
                      { name: 'Gross', value: data.financialOverview.profitability.grossMargin },
                      { name: 'Operating', value: data.financialOverview.profitability.operatingMargin },
                      { name: 'Net', value: data.financialOverview.profitability.netMargin }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Margin']} />
                      <Bar dataKey="value" fill={CHART_COLORS.secondary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Free Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  ${(data.financialOverview.cashFlow.free / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-gray-500">;
                  {data.financialOverview.cashFlow.runway} months runway
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Cost per Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  ${data.financialOverview.costManagement.costPerPatient.toLocaleString()}
                </div>
                <div className="flex items-center text-xs">;
                  {getTrendIcon('negative', -data.financialOverview.costManagement.costReduction)}
                  <span className="text-green-600 ml-1">;
                    -{data.financialOverview.costManagement.costReduction}% reduction
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Denial Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  {data.financialOverview.reimbursements.denialRate}%
                </div>
                <Progress value={100 - data.financialOverview.reimbursements.denialRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Operating Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  {data.financialOverview.costManagement.efficiency}%
                </div>
                <Badge variant="default">Above Target</Badge>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Payer Mix Analysis</CardTitle>
              <CardDescription>Revenue distribution by payer type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
                <ResponsiveContainer width="100%" height={250}>;
                  <PieChart>
                    <Pie>
                      data={[
                        { name: 'Commercial', value: data.financialOverview.reimbursements.commercial },
                        { name: 'Medicare', value: data.financialOverview.reimbursements.medicare },
                        { name: 'Medicaid', value: data.financialOverview.reimbursements.medicaid },
                        { name: 'Other', value: 100 - data.financialOverview.reimbursements.commercial - data.financialOverview.reimbursements.medicare - data.financialOverview.reimbursements.medicaid }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill={CHART_COLORS.primary}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.purple].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">;
                  <div className="flex justify-between items-center">;
                    <span>Commercial Insurance</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.financialOverview.reimbursements.commercial}%</div>;
                      <div className="text-sm text-green-600">+2.3% YoY</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">;
                    <span>Medicare</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.financialOverview.reimbursements.medicare}%</div>;
                      <div className="text-sm text-gray-500">+0.8% YoY</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">;
                    <span>Medicaid</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.financialOverview.reimbursements.medicaid}%</div>;
                      <div className="text-sm text-red-600">-1.1% YoY</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="operational" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Bed Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operationalMetrics.capacity.bedUtilization}%</div>;
                <Progress value={data.operationalMetrics.capacity.bedUtilization} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">Target: 85%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Staff Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operationalMetrics.capacity.staffProductivity}%</div>;
                <div className="flex items-center text-xs text-green-600">;
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.2% vs last quarter
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Avg Length of Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operationalMetrics.throughput.avgLengthOfStay} days</div>;
                <div className="flex items-center text-xs text-green-600">;
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.3 days improvement
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.operationalMetrics.technology.systemUptime}%</div>;
                <Badge variant="default">Excellent</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Operational Efficiency Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            <Card>
              <CardHeader>
                <CardTitle>Capacity Management</CardTitle>
                <CardDescription>Resource utilization across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>;
                  <RadialBarChart data={[
                    { name: 'Beds', utilization: data.operationalMetrics.capacity.bedUtilization, fill: CHART_COLORS.primary },
                    { name: 'OR', utilization: data.operationalMetrics.capacity.orUtilization, fill: CHART_COLORS.secondary },
                    { name: 'Staff', utilization: data.operationalMetrics.capacity.staffProductivity, fill: CHART_COLORS.warning },
                    { name: 'Equipment', utilization: data.operationalMetrics.capacity.equipmentEfficiency, fill: CHART_COLORS.purple }
                  ]}>
                    <RadialBar dataKey="utilization" cornerRadius={10} fill={CHART_COLORS.primary} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Transformation</CardTitle>
                <CardDescription>Technology adoption and cybersecurity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  <div className="flex justify-between items-center">;
                    <span>EHR Adoption</span>
                    <div className="flex items-center space-x-2">;
                      <Progress value={data.operationalMetrics.technology.ehrAdoption} className="w-24" />
                      <span className="font-bold">{data.operationalMetrics.technology.ehrAdoption}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">;
                    <span>Digital Transformation</span>
                    <div className="flex items-center space-x-2">;
                      <Progress value={data.operationalMetrics.technology.digitalTransformation} className="w-24" />
                      <span className="font-bold">{data.operationalMetrics.technology.digitalTransformation}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">;
                    <span>Cybersecurity Score</span>
                    <div className="flex items-center space-x-2">;
                      <Progress value={data.operationalMetrics.technology.cyberSecurityScore} className="w-24" />
                      <span className="font-bold">{data.operationalMetrics.technology.cyberSecurityScore}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staff Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Workforce Excellence</CardTitle>
              <CardDescription>Staff retention, satisfaction, and productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">;
                <div className="text-center p-4 bg-blue-50 rounded-lg">;
                  <div className="text-2xl font-bold text-blue-600">;
                    {data.operationalMetrics.staffing.retention}%
                  </div>
                  <p className="text-sm text-gray-600">Staff Retention</p>;
                  <p className="text-xs text-green-600">+2.3% YoY</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">;
                  <div className="text-2xl font-bold text-green-600">;
                    {data.operationalMetrics.staffing.satisfaction}%
                  </div>
                  <p className="text-sm text-gray-600">Satisfaction Score</p>;
                  <p className="text-xs text-green-600">+1.8% QoQ</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">;
                  <div className="text-2xl font-bold text-purple-600">;
                    {data.operationalMetrics.staffing.productivity}%
                  </div>
                  <p className="text-sm text-gray-600">Productivity Index</p>;
                  <p className="text-xs text-green-600">+4.1% YoY</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">;
                  <div className="text-2xl font-bold text-yellow-600">;
                    {data.operationalMetrics.staffing.trainingCompliance}%
                  </div>
                  <p className="text-sm text-gray-600">Training Compliance</p>;
                  <p className="text-xs text-gray-500">Target: 95%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Patient Safety Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.qualityAndSafety.patientSafety.overallScore}%</div>;
                <Badge variant="default">Top Decile</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.qualityAndSafety.patientExperience.satisfaction}%</div>;
                <p className="text-xs text-gray-500">HCAHPS Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Readmission Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.qualityAndSafety.clinicalExcellence.readmissionRate}%</div>;
                <div className="flex items-center text-xs text-green-600">;
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -1.2% improvement
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">JCAHO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.qualityAndSafety.accreditation.jcahoScore}%</div>;
                <Badge variant="default">Accredited</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quality Metrics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            <Card>
              <CardHeader>
                <CardTitle>Clinical Excellence</CardTitle>
                <CardDescription>Key clinical outcome indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>;
                  <BarChart data={[
                    { metric: 'Outcomes', score: data.qualityAndSafety.clinicalExcellence.outcomeScores },
                    { metric: 'Evidence-Based', score: data.qualityAndSafety.clinicalExcellence.evidenceBasedCare },
                    { metric: 'Safety', score: data.qualityAndSafety.patientSafety.overallScore },
                    { metric: 'Experience', score: data.qualityAndSafety.patientExperience.satisfaction }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="score" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Experience</CardTitle>
                <CardDescription>Satisfaction and feedback metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  <div className="flex items-center justify-between">;
                    <span>Overall Satisfaction</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.qualityAndSafety.patientExperience.satisfaction}%</div>;
                      <div className="text-sm text-green-600">+2.1% YoY</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">;
                    <span>Net Promoter Score</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.qualityAndSafety.patientExperience.nps}</div>;
                      <div className="text-sm text-green-600">+5 points</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">;
                    <span>Complaints</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.qualityAndSafety.patientExperience.complaints}</div>;
                      <div className="text-sm text-green-600">-12% reduction</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">;
                    <span>Compliments</span>
                    <div className="text-right">;
                      <div className="font-bold">{data.qualityAndSafety.patientExperience.compliments}</div>;
                      <div className="text-sm text-green-600">+18% increase</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="market" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Market Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.marketPosition.marketShare}%</div>;
                <p className="text-xs text-gray-500">Regional market</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Brand Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.marketPosition.brandReputation}/100</div>;
                <Badge variant="default">Industry Leading</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">New Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.marketPosition.patientAcquisition.newPatients.toLocaleString()}</div>;
                <div className="flex items-center text-xs text-green-600">;
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.5% YoY
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.marketPosition.patientAcquisition.retentionRate}%</div>;
                <p className="text-xs text-gray-500">Above industry avg</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Line Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Service Line Performance</CardTitle>
              <CardDescription>Revenue and growth by clinical service area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
                <ResponsiveContainer width="100%" height={300}>;
                  <BarChart data={data.marketPosition.serviceLines}>;
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? `$${value}M` : `${value}%`,
                      name === 'revenue' ? 'Revenue' : 'Growth';
                    ]} />
                    <Bar dataKey="revenue" fill={CHART_COLORS.primary} />
                    <Bar dataKey="growth" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">;
                  {data.marketPosition.serviceLines.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">;
                      <div className="flex justify-between items-center mb-2">;
                        <span className="font-medium">{service.name}</span>;
                        <Badge variant={service.marketPosition > 80 ? 'default' : 'secondary'}>;
                          #{service.marketPosition} in market
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">;
<div
                          <p className="text-gray-600">Revenue</p>;
                          <p className="font-bold">${service.revenue}M</p>
                        </div>
<div
                          <p className="text-gray-600">Growth</p>;
                          <p className={`font-bold ${service.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>;
                            {service.growth > 0 ? '+' : ''}{service.growth}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="initiatives" className="space-y-6">;
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            <Card>
              <CardHeader>
                <CardTitle>Initiative Portfolio</CardTitle>
                <CardDescription>Strategic project progress and ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  {data.initiatives.map((initiative, index) => (
                    <div key={index} className="border rounded-lg p-4">;
                      <div className="flex justify-between items-center mb-2">;
                        <span className="font-medium">{initiative.name}</span>;
                        <Badge variant={
                          initiative.status === 'on-track' ? 'default' :
                          initiative.status === 'at-risk' ? 'outline' :
                          initiative.status === 'delayed' ? 'destructive' : 'secondary';
                        }>
                          {initiative.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">;
                        <div className="flex justify-between text-sm">;
                          <span>Progress</span>
                          <span>{initiative.progress}%</span>
                        </div>
                        <Progress value={initiative.progress} className="h-2" />
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">;
<div
                            <p>Budget: ${initiative.budget}M</p>;
                            <p>Spent: ${initiative.spent}M</p>
                          </div>
<div
                            <p>Expected ROI: {initiative.expectedROI}%</p>;
                            <p>Timeline: {initiative.timeline}</p>
                          </div>
<div
                            <p>Sponsor: {initiative.sponsor}</p>;
                            <p>Updated: {initiative.lastUpdate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Allocation</CardTitle>
                <CardDescription>Budget distribution by strategic category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height=300>;
                  <PieChart>
                    <Pie>
                      data={[
                        { name: 'Growth', value: 35, fill: CHART_COLORS.primary },
                        { name: 'Efficiency', value: 25, fill: CHART_COLORS.secondary },
                        { name: 'Quality', value: 20, fill: CHART_COLORS.warning },
                        { name: 'Innovation', value: 20, fill: CHART_COLORS.purple }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Dashboard</CardTitle>
              <CardDescription>Initiative success metrics and KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">;
                <div className="text-center p-4 bg-green-50 rounded-lg">;
                  <div className="text-2xl font-bold text-green-600">;
                    {data.initiatives.filter(i => i.status === 'on-track').length}
                  </div>
                  <p className="text-sm text-gray-600">On Track</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">;
                  <div className="text-2xl font-bold text-yellow-600">;
                    {data.initiatives.filter(i => i.status === 'at-risk').length}
                  </div>
                  <p className="text-sm text-gray-600">At Risk</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">;
                  <div className="text-2xl font-bold text-red-600">;
                    {data.initiatives.filter(i => i.status === 'delayed').length}
                  </div>
                  <p className="text-sm text-gray-600">Delayed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">;
                  <div className="text-2xl font-bold text-blue-600">;
                    {Math.round(data.initiatives.reduce((sum, i) => sum + i.expectedROI, 0) / data.initiatives.length)}%
                  </div>
                  <p className="text-sm text-gray-600">Avg Expected ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="risk" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Overall Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.riskManagement.riskScore}/100</div>;
                <Badge variant={
                  data.riskManagement.overallRisk === 'low' ? 'default' :
                  data.riskManagement.overallRisk === 'medium' ? 'secondary' :
                  data.riskManagement.overallRisk === 'high' ? 'outline' : 'destructive';
                }>
                  {data.riskManagement.overallRisk} risk
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Active Mitigations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.riskManagement.mitigation.active}</div>;
                <p className="text-xs text-gray-500">;
                  {data.riskManagement.mitigation.planned} planned
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.riskManagement.compliance.overall}%</div>;
                <Progress value={data.riskManagement.compliance.overall} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.riskManagement.compliance.hipaa}%</div>;
                <Badge variant="default">Compliant</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
              <CardDescription>Risk levels across operational categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
                <ResponsiveContainer width="100%" height={300}>;
                  <RadialBarChart data={[
                    { name: 'Financial', risk: data.riskManagement.categories.financial, fill: CHART_COLORS.danger },
                    { name: 'Operational', risk: data.riskManagement.categories.operational, fill: CHART_COLORS.warning },
                    { name: 'Regulatory', risk: data.riskManagement.categories.regulatory, fill: CHART_COLORS.primary },
                    { name: 'Technology', risk: data.riskManagement.categories.technology, fill: CHART_COLORS.purple },
                    { name: 'Reputation', risk: data.riskManagement.categories.reputation, fill: CHART_COLORS.secondary }
                  ]}>
                    <RadialBar dataKey="risk" cornerRadius={10} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Risk Level']} />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="space-y-4">;
                  {Object.entries(data.riskManagement.categories).map(([category, risk], index) => (
                    <div key={index} className="flex justify-between items-center">;
                      <span className="capitalize">{category} Risk</span>;
                      <div className="flex items-center space-x-3">;
                        <Progress value={risk} className="w-24" />
                        <span className="font-bold w-12">{risk}%</span>;
                        <Badge variant={
                          risk < 25 ? 'default' :
                          risk < 50 ? 'secondary' :
                          risk < 75 ? 'outline' : 'destructive'
                        }>
                          {risk < 25 ? 'Low' :
                           risk < 50 ? 'Medium' :
                           risk < 75 ? 'High' : 'Critical'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">;
            <Briefcase className="h-5 w-5" />
            <span>Board Reporting Metrics</span>
          </CardTitle>
          <CardDescription>Key metrics for board reporting and governance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">;
            {data.boardMetrics.map((metric, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-500">;
                <CardHeader className="pb-2">;
                  <CardTitle className="text-sm">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">;
                    <div className="text-xl font-bold">{metric.value}</div>;
                    <div className="flex items-center space-x-1">;
                      {getTrendIcon(metric.status, metric.change)}
                      <span className={`text-sm ${
                        metric.status === 'positive' ? 'text-green-600' :
                        metric.status === 'negative' ? 'text-red-600' : 'text-gray-600';
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">;
                    Benchmark: {metric.benchmark}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>data.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">;
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Executive Attention Required</span>
              <Badge variant="outline">{data.alerts.length}</Badge>
            </CardTitle>
            <CardDescription>Strategic and operational issues requiring leadership attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">;
              {data.alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500';
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">;
                    <span>{alert.title}</span>
                    <div className="flex items-center space-x-2">;
                      <Badge variant="outline">{alert.type}</Badge>;
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'warning' ? 'default' : 'secondary';
                      }>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className={
                        alert.impact === 'high' ? 'border-red-300' :
                        alert.impact === 'medium' ? 'border-yellow-300' : 'border-blue-300';
                      }>
                        {alert.impact} impact
                      </Badge>
                    </div>
                  </AlertTitle>
                  <AlertDescription className="mt-2">;
                    <p className="mb-2">{alert.summary}</p>;
                    <div className="bg-blue-50 rounded p-3 mb-2">;
                      <p className="text-sm">;
                        <strong>Recommendation:</strong> {alert.recommendation}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">;
                      <span>Owner: {alert.owner}</span>;
                      <span>Due: {alert.dueDate}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    </div>
  );
}

// Mock data generation function for executive dashboard
const generateMockExecutiveData = (): ExecutiveDashboardData {
  return {
    strategicKPIs: [
      {
        kpi: 'Annual Revenue',
        \1,\2 450000000,
        \1,\2 'positive',
        \1,\2 'good',
        \1,\2 'financial',
        \1,\2 'high'
      },
      {
        kpi: 'EBITDA Margin',
        \1,\2 20.0,
        \1,\2 'positive',
        \1,\2 'good',
        \1,\2 'financial',
        \1,\2 'high'
      },
      {
        kpi: 'Patient Satisfaction',
        \1,\2 95.0,
        \1,\2 'positive',
        \1,\2 'excellent',
        \1,\2 'quality',
        \1,\2 'high'
      },
      {
        kpi: 'Market Share',
        \1,\2 35.0,
        \1,\2 'positive',
        \1,\2 'good',
        \1,\2 'growth',
        \1,\2 'medium'
      }
    ],
    financialOverview: {
      revenue: {
        current: 425000000,
        \1,\2 8.5,
        trend: [35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 71]
      },
      ebitda: {
        margin: 18.2,
        \1,\2 12.3
      },
      cashFlow: {
        operating: 95000000,
        \1,\2 18
      },
      profitability: {
        grossMargin: 65.4,
        \1,\2 16.2
      },
      costManagement: {
        costPerPatient: 8250,
        \1,\2 91.5
      },
      reimbursements: {
        commercial: 55,
        \1,\2 13,
        denialRate: 4.2
      }
    },
    operationalMetrics: {
        bedUtilization: 87.3,
        \1,\2 89.7,
        equipmentEfficiency: 94.2,
      throughput: 
        patientVolume: 125000,
        \1,\2 12.3,
        dischargeEfficiency: 91.8,
      technology: 
        ehrAdoption: 98.5,
        \1,\2 99.7,
        cyberSecurityScore: 92.1,
      staffing: 
        retention: 91.2,
        \1,\2 93.1,
        trainingCompliance: 96.8
    },
    qualityAndSafety: {
        overallScore: 96.2,
        \1,\2 2.1,
        infectionRate: 1.8,
      patientExperience: 
        satisfaction: 94.3,
        \1,\2 45,
        compliments: 324,
      clinicalExcellence: 
        outcomeScores: 91.7,
        \1,\2 2.9,
        evidenceBasedCare: 95.1,
      accreditation: 
        jcahoScore: 94.8,
        \1,\2 'A',
        lastAuditScore: 96.2
    },
    marketPosition: {
      marketShare: 32.8,
      \1,\2 2,
      patientAcquisition: 
        newPatients: 15420,
        \1,\2 285,
        lifetimeValue: 12500,
      serviceLines: [name: 'Cardiology', revenue: 85, growth: 12.3, marketPosition: 1 ,name: 'Orthopedics', revenue: 72, growth: 8.7, marketPosition: 2 ,name: 'Emergency', revenue: 95, growth: 5.2, marketPosition: 1 ,name: 'Surgery', revenue: 120, growth: 15.8, marketPosition: 1 
      ],
      partnerships: 
        strategic: 8,
        \1,\2 5
    },
    riskManagement: {
      overallRisk: 'medium',
      \1,\2 25,
        \1,\2 20,
        \1,\2 40,
      mitigation: 
        active: 15,
        \1,\2 22,
      compliance: 
        hipaa: 98.2,
        \1,\2 96.1,
        overall: 96.4
    },
    boardMetrics: [
      { metric: 'ROI', value: '14.2%', change: 2.1, status: 'positive', benchmark: '12.5%', priority: 'board' },
      { metric: 'Days Cash on Hand', value: '87', change: 5.3, status: 'positive', benchmark: '75', priority: 'board' },
      { metric: 'Staff Turnover', value: '8.8%', change: -1.2, status: 'positive', benchmark: '12.5%', priority: 'board' },
      { metric: 'Patient Safety Events', value: '1.2/1000', change: -0.3, status: 'positive', benchmark: '2.1/1000', priority: 'board' },
      { metric: 'HCAHPS Top Box', value: '94.3%', change: 1.8, status: 'positive', benchmark: '89.2%', priority: 'board' },
      { metric: 'Physician Engagement', value: '8.7/10', change: 0.4, status: 'positive', benchmark: '7.9/10', priority: 'executive' }
    ],
    initiatives: [
      {
        id: '1',
        \1,\2 'innovation',
        \1,\2 'on-track',
        \1,\2 19.5,
        \1,\2 'Q2 2024',
        \1,\2 '2024-01-15'
      },
      {
        id: '2',
        \1,\2 'quality',
        \1,\2 'on-track',
        \1,\2 10.2,
        \1,\2 'Q1 2024',
        \1,\2 '2024-01-12'
      },
      {
        id: '3',
        \1,\2 'efficiency',
        \1,\2 'at-risk',
        \1,\2 5.2,
        \1,\2 'Q3 2024',
        \1,\2 '2024-01-10'
      }
    ],
    alerts: [
      {
        id: '1',
        \1,\2 'warning',
        \1,\2 'ICU occupancy has reached 95% for the past 48 hours with limited discharge prospects.',
        \1,\2 'Activate overflow protocols and expedite discharge planning for stable patients.',
        \1,\2 '2024-01-17'
      },
      {
        id: '2',
        \1,\2 'critical',
        \1,\2 'Current revenue trajectory suggests we may miss Q4 target by 3-4%.',
        \1,\2 'Accelerate elective procedures and enhance collection efforts.',
        \1,\2 '2024-01-20'
      }
    ],
    benchmarks: [
      { metric: 'EBITDA Margin', ourValue: 18.2, industryAvg: 16.5, topQuartile: 19.8, topDecile: 22.1, percentile: 75 },
      { metric: 'Length of Stay', ourValue: 4.2, industryAvg: 4.8, topQuartile: 4.0, topDecile: 3.7, percentile: 80 },
      { metric: 'Patient Satisfaction', ourValue: 94.3, industryAvg: 89.2, topQuartile: 92.5, topDecile: 95.8, percentile: 90 }
    ]
  };
}
";
