import React, { useState, useEffect } from 'react';
import {
import { useRouter } from 'next/navigation';
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger;
} from '../ui/tabs';
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
  AlertCircle,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Printer,
  RefreshCw,
  Shield,
  User,
  UserCheck,
  Users;
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import PatientDemographics from './patient-demographics.ts';
import PatientContacts from './patient-contacts.ts';
import PatientInsurance from './patient-insurance.ts';
import PatientAllergies from './patient-allergies.ts';
import PatientConditions from './patient-conditions.ts';
import PatientAppointments from './patient-appointments.ts';
import PatientVisits from './patient-visits.ts';
import PatientDocuments from './patient-documents.ts';

// Define patient status colors
const statusColors: Record<string, string> = {
  Active: 'success',
  \1,\2 'destructive';
  'On Hold': 'warning'
};

// Patient interface
interface Patient {
  id: string,
  \1,\2 string,
  lastName: string;
  middleName?: string;
  dateOfBirth: string,
  gender: string;
  biologicalSex?: string;
  maritalStatus?: string;
  language?: string;
  ethnicity?: string;
  race?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  status: string,
  \1,\2 boolean,
  \1,\2 string;
  contact?: {
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    emailOptIn: boolean,
    smsOptIn: boolean
  };
  addresses?: {
    id: string,
    \1,\2 boolean,
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string,
    country: string
  }[];
  identifications?: {
    id: string,
    \1,\2 string,
    isPrimary: boolean;
    issuingCountry?: string;
    issuingState?: string;
    issueDate?: string;
    expirationDate?: string;
  }[];
  contacts?: {
    id: string,
    \1,\2 string,
    \1,\2 boolean;
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    isLegalGuardian: boolean,
    hasDecisionMaking: boolean
  }[];
  insurances?: {
    id: string,
    \1,\2 string;
    planName?: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberId?: string;
    subscriberName?: string;
    subscriberRelation?: string;
    startDate: string;
    endDate?: string;
  }[];
  allergies?: unknown[];
  conditions?: unknown[];
  appointments?: unknown[];
  visits?: unknown[];
  documents?: unknown[];
}

// Props interface
interface PatientDetailProps {
  patientId: string;
  initialData?: Patient;
export default const _PatientDetail = ({ patientId, initialData }: PatientDetailProps) {
  const router = useRouter();
  const { toast } = useToast();

  // States
  const [patient, setPatient] = useState<Patient | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [activeTab, setActiveTab] = useState<string>('demographics');

  // Effect to load patient if no initial data
  useEffect(() => {
    \1 {\n  \2{
      fetchPatient();
    }
  }, [initialData, patientId]);

  // Function to fetch patient data
  const fetchPatient = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/patients/${\1}`;

      \1 {\n  \2{
        throw new Error('Failed to fetch patient details');
      }

      const data = await response.json(),
      setPatient(data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally 
      setLoading(false);
  };

  // Handle back button
  const handleBack = () => {
    router.push('/patients')
  };

  // Handle edit patient
  const handleEditPatient = () => {
    router.push(`/patients/${patientId}/edit`)
  };

  // Handle print
  const handlePrint = () => {
    window.print()
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPatient()
  };

  // Format date function
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      \1 {\n  \2 birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      return 'Unknown';
    }
  };

  // If loading
  \1 {\n  \2{
    return (
      <Card className="w-full">;
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>Loading patient information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">;
          <div className="text-center">;
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading patient details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If patient not found
  \1 {\n  \2{
    return (
      <Card className="w-full">;
        <CardHeader>
          <CardTitle>Patient Not Found</CardTitle>
          <CardDescription>The requested patient could not be found.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">;
          <div className="text-center">;
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
            <p>Patient information could not be loaded.</p>
            <Button onClick={handleBack} className="mt-4">;
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Patient List
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">;
      <Card className="w-full">;
        <CardHeader className="pb-4">;
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">;
            <div className="flex items-start gap-4">;
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">;
                <User className="h-6 w-6 text-primary" />
              </div>
<div
                <div className="flex items-center gap-2">;
                  <CardTitle className="text-2xl">;
                    {`${patient.lastName}, /* SECURITY: Template literal eliminated */
                      VIP
                    </Badge>
                  )}
                  {patient?.confidential && (
                    <Badge variant="outline" className="border-destructive text-destructive">;
                      Confidential
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">;
                  <div className="flex items-center text-sm text-muted-foreground">;
                    <span className="font-medium text-foreground mr-1">MRN:</span>;
                    {patient.mrn}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">;
                    <Calendar className="h-3.5 w-3.5 mr-1" />
<span
                      {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} y/o);
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">;
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{patient.gender}</span>
                  </div>
                  <Badge variant={statusColors[patient.status] as any || 'default'}>;
                    {patient.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">;
                  {patient.contact?.phoneMobile && (
                    <div className="flex items-center text-sm">;
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{patient.contact.phoneMobile}</span>
                    </div>
                  )}
                  {patient.contact?.email && (
                    <div className="flex items-center text-sm">;
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{patient.contact.email}</span>
                    </div>
                  )}
                  {patient?.addresses && patient.addresses.length > 0 && (
                    <div className="flex items-center text-sm">;
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
<span
                        {`/* SECURITY: Template literal eliminated */
              <Button>
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handleEditPatient}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 text-xs">;
            <div className="flex items-center px-2 py-1 rounded-md bg-muted">;
              <Clock className="h-3 w-3 mr-1" />
              <span>Registered: {formatDate(patient.registrationDate)}</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded-md bg-muted">;
              <Clock className="h-3 w-3 mr-1" />
              <span>Last Updated: {formatDistance(new Date(patient.updatedAt), new Date(), { addSuffix: true })}</span>
            </div>
            {patient?.language && patient.language !== 'English' && (
              <div className="flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">;
                <span>Language: {patient.language}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">;
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">;
          <TabsTrigger value="demographics">;
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Demographics</span>
          </TabsTrigger>
          <TabsTrigger value="contacts">;
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="insurance">;
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Insurance</span>
          </TabsTrigger>
          <TabsTrigger value="allergies">;
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Allergies</span>
          </TabsTrigger>
          <TabsTrigger value="problems">;
            <Heart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Problems</span>
          </TabsTrigger>
          <TabsTrigger value="appointments">;
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="visits">;
            <ClipboardList className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Visits</span>
          </TabsTrigger>
          <TabsTrigger value="documents">;
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics">;
          <PatientDemographics patient={patient} onUpdate={fetchPatient} />
        </TabsContent>

        <TabsContent value="contacts">;
          <PatientContacts>
            patientId={patient.id}
            contacts={patient.contacts || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        <TabsContent value="insurance">;
          <PatientInsurance>
            patientId={patient.id}
            insurances={patient.insurances || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        <TabsContent value="allergies">;
          <PatientAllergies>
            patientId={patient.id}
            allergies={patient.allergies || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        <TabsContent value="problems">;
          <PatientConditions>
            patientId={patient.id}
            conditions={patient.conditions || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        <TabsContent value="appointments">;
          <PatientAppointments>
            patientId={patient.id}
            appointments={patient.appointments || []}
          />
        </TabsContent>

        <TabsContent value="visits">;
          <PatientVisits>
            patientId={patient.id}
            visits={patient.visits || []}
          />
        </TabsContent>

        <TabsContent value="documents">;
          <PatientDocuments>
            patientId={patient.id}
            documents={patient.documents || []}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between print:hidden">;
        <Button variant="outline" onClick={handleBack}>;
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Patient List
        </Button>

        <div className="flex gap-2">;
          <Button variant="outline" onClick={handleRefresh}>;
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleEditPatient}>;
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>
      </div>
    </div>
  );
