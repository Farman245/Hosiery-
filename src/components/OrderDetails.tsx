import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { X, Edit2, Trash2, Plus, Calendar, FileText } from 'lucide-react';

interface Props {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetails({ orderId, onClose }: Props) {
  const { orders, suppliers, products, deliveries, payments, addDelivery, editDelivery, deleteDelivery, addPayment, editPayment, deletePayment } = useStore();
  
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const supplier = suppliers.find(s => s.id === order.supplierId);
  const product = products.find(p => p.id === order.productId);

  const orderDeliveries = deliveries.filter(d => d.orderId === orderId);
  const orderPayments = payments.filter(p => p.orderId === orderId);

  const totalReceived = orderDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = order.totalQuantity * order.rate;
  const remainingQty = order.totalQuantity - totalReceived;
  const remainingAmount = totalAmount - totalPaid;

  // Delivery Form State
  const [delForm, setDelForm] = useState({ id: '', quantity: '', note: '' });
  const [isAddingDel, setIsAddingDel] = useState(false);

  const handleDelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delForm.quantity) return;
    if (delForm.id) {
      editDelivery(delForm.id, { orderId, quantity: Number(delForm.quantity), date: new Date().toISOString(), note: delForm.note });
    } else {
      addDelivery({ orderId, quantity: Number(delForm.quantity), date: new Date().toISOString(), note: delForm.note });
    }
    setDelForm({ id: '', quantity: '', note: '' });
    setIsAddingDel(false);
  };

  const openEditDel = (d: any) => {
    setDelForm({ id: d.id, quantity: d.quantity.toString(), note: d.note });
    setIsAddingDel(true);
  };

  // Payment Form State
  const [payForm, setPayForm] = useState({ id: '', amount: '', note: '' });
  const [isAddingPay, setIsAddingPay] = useState(false);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.amount) return;
    if (payForm.id) {
      editPayment(payForm.id, { orderId, amount: Number(payForm.amount), date: new Date().toISOString(), note: payForm.note });
    } else {
      addPayment({ orderId, amount: Number(payForm.amount), date: new Date().toISOString(), note: payForm.note });
    }
    setPayForm({ id: '', amount: '', note: '' });
    setIsAddingPay(false);
  };

  const openEditPay = (p: any) => {
    setPayForm({ id: p.id, amount: p.amount.toString(), note: p.note });
    setIsAddingPay(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">{supplier?.name} - {product?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border-b border-gray-100">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-blue-600 font-medium">Total / Received</p>
            <p className="text-xl font-bold text-blue-900 mt-1">{totalReceived} / {order.totalQuantity}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <p className="text-sm text-orange-600 font-medium">Pending Items</p>
            <p className="text-xl font-bold text-orange-900 mt-1">{remainingQty}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <p className="text-sm text-emerald-600 font-medium">Total / Paid</p>
            <p className="text-xl font-bold text-emerald-900 mt-1">Rs. {(totalPaid || 0).toLocaleString()} / {(totalAmount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <p className="text-sm text-red-600 font-medium">Remaining Balance</p>
            <p className="text-xl font-bold text-red-900 mt-1">Rs. {(remainingAmount || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Two Columns: Deliveries and Payments */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50">
          
          {/* Deliveries Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Deliveries (Items)</h3>
              {!isAddingDel && (
                <button onClick={() => { setDelForm({ id: '', quantity: '', note: '' }); setIsAddingDel(true); }} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4" /> New Delivery
                </button>
              )}
            </div>

            {isAddingDel && (
              <form onSubmit={handleDelSubmit} className="bg-indigo-50 p-4 rounded-xl mb-6 space-y-3 border border-indigo-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                    <input required type="number" min="1" value={delForm.quantity} onChange={e => setDelForm({...delForm, quantity: e.target.value})} className="w-full border border-indigo-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Note</label>
                    <input type="text" value={delForm.note} onChange={e => setDelForm({...delForm, note: e.target.value})} className="w-full border border-indigo-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsAddingDel(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-indigo-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {orderDeliveries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No deliveries recorded</p>
              ) : orderDeliveries.map(d => (
                <div key={d.id} className="flex items-start justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div>
                    <p className="font-bold text-gray-900">{(d.quantity || 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">items</span></p>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(d.date).toLocaleDateString()}</span>
                      {d.note && <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> {d.note}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditDel(d)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete this delivery?')) deleteDelivery(d.id); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Payments (Amount)</h3>
              {!isAddingPay && (
                <button onClick={() => { setPayForm({ id: '', amount: '', note: '' }); setIsAddingPay(true); }} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4" /> New Payment
                </button>
              )}
            </div>

            {isAddingPay && (
              <form onSubmit={handlePaySubmit} className="bg-emerald-50 p-4 rounded-xl mb-6 space-y-3 border border-emerald-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Amount (Rs)</label>
                    <input required type="number" min="1" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Note</label>
                    <input type="text" value={payForm.note} onChange={e => setPayForm({...payForm, note: e.target.value})} className="w-full border border-emerald-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsAddingPay(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-emerald-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {orderPayments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No payments recorded</p>
              ) : orderPayments.map(p => (
                <div key={p.id} className="flex items-start justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div>
                    <p className="font-bold text-emerald-600">Rs. {(p.amount || 0).toLocaleString()}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(p.date).toLocaleDateString()}</span>
                      {p.note && <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> {p.note}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditPay(p)} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete this payment?')) deletePayment(p.id); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
