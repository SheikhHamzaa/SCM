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
import { describe } from "node:test";

const finalDestinationFormSchema = z.object({
  code: z
    .string()
    .min(1, "Final destination code is required")
    .max(10, "Final destination code must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Final destination code must contain only uppercase letters and numbers"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .optional(),

});

type FinalDestinationFormValues = z.infer<typeof finalDestinationFormSchema>;

interface FinalDestination {
  id: number;
  code: string;
  title: string;
  createdAt: Date;
}

interface FinalDestinationDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: { code: string; title: string }) => void;
  editingFinalDestination?: FinalDestination | null;
  triggerButton?: React.ReactElement;
}

const FinalDestinationDrawer: React.FC<FinalDestinationDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingFinalDestination = null,
  triggerButton,
}) => {
  const form = useForm<FinalDestinationFormValues>({
    resolver: zodResolver(finalDestinationFormSchema),
    defaultValues: {
      code: "",
      title: "",
    },
  });

  useEffect(() => {
    if (isDrawerOpen) {
      if (editingFinalDestination) {
        form.reset({
          code: editingFinalDestination.code,
          title: editingFinalDestination.title,
        });
      } else {
        form.reset({
          code: "",
          title: "",
        });
      }
    }
  }, [isDrawerOpen, editingFinalDestination, form]);

  const onSubmit = (data: FinalDestinationFormValues) => {
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
            New Final Destination
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-80 border-l border-gray-200">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-gray-200 px-4 py-3">
            <DrawerTitle className="text-base font-semibold text-gray-900">
              {editingFinalDestination ? "Edit Final Destination" : "Final Destination Information"}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-gray-600">
              {editingFinalDestination
                ? "Update final destination details"
                : "Enter final destination details"}
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
                        Final Destination Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., NYC, LON"
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
                        Destination Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., New York City, London"
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
                    {editingFinalDestination ? "Save" : "Save"}
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

export default FinalDestinationDrawer;
