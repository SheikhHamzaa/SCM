"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Truck,
  Package,
  Ship,
  CheckCircle,
  AlertCircle,
  Search,
  ImageIcon,
  CalendarDays,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Form validation schema
const formSchema = z.object({
  shippingLineId: z.string().min(1, "Shipping line is required"),
  consigneeId: z.string().min(1, "Consignee is required"),
  containerType: z.string().min(1, "Container type is required"),
  billOfLading: z.string().min(1, "Bill of lading is required"),
  containerNo: z.string().min(1, "Container number is required"),
  invoiceNo: z.string().min(1, "Invoice number is required"),
  eta: z.date().refine((value) => value !== undefined, {
    message: "ETA is required",
  }),
  shipmentStatus: z.string().min(1, "Shipment status is required"),
});

// Types
interface PurchaseOrderItem {
  id: string;
  itemName: string;
  designNo: string;
  image: string;
  baleQty: number;
  pcsPerBale: number;
  totalQtyPcs: number;
  totalYards: number;
  ratePerYard: number;
  value: number;
}

interface PurchaseOrder {
  id: string;
  destination: string;
  orderDate: string;
  orderReference: string;
  supplier: string;
  portOfDischarge: string;
  status:
    | "Pending"
    | "In Transit"
    | "Port"
    | "Border"
    | "Off load"
    | "Delivered";
  items: PurchaseOrderItem[];
  // Computed totals
  totalValue: number;
  totalQuantityPcs: number;
}

interface ShippingLine {
  id: string;
  code: string;
  title: string;
}

interface Consignee {
  id: string;
  code: string;
  title: string;
}

interface InTransitFormData {
  purchaseOrderId: string;
  shippingLineId: string;
  consigneeId: string;
  containerType: string;
  billOfLading: string;
  invoiceNo: string;
}

const InTransit = () => {
  // State management
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([]);
  const [consignees, setConsignees] = useState<Consignee[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingLineId: "",
      consigneeId: "",
      containerNo: "",
      billOfLading: "",
      invoiceNo: "",
      eta: undefined,
      shipmentStatus: "",
    },
  });

  // Column definitions for data table
  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => {
        const po = row.original;
        const isDisabled = po.status !== "Pending";
        return (
          <div className="flex justify-center">
            <input
              type="radio"
              name="selectedPO"
              className="w-3.5 h-3.5 border-[#E1E5E9] text-[#0176D3] focus:ring-[#0176D3] focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
              disabled={isDisabled}
              checked={selectedPO?.id === po.id}
              onChange={() => {
                if (po.status === "Pending") {
                  setSelectedPO(po);
                }
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: ({ row }) => {
        const po = row.original;
        return (
          <div
            className="text-xs font-medium text-[#2E2E2E] cursor-pointer hover:text-[#0176D3]"
            onClick={() => {
              if (po.status === "Pending") {
                setSelectedPO(po);
              }
            }}
          >
            {row.getValue("destination")}
          </div>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: "Date",
      cell: ({ row }) => {
        const po = row.original;
        return (
          <div
            className="text-xs text-[#2E2E2E] cursor-pointer hover:text-[#0176D3] transition-colors"
            onClick={() => {
              if (po.status === "Pending") {
                setSelectedPO(po);
              }
            }}
          >
            {new Date(row.getValue("orderDate")).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "orderReference",
      header: "PO #",
      cell: ({ row }) => {
        const po = row.original;
        return (
          <div
            className="text-xs font-medium text-[#0176D3] cursor-pointer hover:text-[#014F86] transition-colors"
            onClick={() => {
              if (po.status === "Pending") {
                setSelectedPO(po);
              }
            }}
          >
            {row.getValue("orderReference")}
          </div>
        );
      },
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => {
        const po = row.original;
        return (
          <div
            className="text-xs text-[#2E2E2E] truncate max-w-[120px] cursor-pointer hover:text-[#0176D3] transition-colors"
            title={row.getValue("supplier")}
            onClick={() => {
              if (po.status === "Pending") {
                setSelectedPO(po);
              }
            }}
          >
            {row.getValue("supplier")}
          </div>
        );
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items;
        return (
          <div className="text-xs font-medium text-[#2E2E2E] text-center">
            {items.length} item{items.length > 1 ? 's' : ''}
          </div>
        );
      },
    },
    {
      accessorKey: "totalQuantityPcs",
      header: "Qty",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-[#2E2E2E]">
          {row.original.totalQuantityPcs.toLocaleString()}
          <span className="text-[#707070] ml-1">pcs</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)}
            <span>{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalValue",
      header: "Value",
      cell: ({ row }) => (
        <div className="text-xs font-semibold text-[#2E2E2E]">
          ${row.original.totalValue.toLocaleString()}
        </div>
      ),
    },
  ];

  // Column definitions for items data table
  const itemColumns: ColumnDef<PurchaseOrderItem>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => (
        <div className="w-8 h-8 bg-[#F8F9FA] rounded flex items-center justify-center border border-[#E1E5E9] cursor-pointer hover:border-[#0176D3] transition-colors" onClick={() => setExpandedImage(row.getValue("image"))}>
          <img 
            src={row.getValue("image")} 
            alt="Product" 
            className="w-7 h-7 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="w-6 h-6 text-[#707070]"><svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "itemName",
      header: "Item Name",
      cell: ({ row }) => (
        <div>
          <div className="text-xs font-medium text-[#2E2E2E]">
            {row.getValue("itemName")}
          </div>
          <div className="text-xs text-[#707070]">{row.original.designNo}</div>
        </div>
      ),
    },
    {
      accessorKey: "baleQty",
      header: "Bales",
      cell: ({ row }) => (
        <div className="text-xs text-[#2E2E2E] text-center">
          {row.getValue("baleQty")}
        </div>
      ),
    },
    {
      accessorKey: "pcsPerBale",
      header: "Pcs/Bale",
      cell: ({ row }) => (
        <div className="text-xs text-[#2E2E2E] text-center">
          {row.getValue("pcsPerBale")}
        </div>
      ),
    },
    {
      accessorKey: "totalQtyPcs",
      header: "QTY (PCS)",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-[#2E2E2E] text-right">
          {(row.getValue("totalQtyPcs") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <div className="text-xs font-semibold text-[#2E2E2E] text-right">
          ${(row.getValue("value") as number).toLocaleString()}
        </div>
      ),
    },
  ];

  // Mock data initialization
  useEffect(() => {
    // Mock Purchase Orders
    const mockPurchaseOrders: PurchaseOrder[] = [
      {
        id: "PO-001",
        destination: "Zambia Port",
        orderDate: "2024-01-15",
        orderReference: "PO-2024-001",
        supplier: "ABC Textiles Ltd",
        portOfDischarge: "Karachi",
        status: "Pending",
        items: [
          {
            id: "ITEM-001",
            itemName: "Cotton Fabric",
            designNo: "CF-2024-001",
            image: "/products/p1.jpg",
            baleQty: 30,
            pcsPerBale: 100,
            totalQtyPcs: 3000,
            totalYards: 15000,
            ratePerYard: 5.0,
            value: 75000,
          },
          {
            id: "ITEM-002",
            itemName: "Cotton Blend",
            designNo: "CB-2024-001",
            image: "/products/p2.jpg",
            baleQty: 20,
            pcsPerBale: 100,
            totalQtyPcs: 2000,
            totalYards: 10000,
            ratePerYard: 5.0,
            value: 50000,
          },
        ],
        totalValue: 125000,
        totalQuantityPcs: 5000,
      },
      {
        id: "PO-002",
        destination: "Tanzania Warehouse",
        orderDate: "2024-01-18",
        orderReference: "PO-2024-002",
        supplier: "XYZ Fabrics Co",
        portOfDischarge: "Port Qasim",
        status: "Pending",
        items: [
          {
            id: "ITEM-003",
            itemName: "Polyester Blend",
            designNo: "PB-2024-002",
            image: "/products/p3.jpg",
            baleQty: 35,
            pcsPerBale: 100,
            totalQtyPcs: 3500,
            totalYards: 17500,
            ratePerYard: 5.0,
            value: 87500,
          },
        ],
        totalValue: 87500,
        totalQuantityPcs: 3500,
      },
      {
        id: "PO-003",
        destination: "Kenya Hub",
        orderDate: "2024-01-20",
        orderReference: "PO-2024-003",
        supplier: "Global Textiles Inc",
        portOfDischarge: "Gwadar",
        status: "Pending",
        items: [
          {
            id: "ITEM-004",
            itemName: "Silk Fabric",
            designNo: "SF-2024-003",
            image: "/products/p4.jpg",
            baleQty: 15,
            pcsPerBale: 100,
            totalQtyPcs: 1500,
            totalYards: 15000,
            ratePerYard: 10.0,
            value: 150000,
          },
          {
            id: "ITEM-005",
            itemName: "Silk Premium",
            designNo: "SP-2024-003",
            image: "/products/p5.jpg",
            baleQty: 5,
            pcsPerBale: 100,
            totalQtyPcs: 500,
            totalYards: 5000,
            ratePerYard: 10.0,
            value: 50000,
          },
        ],
        totalValue: 200000,
        totalQuantityPcs: 2000,
      },
    ];

    // Mock Shipping Lines
    const mockShippingLines: ShippingLine[] = [
      { id: "SL-001", code: "MAERSK", title: "Maersk Line" },
      { id: "SL-002", code: "EVERGREEN", title: "Evergreen Marine" },
      { id: "SL-003", code: "COSCO", title: "COSCO Shipping" },
      { id: "SL-004", code: "MSC", title: "Mediterranean Shipping Company" },
    ];

    // Mock Consignees
    const mockConsignees: Consignee[] = [
      { id: "CNS-001", code: "POLY001", title: "PolyTex Zambia" },
      { id: "CNS-002", code: "POLY002", title: "PolyTex Tanzania" },
      { id: "CNS-003", code: "POLY003", title: "PolyTex Kenya" },
      { id: "CNS-004", code: "DIST001", title: "Distribution Center 1" },
    ];

    setPurchaseOrders(mockPurchaseOrders);
    setShippingLines(mockShippingLines);
    setConsignees(mockConsignees);
  }, []);

  // Handlers
  const handlePOSelect = (po: PurchaseOrder) => {
    setSelectedPO(po);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedPO) {
      toast.error("Please select a Purchase Order first");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the status of the selected PO
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === selectedPO.id
            ? { ...po, status: values.shipmentStatus as any }
            : po
        )
      );

      // Update selected PO state to reflect the change
      setSelectedPO((prev) =>
        prev ? { ...prev, status: values.shipmentStatus as any } : null
      );

      // Reset form but keep the PO selected
      const orderReference = selectedPO.orderReference;
      form.reset();

      // Show success toast
      toast.success(
        `Purchase Order ${orderReference} status updated to ${values.shipmentStatus}`,
        {
          description: `ETA: ${format(values.eta, "PPP")} | B/L: ${
            values.billOfLading
          }`,
          action: {
            label: "View Details",
            onClick: () => console.log("View details clicked"),
          },
        }
      );
    } catch (error) {
      toast.error("Failed to update shipment status", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="w-3 h-3 text-amber-500" />;
      case "In Transit":
        return <Truck className="w-3 h-3 text-blue-500" />;
      case "Port":
        return <Ship className="w-3 h-3 text-cyan-500" />;
      case "Border":
        return <Package className="w-3 h-3 text-orange-500" />;
      case "Off load":
        return <CheckCircle className="w-3 h-3 text-purple-500" />;
      case "Delivered":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <Package className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "In Transit":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Port":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Border":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Off load":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/*  Header */}
      <div className="bg-white border-b border-[#E1E5E9] px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between max-w-full mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#0176D3] to-[#014F86] rounded-lg flex items-center justify-center">
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#2E2E2E] tracking-tight">
                In Transit Management
              </h1>
              <p className="text-[#707070] text-[10px] -mt-0.5">
                Manage shipments and track orders in transit
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Purchase Orders Selection */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E1E5E9] shadow-sm">
            <div className="px-2.5 py-2 border-b border-[#E1E5E9] bg-[#F8F9FA]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-3.5 h-3.5 text-[#0176D3]" />
                  <h2 className="text-sm font-semibold text-[#2E2E2E]">
                    Purchase Orders
                  </h2>
                  <span className="text-xs text-[#707070]">
                    ({purchaseOrders.length})
                  </span>
                  {globalFilter && (
                    <span className="text-xs text-[#0176D3] bg-[#EBF4FA] px-1.5 py-0.5 rounded-full">
                      Filtered
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {selectedPO && (
                    <div className="flex items-center space-x-1.5 text-xs">
                      <div className="w-1.5 h-1.5 bg-[#0176D3] rounded-full"></div>
                      <span className="text-[#0176D3] font-medium">
                        {selectedPO.orderReference}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
              {/* Search Input */}
              <div className="relative mt-1.5">
                <Search className="absolute md:left-6 left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#707070]" />
                <Input
                  placeholder="Search by order, supplier, destination, or item..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 h-7 text-xs w-[300px] md:w-[800px] mx-auto border-[#E1E5E9] focus:border-[#000000] focus:ring-1 focus:ring-[#0176D3] transition-all duration-200"
                />
                {globalFilter && (
                  <button
                    onClick={() => setGlobalFilter("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#707070] hover:text-[#2E2E2E] transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>

            <div className="p-2">
              <div className="rounded-lg border border-[#E3E5E8] overflow-auto">
                <div className="overflow-x-auto">
                  <table className="w-[920px] overflow-x-scroll table-auto">
                    <thead>
                      <tr className="bg-[#F6F7F9] border-b border-[#E3E5E8]">
                        {columns.map((column, index) => (
                          <th
                            key={index}
                            className="text-left py-2 px-3 text-xs font-semibold text-[#393A3D]"
                          >
                            {typeof column.header === "string"
                              ? column.header
                              : ""}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders
                        .filter(
                          (po) =>
                            globalFilter === "" ||
                            po.orderReference
                              .toLowerCase()
                              .includes(globalFilter.toLowerCase()) ||
                            po.supplier
                              .toLowerCase()
                              .includes(globalFilter.toLowerCase()) ||
                            po.destination
                              .toLowerCase()
                              .includes(globalFilter.toLowerCase()) ||
                            po.items.some(
                              (item) =>
                                item.itemName
                                  .toLowerCase()
                                  .includes(globalFilter.toLowerCase()) ||
                                item.designNo
                                  .toLowerCase()
                                  .includes(globalFilter.toLowerCase())
                            )
                        )
                        .map((po) => (
                          <tr
                            key={po.id}
                            className={`border-b border-[#F6F7F9] hover:bg-[#FAFBFC] cursor-pointer transition-colors ${
                              selectedPO?.id === po.id
                                ? "bg-[#EBF4FA] border-[#0176D3]/20"
                                : ""
                            }`}
                            onClick={() => {
                              if (po.status === "Pending") {
                                setSelectedPO(po);
                              }
                            }}
                          >
                            {columns.map((column, colIndex) => (
                              <td key={colIndex} className="py-2 px-3">
                                {typeof column.cell === "function"
                                  ? column.cell({
                                      row: {
                                        original: po,
                                        getValue: (key: string) =>
                                          po[key as keyof PurchaseOrder],
                                      },
                                    } as any)
                                  : column.cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      {purchaseOrders.filter(
                        (po) =>
                          globalFilter === "" ||
                          po.orderReference
                            .toLowerCase()
                            .includes(globalFilter.toLowerCase()) ||
                          po.supplier
                            .toLowerCase()
                            .includes(globalFilter.toLowerCase()) ||
                          po.destination
                            .toLowerCase()
                            .includes(globalFilter.toLowerCase()) ||
                          po.items.some(
                            (item) =>
                              item.itemName
                                .toLowerCase()
                                .includes(globalFilter.toLowerCase()) ||
                              item.designNo
                                .toLowerCase()
                                .includes(globalFilter.toLowerCase())
                          )
                      ).length === 0 && (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="py-8 px-4 text-center text-xs text-[#6B7C93]"
                          >
                            No purchase orders found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* In Transit Form */}
          <div className="bg-white rounded-lg border border-[#E1E5E9] shadow-sm">
            <div className="px-2.5 py-2 border-b border-[#E1E5E9] bg-[#F8F9FA]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ship className="w-3.5 h-3.5 text-[#0176D3]" />
                  <h2 className="text-sm font-semibold text-[#2E2E2E]">
                    Shipment Details
                  </h2>
                </div>
                {selectedPO && (
                  <button
                    onClick={() => setSelectedPO(null)}
                    className="text-xs text-[#707070] hover:text-[#0176D3] transition-colors underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <p className="text-xs text-[#707070] mt-0.5">
                Complete shipping information
              </p>
            </div>

            <div className="p-2.5 space-y-2.5">
              {selectedPO ? (
                <>
                  {/* PO Summary Card */}
                  <div className="p-3 bg-white rounded border border-gray-300 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Order Summary
                      </h3>
                      <div className="text-sm font-bold text-blue-600">
                        ${selectedPO.totalValue.toLocaleString()}
                      </div>
                    </div>

                    {/* Compact Info Grid */}
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Destination:
                        </span>
                        <span
                          className="text-gray-900 font-medium text-right truncate ml-2 max-w-[60%]"
                          title={selectedPO.destination}
                        >
                          {selectedPO.destination}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Port:</span>
                        <span
                          className="text-gray-900 font-medium text-right truncate ml-2 max-w-[60%]"
                          title={selectedPO.portOfDischarge}
                        >
                          {selectedPO.portOfDischarge}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Supplier:
                        </span>
                        <span
                          className="text-gray-900 font-medium text-right truncate ml-2 max-w-[60%]"
                          title={selectedPO.supplier}
                        >
                          {selectedPO.supplier}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-1.5"></div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Items:
                        </span>
                        <span className="text-gray-900 font-bold">
                          {selectedPO.items.length}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Total Qty:
                        </span>
                        <span className="text-gray-900 font-bold">
                          {selectedPO.totalQuantityPcs.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Data Grid */}
                  <div className="bg-white rounded-md border border-[#E1E5E9] shadow-sm animate-in slide-in-from-top-4 duration-500">
                    <div className="px-2.5 py-1.5 border-b border-[#E1E5E9] bg-[#FAFBFC]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[#2E2E2E] uppercase tracking-wide">
                          Order Items
                        </h3>
                        <span className="text-xs text-[#707070] bg-[#E1E5E9] px-1.5 py-0.5 rounded-full">
                          {selectedPO.items.length} items
                        </span>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <DataTable
                        columns={itemColumns}
                        data={selectedPO.items}
                      />
                    </div>
                  </div>

                  {/* Shipping Form */}
                  <div className="bg-white rounded-md border border-[#E1E5E9] shadow-sm animate-in slide-in-from-top-6 duration-700">
                    <div className="px-2.5 py-1.5 border-b border-[#E1E5E9] bg-[#FAFBFC]">
                      <h3 className="text-xs font-semibold text-[#2E2E2E] uppercase tracking-wide">
                        Shipping Information
                      </h3>
                    </div>
                    <div className="p-2.5">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-2.5"
                        >
                          {/* User Input Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <FormField
                              control={form.control}
                              name="shippingLineId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Shipping Line{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="!h-7 w-full md:w-45 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                                        <SelectValue placeholder="Select shipping line" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {shippingLines.map((line) => (
                                        <SelectItem
                                          key={line.id}
                                          value={line.id}
                                        >
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium text-xs">
                                              {line.code}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                              - {line.title}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="invoiceNo"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Invoice Number{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter invoice number"
                                      {...field}
                                      className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1 placeholder:text-[#999]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="consigneeId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Consignee{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="!h-7 w-full md:w-45 lg:w-45 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                                        <SelectValue placeholder="Select consignee" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {consignees.map((consignee) => (
                                        <SelectItem
                                          key={consignee.id}
                                          value={consignee.id}
                                        >
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium text-xs">
                                              {consignee.code}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                              - {consignee.title}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="containerType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Container Type{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. 20ft, 40ft, 40ft HC"
                                      {...field}
                                      className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1 placeholder:text-[#999]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="containerNo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Container No{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. MSKU1234567"
                                      {...field}
                                      className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1 placeholder:text-[#999]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billOfLading"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Bill of Lading{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter B/L number"
                                      {...field}
                                      className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1 placeholder:text-[#999]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="eta"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    ETA <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1 w-full justify-start text-left font-normal",
                                            !field.value && "text-[#999]"
                                          )}
                                        >
                                          <CalendarDays className="mr-2 h-3 w-3" />
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Select ETA date</span>
                                          )}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shipmentStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                                    Status{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="!h-7 w-full text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {[
                                        {
                                          value: "In Transit",
                                          icon: Truck,
                                          color: "text-blue-500",
                                        },
                                        {
                                          value: "Port",
                                          icon: Ship,
                                          color: "text-cyan-500",
                                        },
                                        {
                                          value: "Border",
                                          icon: Package,
                                          color: "text-orange-500",
                                        },
                                        {
                                          value: "Off load",
                                          icon: CheckCircle,
                                          color: "text-purple-500",
                                        },
                                      ].map((status) => (
                                        <SelectItem
                                          key={status.value}
                                          value={status.value}
                                        >
                                          <div className="flex items-center space-x-2">
                                            <status.icon
                                              className={`w-3 h-3 ${status.color}`}
                                            />
                                            <span className="text-xs">
                                              {status.value}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="pt-2.5 border-t border-[#E1E5E9] mt-3">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className={`w-full h-8 bg-[#0176D3] hover:bg-[#014F86] text-white font-medium text-sm rounded-md transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 ${
                                isLoading
                                  ? "animate-pulse"
                                  : "hover:scale-[1.02]"
                              }`}
                            >
                              {isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Processing...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Ship className="w-3.5 h-3.5" />
                                  <span>Update Shipment Status</span>
                                </div>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-[#F8F9FA] rounded-full flex items-center justify-center border border-[#E1E5E9]">
                    <Package className="w-5 h-5 text-[#707070]" />
                  </div>
                  <h3 className="text-sm font-medium text-[#2E2E2E] mb-1">
                    Select Purchase Order
                  </h3>
                  <p className="text-xs text-[#707070] px-3 leading-relaxed">
                    Choose a purchase order from the left panel to begin
                    processing shipment details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setExpandedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <img
              src={expandedImage}
              alt="Expanded Product"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InTransit;
