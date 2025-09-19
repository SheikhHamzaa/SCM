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
import ItemCategoryDrawer from "@/components/drawer/ItemCategoryDrawer";

interface ItemCategory {
  id: number;
  code: string;
  title: string;
  description?: string;
  itemTypeId: string;
  createdAt: Date;
}

export const ItemCategoryManagement = () => {
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItemCategory, setEditingItemCategory] = useState<ItemCategory | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const idCounterRef = useRef(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Item Categories</h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Manage your item categories
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
              <h3 className="text-base font-medium text-gray-900 mb-1">Loading...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (data: { code: string; title: string; description?: string; itemTypeId: string }) => {
    if (editingItemCategory) {
      setItemCategories((prev) =>
        prev.map((itemCategory) =>
          itemCategory.id === editingItemCategory.id ? { ...itemCategory, ...data } : itemCategory
        )
      );
    } else {
      const newItemCategory: ItemCategory = {
        id: idCounterRef.current++,
        code: data.code,
        title: data.title,
        description: data.description,
        itemTypeId: data.itemTypeId,
        createdAt: new Date(),
      };
      setItemCategories((prev) => [...prev, newItemCategory]);
    }
    setEditingItemCategory(null);
    setIsDrawerOpen(false);
  };

  const handleEdit = (itemCategory: ItemCategory) => {
    setEditingItemCategory(itemCategory);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item category?")) {
      setItemCategories((prev) => prev.filter((itemCategory) => itemCategory.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Item Categories</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage your item categories</p>
          </div>
          <ItemCategoryDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            onSave={handleSave}
            editingItemCategory={editingItemCategory}
          />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          {itemCategories.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No Item Categories yet</h3>
              <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                Add item categories to organize your products.
              </p>
              <ItemCategoryDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                onSave={handleSave}
                editingItemCategory={editingItemCategory}
                triggerButton={
                  <Button className="bg-[#0077C5] hover:bg-[#005A94] text-white text-sm px-3 py-1.5 h-8">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Item Category
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div className="bg-[#F8F9FA] border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-900">
                    Item Categories ({itemCategories.length})
                  </h2>
                  <div className="text-xs text-gray-500">{itemCategories.length} items</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-white">
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Code
                      </TableHead>
                      <TableHead className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category Name
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
                    {itemCategories.map((itemCategory, index) => (
                      <TableRow
                        key={itemCategory.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                        }`}
                      >
                        <TableCell className="px-4 py-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#1976D2] border border-[#BBDEFB]">
                            {itemCategory.code.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-sm font-medium text-gray-900">{itemCategory.title}</div>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <div className="text-xs text-gray-500">
                            {itemCategory.createdAt.toLocaleDateString("en-US", {
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
                              onClick={() => handleEdit(itemCategory)}
                              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-[#0077C5] text-gray-400"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(itemCategory.id)}
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
