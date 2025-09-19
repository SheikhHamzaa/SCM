"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X, DollarSign } from "lucide-react";

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  createdAt: Date;
}

interface CurrencyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currency: Omit<Currency, 'id' | 'createdAt'>) => void;
  currency?: Currency | null;
}

// Common currencies for quick selection
const commonCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
];

const CurrencyDrawer: React.FC<CurrencyDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  currency,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: 1,
    isBaseCurrency: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currency) {
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        isBaseCurrency: currency.isBaseCurrency,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        symbol: "",
        exchangeRate: 1,
        isBaseCurrency: false,
      });
    }
    setErrors({});
  }, [currency, isOpen]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };



  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Currency code is required";
    } else if (formData.code.length !== 3) {
      newErrors.code = "Currency code must be exactly 3 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Currency name is required";
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Currency symbol is required";
    }

    if (!formData.isBaseCurrency && (formData.exchangeRate <= 0)) {
      newErrors.exchangeRate = "Exchange rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        code: formData.code.toUpperCase(),
        name: formData.name,
        symbol: formData.symbol,
        exchangeRate: formData.isBaseCurrency ? 1 : formData.exchangeRate,
        isBaseCurrency: formData.isBaseCurrency,
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-h-full">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <DrawerTitle className="text-lg font-semibold text-gray-900">
                  {currency ? "Edit Currency" : "Add New Currency"}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-600">
                  {currency ? "Update currency information" : "Add a new currency to your system"}
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4">
          <div className="space-y-6">
            {/* Currency Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                Currency Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                placeholder="e.g., USD, EUR, GBP"
                maxLength={3}
                className={`${errors.code ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.code && <p className="text-xs text-red-600">{errors.code}</p>}
            </div>

            {/* Currency Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Currency Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., US Dollar, Euro, British Pound"
                className={`${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Currency Symbol */}
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-sm font-medium text-gray-700">
                Currency Symbol <span className="text-red-500">*</span>
              </Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleInputChange("symbol", e.target.value)}
                placeholder="e.g., $, €, £"
                className={`${errors.symbol ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.symbol && <p className="text-xs text-red-600">{errors.symbol}</p>}
            </div>

            {/* Base Currency Toggle */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isBaseCurrency"
                  checked={formData.isBaseCurrency}
                  onChange={(e) => handleInputChange("isBaseCurrency", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isBaseCurrency" className="text-sm font-medium text-gray-700">
                  Set as Base Currency
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Base currency is used as the reference for exchange rates (rate = 1.0000)
              </p>
            </div>

            {/* Exchange Rate */}
            {!formData.isBaseCurrency && (
              <div className="space-y-2">
                <Label htmlFor="exchangeRate" className="text-sm font-medium text-gray-700">
                  Exchange Rate <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={formData.exchangeRate}
                  onChange={(e) => handleInputChange("exchangeRate", parseFloat(e.target.value) || 0)}
                  placeholder="1.0000"
                  className={`${errors.exchangeRate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.exchangeRate && <p className="text-xs text-red-600">{errors.exchangeRate}</p>}
                <p className="text-xs text-gray-500">
                  How many units of this currency equal 1 unit of the base currency
                </p>
              </div>
            )}
          </div>
        </form>

        <DrawerFooter className="pt-6">
          <div className="flex gap-3">
            <Button type="submit" onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {currency ? "Update Currency" : "Add Currency"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CurrencyDrawer;
