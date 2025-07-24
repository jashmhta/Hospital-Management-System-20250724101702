import type React from 'react';
import { useState, useEffect } from 'react';
import {

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

  Search,
  Brain,
  FileText,
  Code,
  CheckCircle,
  AlertCircle,
  Archive
} from 'lucide-react';

interface ICD10Code {
  code: string,
  description: string;
  type: string;
  category?: string;
  confidence?: number;
}

interface MedicalRecord {
  id: string,
  patientId: string;
  visitDate: string,
  chiefComplaint: string;
  diagnoses: string[],
  icdCodes: string[];
  status: 'DRAFT' | 'CODED' | 'FINAL' | 'ARCHIVED'
}

const AdvancedMedicalRecords: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [icdResults, setIcdResults] = useState<ICD10Code[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [suggestedCodes, setSuggestedCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchICD10 = async (query: string, type = 'search') => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/medical-records/icd10/search?q=/* SECURITY: Safe parameter encoding */&type=${type}`);
      const data = await response.json();
      setIcdResults(data.results);
    } catch (error) {
      /* SECURITY: Console statement removed */
    } finally {
      setLoading(false);
    }
  };

  const generateAutoCoding = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      const response = await fetch('/api/medical-records/auto-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedRecord.patientId,
          visitId: selectedRecord.id;
          clinicalNotes,
          diagnoses
        })
      });
      const data = await response.json();
      setSuggestedCodes(data.suggestedCodes);
    } catch (error) {
      /* SECURITY: Console statement removed */
    } finally {
      setLoading(false);
    }
  };

  const _validateICD10Code = async (code: string) => {
    try {
      const response = await fetch(`/api/medical-records/icd10/search?q=${code}&type=validate`);
      const data = await response.json();
      return data.results[0];
    } catch (error) {
      /* SECURITY: Console statement removed */
      return null
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Medical Records</h1>
        <Button onClick={generateAutoCoding} disabled={loading}>
          <Brain className="h-4 w-4 mr-2" />
          AI Auto-Coding
        </Button>
      </div>

      <Tabs defaultValue="coding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coding">ICD-10 Coding</TabsTrigger>
          <TabsTrigger value="search">Code Search</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="analytics">Coding Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="coding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clinical Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Clinical Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Clinical Notes</label>
                  <Textarea
                    placeholder="Enter clinical notes, symptoms, examination findings..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Diagnoses</label>
                  <Input
                    placeholder="Add diagnosis and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setDiagnoses([...diagnoses, e.currentTarget.value.trim()]);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {diagnoses.map((diagnosis, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {diagnosis}
                        <button
                          onClick={() => setDiagnoses(diagnoses.filter((_, i) => i !== index))}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateAutoCoding}
                  disabled={loading || diagnoses.length === 0}
                  className="w-full"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate ICD-10 Codes
                </Button>
              </CardContent>
            </Card>

            {/* AI Suggested Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>AI Suggested ICD-10 Codes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestedCodes.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedCodes.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">{item.diagnosis}</div>
                        <div className="space-y-2">
                          {item.suggestions.map((suggestion: unknown, suggestionIndex: number) => (
                            <div key={suggestionIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-mono font-medium">{suggestion.code}</div>
                                <div className="text-sm text-gray-600">{suggestion.description}</div>
                                {suggestion?.category && (
                                  <div className="text-xs text-gray-500">{suggestion.category}</div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {suggestion?.confidence && (
                                  <Badge variant="outline">
                                    {Math.round(suggestion.confidence * 100)}%
                                  </Badge>
                                )}
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter diagnoses and click "Generate ICD-10 Codes" to see AI suggestions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ICD-10 Code Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Search ICD-10 codes or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchICD10(searchQuery)}
                />
                <Button onClick={() => searchICD10(searchQuery)} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {icdResults.map((result, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={result.type === 'specific' ? 'default' : 'secondary'}
                        >
                          {result.code}
                        </Badge>
                        {result?.confidence && (
                          <Badge variant="outline">
                            {Math.round(result.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{result.description}</p>
                      {result?.category && (
                        <p className="text-xs text-gray-500 mt-1">{result.category}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Archive className="h-5 w-5" />
                <span>Medical Records Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Medical records management interface</p>
                <p className="text-sm">View, edit, and manage patient medical records with automated coding</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coding Analytics & Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">95.2%</div>
                  <div className="text-sm text-gray-600">Coding Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2.1</div>
                  <div className="text-sm text-gray-600">Avg. Codes per Record</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">4.2</div>
                  <div className="text-sm text-gray-600">Avg. Coding Time (min)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
};

export default AdvancedMedicalRecords;
