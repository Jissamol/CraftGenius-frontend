import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import { ShoppingCart, MapPin, Receipt, Package, CheckCircle2, AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [toast, setToast] = useState(null);
    const [address, setAddress] = useState({
        fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    useEffect(() => {
        Api.get('cart/').then(res => setCart(res.data)).catch(() => { }).finally(() => setLoading(false));
        // Pre-fill from profile
        Api.get('customer/profile/').then(res => {
            const d = res.data;
            setAddress(a => ({
                ...a,
                fullName: d.name || '',
                phone: d.phone || '',
                address: d.address || '',
                city: d.city || '',
                state: d.state || '',
                pincode: d.pincode || ''
            }));
        }).catch(() => { });
    }, []);

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

    const items = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + tax + shipping;

    const handleChange = (e) => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));

    const placeOrder = async () => {
        if (!address.fullName || !address.phone || !address.address || !address.city || !address.pincode) {
            showToast('error', 'Please fill all required address fields');
            return;
        }
        setPlacing(true);
        try {
            const res = await Api.post('stripe/create-session/');
            if (res.data.url) {
                // Redirect to Stripe Checkout
                window.location.href = res.data.url;
            } else {
                showToast('error', 'Failed to create checkout session');
            }
        } catch (err) {
            showToast('error', err.response?.data?.error || 'Checkout failed');
        }
        setPlacing(false);
    };

    if (loading) return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
            <div className="h-8 bg-gray-200 w-48 rounded-lg mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[500px] bg-gray-100 rounded-2xl" />
                <div className="h-[400px] bg-gray-100 rounded-2xl" />
            </div>
        </div>
    );

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart size={32} className="text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/customer/marketplace')}
                        className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Explore Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => navigate('/customer/marketplace')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3 font-medium"
                    >
                        <ArrowLeft size={16} /> Back to shopping
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-100">
                    <ShieldCheck size={18} /> Secure SSL Checkout
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* ── Delivery Address Form (2/3 width) ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                                <p className="text-sm text-gray-500">Where should we send your order?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                                    name="fullName" value={address.fullName} onChange={handleChange} placeholder="John Doe" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                                    name="phone" value={address.phone} onChange={handleChange} placeholder="+91 98765 43210" 
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none" 
                                    name="address" value={address.address} onChange={handleChange} placeholder="House/Flat No, Building Name, Street" rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                                    name="city" value={address.city} onChange={handleChange} placeholder="City Name" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                                    name="state" value={address.state} onChange={handleChange} placeholder="State Name" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / ZIP *</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                                    name="pincode" value={address.pincode} onChange={handleChange} placeholder="6-digit pincode" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Order Summary (1/3 width) ── */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm sticky top-24">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                <Receipt size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                        {item.product_image ? (
                                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={20} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-sm font-bold text-gray-900 flex items-center">
                                        ₹{item.line_total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Estimated Tax (5%)</span>
                                <span className="font-medium text-gray-900">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'font-bold text-emerald-600' : 'font-medium text-gray-900'}>
                                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-6 pt-6 border-t border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total due</p>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <button
                            onClick={placeOrder}
                            disabled={placing}
                            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {placing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Redirecting to payment...
                                </>
                            ) : (
                                'Proceed to Payment'
                            )}
                        </button>
                        <p className="text-center text-[11px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                            Payments processed securely by Stripe <ShieldCheck size={12} />
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Toast ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl ${
                            toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
                        }`}
                    >
                        {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default Checkout;
