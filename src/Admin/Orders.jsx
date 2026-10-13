import { useState, useEffect } from 'react';
import Api from '../services/Api';
import './Orders.css';

function Orders() {
    const [viewTab, setViewTab] = useState('orders'); // 'orders' | 'refunds'
    const [orders, setOrders] = useState([]);
    const [refundRequests, setRefundRequests] = useState([]);
    const [filter, setFilter] = useState('');
    const [refundFilter, setRefundFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modals
    const [timelineOrder, setTimelineOrder] = useState(null);
    const [statusOrder, setStatusOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    
    // Direct refund modal
    const [directRefundOrder, setDirectRefundOrder] = useState(null);
    const [refundAmount, setRefundAmount] = useState('');
    const [restoreStockDirect, setRestoreStockDirect] = useState(true);
    const [refundNotes, setRefundNotes] = useState('');

    // Review customer refund request modal
    const [reviewRequest, setReviewRequest] = useState(null);
    const [reviewDecision, setReviewDecision] = useState('APPROVE'); // 'APPROVE' | 'REJECT'
    const [reviewAmount, setReviewAmount] = useState('');
    const [reviewRestoreStock, setReviewRestoreStock] = useState(true);
    const [reviewAdminNotes, setReviewAdminNotes] = useState('');

    const [actionLoading, setActionLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const showNotice = (type, msg) => {
        if (type === 'success') {
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(null), 3500);
        } else {
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(null), 4500);
        }
    };

    const fetchOrders = () => {
        setLoading(true);
        const url = filter ? `admin/orders/?status=${filter}` : 'admin/orders/';
        Api.get(url)
            .then(res => setOrders(res.data))
            .catch(() => showNotice('error', 'Failed to load orders.'))
            .finally(() => setLoading(false));
    };

    const fetchRefundRequests = () => {
        setLoading(true);
        const url = refundFilter ? `admin/refund-requests/?status=${refundFilter}` : 'admin/refund-requests/';
        Api.get(url)
            .then(res => setRefundRequests(res.data))
            .catch(() => showNotice('error', 'Failed to load refund requests.'))
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (viewTab === 'orders') {
            fetchOrders();
        } else {
            fetchRefundRequests();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewTab, filter, refundFilter]);

    /* ── Handle Admin Status Update ── */
    const handleStatusUpdate = () => {
        if (!statusOrder || !newStatus) return;
        setActionLoading(true);
        Api.put(`admin/orders/${statusOrder.id}/status/`, {
            status: newStatus,
            notes: statusNotes
        })
            .then(() => {
                setStatusOrder(null);
                setNewStatus('');
                setStatusNotes('');
                showNotice('success', `Order #${statusOrder.id} status updated to ${newStatus}.`);
                fetchOrders();
            })
            .catch(err => {
                showNotice('error', err.response?.data?.detail || 'Failed to update order status.');
            })
            .finally(() => setActionLoading(false));
    };

    /* ── Handle Direct Admin Refund & Reconciliation ── */
    const handleDirectRefund = () => {
        if (!directRefundOrder) return;
        setActionLoading(true);
        Api.post(`admin/orders/${directRefundOrder.id}/refund/`, {
            amount: refundAmount ? parseFloat(refundAmount) : parseFloat(directRefundOrder.total_amount),
            restore_stock: restoreStockDirect,
            admin_notes: refundNotes || 'Direct refund issued by admin'
        })
            .then(() => {
                setDirectRefundOrder(null);
                setRefundAmount('');
                setRefundNotes('');
                showNotice('success', `Order #${directRefundOrder.id} refund and payment reconciled successfully.`);
                fetchOrders();
            })
            .catch(err => {
                showNotice('error', err.response?.data?.detail || 'Failed to issue refund.');
            })
            .finally(() => setActionLoading(false));
    };

    /* ── Handle Refund Request Decision ── */
    const handleReviewRefundDecision = () => {
        if (!reviewRequest) return;
        if (reviewDecision === 'REJECT' && !reviewAdminNotes.trim()) {
            showNotice('error', 'Please provide an admin note explaining the rejection reason.');
            return;
        }

        setActionLoading(true);
        Api.post(`admin/refund-requests/${reviewRequest.id}/decide/`, {
            decision: reviewDecision,
            amount: reviewAmount ? parseFloat(reviewAmount) : parseFloat(reviewRequest.amount),
            restore_stock: reviewRestoreStock,
            admin_notes: reviewAdminNotes
        })
            .then(res => {
                setReviewRequest(null);
                setReviewAdminNotes('');
                showNotice('success', res.data?.detail || 'Refund request decision processed.');
                fetchRefundRequests();
            })
            .catch(err => {
                showNotice('error', err.response?.data?.detail || 'Failed to process refund decision.');
            })
            .finally(() => setActionLoading(false));
    };

    const statuses = ['', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED', 'REFUNDED', 'RETURN_REQUESTED', 'RETURNED', 'DISPUTED'];
    const refundStatuses = ['', 'PENDING', 'APPROVED', 'REJECTED'];

    const filteredOrders = orders.filter(o =>
        String(o.id).includes(search) ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.product_name?.toLowerCase().includes(search.toLowerCase())
    );

    const pendingRefundCount = refundRequests.filter(r => r.status === 'PENDING').length;

    return (
        <div className="admin-orders-page">
            <div className="admin-dashboard-header">
                <div>
                    <h1>Order & Refund Management</h1>
                    <p>Track order lifecycles, validate status transitions, review refund requests, and reconcile payments.</p>
                </div>

                {/* Notifications */}
                {successMsg && (
                    <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                        ✓ {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                        ⚠ {errorMsg}
                    </div>
                )}
            </div>

            {/* View Mode Tabs */}
            <div className="admin-orders-tabs">
                <button
                    className={`admin-btn ${viewTab === 'orders' ? 'primary' : 'outline'}`}
                    onClick={() => { setViewTab('orders'); setFilter(''); }}
                >
                    📦 Orders Management ({orders.length})
                </button>
                <button
                    className={`admin-btn ${viewTab === 'refunds' ? 'primary' : 'outline'}`}
                    onClick={() => { setViewTab('refunds'); setRefundFilter(''); }}
                    style={{ position: 'relative' }}
                >
                    💳 Refund Requests & Decisions
                    {pendingRefundCount > 0 && (
                        <span style={{ marginLeft: 8, background: '#ef4444', color: 'white', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>
                            {pendingRefundCount} Pending
                        </span>
                    )}
                </button>
            </div>

            {/* ════════════════ ORDERS VIEW ════════════════ */}
            {viewTab === 'orders' && (
                <>
                    <div className="admin-orders-toolbar">
                        <label className="admin-orders-filter">
                            <span>Status</span>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                {statuses.map(s => (
                                    <option key={s} value={s}>
                                        {s ? s.replaceAll('_', ' ') : 'All orders'}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <input
                            className="admin-orders-search"
                            type="text"
                            placeholder="Search orders, customers, items..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="admin-orders-results">
                        <p className="admin-orders-result-count">
                            {loading ? 'Loading orders…' : `${filteredOrders.length} ${filteredOrders.length === 1 ? 'order' : 'orders'}`}
                        </p>
                        {loading ? (
                            <div className="admin-orders-empty">Loading orders…</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="admin-orders-empty">No orders match these filters.</div>
                        ) : (
                            <div className="admin-order-list">
                                {filteredOrders.map(o => (
                                    <article className="admin-order-card" key={o.id}>
                                        <div className="admin-order-card-top">
                                            <div className="admin-order-product">
                                                {o.product_image ? (
                                                    <img src={o.product_image} alt="" />
                                                ) : (
                                                    <div className="admin-order-image-placeholder" aria-hidden="true">🎨</div>
                                                )}
                                                <div className="admin-order-product-copy">
                                                    <div className="admin-order-eyebrow">Order #{o.id}</div>
                                                    <h2>{o.product_name}</h2>
                                                    {o.tracking_number && (
                                                        <span className="admin-order-tracking">Tracking: {o.tracking_number}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="admin-order-summary">
                                                <span className={`admin-badge ${o.status.toLowerCase().replace('_', '-')}`}>
                                                    {o.status.replaceAll('_', ' ')}
                                                </span>
                                                <strong>₹{parseFloat(o.total_amount).toLocaleString('en-IN')}</strong>
                                            </div>
                                        </div>

                                        <div className="admin-order-details">
                                            <div>
                                                <span>Customer</span>
                                                <strong>{o.customer_name || '—'}</strong>
                                                <small>{o.customer_email}</small>
                                            </div>
                                            <div>
                                                <span>Seller</span>
                                                <strong>{o.seller_name || '—'}</strong>
                                            </div>
                                            <div>
                                                <span>Quantity</span>
                                                <strong>{o.quantity}</strong>
                                            </div>
                                            <div>
                                                <span>Payment</span>
                                                <strong className={o.is_paid ? 'is-paid' : 'is-unpaid'}>
                                                    {o.is_paid ? 'Paid' : 'Pending'}
                                                </strong>
                                                {o.stock_restored && <small>Stock restored</small>}
                                            </div>
                                            <div>
                                                <span>Order date</span>
                                                <strong>{new Date(o.created_at).toLocaleDateString()}</strong>
                                            </div>
                                        </div>

                                        <div className="admin-order-actions">
                                            <button
                                                className="admin-btn outline sm"
                                                onClick={() => setTimelineOrder(o)}
                                                title="View order history and reconciliation"
                                            >
                                                View timeline
                                            </button>
                                            <button
                                                className="admin-btn outline sm"
                                                onClick={() => {
                                                    setStatusOrder(o);
                                                    setNewStatus(o.status);
                                                    setStatusNotes('');
                                                }}
                                            >
                                                Update status
                                            </button>
                                            {o.is_paid && o.status !== 'REFUNDED' && (
                                                <button
                                                    className="admin-btn danger sm"
                                                    onClick={() => {
                                                        setDirectRefundOrder(o);
                                                        setRefundAmount(o.total_amount);
                                                        setRestoreStockDirect(true);
                                                        setRefundNotes('');
                                                    }}
                                                >
                                                    Issue refund
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ════════════════ REFUND REQUESTS VIEW ════════════════ */}
            {viewTab === 'refunds' && (
                <>
                    <div className="admin-filter-tabs">
                        {refundStatuses.map(s => (
                            <button
                                key={s}
                                className={`admin-filter-tab ${refundFilter === s ? 'active' : ''}`}
                                onClick={() => setRefundFilter(s)}
                            >
                                {s ? `${s.replace('_', ' ')} Requests` : 'All Requests'}
                            </button>
                        ))}
                    </div>

                    <div className="admin-glass-card">
                        {loading ? (
                            <div className="admin-loading">Loading refund requests...</div>
                        ) : refundRequests.length === 0 ? (
                            <div className="admin-loading">No refund requests found.</div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Req #</th>
                                            <th>Order #</th>
                                            <th>Customer</th>
                                            <th>Item / Seller</th>
                                            <th>Amount</th>
                                            <th>Reason</th>
                                            <th>Explanation</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                            <th>Decision</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refundRequests.map(r => (
                                            <tr key={r.id}>
                                                <td><strong>#{r.id}</strong></td>
                                                <td><strong>#{r.order}</strong></td>
                                                <td>
                                                    <div>{r.customer_name}</div>
                                                    <small style={{ color: 'var(--admin-text-secondary)' }}>{r.customer_email}</small>
                                                </td>
                                                <td>
                                                    <div>{r.product_name}</div>
                                                    <small style={{ color: 'var(--admin-text-secondary)' }}>Seller: {r.seller_name}</small>
                                                </td>
                                                <td style={{ fontWeight: 700 }}>₹{parseFloat(r.amount).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <span style={{ fontSize: 12, fontWeight: 600 }}>{r.reason_display}</span>
                                                </td>
                                                <td style={{ maxWidth: 220, fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                                                    {r.explanation}
                                                    {r.admin_notes && (
                                                        <div style={{ marginTop: 4, color: 'var(--admin-primary)', fontWeight: 600 }}>
                                                            Admin: {r.admin_notes}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`admin-badge ${r.status.toLowerCase()}`}>
                                                        {r.status_display}
                                                    </span>
                                                </td>
                                                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    {r.status === 'PENDING' ? (
                                                        <button
                                                            className="admin-btn primary sm"
                                                            onClick={() => {
                                                                setReviewRequest(r);
                                                                setReviewDecision('APPROVE');
                                                                setReviewAmount(r.amount);
                                                                setReviewRestoreStock(true);
                                                                setReviewAdminNotes('');
                                                            }}
                                                        >
                                                            Review & Decide
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                                                            {r.decided_by_name ? `By ${r.decided_by_name}` : 'Completed'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ════════════════ TIMELINE & RECONCILIATION MODAL ════════════════ */}
            {timelineOrder && (
                <div className="admin-modal-overlay" onClick={() => setTimelineOrder(null)}>
                    <div className="admin-modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ margin: 0 }}>Order #{timelineOrder.id} Lifecycle & Timeline</h3>
                            <button className="admin-btn outline sm" onClick={() => setTimelineOrder(null)}>✕</button>
                        </div>

                        {/* Order Summary Chips */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                            <div style={{ background: 'var(--admin-bg)', padding: '10px 12px', borderRadius: 10 }}>
                                <small style={{ color: 'var(--admin-text-secondary)', display: 'block' }}>Status</small>
                                <strong>{timelineOrder.status}</strong>
                            </div>
                            <div style={{ background: 'var(--admin-bg)', padding: '10px 12px', borderRadius: 10 }}>
                                <small style={{ color: 'var(--admin-text-secondary)', display: 'block' }}>Total Amount</small>
                                <strong>₹{timelineOrder.total_amount}</strong>
                            </div>
                            <div style={{ background: 'var(--admin-bg)', padding: '10px 12px', borderRadius: 10 }}>
                                <small style={{ color: 'var(--admin-text-secondary)', display: 'block' }}>Payment</small>
                                <strong style={{ color: timelineOrder.is_paid ? '#16a34a' : '#d97706' }}>
                                    {timelineOrder.is_paid ? 'Paid' : 'Unpaid'}
                                </strong>
                            </div>
                        </div>

                        {/* Payment Reconciliation Info */}
                        {timelineOrder.payment_reconciliations && timelineOrder.payment_reconciliations.length > 0 && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                                <h4 style={{ margin: '0 0 6px 0', color: '#166534', fontSize: 13 }}>💳 Payment Reconciliation Log</h4>
                                {timelineOrder.payment_reconciliations.map((rec) => (
                                    <div key={rec.id} style={{ fontSize: 12, color: '#14532d', lineHeight: 1.5 }}>
                                        <div><strong>Refund Amount:</strong> ₹{rec.refunded_amount} ({rec.gateway_status})</div>
                                        <div><strong>Transaction ID:</strong> <code>{rec.refund_transaction_id}</code></div>
                                        <div><strong>Payment Intent:</strong> <code>{rec.payment_intent_id || 'N/A'}</code></div>
                                        {rec.notes && <div><strong>Notes:</strong> {rec.notes}</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Cancellation reason if cancelled */}
                        {timelineOrder.cancellation_reason && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                                <h4 style={{ margin: '0 0 4px 0', color: '#991b1b', fontSize: 13 }}>Cancellation Details</h4>
                                <p style={{ margin: 0, fontSize: 12, color: '#7f1d1d' }}>{timelineOrder.cancellation_reason}</p>
                            </div>
                        )}

                        {/* Chronological Timeline */}
                        <div style={{ marginTop: 12 }}>
                            <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--admin-text-secondary)', marginBottom: 10 }}>
                                Audit Log & Status History
                            </h4>
                            <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {timelineOrder.timeline && timelineOrder.timeline.length > 0 ? (
                                    timelineOrder.timeline.map((evt) => (
                                        <div key={evt.id} style={{ display: 'flex', gap: 12, fontSize: 13, padding: '8px 12px', background: 'var(--admin-bg)', borderRadius: 8 }}>
                                            <span style={{ color: 'var(--admin-primary)', fontWeight: 800 }}>•</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <strong>{evt.title}</strong>
                                                    <small style={{ color: 'var(--admin-text-secondary)' }}>
                                                        {new Date(evt.created_at).toLocaleString()}
                                                    </small>
                                                </div>
                                                {evt.notes && <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 2 }}>{evt.notes}</div>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>No timeline entries found.</div>
                                )}
                            </div>
                        </div>

                        <div className="admin-modal-actions" style={{ marginTop: 20 }}>
                            <button className="admin-btn outline" onClick={() => setTimelineOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════ STATUS UPDATE MODAL ════════════════ */}
            {statusOrder && (
                <div className="admin-modal-overlay" onClick={() => setStatusOrder(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Update Order #{statusOrder.id} Status</h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                            Current Status: <strong>{statusOrder.status}</strong>
                        </p>

                        <div className="admin-form-group">
                            <label>Target Status</label>
                            <select className="admin-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED', 'DISPUTED'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Admin Note / Reason (Optional)</label>
                            <textarea
                                className="admin-input"
                                rows={2}
                                placeholder="Explain why the status was updated..."
                                value={statusNotes}
                                onChange={e => setStatusNotes(e.target.value)}
                            />
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setStatusOrder(null)}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleStatusUpdate} disabled={actionLoading}>
                                {actionLoading ? 'Updating...' : 'Save Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════ DIRECT REFUND MODAL ════════════════ */}
            {directRefundOrder && (
                <div className="admin-modal-overlay" onClick={() => setDirectRefundOrder(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#b91c1c' }}>Issue Refund for Order #{directRefundOrder.id}</h3>
                        <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                            Item: <strong>{directRefundOrder.product_name}</strong> • Customer: <strong>{directRefundOrder.customer_name}</strong>
                        </p>

                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 10, fontSize: 12, color: '#7f1d1d', margin: '12px 0' }}>
                            ⚠ This will process payment reconciliation, update the order status to <strong>REFUNDED</strong>, reverse seller commissions, and optionally return stock to inventory.
                        </div>

                        <div className="admin-form-group">
                            <label>Refund Amount (₹)</label>
                            <input
                                type="number"
                                className="admin-input"
                                value={refundAmount}
                                onChange={e => setRefundAmount(e.target.value)}
                                max={directRefundOrder.total_amount}
                            />
                            <small style={{ color: 'var(--admin-text-secondary)' }}>Max: ₹{directRefundOrder.total_amount}</small>
                        </div>

                        <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                id="restoreStockCheckbox"
                                checked={restoreStockDirect}
                                onChange={e => setRestoreStockDirect(e.target.checked)}
                            />
                            <label htmlFor="restoreStockCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                                Restore product stock back to inventory (+{directRefundOrder.quantity} units)
                            </label>
                        </div>

                        <div className="admin-form-group">
                            <label>Refund Reason / Admin Note</label>
                            <textarea
                                className="admin-input"
                                rows={2}
                                placeholder="State reason for issuing refund..."
                                value={refundNotes}
                                onChange={e => setRefundNotes(e.target.value)}
                            />
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setDirectRefundOrder(null)}>Cancel</button>
                            <button className="admin-btn danger" onClick={handleDirectRefund} disabled={actionLoading}>
                                {actionLoading ? 'Processing Refund...' : 'Confirm & Reconcile Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════ REVIEW & DECIDE REFUND REQUEST MODAL ════════════════ */}
            {reviewRequest && (
                <div className="admin-modal-overlay" onClick={() => setReviewRequest(null)}>
                    <div className="admin-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
                        <h3>Review Refund Request #{reviewRequest.id}</h3>
                        <div style={{ background: 'var(--admin-bg)', padding: 12, borderRadius: 10, fontSize: 13, marginBottom: 14 }}>
                            <div><strong>Order #{reviewRequest.order}</strong> • {reviewRequest.product_name}</div>
                            <div><strong>Customer:</strong> {reviewRequest.customer_name} ({reviewRequest.customer_email})</div>
                            <div><strong>Reason:</strong> {reviewRequest.reason_display}</div>
                            <div style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--admin-text-secondary)' }}>
                                "{reviewRequest.explanation}"
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Decision</label>
                            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="decision"
                                        value="APPROVE"
                                        checked={reviewDecision === 'APPROVE'}
                                        onChange={() => setReviewDecision('APPROVE')}
                                    />
                                    <span style={{ fontWeight: 700, color: '#16a34a' }}>Approve Refund</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="decision"
                                        value="REJECT"
                                        checked={reviewDecision === 'REJECT'}
                                        onChange={() => setReviewDecision('REJECT')}
                                    />
                                    <span style={{ fontWeight: 700, color: '#dc2626' }}>Reject Request</span>
                                </label>
                            </div>
                        </div>

                        {reviewDecision === 'APPROVE' && (
                            <>
                                <div className="admin-form-group">
                                    <label>Approved Refund Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="admin-input"
                                        value={reviewAmount}
                                        onChange={e => setReviewAmount(e.target.value)}
                                    />
                                </div>

                                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        id="reviewStockCheckbox"
                                        checked={reviewRestoreStock}
                                        onChange={e => setReviewRestoreStock(e.target.checked)}
                                    />
                                    <label htmlFor="reviewStockCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                                        Restore stock back to inventory
                                    </label>
                                </div>
                            </>
                        )}

                        <div className="admin-form-group">
                            <label>
                                Admin Feedback / Notes {reviewDecision === 'REJECT' && <span style={{ color: 'red' }}>*</span>}
                            </label>
                            <textarea
                                className="admin-input"
                                rows={2}
                                placeholder={reviewDecision === 'REJECT' ? 'State clear reasons why the request is rejected...' : 'Optional approval notes...'}
                                value={reviewAdminNotes}
                                onChange={e => setReviewAdminNotes(e.target.value)}
                            />
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-btn outline" onClick={() => setReviewRequest(null)}>Cancel</button>
                            <button
                                className={`admin-btn ${reviewDecision === 'APPROVE' ? 'primary' : 'danger'}`}
                                onClick={handleReviewRefundDecision}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : reviewDecision === 'APPROVE' ? 'Approve & Reconcile' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
