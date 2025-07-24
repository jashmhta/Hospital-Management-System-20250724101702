import React from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
}
/**
 * Radiology settings component;
 */
export const _RadiologySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radiology Settings</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            <TabsTrigger value="general">General\1>
            <TabsTrigger value="modalities">Modalities\1>
            <TabsTrigger value="templates">Report Templates\1>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>

          \1>
            \1>
              \1>
                <Label htmlFor="departmentName">Department Name\1>
                <Input id="departmentName" defaultValue="Radiology Department" />
              </div>

              \1>
                <Label htmlFor="defaultPriority">Default Order Priority\1>
                <Select>
                  id="defaultPriority"
                  options={[
                    { value: "routine", label: "Routine" },
                    { value: "urgent", label: "Urgent" },
                    { value: "stat", label: "STAT" },
                  ]}
                  defaultValue="routine"
                />
              </div>

              \1>
                <Label htmlFor="autoAssign">Auto-assign Radiologist\1>
                <Select>
                  id="autoAssign"
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  defaultValue="false"
                />
              </div>

              \1>
                <Label htmlFor="reportFormat">Default Report Format\1>
                <Select>
                  id="reportFormat"
                  options={[
                    { value: "structured", label: "Structured" },
                    { value: "narrative", label: "Narrative" },
                    { value: "hybrid", label: "Hybrid" },
                  ]}
                  defaultValue="structured"
                />
              </div>

              <Button className="mt-4">Save Settings</Button>
            </div>
          </TabsContent>

          \1>
            \1>
              \1>
                <Label>Active Modalities</Label>
                \1>
                  \1>
                    <input type="checkbox" id="xray" defaultChecked />
                    <Label htmlFor="xray">X-Ray</Label>
                  </div>
                  \1>
                    <input type="checkbox" id="ct" defaultChecked />
                    <Label htmlFor="ct">CT Scan</Label>
                  </div>
                  \1>
                    <input type="checkbox" id="mri" defaultChecked />
                    <Label htmlFor="mri">MRI</Label>
                  </div>
                  \1>
                    <input type="checkbox" id="ultrasound" defaultChecked />
                    <Label htmlFor="ultrasound">Ultrasound</Label>
                  </div>
                  \1>
                    <input type="checkbox" id="mammography" defaultChecked />
                    <Label htmlFor="mammography">Mammography</Label>
                  </div>
                  \1>
                    <input type="checkbox" id="fluoroscopy" defaultChecked />
                    <Label htmlFor="fluoroscopy">Fluoroscopy</Label>
                  </div>
                </div>
              </div>

              <Button className="mt-4">Save Modalities</Button>
            </div>
          </TabsContent>

          \1>
            \1>
              \1>
                <Label>Report Templates</Label>
                \1>
                  \1>
                    <span className="font-medium">X-Ray Chest Template\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                  \1>
                    <span className="font-medium">CT Abdomen Template\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                  \1>
                    <span className="font-medium">MRI Brain Template\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button>Add New Template</Button>
            </div>
          </TabsContent>

          \1>
            \1>
              \1>
                <Label>Imaging Protocols</Label>
                \1>
                  \1>
                    <span className="font-medium">Standard CT Protocol\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                  \1>
                    <span className="font-medium">Contrast MRI Protocol\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                  \1>
                    <span className="font-medium">Pediatric Imaging Protocol\1>
                    \1>
                      <Button variant="outline" size="sm">Edit\1>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button>Add New Protocol</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
