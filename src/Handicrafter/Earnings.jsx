import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { IndianRupee, Tag, CheckCircle2, Building2, AlertCircle, Banknote, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await Api.get('seller/earnings/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch earnings:', err);
      setData({
        total_earnings: 0,
        total_commission: 0,
        total_net: 0,
        withdrawable: 0,
        history: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    setToast({ message: 'Withdrawal request submitted! Processing time: 3-5 business days.', type: 'info' });
    setTimeout(() => setToast(null), 4000);
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING:   { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock },
      COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 },
      FAILED:    { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100', icon: AlertCircle },
    };
    return map[status] || map.PENDING;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 rounded-lg mb-2" />
        <div className="h-5 w-64 bg-gray-50 rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-32 flex flex-col justify-center">
              <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
              <div className="h-8 w-32 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Earnings Overview
          </h1>
          <p className="text-sm text-gray-400 mt-1">Track your revenue, commissions, and payouts</p>
        </div>
        
        {data.withdrawable > 0 && (
          <button
            onClick={handleWithdraw}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Banknote size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Withdraw ₹{Number(data.withdrawable).toLocaleString('en-IN')}
          </button>
        )}
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <IndianRupee size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{Number(data.total_earnings).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Tag size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform Commission</p>
            <p className="text-2xl font-bold text-amber-500">
              ₹{Number(data.total_commission).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Net Earnings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Net Earnings</p>
            <p className="text-2xl font-bold text-emerald-500">
              ₹{Number(data.total_net).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Withdrawable */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <Building2 size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Withdrawable</p>
            <p className="text-2xl font-bold text-violet-600">
              ₹{Number(data.withdrawable).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

      </div>

      {/* ── Earnings History Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">Earnings History</h3>
          <p className="text-xs text-gray-400 mt-0.5">A breakdown of revenue per order</p>
        </div>

        {data.history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Banknote size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No earnings yet</h3>
            <p className="text-sm text-gray-400">Start selling products to see your earnings history here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Commission</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Net Earned</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.history.map(earning => {
                  const s = getStatusBadge(earning.status);
                  const Icon = s.icon;
                  return (
                    <tr key={earning.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-violet-600">
                        #{String(earning.order_id).padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700 max-w-[200px] truncate">
                        {earning.product_name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                        ₹{Number(earning.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 font-medium text-amber-500 text-right">
                        -₹{Number(earning.commission).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600 text-right">
                        ₹{Number(earning.net_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${s.bg} ${s.text} ${s.border}`}>
                          <Icon size={12} />
                          {earning.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 text-right whitespace-nowrap">
                        {new Date(earning.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl ${
              toast.type === 'info' ? 'bg-blue-600' : toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'info' ? <AlertCircle size={18} /> : toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Earnings;
