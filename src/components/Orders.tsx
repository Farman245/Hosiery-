import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import { Order } from '../types';
import OrderDetails from './OrderDetails';

export default function Orders() {
  const { orders, suppliers, products, deliveries, payments, addOrder, editOrder, deleteOrder } = useStore();
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ id: '', supplierId: '', productId: '', totalQuantity: '', rate: '' });

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pid = e.target.value;
    const prod = products.find(p => p.id === pid);
    setForm({ ...form, productId: pid, rate: prod && !form.id ? prod.rate.toString() : form.rate });
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplierId || !form.productId || !form.totalQuantity || !form.rate) return;
    
    const orderData = {
      supplierId: form.supplierId,
      productId: form.productId,
      totalQuantity: parseInt(form.totalQuantity),
      rate: parseInt(form.rate),
      date: new Date().toISOString()
    };

    if (form.id) {
      editOrder(form.id, orderData);
    } else {
      addOrder(orderData);
    }
    
    setIsOrderModalOpen(false);
    setForm({ id: '', supplierId: '', productId: '', totalQuantity: '', rate: '' });
  };

  const openEdit = (order: Order) => {
    setForm({
      id: order.id,
      supplierId: order.supplierId,
      productId: order.productId,
      totalQuantity: order.totalQuantity.toString(),
      rate: order.rate.toString()
    });
    setIsOrderModalOpen(true);
  };

  const openAdd = () => {
    setForm({ id: '', supplierId: '', productId: '', totalQuantity: '', rate: '' });
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders & Ledger</h2>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Supplier</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Qty / Received</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rate</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Paid / Pending</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">No orders found</td>
                </tr>
              ) : orders.map(order => {
                const supplier = suppliers.find(s => s.id === order.supplierId);
                const product = products.find(p => p.id === order.productId);
                
                const received = deliveries.filter(d => d.orderId === order.id).reduce((sum, d) => sum + d.quantity, 0);
                const paid = payments.filter(p => p.orderId === order.id).reduce((sum, p) => sum + p.amount, 0);
                
                const totalAmount = order.totalQuantity * order.rate;
                const remainingAmount = totalAmount - paid;
                
                const progress = Math.min(100, Math.round((received / order.totalQuantity) * 100));
                const statusColor = progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-indigo-500' : 'bg-gray-300';

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{supplier?.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product?.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{(order.totalQuantity || 0).toLocaleString()}</span>
                        <span className="text-xs text-green-600 font-medium">{(received || 0).toLocaleString()} received</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Rs. {(order.rate || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">Rs. {(totalAmount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-emerald-600 font-medium">Rs. {(paid || 0).toLocaleString()}</span>
                        <span className="text-xs text-red-500 font-medium">Rs. {(remainingAmount || 0).toLocaleString()} pending</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                          <div className={`h-full rounded-full ${statusColor}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"
                          title="Details / Ledger"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => openEdit(order)}
                          className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Are you sure you want to delete this order and all its ledger entries?')) deleteOrder(order.id); }}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{form.id ? 'Edit Order' : 'New Order'}</h3>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select required value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select required value={form.productId} onChange={handleProductChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity</label>
                  <input required type="number" min="1" value={form.totalQuantity} onChange={e => setForm({...form, totalQuantity: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (Rs)</label>
                  <input required type="number" min="0" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 150" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal (Deliveries & Payments) */}
      {selectedOrderId && (
        <OrderDetails orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  );
}
