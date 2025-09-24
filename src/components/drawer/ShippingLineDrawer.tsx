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
import { Plus } from "lucide-react";

// Form validation schema
const shippingLineFormSchema = z.object({
  code: z
    .string()
    .min(1, "ShippingLine code is required")
    .max(3, "ShippingLine code must be 3 characters or less")
    .regex(/^[A-Z]+$/, "shippingLine code must contain only uppercase letters"),
  shippingLineCode: z
    .string()
    .min(1, "ShippingLine code is required")
    .max(10, "ShippingLine code must be 10 characters or less"),
  title: z
    .string()
    .min(1, "ShippingLine name is required")
    .min(2, "ShippingLine name must be at least 2 characters"),
});

type shippingLineFormValues = z.infer<typeof shippingLineFormSchema>;

interface shippingLine {
  id: number;
  code: string;
  shippingLineCode: string;
  title: string;
  createdAt: Date;
}

interface shippingLineDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: shippingLineFormValues) => void;
  editingShippingLine: shippingLine | null;
  triggerButton?: React.ReactNode;
}

const ShippingLineDrawer: React.FC<shippingLineDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingShippingLine,
  triggerButton,
}) => {
  const form = useForm<shippingLineFormValues>({
    resolver: zodResolver(shippingLineFormSchema),
    defaultValues: {
      code: "",
      shippingLineCode: "",
      title: "",
    },
  });

  // Reset form when editing shippingLine changes
  useEffect(() => {
    if (editingShippingLine) {
      form.reset({
        code: editingShippingLine.code,
        shippingLineCode: editingShippingLine.shippingLineCode,
        title: editingShippingLine.title,
      });
    } else {
      form.reset({
        code: "",
        shippingLineCode: "",
        title: "",
      });
    }
  }, [editingShippingLine, form]);

  const handleSubmit = (data: shippingLineFormValues) => {
    onSave(data);
    form.reset();
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsDrawerOpen(false);
  };

  const openCreateDrawer = () => {
    form.reset();
    setIsDrawerOpen(true);
  };
  return (
    <div>
      <Drawer
        direction="right"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <DrawerTrigger asChild>
          {triggerButton || (
            <Button
              onClick={openCreateDrawer}
              className="bg-[#0077C5] hover:bg-[#005A94] text-white font-medium px-3 py-1.5 h-8 rounded text-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New
            </Button>
          )}
        </DrawerTrigger>
        <DrawerContent className="w-80 border-l border-gray-200">
          <div className="flex flex-col h-full">
            <DrawerHeader className="border-b border-gray-200 px-4 py-3">
              <DrawerTitle className="text-base font-semibold text-gray-900">
                {editingShippingLine ? "Edit Shipping Line" : "Shipping Line Information"}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-gray-600">
                {editingShippingLine
                  ? "Update Shipping Line details"
                  : "Enter Shipping Line details"}
              </DrawerDescription>
            </DrawerHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                <div className="flex-1 px-4 py-3 space-y-3">
                  <FormField
                    control={form.control}
                    name="shippingLineCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Code *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0001"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.shippingLineCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          shippingLine Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MAERSK"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          ShippingLine Code *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MAERSK"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
                              form.formState.errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                            maxLength={3}
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
                      {editingShippingLine ? "Save" : "Save"}
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
    </div>
  );
};

export default ShippingLineDrawer;
