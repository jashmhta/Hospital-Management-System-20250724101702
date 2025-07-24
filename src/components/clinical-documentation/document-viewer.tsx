import "next/navigation"
import "react"
import React
import useEffect }
import {
import { useRouter }
import { useState

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from "../ui/card";
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from "../ui/dialog";
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger} from "../ui/accordion";
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger} from "../ui/tabs";
import "../../hooks/use-toast"
import "../ui/badge"
import "../ui/button"
import "../ui/checkbox"
import "../ui/label"
import "../ui/select"
import "../ui/textarea"
import "date-fns"
import SelectContent
import SelectItem
import SelectTrigger
import SelectValue }
import { Badge }
import { Button }
import { Checkbox }
import { format }
import { Label }
import { Select
import { Textarea }
import { useToast }

interface DocumentSection {
  id: string,
  string,
  number,
  string,
  authoredDate: string;
  updatedById?: string;
  updatedDate?: string;
  createdAt: string,
  updatedAt: string;
}

interface DocumentSignature {
  id: string,
  string,
  string,
  signatureType: string;
  attestation?: string;
  ipAddress?: string;
  deviceInfo?: string;
  notes?: string;
  createdAt: string;
}

interface DocumentAmendment {
  id: string,
  string,
  string,
  string,
  string;
  finalizedDate?: string;
  finalizedById?: string;
  createdAt: string,
  updatedAt: string;
}

interface Document {
  id: string,
  string;
  encounterId?: string;
  documentType: string,
  string,
  string;
  finalizedDate?: string;
  finalizedById?: string;
  version: number,
  content: string;
  templateId?: string;
  isConfidential: boolean,
  string[],
  string,
  DocumentSignature[],
  amendments: DocumentAmendment[];
}

interface DocumentViewerProps {
  documentId: string;
export const _DocumentViewer = ({ documentId }: DocumentViewerProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // State;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [amendmentDialogOpen, setAmendmentDialogOpen] = useState(false);
  const [signatureData, setSignatureData] = useState({
    signerRole: "",
    "",
    false;
  });
  const [amendmentData, setAmendmentData] = useState({
    amendmentType: "Addendum",
    "",
    status: "Draft";
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch document;
  const fetchDocument = async () => {
    setLoading(true);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      const response = await fetch(`/api/clinical-documentation/${}`;

      if (!session.user) {
        throw new Error("Failed to fetch document");
      }

      const data = await response.json(),
      setDocument(data);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch document on initial load;
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  // Handle sign document;
  const handleSignDocument = async () => {
    setSubmitting(true);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {

} catch (error) {

      const response = await fetch(`/api/clinical-documentation/${documentId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(signatureData);
      });

      if (!session.user) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign document");

      toast({
        title: "Success",
        description: "Document signed successfully";
      });

      // Close dialog and reset form;
      setSignatureDialogOpen(false),
      setSignatureData({
        signerRole: "",
        "",
        false;
      });

      // Refresh document;
      fetchDocument();
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setSubmitting(false);

  };

  // Handle create amendment;
  const handleCreateAmendment = async () => {
    setSubmitting(true);

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      const response = await fetch(`/api/clinical-documentation/${documentId}/amend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(amendmentData);
      });

      if (!session.user) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create amendment");

      toast({
        title: "Success",
        description: "Amendment created successfully";
      });

      // Close dialog and reset form;
      setAmendmentDialogOpen(false),
      setAmendmentData({
        amendmentType: "Addendum",
        "",
        status: "Draft";
      });

      // Refresh document;
      fetchDocument();
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setSubmitting(false);

  };

  // Get status badge variant;
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Draft": any;
        return "secondary";
      case "Preliminary": any;
        return "warning";
      case "Final": any;
        return "success";
      case "Amended": any;
        return "info";
      case "Canceled": any;
        return "destructive";
      default: return "default";

  };

  // Handle edit document;
  const handleEditDocument = () => {
    router.push(`/clinical-documentation/${documentId}/edit`);
  };

  // Helper function to format date;
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h: mm a");
  };

  if (!session.user) {
    return();
      >;
        <CardHeader>;
          <CardTitle>Loading Document...</CardTitle>;
        </CardHeader>;
        >;
          >;
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4">>;
            <p>Loading document details...</p>;
          </div>;
        </CardContent>;
      </Card>;
    );

  if (!session.user) {
    return();
      >;
        <CardHeader>;
          <CardTitle>Document Not Found</CardTitle>;
        </CardHeader>;
        <CardContent>;
          <p>The requested document could not be found.</p>;
        </CardContent>;
        <CardFooter>;
          <Button onClick={() => router.push("/clinical-documentation")}>;
            Back to Documents;
          </Button>;
        </CardFooter>;
      </Card>;
    );

  return();
    >;
      <CardHeader>;
        >;
<div;
            <CardTitle>{document.documentTitle}</CardTitle>;
            >;
              {document.documentType} - {document.documentNumber}
            </CardDescription>;
          </div>;
          >;
            >;
              {document.status}
            </Badge>;

            {document?.isConfidential && (;
              <Badge variant="destructive">Confidential>;
            )}

            {document.tags.map((tag, index) => (;
              >;
                {tag}
              </Badge>;
            ))}
          </div>;
        </div>;
      </CardHeader>;

      <CardContent>;
        >;
          >;
            <TabsTrigger value="content">Document Content>;
            <TabsTrigger value="sections">Sections ({document.sections.length})>;
            <TabsTrigger value="metadata">Metadata>;
            <TabsTrigger value="signatures">Signatures ({document.signatures.length})>;
            <TabsTrigger value="amendments">Amendments ({document.amendments.length})</TabsTrigger>;
          </TabsList>;

          >;
            >;
              {document.content}
            </div>;
          </TabsContent>;

          >;
            {document.sections.length > 0 ? (;
              >;
                {document.sections;
                  .sort((a, b) => a.sectionOrder - b.sectionOrder);
                  .map((section) => (;
                    >;
                      <AccordionTrigger>;
                        >;
                          <span>{section.sectionTitle}</span>;
                          <Badge variant="outline">{section.sectionType}</Badge>;
                        </div>;
                      </AccordionTrigger>;
                      <AccordionContent>;
                        >;
                          {section.content}
                        </div>;
                        >;
                          <p>Created by {section.authorId} on {formatDate(section.authoredDate)}</p>;
                          {section?.updatedById && (;
                            <p>Updated by {section.updatedById} on {formatDate(section.updatedDate ||;
                              section.updatedAt)}</p>;
                          )}
                        </div>;
                      </AccordionContent>;
                    </AccordionItem>;
                  ))}
              </Accordion>;
            ) : (;
              >;
                This document does not have any sections.;
              </div>;
            )}
          </TabsContent>;

          >;
            >;
              >;
                >;
                  <h3 className="text-lg font-medium mb-2">Document Information>;
                  >;
<div;
                      <span className="font-medium">Document Number:</span> {document.documentNumber}
                    </div>;
<div;
                      <span className="font-medium">Document Type:</span> {document.documentType}
                    </div>;
<div;
                      <span className="font-medium">Status:</span> {document.status}
                    </div>;
<div;
                      <span className="font-medium">Version:</span> {document.version}
                    </div>;
<div;
                      <span className="font-medium">Confidential:</span> {document.isConfidential ? "Yes" : "No"}
                    </div>;
                  </div>;
                </div>;

                >;
                  <h3 className="text-lg font-medium mb-2">Dates & Authors>;
                  >;
<div;
                      <span className="font-medium">Created By:</span> {document.authorId}
                    </div>;
<div;
                      <span className="font-medium">Created Date:</span> {formatDate(document.authoredDate)}
                    </div>;
                    {document?.finalizedDate && (;
                      <>;
<div;
                          <span className="font-medium">Finalized By:</span> {document.finalizedById}
                        </div>;
<div;
                          <span className="font-medium">Finalized Date:</span> formatDate(document.finalizedDate);
                        </div>;
                      </>;
                    )}
<div;
                      <span className="font-medium">Last Updated:</span> {formatDate(document.updatedAt)}
                    </div>;
                  </div>;
                </div>;
              </div>;

              >;
                <h3 className="text-lg font-medium mb-2">References>;
                >;
<div;
                    <span className="font-medium">Patient ID:</span> {document.patientId}
                  </div>;
                  {document?.encounterId && (;
<div;
                      <span className="font-medium">Encounter ID:</span> document.encounterId;
                    </div>;
                  )}
                  {document?.templateId && (;
<div;
                      <span className="font-medium">Template ID:</span> document.templateId;
                    </div>;
                  )}
                </div>;
              </div>;

              {document.attachmentUrls.length > 0 && (;
                >;
                  <h3 className="text-lg font-medium mb-2">Attachments>;
                  >;
                    {document.attachmentUrls.map((url, index) => (;
                      >;
                        >;
                          Attachment {index + 1}
                        </a>;
                      </li>;
                    ))}
                  </ul>;
                </div>;
              )}
            </div>;
          </TabsContent>;

          >;
            {document.signatures.length > 0 ? (;
              >;
                {document.signatures.map((signature) => (;
                  >;
                    >;
>;
                          {signature.signerRole} Signature;
                        </h3>;
                        >;
                          Signed by {signature.signerId} on {formatDate(signature.signatureDate)}
                        </p>;
                      </div>;
                      <Badge>{signature.signatureType}</Badge>;
                    </div>;

                    {signature?.attestation && (;
                      >;
                        <p className="font-medium">Attestation:>;
                        >;
                          {signature.attestation}
                        </p>;
                      </div>;
                    )}

                    {signature?.notes && (;
                      >;
                        <p className="font-medium">Notes:>;
                        <p className="text-gray-700">{signature.notes}</p>;
                      </div>;
                    )}
                  </div>;
                ))}
              </div>;
            ) : (;
              >;
                This document has not been signed yet.;
              </div>;
            )}

            {/* Signature Dialog */}
            >;
              <DialogContent>;
                <DialogHeader>;
                  <DialogTitle>Sign Document</DialogTitle>;
                  <DialogDescription>;
                    Add your signature to this document.;
                  </DialogDescription>;
                </DialogHeader>;

                >;
                  >;
                    <Label htmlFor="signer-role">Signer Role>;
                    <Select>;
                      value={signatureData.signerRole}
                      onValueChange={(value) => setSignatureData({...signatureData, signerRole: value})}
                    >;
                      >;
                        <SelectValue placeholder="Select role" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Attending Physician">Attending Physician>;
                        <SelectItem value="Resident">Resident>;
                        <SelectItem value="Fellow">Fellow>;
                        <SelectItem value="Nurse">Nurse>;
                        <SelectItem value="Consultant">Consultant>;
                        <SelectItem value="Other">Other</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;

                  >;
                    <Label htmlFor="signature-type">Signature Type>;
                    <Select>;
                      value={signatureData.signatureType}
                      onValueChange={(value) => setSignatureData({...signatureData, signatureType: value})}
                    >;
                      >;
                        <SelectValue placeholder="Select signature type" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Electronic">Electronic>;
                        <SelectItem value="Digital">Digital>;
                        <SelectItem value="Verbal">Verbal</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;

                  >;
                    <Label htmlFor="attestation">Attestation Statement>;
                    <Textarea>;
                      id="attestation";
                      placeholder="I attest that this document is accurate and complete to the best of my knowledge.";
                      value={signatureData.attestation}
                      onChange={(e) => setSignatureData({...signatureData, attestation: e.target.value})}
                    />;
                  </div>;

                  >;
                    <Label htmlFor="notes">Notes>;
                    <Textarea>;
                      id="notes";
                      placeholder="Additional notes";
                      value={signatureData.notes}
                      onChange={(e) => setSignatureData({...signatureData, notes: e.target.value})}
                    />;
                  </div>;

                  {document.status === "Preliminary" && (;
                    >;
                      <Checkbox>;
                        id="finalize";
                        checked={signatureData.finalize}
                        onCheckedChange={(checked) => {}
                          setSignatureData({...signatureData, finalize: checked as boolean});

                      />;
                      <label>;
                        htmlFor="finalize";
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
                      >;
                        Finalize document upon signing;
                      </label>;
                    </div>;
                  )}
                </div>;

                <DialogFooter>;
                  <Button>;
                    variant="outline";
                    onClick={() => setSignatureDialogOpen(false)}
                    disabled={submitting}
                  >;
                    Cancel;
                  </Button>;
                  <Button>;
                    onClick={handleSignDocument}
                    disabled={!signatureData.signerRole || submitting}
                  >;
                    {submitting ? "Signing..." : "Sign Document"}
                  </Button>;
                </DialogFooter>;
              </DialogContent>;
            </Dialog>;
          </TabsContent>;

          >;
            {document.amendments.length > 0 ? (;
              >;
                {document.amendments.map((amendment) => (;
                  >;
                    >;
>;
                          {amendment.amendmentType} - {amendment.amendmentNumber}
                        </h3>;
                        >;
                          Created by {amendment.authorId} on {formatDate(amendment.authoredDate)}
                        </p>;
                      </div>;
                      <Badge>;
                        variant={amendment.status === "Final" ? "success" : "secondary"}
                      >;
                        {amendment.status}
                      </Badge>;
                    </div>;

                    >;
                      <p className="font-medium">Reason:>;
                      <p className="text-gray-700">{amendment.amendmentReason}</p>;
                    </div>;

                    >;
                      <p className="font-medium">Content:>;
                      >;
                        {amendment.content}
                      </div>;
                    </div>amendment?.finalizedDate && (;
                      >;
                        <p>Finalized by {amendment.finalizedById} on {formatDate(amendment.finalizedDate)}</p>;
                      </div>;
                    );
                  </div>;
                ))}
              </div>;
            ) : (;
              >;
                This document has no amendments.;
              </div>;
            )}

            {/* Amendment Dialog */}
            >;
              <DialogContent>;
                <DialogHeader>;
                  <DialogTitle>Create Amendment</DialogTitle>;
                  <DialogDescription>;
                    Add an amendment to this document.;
                  </DialogDescription>;
                </DialogHeader>;

                >;
                  >;
                    <Label htmlFor="amendment-type">Amendment Type>;
                    <Select>;
                      value={amendmentData.amendmentType}
                      onValueChange={(value) => setAmendmentData({...amendmentData, amendmentType: value})}
                    >;
                      >;
                        <SelectValue placeholder="Select amendment type" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Addendum">Addendum>;
                        <SelectItem value="Correction">Correction>;
                        <SelectItem value="Clarification">Clarification</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;

                  >;
                    <Label htmlFor="amendment-reason">Amendment Reason>;
                    <Textarea>;
                      id="amendment-reason";
                      placeholder="Reason for the amendment";
                      value={amendmentData.amendmentReason}
                      onChange={(e) => setAmendmentData({...amendmentData, amendmentReason: e.target.value})}
                    />;
                  </div>;

                  >;
                    <Label htmlFor="amendment-content">Amendment Content>;
                    <Textarea>;
                      id="amendment-content";
                      placeholder="Content of the amendment";
                      className="min-h-[150px]";
                      value={amendmentData.content}
                      onChange={(e) => setAmendmentData({...amendmentData, content: e.target.value})}
                    />;
                  </div>;

                  >;
                    <Label htmlFor="amendment-status">Status>;
                    <Select>;
                      value={amendmentData.status}
                      onValueChange={(value) => setAmendmentData({...amendmentData, status: value})}
                    >;
                      >;
                        <SelectValue placeholder="Select status" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Draft">Draft>;
                        <SelectItem value="Final">Final</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;
                </div>;

                <DialogFooter>;
                  <Button>;
                    variant="outline";
                    onClick={() => setAmendmentDialogOpen(false)}
                    disabled={submitting}
                  >;
                    Cancel;
                  </Button>;
                  <Button>;
                    onClick={handleCreateAmendment}
                    disabled={
                      !amendmentData.amendmentType ||;
                      !amendmentData.amendmentReason ||;
                      !amendmentData.content ||;
                      submitting;

                  >;
                    {submitting ? "Creating..." : "Create Amendment"}
                  </Button>;
                </DialogFooter>;
              </DialogContent>;
            </Dialog>;
          </TabsContent>;
        </Tabs>;
      </CardContent>;

      >;
        <Button>;
          variant="outline";
          onClick={() => router.push("/clinical-documentation")}
        >;
          Back to Documents;
        </Button>;

        >;
          {/* Only show Edit button for Draft or Preliminary documents */}
          {["Draft", "Preliminary"].includes(document.status) && (;
            <Button>;
              variant="secondary";
              onClick={handleEditDocument}
            >;
              Edit Document;
            </Button>;
          )}

          {/* Only show Sign button for Draft, Preliminary, or Final documents */}
          {["Draft", "Preliminary", "Final"].includes(document.status) && (;
            <Button>;
              variant="secondary";
              onClick={() => setSignatureDialogOpen(true)}
            >;
              Sign Document;
            </Button>;
          )}

          {/* Only show Amend button for Final documents */}
          {document.status === "Final" && (;
            <Button>;
              variant="secondary";
              onClick={() => setAmendmentDialogOpen(true)}
            >;
              Amend Document;
            </Button>;
          )}

          {/* Print button */}
          <Button>;
            variant="outline";
            onClick={() => window.print()}
          >;
            Print;
          </Button>;
        </div>;
      </CardFooter>;
    </Card>;
  );
)