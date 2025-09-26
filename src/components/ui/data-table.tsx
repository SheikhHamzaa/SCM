"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  stickyColumnIds?: string[]; // IDs of columns that should be sticky
  stickyColumnWidths?: { [columnId: string]: number }; // Widths for sticky columns
}

export function DataTable<TData, TValue>({
  columns,
  data,
  stickyColumnIds = [],
  stickyColumnWidths = {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getColumnStyles = (columnId: string) => {
    if (stickyColumnIds.includes(columnId)) {
      const index = stickyColumnIds.indexOf(columnId);

      let rightOffset = 0;

      // Calculate the right offset for each sticky column
      for (let i = stickyColumnIds.length - 1; i > index; i--) {
        const colId = stickyColumnIds[i];
        rightOffset += stickyColumnWidths[colId] || 120;
      }

      const columnWidth = stickyColumnWidths[columnId] || 120;

      return {
        position: "sticky" as const,
        right: `${rightOffset}px`,
        backgroundColor: "white",
        zIndex: 10,
        borderLeft: index === 0 ? "2px solid #E1E5E9" : "none",
        boxShadow: index === 0 ? "-2px 0 4px rgba(0,0,0,0.05)" : "none",
        width: `${columnWidth}px`,
        minWidth: `${columnWidth}px`,
        maxWidth: `${columnWidth}px`,
      };
    }
    return {};
  };

  const hasStickyCols = stickyColumnIds.length > 0;

  return (
    <div className="w-full">
      <div className="rounded-lg border border-[#E3E5E8] overflow-hidden">
        {hasStickyCols ? (
          // Sticky columns table with custom HTML table
          <div
            className={`overflow-x-auto max-w-full sidebar-scroll sidebar-scroll`}
          >
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-[#F6F7F9] border-b border-[#E3E5E8]"
                  >
                    {headerGroup.headers.map((header) => {
                      const isSticky = stickyColumnIds.includes(header.id);
                      return (
                        <th
                          key={header.id}
                          style={getColumnStyles(header.id)}
                          className={`text-left py-0.5 px-4 text-xs font-bold text-[#393A3D] ${
                            isSticky ? "bg-[#F6F7F9]" : "min-w-[120px]"
                          }`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-[#F6F7F9] hover:bg-[#FAFBFC] cursor-pointer data-[state=selected]:bg-[#EBF4FA]"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isSticky = stickyColumnIds.includes(
                          cell.column.id
                        );
                        return (
                          <td
                            key={cell.id}
                            style={getColumnStyles(cell.column.id)}
                            className={`py-1 px-4 ${
                              isSticky ? "bg-white" : "min-w-[120px]"
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-8 px-4 text-center text-xs text-[#6B7C93]"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Regular table using Table components
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-[#F6F7F9] border-b border-[#E3E5E8] hover:bg-[#F6F7F9]"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-left py-2 px-4 text-xs font-semibold text-[#393A3D]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-[#F6F7F9] hover:bg-[#FAFBFC] cursor-pointer data-[state=selected]:bg-[#EBF4FA]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-8 px-4 text-center text-xs text-[#6B7C93]"
                  >
                    No products found matching the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
