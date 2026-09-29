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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast]         = useState(null);
  const [reviewForm, setReviewForm]   = useState(null);
  const [reviewData, setReviewData]   = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting]   = useState(false);
  const [cancelling, setCancelling]   = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const url = filter ? `orders/customer/?status=${filter}` : 'orders/customer/';
    Api.get(url)
      .then(res => {
        setOrders(res.data);
        if (res.data && res.data.length > 0) {
          setSelected(res.data[0]);
        } else {
          setSelected(null);
        }
      })
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

  const closeModal = () => { setIsModalOpen(false); setReviewForm(null); };

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-[1.5rem] p-6 flex items-center gap-6 animate-pulse border border-gray-100">
          <div className="w-24 h-24 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrderDetailsContent = (isModal = false) => {
    if (!selected) {
      if (!isModal) {
        return (
          <div className="h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 rounded-full bg-[#F7F6F2] flex items-center justify-center mb-6 text-4xl">🧾</div>
            <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">Select an order</h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">Click on an order from the list to view its details, track status, or write a review.</p>
          </div>
        );
      }
      return null;
    }

    return (
      <div className={`bg-white h-full flex flex-col overflow-hidden ${isModal ? 'rounded-[28px] w-full shadow-2xl' : 'rounded-[2rem] border border-gray-100 shadow-sm'}`}>
        {/* Header */}
        <div className="relative p-6 lg:p-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F7F6F2] shadow-inner flex-shrink-0">
              {selected.product_image
                ? <img src={selected.product_image} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
              }
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="font-bold text-[#1F1F1F] text-xl lg:text-2xl leading-snug mb-1 truncate">{selected.product_name}</h2>
              <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">Order #{selected.id}</p>
            </div>
          </div>
          {isModal && (
            <button onClick={closeModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Status', value: <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selected.status]?.color}`}>{STATUS_CONFIG[selected.status]?.label || selected.status}</span> },
              { label: 'Amount', value: <span className="font-black text-[#1F1F1F] text-lg">₹{parseFloat(selected.total_amount).toLocaleString('en-IN')}</span> },
              { label: 'Quantity', value: <span className="font-semibold">{selected.quantity}</span> },
              { label: 'Ordered On', value: <span className="font-semibold">{new Date(selected.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
              ...(selected.tracking_number ? [{ label: 'Tracking #', value: <span className="font-semibold">{selected.tracking_number}</span> }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F7F6F2] rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">{label}</p>
                <div className="text-sm text-[#1F1F1F]">{value}</div>
              </div>
            ))}
          </div>

          {!['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(selected.status) && !reviewForm && (
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => cancelOrder(selected.id)}
              disabled={cancelling}
              className="w-full py-4 rounded-2xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </motion.button>
          )}

          {selected.status === 'DELIVERED' && !reviewForm && (
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => { setReviewForm({ orderId: selected.id, productId: selected.product }); setReviewData({ rating: 5, comment: '' }); }}
              className="w-full py-4 rounded-2xl bg-[#1F1F1F] text-white font-bold text-sm hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <FiStar size={18} /> Write a Review
            </motion.button>
          )}

          <AnimatePresence>
            {reviewForm && reviewForm.orderId === selected.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-[#F7F6F2] rounded-2xl p-6 space-y-5 overflow-hidden"
              >
                <h4 className="font-bold text-[#1F1F1F] text-lg">Rate this product</h4>
                <StarPicker value={reviewData.rating} onChange={r => setReviewData(d => ({ ...d, rating: r }))} />
                <textarea
                  placeholder="Share your experience with this handmade product..."
                  value={reviewData.comment}
                  onChange={e => setReviewData(d => ({ ...d, comment: e.target.value }))}
                  rows={4}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] resize-none"
                />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={submitReview} disabled={submitting}
                    className="flex-1 py-3 bg-[#1F1F1F] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                  <button onClick={() => setReviewForm(null)} className="px-5 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] py-6">
      
      {/* Filter Tabs (Full Width) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .overflow-x-auto::-webkit-scrollbar { display: none; }
        `}</style>
        {TABS.map(tab => (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(tab.value)}
            className={`whitespace-nowrap shrink-0 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
              filter === tab.value
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-xl shadow-black/10'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1F1F1F] hover:shadow-sm'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Pane: Orders List */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col gap-6">

          {loading ? (
            <Skeleton />
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm"
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
                const isSelected = selected?.id === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -2, scale: 1.005 }}
                    onClick={() => { setSelected(order); setIsModalOpen(true); }}
                    className={`group relative bg-white rounded-[1.5rem] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 ${isSelected ? 'border-[#1F1F1F] ring-1 ring-[#1F1F1F]' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-[#F7F6F2] shadow-inner">
                      {order.product_image
                        ? <img src={order.product_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
                      }
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">ORDER #{order.id}</span>
                      </div>
                      <h3 className="font-bold text-[#1F1F1F] text-lg sm:text-xl truncate mb-1">
                        {order.product_name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                        <span>Qty: {order.quantity}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-3 mt-4 sm:mt-0">
                      <p className="font-black text-2xl text-[#1F1F1F]">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane: Details (Desktop) */}
        <div className="hidden lg:block w-full lg:w-1/2 xl:w-7/12 sticky top-24 h-[calc(100vh-120px)]">
          {renderOrderDetailsContent(false)}
        </div>
      </div>

      {/* Mobile Order Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 lg:hidden"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              {renderOrderDetailsContent(true)}
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
