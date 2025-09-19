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

// Mock item types for dropdown - in real app this would come from a store/API
const mockItemTypes = [
  { id: 1, code: "POL", title: "Polyster"},
  { id: 2, code: "COT", title: "Cotton" },
];

const itemCategoryFormSchema = z.object({
  code: z
    .string()
    .min(1, "Item category code is required")
    .max(10, "Item category code must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Item category code must contain only uppercase letters and numbers"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .optional(),
  itemTypeId: z
    .string()
    .min(1, "Item type is required"),
});

type ItemCategoryFormValues = z.infer<typeof itemCategoryFormSchema>;

interface ItemCategory {
  id: number;
  code: string;
  title: string;
  description?: string;
  itemTypeId: string;
  createdAt: Date;
}

interface ItemCategoryDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: { code: string; title: string; description?: string; itemTypeId: string }) => void;
  editingItemCategory?: ItemCategory | null;
  triggerButton?: React.ReactElement;
}

const ItemCategoryDrawer: React.FC<ItemCategoryDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingItemCategory = null,
  triggerButton,
}) => {
  const form = useForm<ItemCategoryFormValues>({
    resolver: zodResolver(itemCategoryFormSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      itemTypeId: "",
    },
  });

  useEffect(() => {
    if (isDrawerOpen) {
      if (editingItemCategory) {
        form.reset({
          code: editingItemCategory.code,
          title: editingItemCategory.title,
          description: editingItemCategory.description || "",
          itemTypeId: editingItemCategory.itemTypeId,
        });
      } else {
        form.reset({
          code: "",
          title: "",
          description: "",
          itemTypeId: "",
        });
      }
    }
  }, [isDrawerOpen, editingItemCategory, form]);

  const onSubmit = (data: ItemCategoryFormValues) => {
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
            New Item Category
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-[600px] border-l border-gray-200">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b border-gray-200 px-6 py-4">
            <DrawerTitle className="text-lg font-semibold text-gray-900">
              {editingItemCategory ? "Edit Item Category" : "New Item Category"}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-600">
              {editingItemCategory
                ? "Update item category details"
                : "Enter item category details"}
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
                          Item Category Code *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., FABR, ACCS"
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
                          Item Category Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Fabrics, Accessories"
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
                    name="itemTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-900">
                          Item Type *
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className={`w-full border border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-9 rounded-md px-3 ${
                              form.formState.errors.itemTypeId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                          >
                            <option value="">Select Item Type</option>
                            {mockItemTypes.map((itemType) => (
                              <option key={itemType.id} value={itemType.id.toString()}>
                                {itemType.code} - {itemType.title}
                              </option>
                            ))}
                          </select>
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

              <DrawerFooter className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-[#0077C5] hover:bg-[#005A94] text-white flex-1 h-9 text-sm"
                  >
                    {editingItemCategory ? "Save Changes" : "Save Item Category"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-9 text-sm"
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

export default ItemCategoryDrawer;
