import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, IndianRupee, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const PIE_COLORS = ['#7C3AED', '#3B82F6', '#EC4899', '#F59E0B', '#10B981'];

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await Api.get('seller/analytics/', { params: { period } });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setData({
        revenue_trend: [],
        best_categories: [],
        total_orders: 0,
        total_revenue: 0,
        conversion_rate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '180', label: '6 Months' },
    { value: '365', label: '1 Year' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-gray-500 text-xs font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.name === 'revenue' 
                ? `₹${Number(entry.value).toLocaleString('en-IN')}` 
                : `${entry.value} Orders`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-100 rounded-lg mb-2" />
            <div className="h-4 w-64 bg-gray-50 rounded-lg" />
          </div>
          <div className="h-10 w-64 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-96 bg-white rounded-2xl border border-gray-100 shadow-sm" />
          <div className="h-96 bg-white rounded-2xl border border-gray-100 shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header & Period Selector ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analytics Overview
          </h1>
          <p className="text-sm text-gray-400 mt-1">Deep insights into your business performance</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {periodOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                period === opt.value
                  ? 'bg-white text-violet-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingCart size={20} className="text-violet-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{data.total_orders}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <IndianRupee size={20} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 mb-1">
            ₹{Number(data.total_revenue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Activity size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{data.conversion_rate}%</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</p>
        </div>

      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Revenue Trend Area Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-500" />
            <h3 className="font-bold text-gray-900 text-sm">Revenue Trend</h3>
          </div>
          
          {data.revenue_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.revenue_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#10B981" strokeWidth={3} fill="url(#revGrad)" activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
              <TrendingUp size={32} className="mb-3 text-gray-200" />
              <p className="text-sm font-medium">No revenue data</p>
            </div>
          )}
        </div>

        {/* Order Trend Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-violet-600" />
            <h3 className="font-bold text-gray-900 text-sm">Order Trend</h3>
          </div>
          
          {data.revenue_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.revenue_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#F5F3FF', radius: 8 }} />
                <Bar dataKey="orders" name="orders" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
              <BarChart3 size={32} className="mb-3 text-gray-200" />
              <p className="text-sm font-medium">No order data</p>
            </div>
          )}
        </div>

      </div>

      {/* ── Best Categories Pie Chart ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon size={18} className="text-pink-500" />
          <h3 className="font-bold text-gray-900 text-sm">Best Selling Categories</h3>
        </div>

        {data.best_categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.best_categories}
                    dataKey="orders"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.best_categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Top Cat</span>
                <span className="text-sm font-bold text-gray-900 text-center truncate w-full max-w-[110px]">
                  {data.best_categories[0]?.name}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {data.best_categories.map((cat, i) => {
                const maxOrders = Math.max(...data.best_categories.map(c => c.orders));
                const pct = Math.round((cat.orders / maxOrders) * 100);
                
                return (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: `${PIE_COLORS[i % PIE_COLORS.length]}15` }}>
                      <span className="font-bold text-sm" style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>
                        #{i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">{cat.name}</span>
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                          {cat.orders} orders
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="h-[250px] flex flex-col items-center justify-center text-gray-400">
            <PieChartIcon size={32} className="mb-3 text-gray-200" />
            <p className="text-sm font-medium">No category data available</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Analytics;
