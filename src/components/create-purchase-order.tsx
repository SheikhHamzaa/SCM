"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Calculator,
} from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SelectProduct from "./dialog/select-product";

// Types
interface Product {
  id: string;
  name: string;
  designNo: string;
  image: string;
  itemCode: string;
  designCode: string;
  itemType: string;
  category: string;
}

interface ProductWithOrderDetails extends Product {
  uom: string;
  qty: number;
  rate: number;
  amount: number;
}

interface TotalsData {
  grossAmount: number;
  discount: number;
  tax1: number;
  tax2: number;
  tax3: number;
  netAmount: number;
}

interface PurchaseOrder {
  id: string;
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
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  currency: string;
}

interface CreatePurchaseOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: PurchaseOrder) => void;
}

// Form validation schema
const formSchema = z.object({
  customer: z.string().min(1, "Supplier is required"),
  invoice: z.string().min(1, "Invoice number is required"),
  portOfDischarge: z.string().optional(),
  destination: z.string().optional(),
  orderDate: z.date().optional(),
  orderReference: z.string().optional(),
  supplierCurrency: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreatePurchaseOrder: React.FC<CreatePurchaseOrderProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // State management
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductWithOrderDetails[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [open, setOpen] = React.useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [totals, setTotals] = useState<TotalsData>({
    grossAmount: 0,
    discount: 0,
    tax1: 0,
    tax2: 0,
    tax3: 0,
    netAmount: 0,
  });

  // Form setup with react-hook-form and zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      invoice: "",
      portOfDischarge: "",
      destination: "",
      orderDate: undefined,
      orderReference: "",
      supplierCurrency: "",
      description: "",
    },
  });

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

  const availableProducts: Product[] = [
    {
      id: "1",
      name: "Cotton Fabric - Premium",
      designNo: "CTN-001",
      image: "/products/p1.jpg",
      itemCode: "CTN-001",
      designCode: "D001",
      itemType: "fabric",
      category: "cotton",
    },
    {
      id: "2",
      name: "Silk Blend - Luxury",
      designNo: "SLK-002",
      image: "/products/p2.jpg",
      itemCode: "SLK-002",
      designCode: "D002",
      itemType: "fabric",
      category: "silk",
    },
    {
      id: "3",
      name: "Denim - Heavy Duty",
      designNo: "DNM-003",
      image: "/products/p3.jpg",
      itemCode: "DNM-003",
      designCode: "D003",
      itemType: "fabric",
      category: "denim",
    },
    {
      id: "4",
      name: "Polyester - Water Resistant",
      designNo: "PLY-004",
      image: "/products/p4.jpg",
      itemCode: "PLY-004",
      designCode: "D004",
      itemType: "fabric",
      category: "polyester",
    },
  ];

  const uomOptions = [
    { value: "pcs", label: "Pcs" },
    { value: "pkt", label: "Pkt" },
    { value: "bale", label: "Bale" },
  ];

  // Reset form when component opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      resetForm();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    form.reset({
      customer: "",
      invoice: "",
      destination: "",
      portOfDischarge: "",
      orderDate: undefined,
      orderReference: "",
      supplierCurrency: "",
      description: "",
    });
    setSelectedProducts([]);
    setSelectedProductIds(new Set());
    setTotals({
      grossAmount: 0,
      discount: 0,
      tax1: 0,
      tax2: 0,
      tax3: 0,
      netAmount: 0,
    });

  };

  const handleProductSelection = (product: Product) => {
    const newSelectedIds = new Set(selectedProductIds);

    if (selectedProductIds.has(product.id)) {
      newSelectedIds.delete(product.id);
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      newSelectedIds.add(product.id);
      const productWithDetails: ProductWithOrderDetails = {
        ...product,
        uom: "yards",
        qty: 1,
        rate: 0,
        amount: 0,
      };
      setSelectedProducts((prev) => [...prev, productWithDetails]);
    }

    setSelectedProductIds(newSelectedIds);
  };

  const handleSaveProducts = (products: Product[]) => {
    const productsWithDetails: ProductWithOrderDetails[] = products.map((product) => ({
      ...product,
      uom: "yards",
      qty: 1,
      rate: 0,
      amount: 0,
    }));
    setSelectedProducts(productsWithDetails);
    setSelectedProductIds(new Set(products.map(p => p.id)));
    setIsProductDialogOpen(false);
  };

  const updateProductDetails = (productId: string, field: keyof ProductWithOrderDetails, value: any) => {
    setSelectedProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const updatedProduct = { ...product, [field]: value };
          // Calculate amount when qty or rate changes
          if (field === 'qty' || field === 'rate') {
            updatedProduct.amount = updatedProduct.qty * updatedProduct.rate;
          }
          return updatedProduct;
        }
        return product;
      })
    );
  };

  // Handle supplier selection and auto-fill currency
  const handleSupplierChange = (supplierId: string) => {
    const selectedSupplier = customers.find((c) => c.id === supplierId);
    form.setValue("customer", supplierId);
    form.setValue("supplierCurrency", selectedSupplier?.currency || "");
  };

  const handleSavePurchaseOrder = (data: FormData) => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === data.customer);

    // Calculate totals from selected products
    const totalQty = selectedProducts.reduce((sum, p) => sum + p.qty, 0);
    const finalTotals = calculateTotals();
    const totalValue = finalTotals.netAmount; // Use net amount instead of gross
    const avgRate = totalValue / totalQty || 0;

    const productNames = selectedProducts.map((p) => p.name).join(", ");
    const designNumbers = selectedProducts.map((p) => p.designNo).join(", ");

    const newOrder: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      destination: data.destination || "N/A",
      portOfDischarge: data.portOfDischarge || "N/A",
      orderDate:
        data.orderDate?.toISOString().split("T")[0] ||
        new Date().toISOString().split("T")[0],
      orderReference: data.orderReference || `REF-${Date.now()}`,
      supplier: selectedCustomer?.name || "N/A",
      item:
        selectedProducts.length === 1
          ? selectedProducts[0].name
          : `${selectedProducts.length} Products: ${productNames}`,
      designNo:
        selectedProducts.length === 1
          ? selectedProducts[0].designNo
          : designNumbers,
      image: selectedProducts[0].image,
      baleQty: selectedProducts.length,
      pcsPerBale: Math.round(totalQty / selectedProducts.length),
      totalQtyPcs: totalQty,
      totalYards: totalQty,
      ratePerYard: avgRate,
      value: totalValue,
    };

    onSave(newOrder);
    onClose();
  };

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((sum, p) => sum + p.amount, 0);
  };

  // Calculate totals including gross amount, discount, and taxes
  const calculateTotals = () => {
    const grossAmount = getTotalAmount();
    const netAmount = grossAmount - totals.discount + totals.tax1 + totals.tax2 + totals.tax3;
    return { ...totals, grossAmount, netAmount };
  };

  const updateTotals = (field: keyof TotalsData, value: number) => {
    const updatedTotals = { ...totals, [field]: value };
    const grossAmount = getTotalAmount();
    const netAmount = grossAmount - updatedTotals.discount + updatedTotals.tax1 + updatedTotals.tax2 + updatedTotals.tax3;
    setTotals({ ...updatedTotals, grossAmount, netAmount });
  };

  // Update gross amount whenever products change
  useEffect(() => {
    const grossAmount = getTotalAmount();
    const netAmount = grossAmount - totals.discount + totals.tax1 + totals.tax2 + totals.tax3;
    setTotals(prev => ({ ...prev, grossAmount, netAmount }));
  }, [selectedProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Compact QuickBooks Header */}
      <div className="bg-white border-b border-[#E1E5E9] px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="text-[#5A5A5A] hover:text-[#2E2E2E] p-1.5 rounded hover:bg-[#F3F4F6] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[#2E2E2E]">
                Create Purchase Order
              </h1>
              <p className="text-[#707070] text-xs">
                Fill in the details below to create a new purchase order
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[#5A5A5A] border border-[#D1D5DB] rounded text-sm hover:bg-[#F9FAFB] transition-all duration-200"
            >
              Cancel
            </button>
            <Button
            variant="default"
              onClick={form.handleSubmit(handleSavePurchaseOrder)}
              disabled={
                !form.watch("customer") ||
                !form.watch("invoice") ||
                selectedProducts.length === 0
              }
            >
              Create Order
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <div className="h-full flex">
          <div className="w-full border-r border-[#E1E5E9] overflow-y-auto bg-[#F8F9FA]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSavePurchaseOrder)}
                className="p-3"
              >
                <div className="space-y-3">
                  {/* Compact Order Information Section */}
                  <div className="bg-white rounded border border-[#E1E5E9] shadow-sm">
                    {/* Compact Header */}
                    <div className="px-4 py-2.5 border-b border-[#E1E5E9] bg-[#F8F9FA]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#0176D3] rounded flex items-center justify-center">
                            <Package className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-sm font-semibold text-[#2E2E2E]">
                            Order Information
                          </h3>
                        </div>
                        <span className="text-xs text-[#D73502] font-medium">
                          * Required
                        </span>
                      </div>
                    </div>

                    {/* Compact Form Content */}
                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 mb-3">
                        {/* Order Date */}
                        <FormField
                          control={form.control}
                          name="orderDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Order date <span className="text-[#D73502]">*</span>
                              </FormLabel>
                              <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full bg-white justify-between font-normal h-7 border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] text-xs px-2"
                                    >
                                      {field.value
                                        ? field.value.toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon className="w-3 h-3 text-[#5A5A5A]" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto overflow-hidden p-0 shadow-lg border-[#D1D5DB]"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                      field.onChange(date);
                                      setOpen(false);
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Supplier */}
                        <FormField
                          control={form.control}
                          name="customer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Supplier <span className="text-[#D73502]">*</span>
                              </FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleSupplierChange(value);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-7 w-full text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white px-2">
                                    <SelectValue placeholder="Choose..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="shadow-lg border-[#D1D5DB]">
                                  {customers.map((customer) => (
                                    <SelectItem
                                      key={customer.id}
                                      value={customer.id}
                                      className="hover:bg-[#F3F4F6] text-xs py-1"
                                    >
                                      <div className="flex items-center space-x-1.5">
                                        <div className="w-3 h-3 bg-[#0176D3] rounded-full flex items-center justify-center">
                                          <span className="text-[10px] font-semibold text-white">
                                            {customer.name.charAt(0)}
                                          </span>
                                        </div>
                                        <span className="text-xs font-medium">
                                          {customer.name}
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

                        {/* Currency */}
                        <FormField
                          control={form.control}
                          name="supplierCurrency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Currency
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    value={field.value || "USD"}
                                    readOnly
                                    className="h-7 text-xs bg-[#F8F9FA] cursor-not-allowed border-[#D1D5DB] text-[#5A5A5A] pr-6 px-2"
                                  />
                                  <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-[#10B981] rounded-full flex items-center justify-center">
                                    <span className="text-[10px] text-white font-bold">✓</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Invoice */}
                        <FormField
                          control={form.control}
                          name="invoice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Invoice <span className="text-[#D73502]">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter..."
                                  className="h-7 text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white px-2"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Port of Discharge */}
                        <FormField
                          control={form.control}
                          name="portOfDischarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Port of Discharge
                              </FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 w-full text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="shadow-lg border-[#D1D5DB]">
                                  {destinations.map((destination) => (
                                    <SelectItem
                                      key={destination.id}
                                      value={destination.name}
                                      className="hover:bg-[#F3F4F6]"
                                    >
                                      <span className="text-xs">
                                        {destination.name} ({destination.code})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Destination */}
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Destination
                              </FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 w-full text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="shadow-lg border-[#D1D5DB]">
                                  {destinations.map((destination) => (
                                    <SelectItem
                                      key={destination.id}
                                      value={destination.name}
                                      className="hover:bg-[#F3F4F6]"
                                    >
                                      <span className="text-xs">
                                        {destination.name} ({destination.code})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Reference */}
                        <FormField
                          control={form.control}
                          name="orderReference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#2E2E2E] mb-1 block">
                                Reference
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Optional..."
                                  className="h-8 text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 2: Description - Compact */}
                      <div className="mt-3">
                        {!showDescription ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-xs text-[#0176D3] hover:text-[#014F86] hover:bg-[#F3F4F6] p-1.5 rounded h-7"
                            onClick={() => setShowDescription(true)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Note
                          </Button>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-[#2E2E2E]">
                                Note
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowDescription(false)}
                                className="text-[#DC2626] text-xs hover:bg-[#FEF2F2] p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Add note..."
                                      className="h-8 text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Product Selection Section */}
                  <div className="bg-white rounded border border-[#E1E5E9] shadow-sm">
                    <div className="px-4 py-2.5 border-b border-[#E1E5E9] bg-[#F8F9FA]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#059669] rounded flex items-center justify-center">
                            <ShoppingCart className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-sm font-semibold text-[#2E2E2E]">
                            Products
                          </h3>
                        </div>
                        <Button 
                          type="button"
                          onClick={() => setIsProductDialogOpen(true)}
                          className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1"
                        >
                          <Search className="w-3 h-3" />
                          <span>Browse</span>
                        </Button>
                      </div>
                    </div>

                    {selectedProducts.length === 0 ? (
                      <div className="text-center py-16 bg-gradient-to-b from-[#FAFBFC] to-white">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-[#9CA3AF]" />
                        </div>
                        <h4 className="text-[#2E2E2E] font-semibold text-sm mb-1.5">
                          No products selected
                        </h4>
                        <p className="text-[#707070] text-xs mb-3 max-w-xs mx-auto">
                          Start building your purchase order by browsing and selecting products from your inventory.
                        </p>
                        <Button 
                          type="button"
                          onClick={() => setIsProductDialogOpen(true)}
                          className="px-4 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md mx-auto"
                        >
                          <Search className="w-3 h-3" />
                          <span>Browse Products</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        {/* Enhanced QuickBooks-style Product Table */}
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#F8F9FA] to-[#F3F4F6] border-b border-[#E1E5E9]">
                              <th className="text-left py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[12%]">
                                Item Code
                              </th>
                              <th className="text-left py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[12%]">
                                Design Code
                              </th>
                              <th className="text-left py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[25%]">
                                Product Name
                              </th>
                              <th className="text-left py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[10%]">
                                UOM
                              </th>
                              <th className="text-center py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[12%]">
                                Quantity
                              </th>
                              <th className="text-center py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[12%]">
                                Rate
                              </th>
                              <th className="text-right py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[15%]">
                                Amount
                              </th>
                              <th className="text-center py-2 px-3 text-[#5A5A5A] font-semibold text-xs w-[8%]">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProducts.map((product, index) => (
                              <tr 
                                key={product.id} 
                                className={`border-b border-[#E1E5E9] hover:bg-[#F8F9FA] transition-colors duration-200 ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'
                                }`}
                              >
                                {/* Item Code */}
                                <td className="py-4 px-4">
                                  <span className="text-sm font-medium text-[#2E2E2E] block truncate" title={product.itemCode}>
                                    {product.itemCode}
                                  </span>
                                </td>
                                
                                {/* Design Code */}
                                <td className="py-4 px-4">
                                  <span className="text-sm text-[#707070] block truncate" title={product.designCode}>
                                    {product.designCode}
                                  </span>
                                </td>
                                
                                {/* Product Name */}
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-lg border border-[#D1D5DB] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (nextElement) {
                                            nextElement.style.display = 'block';
                                          }
                                        }}
                                      />
                                      <Package className="w-5 h-5 text-[#9CA3AF] hidden" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className="text-sm font-medium text-[#2E2E2E] block truncate" title={product.name}>
                                        {product.name}
                                      </span>
                                      <span className="text-xs text-[#707070] block truncate" title={product.designNo}>
                                        Design: {product.designNo}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                
                                {/* UOM Select */}
                                <td className="py-4 px-4">
                                  <Select
                                    value={product.uom}
                                    onValueChange={(value) => updateProductDetails(product.id, 'uom', value)}
                                  >
                                    <SelectTrigger className="h-9 w-full text-sm border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20 bg-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-lg border-[#D1D5DB]">
                                      {uomOptions.map((uom) => (
                                        <SelectItem key={uom.value} value={uom.value} className="hover:bg-[#F3F4F6] focus:bg-[#F3F4F6]">
                                          <span className="text-sm">{uom.label}</span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                
                                {/* Quantity Input */}
                                <td className="py-4 px-4">
                                  <Input
                                    type="number"
                                    value={product.qty}
                                    onChange={(e) => updateProductDetails(product.id, 'qty', parseFloat(e.target.value) || 0)}
                                    className="h-9 text-sm border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20 text-center bg-white font-medium"
                                    min="0"
                                    step="0.01"
                                  />
                                </td>
                                
                                {/* Rate Input */}
                                <td className="py-4 px-4">
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#707070] font-medium">$</span>
                                    <Input
                                      type="number"
                                      value={product.rate}
                                      onChange={(e) => updateProductDetails(product.id, 'rate', parseFloat(e.target.value) || 0)}
                                      className="h-9 text-sm border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20 text-right bg-white pl-8 font-medium"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                </td>
                                
                                {/* Amount Display */}
                                <td className="py-4 px-4">
                                  <div className="text-right">
                                    <span className="text-sm font-semibold text-[#10B981] bg-[#F0FDF4] px-3 py-1 rounded-full">
                                      ${product.amount.toFixed(2)}
                                    </span>
                                  </div>
                                </td>
                                
                                {/* Remove Button */}
                                <td className="py-4 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeSelectedProduct(product.id)}
                                    className="text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] p-2 rounded-lg transition-all duration-200 group"
                                    title="Remove product"
                                  >
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Enhanced Summary Row */}
                        <div className="bg-gradient-to-r from-[#F8F9FA] to-white border-t border-[#E1E5E9] px-6 py-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                              <div className="text-sm text-[#5A5A5A]">
                                <span className="font-medium">Total Items:</span>
                                <span className="ml-2 font-semibold text-[#2E2E2E]">{selectedProducts.length}</span>
                              </div>
                              <div className="text-sm text-[#5A5A5A]">
                                <span className="font-medium">Total Quantity:</span>
                                <span className="ml-2 font-semibold text-[#2E2E2E]">
                                  {selectedProducts.reduce((sum, p) => sum + p.qty, 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-[#5A5A5A] mb-1">Subtotal</div>
                              <div className="text-xl font-bold text-[#2E2E2E]">
                                ${getTotalAmount().toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Totals Section - QuickBooks Style */}
                  {selectedProducts.length > 0 && (
                    <div className="bg-white rounded-lg border border-[#E3E5E8] shadow-sm">
                      <div className="px-4 py-3 border-b border-[#E3E5E8] bg-[#F6F7F9]">
                        <div className="flex items-center space-x-2">
                          <Calculator className="w-4 h-4 text-[#0077C5]" />
                          <h3 className="text-sm font-semibold text-[#393A3D]">
                            Order Totals
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column - Calculations */}
                          <div className="space-y-3">
                            {/* Gross Amount (Read-only) */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-sm font-medium text-[#393A3D]">
                                Gross Amount
                              </label>
                              <Input
                                type="text"
                                value={`$${calculateTotals().grossAmount.toFixed(2)}`}
                                readOnly
                                className="h-9 text-sm bg-[#F6F7F9] cursor-not-allowed border-[#E3E5E8] text-[#6B7C93] text-right font-semibold"
                              />
                            </div>

                            {/* Discount */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-sm font-medium text-[#393A3D]">
                                Discount
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#6B7C93]">$</span>
                                <Input
                                  type="number"
                                  value={totals.discount}
                                  onChange={(e) => updateTotals('discount', parseFloat(e.target.value) || 0)}
                                  className="h-9 text-sm border-[#E3E5E8] focus:border-[#0077C5] pl-6 text-right"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            {/* Tax 1 */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-sm font-medium text-[#393A3D]">
                                Tax 1
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#6B7C93]">$</span>
                                <Input
                                  type="number"
                                  value={totals.tax1}
                                  onChange={(e) => updateTotals('tax1', parseFloat(e.target.value) || 0)}
                                  className="h-9 text-sm border-[#E3E5E8] focus:border-[#0077C5] pl-6 text-right"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            {/* Tax 2 */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-sm font-medium text-[#393A3D]">
                                Tax 2
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#6B7C93]">$</span>
                                <Input
                                  type="number"
                                  value={totals.tax2}
                                  onChange={(e) => updateTotals('tax2', parseFloat(e.target.value) || 0)}
                                  className="h-9 text-sm border-[#E3E5E8] focus:border-[#0077C5] pl-6 text-right"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            {/* Tax 3 */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-sm font-medium text-[#393A3D]">
                                Tax 3
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#6B7C93]">$</span>
                                <Input
                                  type="number"
                                  value={totals.tax3}
                                  onChange={(e) => updateTotals('tax3', parseFloat(e.target.value) || 0)}
                                  className="h-9 text-sm border-[#E3E5E8] focus:border-[#0077C5] pl-6 text-right"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Net Amount Summary */}
                          <div className="bg-[#F6F7F9] rounded-lg p-4 border border-[#E3E5E8]">
                            <div className="text-center">
                              <p className="text-sm font-medium text-[#6B7C93] mb-2">Net Amount</p>
                              <div className="text-2xl font-bold text-[#2CA01C] mb-4">
                                ${calculateTotals().netAmount.toFixed(2)}
                              </div>
                              
                              {/* Calculation Breakdown */}
                              <div className="text-xs text-[#6B7C93] space-y-1">
                                <div className="flex justify-between">
                                  <span>Gross Amount:</span>
                                  <span>${calculateTotals().grossAmount.toFixed(2)}</span>
                                </div>
                                {totals.discount > 0 && (
                                  <div className="flex justify-between text-[#DE3618]">
                                    <span>Discount:</span>
                                    <span>-${totals.discount.toFixed(2)}</span>
                                  </div>
                                )}
                                {(totals.tax1 > 0 || totals.tax2 > 0 || totals.tax3 > 0) && (
                                  <div className="flex justify-between text-[#0077C5]">
                                    <span>Total Taxes:</span>
                                    <span>+${(totals.tax1 + totals.tax2 + totals.tax3).toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="border-t border-[#E3E5E8] pt-2 mt-2">
                                  <div className="flex justify-between font-semibold text-sm text-[#393A3D]">
                                    <span>Net Amount:</span>
                                    <span>${calculateTotals().netAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Selection Dialog */}
                  <SelectProduct
                    isOpen={isProductDialogOpen}
                    onClose={() => setIsProductDialogOpen(false)}
                    onSave={handleSaveProducts}
                    availableProducts={availableProducts}
                    selectedProductIds={selectedProductIds}
                    onProductSelection={handleProductSelection}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
