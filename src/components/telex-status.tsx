"use client";
import React, { useState } from "react";
import { DockIcon, Package, Edit2, Check, X } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseOrder {
  id: string;
  poNo: string;
  portOfDischarge: string;
  destination: string;
  orderDate: string;
  orderReference: string;
  supplier: string;
  item: string;
  designNo: string;
  image: string;
  baleQty: number;
  pcsPerBale: number;
  totalQtyPcs: number;
  totalYards: number;
  ratePerYard: number;
  value: number;
  inventoryStatus: string;
  telexStatus: "Not Released" | "Released";
}

const TelexStatus = () => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempTelexStatus, setTempTelexStatus] = useState<
    "Not Released" | "Released"
  >("Not Released");

  const [PO, setPO] = useState<PurchaseOrder[]>(
    ([
      {
        id: "1",
        poNo: "PO-52345",
        portOfDischarge: "Karachi Port",
        destination: "Lahore",
        orderDate: "2024-01-15",
        orderReference: "REF-001",
        supplier: "ABC Textiles Ltd",
        item: "Cotton Fabric",
        designNo: "CTN-001",
        image: "/products/p1.jpg",
        baleQty: 10,
        pcsPerBale: 50,
        totalQtyPcs: 500,
        totalYards: 2500,
        ratePerYard: 2.5,
        value: 6250,
        inventoryStatus: "In Transit",
        telexStatus: "Not Released",
      },
      {
        id: "2",
        poNo: "PO-52346",
        portOfDischarge: "Karachi Port",
        destination: "Karachi",
        orderDate: "2024-01-16",
        orderReference: "REF-002",
        supplier: "XYZ Mills",
        item: "Polyester Blend",
        designNo: "PB-002",
        image: "/products/p2.jpg",
        baleQty: 8,
        pcsPerBale: 40,
        totalQtyPcs: 320,
        totalYards: 1600,
        ratePerYard: 3.0,
        value: 4800,
        inventoryStatus: "In Transit",
        telexStatus: "Not Released",
      },
      {
        id: "3",
        poNo: "PO-52347",
        portOfDischarge: "Karachi Port",
        destination: "Islamabad",
        orderDate: "2024-01-17",
        orderReference: "REF-003",
        supplier: "DEF Fabrics",
        item: "Silk Fabric",
        designNo: "SF-003",
        image: "/products/p3.jpg",
        baleQty: 5,
        pcsPerBale: 30,
        totalQtyPcs: 150,
        totalYards: 750,
        ratePerYard: 5.0,
        value: 3750,
        inventoryStatus: "In Transit",
        telexStatus: "Released",
      },
      {
        id: "4",
        poNo: "PO-52348",
        portOfDischarge: "Gwadar Port",
        destination: "Faisalabad",
        orderDate: "2024-01-18",
        orderReference: "REF-004",
        supplier: "GHI Textiles",
        item: "Denim",
        designNo: "DNM-004",
        image: "/products/p4.jpg",
        baleQty: 12,
        pcsPerBale: 45,
        totalQtyPcs: 540,
        totalYards: 2700,
        ratePerYard: 4.0,
        value: 10800,
        inventoryStatus: "In Transit",
        telexStatus: "Released",
      },
      {
        id: "5",
        poNo: "PO-52349",
        portOfDischarge: "Karachi Port",
        destination: "Multan",
        orderDate: "2024-01-19",
        orderReference: "REF-005",
        supplier: "JKL Fabrics",
        item: "Linen",
        designNo: "LIN-005",
        image: "/products/p5.jpg",
        baleQty: 6,
        pcsPerBale: 60,
        totalQtyPcs: 360,
        totalYards: 1800,
        ratePerYard: 3.2,
        value: 5760,
        inventoryStatus: "In Transit",
        telexStatus: "Not Released",
      },
      {
        id: "6",
        poNo: "PO-52350",
        portOfDischarge: "Gwadar Port",
        destination: "Peshawar",
        orderDate: "2024-01-20",
        orderReference: "REF-006",
        supplier: "MNO Exports",
        item: "Viscose",
        designNo: "VSC-006",
        image: "/products/p6.jpg",
        baleQty: 7,
        pcsPerBale: 35,
        totalQtyPcs: 245,
        totalYards: 1225,
        ratePerYard: 2.8,
        value: 3430,
        inventoryStatus: "In Transit",
        telexStatus: "Released",
      },
      {
        id: "7",
        poNo: "PO-52351",
        portOfDischarge: "Karachi Port",
        destination: "Quetta",
        orderDate: "2024-01-21",
        orderReference: "REF-007",
        supplier: "PQR Mills",
        item: "Nylon",
        designNo: "NYL-007",
        image: "/products/p7.jpg",
        baleQty: 15,
        pcsPerBale: 20,
        totalQtyPcs: 300,
        totalYards: 1500,
        ratePerYard: 4.5,
        value: 6750,
        inventoryStatus: "Port",
        telexStatus: "Not Released",
      },
      {
        id: "8",
        poNo: "PO-52352",
        portOfDischarge: "Karachi Port",
        destination: "Hyderabad",
        orderDate: "2024-01-22",
        orderReference: "REF-008",
        supplier: "STU Textiles",
        item: "Wool",
        designNo: "WOL-008",
        image: "/products/p8.jpg",
        baleQty: 9,
        pcsPerBale: 25,
        totalQtyPcs: 225,
        totalYards: 1125,
        ratePerYard: 6.0,
        value: 6750,
        inventoryStatus: "In Transit",
        telexStatus: "Released",
      },
      {
        id: "9",
        poNo: "PO-52353",
        portOfDischarge: "Gwadar Port",
        destination: "Sialkot",
        orderDate: "2024-01-23",
        orderReference: "REF-009",
        supplier: "VWX Imports",
        item: "Rayon",
        designNo: "RYN-009",
        image: "/products/p9.jpg",
        baleQty: 11,
        pcsPerBale: 55,
        totalQtyPcs: 605,
        totalYards: 3025,
        ratePerYard: 3.6,
        value: 10890,
        inventoryStatus: "In Transit",
        telexStatus: "Not Released",
      },
      {
        id: "10",
        poNo: "PO-52354",
        portOfDischarge: "Karachi Port",
        destination: "Sukkur",
        orderDate: "2024-01-24",
        orderReference: "REF-010",
        supplier: "YZA Fabrics",
        item: "Georgette",
        designNo: "GGT-010",
        image: "/products/p10.jpg",
        baleQty: 4,
        pcsPerBale: 70,
        totalQtyPcs: 280,
        totalYards: 1400,
        ratePerYard: 5.5,
        value: 7700,
        inventoryStatus: "Port",
        telexStatus: "Released",
      },
    ].sort((a, b) => (a.poNo > b.poNo ? 1 : -1))) as PurchaseOrder[]
  );

  const handleEditClick = (
    orderId: string,
    currentStatus: "Not Released" | "Released"
  ) => {
    setEditingRow(orderId);
    setTempTelexStatus(currentStatus);
  };

  const handleSave = (orderId: string) => {
    setPO((prevPO) =>
      prevPO.map((order) =>
        order.id === orderId
          ? { ...order, telexStatus: tempTelexStatus }
          : order
      )
    );
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setTempTelexStatus("Not Released");
  };

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      accessorKey: "poNo",
      header: "PO No.",
      cell: ({ row }) => (
        <div className="text-[#0077C5] font-medium text-[11px]">
          {row.getValue("poNo")}
        </div>
      ),
    },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: ({ row }) => (
        <div className="text-[#393A3D] text-[11px]">
          {row.getValue("destination")}
        </div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => (
        <div className="text-[#393A3D] text-[11px]">
          {row.getValue("orderDate")}
        </div>
      ),
    },
    {
      accessorKey: "orderReference",
      header: "Order Reference",
      cell: ({ row }) => (
        <div className="text-[#0077C5] font-medium text-[11px]">
          {row.getValue("orderReference")}
        </div>
      ),
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => (
        <div className="text-[#393A3D] text-[11px]">
          {row.getValue("supplier")}
        </div>
      ),
    },
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="text-[#393A3D] text-[11px]">
          {row.getValue("item")}
        </div>
      ),
    },
    {
      accessorKey: "designNo",
      header: "Design No.",
      cell: ({ row }) => (
        <div className="text-[#6B7C93] font-mono text-[11px]">
          {row.getValue("designNo")}
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <div className="text-right text-[#2CA01C] font-semibold text-[11px]">
          ${row.getValue<number>("value").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "inventoryStatus",
      header: "Inventory Status",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex px-2 py-1 text-[10px] font-medium bg-[#FFF3CD] text-[#856404] rounded-full">
            {row.getValue("inventoryStatus")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "telexStatus",
      header: "Telex Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-center text-[11px]">
            {editingRow === order.id ? (
              <div className="flex items-center justify-center space-x-1">
                <Select
                  value={tempTelexStatus}
                  onValueChange={(value) =>
                    setTempTelexStatus(value as "Not Released" | "Released")
                  }
                >
                  <SelectTrigger className="w-24 h-6 text-[10px] border border-[#E1E5E9] focus:ring-1 focus:ring-[#0176D3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Released" className="text-[10px]">
                      Not Released
                    </SelectItem>
                    <SelectItem value="Released" className="text-[10px]">
                      Released
                    </SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => handleSave(order.id)}
                  className="p-0.5 text-[#2CA01C] hover:bg-[#F0F9FF] rounded transition-colors"
                  title="Save"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-0.5 text-[#DC3545] hover:bg-[#FFF5F5] rounded transition-colors"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                className={`inline-flex px-2 py-1 text-[10px] font-medium rounded-full ${
                  order.telexStatus === "Released"
                    ? "bg-[#D4EDDA] text-[#155724]"
                    : "bg-[#F8D7DA] text-[#721C24]"
                }`}
              >
                {order.telexStatus}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-center">
            {editingRow !== order.id && (
              <button
                onClick={() => handleEditClick(order.id, order.telexStatus)}
                className="p-1 text-[#0176D3] hover:bg-[#F0F9FF] rounded transition-colors"
                title="Edit Telex Status"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E1E5E9] px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0176D3] to-[#014F86] rounded-lg flex items-center justify-center">
              <DockIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2E2E2E] tracking-tight">
                Telex Status
              </h1>
              <p className="text-[#707070] text-[11px] -mt-0.5">
                Manage telex status and track updates
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Compact Data Table */}
      <div className="bg-white rounded-lg border border-[#E1E5E9] shadow-sm overflow-hidden">
        <div className="border-b border-[#E1E5E9] px-4 py-1 bg-gradient-to-r from-[#F8F9FA] to-white"></div>
        <div className="p-4">
          {PO.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-[#C1C7CD] mb-2 mx-auto" />
              <p className="text-[#6B7C93] font-medium text-sm">
                No purchase orders found
              </p>
              <p className="text-[#C1C7CD] text-xs mt-1">
                Click &quot;Create Order&quot; to add your first order
              </p>
            </div>
          ) : (
            <DataTable columns={columns} data={PO} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TelexStatus;
