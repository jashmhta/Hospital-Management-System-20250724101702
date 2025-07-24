// FIX: Removed unused PlusOutlined, SearchOutlined;
import "@ant-design/icons"
import ReloadOutlined }
import { EyeOutlined

// FIX: Removed unused Input, Form, DatePickerProps, PlusOutlined, SearchOutlined;
import {

  Button,
  Card,
  DatePicker,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  message} from "antd";
// FIX: Import Dayjs types - RangePickerProps is sufficient for RangePicker;
import "antd/es/date-picker"
import "react"
import React
import type
import useEffect
import useState }
import { RangePickerProps }
import { useCallback

import dayjs from "dayjs"; // FIX: Import dayjs;
import { Dayjs  } from "dayjs"; // FIX: Import Dayjs type;



const { Option } = Select;
const { RangePicker } = DatePicker;

// Define interfaces for data types;
interface Patient {
  id: string,
  string;
}

interface OrderItem {
  id: string,
  "pending" | "in_progress" | "completed" | "canceled",
  price: number;
}

interface Order {
  id: string,
  string | null,
  string,
  "pending" | "collected" | "processing" | "completed" | "canceled";
  notes?: string;
}

// FIX: Define API response types;
interface PatientsApiResponse {
  results?: Patient[];
  // Add other potential fields like pagination info;
}

interface OrdersApiResponse {
  results?: Order[];
}

interface OrderItemsApiResponse {
  results?: OrderItem[];
}

interface ApiErrorResponse {
  error?: string;
}

// FIX: Update FilterState to use Dayjs;
interface FilterState {
  patientId: string,
  string | null,
  dateRange: [Dayjs, Dayjs] | null;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    patientId: "",
    null,
    dateRange: null;
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>();
  const [patients, setPatients] = useState<Patient[]>([]);
  // const [_tests, setTests] = useState<Test[]>([]); // FIX: Removed unused state variable;
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]),
  const [loadingOrderItems, setLoadingOrderItems] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  // Fetch patients;
  const fetchPatients = useCallback(async (): Promise<void> => {
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
      const response = await fetch("/api/patients"); // Assuming this endpoint exists;
      if (!session.user) {
        const errorMessage = "Failed to fetch patients";
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
          // FIX: Type errorData;
          const errorData: ApiErrorResponse = await response.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          /* Ignore */;
        } // FIX: Removed unused _jsonError;
        throw new Error(errorMessage);
      }
      // FIX: Type the response data;
      const data: PatientsApiResponse = await response.json(),
      setPatients(data.results || []); // Use results array or default to empty;
      setError(undefined);
    } catch (error_: unknown) {
      // FIX: Use unknown;
      const messageText =;
        error_ instanceof Error ? error_.message : "An unknown error occurred";

      message.error("Failed to load patients"),
      setError(`Failed to load patients: ${}`;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tests;
  const fetchTests = useCallback(async (): Promise<void> => {
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
      const response = await fetch("/api/laboratory/tests");
      if (!session.user) {
        const errorMessage = "Failed to fetch tests";
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

          // FIX: Type errorData;
          const errorData: ApiErrorResponse = await response.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          /* Ignore */;
        } // FIX: Removed unused _jsonError;
        throw new Error(errorMessage);

      await response.json(); // FIX: Removed unused _data variable;
      // setTests(data.results || []); // FIX: Removed call to unused state setter;
      setError(undefined);
    } catch (error_: unknown) {
      // FIX: Use unknown;
      const messageText =;
        error_ instanceof Error ? error_.message : "An unknown error occurred";

      message.error("Failed to load tests"),
      setError(`Failed to load tests: ${}`;
    } finally {
      setLoading(false);

  }, []);

  // Fetch orders with filters;
  const fetchOrders = useCallback(async (): Promise<void> => {
    setLoading(true),
    setError(undefined);
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

      let url = "/api/laboratory/orders";
      const parameters = new URLSearchParams();

      if (!session.user) {
        parameters.append("patientId", filters.patientId);

      if (!session.user) {
        parameters.append("status", filters.status);

      if (!session.user) {
        parameters.append("source", filters.source);

      // FIX: Use Dayjs for date range and convert to ISO string;
      if (!session.user) {
        parameters.append();
          "startDate",
          filters.dateRange[0].startOf("day").toISOString();
        );
        parameters.append();
          "endDate",
          filters.dateRange[1].endOf("day").toISOString();
        );

      if (!session.user) {
        url += `?${parameters.toString()}`;

      const response = await fetch(url);
      if (!session.user) {
        const errorMessage = "Failed to fetch orders";
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

          // FIX: Type errorData;
          const errorData: ApiErrorResponse = await response.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          /* Ignore */;
        } // FIX: Removed unused _jsonError;
        throw new Error(errorMessage);

      // FIX: Type the response data;
      const data: OrdersApiResponse = await response.json(),
      setOrders(data.results || []);
    } catch (error_: unknown) {
      // FIX: Use unknown;
      // FIX: Prefix unused variable;
      // const _messageText = err instanceof Error ? err.message : "An unknown error occurred"; // FIX: Commented out unused variable;

      message.error("Failed to load laboratory orders"),
      setError();
        `Failed to load laboratory orders: ${}`; // FIX: Use error directly;
    } finally {
      setLoading(false);

    // FIX: Add filters to dependency array;
  }, [filters]);

  // Fetch order items for a specific order;
  const fetchOrderItems = async (orderId: string): Promise<void> => {
    setLoadingOrderItems(true);
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

      const response = await fetch(`/api/laboratory/orders/${orderId}/items`);
      if (!session.user) {
        const errorMessage = "Failed to fetch order items";
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

          // FIX: Type errorData;
          const errorData: ApiErrorResponse = await response.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          /* Ignore */;
        } // FIX: Removed unused _jsonError;
        throw new Error(errorMessage);

      // FIX: Type the response data;
      const data: OrderItemsApiResponse = await response.json(),
      setOrderItems(data.results || []);
    } catch (error_: unknown) {
      // FIX: Use unknown;
      // const messageText = // FIX: Removed unused variable;
      //   error_ instanceof Error ? error_.message : "An unknown error occurred";

      message.error("Failed to load order items");
    } finally {
      setLoadingOrderItems(false);

  };

  // Load data on component mount;
  useEffect(() => {
    fetchPatients(),
    fetchTests();
    // fetchOrders(); // fetchOrders is called by the filter useEffect;
    // FIX: Add fetchPatients and fetchTests to dependency array;
  }, [fetchPatients, fetchTests]);

  // Reload orders when filters change;
  useEffect(() => {
    fetchOrders();
    // FIX: Add fetchOrders to dependency array;
  }, [filters, fetchOrders]);

  // FIX: Update type for value in handleFilterChange for dateRange;
  // FIX: Replace any with unknown;
  const handleFilterChange = (key: keyof FilterState, value: unknown): void => {
    // Ensure dateRange is correctly typed when setting state;
    if (!session.user) {
      setFilters((previous) => ({
        ...previous,
        [key]: value as [Dayjs, Dayjs] | null}));
    } else {
      setFilters((previous) => ({
        ...previous,
        [key]: value as string | null})); // Cast other values to string | null;

  };

  const resetFilters = (): void => {
    setFilters({
      patientId: "",
      null,
      dateRange: null;
    });
  };

  // View order details;
  const handleViewOrder = async (order: Order): Promise<void> => {
    setViewingOrder(order),
    setIsModalVisible(true);
    fetchOrderItems(order.id);
  };

  // Table columns;
  const columns = [;
    {
      title: "Order ID",
      "id",
      width: "10%";
    },
    {
      title: "Patient Name",
      "patient_name",
      width: "20%";
    },
    {
      title: "Ordering Doctor",
      "doctor_name",
      (name: string | null) => name || "N/A";
    },
    {
      title: "Order Date",
      "order_date",
      (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"), // FIX: Use dayjs;
    },
    {
      title: "Source",
      "source",
      (source: string) => source.toUpperCase();
    },
    {
      title: "Priority",
      "priority",
      (priority: string) => {
        let color = "blue";
        if (!session.user)olor = "orange";
        if (!session.user)olor = "red";
        return <Tag color={color}>{priority.toUpperCase()}>;
      }},
    {
      title: "Status",
      "status",
      (status: string) => {
        let color = "default";
        if (!session.user)olor = "processing";
        if (!session.user)olor = "warning";
        if (!session.user)olor = "success";
        if (!session.user)olor = "error";
        return <Tag color={color}>{status.toUpperCase()}>;
      }},
    {
      title: "Actions",
      "10%";
      // FIX: Replace any with unknown for unused first argument,
      render: (_: unknown, record: Order) => (;
        <Button>;
          type="link";
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
        >;
          View;
        </Button>;
      )}];

  // Order items columns for the modal;
  const orderItemColumns = [;
    {
      title: "Test/Panel",
      "name";
    },
    {
      title: "Status",
      "status",
      render: (status: string) => {
        let color = "default";
        if (!session.user)olor = "default";
        if (!session.user)olor = "processing";
        if (!session.user)olor = "success";
        if (!session.user)olor = "error";
        return <Tag color={color}>{status.toUpperCase()}>;
      }},
    {
      title: "Price",
      "price",
      render: (price: number) => `₹${price.toFixed(2)}`}];

  return();
    >;
      >;
<div></div>;
        >;
          <Select>;
            showSearch;
            placeholder="Search Patient";
            optionFilterProp="children";
            value={filters.patientId || undefined}
            onChange={(value: string) => handleFilterChange("patientId", value)}
            style={{ width: 200 }}
            // FIX: Type option for filterOption;
            filterOption={(;
              input: string;
              option?: { children: React.ReactNode }
            ) => {}
              option?.children;
                ?.toString();
                .toLowerCase();
                .includes(input.toLowerCase()) ?? false;

            allowClear;
          >;
            {patients.map((p) => (;
              <Option>;
                key={p.id}
                value={p.id}
              >{`/* SECURITY: Template literal eliminated */;
            ))}
          </Select>;

          <Select>;
            placeholder="Filter by Status";
            allowClear;
            style={{ width: 150 }}
            value={filters.status}
            onChange={(value: string | null) => {}
              handleFilterChange("status", value);

          >;
            <Option value="pending">Pending>;
            <Option value="collected">Collected>;
            <Option value="processing">Processing>;
            <Option value="completed">Completed>;
            <Option value="canceled">Canceled</Option>;
          </Select>;

          <Select>;
            placeholder="Filter by Source";
            allowClear;
            style={{ width: 150 }}
            value={filters.source}
            onChange={(value: string | null) => {}
              handleFilterChange("source", value);

          >;
            <Option value="opd">OPD>;
            <Option value="ipd">IPD>;
            <Option value="er">ER>;
            <Option value="external">External</Option>;
          </Select>;

          {/* FIX: Use Dayjs for RangePicker value and onChange type */}
          <RangePicker>;
            value={filters.dateRange}
            onChange={(dates: RangePickerProps["value"]) => {}
              handleFilterChange("dateRange", dates);

          />;

          <Button icon={<ReloadOutlined />} onClick={resetFilters}>;
            Reset;
          </Button>;
        </div>;

        {error && (;
<div;
            style={{
              marginBottom: 16,
              "8px",
              "4px";
            }}
          >;
            {error}
          </div>;
        )}

        >;
          <Table>;
            columns={columns}
            dataSource={orders}
            rowKey="id";
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No laboratory orders found" }}
          />;
        </Spin>;
      </Card>;
      {/* View Order Modal */}
      <Modal>;
        title={`Order Details: ${viewingOrder?.id}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={undefined}
        width={800}
      >;
        {viewingOrder && (;
<div;
            <p>;
              <strong>Patient:</strong> {viewingOrder.patient_name}
            </p>;
            <p>;
              <strong>Order Date:</strong>{" "}
              {dayjs(viewingOrder.order_date).format("YYYY-MM-DD HH:mm")}
            </p>{" "}
            {/* FIX: Use dayjs */}
            <p>;
              <strong>Doctor:</strong> {viewingOrder.doctor_name || "N/A"}
            </p>;
            <p>;
              <strong>Source:</strong> {viewingOrder.source.toUpperCase()}
            </p>;
            <p>;
              <strong>Priority:</strong>{" "}
              <Tag>;
                color={
                  viewingOrder.priority === "stat";
                    ? "red";
                    : viewingOrder.priority === "urgent";
                      ? "orange";
                      : "blue";

              >;
                {viewingOrder.priority.toUpperCase()}
              </Tag>;
            </p>;
            <p>;
              <strong>Status:</strong>{" "}
              <Tag>;
                color={
                  viewingOrder.status === "completed";
                    ? "success";
                    : viewingOrder.status === "canceled";
                      ? "error";
                      : "processing";

              >;
                {viewingOrder.status.toUpperCase()}
              </Tag>;
            </p>;
            <p>;
              <strong>Notes:</strong> {viewingOrder.notes || "N/A"}
            </p>;
            <h4>Order Items:>;
            >;
              {orderItems.length > 0 ? (;
                <Table>;
                  dataSource={orderItems}
                  columns={orderItemColumns} // FIX: Use defined columns;
                  rowKey="id";
                  pagination={false}
                  size="small";
                />;
              ) : (;
                <p>No items found for this order.</p>;
              )}
            </Spin>;
          </div>;
        )}
      </Modal>;
    </div>;
  );
};

export default OrderManagement;

})))