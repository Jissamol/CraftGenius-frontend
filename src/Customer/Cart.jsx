import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Api from '../services/Api';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchCart = () => {
    setLoading(true);
    Api.get('cart/')
      .then(res => setCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const updateQty = async (itemId, quantity) => {
    try {
      const res = await Api.put(`cart/update/${itemId}/`, { quantity });
      setCart(res.data);
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await Api.delete(`cart/remove/${itemId}/`);
      setCart(res.data);
      showToast('success', 'Item removed from cart');
    } catch {
      showToast('error', 'Failed to remove item');
    }
  };

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + tax + shipping;

  /* ── Skeleton Loader ── */
  const Skeleton = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse border border-gray-100">
            <div className="w-24 h-24 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:w-96 w-full">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-64" />
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] py-4">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1F1F] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shopping Cart
          </h1>
          <p className="text-gray-500">Review your handmade items before checkout</p>
        </div>
        {!loading && items.length > 0 && (
          <div className="px-4 py-2 bg-[#F7F6F2] rounded-xl border border-gray-100 text-sm font-bold text-[#8A6A55]">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </div>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="w-24 h-24 rounded-full bg-[#F7F6F2] flex items-center justify-center mb-6 text-4xl">🛒</div>
          <h3 className="text-2xl font-bold text-[#1F1F1F] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your cart is empty
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-sm">
            Looks like you haven't added any beautiful handmade crafts to your cart yet.
          </p>
          <Link to="/customer/marketplace" className="px-8 py-3.5 bg-[#1F1F1F] text-white rounded-full font-bold hover:bg-[#333] transition-colors flex items-center gap-2 shadow-lg shadow-black/10">
            <FiShoppingBag size={18} /> Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-[24px] p-4 flex flex-col sm:flex-row gap-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  {/* Delete Button (Absolute on Desktop, top right on mobile) */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 sm:top-1/2 sm:-translate-y-1/2 sm:right-6 w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  {/* Image */}
                  <Link to={`/customer/product/${item.product}`} className="block w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-[#F7F6F2] flex-shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1 pr-10">
                    <div>
                      <Link to={`/customer/product/${item.product}`}>
                        <h3 className="font-bold text-lg text-[#1F1F1F] hover:text-[#8A6A55] transition-colors truncate">{item.product_name}</h3>
                      </Link>
                      <p className="text-sm text-gray-400 mb-1">by <span className="font-medium text-gray-600">{item.seller_name}</span></p>
                      
                      {/* Price */}
                      <p className="font-bold text-[#1F1F1F] mt-2">₹{item.product_price}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      {/* Qty Selector */}
                      <div className="flex items-center gap-3 bg-[#F7F6F2] px-3 py-1.5 rounded-full">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <div className="text-sm font-medium">
                        {item.stock > 0 ? (
                          <span className="text-emerald-600">{item.stock} available</span>
                        ) : (
                          <span className="text-red-500">Out of stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 w-full flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-28"
            >
              <h3 className="text-xl font-bold text-[#1F1F1F] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1F1F]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-[#1F1F1F]">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#1F1F1F]">
                    {shipping === 0 ? <span className="text-emerald-600 uppercase tracking-wide text-xs">Free</span> : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {subtotal < 999 && (
                <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-800 text-center">
                    Add ₹{(999 - subtotal).toFixed(2)} more to unlock FREE shipping!
                  </p>
                  <div className="w-full h-1.5 bg-amber-200/50 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1F1F1F]">Total</span>
                  <span className="text-2xl font-bold text-[#1F1F1F]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/customer/checkout"
                className="w-full py-4 bg-[#1F1F1F] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors shadow-lg shadow-black/10"
              >
                Proceed to Checkout <FiArrowRight size={16} />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span>Secure Checkout</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Fast Shipping</span>
              </div>
            </motion.div>
          </div>

        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-[#1F1F1F] text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cart;
