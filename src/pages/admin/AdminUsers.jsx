import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const STATUS_CONFIG = {
  Open:        { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     dot: 'bg-red-400',     icon: 'mail' },
  'In Progress':{ bg: 'bg-amber-50',  text: 'text-amber-600',   border: 'border-amber-200',   dot: 'bg-amber-400',   icon: 'autorenew' },
  Resolved:    { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400', icon: 'check_circle' },
  Closed:      { bg: 'bg-gray-100',   text: 'text-gray-500',    border: 'border-gray-200',    dot: 'bg-gray-400',    icon: 'do_not_disturb' },
};

function getInitials(name) {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
}

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => { fetchUsersFromOrders(); fetchTickets(); }, []);

  async function fetchUsersFromOrders() {
    setLoadingUsers(true);
    try {
      const { data: orders, error } = await supabase.from('orders').select('customer_name, customer_email, total_amount, created_at').order('created_at', { ascending: false });
      if (error) throw error;
      if (orders && orders.length > 0) {
        const map = {};
        orders.forEach(o => {
          const email = o.customer_email.toLowerCase();
          if (!map[email]) map[email] = { name: o.customer_name, email: o.customer_email, totalSpend: 0, joinedDate: new Date(o.created_at).toLocaleDateString(), role: 'CUSTOMER' };
          map[email].totalSpend += parseFloat(o.total_amount || 0);
        });
        const list = Object.values(map).map(u => {
          if (u.totalSpend >= 100000) u.role = 'VIP GOLD';
          else if (u.totalSpend >= 50000) u.role = 'VIP SILVER';
          return u;
        });
        setUsers(list);
      } else setUsers([]);
    } catch { setUsers([]); }
    finally { setLoadingUsers(false); }
  }

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) { setTickets(data); setSelectedTicket(data[0]); }
      else { setTickets([]); setSelectedTicket(null); }
    } catch { setTickets([]); setSelectedTicket(null); }
    finally { setLoadingTickets(false); }
  }

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { error } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
      if (error) throw error;
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      if (selectedTicket?.id === ticketId) setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) { alert(`Failed to update ticket: ${err.message}`); }
  };

  const filteredTickets = tickets.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchQ = t.customer_name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.message.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || t.status === statusFilter;
    return matchQ && matchS;
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;

  return (
    <div className="p-6 pb-12 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-[#cba55c] to-[#3d9392] rounded-full"></div>
            <h1 className="font-serif text-[28px] font-bold text-[#1a2e2e] leading-none">Customers & Support</h1>
          </div>
          <p className="text-[13px] text-[#a08070] ml-3">Manage boutique customers and review contact inquiries.</p>
        </div>
        {openCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            <span className="text-[12px] font-bold text-red-600">{openCount} open {openCount === 1 ? 'inquiry' : 'inquiries'} need attention</span>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-[#f0e8e2] rounded-xl w-fit">
        {[
          { key: 'tickets', label: 'Support Inbox', icon: 'mark_email_unread', badge: openCount },
          { key: 'users', label: 'Customer Directory', icon: 'group', badge: 0 },
        ].map(({ key, label, icon, badge }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSearchQuery(''); setStatusFilter('All'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
              activeTab === key
                ? 'bg-white text-[#3d9392] shadow-sm'
                : 'text-[#8a7060] hover:text-[#3d9392]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            {label}
            {badge > 0 && (
              <span className="bg-[#d17b60] text-white rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'tickets' ? (
        <>
          {/* Inbox Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Inquiries', value: tickets.length, icon: 'inbox', color: 'text-[#3d9392]', bg: 'bg-[#3d9392]/10' },
              { label: 'Open', value: openCount, icon: 'mail', color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'In Progress', value: inProgressCount, icon: 'autorenew', color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, icon: 'check_circle', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#ece5df] p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070]">{s.label}</p>
                  <p className="text-[20px] font-bold text-[#1a2e2e]">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Status Filter */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c0b0a5] text-[18px]">search</span>
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ece5df] rounded-xl text-[13px] outline-none focus:border-[#3d9392] shadow-sm"
              />
            </div>
            <div className="flex gap-1.5">
              {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    statusFilter === s
                      ? 'bg-[#3d9392] text-white shadow-sm'
                      : 'bg-white border border-[#ece5df] text-[#6b5c52] hover:border-[#3d9392]/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Inbox Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
            {/* Ticket List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[#f0e8e2] bg-[#f7f3f0]">
                <h3 className="text-[13px] font-bold text-[#1a2e2e]">Contact Inquiries</h3>
                <p className="text-[10px] text-[#a08070] mt-0.5">Messages sent via the Contact Us page</p>
              </div>
              <div className="divide-y divide-[#f7f3f0] max-h-[560px] overflow-y-auto">
                {loadingTickets ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3d9392] mx-auto"></div>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-[32px] text-[#d5ccc6]">inbox</span>
                    <p className="text-[12px] text-[#a08070] mt-2">No inquiries match your filter.</p>
                  </div>
                ) : (
                  filteredTickets.map(ticket => {
                    const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Closed;
                    const isSelected = selectedTicket?.id === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`px-4 py-4 cursor-pointer transition-all border-l-[3px] ${
                          isSelected
                            ? 'bg-[#3d9392]/5 border-l-[#3d9392]'
                            : 'border-l-transparent hover:bg-[#f7f3f0]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] text-[#c0b0a5] font-medium flex-shrink-0">{timeAgo(ticket.created_at)}</span>
                        </div>
                        <h4 className="text-[12px] font-semibold text-[#1a2e2e] line-clamp-1 mb-1">{ticket.subject}</h4>
                        <p className="text-[11px] text-[#a08070] line-clamp-2 leading-relaxed">{ticket.message}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-5 h-5 rounded-full bg-[#3d9392]/10 text-[#3d9392] flex items-center justify-center text-[8px] font-bold">
                            {getInitials(ticket.customer_name)}
                          </div>
                          <span className="text-[10px] font-semibold text-[#6b5c52]">{ticket.customer_name}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Ticket Detail */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
              {selectedTicket ? (() => {
                const cfg = STATUS_CONFIG[selectedTicket.status] || STATUS_CONFIG.Closed;
                return (
                  <div>
                    {/* Detail Header */}
                    <div className={`px-5 py-4 border-b border-[#f0e8e2] ${cfg.bg}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                              <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
                              {selectedTicket.status}
                            </span>
                            <span className="text-[10px] text-[#a08070]">
                              {new Date(selectedTicket.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h3 className="font-serif text-[17px] font-bold text-[#1a2e2e] leading-tight">{selectedTicket.subject}</h3>
                        </div>
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value)}
                          className="bg-white border border-[#ece5df] rounded-lg py-1.5 px-3 text-[11px] font-semibold outline-none cursor-pointer hover:border-[#3d9392] transition-colors flex-shrink-0"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Sender Info */}
                    <div className="px-5 py-4 border-b border-[#f7f3f0] bg-[#f7f3f0]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3d9392]/20 to-[#cba55c]/20 text-[#3d9392] flex items-center justify-center font-bold text-[13px] ring-2 ring-white shadow-sm">
                          {getInitials(selectedTicket.customer_name)}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#1a2e2e]">{selectedTicket.customer_name}</p>
                          <p className="text-[12px] text-[#a08070] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">mail</span>
                            {selectedTicket.customer_email}
                          </p>
                        </div>
                        <a
                          href={`mailto:${selectedTicket.customer_email}?subject=Re: ${selectedTicket.subject}`}
                          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#3d9392]/30 text-[#3d9392] text-[11px] font-semibold hover:bg-[#3d9392]/5 transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">reply</span>
                          Reply via Email
                        </a>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="px-5 py-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#c0b0a5] text-[16px]">chat_bubble</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070]">Inquiry Message</p>
                      </div>
                      <div className="bg-[#f7f3f0] rounded-2xl rounded-tl-sm p-4 border border-[#ece5df]">
                        <p className="text-[13px] text-[#3d3028] leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                      </div>

                      <div className="flex items-center justify-center mt-4 gap-2">
                        <span className="h-px flex-1 bg-[#f0e8e2]"></span>
                        <span className="text-[10px] font-semibold text-[#c0b0a5] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          Received {new Date(selectedTicket.created_at).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="h-px flex-1 bg-[#f0e8e2]"></span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-5 pb-5">
                      <div className="bg-[#f7f3f0] rounded-xl p-4 border border-[#ece5df]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-3">Admin Actions</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Mark Resolved', value: 'Resolved', icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                            { label: 'In Progress', value: 'In Progress', icon: 'autorenew', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                            { label: 'Close Ticket', value: 'Closed', icon: 'do_not_disturb', color: 'text-gray-500', bg: 'bg-gray-100 border-gray-200' },
                          ].map(action => (
                            <button
                              key={action.value}
                              onClick={() => handleUpdateTicketStatus(selectedTicket.id, action.value)}
                              disabled={selectedTicket.status === action.value}
                              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[10px] font-bold transition-all ${
                                selectedTicket.status === action.value
                                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
                                  : `${action.bg} ${action.color} hover:shadow-sm`
                              }`}
                            >
                              <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#f7f3f0] rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#d5ccc6] text-[32px]">mark_email_unread</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#6b5c52]">Select an inquiry</p>
                  <p className="text-[12px] text-[#a08070] mt-1">Click a message from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Customer Directory */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c0b0a5] text-[18px]">search</span>
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name or email..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ece5df] rounded-xl text-[13px] outline-none focus:border-[#3d9392] shadow-sm"
              />
            </div>
          </div>

          {/* User Tier Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { tier: 'VIP GOLD', count: users.filter(u => u.role === 'VIP GOLD').length, color: 'text-[#cba55c]', bg: 'bg-[#cba55c]/10', icon: 'workspace_premium' },
              { tier: 'VIP SILVER', count: users.filter(u => u.role === 'VIP SILVER').length, color: 'text-[#a08070]', bg: 'bg-[#a08070]/10', icon: 'star' },
              { tier: 'CUSTOMER', count: users.filter(u => u.role === 'CUSTOMER').length, color: 'text-[#3d9392]', bg: 'bg-[#3d9392]/10', icon: 'person' },
            ].map(t => (
              <div key={t.tier} className="bg-white rounded-xl border border-[#ece5df] p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-9 h-9 ${t.bg} rounded-lg flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[18px] ${t.color}`}>{t.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070]">{t.tier}</p>
                  <p className="text-[20px] font-bold text-[#1a2e2e]">{t.count}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#3d9392] mx-auto"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-[36px] text-[#d5ccc6]">group</span>
                <p className="text-[#a08070] mt-2 text-[13px]">No customers found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f3f0] border-b border-[#ece5df]">
                    {['Client', 'Email', 'Tier', 'Lifetime Spend', 'Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#a08070]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} className="border-b border-[#f7f3f0] hover:bg-[#f7f3f0] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3d9392]/15 to-[#cba55c]/15 text-[#3d9392] flex items-center justify-center font-bold text-[11px]">
                            {getInitials(user.name)}
                          </div>
                          <span className="text-[13px] font-semibold text-[#1a2e2e]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#a08070]">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider ${
                          user.role === 'VIP GOLD' ? 'bg-[#cba55c]/15 text-[#cba55c]'
                          : user.role === 'VIP SILVER' ? 'bg-[#a08070]/15 text-[#a08070]'
                          : 'bg-[#f0e8e2] text-[#8a7060]'
                        }`}>
                          {user.role === 'VIP GOLD' && <span className="material-symbols-outlined text-[11px] mr-0.5">workspace_premium</span>}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#3d9392]">₹{user.totalSpend.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[12px] text-[#a08070]">{user.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
