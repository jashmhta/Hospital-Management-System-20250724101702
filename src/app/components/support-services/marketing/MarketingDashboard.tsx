import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
// Define column types for campaign table
type Campaign = {
  id: string,
  \1,\2 string,
  \1,\2 string;
  endDate?: string;
  segmentCount: number;
  performance?: {
    opens?: number;
    clicks?: number;
    conversions?: number
  };
};

// Define column types for contact table
type Contact = {
  id: string,
  \1,\2 string;
  phone?: string;
  source: string,
  \1,\2 string;
  lastActivity?: string
};

export default const _MarketingDashboard = () {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Define columns for campaign table
  const campaignColumns: ColumnDef<Campaign>[] = [
    {
      accessorKey: 'name',
      \1,\2 ({ row }) => (
        <div className="font-medium cursor-pointer hover:text-primary"
             onClick={() => router.push(`/marketing/campaigns/${\1}`}>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      \1,\2 ({ row }) => (
        <Badge variant="outline">{row.getValue('type')}\1>
      ),
    },
    {
      accessorKey: 'status',
      \1,\2 ({ row }) => {
        const status = row.getValue('status') as string;
        let variant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline';

        switch (status) {
          case 'ACTIVE':
            variant = 'default';\1\n    }\n    case 'DRAFT':
            variant = 'secondary';\1\n    }\n    case 'PAUSED':
            variant = 'outline';\1\n    }\n    case 'COMPLETED':
            variant = 'outline';\1\n    }\n    case 'CANCELLED':
            variant = 'destructive';
            break;
        }

        return <Badge variant={variant}>{status}\1>
      },
    },
    {
      accessorKey: 'startDate',
      \1,\2 ({ row }) => \1.toLocaleDateString(),
    },
    {
      accessorKey: 'segmentCount',
      \1,\2 ({ row }) => row.getValue('segmentCount'),
    },
    {
      id: 'performance',
      \1,\2 ({ row }) => {
        const performance = row.original.performance;
        \1 {\n  \2eturn 'No data';

        return (
          \1>
            {performance.opens !== undefined && (
              \1>
                {performance.opens} opens
              </Badge>
            )}
            {performance.clicks !== undefined && (
              \1>
                {performance.clicks} clicks
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: (row ) => (
        \1>
          <Button>
            variant="outline"
            size="sm"
            onClick={() => router.push(`/marketing/campaigns/${\1}`}
          >
            View
          </Button>
          <Button>
            variant="outline"
            size="sm"
            onClick={() => router.push(`/marketing/campaigns/${row.original.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  // Define columns for contact table
  const contactColumns: ColumnDef<Contact>[] = [
    {
      accessorKey: 'name',
      \1,\2 ({ row }) => (
        <div className="font-medium cursor-pointer hover:text-primary"
             onClick={() => router.push(`/marketing/contacts/$row.original.id`)}>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Phone'
    },
    {
      accessorKey: 'source',
      \1,\2 ({ row }) => (
        <Badge variant="outline">{row.getValue('source')}\1>
      ),
    },
    {
      accessorKey: 'status',
      \1,\2 ({ row }) => {
        const status = row.getValue('status') as string;
        let variant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline';

        switch (status) {
          case 'ACTIVE':
            variant = 'default';\1\n    }\n    case 'INACTIVE':
            variant = 'secondary';\1\n    }\n    case 'UNSUBSCRIBED':
            variant = 'destructive';
            break;
        }

        return <Badge variant={variant}>{status}\1>
      },
    },
    {
      accessorKey: 'lastActivity',
      \1,\2 ({ row }) => {
        const lastActivity = row.getValue('lastActivity');
        return lastActivity ? new Date(lastActivity as string).toLocaleDateString() : 'Never';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        \1>
          <Button>
            variant="outline"
            size="sm"
            onClick={() => router.push(`/marketing/contacts/$row.original.id`)}
          >
            View
          </Button>
          <Button>
            variant="outline"
            size="sm"
            onClick={() => router.push(`/marketing/contacts/$row.original.id/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch campaigns
        const campaignsResponse = await fetch('/api/support-services/marketing/campaigns');
        \1 {\n  \2hrow new Error('Failed to fetch campaigns');
        const campaignsData = await campaignsResponse.json(),
        setCampaigns(campaignsData.data || []);

        // Fetch contacts
        const contactsResponse = await fetch('/api/support-services/marketing/contacts');
        \1 {\n  \2hrow new Error('Failed to fetch contacts');
        const contactsData = await contactsResponse.json(),
        setContacts(contactsData.data || []);

        // Fetch segments
        const segmentsResponse = await fetch('/api/support-services/marketing/segments');
        \1 {\n  \2hrow new Error('Failed to fetch segments');
        const segmentsData = await segmentsResponse.json(),
        setSegments(segmentsData.data || []);

        // Fetch templates
        const templatesResponse = await fetch('/api/support-services/marketing/templates');
        \1 {\n  \2hrow new Error('Failed to fetch templates');
        const templatesData = await templatesResponse.json(),
        setTemplates(templatesData.data || []);
      } catch (error) {

        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      } finally 
        setIsLoading(false);
    };

    fetchData();
  }, []);

  // Filter campaigns based on selected filter and search query
  const filteredCampaigns = campaigns.filter(campaign => {
    \1 {\n  \2{
      return false;
    }

    \1 {\n  \2includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Filter contacts based on selected filter and search query
  const filteredContacts = contacts.filter(contact => {
    \1 {\n  \2{
      return false;
    }

    \1 {\n  \2includes(searchQuery.toLowerCase()) &&
        !contact.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sample data for charts
  const campaignPerformanceData = {
    labels: ['Campaign 1', 'Campaign 2', 'Campaign 3', 'Campaign 4', 'Campaign 5'],
    datasets: [
      {
        label: 'Opens',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Clicks',
        data: [28, 48, 40, 19, 36],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Conversions',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const contactGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Contacts',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const contactSourceData = {
    labels: ['Website', 'Referral', 'Social Media', 'Event', 'Other'],
    datasets: [
      {
        label: 'Contact Sources',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderWidth: 1
      },
    ],
  };

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Marketing CRM Dashboard\1>
        \1>
          <Button>
            variant="outline"
            onClick={() => router.push('/marketing/campaigns/new')}
          >
            New Campaign
          </Button>
          <Button>
            onClick={() => router.push('/marketing/contacts/new')}
          >
            Add Contact
          </Button>
        </div>
      </div>

      \1>
        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}\1>
            \1>
              {campaigns.filter(c => c.status === 'ACTIVE').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}\1>
            \1>
              {contacts.filter(c => c.status === 'ACTIVE').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.length}\1>
            \1>
              Across {campaigns.length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}\1>
            \1>
              {templates.filter((t: unknown) => t.isActive).length} active
            </p>
          </CardContent>
        </Card>
      </div>

      \1>
        \1>
          <TabsTrigger value="overview">Overview\1>
          <TabsTrigger value="campaigns">Campaigns\1>
          <TabsTrigger value="contacts">Contacts\1>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        \1>
          \1>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Performance metrics across all campaigns
                </CardDescription>
                \1>
                  \1>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days\1>
                    <SelectItem value="30d">Last 30 days\1>
                    <SelectItem value="90d">Last 90 days\1>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <BarChart data={campaignPerformanceData} height={300} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Growth</CardTitle>
                <CardDescription>
                  New contacts over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={contactGrowthData} height={300} />
              </CardContent>
            </Card>
          </div>

          \1>
            \1>
              <CardHeader>
                <CardTitle>Contact Sources</CardTitle>
                <CardDescription>
                  Where your contacts come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={contactSourceData} height={200} />
              </CardContent>
            </Card>

            \1>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  Your most recent marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                \1>
                  {campaigns.slice(0, 5).map((campaign) => (
                    \1>
<div
                        <h4 className="font-medium">{campaign.name}\1>
                        \1>
                          {new Date(campaign.startDate).toLocaleDateString()} • {campaign.type}
                        </p>
                      </div>
                      \1>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}

                  {campaigns.length === 0 && (
                    <p className="text-sm text-muted-foreground">No campaigns yet\1>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
              <CardDescription>
                Manage your marketing campaigns
              </CardDescription>
              \1>
                <Input>
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                \1>
                  \1>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns\1>
                    <SelectItem value="ACTIVE">Active\1>
                    <SelectItem value="DRAFT">Draft\1>
                    <SelectItem value="SCHEDULED">Scheduled\1>
                    <SelectItem value="PAUSED">Paused\1>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  variant="outline"
                  onClick={() => router.push('/marketing/campaigns/new')}
                  className="sm:ml-auto"
                >
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                \1>
                  <p>Loading campaigns...</p>
                </div>
              ) : (
                <DataTable>
                  columns={campaignColumns}
                  data={filteredCampaigns}
                  emptyMessage="No campaigns found"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Marketing Contacts</CardTitle>
              <CardDescription>
                Manage your marketing contacts and leads
              </CardDescription>
              \1>
                <Input>
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                \1>
                  \1>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts\1>
                    <SelectItem value="ACTIVE">Active\1>
                    <SelectItem value="INACTIVE">Inactive\1>
                    <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  onClick={() => router.push('/marketing/contacts/new')}
                  className="sm:ml-auto"
                >
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                \1>
                  <p>Loading contacts...</p>
                </div>
              ) : (
                <DataTable>
                  columns={contactColumns}
                  data={filteredContacts}
                  emptyMessage="No contacts found"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Marketing Analytics</CardTitle>
              <CardDescription>
                Analyze the performance of your marketing efforts
              </CardDescription>
              \1>
                \1>
                  \1>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days\1>
                    <SelectItem value="30d">Last 30 days\1>
                    <SelectItem value="90d">Last 90 days\1>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              \1>
                \1>
                  <TabsTrigger value="performance">Campaign Performance\1>
                  <TabsTrigger value="engagement">Engagement\1>
                  <TabsTrigger value="conversion">Conversion</TabsTrigger>
                </TabsList>

                \1>
                  \1>
                    <Card>
                      <CardHeader>
                        <CardTitle>Campaign Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BarChart data={campaignPerformanceData} height={300} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LineChart data={contactGrowthData} height={300} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                \1>
                  \1>
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LineChart data={contactGrowthData} height={300} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BarChart data={campaignPerformanceData} height={300} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                \1>
                  \1>
                    <Card>
                      <CardHeader>
                        <CardTitle>Conversion Rates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BarChart data={campaignPerformanceData} height={300} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>ROI Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LineChart data={contactGrowthData} height={300} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
