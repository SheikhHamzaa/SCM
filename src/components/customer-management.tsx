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
import { Plus, Edit, Trash2, Building2, User, Phone, Mail, MapPin } from "lucide-react";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";

interface Customer {
  id: number;
  currency: string;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  creditLimit?: string;
  taxId?: string;
  notes?: string;
  createdAt: Date;
}

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
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
              <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
              <p className="text-xs text-gray-600 mt-0.5">Manage your customer database</p>
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

  const handleSave = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id ? { ...customer, ...data } : customer
        )
      );
    } else {
      const newCustomer: Customer = {
        id: idCounterRef.current++,
        ...data,
        createdAt: new Date(),
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setEditingCustomer(null);
    setIsDrawerOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage your customer database</p>
          </div>
          <CustomerDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            onSave={handleSave}
            editingCustomer={editingCustomer}
          />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No Customers yet</h3>
              <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                Add customers to start managing your client relationships and orders.
              </p>
              <CustomerDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                onSave={handleSave}
                editingCustomer={editingCustomer}
                triggerButton={
                  <Button className="bg-[#0077C5] hover:bg-[#005A94] text-white text-sm px-3 py-1.5 h-8">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Customer
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div className="bg-[#F8F9FA] border-b border-gray-200 px-3 py-1.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-900">
                    Customers ({customers.length})
                  </h2>
                  <div className="text-xs text-gray-500">{customers.length} items</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-white">
                      <TableHead className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </TableHead>
                      <TableHead className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact Info
                      </TableHead>
                      <TableHead className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </TableHead>
                      <TableHead className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Currency
                      </TableHead>
                      <TableHead className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date Added
                      </TableHead>
                      <TableHead className="text-right px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer, index) => (
                      <TableRow
                        key={customer.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                        }`}
                      >
                        <TableCell className="px-3 py-2">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]">
                                <Building2 className="h-3 w-3 mr-1" />
                                {customer.customerCode}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {customer.contactPerson}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[120px]">{customer.email}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[100px]">{customer.city}, {customer.country}</span>
                            </div>
                            {customer.address && (
                              <div className="text-xs text-gray-400 truncate max-w-[100px]">{customer.address}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-900">{customer.currency}</div>
                            {customer.creditLimit && (
                              <div className="text-xs text-gray-500">
                                Credit: ${Number(customer.creditLimit).toLocaleString()}
                              </div>
                            )}
                            {customer.taxId && (
                              <div className="text-xs text-gray-400">Tax: {customer.taxId}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <div className="text-xs text-gray-500">
                            {customer.createdAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-[#0077C5] text-gray-400"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(customer.id)}
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
