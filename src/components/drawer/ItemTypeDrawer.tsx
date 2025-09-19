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
const itemTypeFormSchema = z.object({
  code: z
    .string()
    .min(1, "Item type code is required")
    .max(10, "Item type code must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Item type code must contain only uppercase letters and numbers"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .optional(),
});

type ItemTypeFormValues = z.infer<typeof itemTypeFormSchema>;

interface ItemType {
  id: number;
  code: string;
  title: string;
  description?: string;
  createdAt: Date;
}

interface ItemTypeDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: { code: string; title: string; description?: string }) => void;
  editingItemType?: ItemType | null;
  triggerButton?: React.ReactElement;
}

const ItemTypeDrawer: React.FC<ItemTypeDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingItemType = null,
  triggerButton,
}) => {
  const form = useForm<ItemTypeFormValues>({
    resolver: zodResolver(itemTypeFormSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
    },
  });

  // Reset form when drawer opens/closes or when editing changes
  useEffect(() => {
    if (isDrawerOpen) {
      if (editingItemType) {
        form.reset({
          code: editingItemType.code,
          title: editingItemType.title,
          description: editingItemType.description || "",
        });
      } else {
        form.reset({
          code: "",
          title: "",
          description: "",
        });
      }
    }
  }, [isDrawerOpen, editingItemType, form]);

  const onSubmit = (data: ItemTypeFormValues) => {
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
            New Item Type
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-[600px] border-l border-gray-200">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-gray-200 px-6 py-4">
            <DrawerTitle className="text-lg font-semibold text-gray-900">
              {editingItemType ? "Edit Item Type" : "New Item Type"}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-600">
              {editingItemType
                ? "Update item type details"
                : "Enter item type details"}
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="flex-1 px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-900">
                          Item Type Code *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., RAW, FIN"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-9 ${
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
                        <FormLabel className="text-sm font-medium text-gray-900">
                          Item Type Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Raw Material, Finished Product"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-9 ${
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
              </div>

              <DrawerFooter className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="bg-[#0077C5] hover:bg-[#005A94] text-white flex-1 h-8 text-sm"
                  >
                    {editingItemType ? "Save" : "Save"}
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

export default ItemTypeDrawer;
