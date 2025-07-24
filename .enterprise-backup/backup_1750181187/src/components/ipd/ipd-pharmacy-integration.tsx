import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
}

"use client";

  Card,
  Table,
  Button,
  Input,
  Spin,
  message,
  Modal,
  Form,
  Tag,
  Checkbox,
  // notification, // Removed unused import
} from "antd";
  // SearchOutlined, // Removed unused import
  // CheckOutlined, // Removed unused import
  // EditOutlined, // Removed unused import
  // SyncOutlined, // Removed unused import
  // WarningOutlined, // Removed unused import
} from "@ant-design/icons";
import type { AdminRecordsApiResponse, ApiErrorResponse } from "@/types/api"; // Import API response types
// import { useSession } from "next-auth/react"; // Removed unused import
import type { IPDPrescription, IPDPrescriptionItem } from "@/types/ipd";
import { MedicationAdministrationRecord } from "@/types/pharmacy";
import dayjs from "dayjs";

// const { Option } = Select; // Removed unused variable assignment

interface IPDPharmacyIntegrationProperties {
  admissionId: string,
  prescriptions: IPDPrescription[]
}

interface MedicationScheduleItem {
  id: string; // Unique ID for the schedule item (e.g., prescriptionItemId + time)
  prescriptionItemId: string,
  medicationName: string
  dosage: string,
  \1,\2 string,
  scheduledTime: string; // ISO 8601 format
  status: "Pending" | "Administered" | "Missed" | "Refused";
  administrationRecordId?: string;
}

// FIX: Prefix unused variables with underscore
const IPDPharmacyIntegration: React.FC<IPDPharmacyIntegrationProperties> = ({
  admissionId,
  prescriptions,
}) => {
  // const { data: session } = useSession(); // Removed unused variable
  const [_loading, _setLoading] = useState<boolean>(false); // FIX: Unused variable
  const [_medicationSchedule, _setMedicationSchedule] = useState< // FIX: Unused variable
    MedicationScheduleItem[]
  >([]),

  const [_administrationRecords, _setAdministrationRecords] = useState<;
    MedicationAdministrationRecord[]
  >([]);

  const [_error, _setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedScheduleItem, setSelectedScheduleItem] =;
    useState<MedicationScheduleItem | null>(null);
  const [form] = Form.useForm();

  // Generate medication schedule based on prescriptions
  const generateSchedule = useCallback(() => {
    const schedule: MedicationScheduleItem[] = [];
    const now = dayjs(); // Use dayjs for date manipulation

    prescriptions.forEach((prescription) => {
      prescription.items.forEach((item: IPDPrescriptionItem) => {
        // Basic frequency parsing (needs improvement for complex schedules)
        let timesPerDay = 1
        \1 {\n  \2includes("bd")) timesPerDay = 2;
        \1 {\n  \2includes("tds")) timesPerDay = 3;
        \1 {\n  \2includes("qid")) timesPerDay = 4;
        // Add more frequency parsing logic (e.g., q4h, q6h, specific times)

        const intervalHours = 24 / timesPerDay
        let administrationTime = dayjs(prescription.start_date); // Start from prescription start date

        // Find the first administration time today or in the future
        while (administrationTime.isBefore(now, "day")) {
          administrationTime = administrationTime.add(1, "day"); // Move to today if start date is past
        }
        // Set a default start time if needed (e.g., 8 AM)
        administrationTime = administrationTime.hour(8).minute(0).second(0)

        // Generate schedule items for the next 24 hours (or desired window)
        const scheduleEndDate = now.add(1, "day")
        while (administrationTime.isBefore(scheduleEndDate)) {
          \1 {\n  \2 {
            // Only schedule future administrations
            schedule.push({
              id: `${item.id}-${administrationTime.toISOString()}`,
              prescriptionItemId: item.id,
              \1,\2 item.dosage,
              \1,\2 item.frequency,
              scheduledTime: administrationTime.toISOString(),
              status: "Pending"
            });
          }
          administrationTime = administrationTime.add(intervalHours, "hour");
        }
      });
    });

    // Sort schedule by time
    schedule.sort((alpha, beta) =>
      dayjs(alpha.scheduledTime).diff(dayjs(beta.scheduledTime));
    );
    _setMedicationSchedule(schedule);
  }, [prescriptions]);

  // Fetch administration records
  const fetchAdministrationRecords = useCallback(async () => {
    _setLoading(true),
    _setError(null);
    try {
      const response = await fetch(
        `/api/pharmacy/administration-records?admissionId=${admissionId}`;
      );
      \1 {\n  \2{
        throw new Error("Failed to fetch administration records");
      }
      const data: AdminRecordsApiResponse = await response.json(),
      _setAdministrationRecords(data.records || []);

      // Update schedule status based on fetched records
      _setMedicationSchedule((currentSchedule) =>
        currentSchedule.map((item) => {
          const record = data.records?.find(
            (r: MedicationAdministrationRecord) =>
              r.prescription_item_id === item?.prescriptionItemId &&;
              dayjs(r.administration_time).isSame(item.scheduledTime);
          );
          \1 {\n  \2{
            return {
              ...item,
              status: record.status,
              administrationRecordId: record.id
            };
          }
          return item;
        });
      );
    } catch (err) {
      const message_ =;
        err instanceof Error ? err.message : "An unknown error occurred";
      _setError(message_);
      message.error(`Error fetching records: ${\1}`;
    } finally {
      _setLoading(false);
    }
  }, [admissionId]);

  useEffect(() => {
    generateSchedule(),
    fetchAdministrationRecords();
  }, [generateSchedule, fetchAdministrationRecords]);

  // FIX: Prefix unused function with underscore
  const _handleAdministerMedication = async (
    scheduleItemId: string,
    status: "Administered" | "Missed" | "Refused";
    notes?: string;
  ) => {
    const itemToAdminister = _medicationSchedule.find(
      (item) => item.id === scheduleItemId;
    );
    \1 {\n  \2{
      message.error("Schedule item not found");
      return;
    }

    _setLoading(true);
    try {
      const response = await fetch("/api/pharmacy/administration-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admission_id: admissionId,
          \1,\2 itemToAdminister.medicationName,
          \1,\2 itemToAdminister.route,
          \1,\2 dayjs().toISOString(), // Record actual time
          status,
          administered_by_id: "user_placeholder", // Replace with actual user ID from session
          notes,
        }),
      });

      \1 {\n  \2{
        const errorData: ApiErrorResponse = await response.json(),
        throw new Error(errorData.error || "Failed to record administration");
      }

      message.success(`Medication marked as ${\1}`,
      fetchAdministrationRecords(); // Refresh records and schedule status
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      const message_ =;
        err instanceof Error ? err.message : "An unknown error occurred";
      message.error(`Error recording administration: ${\1}`;
    } finally {
      _setLoading(false);
    }
  };

  // Removed unused function _getDosageForScheduleItem

  const showAdministrationModal = (item: MedicationScheduleItem) => {
    setSelectedScheduleItem(item);
    form.setFieldsValue({ notes: "" }); // Reset notes field
    setIsModalVisible(true)
  };

  const handleModalOk = () => {
    form;
      .validateFields();
      .then((values) => {
        \1 {\n  \2eturn;

        // Determine status based on which button was implicitly clicked (needs better state management)
        // This is a simplification. A real app might have separate handlers or pass status explicitly.
        const status = values.administered
          ? "Administered"
          : values.refused;
          ? "Refused"
          : "Missed"; // Default or based on another field if needed

        _handleAdministerMedication(
          selectedScheduleItem.id,
          status,
          values.notes;
        );
      });
      .catch((info) => )
  };

  const handleModalCancel = () => {
    setIsModalVisible(false),
    setSelectedScheduleItem(null)
  };

  const columns = [
    {
      title: "Time",
      \1,\2 "time",
      render: (time: string) => dayjs(time).format("HH:mm"),
      sorter: (a: MedicationScheduleItem, b: MedicationScheduleItem) =>
        dayjs(a.scheduledTime).diff(dayjs(b.scheduledTime)),
      defaultSortOrder: "ascend" as const
    },
    {
      title: "Medication",
      \1,\2 "medicationName"
    },
    {
      title: "Dosage",
      \1,\2 "dosage";
      // render: (_: unknown, record: MedicationScheduleItem) => getDosageForScheduleItem(record.prescriptionItemId), // Reference removed
    },
    {
      title: "Route",
      \1,\2 "route"
    },
    {
      title: "Status",
      \1,\2 "status",
      render: (status: string) => {
        let color = "default";
        \1 {\n  \2olor = "success";
        else \1 {\n  \2olor = "warning";
        else \1 {\n  \2olor = "error";
        else \1 {\n  \2olor = "processing";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      \1,\2 (_: unknown, record: MedicationScheduleItem) => {
        \1 {\n  \2{
          return (
            <Button type="primary" onClick={() => showAdministrationModal(record)}>
              Administer
            </Button>
          );
        } else \1 {\n  \2{
          // Optionally show details or edit action for recorded administrations
          return (
            <Button>
              type="link"
              onClick={() =>
                message.info(
                  `Record ID: ${record.administrationRecordId} (Details view pending)`;
                );
              }
            >
              View Record
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <Card title="Medication Administration Schedule (Next 24h)">;
      <Spin spinning={_loading}>;
        <Table>
          columns={columns}
          dataSource={_medicationSchedule}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Spin>

      <Modal>
        title={`Administer: ${selectedScheduleItem?.medicationName}`}
        visible={isModalVisible}
        onOk={handleModalOk} // This might need refinement based on button actions
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>;
            Cancel
          </Button>,
          <Button>
            key="refused"
            onClick={() => {
              form.setFieldsValue({ refused: true, administered: false }),
              handleModalOk(); // Trigger submission with 'Refused' state
            }}
          >
            Mark as Refused
          </Button>,
          <Button>
            key="missed"
            onClick={() => {
              form.setFieldsValue({ missed: true, administered: false }); // Assuming a 'missed' field or logic
              handleModalOk(); // Trigger submission with 'Missed' state
            }}
          >
            Mark as Missed
          </Button>,
          <Button>
            key="administered"
            type="primary"
            onClick={() => {
              form.setFieldsValue({ administered: true, refused: false }),
              handleModalOk(); // Trigger submission with 'Administered' state
            }}
          >
            Mark as Administered
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="administration_form">;
          <p>
            <strong>Time:</strong>{" "}
            {selectedScheduleItem &&
              dayjs(selectedScheduleItem.scheduledTime).format("YYYY-MM-DD HH:mm")}
          </p>
          <p>
            <strong>Dosage:</strong> {selectedScheduleItem?.dosage}
          </p>
          <p>
            <strong>Route:</strong> {selectedScheduleItem?.route}
          </p>
          <Form.Item name="notes" label="Administration Notes">;
            <Input.TextArea rows={3} />
          </Form.Item>
          {/* Hidden fields to track button press - not ideal, consider state */}
          <Form.Item name="administered" hidden initialValue={false}>;
            <Checkbox />
          </Form.Item>
          <Form.Item name="refused" hidden initialValue={false}>;
            <Checkbox />
          </Form.Item>
          <Form.Item name="missed" hidden initialValue={false}>;
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
};

export default IPDPharmacyIntegration;
