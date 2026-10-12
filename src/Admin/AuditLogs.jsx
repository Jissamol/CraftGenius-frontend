import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { 
    Shield, AlertTriangle, CheckCircle2, Clock, Search, RefreshCw, 
    Terminal, Eye, Check, AlertOctagon, Activity, FileText, Layers, 
    ArrowUpRight, Server, Globe
} from 'lucide-react';
import './AuditLogs.css';

export default function AuditLogs() {
    const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'monitoring'

    // ── Audit Logs State ──
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditCounts, setAuditCounts] = useState({});
    const [auditTotal, setAuditTotal] = useState(0);
    const [auditTypeFilter, setAuditTypeFilter] = useState('');
    const [auditSearch, setAuditSearch] = useState('');
    const [loadingAudit, setLoadingAudit] = useState(true);
    const [selectedAuditLog, setSelectedAuditLog] = useState(null);

    // ── Monitoring Logs State ──
    const [monitoringLogs, setMonitoringLogs] = useState([]);
    const [healthSummary, setHealthSummary] = useState({
        total_events: 0,
        unresolved_count: 0,
        payment_failures: 0,
        webhook_errors: 0,
        critical_alerts: 0,
        gateway_health: 'HEALTHY'
    });
    const [monitoringTypeFilter, setMonitoringTypeFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const [resolvedFilter, setResolvedFilter] = useState('');
    const [monitoringSearch, setMonitoringSearch] = useState('');
    const [loadingMonitoring, setLoadingMonitoring] = useState(true);

    // ── Modals State ──
    const [inspectPayloadLog, setInspectPayloadLog] = useState(null);
    const [resolvingLog, setResolvingLog] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [submittingResolve, setSubmittingResolve] = useState(false);

    // Fetch Audit Logs
    const fetchAuditLogs = () => {
        setLoadingAudit(true);
        const params = new URLSearchParams();
        if (auditTypeFilter) params.append('action_type', auditTypeFilter);
        if (auditSearch.trim()) params.append('search', auditSearch.trim());

        Api.get(`admin/audit-logs/?${params.toString()}`)
            .then(res => {
                setAuditLogs(res.data.logs || []);
                setAuditCounts(res.data.counts || {});
                setAuditTotal(res.data.total_logs || 0);
            })
            .catch(err => {
                console.error("Failed to load audit logs", err);
            })
            .finally(() => setLoadingAudit(false));
    };

    // Fetch Monitoring Logs
    const fetchMonitoringLogs = () => {
        setLoadingMonitoring(true);
        const params = new URLSearchParams();
        if (monitoringTypeFilter) params.append('log_type', monitoringTypeFilter);
        if (severityFilter) params.append('severity', severityFilter);
        if (resolvedFilter) params.append('resolved', resolvedFilter);
        if (monitoringSearch.trim()) params.append('search', monitoringSearch.trim());

        Api.get(`admin/monitoring/?${params.toString()}`)
            .then(res => {
                setMonitoringLogs(res.data.logs || []);
                if (res.data.health_summary) {
                    setHealthSummary(res.data.health_summary);
                }
            })
            .catch(err => {
                console.error("Failed to load monitoring logs", err);
            })
            .finally(() => setLoadingMonitoring(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (activeTab === 'audit') {
            fetchAuditLogs();
        } else {
            fetchMonitoringLogs();
        }
    }, [activeTab, auditTypeFilter, monitoringTypeFilter, severityFilter, resolvedFilter]);

    // Handle Search Submission
    const handleAuditSearchSubmit = (e) => {
        e.preventDefault();
        fetchAuditLogs();
    };

    const handleMonitoringSearchSubmit = (e) => {
        e.preventDefault();
        fetchMonitoringLogs();
    };

    // Resolve an Incident
    const handleConfirmResolve = (e) => {
        e.preventDefault();
        if (!resolvingLog) return;
        setSubmittingResolve(true);

        Api.post(`admin/monitoring/${resolvingLog.id}/resolve/`, { notes: resolutionNotes })
            .then(() => {
                setResolvingLog(null);
                setResolutionNotes('');
                fetchMonitoringLogs();
            })
            .catch(err => {
                alert(err.response?.data?.detail || "Failed to resolve incident.");
            })
            .finally(() => setSubmittingResolve(false));
    };

    // Formatters & Badges
    const formatDate = (isoString) => {
        if (!isoString) return '—';
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getActionBadgeClass = (actionType) => {
        switch (actionType) {
            case 'PRODUCT_MODERATION': return 'moderation';
            case 'SELLER_APPROVAL': return 'approval';
            case 'COMMISSION_CHANGE': return 'commission';
            case 'DISPUTE_RESOLUTION': return 'dispute';
            case 'PAYOUT_DECISION': return 'payout';
            case 'REFUND_DECISION': return 'refund';
            default: return 'other';
        }
    };

    const formatActionType = (type) => {
        return (type || '').replace(/_/g, ' ');
    };

    return (
        <div className="audit-logs-container">
            {/* Page Header */}
            <div className="admin-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Audit Logs & Platform Monitoring</h1>
                    <p>Track administrator actions, monitor payment health, and investigate webhook anomalies</p>
                </div>
                <button 
                    className="admin-btn admin-btn-secondary" 
                    onClick={() => activeTab === 'audit' ? fetchAuditLogs() : fetchMonitoringLogs()}
                    title="Refresh Logs"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="audit-tabs-nav">
                <button 
                    className={`audit-nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audit')}
                >
                    <Shield size={18} /> Admin Audit Trail
                </button>
                <button 
                    className={`audit-nav-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monitoring')}
                >
                    <Activity size={18} /> Platform Error Monitoring & Health
                    {healthSummary.unresolved_count > 0 && (
                        <span style={{ 
                            marginLeft: '6px', 
                            padding: '2px 8px', 
                            fontSize: '0.75rem', 
                            borderRadius: '12px', 
                            background: '#e74c3c', 
                            color: '#fff',
                            fontWeight: 700
                        }}>
                            {healthSummary.unresolved_count}
                        </span>
                    )}
                </button>
            </div>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* TAB 1: ADMIN AUDIT TRAIL                                          */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'audit' && (
                <div>
                    {/* Health / Stat Cards */}
                    <div className="health-cards-grid">
                        <div className="health-stat-card">
                            <div className="health-stat-icon info"><Layers size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Total Audit Entries</span>
                                <span className="health-stat-value">{auditTotal}</span>
                            </div>
                        </div>
                        <div className="health-stat-card">
                            <div className="health-stat-icon purple"><Shield size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Product Moderations</span>
                                <span className="health-stat-value">{auditCounts.PRODUCT_MODERATION || 0}</span>
                            </div>
                        </div>
                        <div className="health-stat-card">
                            <div className="health-stat-icon healthy"><CheckCircle2 size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Seller Approvals</span>
                                <span className="health-stat-value">{auditCounts.SELLER_APPROVAL || 0}</span>
                            </div>
                        </div>
                        <div className="health-stat-card">
                            <div className="health-stat-icon warning"><ArrowUpRight size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Commission Changes</span>
                                <span className="health-stat-value">{auditCounts.COMMISSION_CHANGE || 0}</span>
                            </div>
                        </div>
                        <div className="health-stat-card">
                            <div className="health-stat-icon info"><FileText size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Dispute Resolutions</span>
                                <span className="health-stat-value">{auditCounts.DISPUTE_RESOLUTION || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="audit-controls-bar">
                        <div className="audit-filters-group">
                            <select 
                                className="audit-filter-select"
                                value={auditTypeFilter}
                                onChange={(e) => setAuditTypeFilter(e.target.value)}
                            >
                                <option value="">All Action Types</option>
                                <option value="PRODUCT_MODERATION">Product Moderation</option>
                                <option value="SELLER_APPROVAL">Seller Approval / Verification</option>
                                <option value="COMMISSION_CHANGE">Commission Change</option>
                                <option value="DISPUTE_RESOLUTION">Dispute Resolution</option>
                                <option value="REFUND_DECISION">Refund Decisions</option>
                                <option value="PAYOUT_DECISION">Payout Decisions</option>
                                <option value="OTHER">Other Admin Actions</option>
                            </select>
                        </div>

                        <form onSubmit={handleAuditSearchSubmit} className="audit-search-wrapper">
                            <Search size={16} className="audit-search-icon" />
                            <input 
                                type="text"
                                className="audit-search-input"
                                placeholder="Search summary or target repr..."
                                value={auditSearch}
                                onChange={(e) => setAuditSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Audit Logs Table */}
                    <div className="admin-glass-card">
                        {loadingAudit ? (
                            <div className="admin-loading">Loading audit records...</div>
                        ) : auditLogs.length === 0 ? (
                            <div className="admin-loading">No audit records match the selected criteria.</div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Administrator</th>
                                            <th>Action Type</th>
                                            <th>Target Entity</th>
                                            <th>Action Summary</th>
                                            <th>IP Address</th>
                                            <th style={{ textAlign: 'center' }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map(log => (
                                            <tr key={log.id}>
                                                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                                    <Clock size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle', opacity: 0.7 }} />
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div className="user-avatar-badge">
                                                            {(log.admin_name || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{log.admin_name}</div>
                                                            <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>{log.admin_email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`action-type-pill ${getActionBadgeClass(log.action_type)}`}>
                                                        {formatActionType(log.action_type)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong style={{ fontSize: '0.88rem' }}>{log.target_repr || '—'}</strong>
                                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                                        {log.target_model} #{log.target_id || ''}
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: '0.9rem', maxWidth: '300px' }}>
                                                    {log.action_summary}
                                                </td>
                                                <td style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                                                    {log.ip_address || '—'}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button 
                                                        className="admin-btn admin-btn-sm admin-btn-secondary"
                                                        onClick={() => setSelectedAuditLog(log)}
                                                        title="Inspect full context and payload"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* TAB 2: PLATFORM ERROR MONITORING                                   */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'monitoring' && (
                <div>
                    {/* Platform Health Overview Cards */}
                    <div className="health-cards-grid">
                        <div className="health-stat-card">
                            <div className={`health-stat-icon ${healthSummary.gateway_health === 'HEALTHY' ? 'healthy' : 'degraded'}`}>
                                <Server size={22} />
                            </div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Stripe Gateway</span>
                                <div style={{ marginTop: '0.25rem' }}>
                                    <span className={`health-status-badge ${healthSummary.gateway_health === 'HEALTHY' ? 'healthy' : 'degraded'}`}>
                                        {healthSummary.gateway_health === 'HEALTHY' ? <Check size={14} /> : <AlertOctagon size={14} />}
                                        {healthSummary.gateway_health}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="health-stat-card">
                            <div className="health-stat-icon degraded"><AlertTriangle size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Unresolved Incidents</span>
                                <span className="health-stat-value" style={{ color: healthSummary.unresolved_count > 0 ? '#e74c3c' : 'inherit' }}>
                                    {healthSummary.unresolved_count}
                                </span>
                            </div>
                        </div>

                        <div className="health-stat-card">
                            <div className="health-stat-icon warning"><AlertOctagon size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Payment Failures</span>
                                <span className="health-stat-value">{healthSummary.payment_failures}</span>
                            </div>
                        </div>

                        <div className="health-stat-card">
                            <div className="health-stat-icon info"><Globe size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Webhook Errors</span>
                                <span className="health-stat-value">{healthSummary.webhook_errors}</span>
                            </div>
                        </div>

                        <div className="health-stat-card">
                            <div className="health-stat-icon degraded"><AlertTriangle size={22} /></div>
                            <div className="health-stat-info">
                                <span className="health-stat-title">Critical Alerts</span>
                                <span className="health-stat-value" style={{ color: healthSummary.critical_alerts > 0 ? '#e74c3c' : 'inherit' }}>
                                    {healthSummary.critical_alerts}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="audit-controls-bar">
                        <div className="audit-filters-group">
                            <select 
                                className="audit-filter-select"
                                value={monitoringTypeFilter}
                                onChange={(e) => setMonitoringTypeFilter(e.target.value)}
                            >
                                <option value="">All Log Types</option>
                                <option value="WEBHOOK_ERROR">Webhook Processing Errors</option>
                                <option value="PAYMENT_FAILURE">Failed / Expired Payments</option>
                                <option value="GATEWAY_ANOMALY">Payment Gateway Anomalies</option>
                                <option value="SYSTEM_EXCEPTION">System Exceptions</option>
                            </select>

                            <select 
                                className="audit-filter-select"
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                            >
                                <option value="">All Severities</option>
                                <option value="CRITICAL">Critical</option>
                                <option value="ERROR">Error</option>
                                <option value="WARNING">Warning</option>
                                <option value="INFO">Info</option>
                            </select>

                            <select 
                                className="audit-filter-select"
                                value={resolvedFilter}
                                onChange={(e) => setResolvedFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="false">Unresolved Only</option>
                                <option value="true">Resolved Only</option>
                            </select>
                        </div>

                        <form onSubmit={handleMonitoringSearchSubmit} className="audit-search-wrapper">
                            <Search size={16} className="audit-search-icon" />
                            <input 
                                type="text"
                                className="audit-search-input"
                                placeholder="Search error, event ID, email..."
                                value={monitoringSearch}
                                onChange={(e) => setMonitoringSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Incident Logs Table */}
                    <div className="admin-glass-card">
                        {loadingMonitoring ? (
                            <div className="admin-loading">Loading error monitoring logs...</div>
                        ) : monitoringLogs.length === 0 ? (
                            <div className="admin-loading">No error logs or anomalies recorded. System operating smoothly.</div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Severity</th>
                                            <th>Event Type & Source</th>
                                            <th>Event ID / Order</th>
                                            <th>Customer Email</th>
                                            <th>Error Message / Incident Details</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monitoringLogs.map(log => (
                                            <tr key={log.id} style={{ background: !log.is_resolved && log.severity === 'CRITICAL' ? 'rgba(231, 76, 60, 0.05)' : 'inherit' }}>
                                                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                                    <Clock size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle', opacity: 0.7 }} />
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td>
                                                    <span className={`severity-badge ${log.severity.toLowerCase()}`}>
                                                        {log.severity}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatActionType(log.log_type)}</div>
                                                    <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>{log.source}</div>
                                                </td>
                                                <td style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                                                    <div>{log.event_id || '—'}</div>
                                                    {log.order && (
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--admin-primary)' }}>
                                                            Order #{log.order}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>
                                                    {log.customer_email || '—'}
                                                </td>
                                                <td style={{ fontSize: '0.88rem', maxWidth: '320px' }}>
                                                    <div style={{ color: log.severity === 'CRITICAL' || log.severity === 'ERROR' ? '#e74c3c' : 'inherit', fontWeight: 500 }}>
                                                        {log.error_message}
                                                    </div>
                                                </td>
                                                <td>
                                                    {log.is_resolved ? (
                                                        <div>
                                                            <span className="admin-badge approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                <CheckCircle2 size={12} /> Resolved
                                                            </span>
                                                            <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '2px' }}>
                                                                by {log.resolved_by_name || 'Admin'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="admin-badge pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <AlertTriangle size={12} /> Open Incident
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                        <button 
                                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                                            onClick={() => setInspectPayloadLog(log)}
                                                            title="Inspect Payload"
                                                        >
                                                            <Terminal size={13} /> Payload
                                                        </button>
                                                        {!log.is_resolved && (
                                                            <button 
                                                                className="admin-btn admin-btn-sm admin-btn-primary"
                                                                onClick={() => {
                                                                    setResolvingLog(log);
                                                                    setResolutionNotes('');
                                                                }}
                                                                title="Mark Incident Resolved"
                                                            >
                                                                <Check size={13} /> Resolve
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* AUDIT LOG DETAILS MODAL                                           */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {selectedAuditLog && (
                <div className="audit-modal-overlay" onClick={() => setSelectedAuditLog(null)}>
                    <div className="audit-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="audit-modal-header">
                            <h3 className="audit-modal-title">Audit Record #{selectedAuditLog.id} Details</h3>
                            <button className="audit-modal-close" onClick={() => setSelectedAuditLog(null)}>✕</button>
                        </div>

                        <div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Action Performed</span>
                                <span className="audit-detail-val">{formatActionType(selectedAuditLog.action_type)}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Administrator</span>
                                <span className="audit-detail-val">{selectedAuditLog.admin_name} ({selectedAuditLog.admin_email})</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Target Entity</span>
                                <span className="audit-detail-val">{selectedAuditLog.target_model} #{selectedAuditLog.target_id} ({selectedAuditLog.target_repr})</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Timestamp</span>
                                <span className="audit-detail-val">{formatDate(selectedAuditLog.created_at)}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Client IP Address</span>
                                <span className="audit-detail-val" style={{ fontFamily: 'monospace' }}>{selectedAuditLog.ip_address || 'N/A'}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Action Summary</span>
                                <span className="audit-detail-val">{selectedAuditLog.action_summary}</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                                State Snapshot / Action Payload (JSON)
                            </label>
                            <pre className="audit-json-box">
                                {JSON.stringify(selectedAuditLog.details, null, 2)}
                            </pre>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedAuditLog(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* INSPECT PAYLOAD MODAL                                             */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {inspectPayloadLog && (
                <div className="audit-modal-overlay" onClick={() => setInspectPayloadLog(null)}>
                    <div className="audit-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="audit-modal-header">
                            <h3 className="audit-modal-title">Incident Payload: #{inspectPayloadLog.id}</h3>
                            <button className="audit-modal-close" onClick={() => setInspectPayloadLog(null)}>✕</button>
                        </div>

                        <div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Event Source</span>
                                <span className="audit-detail-val">{inspectPayloadLog.source}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Event ID</span>
                                <span className="audit-detail-val" style={{ fontFamily: 'monospace' }}>{inspectPayloadLog.event_id || 'N/A'}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Severity</span>
                                <span className="audit-detail-val">{inspectPayloadLog.severity}</span>
                            </div>
                            <div className="audit-detail-row">
                                <span className="audit-detail-label">Error Message</span>
                                <span className="audit-detail-val" style={{ color: '#e74c3c' }}>{inspectPayloadLog.error_message}</span>
                            </div>
                            {inspectPayloadLog.resolution_notes && (
                                <div className="audit-detail-row">
                                    <span className="audit-detail-label">Resolution Notes</span>
                                    <span className="audit-detail-val" style={{ color: '#27ae60' }}>{inspectPayloadLog.resolution_notes}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                                Full Captured Payload & Stack Details
                            </label>
                            <pre className="audit-json-box">
                                {JSON.stringify(inspectPayloadLog.payload, null, 2)}
                            </pre>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <button className="admin-btn admin-btn-secondary" onClick={() => setInspectPayloadLog(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* RESOLVE INCIDENT MODAL                                            */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {resolvingLog && (
                <div className="audit-modal-overlay" onClick={() => setResolvingLog(null)}>
                    <div className="audit-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="audit-modal-header">
                            <h3 className="audit-modal-title">Resolve Incident #{resolvingLog.id}</h3>
                            <button className="audit-modal-close" onClick={() => setResolvingLog(null)}>✕</button>
                        </div>

                        <div style={{ background: 'var(--admin-primary-light)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem' }}>
                            <strong>{formatActionType(resolvingLog.log_type)}:</strong> {resolvingLog.error_message}
                        </div>

                        <form onSubmit={handleConfirmResolve}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
                                    Resolution Notes / Action Taken:
                                </label>
                                <textarea 
                                    className="admin-textarea"
                                    rows={4}
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                    placeholder="e.g. Verified customer re-ordered with alternate payment method, or webhook endpoint re-synced."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button 
                                    type="button" 
                                    className="admin-btn admin-btn-secondary" 
                                    onClick={() => setResolvingLog(null)}
                                    disabled={submittingResolve}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="admin-btn admin-btn-primary" 
                                    disabled={submittingResolve}
                                >
                                    {submittingResolve ? 'Saving...' : 'Mark as Resolved'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
