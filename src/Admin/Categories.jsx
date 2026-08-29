import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { Tag, Edit2, Trash2, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCat, setEditCat] = useState(null);
    const [form, setForm] = useState({ name: '', slug: '' });
    const [toast, setToast] = useState(null);

    const fetchData = () => {
        setLoading(true);
        Api.get('admin/categories/')
            .then(res => setCategories(res.data))
            .catch(() => showToast('Failed to load categories', 'error'))
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openAdd = () => {
        setEditCat(null);
        setForm({ name: '', slug: '' });
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditCat(cat);
        setForm({ name: cat.name, slug: cat.slug });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name.trim()) {
            showToast('Name is required', 'error');
            return;
        }
        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const data = { name: form.name, slug };

        const request = editCat
            ? Api.put(`admin/categories/${editCat.id}/`, data)
            : Api.post('admin/categories/', data);

        request
            .then(() => { 
                setShowModal(false); 
                fetchData(); 
                showToast(`Category ${editCat ? 'updated' : 'created'} successfully`);
            })
            .catch(err => {
                showToast(err.response?.data?.detail || 'Failed to save category', 'error');
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
            Api.delete(`admin/categories/${id}/`)
                .then(() => {
                    fetchData();
                    showToast('Category deleted successfully');
                })
                .catch(() => showToast('Failed to delete category', 'error'));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product catalog structure.</p>
                </div>
                <button 
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                    <div className="h-12 border-b border-gray-100 bg-gray-50" />
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 border-b border-gray-50" />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Tag size={32} className="mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-900 mb-1">No categories found</p>
                            <p className="text-sm">Get started by creating a new product category.</p>
                            <button 
                                onClick={openAdd}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                <Plus size={16} /> Add First Category
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                                        <th className="px-6 py-3 font-medium">Category Name</th>
                                        <th className="px-6 py-3 font-medium">URL Slug</th>
                                        <th className="px-6 py-3 font-medium">Products</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                                                        <Tag size={14} />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">/{cat.slug}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {cat.product_count} items
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEdit(cat)}
                                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editCat ? 'Edit Category' : 'New Category'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Handmade Pottery"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL Slug <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={e => setForm({ ...form, slug: e.target.value })}
                                        placeholder="handmade-pottery"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5">Leave blank to auto-generate from the name.</p>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editCat ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Toast ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg ${
                            toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
                        }`}
                    >
                        {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default Categories;
