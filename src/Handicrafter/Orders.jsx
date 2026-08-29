import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { ShoppingCart, Eye, X, Package, Mail, Search, CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await Api.get('orders/seller/', { params });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const payload = { status: newStatus };
      if (trackingNumber) payload.tracking_number = trackingNumber;
      const res = await Api.patch(`orders/${orderId}/status/`, payload);
      setOrders(prev => prev.map(o => (o.id === orderId ? res.data : o)));
      setSelectedOrder(null);
      setTrackingNumber('');
      showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update order', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusActions = (status) => {
    switch (status) {
      case 'PENDING': return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING': return ['SHIPPED', 'CANCELLED'];
      case 'SHIPPED': return ['DELIVERED'];
      default: return [];
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING:    { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock },
      PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Package },
      SHIPPED:    { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', icon: Truck },
      DELIVERED:  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 },
      CANCELLED:  { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100', icon: X },
    };
    return map[status] || map.PENDING;
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  );

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orders
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage your customer orders</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {['', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              statusFilter === status
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {status || 'All Orders'}
          </button>
        ))}
      </div>

      {/* ── Orders Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-400">
              {search 
                ? `No orders matching "${search}"` 
                : statusFilter 
                  ? `You have no ${statusFilter.toLowerCase()} orders.` 
                  : "You haven't received any orders yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Qty</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const s = getStatusBadge(order.status);
                  const Icon = s.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-violet-600">
                        #{String(order.id).padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{order.customer_name || '—'}</p>
                        <p className="text-xs text-gray-400">{order.customer_email || '—'}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {order.product_image ? (
                              <img src={order.product_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={20} className="m-auto mt-2 text-gray-300" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700 truncate">{order.product_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg} ${s.text} ${s.border}`}>
                          <Icon size={12} />
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-violet-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Order #{String(selectedOrder.id).padStart(4, '0')}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Name</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" /> {selectedOrder.customer_email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text} ${getStatusBadge(selectedOrder.status).border}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                        <span className="text-sm text-gray-500">Quantity</span>
                        <span className="text-sm font-bold text-gray-900">{selectedOrder.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Amount</span>
                        <span className="text-base font-bold text-violet-600">
                          ₹{parseFloat(selectedOrder.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Detail */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Product</h3>
                  <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {selectedOrder.product_image ? (
                        <img src={selectedOrder.product_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} className="m-auto mt-4 text-gray-300" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.product_name}</span>
                  </div>
                </div>

                {/* Tracking */}
                {selectedOrder.tracking_number && (
                   <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tracking</h3>
                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <Truck size={16} className="text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">{selectedOrder.tracking_number}</span>
                    </div>
                   </div>
                )}
              </div>

              {/* Status Update Actions */}
              {getStatusActions(selectedOrder.status).length > 0 && (
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Update Order Status</h4>
                  
                  {selectedOrder.status === 'PROCESSING' && (
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tracking Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. TRK123456789"
                        value={trackingNumber}
                        onChange={e => setTrackingNumber(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {getStatusActions(selectedOrder.status).map(action => (
                      <button
                        key={action}
                        onClick={() => updateStatus(selectedOrder.id, action)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${
                          action === 'CANCELLED'
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-violet-200'
                        }`}
                      >
                        {action === 'PROCESSING' && <Package size={16} />}
                        {action === 'SHIPPED' && <Truck size={16} />}
                        {action === 'DELIVERED' && <CheckCircle2 size={16} />}
                        {action === 'CANCELLED' && <X size={16} />}
                        Mark as {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
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

export default Orders;
