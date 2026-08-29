import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiEdit2, FiTrash2, FiMessageCircle, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Api from '../services/Api';

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
          onClick={() => onChange && onChange(s)}
          className={`text-2xl transition-transform focus:outline-none ${onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          disabled={!onChange}
        >
          <FiStar
            className={`${(hovered || value) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`}
            size={24}
          />
        </button>
      ))}
    </div>
  );
}

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    Api.get('reviews/customer/')
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const startEdit = (review) => {
    setEditing(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const saveEdit = async (id) => {
    if (!editForm.comment.trim()) {
      showToast('error', 'Review comment cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await Api.put(`reviews/${id}/edit/`, editForm);
      showToast('success', 'Review updated successfully');
      setEditing(null);
      fetchReviews();
    } catch {
      showToast('error', 'Failed to update review');
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await Api.delete(`reviews/${id}/delete/`);
      showToast('success', 'Review deleted successfully');
      fetchReviews();
    } catch {
      showToast('error', 'Failed to delete review');
    }
  };

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-4 animate-pulse border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-5 h-5 bg-gray-200 rounded-full" />)}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-[80vh] py-4">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1F1F] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Reviews
          </h1>
          {/* <p className="text-gray-500">Manage feedback for your purchased items</p> */}
        </div>
        {!loading && reviews.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm font-semibold text-gray-600 inline-flex items-center gap-2">
            <FiMessageCircle className="text-[#8A6A55]" />
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Written
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <Skeleton />
      ) : reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="w-20 h-20 rounded-full bg-[#F7F6F2] flex items-center justify-center mb-4 text-3xl">⭐</div>
          <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No reviews yet</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            You haven't reviewed any products yet. After receiving an order, you can write a review to help other shoppers.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow"
              >
                {editing === review.id ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="pb-4 border-b border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#F7F6F2] overflow-hidden flex-shrink-0">
                        {review.product_image ? (
                          <img src={review.product_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1F1F1F] text-lg mb-1">Edit Review</h4>
                        <p className="text-gray-500 text-sm">for {review.product_name}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <StarPicker value={editForm.rating} onChange={(r) => setEditForm(f => ({ ...f, rating: r }))} />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={editForm.comment}
                        onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                        rows={4}
                        placeholder="What did you like or dislike about this product?"
                        className="w-full bg-[#F7F6F2] border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8A6A55]/30 focus:border-[#8A6A55] transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => saveEdit(review.id)}
                        disabled={saving}
                        className="px-6 py-2.5 bg-[#1F1F1F] text-white rounded-xl text-sm font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#F7F6F2] overflow-hidden flex-shrink-0">
                          {review.product_image ? (
                            <img src={review.product_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[#1F1F1F] mb-1">{review.product_name}</h4>
                          <StarPicker value={review.rating} />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-lg mt-2 sm:mt-0">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 text-[15px]">
                      "{review.comment || 'No written feedback provided.'}"
                    </p>

                    {review.seller_reply && (
                      <div className="mb-6 bg-amber-50/50 border border-amber-100 rounded-2xl p-5 relative">
                        <div className="absolute top-0 left-6 -translate-y-1/2">
                          <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md">
                            Seller Reply
                          </span>
                        </div>
                        <p className="text-sm text-amber-900/80 italic mt-1">
                          {review.seller_reply}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => startEdit(review)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-[#1F1F1F] transition-colors"
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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

export default CustomerReviews;
