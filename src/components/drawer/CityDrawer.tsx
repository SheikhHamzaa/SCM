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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const cityFormSchema = z.object({
  code: z
    .string()
    .min(1, "City code is required")
    .max(3, "City code must be 3 characters or less")
    .regex(/^[A-Z]+$/, "City code must contain only uppercase letters"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  country: z.string().min(1, "Country is required"),
});

type cityFormValues = z.infer<typeof cityFormSchema>;

interface city {
  id: number;
  code: string;
  title: string;
  createdAt: Date;
}

interface cityDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onSave: (data: cityFormValues) => void;
  editingcity: city | null;
  triggerButton?: React.ReactNode;
}

const cityDrawer: React.FC<cityDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
  editingcity,
  triggerButton,
}) => {
  const form = useForm<cityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      code: "",
      title: "",
    },
  });
  const countries = ["Pakistan", "Mozambique", "Zambia"];

  // Reset form when editing city changes
  useEffect(() => {
    if (editingcity) {
      form.reset({
        code: editingcity.code,
        title: editingcity.title,
      });
    } else {
      form.reset({
        code: "",
        title: "",
      });
    }
  }, [editingcity, form]);

  const handleSubmit = (data: cityFormValues) => {
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
                {editingcity ? "Edit City" : "City Information"}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-gray-600">
                {editingcity ? "Update city details" : "Enter city details"}
              </DrawerDescription>
            </DrawerHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col h-full"
              >
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
                            placeholder="0000"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-900">
                          Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Islamabad"
                            {...field}
                            className={`border-gray-300 focus:border-[#0077C5] focus:ring-[#0077C5] text-sm h-8 ${
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
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-[#393A3D] mb-1 block">
                          Country *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#D1D5DB] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] text-xs h-8 w-full bg-white transition-all duration-200">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((option) => (
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

                <DrawerFooter className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-[#0077C5] hover:bg-[#005A94] text-white flex-1 h-8 text-sm"
                    >
                      {editingcity ? "Save" : "Save"}
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

export default cityDrawer;
