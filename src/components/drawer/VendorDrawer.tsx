import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const vendorFormSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  venType: z.string().min(1, "Vendor type is required"), 
  vendorCode: z
    .string()
    .min(1, "Vendor code is required")
    .max(10, "Vendor code must be 10 characters or less")
    .regex(
      /^[A-Z0-9]+$/,
      "Vendor code must contain only uppercase letters and numbers"
    ),
  vendorName: z
    .string()
    .min(1, "Vendor name is required")
    .min(2, "Vendor name must be at least 2 characters"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface Vendor {
  id: number;
  currency: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  createdAt: Date;
}

interface VendorDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: Omit<Vendor, "id" | "createdAt">) => void;
  editingVendor?: Vendor | null;
  triggerButton?: React.ReactElement;
}

const VendorDrawer: React.FC<VendorDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingVendor = null,
  triggerButton,
}) => {
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      currency: "",
      vendorCode: "",
      vendorName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isDrawerOpen) {
      if (editingVendor) {
        form.reset({
          currency: editingVendor.currency,
          vendorCode: editingVendor.vendorCode,
          vendorName: editingVendor.vendorName,
          contactPerson: editingVendor.contactPerson,
          email: editingVendor.email,
          phone: editingVendor.phone,
          address: editingVendor.address,
          city: editingVendor.city,
          country: editingVendor.country,
          notes: editingVendor.notes || "",
        });
      } else {
        form.reset({
          currency: "",
          vendorCode: "",
          vendorName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          notes: "",
        });
      }
    }
  }, [isDrawerOpen, editingVendor, form]);

  // Common currencies for the select dropdown
  const commonCurrencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "PKR" },
    { code: "ZMW", name: "Zambian Kwacha", symbol: "ZMW" },
    { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ];
const vendorTypes = [
    { code: "Trade", name: "Trade" },
    { code: "No Trade", name: "No Trade" },
  ];
  const onSubmit = (data: VendorFormValues) => {
    onSave(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
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
            New Vendor
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-96 border-l border-gray-200">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-gray-200 px-4 py-3">
            <DrawerTitle className="text-base font-semibold text-gray-900">
              {editingVendor ? "Edit Vendor" : "Vendor Information"}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-gray-600">
              {editingVendor ? "Update vendor details" : "Enter vendor details"}
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
                {/* Currency Selection */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-900">
                        Currency *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`border-gray-300 w-full focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.currency
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select currency..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commonCurrencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.code} - {curr.name} ({curr.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="vendorCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Vendor Code *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., VEND001"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.vendorCode
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
                    name="vendorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Vendor Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., ABC Suppliers"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.vendorName
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
                <div className="grid grid-cols-2 gap-2">
                  {/* Contact Information */}
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Contact Person *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., John Smith"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.contactPerson
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                  control={form.control}
                  name="venType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                        Vendor Type *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 md:w-[18vw] w-[40vw] bg-white transition-all duration-200">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vendorTypes.map((option) => (
                            <SelectItem key={option.code} value={option.code}>
                              {option.name }
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="e.g., john@supplier.com"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Phone *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., +1234567890"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.phone
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

                {/* Address Information */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-900">
                        Address *
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter full address"
                          {...field}
                          className={`w-full border border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm rounded-md p-2 min-h-[50px] resize-none ${
                            form.formState.errors.address
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          City *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., New York"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.city
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Country *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., United States"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.country
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

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-900">
                        Notes
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter additional notes (optional)"
                          {...field}
                          className="w-full border border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm rounded-md p-2 min-h-[50px] resize-none"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <DrawerFooter className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="bg-[#0077C5] hover:bg-[#005A94] text-white flex-1 h-8 text-sm"
                  >
                    {editingVendor ? "Save Changes" : "Save"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-sm"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VendorDrawer;
