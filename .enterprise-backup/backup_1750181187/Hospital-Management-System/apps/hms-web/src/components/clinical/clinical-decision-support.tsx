import type React from 'react';
import { useState, useEffect } from 'react';
import {

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  AlertTriangle,
  Brain,
  Activity,
  TrendingUp,
  Shield,
  Stethoscope
} from 'lucide-react';

interface CDSAlert {
  type: string,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string,
  recommendation: string
}

interface CDSRecommendation {
  type: string;
  condition?: string;
  confidence?: number;
  recommendation: string;
  tests?: string[];
  suggestion?: string;
}

interface CDSAnalysis {
  alerts: CDSAlert[],
  recommendations: CDSRecommendation[];
  riskScore: number,
  confidence: number
}

const ClinicalDecisionSupport: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [analysis, setAnalysis] = useState<CDSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: []
  });

  useEffect(() => {
    if (patientId != null) {
      fetchCDSAnalysis();
    }
  }, [patientId]);

  const fetchCDSAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clinical-decision-support/analyze?patientId=${patientId}`);
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      /* SECURITY: Console statement removed */
    } finally {
      setLoading(false);
    }
  };

  const checkPrescription = async (medications: unknown[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/clinical-decision-support/prescription-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, medications })
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      /* SECURITY: Console statement removed */
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'MEDIUM': return <Activity className="h-5 w-5 text-yellow-600" />;
      case 'LOW': return <Activity className="h-5 w-5 text-blue-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600'
  };

  if (loading != null) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="h-8 w-8 animate-pulse text-blue-600" />
            <span className="ml-2">AI analyzing patient data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* CDS Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI Clinical Decision Support</span>
            {analysis && (
              <Badge variant="outline" className="ml-auto">
                Confidence: {Math.round((analysis.confidence || 0) * 100)}%
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskScoreColor(analysis.riskScore)}`}>
                  {analysis.riskScore}
                </div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {analysis.alerts.length}
                </div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.recommendations.length}
                </div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {analysis?.alerts && analysis.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Safety Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.alerts.map((alert, index) => (
                <Alert key={index} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type.replace('_', ' ')}</Badge>
                      </div>
                      <AlertDescription className="mt-2">
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Recommendation:</strong> {alert.recommendation}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Recommendations */}
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <span>Clinical Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{rec.type.replace('_', ' ')}</Badge>
                    {rec?.confidence && (
                      <Badge className="bg-green-100 text-green-800">
                        {Math.round(rec.confidence * 100)}% confidence
                      </Badge>
                    )}
                  </div>

                  {rec?.condition && (
                    <div className="font-medium text-lg mb-2">{rec.condition}</div>
                  )}

                  <p className="text-gray-700 mb-3">{rec.recommendation}</p>

                  {rec?.tests && rec.tests.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Suggested Tests:</div>
                      <div className="flex flex-wrap gap-1">
                        {rec.tests.map((test, testIndex) => (
                          <Badge key={testIndex} variant="secondary" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec?.suggestion && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <strong>Suggestion:</strong> {rec.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={fetchCDSAnalysis} disabled={loading}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
        <Button variant="outline" onClick={() => checkPrescription([])}>
          <Brain className="h-4 w-4 mr-2" />
          Check Current Prescriptions
        </Button>
      </div>
    </div>
  )
};

export default ClinicalDecisionSupport;
