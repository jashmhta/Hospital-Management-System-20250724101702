import React from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
interface DischargeSummaryProps {
  patientId: string,
  patientName: string
}

/**
 * IPD Discharge Summary component;
 */
export const _DischargeSummary = ({ patientId, patientName }: DischargeSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discharge Summary - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            \1>
              <Label htmlFor="admissionDate">Admission Date\1>
              <Input id="admissionDate" type="date" />
            </div>

            \1>
              <Label htmlFor="dischargeDate">Discharge Date\1>
              <Input id="dischargeDate" type="date" />
            </div>
          </div>

          \1>
            <Label htmlFor="admittingDiagnosis">Admitting Diagnosis\1>
            <Textarea id="admittingDiagnosis" placeholder="Enter admitting diagnosis" />
          </div>

          \1>
            <Label htmlFor="dischargeDiagnosis">Discharge Diagnosis\1>
            <Textarea id="dischargeDiagnosis" placeholder="Enter discharge diagnosis" />
          </div>

          \1>
            <Label htmlFor="briefHistory">Brief History\1>
            <Textarea id="briefHistory" placeholder="Enter brief history" rows={3} />
          </div>

          \1>
            <Label htmlFor="significantFindings">Significant Findings\1>
            <Textarea id="significantFindings" placeholder="Enter significant findings" rows={3} />
          </div>

          \1>
            <Label htmlFor="proceduresPerformed">Procedures Performed\1>
            <Textarea id="proceduresPerformed" placeholder="Enter procedures performed" rows={3} />
          </div>

          \1>
            <Label htmlFor="treatmentGiven">Treatment Given\1>
            <Textarea id="treatmentGiven" placeholder="Enter treatment given" rows={3} />
          </div>

          \1>
            <Label htmlFor="conditionAtDischarge">Condition at Discharge\1>
            <Select>
              id="conditionAtDischarge"
              options={[
                { value: "improved", label: "Improved" },
                { value: "stable", label: "Stable" },
                { value: "unchanged", label: "Unchanged" },
                { value: "deteriorated", label: "Deteriorated" },
                { value: "expired", label: "Expired" },
              ]}
            />
          </div>

          \1>
            <Label htmlFor="dischargeMedications">Discharge Medications\1>
            <Textarea id="dischargeMedications" placeholder="Enter discharge medications" rows={3} />
          </div>

          \1>
            <Label htmlFor="followUpInstructions">Follow-up Instructions\1>
            <Textarea id="followUpInstructions" placeholder="Enter follow-up instructions" rows={3} />
          </div>

          \1>
            <Label htmlFor="dischargingPhysician">Discharging Physician\1>
            <Select>
              id="dischargingPhysician"
              options={[
                { value: "", label: "Select physician" },
              ]}
            />
          </div>

          \1>
            <Button variant="outline">Cancel\1>
            <Button>Generate Discharge Summary</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

}