import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, Edit2, Phone, MapPin } from 'lucide-react';
import { Supplier } from '../types';
import SupplierDetails from './SupplierDetails';

export default function Suppliers() {
  const { suppliers, addSupplier, editSupplier, deleteSupplier } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', phone: '', address: '' });
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    
    if (form.id) {
      editSupplier(form.id, { name: form.name, phone: form.phone, address: form.address });
    } else {
      addSupplier({ name: form.name, phone: form.phone, address: form.address });
    }
    
    setIsOpen(false);
    setForm({ id: '', name: '', phone: '', address: '' });
  };

  const openEdit = (supplier: Supplier) => {
    setForm({ id: supplier.id, name: supplier.name, phone: supplier.phone, address: supplier.address });
    setIsOpen(true);
  };

  const openAdd = () => {
    setForm({ id: '', name: '', phone: '', address: '' });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => openEdit(supplier)}
                className="text-gray-400 hover:text-indigo-600"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { if(window.confirm('Are you sure you want to delete this supplier?')) deleteSupplier(supplier.id); }}
                className="text-gray-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <h3 
              onClick={() => setSelectedSupplierId(supplier.id)}
              className="text-lg font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer mb-4 inline-block"
            >
              {supplier.name}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{supplier.phone || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{supplier.address || 'Unknown'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{form.id ? 'Edit Supplier' : 'Add New Supplier'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0300-0000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSupplierId && (
        <SupplierDetails supplierId={selectedSupplierId} onClose={() => setSelectedSupplierId(null)} />
      )}
    </div>
  );
}
