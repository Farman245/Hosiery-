import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { Product } from '../types';

export default function Products() {
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', category: '', rate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.rate) return;
    
    const productData = { name: form.name, category: form.category, rate: Number(form.rate) };
    
    if (form.id) {
      editProduct(form.id, productData);
    } else {
      addProduct(productData);
    }
    
    setIsOpen(false);
    setForm({ id: '', name: '', category: '', rate: '' });
  };

  const openEdit = (product: Product) => {
    setForm({ id: product.id, name: product.name, category: product.category, rate: product.rate.toString() });
    setIsOpen(true);
  };

  const openAdd = () => {
    setForm({ id: '', name: '', category: '', rate: '' });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button 
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => openEdit(product)}
                className="text-gray-400 hover:text-indigo-600"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { if(window.confirm('Are you sure you want to delete this product?')) deleteProduct(product.id); }}
                className="text-gray-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <Tag className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.category || 'Uncategorized'}</p>
            <p className="text-indigo-600 font-semibold mt-3">Rs. {(product.rate || 0).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{form.id ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Socks, Vests" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (Per Item)</label>
                <input required type="number" min="0" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 150" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
