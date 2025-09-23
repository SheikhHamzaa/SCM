"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Package } from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  itemCode: string;
  designCode: string;
  designNo: string;
  image: string;
  itemType: string;
  category: string;
}

interface ItemType {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface SelectProductProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedProducts: Product[]) => void;
  availableProducts: Product[];
  selectedProductIds: Set<string>;
  onProductSelection: (product: Product) => void;
  itemTypes?: ItemType[];
  categories?: Category[];
}

const SelectProduct: React.FC<SelectProductProps> = ({
  isOpen,
  onClose,
  onSave,
  availableProducts,
  selectedProductIds,
  onProductSelection,
  itemTypes = [],
  categories = [],
}) => {
  const [selectedItemType, setSelectedItemType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Filter products based on selected item type and category
  const filteredProducts = availableProducts.filter((product) => {
    const matchesItemType = selectedItemType === "all" || product.itemType === selectedItemType;
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesItemType && matchesCategory;
  });

  // Define columns for the data table
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-10">
          <span className="text-xs font-semibold text-[#2E2E2E]">Select</span>
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProductIds.has(row.original.id)}
          onCheckedChange={() => onProductSelection(row.original)}
          className="w-4 h-4 text-[#0176D3] border-[#D1D5DB] rounded focus:ring-[#0176D3] focus:ring-1 hover:border-[#0176D3] transition-colors"
          aria-label="Select product"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-10 h-10 rounded border border-[#D1D5DB] overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex items-center justify-center group cursor-pointer"
             onClick={() => setExpandedImage(row.getValue("image"))}>
          <img
            src={row.getValue("image")}
            alt={row.original.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
          <Package className="w-4 h-4 text-[#9CA3AF] hidden" />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "itemCode",
      header: "Item Code",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-[#2E2E2E] bg-[#F3F4F6] px-1.5 py-0.5 rounded">
          {row.getValue("itemCode")}
        </span>
      ),
    },
    {
      accessorKey: "designCode",
      header: "Design Code",
      cell: ({ row }) => (
        <span className="text-xs text-[#707070] font-mono">
          {row.getValue("designCode")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => (
        <div>
          <span className="text-xs font-medium text-[#2E2E2E] block">
            {row.getValue("name")}
          </span>
          <span className="text-[10px] text-[#707070] block mt-0.5">
            {row.original.designNo}
          </span>
        </div>
      ),
    },
  ];

  const handleSave = () => {
    const selectedProducts = filteredProducts.filter((product) =>
      selectedProductIds.has(product.id)
    );
    onSave(selectedProducts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-white shadow-lg border-[#D1D5DB]">
        <DialogHeader className="border-b border-[#E1E5E9] pb-3">
          <DialogTitle className="text-lg font-semibold text-[#2E2E2E]">
            Select Products
          </DialogTitle>
          <p className="text-xs text-[#707070] mt-1">
            Browse and select products to add to your purchase order
          </p>
        </DialogHeader>

        {/* Compact Filter Controls */}
        <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#F8F9FA] rounded border border-[#E1E5E9] m-2">
          <div>
            <label className="text-xs font-medium text-[#2E2E2E] block mb-1">
              Item Type
            </label>
            <Select value={selectedItemType} onValueChange={setSelectedItemType}>
              <SelectTrigger className="h-7 w-full text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white px-2">
                <SelectValue placeholder="Select Item Type..." />
              </SelectTrigger>
              <SelectContent className="shadow-lg border-[#D1D5DB]">
                <SelectItem value="all" className="hover:bg-[#F3F4F6] text-xs py-1">
                  <span className="text-xs font-medium">All Item Types</span>
                </SelectItem>
                {itemTypes.map((itemType) => (
                  <SelectItem key={itemType.id} value={itemType.id} className="hover:bg-[#F3F4F6] text-xs py-1">
                    <span className="text-xs">{itemType.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-[#2E2E2E] block mb-1">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-7 w-full text-xs border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#0176D3] bg-white px-2">
                <SelectValue placeholder="Select Category..." />
              </SelectTrigger>
              <SelectContent className="shadow-lg border-[#D1D5DB]">
                <SelectItem value="all" className="hover:bg-[#F3F4F6] text-xs py-1">
                  <span className="text-xs font-medium">All Categories</span>
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="hover:bg-[#F3F4F6] text-xs py-1">
                    <span className="text-xs">{category.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compact Product Table */}
        <div className="flex-1 overflow-y-auto m-2 bg-white rounded border border-[#E1E5E9]">
          <div className="max-h-64 overflow-y-auto">
            <DataTable columns={columns} data={filteredProducts} />
          </div>
        </div>

        <DialogFooter className="border-t border-[#E1E5E9] pt-2 bg-[#F8F9FA] px-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-[#5A5A5A]">
              <span className="font-medium">{selectedProductIds.size}</span> items selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-1 text-[#5A5A5A] border border-[#D1D5DB] rounded text-xs hover:bg-[#F9FAFB] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-[#0176D3] hover:bg-[#014F86] text-white rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1"
              >
                <span>Save Selection</span>
                {selectedProductIds.size > 0 && (
                  <span className="bg-white/20 px-1 py-0.5 rounded-full text-[10px] font-medium">
                    {selectedProductIds.size}
                  </span>
                )}
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <img
              src={expandedImage}
              alt="Expanded product"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default SelectProduct;
