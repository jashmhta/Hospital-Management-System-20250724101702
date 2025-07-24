import React from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
/**
 * Emergency Room triage form component;
 */
export const _ERTriageForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Triage</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            \1>
              <Label htmlFor="chiefComplaint">Chief Complaint\1>
              <Input id="chiefComplaint" placeholder="Patient's main complaint" />
            </div>

            \1>
              <Label htmlFor="triageLevel">Triage Level\1>
              <Select>id="triageLevel"
                options={[
                  { value: "1", label: "Level 1 - Resuscitation" },
                  { value: "2", label: "Level 2 - Emergency" },
                  { value: "3", label: "Level 3 - Urgent" },
                  { value: "4", label: "Level 4 - Semi-urgent" },
                  { value: "5", label: "Level 5 - Non-urgent" },
                ]}
              </Select>
            </div>
          </div>

          \1>
            <Label htmlFor="vitalSigns">Vital Signs\1>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
<div
                <Label htmlFor="temperature" className="text-xs">Temperature</Label>
                <Input id="temperature" placeholder="°C" />
              </div>
<div
                <Label htmlFor="heartRate" className="text-xs">Heart Rate\1>
                <Input id="heartRate" placeholder="bpm" />
              </div>
<div
                <Label htmlFor="respRate" className="text-xs">Resp. Rate\1>
                <Input id="respRate" placeholder="/min" />
              </div>
<div
                <Label htmlFor="bloodPressure" className="text-xs">Blood Pressure\1>
                <Input id="bloodPressure" placeholder="mmHg" />
              </div>
<div
                <Label htmlFor="oxygenSat" className="text-xs">O2 Saturation\1>
                <Input id="oxygenSat" placeholder="%" />
              </div>
<div
                <Label htmlFor="painScore" className="text-xs">Pain Score\1>
                <Input id="painScore" placeholder="0-10" />
              </div>
            </div>
          </div>

          \1>
            <Label htmlFor="symptoms">Symptoms & Observations\1>
            <Textarea id="symptoms" placeholder="Detailed description of symptoms and observations" />
          </div>

          \1>
            <Label>Critical Indicators</Label>
            \1>
              \1>
                <Checkbox id="difficultyBreathing" />
                <Label htmlFor="difficultyBreathing" className="text-sm">Difficulty Breathing</Label>
              </div>
              \1>
                <Checkbox id="chestPain" />
                <Label htmlFor="chestPain" className="text-sm">Chest Pain</Label>
              </div>
              \1>
                <Checkbox id="alteredMentalStatus" />
                <Label htmlFor="alteredMentalStatus" className="text-sm">Altered Mental Status</Label>
              </div>
              \1>
                <Checkbox id="severeTrauma" />
                <Label htmlFor="severeTrauma" className="text-sm">Severe Trauma</Label>
              </div>
              \1>
                <Checkbox id="uncontrolledBleeding" />
                <Label htmlFor="uncontrolledBleeding" className="text-sm">Uncontrolled Bleeding</Label>
              </div>
              \1>
                <Checkbox id="stroke" />
                <Label htmlFor="stroke" className="text-sm">Stroke Symptoms</Label>
              </div>
            </div>
          </div>

          \1>
            <Button variant="outline">Reset\1>
            <Button>Submit Triage</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

}