"use client";

import React from "react";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

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

interface ShipmentDetailsFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  shippingLines: ShippingLine[];
  consignees: Consignee[];
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const ShipmentDetailsInventory: React.FC<ShipmentDetailsFormProps> = ({
  form,
  shippingLines,
  consignees,
  isLoading,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-md border border-[#E1E5E9] shadow-sm animate-in slide-in-from-top-6 duration-700">
      <div className="px-2.5 py-1.5 border-b border-[#E1E5E9] bg-[#FAFBFC]">
        <h3 className="text-xs font-semibold text-[#2E2E2E] uppercase tracking-wide">
          Shipping Information
        </h3>
      </div>
      <div className="p-2.5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            {/* User Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <FormField
                control={form.control}
                name="shippingLineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                      Shipping Line <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                          <SelectValue placeholder="Select shipping line" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shippingLines.map((line) => (
                          <SelectItem key={line.id} value={line.id}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-xs">{line.code}</span>
                              <span className="text-gray-500 text-xs">- {line.title}</span>
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
                name="consigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                      Consignee <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                          <SelectValue placeholder="Select consignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consignees.map((consignee) => (
                          <SelectItem key={consignee.id} value={consignee.id}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-xs">{consignee.code}</span>
                              <span className="text-gray-500 text-xs">- {consignee.title}</span>
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
                      Container Type <span className="text-red-500">*</span>
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
                name="billOfLading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                      Bill of Lading <span className="text-red-500">*</span>
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
                name="containerNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                      Container Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter container number"
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
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#2E2E2E]">
                      Invoice Number <span className="text-red-500">*</span>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
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
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-7 text-xs border-[#E1E5E9] focus:border-[#0176D3] focus:ring-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="In Transit">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-3 h-3 text-blue-500" />
                            <span className="text-xs">In Transit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Port">
                          <div className="flex items-center space-x-2">
                            <Ship className="w-3 h-3 text-cyan-500" />
                            <span className="text-xs">Port</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Border">
                          <div className="flex items-center space-x-2">
                            <Package className="w-3 h-3 text-orange-500" />
                            <span className="text-xs">Border</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Off load">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-purple-500" />
                            <span className="text-xs">Off load</span>
                          </div>
                        </SelectItem>
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
                  isLoading ? 'animate-pulse' : 'hover:scale-[1.02]'
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
  );
};

export default ShipmentDetailsInventory;
