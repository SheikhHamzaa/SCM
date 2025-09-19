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
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import CurrencyDrawer from "@/components/drawer/CurrencyDrawer";

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  createdAt: Date;
}

export const CurrencyManagement = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
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
              <h1 className="text-xl font-semibold text-gray-900">Currency Management</h1>
              <p className="text-xs text-gray-600 mt-0.5">Manage your currency settings and exchange rates</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Loading currencies...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddCurrency = () => {
    setEditingCurrency(null);
    setIsDrawerOpen(true);
  };

  const handleEditCurrency = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsDrawerOpen(true);
  };

  const handleDeleteCurrency = (id: number) => {
    setCurrencies(prev => prev.filter(currency => currency.id !== id));
  };

  const handleSaveCurrency = (currencyData: Omit<Currency, 'id' | 'createdAt'>) => {
    if (editingCurrency) {
      // Update existing currency
      setCurrencies(prev => prev.map(currency => 
        currency.id === editingCurrency.id 
          ? { ...currency, ...currencyData }
          : currency
      ));
    } else {
      // Add new currency
      const newCurrency: Currency = {
        id: idCounterRef.current++,
        ...currencyData,
        createdAt: new Date(),
      };
      setCurrencies(prev => [...prev, newCurrency]);
    }
    setIsDrawerOpen(false);
    setEditingCurrency(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCurrency(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Currency Management</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage your currency settings and exchange rates</p>
          </div>
          <Button onClick={handleAddCurrency} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          {currencies.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-4">No currencies found</p>
              <Button onClick={handleAddCurrency} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                Add your first currency
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Code</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Name</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Symbol</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Exchange Rate</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">Created</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency.id} className="hover:bg-gray-50">
                    <TableCell className="py-3 px-4 font-medium text-gray-900">{currency.code}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-600">{currency.name}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-600 font-mono">{currency.symbol}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-600">
                      {currency.isBaseCurrency ? 'Base Currency' : currency.exchangeRate.toFixed(4)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {currency.isBaseCurrency ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Base Currency
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-sm">
                      {currency.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCurrency(currency)}
                          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCurrency(currency.id)}
                          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                          disabled={currency.isBaseCurrency}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Currency Drawer */}
      <CurrencyDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveCurrency}
        currency={editingCurrency}
      />
    </div>
  );
};
