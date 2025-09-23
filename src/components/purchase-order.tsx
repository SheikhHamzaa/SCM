"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Package } from "lucide-react";
import CreatePurchaseOrder from "./create-purchase-order";

// Types
interface PurchaseOrder {
  id: string;
  portOfDischarge: string;
  destination: string;
  orderDate: string;
  orderReference: string;
  supplier: string;
  item: string;
  designNo: string;
  image: string;
  baleQty: number;
  pcsPerBale: number;
  totalQtyPcs: number;
  totalYards: number;
  ratePerYard: number;
  value: number;
}

const PurchaseOrder = () => {
  // State management
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // Handlers
  const handleCreateOrder = () => {
    setIsCreateOrderOpen(true);
  };

  const handleCloseCreateOrder = () => {
    setIsCreateOrderOpen(false);
  };

  const handleSavePurchaseOrder = (newOrder: PurchaseOrder) => {
    setPurchaseOrders((prev) => [...prev, newOrder]);
  };

  const totalValue = purchaseOrders.reduce(
    (sum, order) => sum + order.value,
    0
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Compact QuickBooks Header */}
      <div className="bg-white border-b border-[#E1E5E9] px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0176D3] to-[#014F86] rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2E2E2E] tracking-tight">
                Purchase Orders
              </h1>
              <p className="text-[#707070] text-[11px] -mt-0.5">
                Manage orders and track inventory
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreateOrder}
            className="px-3 py-1.5 bg-[#0176D3] hover:bg-[#014F86] text-white rounded-md font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Compact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg border border-[#E1E5E9] p-3 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#707070] text-[10px] font-medium mb-1 uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-[#2E2E2E] group-hover:text-[#0176D3] transition-colors">
                  {purchaseOrders.length}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-[#EBF4FA] to-[#DBEAFE] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-4.5 h-4.5 text-[#0176D3]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E1E5E9] p-3 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#707070] text-[10px] font-medium mb-1 uppercase tracking-wide">
                  Total Value
                </p>
                <p className="text-xl font-bold text-[#2E2E2E] group-hover:text-[#10B981] transition-colors">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[#10B981] font-bold text-sm">$</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E1E5E9] p-3 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#707070] text-[10px] font-medium mb-1 uppercase tracking-wide">
                  Total Quantity
                </p>
                <p className="text-xl font-bold text-[#2E2E2E] group-hover:text-[#7C3AED] transition-colors">
                  {purchaseOrders
                    .reduce((sum, order) => sum + order.totalQtyPcs, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[#7C3AED] font-bold text-sm">Σ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Data Table */}
        <div className="bg-white rounded-lg border border-[#E1E5E9] shadow-sm overflow-hidden">
          <div className="border-b border-[#E1E5E9] px-4 py-2 bg-gradient-to-r from-[#F8F9FA] to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#2E2E2E] tracking-tight">
                Purchase Orders
              </h2>
              <div className="text-[11px] text-[#707070]">
                {purchaseOrders.length} {purchaseOrders.length === 1 ? 'order' : 'orders'}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F6F7F9] border-b border-[#E3E5E8]">
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Destination
                  </th>
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Order Date
                  </th>
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Order Reference
                  </th>
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Supplier
                  </th>
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Item
                  </th>
                  <th className="text-left py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Design No.
                  </th>
                  <th className="text-center py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Image
                  </th>
                  <th className="text-center py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Bale Qty
                  </th>
                  <th className="text-center py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Pcs/Bale
                  </th>
                  <th className="text-center py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Total Qty
                  </th>
                  <th className="text-center py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Total Yards
                  </th>
                  <th className="text-right py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Rate/Yard
                  </th>
                  <th className="text-right py-1.5 px-2.5 text-[#6B7C93] font-medium text-[10px]">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-[#C1C7CD] mb-2" />
                        <p className="text-[#6B7C93] font-medium text-sm">
                          No purchase orders found
                        </p>
                        <p className="text-[#C1C7CD] text-xs mt-1">
                          Click "Create Order" to add your first order
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F6F7F9] hover:bg-[#FAFBFC] transition-colors duration-150"
                    >
                      <td className="py-2 px-2.5 text-[#393A3D] text-[11px]">
                        {order.destination}
                      </td>
                      <td className="py-2 px-2.5 text-[#393A3D] text-[11px]">
                        {order.orderDate}
                      </td>
                      <td className="py-2 px-2.5 text-[#0077C5] font-medium text-[11px]">
                        {order.orderReference}
                      </td>
                      <td className="py-2 px-2.5 text-[#393A3D] text-[11px]">
                        {order.supplier}
                      </td>
                      <td className="py-2 px-2.5 text-[#393A3D] text-[11px]">
                        {order.item}
                      </td>
                      <td className="py-2 px-2.5 text-[#6B7C93] font-mono text-[11px]">
                        {order.designNo}
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <div className="w-6 h-6 bg-[#F6F7F9] rounded border border-[#E3E5E8] flex items-center justify-center mx-auto">
                          <Package className="w-3 h-3 text-[#C1C7CD]" />
                        </div>
                      </td>
                      <td className="py-2 px-2.5 text-center text-[#393A3D] text-[11px]">
                        {order.baleQty}
                      </td>
                      <td className="py-2 px-2.5 text-center text-[#393A3D] text-[11px]">
                        {order.pcsPerBale}
                      </td>
                      <td className="py-2 px-2.5 text-center text-[#393A3D] font-medium text-[11px]">
                        {order.totalQtyPcs.toLocaleString()}
                      </td>
                      <td className="py-2 px-2.5 text-center text-[#393A3D] text-[11px]">
                        {order.totalYards.toLocaleString()}
                      </td>
                      <td className="py-2 px-2.5 text-right text-[#393A3D] text-[11px]">
                        ${order.ratePerYard.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right text-[#2CA01C] font-semibold text-[11px]">
                        ${order.value.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Purchase Order Component */}
      <CreatePurchaseOrder
        isOpen={isCreateOrderOpen}
        onClose={handleCloseCreateOrder}
        onSave={handleSavePurchaseOrder}
      />
    </div>
  );
};

export default PurchaseOrder;
