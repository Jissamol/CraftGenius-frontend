import { useState, useEffect } from 'react';
import Api from '../services/Api';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = () => {
        setLoading(true);
        Api.get('admin/customers/')
            .then(res => setCustomers(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleToggle = (id) => {
        Api.put(`admin/customers/${id}/toggle/`)
            .then(() => fetchData())
            .catch(() => alert('Action failed.'));
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="admin-dashboard-header">
                <h1>Customer Management</h1>
                <p>View and manage all customers</p>
            </div>

            <div className="admin-search-bar">
                <span>🔍</span>
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-glass-card">
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-loading">No customers found.</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Joined</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id}>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.email}</td>
                                        <td>{c.total_orders}</td>
                                        <td style={{ fontWeight: 600 }}>₹{c.total_spent.toLocaleString()}</td>
                                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`admin-badge ${c.is_active ? 'active' : 'suspended'}`}>
                                                {c.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`admin-btn sm ${c.is_active ? 'danger' : 'success'}`}
                                                onClick={() => handleToggle(c.id)}
                                            >
                                                {c.is_active ? 'Suspend' : 'Reactivate'}
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
    );
}

export default Customers;
