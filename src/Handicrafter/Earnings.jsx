import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { 
  IndianRupee, Tag, CheckCircle2, Building2, AlertCircle, 
  Banknote, Clock, ArrowDownRight, ArrowUpRight, 
  Search, X, ShieldCheck, FileText, XCircle, RefreshCw, 
  Receipt, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'payouts' | 'orders'
  const [ledgerFilter, setLedgerFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Payout request modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    payout_method: 'BANK_TRANSFER',
    account_details: '',
    notes: ''
  });
  const [submittingPayout, setSubmittingPayout] = useState(false);

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
        gross_sales: 0,
        total_commission: 0,
        total_refunds: 0,
        net_earnings: 0,
        available_balance: 0,
        total_paid_out: 0,
        pending_payouts: 0,
        payout_status_breakdown: {},
        ledger_entries: [],
        payouts: [],
        history: []
      });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenPayoutModal = () => {
    const available = data?.available_balance || 0;
    setPayoutForm({
      amount: available > 0 ? available.toFixed(2) : '',
      payout_method: 'BANK_TRANSFER',
      account_details: '',
      notes: ''
    });
    setShowPayoutModal(true);
  };

  const handleSubmitPayout = async (e) => {
    e.preventDefault();
    const amt = parseFloat(payoutForm.amount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid payout amount', 'error');
      return;
    }
    if (amt > (data?.available_balance || 0)) {
      showToast(`Amount cannot exceed available balance of ₹${data.available_balance.toFixed(2)}`, 'error');
      return;
    }
    if (!payoutForm.account_details.trim()) {
      showToast('Please enter your account details or UPI ID', 'error');
      return;
    }

    setSubmittingPayout(true);
    try {
      const res = await Api.post('seller/payouts/request/', payoutForm);
      showToast(res.data.detail || 'Payout request submitted successfully!', 'success');
      setShowPayoutModal(false);
      fetchEarnings();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to submit payout request', 'error');
    } finally {
      setSubmittingPayout(false);
    }
  };

  const getLedgerBadge = (entryType, isCredit) => {
    switch (entryType) {
      case 'SALE':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Order Sale', icon: ArrowUpRight };
      case 'COMMISSION':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Platform Fee', icon: ArrowDownRight };
      case 'REFUND':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Refund Reversal', icon: ArrowDownRight };
      case 'PAYOUT':
        return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Payout Sent', icon: ArrowDownRight };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: entryType, icon: Receipt };
    }
  };

  const getPayoutStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Under Review', icon: Clock };
      case 'PROCESSING':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Processing Transfer', icon: RefreshCw };
      case 'PAID':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Paid / Completed', icon: CheckCircle2 };
      case 'REJECTED':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Rejected', icon: XCircle };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: status, icon: Clock };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 rounded-lg mb-2" />
        <div className="h-5 w-64 bg-gray-50 rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
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

  // Filtered ledger entries
  const ledgerEntries = (data?.ledger_entries || []).filter(entry => {
    if (ledgerFilter !== 'ALL' && entry.entry_type !== ledgerFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const descMatch = (entry.description || '').toLowerCase().includes(term);
      const refMatch = (entry.reference_id || '').toLowerCase().includes(term);
      const prodMatch = (entry.product_name || '').toLowerCase().includes(term);
      return descMatch || refMatch || prodMatch;
    }
    return true;
  });

  const availableBalance = data?.available_balance || 0;
  const breakdown = data?.payout_status_breakdown || {};

  return (
    <div className="space-y-6 pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
            Transparent Earnings & Payouts
          </h1>
          <p className="text-sm text-[#8A6A55] mt-1">
            Real-time financial transparency with an immutable transaction ledger and payout tracking.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenPayoutModal}
            disabled={availableBalance <= 0}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
            }}
          >
            <Banknote size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Request Payout (₹{Number(availableBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
          </button>
        </div>
      </div>

      {/* ── 6 Primary Transparent Financial Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        
        {/* 1. Gross Sales */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4DDD5] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IndianRupee size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#8A6A55] uppercase tracking-wider mb-1">Gross Sales</p>
            <p className="text-2xl font-bold text-[#2A201C]">
              ₹{Number(data.gross_sales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Total customer revenue from orders</p>
          </div>
        </div>

        {/* 2. Platform Commission */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4DDD5] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Tag size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#8A6A55] uppercase tracking-wider mb-1">Platform Commission</p>
            <p className="text-2xl font-bold text-amber-600">
              −₹{Number(data.total_commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Fee retained by CraftGenius</p>
          </div>
        </div>

        {/* 3. Total Refunds */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4DDD5] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
            <RotateCcwIcon size={24} className="text-rose-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#8A6A55] uppercase tracking-wider mb-1">Refunds Deducted</p>
            <p className="text-2xl font-bold text-rose-600">
              −₹{Number(data.total_refunds || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Customer returns & order cancellations</p>
          </div>
        </div>

        {/* 4. Net Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4DDD5] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#8A6A55] uppercase tracking-wider mb-1">Net Earnings</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{Number(data.net_earnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Gross − Commission − Refunds</p>
          </div>
        </div>

        {/* 5. Available Withdrawable Balance */}
        <div className="bg-gradient-to-br from-[#FDFBF8] to-[#F5EFE6] rounded-3xl p-6 border-2 border-emerald-500/30 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Available For Payout</p>
            <p className="text-2xl font-bold text-emerald-700">
              ₹{Number(data.available_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-900/70 mt-0.5">Verified ledger balance ready to withdraw</p>
          </div>
        </div>

        {/* 6. Total Paid Out */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4DDD5] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
            <CreditCard size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#8A6A55] uppercase tracking-wider mb-1">Total Paid Out</p>
            <p className="text-2xl font-bold text-violet-600">
              ₹{Number(data.total_paid_out || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Completed bank / UPI disbursements</p>
          </div>
        </div>

      </div>

      {/* ── Payout Status Breakdown Banner ── */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4DDD5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-800" />
          <div>
            <h4 className="text-xs font-bold text-[#2A201C] uppercase tracking-wider">Payout Status Breakdown</h4>
            <p className="text-[11px] text-[#8A6A55]">Live lifecycle of your withdrawal requests</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center gap-1.5 font-semibold text-amber-800">
            <Clock size={13} />
            <span>Pending: {breakdown.PENDING?.count || 0}</span>
            <span className="text-[11px] text-amber-900 font-bold">(₹{(breakdown.PENDING?.amount || 0).toFixed(2)})</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center gap-1.5 font-semibold text-blue-800">
            <RefreshCw size={13} />
            <span>Processing: {breakdown.PROCESSING?.count || 0}</span>
            <span className="text-[11px] text-blue-900 font-bold">(₹{(breakdown.PROCESSING?.amount || 0).toFixed(2)})</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-1.5 font-semibold text-emerald-800">
            <CheckCircle2 size={13} />
            <span>Paid: {breakdown.PAID?.count || 0}</span>
            <span className="text-[11px] text-emerald-900 font-bold">(₹{(breakdown.PAID?.amount || 0).toFixed(2)})</span>
          </div>

          {breakdown.REJECTED?.count > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-center gap-1.5 font-semibold text-rose-800">
              <XCircle size={13} />
              <span>Rejected: {breakdown.REJECTED.count}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Tab Navigation & Content ── */}
      <div className="bg-white rounded-3xl border border-[#E4DDD5] shadow-sm overflow-hidden flex flex-col">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#E4DDD5] bg-[#FDFBF8] px-6 py-3 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-[#3B2B25] text-white shadow-sm'
                  : 'text-[#8A6A55] hover:bg-[#F8F5F1] hover:text-[#3B2B25]'
              }`}
            >
              <Receipt size={14} />
              <span>Transaction Ledger ({data.ledger_entries?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'payouts'
                  ? 'bg-[#3B2B25] text-white shadow-sm'
                  : 'text-[#8A6A55] hover:bg-[#F8F5F1] hover:text-[#3B2B25]'
              }`}
            >
              <Banknote size={14} />
              <span>Payout Requests ({data.payouts?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#3B2B25] text-white shadow-sm'
                  : 'text-[#8A6A55] hover:bg-[#F8F5F1] hover:text-[#3B2B25]'
              }`}
            >
              <FileText size={14} />
              <span>Order Sales Breakdown</span>
            </button>
          </div>

          {/* Ledger filters (only visible on ledger tab) */}
          {activeTab === 'ledger' && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search description / order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E4DDD5] rounded-xl focus:outline-none focus:border-[#8A6A55] w-48"
                />
              </div>

              <select
                value={ledgerFilter}
                onChange={(e) => setLedgerFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#E4DDD5] rounded-xl text-[#3B2B25] focus:outline-none focus:border-[#8A6A55]"
              >
                <option value="ALL">All Entries</option>
                <option value="SALE">Gross Sales (+)</option>
                <option value="COMMISSION">Platform Fee (−)</option>
                <option value="REFUND">Refunds (−)</option>
                <option value="PAYOUT">Payouts (−)</option>
              </select>
            </div>
          )}
        </div>

        {/* ── TAB 1: TRANSACTION LEDGER ── */}
        {activeTab === 'ledger' && (
          <div>
            {ledgerEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-[#F8F5F1] rounded-2xl flex items-center justify-center mb-3 text-stone-400">
                  <Receipt size={32} />
                </div>
                <h4 className="text-base font-bold text-[#2A201C] mb-1">No Ledger Transactions Found</h4>
                <p className="text-xs text-[#8A6A55] max-w-sm">
                  Every order payment, platform commission fee, refund deduction, and payout will be immutably recorded here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E4DDD5] bg-[#FDFBF8]">
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Date & Time</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Type</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Transaction Description</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Order / Ref</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Amount</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Balance After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {ledgerEntries.map(entry => {
                      const badge = getLedgerBadge(entry.entry_type, entry.is_credit);
                      const BadgeIcon = badge.icon;
                      const dateObj = new Date(entry.created_at);

                      return (
                        <tr key={entry.id} className="hover:bg-[#FDFBF8] transition-colors">
                          <td className="px-5 py-3.5 text-stone-600 whitespace-nowrap">
                            <span className="font-semibold block text-stone-800">
                              {dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                              <BadgeIcon size={12} />
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-stone-800 font-medium max-w-[280px]">
                            <p className="truncate" title={entry.description}>{entry.description}</p>
                            {entry.product_name && (
                              <p className="text-[10px] text-stone-400 mt-0.5 truncate">Item: {entry.product_name}</p>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-stone-600 whitespace-nowrap">
                            {entry.order_id ? (
                              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                                #{String(entry.order_id).padStart(4, '0')}
                              </span>
                            ) : entry.reference_id ? (
                              <span className="text-stone-500 font-mono text-[10px]">{entry.reference_id.substring(0, 16)}</span>
                            ) : (
                              <span className="text-stone-300">—</span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <span className={`font-bold text-sm ${entry.is_credit ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {entry.is_credit ? '+' : '−'}₹{Number(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-right whitespace-nowrap font-mono font-bold text-stone-800 text-sm">
                            ₹{Number(entry.balance_after).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PAYOUT REQUESTS & STATUS ── */}
        {activeTab === 'payouts' && (
          <div>
            {(data?.payouts || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-[#F8F5F1] rounded-2xl flex items-center justify-center mb-3 text-stone-400">
                  <Banknote size={32} />
                </div>
                <h4 className="text-base font-bold text-[#2A201C] mb-1">No Payout Requests Yet</h4>
                <p className="text-xs text-[#8A6A55] max-w-sm mb-4">
                  When you have available earnings, you can request a payout directly to your bank account or UPI.
                </p>
                {availableBalance > 0 && (
                  <button
                    onClick={handleOpenPayoutModal}
                    className="px-5 py-2.5 rounded-xl bg-[#3B2B25] text-white text-xs font-bold hover:bg-[#8A6A55] transition-all"
                  >
                    Request Payout Now
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E4DDD5] bg-[#FDFBF8]">
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Requested Date</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Method</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Account / Details</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-center">Status</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Reference / UTR</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Processed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {data.payouts.map(payout => {
                      const st = getPayoutStatusBadge(payout.status);
                      const StatusIcon = st.icon;

                      return (
                        <tr key={payout.id} className="hover:bg-[#FDFBF8] transition-colors">
                          <td className="px-5 py-3.5 text-stone-700 whitespace-nowrap">
                            <span className="font-semibold block">
                              {new Date(payout.requested_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(payout.requested_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap font-bold text-sm text-[#2A201C]">
                            ₹{Number(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700 font-semibold text-[11px]">
                              {payout.payout_method_display || payout.payout_method}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-stone-800 font-mono text-[11px] max-w-[200px] truncate" title={payout.account_details}>
                            {payout.account_details}
                          </td>

                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${st.bg} ${st.text} ${st.border}`}>
                              <StatusIcon size={12} />
                              {st.label}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-stone-600 font-mono text-[11px] whitespace-nowrap">
                            {payout.reference_id ? (
                              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                {payout.reference_id}
                              </span>
                            ) : (
                              <span className="text-stone-300">Pending</span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-stone-500 whitespace-nowrap text-[11px]">
                            {payout.processed_at ? (
                              new Date(payout.processed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            ) : (
                              <span className="text-stone-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: PER-ORDER BREAKDOWN ── */}
        {activeTab === 'orders' && (
          <div>
            {(data?.history || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-[#F8F5F1] rounded-2xl flex items-center justify-center mb-3 text-stone-400">
                  <FileText size={32} />
                </div>
                <h4 className="text-base font-bold text-[#2A201C] mb-1">No Orders Yet</h4>
                <p className="text-xs text-[#8A6A55]">Per-order sales, commission, and net earnings will show here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E4DDD5] bg-[#FDFBF8]">
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Order ID</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider">Product</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Gross Amount</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Commission (−)</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Net Earned</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-center">Status</th>
                      <th className="px-5 py-3.5 font-bold text-[#8A6A55] uppercase tracking-wider text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {data.history.map(earning => (
                      <tr key={earning.id} className="hover:bg-[#FDFBF8] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-amber-900">
                          #{String(earning.order_id).padStart(4, '0')}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-stone-800 max-w-[200px] truncate">
                          {earning.product_name}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-stone-900 text-right">
                          ₹{Number(earning.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-amber-600 text-right">
                          −₹{Number(earning.commission).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-emerald-600 text-right">
                          ₹{Number(earning.net_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-100 text-stone-700">
                            {earning.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-stone-400 text-right whitespace-nowrap">
                          {new Date(earning.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── REQUEST PAYOUT MODAL ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E4DDD5] space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD5]">
                <div>
                  <h3 className="text-xl font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
                    Request Payout
                  </h3>
                  <p className="text-xs text-[#8A6A55] mt-0.5">
                    Withdraw your verified net earnings to your bank account or UPI.
                  </p>
                </div>
                <button 
                  onClick={() => setShowPayoutModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Available Balance info card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Available Balance</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    ₹{Number(availableBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPayoutForm(f => ({ ...f, amount: availableBalance.toFixed(2) }))}
                  className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Withdraw All
                </button>
              </div>

              <form onSubmit={handleSubmitPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-1.5">
                    Payout Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={availableBalance}
                      placeholder="0.00"
                      value={payoutForm.amount}
                      onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                      required
                      className="w-full pl-9 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-[#8A6A55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-1.5">
                    Payout Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayoutForm({ ...payoutForm, payout_method: 'BANK_TRANSFER' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        payoutForm.payout_method === 'BANK_TRANSFER'
                          ? 'border-[#3B2B25] bg-[#3B2B25] text-white shadow'
                          : 'border-[#E4DDD5] bg-[#FDFBF8] text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <Building2 size={16} /> Bank Transfer (NEFT)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutForm({ ...payoutForm, payout_method: 'UPI' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        payoutForm.payout_method === 'UPI'
                          ? 'border-[#3B2B25] bg-[#3B2B25] text-white shadow'
                          : 'border-[#E4DDD5] bg-[#FDFBF8] text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard size={16} /> UPI Direct
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-1.5">
                    {payoutForm.payout_method === 'BANK_TRANSFER' ? 'Account Number & IFSC Code' : 'UPI ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={payoutForm.payout_method === 'BANK_TRANSFER' ? 'e.g. HDFC0001234, A/C: 50100234123456' : 'e.g. artisan@upi or 9876543210@paytm'}
                    value={payoutForm.account_details}
                    onChange={(e) => setPayoutForm({ ...payoutForm, account_details: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8A6A55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-1.5">
                    Notes for Admin (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Urgent festive payout request"
                    value={payoutForm.notes}
                    onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8A6A55]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4DDD5]">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#E4DDD5] text-xs font-bold text-[#8A6A55] hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPayout}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submittingPayout ? 'Submitting...' : 'Confirm & Request Payout'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl ${
              toast.type === 'success' ? 'bg-[#3B2B25]' : 'bg-red-600'
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

// Small helper icon component
function RotateCcwIcon(props) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export default Earnings;
