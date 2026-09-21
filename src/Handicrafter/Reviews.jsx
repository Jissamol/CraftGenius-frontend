import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { Star, MessageSquare, Reply, X, Package, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await Api.get('reviews/seller/');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const res = await Api.patch(`reviews/${replyModal.id}/reply/`, {
        seller_reply: replyText,
      });
      setReviews(prev => prev.map(r => r.id === replyModal.id ? res.data : r));
      setReplyModal(null);
      setReplyText('');
      showToast('Reply posted successfully', 'success');
    } catch (err) {
      showToast('Failed to post reply', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={16} 
            className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'} 
          />
        ))}
      </div>
    );
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Customer Reviews
        </h1>
        <p className="text-sm text-gray-400 mt-1">See what customers think about your products</p>
      </div>

      {/* ── Stats Summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: reviews.length },
          { label: 'Average Rating', value: avgRating },
          { label: 'Positive (4-5★)', value: reviews.filter(r => r.rating >= 4).length },
          { label: 'Awaiting Reply', value: reviews.filter(r => !r.seller_reply).length, highlight: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <span className={`text-3xl font-bold mb-1 ${stat.highlight && stat.value > 0 ? 'text-violet-600' : 'text-gray-900'}`}>
              {stat.value}
            </span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <Star size={32} className="text-amber-400 fill-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews yet</h3>
          <p className="text-sm text-gray-400">Reviews will appear here once customers rate your products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              
              {/* Review Header (Product Info & Rating) */}
              <div className="flex items-start gap-4 p-5 border-b border-gray-50 bg-gray-50/30">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {review.product_image ? (
                    <img src={review.product_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="m-auto mt-4 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate pr-4">{review.product_name}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="mb-1.5">{renderStars(review.rating)}</div>
                  <p className="text-xs font-medium text-gray-500">By {review.customer_name}</p>
                </div>
              </div>

              {/* Review Comment */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <Quote size={20} className="text-gray-200 flex-shrink-0 rotate-180" />
                  <p className="text-sm text-gray-700 leading-relaxed italic flex-1">
                    "{review.comment || 'No written feedback provided.'}"
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  {review.seller_reply ? (
                    <div className="w-full bg-violet-50/50 border border-violet-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Reply size={14} className="text-violet-500" />
                        <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Your Reply</span>
                      </div>
                      <p className="text-sm text-gray-600 pl-6">{review.seller_reply}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyModal(review); setReplyText(''); }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-sm font-semibold transition-colors w-full justify-center"
                    >
                      <MessageSquare size={16} /> Write a Reply
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Reply Modal ── */}
      <AnimatePresence>
        {replyModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setReplyModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Reply to Review</h2>
                <button
                  onClick={() => setReplyModal(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                {/* Original Review Preview */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{replyModal.customer_name}</span>
                    {renderStars(replyModal.rating)}
                  </div>
                  <p className="text-sm text-gray-600 italic">"{replyModal.comment}"</p>
                </div>

                {/* Reply Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Your Reply</label>
                  <textarea
                    placeholder="Write a thoughtful response... Customers will see this."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setReplyModal(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-gradient-to-r from-violet-600 to-purple-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Reply size={16} /> Post Reply
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
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reviews;
