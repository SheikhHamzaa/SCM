"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
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
import {
  X,
  Package,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";

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

/**
 * ImageModal - renders via portal into document.body so it always sits above dialogs, etc.
 */
function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt?: string;
  onClose: () => void;
}) {
  // Lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle ESC key with high priority to prevent bubbling to parent dialog
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };

    // Add listener with capture=true to catch events before they reach the dialog
    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="relative max-w-5xl max-h-[95vh] w-full bg-white rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[100000] bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex z-[999999] items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Product Image</h3>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close image"
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="w-full h-[80vh] md:h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-[#E5E7EB]">
          <img
            src={src}
            alt={alt || "Expanded product"}
            className="max-h-full max-w-full object-contain shadow-lg rounded-lg"
            style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}
          />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="text-center">
            <p className="text-white/80 text-sm">
              Press ESC or click outside to close
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Handler to close image modal and prevent dialog close
  const handleImageClose = () => {
    setExpandedImage(null);
  };

  // Handler to close main dialog, but only if image modal is not open
  const handleDialogClose = (open: boolean) => {
    if (!open && !expandedImage) {
      onClose();
    }
  };

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
      const matchesItemType =
        selectedItemType === "all" || product.itemType === selectedItemType;
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.designCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.designNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesItemType && matchesCategory && matchesSearch;
    });
  }, [availableProducts, selectedItemType, selectedCategory, searchQuery]);

  // Reset filters when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItemType("all");
      setSelectedCategory("all");
      setSearchQuery("");
    }
  }, [isOpen]);

  // Select all filtered products
  const handleSelectAll = () => {
    const allFilteredSelected = filteredProducts.every((product) =>
      selectedProductIds.has(product.id)
    );

    if (allFilteredSelected) {
      // Deselect all filtered products
      filteredProducts.forEach((product) => {
        if (selectedProductIds.has(product.id)) {
          onProductSelection(product);
        }
      });
    } else {
      // Select all filtered products
      filteredProducts.forEach((product) => {
        if (!selectedProductIds.has(product.id)) {
          onProductSelection(product);
        }
      });
    }
  };

  const clearFilters = () => {
    setSelectedItemType("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedItemType !== "all" ||
    selectedCategory !== "all" ||
    searchQuery !== "";

  // Columns
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: () => {
        const allSelected =
          filteredProducts.length > 0 &&
          filteredProducts.every((product) =>
            selectedProductIds.has(product.id)
          );
        const someSelected = filteredProducts.some((product) =>
          selectedProductIds.has(product.id)
        );

        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className={`w-4 h-4 text-[#0176D3] border-[#D1D5DB] rounded ${
                someSelected && !allSelected
                  ? "bg-[#0176D3] border-[#0176D3]"
                  : ""
              }`}
              aria-label="Select all products"
            />
            <span className="text-xs font-semibold text-[#2E2E2E]">Select</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProductIds.has(row.original.id)}
          onCheckedChange={() => onProductSelection(row.original)}
          className="w-4 h-4 text-[#0176D3] border-[#D1D5DB] rounded"
          aria-label={`Select ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div
          className="w-12 h-12 rounded-lg border border-[#D1D5DB] overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex items-center justify-center group cursor-pointer hover:border-[#0176D3] transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => setExpandedImage(row.getValue("image"))}
          title="Click to view full size"
        >
          <img
            src={row.getValue("image")}
            alt={row.original.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const nextElement = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = "flex";
              }
            }}
          />
          <Package className="w-5 h-5 text-[#9CA3AF] hidden" />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "itemCode",
      header: "Item Code",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-[#2E2E2E] bg-[#F3F4F6] px-2 py-1 rounded-md border">
          {row.getValue("itemCode")}
        </span>
      ),
    },
    {
      accessorKey: "designCode",
      header: "Design Code",
      cell: ({ row }) => (
        <span className="text-xs text-[#707070] font-mono bg-[#F8F9FA] px-2 py-1 rounded border">
          {row.getValue("designCode")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Item Details",
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="text-sm font-semibold text-[#2E2E2E] block truncate">
            {row.getValue("name")}
          </span>
          <span className="text-xs text-[#707070] block mt-1">
            Design: {row.original.designNo}
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] text-[#5A5A5A] bg-[#E3F2FD] px-1.5 py-0.5 rounded-full">
              {row.original.itemType}
            </span>
            <span className="text-[10px] text-[#5A5A5A] bg-[#F3E5F5] px-1.5 py-0.5 rounded-full">
              {row.original.category}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const selectedProducts = filteredProducts.filter((product) =>
        selectedProductIds.has(product.id)
      );
      await onSave(selectedProducts);
      onClose();
    } catch (error) {
      console.error("Error saving products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white shadow-2xl border border-[#E1E5E9] rounded-lg">
          {/* Header */}
          <DialogHeader className="border-b border-[#E1E5E9] px-4 py-3 bg-gradient-to-r from-[#F8F9FA] to-[#F3F4F6]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0176D3] to-[#014F86] rounded-lg flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-[#2E2E2E]">
                    Select Products
                  </DialogTitle>
                  <p className="text-xs text-[#707070] mt-0.5">
                    Browse and select products for your purchase order
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#5A5A5A] hover:text-[#2E2E2E] hover:bg-[#F3F4F6] p-1.5 rounded-md transition-all duration-200"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {/* Search and Filters */}
          <div className="px-4 py-3 border-b border-[#E1E5E9] bg-white space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#9CA3AF]" />
              </div>
              <input
                type="text"
                placeholder="Search by name, item code, design code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 border border-[#D1D5DB] rounded-md text-sm placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0176D3] focus:border-[#0176D3] transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-[#9CA3AF] hover:text-[#5A5A5A]" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className="text-xs font-semibold text-[#2E2E2E] block mb-1">
                    <Filter className="w-3 h-3 inline mr-1" />
                    Item Type
                  </label>
                  <Select
                    value={selectedItemType}
                    onValueChange={setSelectedItemType}
                  >
                    <SelectTrigger className="h-9 w-full text-sm border-[#D1D5DB] focus:ring-2 focus:ring-[#0176D3]">
                      <SelectValue placeholder="All Item Types" />
                    </SelectTrigger>
                    <SelectContent className="shadow-xl border-[#D1D5DB]">
                      <SelectItem value="all">All Item Types</SelectItem>
                      {itemTypes.map((itemType) => (
                        <SelectItem key={itemType.id} value={itemType.name}>
                          {itemType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2E2E2E] block mb-1">
                    <Filter className="w-3 h-3 inline mr-1" />
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-9 w-full text-sm border-[#D1D5DB] focus:ring-2 focus:ring-[#0176D3]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="shadow-xl border-[#D1D5DB]">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-3 px-2 py-1 text-xs text-[#0176D3] hover:bg-[#F0F8FF] border border-[#0176D3] rounded-md transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Summary */}
            {selectedItemType !== "all" && selectedCategory !== "all" && (
              <div className="flex items-center justify-between text-xs">
                <div className="text-[#5A5A5A]">
                  Showing{" "}
                  <span className="font-semibold text-[#2E2E2E]">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#2E2E2E]">
                    {availableProducts.length}
                  </span>{" "}
                  products
                </div>
                {selectedProductIds.size > 0 && (
                  <div className="flex items-center space-x-1 text-[#0176D3]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-semibold">
                      {selectedProductIds.size} selected
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Table */}
          <div className="flex-1 overflow-hidden bg-white">
            {selectedItemType === "all" || selectedCategory === "all" ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Filter className="w-16 h-16 text-[#9CA3AF] mb-4" />
                <h3 className="text-lg font-semibold text-[#5A5A5A] mb-2">
                  Select Item Type and Category
                </h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Please select both an item type and category to view available
                  products
                </p>
                <div className="flex items-center space-x-2 text-xs text-[#707070]">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      selectedItemType !== "all"
                        ? "bg-[#E3F2FD] text-[#0176D3]"
                        : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    {selectedItemType !== "all"
                      ? "✓ Item Type Selected"
                      : "Select Item Type"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      selectedCategory !== "all"
                        ? "bg-[#E3F2FD] text-[#0176D3]"
                        : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    {selectedCategory !== "all"
                      ? "✓ Category Selected"
                      : "Select Category"}
                  </span>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="w-12 h-12 text-[#9CA3AF] mb-4" />
                <h3 className="text-lg font-semibold text-[#5A5A5A] mb-2">
                  No products found
                </h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  No products match the selected item type and category
                  combination
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-[#0176D3] border border-[#0176D3] rounded-lg hover:bg-[#F0F8FF] transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="h-full overflow-y-auto border border-[#E1E5E9] rounded-lg m-4">
                <DataTable columns={columns} data={filteredProducts} />
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t border-[#E1E5E9] px-6 py-5 bg-gradient-to-r from-[#F8F9FA] to-[#F3F4F6]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-[#5A5A5A]">
                  <span className="font-bold text-[#0176D3] text-lg">
                    {selectedProductIds.size}
                  </span>{" "}
                  product{selectedProductIds.size !== 1 ? "s" : ""} selected
                </div>
                {selectedProductIds.size > 0 && (
                  <div className="h-4 w-px bg-[#D1D5DB]" />
                )}
                {selectedProductIds.size > 0 && (
                  <button
                    onClick={() => {
                      // Clear all selections
                      Array.from(selectedProductIds).forEach((productId) => {
                        const product = availableProducts.find(
                          (p) => p.id === productId
                        );
                        if (product) onProductSelection(product);
                      });
                    }}
                    className="text-sm text-[#DC2626] hover:text-[#B91C1C] underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-3 text-[#5A5A5A] border border-[#D1D5DB] rounded-lg text-sm font-semibold hover:bg-[#F9FAFB] hover:border-[#9CA3AF] transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={selectedProductIds.size === 0 || isLoading}
                  className="px-6 py-3 bg-[#0176D3] hover:bg-[#014F86] disabled:bg-[#E1E5E9] disabled:text-[#A3A3A3] text-white rounded-lg font-bold text-sm shadow-lg disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Add {selectedProductIds.size} Product
                        {selectedProductIds.size !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image modal  */}
      {expandedImage && (
        <ImageModal src={expandedImage} onClose={handleImageClose} />
      )}
    </>
  );
};

export default SelectProduct;
