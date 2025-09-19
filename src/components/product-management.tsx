"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import ProductDrawer from "@/components/drawer/ProductDrawer";

interface Product {
  id: number;
  code: string;
  title: string;
  designNo: string;
  finalDestination: string;
  itemType: string;
  itemCategory: string;
  yard: number;
  smallestUOM: string;
  intermediateUOM: string;
  masterUOM: string;
  pcsToIntermediateRatio: number;
  pcsToMasterRatio: number;
  createdAt: Date;
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const idCounterRef = useRef(1);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Products</h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Manage your product catalog
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Loading...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (data: { 
    code: string; 
    title: string; 
    designNo: string;
    finalDestination: string;
    itemType: string;
    itemCategory: string;
    yard: number;
    smallestUOM: string;
    intermediateUOM: string;
    masterUOM: string;
    pcsToIntermediateRatio: number;
    pcsToMasterRatio: number;
  }) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...data }
            : product
        )
      );
    } else {
      // Create new product with incremental ID
      const newProduct: Product = {
        id: idCounterRef.current++,
        code: data.code,
        title: data.title,
        designNo: data.designNo,
        finalDestination: data.finalDestination,
        itemType: data.itemType,
        itemCategory: data.itemCategory,
        yard: data.yard,
        smallestUOM: data.smallestUOM,
        intermediateUOM: data.intermediateUOM,
        masterUOM: data.masterUOM,
        pcsToIntermediateRatio: data.pcsToIntermediateRatio,
        pcsToMasterRatio: data.pcsToMasterRatio,
        createdAt: new Date(),
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    // Reset and close drawer
    setEditingProduct(null);
    setIsDrawerOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* QuickBooks-style compact page header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Products</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Manage your product catalog
            </p>
          </div>
          
          {/* New Button */}
          <ProductDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            onSave={handleSave}
            editingProduct={editingProduct}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 py-3">
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No Products yet
              </h3>
              <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                Add products to build your catalog.
              </p>
              <ProductDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                onSave={handleSave}
                editingProduct={editingProduct}
                triggerButton={
                  <Button
                    className="bg-[#0077C5] hover:bg-[#005A94] text-white text-sm px-3 py-1.5 h-8"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Product
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* Table header with QuickBooks styling */}
              <div className="bg-[#F8F9FA] border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-900">
                    Products ({products.length})
                  </h2>
                  <div className="text-xs text-gray-500">
                    {products.length} items
                  </div>
                </div>
              </div>

              {/* QuickBooks-style compact table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-white">
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Code
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product Name
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Design No
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type/Category
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quantity
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date Added
                      </TableHead>
                      <TableHead className="text-right px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                        }`}
                      >
                        <TableCell className="px-4 py-2.5">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#1976D2] border border-[#BBDEFB]">
                              {product.code.toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.finalDestination}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-sm text-gray-900">
                            {product.designNo}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-sm text-gray-900">
                            {product.itemType}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.itemCategory}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-sm text-gray-900">
                            {product.yard} {product.smallestUOM}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.floor(product.yard / product.pcsToIntermediateRatio)} {product.intermediateUOM}, {Math.floor(product.yard / product.pcsToMasterRatio)} {product.masterUOM}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-xs text-gray-500">
                            {product.createdAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-[#0077C5] text-gray-400"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 text-gray-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
