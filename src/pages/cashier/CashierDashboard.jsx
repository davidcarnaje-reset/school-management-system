import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Wallet,
  History,
  CreditCard,
  Activity,
  TrendingUp,
  Users,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  StatCard,
  SectionHeader,
} from "../../components/cashier/CashierComponents";

const CashierDashboard = () => {
  const { API_BASE_URL } = useAuth();
  const [isAllTxModalOpen, setIsAllTxModalOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalCollections: "₱0.00",
    todayTransactions: 0,
    pendingPayments: 0,
    recentTransactions: [], // Dito papasok yung galing sa get_payments.php
    breakdown: { Cash: 0, GCash: 0, Card: 0 },
  });

  const fetchData = async () => {
    try {
      // SINUNOD NATIN ANG LUMANG LOGIC: Dalawang magkaibang endpoint
      const [statsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/cashier/get_dashboard_stats.php`),
        axios.get(`${API_BASE_URL}/cashier/get_payments.php`),
      ]);

      setStats({
        totalCollections: statsRes.data.totalCollections || "₱0.00",
        todayTransactions: statsRes.data.todayTransactions || 0,
        pendingPayments: statsRes.data.pendingPayments || 0,
        recentTransactions: paymentsRes.data || [], // Ito yung listahan na nawawala kanina
        breakdown: statsRes.data.breakdown || { Cash: 0, GCash: 0, Card: 0 },
      });
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/cashier/get_all_payments.php`,
      );
      setAllTransactions(Array.isArray(response.data) ? response.data : []);
      setIsAllTxModalOpen(true);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-2 border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Live Finance Monitor</span>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                Cashier <span className="text-emerald-500">Overview</span>
              </h1>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm hidden md:block">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-[10px] font-bold text-white uppercase italic">Online & Syncing</p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={150} className="text-white -mr-8 -mb-8 rotate-12" />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Collections" value={stats.totalCollections} icon={Wallet} colorClass="bg-indigo-600" subText="LIFETIME" />
          <StatCard title="Transactions Today" value={stats.todayTransactions} icon={Activity} colorClass="bg-emerald-500" subText="DAILY" />
          <StatCard title="Pending Issues" value={stats.pendingPayments} icon={Users} colorClass="bg-orange-500" subText="ATTENTION" />
        </div>

        {/* DATA SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* RECENT TRANSACTIONS TABLE */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <SectionHeader
              title="Recent Transactions"
              icon={History}
              action={
                <button
                  onClick={fetchAllTransactions}
                  className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 px-6 py-3 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
                >
                  Full History
                </button>
              }
            />

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-2 border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="p-7 text-left border-r border-white/5">
                        Details
                      </th>
                      <th className="p-7 text-center border-r border-white/5">
                        Amount
                      </th>
                      <th className="p-7 text-center border-r border-white/5">
                        Type
                      </th>
                      <th className="p-7 text-right">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {stats.recentTransactions &&
                    stats.recentTransactions.length > 0 ? (
                      stats.recentTransactions.slice(0, 8).map((tx, i) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-50 transition-all group/row"
                        >
                          <td className="p-7">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center font-black text-slate-500 group-hover/row:border-indigo-500 group-hover/row:text-indigo-600 transition-all uppercase">
                                {/* PROTECTION: Siguraduhin na string ang kinukuha para sa .charAt */}
                                {String(
                                  tx.student || tx.student_id || "?",
                                ).charAt(0)}
                              </div>
                              <div>
                                <p className="text-[10px] font-mono font-bold text-slate-400 group-hover/row:text-indigo-500">
                                  {/* PROTECTION: Kung object ito, hindi magka-crash */}
                                  {typeof tx.student === "object"
                                    ? "N/A"
                                    : tx.student}
                                </p>
                                <p className="text-sm font-black text-slate-800 uppercase italic leading-tight">
                                  {typeof tx.student_name === "object"
                                    ? "Unknown Student"
                                    : tx.student_name || "Student Payer"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-7 text-center bg-slate-50/30">
                            <span className="text-base font-black text-slate-900 italic">
                              ₱
                              {Number(tx.amount || 0).toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2 },
                              )}
                            </span>
                          </td>
                          <td className="p-7 text-center">
                            <span className="text-[9px] font-black px-4 py-1.5 bg-white border-2 border-slate-100 rounded-full text-slate-500 uppercase">
                              {typeof tx.type === "object"
                                ? "Payment"
                                : tx.type || "Payment"}
                            </span>
                          </td>
                          <td className="p-7 text-right">
                            <span
                              className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase border-2 shadow-sm ${
                                tx.method === "Cash"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : tx.method === "GCash"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {typeof tx.method === "object"
                                ? "Other"
                                : tx.method || "Other"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-20 text-center text-slate-300 italic"
                        >
                          No records today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CHANNEL BREAKDOWN SIDEBAR */}
          <div className="space-y-6 text-left">
            <SectionHeader title="Method Breakdown" icon={CreditCard} />
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>

              {Object.entries(stats.breakdown).map(([method, amount]) => (
                <div
                  key={method}
                  className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 relative z-10"
                >
                  <div>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest ${
                        method === "Cash"
                          ? "text-emerald-400"
                          : method === "GCash"
                            ? "text-blue-400"
                            : "text-orange-400"
                      }`}
                    >
                      {method}
                    </p>
                    <p className="text-2xl font-black italic text-white tracking-tighter">
                      ₱{Number(amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-white/20 group-hover:text-white/60 transition-colors">
                    <TrendingUp size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FULL HISTORY MODAL - Same style as the main UI */}
      {isAllTxModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-full max-h-[85vh] flex flex-col overflow-hidden border-8 border-white">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div className="text-left">
                <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                  Full Transaction{" "}
                  <span className="text-indigo-600">History</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Complete Financial Log
                </p>
              </div>
              <button
                onClick={() => setIsAllTxModalOpen(false)}
                className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="p-5">Student ID</th>
                    <th className="p-5">Name</th>
                    <th className="p-5 text-center">Amount</th>
                    <th className="p-5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allTransactions.map((tx, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-mono text-xs text-slate-400">
                        {tx.student}
                      </td>
                      <td className="p-5 text-sm font-black text-slate-700 uppercase italic">
                        Student Name
                      </td>
                      <td className="p-5 text-center text-sm font-black text-indigo-600">
                        ₱{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-[8px] font-black px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">
                          {tx.method} • {tx.date}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
