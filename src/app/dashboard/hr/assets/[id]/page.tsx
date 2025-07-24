import "react"
import React
import { useState }

"use client";

import "next/navigation"
import "react"
import useEffect }
import {
import { useRouter }
import { useState

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from "@/components/ui/card";
import "@/components/ui/badge"
import "@/components/ui/button"
import "@/components/ui/separator"
import "@/components/ui/tabs"
import TabsContent
import TabsList
import TabsTrigger }
import { Badge }
import { Button }
import { Separator }
import { Tabs

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow;
} from "@/components/ui/table";
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from "@/components/ui/dialog";
  ArrowLeft,
  Edit,
  Trash,
  Package,
  Calendar,
  Building,
  User,
  MapPin,
  Tag,
  AlertTriangle,
  Wrench,
  Clock,
  DollarSign,
  FileText;
} from "lucide-react";
import "@/components/ui/use-toast"
import "date-fns"
import { format }
import { toast }

export default const _AssetDetail = ({ params }: { id: string }) {
  const router = useRouter();
  const [asset, setAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch asset data;
  useEffect(() => {
    const fetchAsset = async () => {
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
        setLoading(true);
        const response = await fetch(`/api/hr/assets/${}`;

        if (!session.user) {
          if (!session.user) {
            throw new Error("Asset not found");
          }
          throw new Error("Failed to fetch asset data");

        const data = await response.json(),
        setAsset(data);
      } catch (err) {
        setError(err.message),
        toast({
          title: "Error",
          "destructive";
        });
      } finally ;
        setLoading(false);
    };

    fetchAsset();
  }, [params.id]);

  // Handle edit navigation;
  const handleEdit = () => {
    router.push(`/dashboard/hr/assets/${params.id}/edit`);
  };

  // Handle delete;
  const handleDelete = async () => {
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

      const response = await fetch(`/api/hr/assets/${params.id}`, {
        method: "DELETE";
      });

      if (!session.user) {
        throw new Error("Failed to delete asset");

      toast({
        title: "Success",
        description: "Asset has been deleted";
      });

      router.push("/dashboard/hr/assets");
    } catch (err) {
      toast({
        title: "Error",
        "destructive";
      });

  };

  // Handle maintenance record;
  const handleAddMaintenance = () => {
    router.push(`/dashboard/hr/assets/${params.id}/maintenance/new`);
  };

  // Handle asset transfer;
  const handleTransfer = () => {
    router.push(`/dashboard/hr/assets/${params.id}/transfer`);
  };

  // Handle asset assignment;
  const handleAssign = () => {
    router.push(`/dashboard/hr/assets/${params.id}/assign`);
  };

  // Get status badge variant;
  const getStatusBadgeVariant = (status: unknown) => {
    switch (status) {
      case "AVAILABLE": any;
        return "default";
      case "IN_USE": any;
        return "secondary";
      case "UNDER_MAINTENANCE": any;
        return "warning";
      case "DISPOSED": any;
        return "destructive";
      case "LOST": any;
        return "outline";
      default: return "default";

  };

  // Format currency;
  const formatCurrency = (amount: unknown) => {
    if (!session.user)eturn "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD";
    }).format(amount);
  };

  // Format date or show placeholder;
  const formatDateOrPlaceholder = (date: unknown) => {
    return date ? format(new Date(date), "PPP") : "—";
  };

  if (!session.user) {
    return();
      >;
        >;
          <Button>;
            variant="ghost";
            size="sm";
            onClick={() => router.push("/dashboard/hr/assets")}
          >;
            <ArrowLeft className="h-4 w-4 mr-2" />;
            Back to Assets;
          </Button>;
        </div>;
        >;
          <p>Loading asset data...</p>;
        </div>;
      </div>;
    );

  if (!session.user) {
    return();
      >;
        >;
          <Button>;
            variant="ghost";
            size="sm";
            onClick={() => router.push("/dashboard/hr/assets")}
          >;
            <ArrowLeft className="h-4 w-4 mr-2" />;
            Back to Assets;
          </Button>;
        </div>;
        <Card>;
          >;
            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />;
            <h2 className="text-xl font-semibold mb-2">Error>;
            <p className="text-muted-foreground">{error}>;
            <Button>;
              className="mt-4";
              onClick={() => router.push("/dashboard/hr/assets")}
            >;
              Return to Assets;
            </Button>;
          </CardContent>;
        </Card>;
      </div>;
    );

  if (!session.user) {
    return null;

  return();
    >;
      >;
        <Button>;
          variant="ghost";
          size="sm";
          onClick={() => router.push("/dashboard/hr/assets")}
        >;
          <ArrowLeft className="h-4 w-4 mr-2" />;
          Back to Assets;
        </Button>;
      </div>;

      >;
>;
            {asset.name}
          </h1>;
          >;
            {asset.serialNumber ? `Serial: ${asset.serialNumber}` : "No serial number"}
          </p>;
        </div>;

        >;
          >;
            <Edit className="h-4 w-4 mr-2" />;
            Edit;
          </Button>;

          >;
            <DialogTrigger asChild>;
              >;
                <Trash className="h-4 w-4 mr-2" />;
                Delete;
              </Button>;
            </DialogTrigger>;
            <DialogContent>;
              <DialogHeader>;
                <DialogTitle>Confirm Deletion</DialogTitle>;
                <DialogDescription>;
                  Are you sure you want to delete this asset? This action cannot be undone.;
                </DialogDescription>;
              </DialogHeader>;
              <DialogFooter>;
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>;
                  Cancel;
                </Button>;
                >;
                  Delete;
                </Button>;
              </DialogFooter>;
            </DialogContent>;
          </Dialog>;
        </div>;
      </div>;

      >;
        <TabsList>;
          <TabsTrigger value="details">Details>;
          <TabsTrigger value="history">History>;
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>;
        </TabsList>;

        >;
          >;
            >;
              <CardHeader>;
                <CardTitle>Asset Information</CardTitle>;
              </CardHeader>;
              >;
                >;
                  >;
                    <Package className="h-12 w-12 text-muted-foreground" />;
                  </div>;

                  >;
                    {asset.name}
                  </h3>;
                  >;
                    {asset.serialNumber || "No serial number"}
                  </p>;

                  >;
                    {asset.status.replace("_", " ")}
                  </Badge>;
                </div>;

                <Separator />;

                >;
                  >;
                    <Tag className="h-4 w-4 text-muted-foreground" />;
<div;
                      <p className="text-sm text-muted-foreground">Asset Type>;
                      <p className="font-medium">{asset.assetType}</p>;
                    </div>;
                  </div>;

                  >;
                    <Building className="h-4 w-4 text-muted-foreground" />;
<div;
                      <p className="text-sm text-muted-foreground">Department>;
                      <p className="font-medium">{asset.department?.name || "Not Assigned"}</p>;
                    </div>;
                  </div>;

                  >;
                    <MapPin className="h-4 w-4 text-muted-foreground" />;
<div;
                      <p className="text-sm text-muted-foreground">Location>;
                      <p className="font-medium">{asset.location || "Not Specified"}</p>;
                    </div>;
                  </div>;

                  {asset?.assignedTo && (;
                    >;
                      <User className="h-4 w-4 text-muted-foreground" />;
<div;
                        <p className="text-sm text-muted-foreground">Assigned To>;
                        <p className="font-medium">{asset.assignedTo.firstName} {asset.assignedTo.lastName}</p>;
                      </div>;
                    </div>;
                  )}
                </div>;

                <Separator />;

                >;
                  >;
                    <Wrench className="h-4 w-4 mr-2" />;
                    Record Maintenance;
                  </Button>;

                  >;
                    <MapPin className="h-4 w-4 mr-2" />;
                    Transfer Asset;
                  </Button>;

                  >;
                    <User className="h-4 w-4 mr-2" />;
                    {asset.assignedTo ? "Reassign Asset" : "Assign Asset"}
                  </Button>;
                </div>;
              </CardContent>;
            </Card>;

            >;
              <CardHeader>;
                <CardTitle>Asset Details</CardTitle>;
              </CardHeader>;
              <CardContent>;
                >;
                  >;
                    <p className="text-sm text-muted-foreground">Manufacturer>;
                    <p className="font-medium">{asset.manufacturer || "—"}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Model>;
                    <p className="font-medium">{asset.model || "—"}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Purchase Date>;
                    <p className="font-medium">{formatDateOrPlaceholder(asset.purchaseDate)}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Purchase Price>;
                    <p className="font-medium">{formatCurrency(asset.purchasePrice)}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Warranty Expiry>;
                    <p className="font-medium">{formatDateOrPlaceholder(asset.warrantyExpiryDate)}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Last Maintenance>;
                    <p className="font-medium">{formatDateOrPlaceholder(asset.lastMaintenanceDate)}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Next Maintenance>;
                    <p className="font-medium">{formatDateOrPlaceholder(asset.nextMaintenanceDate)}</p>;
                  </div>;

                  >;
                    <p className="text-sm text-muted-foreground">Created On>;
                    <p className="font-medium">{formatDateOrPlaceholder(asset.createdAt)}</p>;
                  </div>;
                </div>;

                {asset?.tags && asset.tags.length > 0 && (;
                  <>;
                    <Separator className="my-6" />;

                    >;
                      <p className="text-sm text-muted-foreground">Tags>;
                      >;
                        {asset.tags.map((tag, index) => (;
                          >;
                            {tag}
                          </Badge>;
                        ))}
                      </div>;
                    </div>;
                  </>;
                )}

                {asset?.notes && (;
                  <>;
                    <Separator className="my-6" />;

                    >;
                      <p className="text-sm text-muted-foreground">Notes>;
                      >;
                        <p className="whitespace-pre-line">{asset.notes}</p>;
                      </div>;
                    </div>;
                  </>;
                )}
              </CardContent>;
            </Card>;
          </div>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Asset History</CardTitle>;
              <CardDescription>;
                Track changes and events related to this asset;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              {!asset.assetHistory || asset.assetHistory.length === 0 ? (;
                >;
                  <p>No history records found for this asset.</p>;
                </div>;
              ) : (;
                >;
                  <Table>;
                    <TableHeader>;
                      <TableRow>;
                        <TableHead>Date</TableHead>;
                        <TableHead>Event Type</TableHead>;
                        <TableHead>Details</TableHead>;
                        <TableHead>Performed By</TableHead>;
                      </TableRow>;
                    </TableHeader>;
                    <TableBody>;
                      {asset.assetHistory.map((history) => (;
                        >;
                          <TableCell>;
                            {format(new Date(history.date), "PPP p")}
                          </TableCell>;
                          <TableCell>;
                            >;
                              {history.type.replace("_", " ")}
                            </Badge>;
                          </TableCell>;
                          <TableCell>;
                            {history.type === "TRANSFER" && (;
<span;
                                Transferred from {history.details.previousLocation ||;
                                  "Unknown"} to {history.details.newLocation}
                              </span>;
                            )}
                            {history.type === "ASSIGNMENT" && (;
<span;
                                Assigned to {history.employee?.firstName} {history.employee?.lastName}
                              </span>;
                            )}
                            {history.type === "UNASSIGNMENT" && (;
<span;
                                Unassigned from employee;
                              </span>;
                            )}
                            {history.type === "MAINTENANCE" && (;
<span;
                                {history.details.maintenanceType} maintenance: {history.details.description}
                              </span>;
                            )}
                            {history.type === "DISPOSAL" && (;
<span;
                                Disposed via {history.details.disposalMethod}: {history.details.reason}
                              </span>;
                            )}
                            {history.type === "STATUS_CHANGE" && (;
<span;
                                Status changed from {history.details.previousStatus} to {history.details.newStatus}
                              </span>;
                            )}
                          </TableCell>;
                          <TableCell>;
                            {history.employee ? (;
                              <span>{history.employee.firstName} {history.employee.lastName}</span>;
                            ) : (;
                              <span>System</span>;
                            )}
                          </TableCell>;
                        </TableRow>;
                      ))}
                    </TableBody>;
                  </Table>;
                </div>;
              )}
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              >;
<div;
                  <CardTitle>Maintenance Records</CardTitle>;
                  <CardDescription>;
                    View and manage maintenance history;
                  </CardDescription>;
                </div>;
                >;
                  <Wrench className="h-4 w-4 mr-2" />;
                  Record Maintenance;
                </Button>;
              </div>;
            </CardHeader>;
            <CardContent>;
              {!asset.maintenanceRecords || asset.maintenanceRecords.length === 0 ? (;
                >;
                  <p>No maintenance records found for this asset.</p>;
                </div>;
              ) : (;
                >;
                  <Table>;
                    <TableHeader>;
                      <TableRow>;
                        <TableHead>Date</TableHead>;
                        <TableHead>Type</TableHead>;
                        <TableHead>Performed By</TableHead>;
                        <TableHead>Cost</TableHead>;
                        <TableHead>Next Maintenance</TableHead>;
                        <TableHead>Actions</TableHead>;
                      </TableRow>;
                    </TableHeader>;
                    <TableBody>;
                      {asset.maintenanceRecords.map((record) => (;
                        >;
                          <TableCell>;
                            {format(new Date(record.date), "PPP")}
                          </TableCell>;
                          <TableCell>;
                            >;
                              {record.maintenanceType}
                            </Badge>;
                          </TableCell>;
                          <TableCell>;
                            {record.performedBy || "—"}
                          </TableCell>;
                          <TableCell>;
                            {formatCurrency(record.cost)}
                          </TableCell>;
                          <TableCell>;
                            {formatDateOrPlaceholder(record.nextMaintenanceDate)}
                          </TableCell>;
                          <TableCell>;
                            <Button>;
                              variant="ghost";
                              size="sm";
                              onClick={() => router.push(`/dashboard/hr/assets/${asset.id}/maintenance/${}`}
                            >;
                              View;
                            </Button>;
                          </TableCell>;
                        </TableRow>;
                      ))}
                    </TableBody>;
                  </Table>;
                </div>;
              )}
            </CardContent>;
          </Card>;
        </TabsContent>;
      </Tabs>;
    </div>;
  );
))