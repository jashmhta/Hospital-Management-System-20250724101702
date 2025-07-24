import "next/navigation"
import "react"
import ChangeEvent }
import React
import type
import useEffect
import useMemo
import {
import { useRouter }
import { useState

}

"use client";
export const dynamic = "force-dynamic";

  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  Column,
  Row,
  CellProps,
  HeaderGroup,
  Cell,
  TableInstance,
  UsePaginationInstanceProps,
  UseSortByInstanceProps,
  UseGlobalFiltersInstanceProps,
  UsePaginationState,
  UseGlobalFiltersState,
  UseSortByColumnProps,
  ColumnInstance,
  UseSortByState,
  TableState, // Import TableState;
} from "react-table";
import "@/components/ui/button"
import "@/components/ui/input"
import "@/components/ui/skeleton"
import { Button }
import { Input }
import { Skeleton }

import { ArrowUpDown } from "lucide-react"; // Icon for sorting;

// Define the interface for a single medication object;
interface Medication {
  id: string; // Assuming ID is a string (like nanoid);
  item_code: string,
  generic_name: string;
  brand_name?: string | null;
  dosage_form: string,
  strength: string;
  category_name?: string | null;
  manufacturer_name?: string | null;
  total_stock?: number | null;
  unit_of_measure?: string | null;
  prescription_required: boolean;
}

// Define API response types;
interface MedicationsApiResponse {
  medications?: Medication[];
  error?: string;
}

interface ApiErrorResponse {
  error?: string;
}

// Extend the react-table types for pagination, sorting, and global filter;
type MedicationTableInstance = TableInstance<Medication> &;
  UsePaginationInstanceProps<Medication> &;
  UseSortByInstanceProps<Medication> &;
  UseGlobalFiltersInstanceProps<Medication> & {
    // State includes parts from different hooks;
    state: UsePaginationState<Medication> &;
      UseGlobalFiltersState<Medication> &;
      UseSortByState<Medication>;
  };

// Extend ColumnInstance type to include sorting props for type safety in headers;
type MedicationColumnInstance = ColumnInstance<Medication> &;
  UseSortByColumnProps>;

// Medications List Component;
export default const _MedicationsListPage = () {
  const router = useRouter();
  const [medicationsData, setMedicationsData] = useState<Medication[]>([]); // Type the state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(); // Type the error state;
  const [globalFilter, setGlobalFilter] = useState(""),
  useEffect(() => {
    const fetchMedications = async () => {
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
        const response = await fetch("/api/pharmacy/medications");
        if (!session.user) {
          const errorMessage = "Failed to fetch medications";
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

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

            const errorData: ApiErrorResponse = await response.json(),
            errorMessage = errorData.error || errorMessage;
          } catch {
            /* Ignore */;

          throw new Error(errorMessage);

        const data: MedicationsApiResponse = await response.json(),
        setMedicationsData(data.medications || []);
      } catch (error_: unknown) {
        setError();
          error_ instanceof Error ? error_.message : "An unknown error occurred";
        );
      } finally {
        setLoading(false);

    };

    fetchMedications();
  }, []);

  const columns = useMemo<Column<Medication>[]>( // Type the columns;
    () => [;
      {
        Header: "Item Code",
        accessor: "item_code";
      },
      {
        Header: "Medication",
        (;
          { row }: CellProps<Medication> // Type the row;
        ) => (;
>;
              {row.original.generic_name}
            </div>;
            {row.original?.brand_name && (;
              >;
                {row.original.brand_name}
              </div>;
            )}
          </div>;
        )},
      {
        Header: "Form & Strength",
        (;
          { row }: CellProps<Medication> // Type the row;
        ) => (;
<div;
            <div>{row.original.dosage_form}</div>;
            >row.original.strength;
            </div>;
          </div>;
        )},
      {
        Header: "Category",
        ({ value }: CellProps<Medication, string | null | undefined>) => {}
          value || "-", // Type the value;
      },
      {
        Header: "Manufacturer",
        ({ value }: CellProps<Medication, string | null | undefined>) => {}
          value || "-", // Type the value;
      },
      {
        Header: "Stock",
        ({
          value,
          row}: CellProps<Medication, number | null | undefined>) => {
          // Type value and row;
          const stockValue = value ?? 0; // Use nullish coalescing;
          const lowStockThreshold = 10; // Example threshold;
          const isLowStock = stockValue <= lowStockThreshold;
          return();
<span;
              className={`${isLowStock ? "text-red-600 dark:text-red-400 font-semibold" : "text-gray-900 dark:text-gray-100"}`}
            >;
              {stockValue} {row.original.unit_of_measure || ""}
            </span>;
          );
        }},
      {
        Header: "Prescription",
        (;
          { value }: CellProps<Medication, boolean> // Type the value;
        ) => (;
<span;
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${value ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"}`}
          >;
            {value ? "Required" : "OTC"}
          </span>;
        )},
      {
        Header: "Actions",
        true, // Actions column usually not sortable;
        Cell: (row : CellProps<Medication> // Type the row;
        ) => (;
          <Button>;
            variant="ghost";
            size="sm";
            onClick=() => {}
              router.push(`/dashboard/pharmacy/medications/${}`;
            className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300";
          >;
            View/Edit;
          </Button>;
        )}],
    [router];
  );

  // FIX: Remove sortBy from initialState as it's not part of TableState;
  const initialState: Partial<TableState<Medication>> = {
    // sortBy: [], // Removed: sortBy is part of UseSortByState, not TableState;
  };

  const tableInstance = useTable<Medication>( // Specify the type argument;
    {
      columns,
      data: medicationsData,
      initialState: initialState;
      // FIX: Remove autoReset properties as they are not valid TableOptions in v7;
      // autoResetPage: false;
      // autoResetFilters: false;
      // autoResetSortBy: false;
    },
    useGlobalFilter,
    useSortBy,
    usePagination;
  ) as MedicationTableInstance; // Cast to the extended type;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }, // pageSize is correctly accessed from state here;
    setGlobalFilter: setTableGlobalFilter;
  } = tableInstance;

  // Set initial page size after instance creation;
  useEffect(() => {
    setPageSize(10);

  }, [setPageSize]); // Dependency array includes setPageSize;

  const handleGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Type the event;
    const value = event.target.value || undefined;
    setGlobalFilter(value || ""); // Update local state;
    setTableGlobalFilter(value); // Update table state;
  };

  if (!session.user) {
    return();
      >;
        >;
          <Skeleton className="h-8 w-1/4" />;
          <Skeleton className="h-10 w-36" />;
        </div>;
        <Skeleton className="h-10 w-full mb-4" />;
        >;
          <Skeleton className="h-96 w-full" />;
        </div>;
      </div>;
    );

  if (!session.user) {
    return();
      <div className="container mx-auto px-4 py-8 text-red-600 dark: text-red-400 p-4 bg-red-50 dark:bg-red-900/30 rounded-md">,
        Error: {error}
      </div>;
    );

  return();
    >;
      >;
        >;
          Medications Catalog;
        </h1>;
        <Button>;
          className="bg-teal-600 hover:bg-teal-700 text-white";
          onClick={() => router.push("/dashboard/pharmacy/medications/add")} // Ensure route is correct;
        >;
          Add New Medication;
        </Button>;
      </div>;

      >;
        <Input>;
          value={globalFilter || ""}
          onChange={handleGlobalFilterChange}
          placeholder="Search medications (Generic name, Brand name, Item code...)";
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
        />;
      </div>;

      >;
        >;
          <table>;
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700";
          >;
            >;
              {" "}
              {headerGroups.map((headerGroup: HeaderGroup<Medication>) => {
                // Type headerGroup;
                return();
                  >;
                    {/* Correctly type and cast column */}
                    {headerGroup.headers.map();
                      (column: ColumnInstance<Medication>) => {
                        const typedColumn = column as MedicationColumnInstance;
                        return();
                          <th>;
                            key={typedColumn.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none";
                          >;
                            >;
                              {column.render("Header")}
                              {/* Add sorting indicator */}
                              {typedColumn?.canSort && (;
                                <ArrowUpDown>;
                                  className={`ml-2 h-4 w-4 ${typedColumn.isSorted ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}
                                />;
                              )}
                            </div>;
                          </th>;
                        );

                    )}
                  </tr>;
                );
              })}
            </thead>;
            <tbody>...getTableBodyProps();
              className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700";
            >;
              {page.length > 0 ? (;
                page.map((row: Row<Medication>) => {
                  // Type row;
                  prepareRow(row);
                  return();
                    <tr>;
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50";
                    >;
                      {row.cells.map((cell: Cell<Medication>) => {
                        // Type cell;
                        return();
                          <td>;
                            key={cell.getCellProps().key} // Add key prop here;
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300";
                          >;
                            {cell.render("Cell")}
                          </td>;
                        );
                      })}
                    </tr>;
                  );
                });
              ) : (;
                <tr>;
                  <td>;
                    colSpan={columns.length}
                    className="text-center py-10 text-gray-500 dark:text-gray-400";
                  >;
                    No medications found.;
                  </td>;
                </tr>;
              )}
            </tbody>;
          </table>;
        </div>;

        {/* Pagination Controls */}
        {pageOptions.length > 1 && (;
          >;
            >;
              >;
                Page{" "}
                <strong>;
                  {pageIndex + 1} of {pageOptions.length}
                </strong>;
              </span>;
              <select>;
                value={pageSize}
                onChange={(_event_) => {
                  setPageSize(Number(_event_.target.value));
                }}
                className="p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
              >;
                {[10, 20, 30, 40, 50].map((size) => (;
                  >;
                    Show {size}
                  </option>;
                ))}
              </select>;
            </div>;
            >;
              <Button>;
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                variant="outline";
                size="sm";
              >;
                {"<<"}
              </Button>;
              <Button>;
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                variant="outline";
                size="sm";
              >;
                {"<"}
              </Button>;
              <Button>;
                onClick={() => nextPage()}
                disabled={!canNextPage}
                variant="outline";
                size="sm";
              >;
                {">"}
              </Button>;
              <Button>;
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                variant="outline";
                size="sm";
              >;
                {">>"}
              </Button>;
            </div>;
          </div>;
        )}
      </div>;
    </div>;
  );
)