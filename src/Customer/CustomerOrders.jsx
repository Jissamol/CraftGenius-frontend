import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiX, FiStar, FiTruck, FiCheck, FiClock, FiAlertCircle, FiShoppingBag } from 'react-icons/fi';
import Api from '../services/Api';

/* ── Status config ── */
const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',    color: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400',  icon: FiClock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400',   icon: FiPackage },
  SHIPPED:    { label: 'Shipped',    color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400', icon: FiTruck },
  DELIVERED:  { label: 'Delivered',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', icon: FiCheck },
  CANCELLED:  { label: 'Cancelled',  color: 'bg-red-50 text-red-600 border-red-200',        dot: 'bg-red-400',    icon: FiAlertCircle },
};

const TABS = [
  { value: '',           label: 'All Orders' },
  { value: 'PENDING',    label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED',    label: 'Shipped' },
  { value: 'DELIVERED',  label: 'Delivered' },
  { value: 'CANCELLED',  label: 'Cancelled' },
];

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="text-3xl transition-transform hover:scale-110 focus:outline-none"
        >
          <FiStar
            className={`${(hovered || value) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`}
            size={28}
          />
        </button>
      ))}
    </div>
  );
}

function CustomerOrders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [toast, setToast]         = useState(null);
  const [reviewForm, setReviewForm]   = useState(null);
  const [reviewData, setReviewData]   = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting]   = useState(false);
  const [cancelling, setCancelling]   = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const url = filter ? `orders/customer/?status=${filter}` : 'orders/customer/';
    Api.get(url)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOrders(); }, [filter]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const cancelOrder = async (orderId) => {
    setCancelling(true);
    try {
      await Api.patch(`orders/${orderId}/cancel/`);
      showToast('success', 'Order cancelled successfully');
      fetchOrders();
      setSelected(null);
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Cannot cancel this order');
    } finally {
      setCancelling(false);
    }
  };

  const submitReview = async () => {
    if (!reviewData.comment.trim()) { showToast('error', 'Please write a comment'); return; }
    setSubmitting(true);
    try {
      await Api.post('reviews/', {
        product: reviewForm.productId,
        order: reviewForm.orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      showToast('success', 'Review submitted! Thank you ⭐');
      setReviewForm(null);
      setSelected(null);
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const closeModal = () => { setSelected(null); setReviewForm(null); };

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4 animate-pulse border border-gray-100">
          <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded-full" />
          <div className="w-20 h-5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-[80vh] py-4">

      {/* Page Header */}
     

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map(tab => (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(tab.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              filter === tab.value
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg shadow-black/10'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <Skeleton />
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#F7F6F2] flex items-center justify-center mb-4 text-3xl">📦</div>
          <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No orders found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {filter ? `You have no ${filter.toLowerCase()} orders.` : 'Start shopping to see your orders here.'}
          </p>
          <a href="/customer/marketplace"
            className="px-6 py-3 bg-[#1F1F1F] text-white rounded-full font-semibold text-sm hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <FiShoppingBag size={16} /> Browse Marketplace
          </a>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelected(order)}
                className="group bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer transition-all duration-200"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F7F6F2]">
                  {order.product_image
                    ? <img src={order.product_image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                  }
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1F1F1F] text-base truncate group-hover:text-[#8A6A55] transition-colors">
                    {order.product_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                    <span>Order #{order.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Qty: {order.quantity}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg text-[#1F1F1F]">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative p-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F7F6F2] flex-shrink-0">
                    {selected.product_image
                      ? <img src={selected.product_image} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                    }
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1F1F1F] text-lg leading-snug">{selected.product_name}</h2>
                    <p className="text-gray-400 text-sm">Order #{selected.id}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <FiX size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Status', value: <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selected.status]?.color}`}>{STATUS_CONFIG[selected.status]?.label || selected.status}</span> },
                    { label: 'Amount', value: <span className="font-bold text-[#1F1F1F]">₹{parseFloat(selected.total_amount).toLocaleString('en-IN')}</span> },
                    { label: 'Quantity', value: selected.quantity },
                    { label: 'Ordered On', value: new Date(selected.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                    ...(selected.tracking_number ? [{ label: 'Tracking #', value: selected.tracking_number }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#F7F6F2] rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                      <div className="text-sm font-semibold text-[#1F1F1F]">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Cancel Button */}
                {!['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(selected.status) && !reviewForm && (
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => cancelOrder(selected.id)}
                    disabled={cancelling}
                    className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </motion.button>
                )}

                {/* Write Review Button */}
                {selected.status === 'DELIVERED' && !reviewForm && (
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => { setReviewForm({ orderId: selected.id, productId: selected.product }); setReviewData({ rating: 5, comment: '' }); }}
                    className="w-full py-3 rounded-xl bg-[#1F1F1F] text-white font-semibold text-sm hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
                  >
                    <FiStar size={16} /> Write a Review
                  </motion.button>
                )}

                {/* Review Form */}
                <AnimatePresence>
                  {reviewForm && reviewForm.orderId === selected.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#F7F6F2] rounded-2xl p-5 space-y-4"
                    >
                      <h4 className="font-bold text-[#1F1F1F]">Rate this product</h4>
                      <StarPicker value={reviewData.rating} onChange={r => setReviewData(d => ({ ...d, rating: r }))} />
                      <textarea
                        placeholder="Share your experience with this handmade product..."
                        value={reviewData.comment}
                        onChange={e => setReviewData(d => ({ ...d, comment: e.target.value }))}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8DDD4] resize-none"
                      />
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={submitReview} disabled={submitting}
                          className="flex-1 py-2.5 bg-[#1F1F1F] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit Review'}
                        </motion.button>
                        <button onClick={() => setReviewForm(null)} className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
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

export default CustomerOrders;
