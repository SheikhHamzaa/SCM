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
import ShipmentDetailsForm from "./ShipmentDetailsForm";

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
        const isSelected = selectedPO?.id === po.id;
        return (
          <div className="flex justify-center">
            <div className={`relative ${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
              <input
                type="radio"
                name="selectedPO"
                className={`w-4 h-4 border-2 text-[#0176D3] focus:ring-2 focus:ring-[#0176D3] focus:ring-offset-0 transition-all duration-200 ${
                  isDisabled 
                    ? 'opacity-30 cursor-not-allowed border-[#E1E5E9]' 
                    : 'cursor-pointer border-[#0176D3] hover:border-[#014F86] hover:scale-110'
                } ${
                  isSelected ? 'ring-2 ring-[#0176D3] ring-offset-1' : ''
                }`}
                disabled={isDisabled}
                checked={isSelected}
                onChange={() => {
                  if (po.status === "Pending") {
                    setSelectedPO(po);
                  }
                }}
              />
            </div>
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
        const isDisabled = po.status !== "Pending";
        const isSelected = selectedPO?.id === po.id;
        return (
          <div
            className={`text-xs font-medium transition-all duration-200 ${
              isDisabled 
                ? 'text-[#9CA3AF] cursor-not-allowed' 
                : 'text-[#2E2E2E] cursor-pointer hover:text-[#0176D3] hover:font-semibold'
            } ${
              isSelected ? 'text-[#0176D3] font-semibold' : ''
            }`}
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
        const isDisabled = po.status !== "Pending";
        const isSelected = selectedPO?.id === po.id;
        return (
          <div
            className={`text-xs font-medium transition-all duration-200 ${
              isDisabled 
                ? 'text-[#9CA3AF] cursor-not-allowed' 
                : 'text-[#0176D3] cursor-pointer hover:text-[#014F86] hover:underline hover:font-semibold'
            } ${
              isSelected ? 'text-[#014F86] font-semibold underline' : ''
            }`}
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
        const isDisabled = po.status !== "Pending";
        const isSelected = selectedPO?.id === po.id;
        return (
          <div
            className={`text-xs truncate max-w-[120px] transition-all duration-200 ${
              isDisabled 
                ? 'text-[#9CA3AF] cursor-not-allowed' 
                : 'text-[#2E2E2E] cursor-pointer hover:text-[#0176D3] hover:font-medium'
            } ${
              isSelected ? 'text-[#0176D3] font-medium' : ''
            }`}
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
            {items.length} item{items.length > 1 ? "s" : ""}
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
        const po = row.original;
        const isSelected = selectedPO?.id === po.id;
        return (
          <div
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-[10px] font-bold transition-all duration-200 ${getStatusColor(
              status
            )} ${
              isSelected ? 'scale-105 ring-2 ring-blue-200' : 'hover:scale-105'
            }`}
          >
            <div className={`${isSelected ? 'animate-pulse' : ''}`}>
              {getStatusIcon(status)}
            </div>
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
        <div
          className="w-4 h-4 bg-[#F8F9FA] rounded flex items-center justify-center border border-[#E1E5E9] cursor-pointer hover:border-[#0176D3] transition-colors"
          onClick={() => setExpandedImage(row.getValue("image"))}
        >
          <img
            src={row.getValue("image")}
            alt="Product"
            className="w-4 h-4 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="w-6 h-6 text-[#707070]"><svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
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
        <div className="text-xs font-medium text-[#2E2E2E] text-center">
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
      {
        id: "PO-004",
        destination: "Dubai Hub",
        orderDate: "2024-02-15",
        orderReference: "PO-2024-004",
        supplier: "Emirates Fabrics LLC",
        portOfDischarge: "Karachi",
        status: "Pending",
        items: [
          {
            id: "ITEM-006",
            itemName: "Cotton Fabric",
            designNo: "CF-2024-004",
            image: "/products/p6.jpg",
            baleQty: 20,
            pcsPerBale: 80,
            totalQtyPcs: 1600,
            totalYards: 12000,
            ratePerYard: 8.5,
            value: 102000,
          },
          {
            id: "ITEM-007",
            itemName: "Cotton Premium",
            designNo: "CP-2024-004",
            image: "/products/p7.jpg",
            baleQty: 10,
            pcsPerBale: 90,
            totalQtyPcs: 900,
            totalYards: 7200,
            ratePerYard: 9.0,
            value: 64800,
          },
        ],
        totalValue: 166800,
        totalQuantityPcs: 2500,
      },
      {
        id: "PO-005",
        destination: "UK Warehouse",
        orderDate: "2024-03-05",
        orderReference: "PO-2024-005",
        supplier: "British Textiles Ltd",
        portOfDischarge: "Port Qasim",
        status: "Pending",
        items: [
          {
            id: "ITEM-008",
            itemName: "Linen Classic",
            designNo: "LC-2024-005",
            image: "/products/p8.jpg",
            baleQty: 12,
            pcsPerBale: 70,
            totalQtyPcs: 840,
            totalYards: 5600,
            ratePerYard: 12.0,
            value: 67200,
          },
          {
            id: "ITEM-009",
            itemName: "Linen Premium",
            designNo: "LP-2024-005",
            image: "/products/p9.jpg",
            baleQty: 8,
            pcsPerBale: 75,
            totalQtyPcs: 600,
            totalYards: 4500,
            ratePerYard: 12.5,
            value: 56250,
          },
        ],
        totalValue: 123450,
        totalQuantityPcs: 1440,
      },
      {
        id: "PO-006",
        destination: "New York Hub",
        orderDate: "2024-04-10",
        orderReference: "PO-2024-006",
        supplier: "American Fabrics Co",
        portOfDischarge: "Karachi",
        status: "Pending",
        items: [
          {
            id: "ITEM-010",
            itemName: "Polyester Standard",
            designNo: "PS-2024-006",
            image: "/products/p10.jpg",
            baleQty: 18,
            pcsPerBale: 110,
            totalQtyPcs: 1980,
            totalYards: 15840,
            ratePerYard: 7.5,
            value: 118800,
          },
          {
            id: "ITEM-011",
            itemName: "Polyester Premium",
            designNo: "PP-2024-006",
            image: "/products/p11.jpg",
            baleQty: 7,
            pcsPerBale: 120,
            totalQtyPcs: 840,
            totalYards: 6720,
            ratePerYard: 8.0,
            value: 53760,
          },
        ],
        totalValue: 172560,
        totalQuantityPcs: 2820,
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
            ? { ...po, status: values.shipmentStatus as PurchaseOrder["status"] }
            : po
        )
      );

      // Update selected PO state to reflect the change
      setSelectedPO((prev) =>
        prev ? { ...prev, status: values.shipmentStatus as PurchaseOrder["status"] } : null
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
    } catch {
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
        return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-300 shadow-sm";
      case "In Transit":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300 shadow-sm";
      case "Port":
        return "bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-300 shadow-sm";
      case "Border":
        return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-300 shadow-sm";
      case "Off load":
        return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-300 shadow-sm";
      case "Delivered":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-300 shadow-sm";
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
              <h1 className="text-lg font-bold text-[#2E2E2E] tracking-tight">
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
              <DataTable 
                columns={columns} 
                data={purchaseOrders.filter(
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
                )}
              />
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
                  <ShipmentDetailsForm
                    form={form}
                    shippingLines={shippingLines}
                    consignees={consignees}
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                  />
                </>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E1E5E9] to-[#F8F9FA] rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-sm font-medium text-[#2E2E2E] mb-1">No Purchase Order Selected</h3>
                  <p className="text-xs text-[#707070] mb-4 leading-relaxed">
                    Select a purchase order from the list to begin processing shipment details
                  </p>
                  <div className="text-xs text-[#9CA3AF] bg-[#F8F9FA] p-3 rounded-lg border border-[#E1E5E9]">
                    <span className="font-medium">Note:</span> Only orders with Pending status can be processed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
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
                target.style.display = "none";
                target.parentElement!.innerHTML =
                  '<div class="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InTransit;
