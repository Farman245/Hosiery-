import React from 'react';
import { useStore } from '../StoreContext';
import { Package, Truck, CheckCircle, Clock, DollarSign, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { orders, deliveries, payments, suppliers, products } = useStore();

  const totalOrders = orders.length;
  
  const totalItemsOrdered = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalItemsReceived = deliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalItemsPending = totalItemsOrdered - totalItemsReceived;

  const totalAmount = orders.reduce((sum, o) => sum + (o.totalQuantity * o.rate), 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalRemainingAmount = totalAmount - totalPaid;

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Items Received', value: totalItemsReceived, icon: Truck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Items', value: totalItemsPending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Amount', value: `Rs. ${(totalAmount || 0).toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Amount Paid', value: `Rs. ${(totalPaid || 0).toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Remaining Balance', value: `Rs. ${(totalRemainingAmount || 0).toLocaleString()}`, icon: CheckCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Deliveries</h3>
          {deliveries.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent deliveries</p>
          ) : (
            <div className="space-y-4">
              {deliveries.slice(-5).reverse().map(d => {
                const order = orders.find(o => o.id === d.orderId);
                const supplier = suppliers.find(s => s.id === order?.supplierId);
                const product = products.find(p => p.id === order?.productId);
                return (
                  <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{supplier?.name} - {product?.name}</p>
                      <p className="text-sm text-gray-500">{new Date(d.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{d.quantity}</p>
                      <p className="text-xs text-gray-500">Received</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Payments</h3>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent payments</p>
          ) : (
            <div className="space-y-4">
              {payments.slice(-5).reverse().map(p => {
                const order = orders.find(o => o.id === p.orderId);
                const supplier = suppliers.find(s => s.id === order?.supplierId);
                return (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{supplier?.name}</p>
                      <p className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">Rs. {(p.amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Paid</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
