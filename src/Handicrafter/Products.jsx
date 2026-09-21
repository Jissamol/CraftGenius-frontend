import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Api from '../services/Api';
import './Products.css';

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryFilter) params.category = categoryFilter;
            const res = await Api.get('products/my/', { params });
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await Api.get('categories/');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter]);

    const handleToggleActive = async (product) => {
        try {
            await Api.put(`products/${product.id}/`, { is_active: !product.is_active });
            setProducts(prev =>
                prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p)
            );
            showToast(`Product ${!product.is_active ? 'activated' : 'deactivated'}`, 'success');
        } catch (err) {
            showToast('Failed to update product', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await Api.delete(`products/${id}/delete/`);
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product deleted successfully', 'success');
        } catch (err) {
            showToast('Failed to delete product', 'error');
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div>
            <div className="page-header products-header">
                <button
                    onClick={() => navigate('/handicrafter/add-product')}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.55)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4)'}
                >
                    <PlusCircle size={17} className="transition-transform duration-200 group-hover:rotate-90" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card filters-bar">
                <div className="search-wrapper">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="products-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card product-card">
                            <div className="skeleton" style={{ height: 180, borderRadius: '16px 16px 0 0' }}></div>
                            <div style={{ padding: 20 }}>
                                <div className="skeleton" style={{ width: '70%', height: 18, marginBottom: 10 }}></div>
                                <div className="skeleton" style={{ width: '40%', height: 14 }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="glass-card empty-state">
                    <span className="empty-icon">📦</span>
                    <h3>No products yet</h3>
                    <p>Start selling by adding your first product</p>
                    <button
                        onClick={() => navigate('/handicrafter/add-product')}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                        }}
                    >
                        <PlusCircle size={17} className="transition-transform duration-200 group-hover:rotate-90" />
                        Add Product
                    </button>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="glass-card product-card">
                            <div className="product-image">
                                {product.primary_image_url ? (
                                    <img src={product.primary_image_url} alt={product.name} />
                                ) : (
                                    <div className="no-image">📦</div>
                                )}
                                <span className={`badge product-status ${product.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                    {product.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-meta">
                                    <span className="product-price">₹{product.price}</span>
                                    <span className="product-stock">Stock: {product.stock}</span>
                                </div>
                                {product.category_name && (
                                    <span className="product-category">{product.category_name}</span>
                                )}
                                <div className="product-mini-stats">
                                    <span>⭐ {product.average_rating || 0}</span>
                                    <span>🛒 {product.total_orders || 0}</span>
                                </div>
                                <div className="product-actions">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/handicrafter/add-product?edit=${product.id}`)}>
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className={`btn btn-sm ${product.is_active ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => handleToggleActive(product)}
                                    >
                                        {product.is_active ? '⏸ Deactivate' : '▶ Activate'}
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default Products;
