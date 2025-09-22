"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  Package,
  Search,
  X,
  ArrowLeft,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types
interface Product {
  id: string;
  name: string;
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
  item: string;
  designNo: string;
  image: string;
  baleQty: number;
  pcsPerBale: number;
  totalQtyPcs: number;
  totalYards: number;
  ratePerYard: number;
  value: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  currency: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  amount: number;
}

const PurchaseOrder = () => {
  // State management
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // Form state
  const [formData, setFormData] = useState({
    customer: "",
    invoice: "",
    destination: "",
    orderDate: "",
    orderReference: "",
    supplier: "",
    supplierCurrency: "",
    description: "",
  });

  // Destinations data
  const destinations = [
    { id: "1", name: "New York, USA", code: "NYC" },
    { id: "2", name: "London, UK", code: "LON" },
    { id: "3", name: "Dubai, UAE", code: "DXB" },
    { id: "4", name: "Singapore", code: "SIN" },
    { id: "5", name: "Hong Kong", code: "HKG" },
    { id: "6", name: "Mumbai, India", code: "BOM" },
    { id: "7", name: "Dhaka, Bangladesh", code: "DAC" },
    { id: "8", name: "Karachi, Pakistan", code: "KHI" },
  ];

  // Generate random invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  };

  // Sample data
  const customers: Customer[] = [
    {
      id: "1",
      name: "ABC Textiles Ltd.",
      email: "contact@abctextiles.com",
      phone: "+1-555-0101",
      currency: "USD",
    },
    {
      id: "2",
      name: "Global Fashion Inc.",
      email: "orders@globalfashion.com",
      phone: "+1-555-0102",
      currency: "EUR",
    },
    {
      id: "3",
      name: "Metro Clothing Co.",
      email: "procurement@metroclothing.com",
      phone: "+1-555-0103",
      currency: "GBP",
    },
  ];

  const invoices: Invoice[] = [
    { id: "1", invoiceNo: "INV-2024-001", date: "2024-01-15", amount: 15000 },
    { id: "2", invoiceNo: "INV-2024-002", date: "2024-01-16", amount: 22500 },
    { id: "3", invoiceNo: "INV-2024-003", date: "2024-01-17", amount: 18750 },
  ];

  const availableProducts: Product[] = [
    {
      id: "1",
      name: "Cotton Fabric - Premium",
      designNo: "CTN-001",
      image: "/api/placeholder/50/50",
      baleQty: 10,
      pcsPerBale: 25,
      totalQtyPcs: 250,
      totalYards: 1250,
      ratePerYard: 12.5,
      value: 15625,
    },
    {
      id: "2",
      name: "Silk Blend - Luxury",
      designNo: "SLK-002",
      image: "/api/placeholder/50/50",
      baleQty: 5,
      pcsPerBale: 20,
      totalQtyPcs: 100,
      totalYards: 800,
      ratePerYard: 25.0,
      value: 20000,
    },
    {
      id: "3",
      name: "Denim - Heavy Duty",
      designNo: "DNM-003",
      image: "/api/placeholder/50/50",
      baleQty: 8,
      pcsPerBale: 15,
      totalQtyPcs: 120,
      totalYards: 960,
      ratePerYard: 18.75,
      value: 18000,
    },
    {
      id: "4",
      name: "Polyester - Water Resistant",
      designNo: "PLY-004",
      image: "/api/placeholder/50/50",
      baleQty: 12,
      pcsPerBale: 30,
      totalQtyPcs: 360,
      totalYards: 1800,
      ratePerYard: 8.5,
      value: 15300,
    },
  ];

  // Handlers
  const handleCreateOrder = () => {
    setIsDrawerOpen(true);
    // Prevent body scroll when drawer is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
    // Reset form
    setFormData({
      customer: "",
      invoice: "",
      destination: "",
      orderDate: "",
      orderReference: "",
      supplier: "",
      supplierCurrency: "",
      description: "",
    });
    setSelectedProducts([]);
    setSelectedProductIds(new Set());
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleProductSelection = (product: Product) => {
    const newSelectedIds = new Set(selectedProductIds);

    if (selectedProductIds.has(product.id)) {
      newSelectedIds.delete(product.id);
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      newSelectedIds.add(product.id);
      setSelectedProducts((prev) => [...prev, product]);
    }

    setSelectedProductIds(newSelectedIds);
  };

  const handleSaveProducts = () => {
    setIsProductDialogOpen(false);
  };

  // Handle supplier selection and auto-fill currency
  const handleSupplierChange = (supplierId: string) => {
    const selectedSupplier = customers.find((c) => c.id === supplierId);
    setFormData((prev) => ({
      ...prev,
      customer: supplierId,
      supplierCurrency: selectedSupplier?.currency || "",
    }));
  };

  // Handle invoice generation
  const handleGenerateInvoice = () => {
    const newInvoiceNumber = generateInvoiceNumber();
    setFormData((prev) => ({
      ...prev,
      invoice: newInvoiceNumber,
    }));
  };

  const handleSavePurchaseOrder = () => {
    if (
      !formData.customer ||
      !formData.invoice ||
      selectedProducts.length === 0
    ) {
      alert("Please fill all required fields and select at least one product");
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === formData.customer);

    // Calculate totals for all selected products
    const totalBaleQty = selectedProducts.reduce(
      (sum, p) => sum + p.baleQty,
      0
    );
    const totalPcs = selectedProducts.reduce(
      (sum, p) => sum + p.totalQtyPcs,
      0
    );
    const totalYards = selectedProducts.reduce(
      (sum, p) => sum + p.totalYards,
      0
    );
    const totalValue = selectedProducts.reduce((sum, p) => sum + p.value, 0);
    const avgRatePerYard = totalYards > 0 ? totalValue / totalYards : 0;

    // Create a single purchase order with combined product information
    const productNames = selectedProducts.map((p) => p.name).join(", ");
    const designNumbers = selectedProducts.map((p) => p.designNo).join(", ");

    const newOrder: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      destination: formData.destination || "N/A",
      orderDate: formData.orderDate || new Date().toISOString().split("T")[0],
      orderReference: formData.orderReference || `REF-${Date.now()}`,
      supplier: formData.supplier || selectedCustomer?.name || "N/A",
      item:
        selectedProducts.length === 1
          ? selectedProducts[0].name
          : `${selectedProducts.length} Products: ${productNames}`,
      designNo:
        selectedProducts.length === 1
          ? selectedProducts[0].designNo
          : designNumbers,
      image: selectedProducts[0].image, // Use first product's image as representative
      baleQty: totalBaleQty,
      pcsPerBale: Math.round(totalPcs / totalBaleQty) || 0, // Average pcs per bale
      totalQtyPcs: totalPcs,
      totalYards: totalYards,
      ratePerYard: Number(avgRatePerYard.toFixed(2)),
      value: totalValue,
    };

    setPurchaseOrders((prev) => [...prev, newOrder]);
    handleCloseDrawer();
  };

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const totalValue = purchaseOrders.reduce(
    (sum, order) => sum + order.value,
    0
  );

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* QuickBooks Header */}
      <div className="bg-white border-b border-[#E3E5E8] px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-semibold text-[#393A3D] mb-1">
              Purchase Orders
            </h1>
            <p className="text-[#6B7C93] text-sm">
              Manage your purchase orders and track inventory
            </p>
          </div>
          <Button onClick={handleCreateOrder}>
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-[#E3E5E8] p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7C93] text-xs font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-[#393A3D]">
                  {purchaseOrders.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#EBF4FA] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-[#0077C5]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E3E5E8] p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7C93] text-xs font-medium mb-1">
                  Total Value
                </p>
                <p className="text-xl font-bold text-[#393A3D]">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#F3F8F3] rounded-lg flex items-center justify-center">
                <span className="text-[#2CA01C] font-bold text-lg">$</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E3E5E8] p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7C93] text-xs font-medium mb-1">
                  Total Quantity
                </p>
                <p className="text-xl font-bold text-[#393A3D]">
                  {purchaseOrders
                    .reduce((sum, order) => sum + order.totalQtyPcs, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#F5F2F8] rounded-lg flex items-center justify-center">
                <span className="text-[#632CA6] font-bold text-lg">Σ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Table */}
        <div className="bg-white rounded-lg border border-[#E3E5E8] shadow-sm">
          <div className="border-b border-[#E3E5E8] px-4 py-3">
            <h2 className="text-lg font-semibold text-[#393A3D]">
              Purchase Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F6F7F9] border-b border-[#E3E5E8]">
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Destination
                  </th>
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Order Date
                  </th>
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Order Reference
                  </th>
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Supplier
                  </th>
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Item
                  </th>
                  <th className="text-left py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Design No.
                  </th>
                  <th className="text-center py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Image
                  </th>
                  <th className="text-center py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Bale Qty
                  </th>
                  <th className="text-center py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Pcs/Bale
                  </th>
                  <th className="text-center py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Total Qty
                  </th>
                  <th className="text-center py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Total Yards
                  </th>
                  <th className="text-right py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Rate/Yard
                  </th>
                  <th className="text-right py-2 px-4 text-[#6B7C93] font-medium text-xs">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Package className="w-10 h-10 text-[#C1C7CD] mb-2" />
                        <p className="text-[#6B7C93] font-medium text-sm">
                          No purchase orders found
                        </p>
                        <p className="text-[#C1C7CD] text-xs mt-1">
                          Click "Create Order" to add your first order
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F6F7F9] hover:bg-[#FAFBFC] transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-[#393A3D] text-xs">
                        {order.destination}
                      </td>
                      <td className="py-3 px-4 text-[#393A3D] text-xs">
                        {order.orderDate}
                      </td>
                      <td className="py-3 px-4 text-[#0077C5] font-medium text-xs">
                        {order.orderReference}
                      </td>
                      <td className="py-3 px-4 text-[#393A3D] text-xs">
                        {order.supplier}
                      </td>
                      <td className="py-3 px-4 text-[#393A3D] text-xs">
                        {order.item}
                      </td>
                      <td className="py-3 px-4 text-[#6B7C93] font-mono text-xs">
                        {order.designNo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="w-8 h-8 bg-[#F6F7F9] rounded border border-[#E3E5E8] flex items-center justify-center mx-auto">
                          <Package className="w-3 h-3 text-[#C1C7CD]" />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-[#393A3D] text-xs">
                        {order.baleQty}
                      </td>
                      <td className="py-3 px-4 text-center text-[#393A3D] text-xs">
                        {order.pcsPerBale}
                      </td>
                      <td className="py-3 px-4 text-center text-[#393A3D] font-medium text-xs">
                        {order.totalQtyPcs.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-[#393A3D] text-xs">
                        {order.totalYards.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-[#393A3D] text-xs">
                        ${order.ratePerYard.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#2CA01C] font-semibold text-xs">
                        ${order.value.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-yellow-400">
          <div className="bg-white border-b border-[#E3E5E8] px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCloseDrawer}
                  className="text-[#6B7C93] hover:text-[#393A3D] p-2 rounded-md hover:bg-[#F6F7F9] transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-[#393A3D]">
                    Create Purchase Order
                  </h1>
                  <p className="text-[#6B7C93] text-sm">
                    Fill in the details below to create a new purchase order
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCloseDrawer}
                  className="px-4 py-2 text-[#6B7C93] border border-[#E3E5E8] rounded-md hover:bg-[#F6F7F9] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePurchaseOrder}
                  disabled={
                    !formData.customer ||
                    !formData.invoice ||
                    selectedProducts.length === 0
                  }
                  className="px-6 py-2 bg-[#0077C5] hover:bg-[#005ea3] disabled:bg-[#C1C7CD] text-white rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  Create Purchase Order
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden h-[calc(100vh-80px)]">
            <div className="h-full flex">
              <div className="w-full border-r border-[#E3E5E8] overflow-y-auto bg-[#FAFBFC]">
                <div className="p-3">
                  <div className="space-y-3">
                    {/* Order Information Section - Compact QuickBooks Style */}
                    <div className="bg-gray-100 rounded-lg border border-[#E3E5E8] shadow-sm">
                      {/* Compact Header */}
                      <div className="px-4 py-2 border-b border-[#E3E5E8] bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-[#0077C5]" />
                            <h3 className="text-sm font-semibold text-[#393A3D]">
                              Order Information
                            </h3>
                          </div>
                          <span className="text-xs text-[#DE3618] font-medium">
                            * Required
                          </span>
                        </div>
                      </div>

                      {/* Compact Content */}
                      <div className="p-4">
                        {/* Row 1: Main Fields - 6 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                          {/* Order Date */}
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="date" className="px-1">
                              Order date
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-full bg-white justify-between font-normal"
                                >
                                  {date
                                    ? date.toLocaleDateString()
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    setDate(date);
                                    setOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          {/* Supplier */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Supplier <span className="text-[#DE3618]">*</span>
                            </label>
                            <Select
                              value={formData.customer}
                              onValueChange={handleSupplierChange}
                            >
                              <SelectTrigger
                                className={`h-8 w-full text-xs ${
                                  !formData.customer
                                    ? "border-[#DE3618] focus:border-[#DE3618]"
                                    : "border-[#E3E5E8] focus:border-[#0077C5]"
                                }`}
                              >
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {customers.map((customer) => (
                                  <SelectItem
                                    key={customer.id}
                                    value={customer.id}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-[#EBF4FA] rounded-full flex items-center justify-center">
                                        <span className="text-[10px] font-semibold text-[#0077C5]">
                                          {customer.name.charAt(0)}
                                        </span>
                                      </div>
                                      <span className="text-xs">
                                        {customer.name}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!formData.customer && (
                              <p className="text-[10px] text-[#DE3618] mt-0.5">
                                Required
                              </p>
                            )}
                          </div>

                          {/* Currency */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Currency
                            </label>
                            <div className="relative">
                              <Input
                                value={formData.supplierCurrency || "USD"}
                                readOnly
                                className="h-8 text-xs bg-[#F6F7F9] border-[#E3E5E8] text-[#6B7C93] pr-6"
                              />
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] text-[#2CA01C]">
                                ✓
                              </span>
                            </div>
                          </div>

                          {/* Invoice */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Invoice <span className="text-[#DE3618]">*</span>
                            </label>
                            <div className="flex space-x-1">
                              <Input
                                value={formData.invoice}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    invoice: e.target.value,
                                  }))
                                }
                                placeholder="Enter..."
                                className={`h-8 text-xs flex-1 ${
                                  !formData.invoice
                                    ? "border-[#DE3618] focus:border-[#DE3618]"
                                    : "border-[#E3E5E8] focus:border-[#0077C5]"
                                }`}
                              />
                            </div>
                            {!formData.invoice && (
                              <p className="text-[10px] text-[#DE3618] mt-0.5">
                                Required
                              </p>
                            )}
                          </div>

                          {/* Destination */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Destination
                            </label>
                            <Select
                              value={formData.destination}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  destination: value,
                                }))
                              }
                            >
                              <SelectTrigger className="h-8 w-full text-xs border-[#E3E5E8] focus:border-[#0077C5]">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {destinations.map((destination) => (
                                  <SelectItem
                                    key={destination.id}
                                    value={destination.name}
                                  >
                                    <span className="text-xs">
                                      {destination.name} ({destination.code})
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Destination */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Destination
                            </label>
                            <Select
                              value={formData.destination}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  destination: value,
                                }))
                              }
                            >
                              <SelectTrigger className="h-8 w-full text-xs border-[#E3E5E8] focus:border-[#0077C5]">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {destinations.map((destination) => (
                                  <SelectItem
                                    key={destination.id}
                                    value={destination.name}
                                  >
                                    <span className="text-xs">
                                      {destination.name} ({destination.code})
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Reference */}
                          <div>
                            <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Reference
                            </label>
                            <Input
                              value={formData.orderReference}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  orderReference: e.target.value,
                                }))
                              }
                              placeholder="Optional"
                              className="h-8 text-xs border-[#E3E5E8] focus:border-[#0077C5]"
                            />
                          </div>
                        </div>

                        {/* Row 2: Description - Full Width */}
                        <div>
                          <label className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Description
                          </label>
                          <Input
                            value={formData.description}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Optional notes or description..."
                            className="h-10 text-xs border-[#E3E5E8] focus:border-[#0077C5] w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Compact Product Selection Section */}
                    <div className="bg-white rounded-lg border border-[#E3E5E8] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#FF6900] rounded-full"></div>
                          <h3 className="text-base font-semibold text-[#393A3D]">
                            Product Selection *
                          </h3>
                        </div>
                        <Dialog
                          open={isProductDialogOpen}
                          onOpenChange={setIsProductDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="px-3 py-1 bg-[#F6F7F9] border border-[#E3E5E8] text-[#0077C5] rounded text-xs hover:bg-[#EBF4FA] transition-all duration-200 flex items-center space-x-1">
                              <Search className="w-3 h-3" />
                              <span>Browse Products</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold text-[#393A3D]">
                                Select Products
                              </DialogTitle>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto border border-[#E3E5E8] rounded-lg">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-[#F6F7F9] border-b border-[#E3E5E8]">
                                    <th className="w-12 py-2 px-3 text-left text-[#6B7C93] font-medium text-xs">
                                      Select
                                    </th>
                                    <th className="py-2 px-3 text-left text-[#6B7C93] font-medium text-xs">
                                      Product Name
                                    </th>
                                    <th className="py-2 px-3 text-left text-[#6B7C93] font-medium text-xs">
                                      Design No.
                                    </th>
                                    <th className="py-2 px-3 text-center text-[#6B7C93] font-medium text-xs">
                                      Bale Qty
                                    </th>
                                    <th className="py-2 px-3 text-center text-[#6B7C93] font-medium text-xs">
                                      Pcs/Bale
                                    </th>
                                    <th className="py-2 px-3 text-center text-[#6B7C93] font-medium text-xs">
                                      Total Pcs
                                    </th>
                                    <th className="py-2 px-3 text-center text-[#6B7C93] font-medium text-xs">
                                      Total Yards
                                    </th>
                                    <th className="py-2 px-3 text-right text-[#6B7C93] font-medium text-xs">
                                      Rate/Yard
                                    </th>
                                    <th className="py-2 px-3 text-right text-[#6B7C93] font-medium text-xs">
                                      Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {availableProducts.map((product) => (
                                    <tr
                                      key={product.id}
                                      className={`cursor-pointer hover:bg-[#FAFBFC] transition-colors border-b border-[#F6F7F9] ${
                                        selectedProductIds.has(product.id)
                                          ? "bg-[#EBF4FA] border-[#0077C5]"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleProductSelection(product)
                                      }
                                    >
                                      <td className="py-2 px-3">
                                        <input
                                          type="checkbox"
                                          checked={selectedProductIds.has(
                                            product.id
                                          )}
                                          onChange={() =>
                                            handleProductSelection(product)
                                          }
                                          className="w-3 h-3 text-[#0077C5] border-[#E3E5E8] rounded focus:ring-[#0077C5] focus:ring-1"
                                        />
                                      </td>
                                      <td className="py-2 px-3 font-medium text-[#393A3D] text-xs">
                                        {product.name}
                                      </td>
                                      <td className="py-2 px-3 font-mono text-xs text-[#6B7C93]">
                                        {product.designNo}
                                      </td>
                                      <td className="py-2 px-3 text-center text-[#393A3D] text-xs">
                                        {product.baleQty}
                                      </td>
                                      <td className="py-2 px-3 text-center text-[#393A3D] text-xs">
                                        {product.pcsPerBale}
                                      </td>
                                      <td className="py-2 px-3 text-center font-medium text-[#393A3D] text-xs">
                                        {product.totalQtyPcs.toLocaleString()}
                                      </td>
                                      <td className="py-2 px-3 text-center text-[#393A3D] text-xs">
                                        {product.totalYards.toLocaleString()}
                                      </td>
                                      <td className="py-2 px-3 text-right text-[#393A3D] text-xs">
                                        ${product.ratePerYard.toFixed(2)}
                                      </td>
                                      <td className="py-2 px-3 text-right font-semibold text-[#2CA01C] text-xs">
                                        ${product.value.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <DialogFooter className="border-t border-[#E3E5E8] pt-3">
                              <button
                                onClick={() => setIsProductDialogOpen(false)}
                                className="px-3 py-2 text-[#6B7C93] border border-[#E3E5E8] rounded text-xs hover:bg-[#F6F7F9] transition-all duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveProducts}
                                className="px-4 py-2 bg-[#0077C5] hover:bg-[#005ea3] text-white rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                Save Selection ({selectedProductIds.size} items)
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {selectedProducts.length === 0 ? (
                        <div className="text-center py-6 bg-[#F6F7F9] rounded-lg border-2 border-dashed border-[#E3E5E8]">
                          <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-[#C1C7CD]" />
                          <p className="text-[#6B7C93] font-medium text-xs">
                            No products selected
                          </p>
                          <p className="text-[#C1C7CD] text-xs">
                            Click "Browse Products" to add items
                          </p>
                        </div>
                      ) : (
                        <div className="border border-[#E3E5E8] rounded-lg">
                          <div className="px-3 py-2 border-b border-[#E3E5E8] bg-[#F6F7F9]">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#393A3D]">
                                Selected Products ({selectedProducts.length})
                              </span>
                              <span className="text-xs text-[#2CA01C] font-semibold">
                                Total: $
                                {selectedProducts
                                  .reduce((sum, p) => sum + p.value, 0)
                                  .toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="max-h-32 overflow-y-auto">
                            {selectedProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-2 border-b border-[#F6F7F9] last:border-b-0 hover:bg-[#FAFBFC]"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-[#F6F7F9] rounded border border-[#E3E5E8] flex items-center justify-center">
                                    <Package className="w-3 h-3 text-[#C1C7CD]" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-xs text-[#393A3D]">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs text-[#6B7C93]">
                                      <span>{product.designNo}</span>
                                      <span>•</span>
                                      <span>
                                        {product.totalQtyPcs.toLocaleString()}{" "}
                                        pcs
                                      </span>
                                      <span>•</span>
                                      <span className="text-[#2CA01C] font-semibold">
                                        ${product.value.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    removeSelectedProduct(product.id)
                                  }
                                  className="text-[#C1C7CD] hover:text-[#DE3618] hover:bg-[#FBF2F0] p-1 rounded transition-all duration-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
