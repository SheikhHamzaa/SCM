import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Barcode from "react-barcode-generator";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Upload, X } from "lucide-react";

// Form validation schema
const productFormSchema = z.object({
  code: z
    .string()
    .min(1, "Product code is required")
    .max(10, "Product code must be 10 characters or less")
    .regex(
      /^[A-Z0-9]+$/,
      "Product code must contain only uppercase letters and numbers"
    ),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  designNo: z.string().min(1, "Design number is required"),
  finalDestination: z.string().min(1, "Final destination is required"),
  itemType: z.string().min(1, "Item type is required"),
  itemCategory: z.string().min(1, "Item category is required"),
  yard: z.number().min(0, "Yard must be a positive number"),
  smallestUOM: z.string().min(1, "Smallest UOM is required"),
  intermediateUOM: z.string().min(1, "Intermediate UOM is required"),
  masterUOM: z.string().min(1, "Master UOM is required"),
  pcsToIntermediateRatio: z
    .number()
    .min(1, "Conversion ratio must be at least 1"),
  pcsToMasterRatio: z.number().min(1, "Conversion ratio must be at least 1"),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Product {
  id: number;
  code: string;
  title: string;
  designNo: string;
  finalDestination: string;
  itemType: string;
  itemCategory: string;
  yard: number;
  smallestUOM: string;
  intermediateUOM: string;
  masterUOM: string;
  pcsToIntermediateRatio: number;
  pcsToMasterRatio: number;
  image?: string;
  createdAt: Date;
}

interface ProductDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: {
    code: string;
    title: string;
    designNo: string;
    finalDestination: string;
    itemType: string;
    itemCategory: string;
    yard: number;
    smallestUOM: string;
    intermediateUOM: string;
    masterUOM: string;
    pcsToIntermediateRatio: number;
    pcsToMasterRatio: number;
    image?: string;
  }) => void;
  editingProduct?: Product | null;
  triggerButton?: React.ReactElement;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingProduct = null,
  triggerButton,
}) => {
  const uomOptions = ["pcs", "pkt", "bail"];
  const destination = ["Mozambique", "Zambia"];
  const itemType = ["Polyster", "Cotton"];
  const itemCategory = ["A quality", "B quality", "C quality"];
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: "",
      title: "",
      designNo: "",
      finalDestination: "",
      itemType: "",
      itemCategory: "",
      yard: 0,
      smallestUOM: "pcs",
      intermediateUOM: "pkt",
      masterUOM: "bail",
      pcsToIntermediateRatio: 10,
      pcsToMasterRatio: 100,
      image: "",
    },
  });

  // Watch designNo for barcode generation
  const designNo = form.watch("designNo");

  // Watch values for conversion calculations
  const watchedValues = form.watch([
    "yard",
    "pcsToIntermediateRatio",
    "pcsToMasterRatio",
    "smallestUOM",
    "intermediateUOM",
    "masterUOM",
  ]);
  const [
    yard,
    pcsToIntermediateRatio,
    pcsToMasterRatio,
    smallestUOM,
    intermediateUOM,
    masterUOM,
  ] = watchedValues;

  // Calculate conversions
  const intermediateQuantity =
    yard && pcsToIntermediateRatio
      ? Math.floor(yard / pcsToIntermediateRatio)
      : 0;
  const masterQuantity =
    yard && pcsToMasterRatio ? Math.floor(yard / pcsToMasterRatio) : 0;

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("image", "");
  };

  // Reset form when drawer opens/closes or when editing changes
  useEffect(() => {
    if (isDrawerOpen) {
      if (editingProduct) {
        form.reset({
          code: editingProduct.code,
          title: editingProduct.title,
          designNo: editingProduct.designNo,
          finalDestination: editingProduct.finalDestination,
          itemType: editingProduct.itemType,
          itemCategory: editingProduct.itemCategory,
          yard: editingProduct.yard,
          smallestUOM: editingProduct.smallestUOM,
          intermediateUOM: editingProduct.intermediateUOM,
          masterUOM: editingProduct.masterUOM,
          pcsToIntermediateRatio: editingProduct.pcsToIntermediateRatio,
          pcsToMasterRatio: editingProduct.pcsToMasterRatio,
          image: editingProduct.image || "",
        });
        setImagePreview(editingProduct.image || null);
      } else {
        form.reset({
          code: "",
          title: "",
          designNo: "",
          finalDestination: "",
          itemType: "",
          itemCategory: "",
          yard: 0,
          smallestUOM: "pcs",
          intermediateUOM: "pkt",
          masterUOM: "bail",
          pcsToIntermediateRatio: 10,
          pcsToMasterRatio: 100,
          image: "",
        });
        setImagePreview(null);
      }
    }
  }, [isDrawerOpen, editingProduct, form]);

  const onSubmit = (data: ProductFormValues) => {
    onSave(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    setImagePreview(null);
    setIsDrawerOpen(false);
  };

  return (
    <Drawer
      direction="right"
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
    >
      <DrawerTrigger asChild>
        {triggerButton || (
          <Button className="bg-[#0077C5] hover:bg-[#005A94] text-white text-sm px-3 py-1.5 h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Product
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-72 border-l border-gray-200 h-screen flex flex-col">
        <div className="flex flex-col h-full min-h-0">
          <DrawerHeader className="border-b border-gray-300 px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-lg font-semibold text-[#393A3D]">
                  {editingProduct ? "Edit Product" : "New Product"}
                </DrawerTitle>
                <DrawerDescription className="text-xs text-[#6B7280]">
                  {editingProduct
                    ? "Update product details"
                    : "Enter product details"}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full"
                >
                  <span className="text-lg">×</span>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full min-h-0"
            >
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="px-6 py-4 space-y-4">
                  {/* Basic Information Section */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Product Code *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PROD001"
                              {...field}
                              className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                                form.formState.errors.code
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              maxLength={10}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Design No *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="DSN-001"
                              {...field}
                              className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                                form.formState.errors.designNo
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                          Product Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Premium Cotton Fabric"
                            {...field}
                            className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                              form.formState.errors.title
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Product Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                          Product Image
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {imagePreview ? (
                              <div className="relative">
                                <img
                                  src={imagePreview}
                                  alt="Product preview"
                                  className="w-full h-20 object-contain rounded-lg border border-[#D1D5DB] bg-gray-50"
                                />
                                <Button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute top-1 right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="relative border-2 border-dashed border-[#D1D5DB] rounded-lg p-3 text-center hover:border-[#0077C5] transition-colors cursor-pointer h-20 flex flex-col items-center justify-center">
                                <Upload className="h-6 w-6 mx-auto text-[#6B7280] mb-1" />
                                <p className="text-xs text-[#6B7280] mb-1">
                                  Upload image
                                </p>
                                <p className="text-xs text-[#9CA3AF]">
                                  PNG, JPG (5MB)
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="yard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Yards
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                                form.formState.errors.yard
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              min="0"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="finalDestination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Final Destination *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[18vw] w-[40vw] bg-white transition-all duration-200">
                                <SelectValue placeholder="Select destination" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {destination.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Category & Classification Section */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="itemType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Item Type *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[18vw] w-[40vw] bg-white transition-all duration-200">
                                <SelectValue placeholder="Select item type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {itemType.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="itemCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                            Item Category *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[18vw] w-[40vw] bg-white transition-all duration-200">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {itemCategory.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* UOM Configuration Section */}
                <div className="space-y-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="smallestUOM"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Smallest UOM *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[9vw] w-[20vw] bg-white transition-all duration-200">
                                  <SelectValue placeholder="Select UOM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {uomOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="intermediateUOM"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Intermediate UOM *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[9vw] w-[20vw] bg-white transition-all duration-200">
                                  <SelectValue placeholder="Select UOM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {uomOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="masterUOM"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                              Master UOM *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[9vw] w-[20vw] bg-white transition-all duration-200">
                                  <SelectValue placeholder="Select UOM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {uomOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600 text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Conversion Ratios */}
                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <h4 className="text-xs font-medium text-[#6B7280] mb-2 uppercase tracking-wide">
                        Conversion Ratios
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="pcsToIntermediateRatio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                                {smallestUOM} → {intermediateUOM} *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                                    form.formState.errors.pcsToIntermediateRatio
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                  min="1"
                                />
                              </FormControl>
                              <p className="text-xs text-[#6B7280] mt-1">
                                1 {intermediateUOM} = {pcsToIntermediateRatio}{" "}
                                {smallestUOM}
                              </p>
                              <FormMessage className="text-red-600 text-xs mt-1" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pcsToMasterRatio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                                {smallestUOM} → {masterUOM} *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className={`border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 bg-white transition-all duration-200 ${
                                    form.formState.errors.pcsToMasterRatio
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                  min="1"
                                />
                              </FormControl>
                              <p className="text-xs text-[#6B7280] mt-1">
                                1 {masterUOM} = {pcsToMasterRatio} {smallestUOM}
                              </p>
                              <FormMessage className="text-red-600 text-xs mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Conversion Display */}
                {yard > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-1 h-4 bg-[#16A34A] rounded-full"></div>
                      <h3 className="text-xs font-semibold text-[#393A3D] uppercase tracking-wide">
                        Live Conversion
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-[#EFF6FF] via-[#F0F9FF] to-[#E0F2FE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0077C5] to-[#005A94] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-xs font-bold">
                            ≈
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#1E40AF] mb-2">
                            {yard.toLocaleString()} {smallestUOM} converts to:
                          </div>
                          <div className="space-y-2 text-xs text-[#374151]">
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 border border-white/50">
                              <span className="font-medium text-[#374151]">
                                {intermediateUOM}:
                              </span>
                              <div className="text-right">
                                <span className="text-[#059669] font-bold text-sm">
                                  {intermediateQuantity.toLocaleString()}
                                </span>
                                {yard % pcsToIntermediateRatio > 0 && (
                                  <div className="text-[#6B7280] text-xs">
                                    + {yard % pcsToIntermediateRatio}{" "}
                                    {smallestUOM} remaining
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 border border-white/50">
                              <span className="font-medium text-[#374151]">
                                {masterUOM}:
                              </span>
                              <div className="text-right">
                                <span className="text-[#059669] font-bold text-sm">
                                  {masterQuantity.toLocaleString()}
                                </span>
                                {yard % pcsToMasterRatio > 0 && (
                                  <div className="text-[#6B7280] text-xs">
                                    + {yard % pcsToMasterRatio} {smallestUOM}{" "}
                                    remaining
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

                {/* Barcode Section */}
                {designNo && (
                  <div className="border-t border-[#E5E7EB] px-0 py-3 bg-[#FAFBFC] mx-0 mt-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2 px-4">
                      <h4 className="text-xs font-medium text-[#393A3D] uppercase tracking-wide">
                        Generated Barcode
                      </h4>
                      <span className="text-xs text-[#6B7280]">
                        Design: {designNo}
                      </span>
                    </div>
                    <div className="flex justify-center px-4">
                      <div className="bg-white p-2 rounded border border-[#D1D5DB] shadow-sm">
                        <Barcode
                          value={designNo}
                          format="CODE128"
                          width={1.5}
                          height={40}
                          displayValue={true}
                          fontSize={10}
                          background="#ffffff"
                          lineColor="#000000"
                        />
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>

              <DrawerFooter className="border-t border-[#E5E7EB] px-6 py-3 bg-[#F8F9FA] flex-shrink-0">
                <div className="flex items-center justify-between space-x-3">
                  <div className="text-xs text-[#6B7280]">
                    * Required fields
                  </div>
                  <div className="flex space-x-3">
                    <DrawerClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] hover:border-[#9CA3AF] h-8 px-4 text-xs font-medium transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                    <Button
                      type="submit"
                      className="bg-[#0077C5] hover:bg-[#005A94] text-white h-8 px-6 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {editingProduct ? "Save Changes" : "Save Product"}
                    </Button>
                  </div>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDrawer;
