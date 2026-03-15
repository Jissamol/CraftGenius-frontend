import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Package, ShoppingCart, Clock, IndianRupee, Star,
  TrendingUp, ArrowRight, AlertCircle, Plus
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   Animated counter
═══════════════════════════════════════════════ */
function AnimatedCounter({ end, prefix = '', suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const duration = 800;
    let start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(parseFloat((p * end).toFixed(decimals)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [end, decimals]);
  return <>{prefix}{decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString('en-IN')}{suffix}</>;
}

/* ═══════════════════════════════════════════════
   Circular progress ring
═══════════════════════════════════════════════ */
function CircularProgress({ pct, size = 120, stroke = 8, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Stock badge helper
═══════════════════════════════════════════════ */
function StockBadge({ stock }) {
  if (stock === 0)
    return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Out of Stock</span>;
  if (stock <= 10)
    return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">Low Stock</span>;
  return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">In Stock</span>;
}

/* ═══════════════════════════════════════════════
   Skeleton loader
═══════════════════════════════════════════════ */
function Skeleton({ className = '' }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

/* ═══════════════════════════════════════════════
   Custom chart tooltip
═══════════════════════════════════════════════ */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm">
      <p className="text-gray-500 text-xs mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold text-gray-900">
          {p.name === 'revenue' ? `₹${Number(p.value).toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════ */
function Overview() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, prodRes, analRes] = await Promise.all([
        Api.get('seller/overview/'),
        Api.get('products/my/'),
        Api.get('seller/analytics/?period=90'),
      ]);
      setOverview(ovRes.data);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setAnalytics(analRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading state ── */
  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <Skeleton className="w-8 h-8 mb-4 rounded-lg" />
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );

  /* ── Error state ── */
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={32} className="text-red-500 mb-3" />
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={fetchAll} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
        Try Again
      </button>
    </div>
  );

  /* ── Derived values ── */
  const totalRevenue = overview?.total_earnings || 0;
  const totalOrders  = overview?.total_orders || 0;
  const pending      = overview?.pending_orders || 0;
  const avgRating    = overview?.average_rating || 0;
  const monthlySales = overview?.monthly_sales || [];

  // Best Selling products
  const topProducts = (overview?.monthly_sales?.length > 0 || true)
    ? products
        .slice()
        .sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0))
        .slice(0, 3)
    : [];
  const maxOrders = Math.max(...topProducts.map(p => p.total_orders || 0), 1);

  // Revenue Target Calculation (Professional approach)
  // Let's assume a dynamic monthly target based on historical performance, or just cap it at some round number for visual
  const revenueTarget = Math.max(10000, Math.ceil(totalRevenue / 10000) * 10000); 
  const revenuePct = Math.min(Math.round((totalRevenue / revenueTarget) * 100), 100);

  // Sales trend (orders over months for bar chart)
  const visitorsData = monthlySales.map(m => ({ month: m.month, orders: m.orders || 0 }));

  // Revenue trend for line chart
  const salesChartData = analytics?.revenue_trend?.map(d => ({
    date: d.date?.slice(5) || d.date, 
    revenue: d.revenue,
    orders: d.orders,
  })) || [];

  /* ══════════════════════════════════════════════
     STAT CARDS CONFIG
  ══════════════════════════════════════════════ */
  const statCards = [
    {
      icon: IndianRupee,
      label: 'Revenue',
      value: totalRevenue,
      prefix: '₹',
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      value: totalOrders,
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pending,
      badge: pending > 0 ? 'Action required' : null,
      badgeColor: 'bg-red-50 text-red-600 border border-red-200',
    },
    {
      icon: Star,
      label: 'Rating',
      value: avgRating,
      decimals: 1,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store's performance.</p>
        </div>
        <button
          onClick={() => navigate('/handicrafter/add-product')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* ════════════════════════════════════════
          ROW 1 — STAT CARDS
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, prefix='', decimals=0, badge, badgeColor }, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-gray-500">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              {badge && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">
              <AnimatedCounter end={value} prefix={prefix} decimals={decimals} />
            </p>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════
          ROW 2 — ANALYTICS CARDS (3 columns)
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Card 1: Total Sales circular */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">Monthly Target</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">Progress towards ₹{revenueTarget.toLocaleString()} goal</p>

          <div className="flex-1 flex items-center justify-center relative">
            <CircularProgress pct={revenuePct} size={140} stroke={12} color="#4f46e5" />
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-semibold text-gray-900">
                {revenuePct}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Revenue</p>
              <p className="text-sm font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Orders</p>
              <p className="text-sm font-semibold text-gray-900">{totalOrders}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-sm font-semibold text-gray-900">{pending}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Best Selling Products */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">Top Products</h3>
            <button
              onClick={() => navigate('/handicrafter/products')}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-6">By volume</p>

          {topProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Package size={24} className="mb-2 text-gray-300" />
              <p className="text-sm">No sales yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topProducts.map((p, i) => {
                const pct = Math.round(((p.total_orders || 0) / maxOrders) * 100);
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                          {p.primary_image_url
                            ? <img src={p.primary_image_url} alt={p.name} className="w-full h-full object-cover" />
                            : <Package size={14} className="m-auto text-gray-400 mt-2" />
                          }
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0 ml-3">{p.total_orders || 0}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Monthly Orders Bar Chart */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">Monthly Volume</h3>
            <p className="text-xs text-gray-500 mt-1">Orders per month</p>
          </div>

          {visitorsData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <TrendingUp size={24} className="mb-2 text-gray-300" />
              <p className="text-sm">No data yet</p>
            </div>
          ) : (
            <div className="flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <BarChart data={visitorsData} barSize={24} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => v?.substring(0, 3)}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="orders" name="orders" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 3 — PRODUCT STOCK TABLE + SALES CHART
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Product Stock Table — 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Inventory</h3>
            </div>
            <button
              onClick={() => navigate('/handicrafter/products')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 font-medium text-gray-500">Product</th>
                  <th className="px-5 py-3 font-medium text-gray-500">SKU</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Stock</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 text-sm">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.slice(0, 5).map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                            {product.primary_image_url
                              ? <img src={product.primary_image_url} alt={product.name} className="w-full h-full object-cover" />
                              : <Package size={14} className="m-auto text-gray-400 mt-2" />
                            }
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[150px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-gray-500">#{String(product.id).padStart(5, '0')}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-900">{product.stock}</td>
                      <td className="px-5 py-3"><StockBadge stock={product.stock} /></td>
                      <td className="px-5 py-3 text-gray-900">₹{parseFloat(product.price).toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Analytics Chart — 1/3 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Revenue Trend</h3>
            <p className="text-xs text-gray-500 mt-1">Last 90 days</p>
          </div>

          {salesChartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <TrendingUp size={24} className="mb-2 text-gray-300" />
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <AreaChart data={salesChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="url(#salesGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Overview;
