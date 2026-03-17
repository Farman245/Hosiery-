import React from 'react';
import { useStore } from '../StoreContext';
import { X, Package, DollarSign, Truck, Wallet } from 'lucide-react';

interface Props {
  supplierId: string;
  onClose: () => void;
}

export default function SupplierDetails({ supplierId, onClose }: Props) {
  const { suppliers, orders, products, deliveries, payments } = useStore();
  
  const supplier = suppliers.find(s => s.id === supplierId);
  if (!supplier) return null;

  const supplierOrders = orders.filter(o => o.supplierId === supplierId);
  
  const totalItemsOrdered = supplierOrders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalAmount = supplierOrders.reduce((sum, o) => sum + (o.totalQuantity * o.rate), 0);
  
  const supplierDeliveries = deliveries.filter(d => supplierOrders.some(o => o.id === d.orderId));
  const totalItemsReceived = supplierDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  
  const supplierPayments = payments.filter(p => supplierOrders.some(o => o.id === p.orderId));
  const totalPaid = supplierPayments.reduce((sum, p) => sum + p.amount, 0);

  const remainingItems = totalItemsOrdered - totalItemsReceived;
  const remainingAmount = totalAmount - totalPaid;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{supplier.name} - Ledger</h2>
            <p className="text-sm text-gray-500 mt-1">{supplier.phone} | {supplier.address}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border-b border-gray-100">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Package className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Ordered</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{(totalItemsOrdered || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600"><Truck className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending Items</p>
              <p className="text-xl font-bold text-orange-900 mt-1">{(remainingItems || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><Wallet className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Paid</p>
              <p className="text-xl font-bold text-emerald-900 mt-1">Rs. {(totalPaid || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-red-600 font-medium">Remaining Balance</p>
              <p className="text-xl font-bold text-red-900 mt-1">Rs. {(remainingAmount || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order History</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Qty / Received</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rate</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Paid / Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {supplierOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found for this supplier.</td>
                  </tr>
                ) : supplierOrders.map(order => {
                  const product = products.find(p => p.id === order.productId);
                  const received = deliveries.filter(d => d.orderId === order.id).reduce((sum, d) => sum + d.quantity, 0);
                  const paid = payments.filter(p => p.orderId === order.id).reduce((sum, p) => sum + p.amount, 0);
                  const orderTotal = order.totalQuantity * order.rate;
                  const orderRemaining = orderTotal - paid;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{(order.totalQuantity || 0).toLocaleString()}</span>
                          <span className="text-xs text-green-600 font-medium">{(received || 0).toLocaleString()} received</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">Rs. {(order.rate || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">Rs. {(orderTotal || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-emerald-600 font-medium">Rs. {(paid || 0).toLocaleString()}</span>
                          <span className="text-xs text-red-500 font-medium">Rs. {(orderRemaining || 0).toLocaleString()} pending</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
