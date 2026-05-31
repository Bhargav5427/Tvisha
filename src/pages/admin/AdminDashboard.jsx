import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REVENUE_BARS = [38, 52, 45, 68, 73, 58, 80, 65, 88, 72, 95, 100];

function StatCard({ icon, iconBg, iconColor, label, value, sub, trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ece5df] p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
          <span className={`material-symbols-outlined text-[22px] ${iconColor}`}>{icon}</span>
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            <span className="material-symbols-outlined text-[12px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#a08070] mb-1">{label}</p>
        <p className="text-[26px] font-bold text-[#1a2e2e] leading-none">{value}</p>
        {sub && <p className="text-[11px] text-[#a08070] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, newTickets: 0, pendingOrders: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    setTimeout(() => setAnimateBars(true), 300);
  }, []);

  async function fetchDashboardData() {
    try {
      const [{ data: orders }, { data: tickets }, { data: lowStock }, { data: products }] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('support_tickets').select('*'),
        supabase.from('products').select('*').lt('stock', 10),
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      let totalSales = 0, pendingCount = 0, newTicketsCount = 0, totalOrders = 0;
      let ordersList = [], stockList = [], productsList = [];

      if (orders && orders.length > 0) {
        totalSales = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
        pendingCount = orders.filter(o => o.status === 'Pending').length;
        totalOrders = orders.length;
        ordersList = orders.slice(0, 6);
      }
      if (tickets) newTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
      if (lowStock) stockList = lowStock;
      if (products && products.length > 0) productsList = products;

      setStats({ totalSales, newTickets: newTicketsCount, pendingOrders: pendingCount, totalOrders });
      setRecentOrders(ordersList);
      setLowStockProducts(stockList);
      setTopProducts(productsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const statusStyle = (s) => ({
    Pending: 'bg-amber-50 text-amber-600 border border-amber-200',
    Processing: 'bg-blue-50 text-blue-600 border border-blue-200',
    Shipped: 'bg-violet-50 text-violet-600 border border-violet-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Cancelled: 'bg-gray-100 text-gray-500',
  }[s] || 'bg-gray-100 text-gray-400');

  const currentMonth = new Date().getMonth();

  return (
    <div className="p-6 pb-12 space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-[#3d9392] to-[#cba55c] rounded-full"></div>
            <h1 className="font-serif text-[28px] font-bold text-[#1a2e2e] leading-none">Admin Overview</h1>
          </div>
          <p className="text-[13px] text-[#a08070] ml-3">
            Welcome back, {(typeof window !== 'undefined' && '') || 'Admin'} — here's your boutique at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#ece5df] px-4 py-2 shadow-sm">
          <span className="material-symbols-outlined text-[#3d9392] text-[16px]">calendar_today</span>
          <span className="text-[12px] font-semibold text-[#6b5c52]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="payments" iconBg="bg-[#3d9392]/10" iconColor="text-[#3d9392]"
          label="Total Revenue" value={`₹${(stats.totalSales / 1000).toFixed(0)}K`}
          sub={`₹${stats.totalSales.toLocaleString()} lifetime`} trend="+12%" trendUp
        />
        <StatCard
          icon="shopping_bag" iconBg="bg-[#d17b60]/10" iconColor="text-[#d17b60]"
          label="Total Orders" value={stats.totalOrders}
          sub={`${stats.pendingOrders} pending dispatch`} trend="+5" trendUp
        />
        <StatCard
          icon="mark_email_unread" iconBg="bg-[#cba55c]/10" iconColor="text-[#cba55c]"
          label="Support Tickets" value={stats.newTickets}
          sub="Open or in progress" trend={stats.newTickets > 3 ? 'High' : 'Low'} trendUp={stats.newTickets <= 3}
        />
        <StatCard
          icon="inventory_2" iconBg="bg-violet-50" iconColor="text-violet-500"
          label="Low Stock Alerts" value={lowStockProducts.length}
          sub="Items below threshold" trend={lowStockProducts.length > 0 ? 'Action needed' : 'All clear'} trendUp={lowStockProducts.length === 0}
        />
      </div>

      {/* Revenue Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e]">Revenue Trend</h3>
              <p className="text-[11px] text-[#a08070] mt-0.5">Monthly performance — current year</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              +18.4% YoY
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-48 border-b border-l border-[#e8ddd5] pb-2 pl-2 pr-1">
            {REVENUE_BARS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer ${
                    i === currentMonth
                      ? 'bg-gradient-to-t from-[#3d9392] to-[#5dbdbc] shadow-lg shadow-[#3d9392]/25'
                      : i < currentMonth
                      ? 'bg-[#3d9392]/35 hover:bg-[#3d9392]/55'
                      : 'bg-[#e8ddd5] hover:bg-[#d5ccc6]'
                  }`}
                  style={{ height: animateBars ? `${h}%` : '0%' }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a2e2e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ₹{(h * 2.1).toFixed(0)}K
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 pl-2 pr-1">
            {MONTHS.map((m, i) => (
              <span key={i} className={`flex-1 text-center text-[9px] font-bold uppercase ${i === currentMonth ? 'text-[#3d9392]' : 'text-[#c0b0a5]'}`}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e]">Catalog Snapshot</h3>
            <p className="text-[11px] text-[#a08070] mt-0.5">Latest inventory items</p>
          </div>
          <div className="space-y-3">
            {topProducts.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 group">
                <div className="relative flex-shrink-0">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-11 h-13 object-cover rounded-lg border border-[#ece5df] group-hover:border-[#3d9392]/30 transition-all"
                  />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#3d9392] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1a2e2e] truncate">{p.title}</p>
                  <p className="text-[11px] text-[#3d9392] font-bold">₹{p.price.toLocaleString()}</p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.stock <= 5 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                  {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8e2] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e]">Recent Orders</h3>
              <p className="text-[11px] text-[#a08070]">Latest customer transactions</p>
            </div>
            <a href="/admin/orders" className="text-[11px] font-bold text-[#3d9392] hover:underline flex items-center gap-1">
              View all
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#3d9392] mx-auto"></div>
            </div>
          ) : (
            <div className="divide-y divide-[#f7f3f0]">
              {recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-[#f7f3f0] transition-colors"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#3d9392]/10 text-[#3d9392] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {order.customer_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#1a2e2e] truncate">{order.customer_name}</p>
                    <p className="text-[10px] text-[#a08070]">
                      {order.id.length > 8 ? `#TV-${order.id.slice(0, 8).toUpperCase()}` : `#TV-${order.id}`}
                      &nbsp;·&nbsp;
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold text-[#3d9392]">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e]">Stock Alerts</h3>
            <p className="text-[11px] text-[#a08070]">Items below safe threshold</p>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-emerald-500 text-[24px]">check_circle</span>
              </div>
              <p className="text-[12px] font-semibold text-[#6b5c52]">All items stocked well</p>
              <p className="text-[11px] text-[#a08070]">No low stock alerts right now.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/60 border border-red-100">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#1a2e2e] truncate">{p.title}</p>
                    <p className="text-[10px] text-red-500 font-semibold">{p.stock === 0 ? 'Out of stock' : `Only ${p.stock} left`}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#f0e8e2]">
            <a href="/admin/inventory" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#3d9392]/30 text-[#3d9392] text-[12px] font-semibold hover:bg-[#3d9392]/5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              Manage Inventory
            </a>
          </div>
        </div>
      </div>

      {/* Activity Summary Footer */}
      <div className="bg-gradient-to-r from-[#1a2e2e] to-[#2a4a4a] rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 shadow-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[#cba55c] text-[20px]">auto_awesome</span>
          </div>
          <div>
            <p className="text-white font-semibold text-[14px]">Boutique Performance</p>
            <p className="text-white/60 text-[11px]">TVISHA luxury studio — all systems operational</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: 'Avg Order', value: stats.totalOrders > 0 ? `₹${Math.round(stats.totalSales / stats.totalOrders).toLocaleString()}` : '₹78K' },
            { label: 'Fulfillment', value: '94%' },
            { label: 'Satisfaction', value: '4.9★' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-white font-bold text-[16px]">{item.value}</p>
              <p className="text-white/50 text-[9px] uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
