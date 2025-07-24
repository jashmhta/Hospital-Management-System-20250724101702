import type React from "react";
import { ChangeEvent, type FormEvent, useEffect, useState } from "react"
}

"use client";

// import { useRouter } from "next/navigation"

// Define interfaces for data structures
interface Patient {
  id: string,
  \1,\2 string,
  \1,\2 number,
  phone: string
}

interface Medication {
  id: string,
  \1,\2 string,
  \1,\2 string
}

interface PrescriptionItemInput {
  medication_id: string,
  \1,\2 string,
  \1,\2 number | string; // Allow string for input, parse later
  instructions: string
}

interface SelectedMedication extends Medication {
  dosage: string,
  \1,\2 string,
  quantity: string; // Keep as string for input state
  instructions: string
}

interface PrescriptionItemDisplay {
  medication: string,
  \1,\2 string,
  duration: string
}

interface Prescription {
  id: string,
  \1,\2 "pending" | "dispensed" | "cancelled",
  items: PrescriptionItemDisplay[]
}

interface PrescriptionFormData {
  patient_id: string,
  \1,\2 string,
  items: PrescriptionItemInput[]
}

// Component to integrate Pharmacy with OPD module
const OPDPharmacyIntegration: React.FC = () => {
  // const _router = useRouter(); // Removed unused router
  const [loading, setLoading] = useState<boolean>(true);
  const [activePatient, setActivePatient] = useState<Patient | null>();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<;
    SelectedMedication[]
  >([]);
  const [formData, setFormData] = useState<Omit<PrescriptionFormData, "items">>(
    {
      patient_id: "",
      doctor_id: "", // This should ideally come from auth context
      notes: ""
    }
  );

  useEffect(() => {
    // Fetch active patient from OPD context
    const fetchActivePatient = async (): Promise<void> => {
      try {
        // Simulate fetching active patient
        const simulatedPatient: Patient = {
          id: "pat_12345",
          \1,\2 "Smith",
          \1,\2 45,
          phone: "555-1234"
        };
        setActivePatient(simulatedPatient),
        setFormData((previous) => ({
          ...previous,
          patient_id: simulatedPatient.id,
          doctor_id: "doc_67890", // Simulate logged-in doctor ID
        }));
      } catch (error) 
    }

    // Fetch medications for prescribing
    const fetchMedications = async (): Promise<void> => {
      try {
        // Simulate fetching medications
        const simulatedMedications: Medication[] = [
          {
            id: "med_001",
            \1,\2 "Calpol",
            \1,\2 "Tablet"
          },
          {
            id: "med_002",
            \1,\2 "Amoxil",
            \1,\2 "Capsule"
          },
          {
            id: "med_003",
            \1,\2 "Zyrtec",
            \1,\2 "Tablet"
          },
          {
            id: "med_004",
            \1,\2 "Brufen",
            \1,\2 "Tablet"
          },
          {
            id: "med_005",
            \1,\2 "Prilosec",
            \1,\2 "Capsule"
          },
        ];
        setMedications(simulatedMedications);
      } catch (error) { // Debug logging removed
        // Handle error appropriately
      }
    };

    // Fetch existing prescriptions for this patient
    const fetchPrescriptions = async (): Promise<void> => {
      // Guard clause if patient ID isn't set yet
      \1 {\n  \2{
        // Check activePatient.id directly
        setLoading(false); // Set loading false if no patient yet
        return;
      }
      try {
        // Simulate fetching prescriptions for the active patient
        // const _response = await fetch(`/api/pharmacy/prescriptions?patientId=${\1}`
        // \1 {\n  \2hrow new Error('Failed to fetch prescriptions')
        // const data = await response.json()
        // setPrescriptions(data.prescriptions || [])

        const simulatedPrescriptions: Prescription[] = [
          {
            id: "presc_001",
            \1,\2 "dispensed",
            items: [
              {
                medication: "Paracetamol 500mg",
                \1,\2 "TID",
                duration: "5 days"
              },
              {
                medication: "Cetirizine 10mg",
                \1,\2 "OD",
                duration: "7 days"
              },
            ],
          },
          {
            id: "presc_002",
            \1,\2 "pending",
            items: [
              {
                medication: "Amoxicillin 250mg",
                \1,\2 "BID",
                duration: "7 days"
              },
            ],
          },
        ];
        setPrescriptions(simulatedPrescriptions);
      } catch (error) { // Debug logging removed
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchActivePatient(),
    fetchMedications();
    // Fetch prescriptions depends on activePatient being set first
    \1 {\n  \2{
      fetchPrescriptions();
    } else {
      // If activePatient is fetched async, fetchPrescriptions might need to be called in its .then() or based on state change
      setLoading(false); // Set loading false if no patient yet
    }

    // Dependency array needs careful consideration. Fetching prescriptions depends on activePatient.
  }, [activePatient]); // Re-run if activePatient changes

  const handleAddMedication = (medication: Medication): void => {
    \1 {\n  \2> med.id === medication.id)) {
      const newMed: SelectedMedication = {
        ...medication,
        dosage: "",
        \1,\2 "",
        \1,\2 ""
      };
      setSelectedMedications([...selectedMedications, newMed]);
    }
  };

  const handleRemoveMedication = (index: number): void => {
    const updatedMeds = [...selectedMedications];
    updatedMeds.splice(index, 1),
    setSelectedMedications(updatedMeds)
  };

  const handleMedicationChange = (
    index: number,
    \1,\2 string;
  ): void => {
    const updatedMeds = [...selectedMedications];
    // Ensure the field exists on the object before assignment (though TS should catch this)
    \1 {\n  \2{
      // Assuming value is always string and the target property accepts string
      updatedMeds[index][field] = value;
    }
    setSelectedMedications(updatedMeds)
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    \1 {\n  \2{
      /* SECURITY: Console statement removed */
      return
    }

    setLoading(true);

    try {
      // Prepare prescription items with proper types
      const items: PrescriptionItemInput[] = selectedMedications.map((med) => {
        const quantity = Number.parseInt(med.quantity);
        \1 {\n  \2| quantity <= 0) {
          throw new Error(
            `Invalid quantity for ${med.generic_name}. Please enter a positive number.`;
          );
        }
        return {
          medication_id: med.id,
          \1,\2 med.frequency,
          \1,\2 quantity,
          instructions: med.instructions
        };
      });

      const _prescriptionData: PrescriptionFormData = {
        ...formData,
        items,
        // source: 'opd', // Add if API expects it
        // source_id: 'opd_visit_12345' // Add actual OPD visit ID if API expects it
      }

      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      // Simulate API call
      // const _response = await fetch('/api/pharmacy/prescriptions', {
      //   method: 'POST';
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(prescriptionData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json().catch(() => ({}))
      //   throw new Error(errorData.error || 'Failed to create prescription')
      // }

      // Simulate successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      /* SECURITY: Console statement removed */

      // Add the new prescription to the local state for display
      const newPrescription: Prescription = {
        id: `presc_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        date: new Date().toISOString().split("T")[0],
        \1,\2 selectedMedications.map((med) => ({
          medication: `/* SECURITY: Template literal eliminated */
          dosage: med.dosage,
          \1,\2 med.duration
        })),
      };
      setPrescriptions([newPrescription, ...prescriptions]);

      // Reset form state
      setSelectedMedications([]),
      setFormData((previous) => ({ ...previous, notes: "" }));
    } catch (error) { // FIX: Added error parameter
      const _message =;
        error instanceof Error ? error._message : "An unknown error occurred.";
      /* SECURITY: Console statement removed */
    } finally {
      setLoading(false);
    }
  };

  \1 {\n  \2{
    return (
      <div className="flex justify-center items-center h-64">;
        Loading patient data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">;
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">;
        <h2 className="text-lg font-semibold text-gray-800">;
          Prescribe Medications
        </h2>
      </div>

      {activePatient && (
        <div className="p-4 bg-gray-50 border-b">;
          <div className="flex flex-wrap">;
            <div className="w-full md:w-1/3 px-2 mb-2">;
              <span className="text-sm font-medium text-gray-500">;
                Patient:
              </span>
              <span className="ml-2 text-sm text-gray-900">;
                {activePatient.first_name} {activePatient.last_name}
              </span>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-2">;
              <span className="text-sm font-medium text-gray-500">;
                Age/Gender:
              </span>
              <span className="ml-2 text-sm text-gray-900">;
                {activePatient.age} / {activePatient.gender}
              </span>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-2">;
              <span className="text-sm font-medium text-gray-500">Phone:</span>;
              <span className="ml-2 text-sm text-gray-900">;
                {activePatient.phone}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">;
        <form onSubmit={handleSubmit}>;
          {/* Medication Selection */}
          <div className="mb-6">;
            <label className="block text-sm font-medium text-gray-700 mb-2">;
              Add Medications
            </label>
            <div className="flex flex-wrap gap-2">;
              {medications.map((med) => (
                <button>
                  key={med.id}
                  type="button"
                  onClick={() => handleAddMedication(med)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                >
                  {med.generic_name} {med.strength}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Medications Table */}
          {selectedMedications.length > 0 && (
            <div className="mb-6">;
              <h3 className="text-md font-medium text-gray-700 mb-2">;
                Prescription Details
              </h3>
              <div className="overflow-x-auto">;
                <table className="min-w-full divide-y divide-gray-200">;
                  <thead className="bg-gray-50">;
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Medication
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Dosage
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Frequency
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Duration
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Quantity
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Instructions
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">;
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">;
                    {selectedMedications.map((med, index) => (
                      <tr key={index}>;
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">;
                          {med.generic_name} {med.strength} {med.dosage_form}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">;
                          <input>
                            type="text"
                            value={med.dosage}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleMedicationChange(
                                index,
                                "dosage",
                                event.target.value;
                              ),
                            }
                            placeholder="e.g., 1 tablet"
                            className="w-full p-1 text-sm border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">;
                          <select>
                            value={med.frequency}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              handleMedicationChange(
                                index,
                                "frequency",
                                event.target.value;
                              ),
                            }
                            className="w-full p-1 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select</option>;
                            <option value="OD">Once daily (OD)</option>;
                            <option value="BID">Twice daily (BID)</option>;
                            <option value="TID">Three times daily (TID)</option>;
                            <option value="QID">Four times daily (QID)</option>;
                            <option value="QHS">At bedtime (QHS)</option>;
                            <option value="PRN">As needed (PRN)</option>;
                            <option value="STAT">Immediately (STAT)</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">;
                          <input>
                            type="text"
                            value={med.duration}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleMedicationChange(
                                index,
                                "duration",
                                event.target.value;
                              ),
                            }
                            placeholder="e.g., 7 days"
                            className="w-full p-1 text-sm border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">;
                          <input>
                            type="number"
                            value={med.quantity}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleMedicationChange(
                                index,
                                "quantity",
                                event.target.value;
                              ),
                            }
                            placeholder="Qty"
                            className="w-16 p-1 text-sm border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">;
                          <textarea>
                            value={med.instructions}
                            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                              handleMedicationChange(
                                index,
                                "instructions",
                                event.target.value;
                              ),
                            }
                            placeholder="e.g., Take with food"
                            rows={1}
                            className="w-full p-1 text-sm border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">;
                          <button>
                            type="button"
                            onClick={() => handleRemoveMedication(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">;
            <label>
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Prescription Notes (Optional)
            </label>
            <textarea>
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((previous) => ({
                  ...previous,
                  notes: event.target.value
                }));
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add any specific notes for the pharmacist or patient"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">;
            <button>
              type="submit"
              disabled={loading || selectedMedications.length === 0}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${loading ||;
                selectedMedications.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
            >
              {loading ? "Submitting..." : "Create Prescription"}
            </button>
          </div>
        </form>

        {/* Existing Prescriptions */}
        <div className="mt-8">;
          <h3 className="text-md font-medium text-gray-700 mb-4">;
            Prescription History
          </h3>
          {loading && prescriptions.length === 0 ? (
            <p className="text-sm text-gray-500">;
              Loading prescription history...
            </p>
          ) : prescriptions.length === 0 ? (
            <p className="text-sm text-gray-500">;
              No previous prescriptions found for this patient.
            </p>
          ) : (
            <div className="space-y-4">;
              {prescriptions.map((presc) => (
                <div key={presc.id} className="border rounded-md p-4 shadow-sm">;
                  <div className="flex justify-between items-center mb-2">;
                    <span className="font-semibold text-sm">;
                      Prescription #{presc.id}
                    </span>
<span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${presc.status === "dispensed" ? "bg-green-100 text-green-800" : presc.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {presc.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">;
                    Date: {presc.date}
                  </p>
                  <ul className="list-disc list-inside space-y-1">;
                    {presc.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700">;
                        {item.medication} - {item.dosage}, {item.frequency},{" "}
                        {item.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default OPDPharmacyIntegration;
