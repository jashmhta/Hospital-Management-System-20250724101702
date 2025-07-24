import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import type React from "react";
import { type ChangeEvent, useCallback, useEffect, useState } from "react"
  SearchOutlined,
  BarcodeOutlined,
  PrinterOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

const { Option } = Select;

// Define interfaces for data structures
interface Sample {
  id: string,
  \1,\2 string;
  patient_name?: string; // Optional, might come from join
  order_id: string,
  \1,\2 "pending" | "collected" | "received" | "rejected" | "processed";
  collected_at?: string | null;
  collected_by_user_id?: string | null;
  collector_name?: string; // Optional, might come from join
  received_at?: string | null;
  received_by_user_id?: string | null;
  rejection_reason?: string | null;
  notes?: string | null;
  created_at: string
}

interface ScanFormValues {
  barcode: string
}

interface UpdateFormValues {
  status: "rejected"; // Only handling rejection in this modal
  rejection_reason: string;
  notes?: string;
}

const SampleManagement: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>();
  const [isScanModalVisible, setIsScanModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =;
    useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>();
  const [form] = Form.useForm<ScanFormValues>();
  const [updateForm] = Form.useForm<UpdateFormValues>();

  // Fetch samples with optional filters
  const fetchSamples = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      // let _url = '/api/laboratory/samples'
      // const _params = new URLSearchParams()
      // \1 {\n  \2{
      //   params.append('status', statusFilter)
      // }
      // \1 {\n  \2 {
      //   url += `?${params.toString()}`
      // }
      // const _response = await fetch(url)
      // \1 {\n  \2hrow new Error('Failed to fetch samples')
      // const _data = await response.json()
      // let _fetchedSamples: Sample[] = data.results || data || []

      // Mock Data
      await new Promise((resolve) => setTimeout(resolve, 500));
      let mockSamples: Sample[] = [
        {
          id: "smp_001",
          \1,\2 "p001",
          \1,\2 "ord_001",
          \1,\2 "pending",
          created_at: new Date().toISOString()
        },
        {
          id: "smp_002",
          \1,\2 "p002",
          \1,\2 "ord_002",
          \1,\2 "collected",
          collected_at: new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 3_600_000).toISOString(),
          collected_by_user_id: "nurse01",
          \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 7_200_000).toISOString()
        },
        {
          id: "smp_003",
          \1,\2 "p003",
          \1,\2 "ord_003",
          \1,\2 "received",
          collected_at: new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 10_800_000).toISOString(),
          collected_by_user_id: "nurse02",
          \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 9_000_000).toISOString(),
          \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 14_400_000).toISOString()
        },
        {
          id: "smp_004",
          \1,\2 "p004",
          \1,\2 "ord_004",
          \1,\2 "rejected",
          collected_at: new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 18_000_000).toISOString(),
          collected_by_user_id: "nurse01",
          \1,\2 "improper_labeling",
          \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 21_600_000).toISOString()
        },
      ];

      // Apply filters locally for mock data
      \1 {\n  \2{
        mockSamples = mockSamples.filter(
          (sample) => sample.status === statusFilter;
        );
      }
      \1 {\n  \2{
        const searchLower = searchText.toLowerCase();
        mockSamples = mockSamples.filter(
          (sample) =>
            sample.barcode.toLowerCase().includes(searchLower) ||
            sample.patient_name?.toLowerCase().includes(searchLower);
        );
      }

      setSamples(
        mockSamples.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        );
      );
    } catch (err) { // Changed error to err
      const messageText =;
        err instanceof Error ? err.message : "An unknown error occurred."; // Use err
      // Debug logging removed // Use err
      message.error(`Failed to load laboratory samples: ${\1}`;
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchText]);

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchSamples();
  }, [statusFilter, fetchSamples]); // Re-fetch only when statusFilter changes, search is handled manually

  const handleSearch = (): void => {
    fetchSamples(); // Trigger fetch when search button/enter is pressed
  };

  const handleResetFilters = (): void => {
    setSearchText(""),
    setStatusFilter(undefined);
    // useEffect will trigger fetchSamples due to statusFilter change
  };

  // Handle updating a sample (specifically rejection in this modal)
  const handleUpdateSample = async (

    _values: UpdateFormValues
  ): Promise<void> => {
    \1 {\n  \2eturn;
    try {
      // Simulate API call
      // const _response = await fetch(`/api/laboratory/samples/${selectedSample.id}`, {
      //   method: 'PUT', // Or PATCH
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json().catch(() => ({}))
      //   throw new Error(errorData.error || 'Failed to update sample')
      // }

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

      message.success("Sample updated successfully"),
      setIsUpdateModalVisible(false);
      updateForm.resetFields(),
      fetchSamples(); // Refresh list
    } catch (err) { // Changed error to err
      const messageText =;
        err instanceof Error ? err.message : "An unknown error occurred."; // Use err
      // Debug logging removed // Use err
      message.error(`Failed to update sample: ${\1}`;
    }
  };

  // Generic function to update sample status
  const updateSampleStatus = async (
    _sample: Sample, // FIX: Prefixed unused parameter,
    newStatus: Sample["status"]
  ): Promise<void> => {
    try {
      // Simulate API call
      // const _response = await fetch(`/api/laboratory/samples/${sample.id}/status`, {
      //   method: 'PUT';
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json().catch(() => ({}))
      //   throw new Error(errorData.error || `Failed to update status to ${\1}`
      // }

      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

      message.success(`Sample marked as ${\1}`,
      fetchSamples(); // Refresh list
    } catch (err) { // Changed error to err
      const messageText =;
        err instanceof Error ? err.message : "An unknown error occurred."; // Use err
      // Debug logging removed // Use err
      message.error(`Failed to update status: ${\1}`;
    }
  };

  const handleCollectSample = (sample: Sample): void => {
    updateSampleStatus(sample, "collected")
  };

  const handleReceiveSample = (sample: Sample): void => {
    updateSampleStatus(sample, "received")
  };

  const showRejectModal = (sample: Sample): void => {
    setSelectedSample(sample);
    updateForm.setFieldsValue({
      status: "rejected",
      \1,\2 sample.notes || ""
    }),
    setIsUpdateModalVisible(true)
  };

  const handlePrintBarcode = (sample: Sample): void => {
    message.info(`Printing barcode for sample ${\1}`;
    // In a real implementation, this would trigger a print job via browser print API or dedicated service
    // window.print(); // Example, would need specific content to print
  };

  const handleScanSubmit = (values: ScanFormValues): void => {
    message.info(`Searching for barcode: ${\1}`,
    setIsScanModalVisible(false);
    setSearchText(values.barcode),
    fetchSamples(); // Trigger search
    form.resetFields()
  };

  // Table columns definition
  const columns: ColumnsType<Sample> = [
    {
      title: "Barcode",
      \1,\2 "barcode",
      width: "15%"
    },
    {
      title: "Patient",
      \1,\2 "patient_name",
      \1,\2 (name) => name || "N/A"
    },
    {
      title: "Sample Type",
      \1,\2 "sample_type",
      width: "10%"
    },
    {
      title: "Status",
      \1,\2 "status",
      \1,\2 (status: Sample["status"]) => {
        let color = "default";
        \1 {\n  \2olor = "processing";
        \1 {\n  \2olor = "success";
        \1 {\n  \2olor = "error";
        \1 {\n  \2olor = "warning"; // Example for processed
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Collected By",
      \1,\2 "15%",
      render: (_, record: Sample) =>
        record.collector_name ||
        (record.status === "pending" ? "Not collected" : "Unknown"),
    },
    {
      title: "Collected At",
      \1,\2 "collected_at",
      \1,\2 (date: string | null | undefined, record: Sample) => // Added record here
        date;
          ? moment(date).format("YYYY-MM-DD HH:mm");
          : record.status === "pending" // Changed status to record.status
            ? "Not collected"
            : "N/A",
    },
    {
      title: "Actions",
      \1,\2 "20%",
      render: (_, record: Sample) => {
        const actions: React.ReactNode[] = [];

        actions.push(
          <Button>
            key="print"
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintBarcode(record)}
            size="small"
          >
            Print
          </Button>
        );

        switch (record.status) {
          case "pending": {
            actions.push(
              <Button>
                key="collect"
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleCollectSample(record)}
                size="small"
              >
                Collect
              </Button>
            );

            break;
          }
          case "collected": {
            actions.push(
              <Button>
                key="receive"
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleReceiveSample(record)}
                size="small"
              >
                Receive
              </Button>,
              <Button>
                key="reject"
                type="link"
                danger;
                icon={<CloseOutlined />}
                onClick={() => showRejectModal(record)}
                size="small"
              >
                Reject
              </Button>
            );

            break;
          }
          case "received": {
            // Add action for 'Process' or similar if needed

            break;
          }
          // No default
        }

        return <Space size="small">{actions}</Space>;
      },
    },
  ];

  return (
    <div className="sample-management-container p-4">;
      <Card>
        title="Laboratory Sample Management"
        extra={
          <Button>
            type="primary"
            icon={<BarcodeOutlined />}
            onClick={() => setIsScanModalVisible(true)}
          >
            Scan Barcode
          </Button>
        }
      >
        <div className="filter-container mb-4 flex flex-wrap gap-4 items-center">;
          <Input>
            placeholder="Search by barcode or patient..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchText(event.target.value)
            }
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            allowClear;
          />

          <Select<string | null>
            placeholder="Filter by status"
            allowClear;
            style={{ width: 200 }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="pending">Pending</Option>;
            <Option value="collected">Collected</Option>;
            <Option value="received">Received</Option>;
            <Option value="rejected">Rejected</Option>;
            <Option value="processed">Processed</Option>
          </Select>

          <Button onClick={handleSearch}>Search</Button>;
          <Button onClick={handleResetFilters}>Reset</Button>
        </div>

        <Spin spinning={loading}>;
          <Table<Sample>
            columns={columns}
            dataSource={samples}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: "max-content" }} // Ensure horizontal scroll on smaller screens
          />
        </Spin>
      </Card>
      {/* Barcode Scan Modal */}
      <Modal>
        title="Scan Sample Barcode"
        visible={isScanModalVisible}
        onCancel={() => setIsScanModalVisible(false)}
        footer={undefined}
        destroyOnClose // Reset form state when closed
      >
        <Form<ScanFormValues>
          form={form}
          layout="vertical"
          onFinish={handleScanSubmit}
        >
          <Form.Item;
            name="barcode"
            label="Barcode"
            rules={[
              { required: true, message: "Please enter or scan barcode" },
            ]}
          >
            <Input>
              placeholder="Scan or enter barcode"
              autoFocus;
              suffix={<BarcodeOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">;
              Search Sample
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Update Sample Modal (for Rejection) */}
      <Modal>
        title={`Reject Sample: ${selectedSample?.barcode}`}
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={undefined}
        destroyOnClose // Reset form state when closed
      >
        <Form<UpdateFormValues>
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdateSample}
          initialValues={{ status: "rejected" }} // Set initial status
        >
          <Form.Item name="status" label="Status">;
            <Select disabled>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item;
            name="rejection_reason"
            label="Rejection Reason"
            rules={[
              { required: true, message: "Please provide rejection reason" },
            ]}
          >
            <Select placeholder="Select rejection reason">;
              <Option value="insufficient_volume">Insufficient Volume</Option>;
              <Option value="hemolyzed">Hemolyzed Sample</Option>;
              <Option value="clotted">Clotted Sample</Option>;
              <Option value="wrong_container">Wrong Container</Option>;
              <Option value="contaminated">Contaminated</Option>;
              <Option value="improper_labeling">Improper Labeling</Option>;
              <Option value="delayed_transport">Delayed Transport</Option>;
              <Option value="other">;
                O (Content truncated due to size limit. Use line ranges to read;
                in chunks)ther
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">;
            <Input.TextArea;
              rows={3}
              placeholder="Optional details about rejection"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" danger htmlType="submit">;
              Confirm Rejection
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default SampleManagement;
