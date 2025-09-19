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

const portOfDischargeFormSchema = z.object({
  code: z
    .string()
    .min(1, "Port of discharge code is required")
    .max(10, "Port of discharge code must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Port of discharge code must contain only uppercase letters and numbers"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  description:z
    .string()
    .optional(),
});

type PortOfDischargeFormValues = z.infer<typeof portOfDischargeFormSchema>;

interface PortOfDischarge {
  id: number;
  code: string;
  title: string;
  createdAt: Date;
}

interface PortOfDischargeDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: { code: string; title: string }) => void;
  editingPortOfDischarge?: PortOfDischarge | null;
  triggerButton?: React.ReactElement;
}

const PortOfDischargeDrawer: React.FC<PortOfDischargeDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingPortOfDischarge = null,
  triggerButton,
}) => {
  const form = useForm<PortOfDischargeFormValues>({
    resolver: zodResolver(portOfDischargeFormSchema),
    defaultValues: {
      code: "",
      title: "",
    },
  });

  useEffect(() => {
    if (isDrawerOpen) {
      if (editingPortOfDischarge) {
        form.reset({
          code: editingPortOfDischarge.code,
          title: editingPortOfDischarge.title,
        });
      } else {
        form.reset({
          code: "",
          title: "",
        });
      }
    }
  }, [isDrawerOpen, editingPortOfDischarge, form]);

  const onSubmit = (data: PortOfDischargeFormValues) => {
    onSave(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    setIsDrawerOpen(false);
  };

  return (
    <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {triggerButton || (
          <Button className="bg-[#0077C5] hover:bg-[#005A94] text-white text-sm px-3 py-1.5 h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Port of Discharge
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-80 border-l border-gray-200">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-gray-200 px-4 py-3">
            <DrawerTitle className="text-base font-semibold text-gray-900">
              {editingPortOfDischarge ? "Edit Port of Discharge" : "Port of Discharge Information"}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-gray-600">
              {editingPortOfDischarge
                ? "Update port of discharge details"
                : "Enter port of discharge details"}
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="flex-1 px-4 py-3 space-y-3">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-900">
                        Port Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., USNYC, USLA"
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
                        Port Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Port of New York, Port of Los Angeles"
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
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-900">
                                          Description
                                        </FormLabel>
                                        <FormControl>
                                          <textarea
                                            placeholder="Enter description (optional)"
                                            {...field}
                                            className={`w-full border border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm rounded-md p-3 min-h-[80px] resize-none ${
                                              form.formState.errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                            }`}
                                            rows={3}
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
                    {editingPortOfDischarge ? "Save" : "Save"}
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

export default PortOfDischargeDrawer;
