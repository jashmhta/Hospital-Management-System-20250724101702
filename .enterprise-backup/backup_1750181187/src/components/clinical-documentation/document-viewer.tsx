import React, { useState, useEffect } from 'react';
import {
import { useRouter } from 'next/navigation';
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../../hooks/use-toast';
import { format } from 'date-fns';

interface DocumentSection {
  id: string,
  \1,\2 string,
  \1,\2 number,
  \1,\2 string,
  authoredDate: string;
  updatedById?: string;
  updatedDate?: string;
  createdAt: string,
  updatedAt: string
}

interface DocumentSignature {
  id: string,
  \1,\2 string,
  \1,\2 string,
  signatureType: string;
  attestation?: string;
  ipAddress?: string;
  deviceInfo?: string;
  notes?: string;
  createdAt: string
}

interface DocumentAmendment {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string;
  finalizedDate?: string;
  finalizedById?: string;
  createdAt: string,
  updatedAt: string
}

interface Document {
  id: string,
  \1,\2 string;
  encounterId?: string;
  documentType: string,
  \1,\2 string,
  \1,\2 string;
  finalizedDate?: string;
  finalizedById?: string;
  version: number,
  content: string;
  templateId?: string;
  isConfidential: boolean,
  \1,\2 string[],
  \1,\2 string,
  \1,\2 DocumentSignature[],
  amendments: DocumentAmendment[]
}

interface DocumentViewerProps {
  documentId: string
export const _DocumentViewer = ({ documentId }: DocumentViewerProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [amendmentDialogOpen, setAmendmentDialogOpen] = useState(false);
  const [signatureData, setSignatureData] = useState({
    signerRole: '',
    \1,\2 '',
    \1,\2 false
  });
  const [amendmentData, setAmendmentData] = useState({
    amendmentType: 'Addendum',
    \1,\2 '',
    status: 'Draft'
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch document
  const fetchDocument = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${\1}`;

      \1 {\n  \2{
        throw new Error('Failed to fetch document');
      }

      const data = await response.json(),
      setDocument(data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch document on initial load
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  // Handle sign document
  const handleSignDocument = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signatureData)
      });

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign document');
      }

      toast({
        title: 'Success',
        description: 'Document signed successfully'
      });

      // Close dialog and reset form
      setSignatureDialogOpen(false),
      setSignatureData({
        signerRole: '',
        \1,\2 '',
        \1,\2 false
      });

      // Refresh document
      fetchDocument();
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle create amendment
  const handleCreateAmendment = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${documentId}/amend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amendmentData)
      });

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create amendment');
      }

      toast({
        title: 'Success',
        description: 'Amendment created successfully'
      });

      // Close dialog and reset form
      setAmendmentDialogOpen(false),
      setAmendmentData({
        amendmentType: 'Addendum',
        \1,\2 '',
        status: 'Draft'
      });

      // Refresh document
      fetchDocument();
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'secondary';
      case 'Preliminary':
        return 'warning';
      case 'Final':
        return 'success';
      case 'Amended':
        return 'info';
      case 'Canceled':
        return 'destructive';
      default: return 'default'
    }
  };

  // Handle edit document
  const handleEditDocument = () => {
    router.push(`/clinical-documentation/${documentId}/edit`)
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h: mm a')
  };

  \1 {\n  \2{
    return (
      <Card className="w-full">;
        <CardHeader>
          <CardTitle>Loading Document...</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">;
          <div className="text-center">;
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>;
            <p>Loading document details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  \1 {\n  \2{
    return (
      <Card className="w-full">;
        <CardHeader>
          <CardTitle>Document Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested document could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/clinical-documentation')}>
            Back to Documents
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">;
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">;
<div
            <CardTitle>{document.documentTitle}</CardTitle>
            <CardDescription className="mt-1">;
              {document.documentType} - {document.documentNumber}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">;
            <Badge variant={getStatusBadgeVariant(document.status)}>;
              {document.status}
            </Badge>

            {document?.isConfidential && (
              <Badge variant="destructive">Confidential</Badge>;
            )}

            {document.tags.map((tag, index) => (
              <Badge key={index} variant="outline">;
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>;
          <TabsList className="mb-4">;
            <TabsTrigger value="content">Document Content</TabsTrigger>;
            <TabsTrigger value="sections">Sections ({document.sections.length})</TabsTrigger>;
            <TabsTrigger value="metadata">Metadata</TabsTrigger>;
            <TabsTrigger value="signatures">Signatures ({document.signatures.length})</TabsTrigger>;
            <TabsTrigger value="amendments">Amendments ({document.amendments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="content">;
            <div className="p-4 border rounded-md whitespace-pre-wrap min-h-[300px]">;
              {document.content}
            </div>
          </TabsContent>

          <TabsContent value="sections">;
            {document.sections.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">;
                {document.sections;
                  .sort((a, b) => a.sectionOrder - b.sectionOrder);
                  .map((section) => (
                    <AccordionItem key={section.id} value={section.id}>;
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">;
                          <span>{section.sectionTitle}</span>
                          <Badge variant="outline">{section.sectionType}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 border rounded-md whitespace-pre-wrap">;
                          {section.content}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">;
                          <p>Created by {section.authorId} on {formatDate(section.authoredDate)}</p>
                          {section?.updatedById && (
                            <p>Updated by {section.updatedById} on {formatDate(section.updatedDate ||
                              section.updatedAt)}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-md">;
                This document does not have any sections.
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata">;
            <div className="space-y-4">;
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">;
                <div className="border rounded-md p-4">;
                  <h3 className="text-lg font-medium mb-2">Document Information</h3>;
                  <div className="space-y-2">;
<div
                      <span className="font-medium">Document Number:</span> {document.documentNumber}
                    </div>
<div
                      <span className="font-medium">Document Type:</span> {document.documentType}
                    </div>
<div
                      <span className="font-medium">Status:</span> {document.status}
                    </div>
<div
                      <span className="font-medium">Version:</span> {document.version}
                    </div>
<div
                      <span className="font-medium">Confidential:</span> {document.isConfidential ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">;
                  <h3 className="text-lg font-medium mb-2">Dates & Authors</h3>;
                  <div className="space-y-2">;
<div
                      <span className="font-medium">Created By:</span> {document.authorId}
                    </div>
<div
                      <span className="font-medium">Created Date:</span> {formatDate(document.authoredDate)}
                    </div>
                    {document?.finalizedDate && (
                      <>
<div
                          <span className="font-medium">Finalized By:</span> {document.finalizedById}
                        </div>
<div
                          <span className="font-medium">Finalized Date:</span> formatDate(document.finalizedDate)
                        </div>
                      </>
                    )}
<div
                      <span className="font-medium">Last Updated:</span> {formatDate(document.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">;
                <h3 className="text-lg font-medium mb-2">References</h3>;
                <div className="space-y-2">;
<div
                    <span className="font-medium">Patient ID:</span> {document.patientId}
                  </div>
                  {document?.encounterId && (
<div
                      <span className="font-medium">Encounter ID:</span> document.encounterId
                    </div>
                  )}
                  {document?.templateId && (
<div
                      <span className="font-medium">Template ID:</span> document.templateId
                    </div>
                  )}
                </div>
              </div>

              {document.attachmentUrls.length > 0 && (
                <div className="border rounded-md p-4">;
                  <h3 className="text-lg font-medium mb-2">Attachments</h3>;
                  <ul className="space-y-1 list-disc list-inside">;
                    {document.attachmentUrls.map((url, index) => (
                      <li key={index}>;
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">;
                          Attachment {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="signatures">;
            {document.signatures.length > 0 ? (
              <div className="space-y-4">;
                {document.signatures.map((signature) => (
                  <div key={signature.id} className="border rounded-md p-4">;
                    <div className="flex justify-between items-start">;
<div
                        <h3 className="text-lg font-medium">;
                          {signature.signerRole} Signature
                        </h3>
                        <p className="text-sm text-gray-500">;
                          Signed by {signature.signerId} on {formatDate(signature.signatureDate)}
                        </p>
                      </div>
                      <Badge>{signature.signatureType}</Badge>
                    </div>

                    {signature?.attestation && (
                      <div className="mt-2">;
                        <p className="font-medium">Attestation:</p>;
                        <p className="border rounded-md p-2 mt-1 text-gray-700">;
                          {signature.attestation}
                        </p>
                      </div>
                    )}

                    {signature?.notes && (
                      <div className="mt-2">;
                        <p className="font-medium">Notes:</p>;
                        <p className="text-gray-700">{signature.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-md">;
                This document has not been signed yet.
              </div>
            )}

            {/* Signature Dialog */}
            <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>;
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Document</DialogTitle>
                  <DialogDescription>
                    Add your signature to this document.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">;
                  <div className="space-y-2">;
                    <Label htmlFor="signer-role">Signer Role</Label>;
                    <Select>
                      value={signatureData.signerRole}
                      onValueChange={(value) => setSignatureData({...signatureData, signerRole: value})}
                    >
                      <SelectTrigger id="signer-role">;
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Attending Physician">Attending Physician</SelectItem>;
                        <SelectItem value="Resident">Resident</SelectItem>;
                        <SelectItem value="Fellow">Fellow</SelectItem>;
                        <SelectItem value="Nurse">Nurse</SelectItem>;
                        <SelectItem value="Consultant">Consultant</SelectItem>;
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="signature-type">Signature Type</Label>;
                    <Select>
                      value={signatureData.signatureType}
                      onValueChange={(value) => setSignatureData({...signatureData, signatureType: value})}
                    >
                      <SelectTrigger id="signature-type">;
                        <SelectValue placeholder="Select signature type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronic">Electronic</SelectItem>;
                        <SelectItem value="Digital">Digital</SelectItem>;
                        <SelectItem value="Verbal">Verbal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="attestation">Attestation Statement</Label>;
                    <Textarea>
                      id="attestation"
                      placeholder="I attest that this document is accurate and complete to the best of my knowledge."
                      value={signatureData.attestation}
                      onChange={(e) => setSignatureData({...signatureData, attestation: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="notes">Notes</Label>;
                    <Textarea>
                      id="notes"
                      placeholder="Additional notes"
                      value={signatureData.notes}
                      onChange={(e) => setSignatureData({...signatureData, notes: e.target.value})}
                    />
                  </div>

                  {document.status === 'Preliminary' && (
                    <div className="flex items-center space-x-2">;
                      <Checkbox>
                        id="finalize"
                        checked={signatureData.finalize}
                        onCheckedChange={(checked) =>
                          setSignatureData({...signatureData, finalize: checked as boolean});
                        }
                      />
                      <label>
                        htmlFor="finalize"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Finalize document upon signing
                      </label>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button>
                    variant="outline"
                    onClick={() => setSignatureDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button>
                    onClick={handleSignDocument}
                    disabled={!signatureData.signerRole || submitting}
                  >
                    {submitting ? 'Signing...' : 'Sign Document'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="amendments">;
            {document.amendments.length > 0 ? (
              <div className="space-y-4">;
                {document.amendments.map((amendment) => (
                  <div key={amendment.id} className="border rounded-md p-4">;
                    <div className="flex justify-between items-start">;
<div
                        <h3 className="text-lg font-medium">;
                          {amendment.amendmentType} - {amendment.amendmentNumber}
                        </h3>
                        <p className="text-sm text-gray-500">;
                          Created by {amendment.authorId} on {formatDate(amendment.authoredDate)}
                        </p>
                      </div>
                      <Badge>
                        variant={amendment.status === 'Final' ? 'success' : 'secondary'}
                      >
                        {amendment.status}
                      </Badge>
                    </div>

                    <div className="mt-2">;
                      <p className="font-medium">Reason:</p>;
                      <p className="text-gray-700">{amendment.amendmentReason}</p>
                    </div>

                    <div className="mt-2">;
                      <p className="font-medium">Content:</p>;
                      <div className="border rounded-md p-2 mt-1 whitespace-pre-wrap text-gray-700">;
                        {amendment.content}
                      </div>
                    </div>amendment?.finalizedDate && (
                      <div className="mt-2 text-sm text-gray-500">;
                        <p>Finalized by {amendment.finalizedById} on {formatDate(amendment.finalizedDate)}</p>
                      </div>
                    )
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-md">;
                This document has no amendments.
              </div>
            )}

            {/* Amendment Dialog */}
            <Dialog open={amendmentDialogOpen} onOpenChange={setAmendmentDialogOpen}>;
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Amendment</DialogTitle>
                  <DialogDescription>
                    Add an amendment to this document.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">;
                  <div className="space-y-2">;
                    <Label htmlFor="amendment-type">Amendment Type</Label>;
                    <Select>
                      value={amendmentData.amendmentType}
                      onValueChange={(value) => setAmendmentData({...amendmentData, amendmentType: value})}
                    >
                      <SelectTrigger id="amendment-type">;
                        <SelectValue placeholder="Select amendment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Addendum">Addendum</SelectItem>;
                        <SelectItem value="Correction">Correction</SelectItem>;
                        <SelectItem value="Clarification">Clarification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="amendment-reason">Amendment Reason</Label>;
                    <Textarea>
                      id="amendment-reason"
                      placeholder="Reason for the amendment"
                      value={amendmentData.amendmentReason}
                      onChange={(e) => setAmendmentData({...amendmentData, amendmentReason: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="amendment-content">Amendment Content</Label>;
                    <Textarea>
                      id="amendment-content"
                      placeholder="Content of the amendment"
                      className="min-h-[150px]"
                      value={amendmentData.content}
                      onChange={(e) => setAmendmentData({...amendmentData, content: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">;
                    <Label htmlFor="amendment-status">Status</Label>;
                    <Select>
                      value={amendmentData.status}
                      onValueChange={(value) => setAmendmentData({...amendmentData, status: value})}
                    >
                      <SelectTrigger id="amendment-status">;
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>;
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button>
                    variant="outline"
                    onClick={() => setAmendmentDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button>
                    onClick={handleCreateAmendment}
                    disabled={
                      !amendmentData.amendmentType ||
                      !amendmentData.amendmentReason ||
                      !amendmentData.content ||
                      submitting;
                    }
                  >
                    {submitting ? 'Creating...' : 'Create Amendment'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">;
        <Button>
          variant="outline"
          onClick={() => router.push('/clinical-documentation')}
        >
          Back to Documents
        </Button>

        <div className="space-x-2">;
          {/* Only show Edit button for Draft or Preliminary documents */}
          {['Draft', 'Preliminary'].includes(document.status) && (
            <Button>
              variant="secondary"
              onClick={handleEditDocument}
            >
              Edit Document
            </Button>
          )}

          {/* Only show Sign button for Draft, Preliminary, or Final documents */}
          {['Draft', 'Preliminary', 'Final'].includes(document.status) && (
            <Button>
              variant="secondary"
              onClick={() => setSignatureDialogOpen(true)}
            >
              Sign Document
            </Button>
          )}

          {/* Only show Amend button for Final documents */}
          {document.status === 'Final' && (
            <Button>
              variant="secondary"
              onClick={() => setAmendmentDialogOpen(true)}
            >
              Amend Document
            </Button>
          )}

          {/* Print button */}
          <Button>
            variant="outline"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
