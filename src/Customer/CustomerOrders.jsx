import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiX, FiStar, FiTruck, FiCheck, FiClock,
  FiAlertCircle, FiShoppingBag, FiRotateCcw, FiDollarSign,
  FiShield
} from 'react-icons/fi';
import Api from '../services/Api';

/* ── Status config ── */
const STATUS_CONFIG = {
  PENDING:          { label: 'Pending Payment',  color: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400',  icon: FiClock },
  PROCESSING:       { label: 'Processing',       color: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400',   icon: FiPackage },
  SHIPPED:          { label: 'Shipped',          color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400', icon: FiTruck },
  DELIVERED:        { label: 'Delivered',        color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', icon: FiCheck },
  CANCELLED:        { label: 'Cancelled',        color: 'bg-red-50 text-red-600 border-red-200',        dot: 'bg-red-400',    icon: FiAlertCircle },
  FAILED:           { label: 'Payment Failed',   color: 'bg-red-50 text-red-700 border-red-200',        dot: 'bg-red-500',    icon: FiAlertCircle },
  REFUNDED:         { label: 'Refunded',         color: 'bg-teal-50 text-teal-700 border-teal-200',     dot: 'bg-teal-400',   icon: FiDollarSign },
  RETURN_REQUESTED: { label: 'Return / Refund',  color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400', icon: FiRotateCcw },
  RETURNED:         { label: 'Returned',         color: 'bg-gray-100 text-gray-700 border-gray-300',    dot: 'bg-gray-500',   icon: FiRotateCcw },
  DISPUTED:         { label: 'Disputed',         color: 'bg-pink-50 text-pink-700 border-pink-200',     dot: 'bg-pink-400',   icon: FiAlertCircle },
};

const TABS = [
  { value: '',                 label: 'All Orders' },
  { value: 'PENDING',          label: 'Pending' },
  { value: 'PROCESSING',       label: 'Processing' },
  { value: 'SHIPPED',          label: 'Shipped' },
  { value: 'DELIVERED',        label: 'Delivered' },
  { value: 'CANCELLED',        label: 'Cancelled' },
  { value: 'REFUNDED',         label: 'Refunded' },
  { value: 'RETURN_REQUESTED', label: 'Refund Requests' },
];

const CANCELLATION_REASONS = [
  { value: 'ORDERED_BY_MISTAKE', label: 'Ordered by mistake' },
  { value: 'FOUND_BETTER_PRICE', label: 'Found a better alternative / price' },
  { value: 'DELIVERY_TIME',       label: 'Delivery takes too long' },
  { value: 'CHANGED_MIND',        label: 'Changed my mind' },
  { value: 'INCORRECT_ADDRESS',    label: 'Need to change shipping address / details' },
  { value: 'OTHER',               label: 'Other reason' },
];

const REFUND_REASONS = [
  { value: 'DEFECTIVE',        label: 'Defective or damaged product' },
  { value: 'WRONG_ITEM',       label: 'Wrong item received' },
  { value: 'NOT_AS_DESCRIBED', label: 'Product not as described / shown' },
  { value: 'LATE_DELIVERY',    label: 'Delivery delayed significantly / not received' },
  { value: 'CANCELLED_ORDER',  label: 'Pre-shipment cancellation refund' },
  { value: 'OTHER',            label: 'Other reason' },
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

function OrderTimelineView({ order }) {
  const isTerminalCancelled = ['CANCELLED', 'FAILED', 'REFUNDED'].includes(order.status);
  
  // Normal delivery flow steps
  const steps = [
    { key: 'PENDING', label: 'Placed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getStepStatus = (stepKey) => {
    if (order.status === 'REFUNDED') return 'refunded';
    if (order.status === 'CANCELLED') return 'cancelled';

    const orderHierarchy = { PENDING: 0, PROCESSING: 1, SHIPPED: 2, DELIVERED: 3 };
    const currRank = orderHierarchy[order.status] ?? (order.status.includes('RETURN') ? 3 : 0);
    const stepRank = orderHierarchy[stepKey] ?? 0;

    if (stepRank < currRank) return 'complete';
    if (stepRank === currRank) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <FiClock className="text-gray-400" /> Order Lifecycle
        </h4>
        <span className="text-xs font-semibold text-gray-400">
          Updated {new Date(order.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Step Tracker (if not cancelled/refunded early) */}
      {!isTerminalCancelled ? (
        <div className="relative flex justify-between items-center mb-6 px-2">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
          {steps.map((st) => {
            const state = getStepStatus(st.key);
            return (
              <div key={st.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    state === 'complete'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : state === 'current'
                      ? 'bg-[#1F1F1F] text-white ring-4 ring-gray-100 animate-pulse'
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {state === 'complete' ? <FiCheck size={14} /> : st.label.charAt(0)}
                </div>
                <span className={`text-[11px] mt-1.5 font-bold ${state === 'current' ? 'text-[#1F1F1F]' : 'text-gray-400'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-4 p-3 bg-red-50/70 border border-red-100 rounded-xl flex items-center gap-3 text-xs text-red-700">
          <FiAlertCircle size={18} className="text-red-500 shrink-0" />
          <div>
            <span className="font-bold">
              {order.status === 'REFUNDED' ? 'Order Cancelled & Refunded' : 'Order Cancelled'}
            </span>
            {order.cancellation_reason && (
              <p className="text-gray-600 text-[11px] mt-0.5">Reason: {order.cancellation_reason}</p>
            )}
          </div>
        </div>
      )}

      {/* Chronological Event Log */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">History & Audit Trail</p>
        {order.timeline && order.timeline.length > 0 ? (
          <div className="space-y-2.5">
            {order.timeline.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#1F1F1F] truncate">{evt.title}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(evt.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {evt.notes && <p className="text-gray-500 text-[11px] mt-0.5 break-words">{evt.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-[#1F1F1F]">Order Created</span>
              <p className="text-gray-500 text-[11px] mt-0.5">Order placed and registered in the system.</p>
            </div>
            <span className="text-[10px] text-gray-400">
              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerOrders() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('');
  const [selected, setSelected]       = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast]             = useState(null);

  // Review state
  const [reviewForm, setReviewForm]   = useState(null);
  const [reviewData, setReviewData]   = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Cancellation modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReasonKey, setCancelReasonKey]   = useState('ORDERED_BY_MISTAKE');
  const [cancelCustomNotes, setCancelCustomNotes] = useState('');
  const [cancelling, setCancelling]             = useState(false);

  // Refund request modal state
  const [refundModalOrder, setRefundModalOrder] = useState(null);
  const [refundReasonKey, setRefundReasonKey]   = useState('DEFECTIVE');
  const [refundExplanation, setRefundExplanation] = useState('');
  const [refundAmount, setRefundAmount]         = useState('');
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const url = filter ? `orders/customer/?status=${filter}` : 'orders/customer/';
    Api.get(url)
      .then(res => {
        setOrders(res.data);
        if (res.data && res.data.length > 0) {
          // If we had a previously selected order, update it with new payload
          setSelected(prev => {
            if (prev) {
              const matched = res.data.find(o => o.id === prev.id);
              return matched || res.data[0];
            }
            return res.data[0];
          });
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
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Confirm Cancellation ── */
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setCancelling(true);
    const chosenReason = CANCELLATION_REASONS.find(r => r.value === cancelReasonKey)?.label || cancelReasonKey;
    const finalReason = cancelCustomNotes ? `${chosenReason} - ${cancelCustomNotes}` : chosenReason;

    try {
      const res = await Api.post(`orders/${cancelModalOrder.id}/cancel/`, { reason: finalReason });
      showToast('success', 'Order cancelled successfully! Stock restored.');
      setCancelModalOrder(null);
      setCancelCustomNotes('');
      fetchOrders();
      setSelected(res.data);
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Cannot cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  /* ── Submit Refund Request ── */
  const handleConfirmRefund = async () => {
    if (!refundModalOrder) return;
    if (!refundExplanation.trim()) {
      showToast('error', 'Please provide an explanation for your refund request.');
      return;
    }
    setSubmittingRefund(true);
    try {
      const res = await Api.post(`orders/${refundModalOrder.id}/request-refund/`, {
        reason: refundReasonKey,
        explanation: refundExplanation.trim(),
        amount: refundAmount ? parseFloat(refundAmount) : parseFloat(refundModalOrder.total_amount)
      });
      showToast('success', 'Refund request submitted! An admin will review it shortly.');
      setRefundModalOrder(null);
      setRefundExplanation('');
      setRefundAmount('');
      fetchOrders();
      setSelected(res.data);
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to submit refund request.');
    } finally {
      setSubmittingRefund(false);
    }
  };

  /* ── Submit Review ── */
  const submitReview = async () => {
    if (!reviewData.comment.trim()) { showToast('error', 'Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await Api.post('reviews/', {
        product: reviewForm.productId,
        order: reviewForm.orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      showToast('success', 'Review submitted! Thank you ⭐');
      setReviewForm(null);
      fetchOrders();
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const closeModal = () => { setIsModalOpen(false); setReviewForm(null); };

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-[1.5rem] p-6 flex items-center gap-6 animate-pulse border border-gray-100">
          <div className="w-24 h-24 rounded-2xl bg-gray-200 shrink-0" />
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
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Click on an order from the list to track its real-time timeline, cancellation options, and refund status.
            </p>
          </div>
        );
      }
      return null;
    }

    const cfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
    const canCancel = ['PENDING', 'PROCESSING'].includes(selected.status);
    const canRequestRefund = ['DELIVERED', 'SHIPPED'].includes(selected.status) && selected.is_paid && (!selected.refund_requests || !selected.refund_requests.some(r => r.status === 'PENDING'));
    const latestRefund = selected.refund_requests && selected.refund_requests.length > 0 ? selected.refund_requests[0] : null;

    return (
      <div className={`bg-white h-full flex flex-col overflow-hidden ${isModal ? 'rounded-[28px] w-full shadow-2xl max-h-[90vh]' : 'rounded-[2rem] border border-gray-100 shadow-sm'}`}>
        {/* Header */}
        <div className="relative p-6 lg:p-7 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F7F6F2] shadow-inner shrink-0">
              {selected.product_image
                ? <img src={selected.product_image} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
              }
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${cfg.color}`}>
                  {cfg.label}
                </span>
                {selected.is_paid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Paid
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Payment Pending
                  </span>
                )}
                {selected.stock_restored && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                    Stock Restored
                  </span>
                )}
              </div>
              <h2 className="font-bold text-[#1F1F1F] text-lg sm:text-xl truncate">{selected.product_name}</h2>
              <p className="text-gray-400 text-xs font-semibold">Order #{selected.id} • {selected.seller_name || 'Handicrafter'}</p>
            </div>
          </div>
          {isModal && (
            <button onClick={closeModal} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 lg:p-7 space-y-6 overflow-y-auto flex-1">
          
          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Amount', value: <span className="font-black text-[#1F1F1F] text-base">₹{parseFloat(selected.total_amount).toLocaleString('en-IN')}</span> },
              { label: 'Quantity', value: <span className="font-semibold text-sm">{selected.quantity} unit{selected.quantity > 1 ? 's' : ''}</span> },
              { label: 'Order Date', value: <span className="font-semibold text-xs">{new Date(selected.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
              ...(selected.tracking_number ? [{ label: 'Tracking #', value: <span className="font-semibold text-xs text-purple-700">{selected.tracking_number}</span> }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#FAF9F6] rounded-xl p-3 border border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                <div>{value}</div>
              </div>
            ))}
          </div>

          {/* Refund Status Alert Card (if any) */}
          {latestRefund && (
            <div className={`p-4 rounded-2xl border text-xs ${
              latestRefund.status === 'PENDING'
                ? 'bg-amber-50/70 border-amber-200 text-amber-800'
                : latestRefund.status === 'APPROVED'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                : 'bg-red-50/70 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <FiRotateCcw /> Refund Request ({latestRefund.status_display})
                </span>
                <span>₹{parseFloat(latestRefund.amount).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-gray-600 text-[11px] mb-1">
                Reason: <span className="font-medium text-gray-800">{latestRefund.reason_display}</span>
              </p>
              <p className="text-gray-500 text-[11px] italic">"{latestRefund.explanation}"</p>
              {latestRefund.admin_notes && (
                <div className="mt-2 pt-2 border-t border-black/10">
                  <span className="font-bold">Admin Decision:</span> {latestRefund.admin_notes}
                </div>
              )}
            </div>
          )}

          {/* Payment Reconciliation Info */}
          {selected.payment_reconciliations && selected.payment_reconciliations.length > 0 && (
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl text-xs text-teal-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <FiDollarSign className="text-teal-600" /> Payment Reconciliation Completed
              </div>
              <p className="text-[11px] text-teal-700">
                Refund of ₹{parseFloat(selected.payment_reconciliations[0].refunded_amount).toLocaleString('en-IN')} has been reconciled.
              </p>
              <p className="text-[10px] text-gray-500 mt-1 font-mono">
                Ref ID: {selected.payment_reconciliations[0].refund_transaction_id}
              </p>
            </div>
          )}

          {/* Interactive Order Timeline View */}
          <OrderTimelineView order={selected} />

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            
            {/* Cancel Order Button */}
            {canCancel && (
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => setCancelModalOrder(selected)}
                className="w-full py-3.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiX size={16} /> Cancel Order
              </motion.button>
            )}

            {/* Request Refund / Return Button */}
            {canRequestRefund && (
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setRefundModalOrder(selected);
                  setRefundAmount(selected.total_amount);
                }}
                className="w-full py-3.5 rounded-xl border-2 border-amber-300 text-amber-800 bg-amber-50/60 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <FiRotateCcw size={16} /> Request Return / Refund
              </motion.button>
            )}

            {/* Review Button */}
            {selected.status === 'DELIVERED' && !reviewForm && (
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setReviewForm({ orderId: selected.id, productId: selected.product });
                  setReviewData({ rating: 5, comment: '' });
                }}
                className="w-full py-3.5 rounded-xl bg-[#1F1F1F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
              >
                <FiStar size={16} /> Write a Review
              </motion.button>
            )}
          </div>

          {/* Review Form Drawer */}
          <AnimatePresence>
            {reviewForm && reviewForm.orderId === selected.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#FAF9F6] rounded-2xl p-5 space-y-4 border border-gray-200"
              >
                <h4 className="font-bold text-[#1F1F1F] text-sm">Review this crafted product</h4>
                <StarPicker value={reviewData.rating} onChange={r => setReviewData(d => ({ ...d, rating: r }))} />
                <textarea
                  placeholder="Share details about craftsmanship, texture, quality..."
                  value={reviewData.comment}
                  onChange={e => setReviewData(d => ({ ...d, comment: e.target.value }))}
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="flex-1 py-2.5 bg-[#1F1F1F] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => setReviewForm(null)}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
                  >
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
      
      {/* Filter Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        {TABS.map(tab => (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(tab.value)}
            className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              filter === tab.value
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg shadow-black/10'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1F1F1F] hover:shadow-sm'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Pane: Orders List */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col gap-4">
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
                {filter ? `You have no ${filter.toLowerCase()} orders.` : 'Start exploring unique handcrafted items.'}
              </p>
              <a href="/customer/marketplace"
                className="px-6 py-3 bg-[#1F1F1F] text-white rounded-full font-semibold text-sm hover:bg-[#333] transition-colors flex items-center gap-2"
              >
                <FiShoppingBag size={16} /> Browse Marketplace
              </a>
            </motion.div>
          ) : (
            <div className="space-y-3.5">
              {orders.map((order, idx) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                const isSelected = selected?.id === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    whileHover={{ y: -2, scale: 1.005 }}
                    onClick={() => { setSelected(order); setIsModalOpen(true); }}
                    className={`group relative bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-[#1F1F1F] ring-2 ring-[#1F1F1F]' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#F7F6F2] shadow-inner">
                      {order.product_image
                        ? <img src={order.product_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                      }
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-gray-400 font-bold uppercase">#{order.id}</span>
                      </div>
                      <h3 className="font-bold text-[#1F1F1F] text-base truncate mb-1">
                        {order.product_name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <span>Qty: {order.quantity}</span>
                        <span>•</span>
                        <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-black text-lg text-[#1F1F1F]">
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane: Order Detail Drawer (Desktop) */}
        <div className="hidden lg:block w-full lg:w-1/2 xl:w-7/12 sticky top-24 h-[calc(100vh-120px)]">
          {renderOrderDetailsContent(false)}
        </div>
      </div>

      {/* Mobile Drawer Modal */}
      <AnimatePresence>
        {isModalOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 lg:hidden"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              {renderOrderDetailsContent(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cancellation Modal ── */}
      <AnimatePresence>
        {cancelModalOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <FiAlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-base">Cancel Order #{cancelModalOrder.id}</h3>
                    <p className="text-gray-400 text-xs">Confirm your cancellation request</p>
                  </div>
                </div>
                <button onClick={() => setCancelModalOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
              </div>

              {/* Policy note */}
              <div className="my-4 p-3.5 bg-[#FAF9F6] border border-gray-100 rounded-xl flex items-start gap-3 text-xs text-gray-600">
                <FiShield className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                <p>
                  Orders can be cancelled before dispatch. If you have already paid, a full refund of <strong className="text-gray-900">₹{parseFloat(cancelModalOrder.total_amount).toLocaleString('en-IN')}</strong> will be automatically refunded to your original payment method. Stock will be restored immediately.
                </p>
              </div>

              {/* Reason Selector */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Reason for Cancellation
                </label>
                <select
                  value={cancelReasonKey}
                  onChange={e => setCancelReasonKey(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                >
                  {CANCELLATION_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Additional feedback or notes (optional)..."
                  value={cancelCustomNotes}
                  onChange={e => setCancelCustomNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Return / Refund Request Modal ── */}
      <AnimatePresence>
        {refundModalOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                    <FiRotateCcw size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-base">Request Refund / Return</h3>
                    <p className="text-gray-400 text-xs">Order #{refundModalOrder.id} • {refundModalOrder.product_name}</p>
                  </div>
                </div>
                <button onClick={() => setRefundModalOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
              </div>

              {/* Policy note */}
              <div className="my-4 p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">CraftGenius Return & Refund Policy:</span> Refund requests are reviewed by our administration team. Once approved, funds are reconciled back to your payment card and stock is properly reconciled.
              </div>

              <div className="space-y-3.5 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Reason
                  </label>
                  <select
                    value={refundReasonKey}
                    onChange={e => setRefundReasonKey(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                  >
                    {REFUND_REASONS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Requested Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    max={refundModalOrder.total_amount}
                    min="1"
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Max eligible amount: ₹{parseFloat(refundModalOrder.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Detailed Explanation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe what went wrong with the item (condition, packaging, damages)..."
                    value={refundExplanation}
                    onChange={e => setRefundExplanation(e.target.value)}
                    rows={3}
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRefundModalOrder(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRefund}
                  disabled={submittingRefund}
                  className="flex-1 py-3 bg-[#1F1F1F] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {submittingRefund ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full text-xs font-bold tracking-wide shadow-2xl flex items-center gap-2 ${
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
