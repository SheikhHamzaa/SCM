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
const ConsigneeFormSchema = z.object({
  code: z
    .string()
    .min(1, "Consignee code is required")
     .max(10, "Consignee code must be 10 characters or less"),
  // ConsigneeCode: z
  //   .string()
  //   .min(1, "Consignee code is required")
  //   .max(10, "Consignee code must be 10 characters or less"),
  title: z
    .string()
    .min(1, "Consignee name is required")
    .min(2, "Consignee name must be at least 2 characters"),
});

type ConsigneeFormValues = z.infer<typeof ConsigneeFormSchema>;

interface Consignee {
  id: number;
  code: string;
  // ConsigneeCode: string;
  title: string;
  createdAt: Date;
}

interface ConsigneeDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: ConsigneeFormValues) => void;
  editingConsignee: Consignee | null;
  triggerButton?: React.ReactNode;
}

const ConsigneeDrawer: React.FC<ConsigneeDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingConsignee,
  triggerButton,
}) => {
  const form = useForm<ConsigneeFormValues>({
    resolver: zodResolver(ConsigneeFormSchema),
    defaultValues: {
      code: "",
      // ConsigneeCode: "",
      title: "",
    },
  });

  // Reset form when editing Consignee changes
  useEffect(() => {
    if (editingConsignee) {
      form.reset({
        code: editingConsignee.code,
        // ConsigneeCode: editingConsignee.ConsigneeCode,
        title: editingConsignee.title,
      });
    } else {
      form.reset({
        code: "",
        // ConsigneeCode: "",
        title: "",
      });
    }
  }, [editingConsignee, form]);

  const handleSubmit = (data: ConsigneeFormValues) => {
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
                {editingConsignee ? "Edit Shipping Line" : "Shipping Line Information"}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-gray-600">
                {editingConsignee
                  ? "Update Shipping Line details"
                  : "Enter Shipping Line details"}
              </DrawerDescription>
            </DrawerHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                <div className="flex-1 px-4 py-3 space-y-3">
                  <FormField
                    control={form.control}
                    name="code"
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
                              form.formState.errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
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
                          Consignee Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Consignee Name"
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
                   {/* <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Consignee Code *
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
                  /> */}
                </div>

                <DrawerFooter className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-[#0077C5] hover:bg-[#005A94] text-white flex-1 h-8 text-sm"
                    >
                      {editingConsignee ? "Save" : "Save"}
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

export default ConsigneeDrawer;
