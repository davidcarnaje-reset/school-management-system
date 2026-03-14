import React, { useState } from 'react';
import axios from 'axios';
import { Search, Wallet, User, Printer, CheckCircle, AlertCircle, CreditCard, ReceiptText } from 'lucide-react';

const StudentBilling = () => {
  const [searchId, setSearchId] = useState('');
  const [billingData, setBillingData] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Function para hanapin ang billing details
  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost/sms-api/cashier/get_billing_details.php?id=${searchId}`);
      if (res.data.status === "success") {
        setBillingData(res.data);
      } else {
        alert(res.data.message);
        setBillingData(null);
      }
    } catch (err) {
      console.error("Search Error:", err);
      alert("System error connecting to database.");
    } finally {
      setLoading(false);
    }
  };

  // Logic para sa Payment Processing
  const handlePayment = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost/sms-api/cashier/process_billing_payment.php`, {
        student_id: billingData.summary.student_id,
        pay_amount: payAmount
      });

      if (res.data.status === "success") {
        alert(res.data.message);
        setPayAmount('');
        handleSearch(); // Refresh data para makita ang bagong balance at status
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Payment transaction failed.");
    }
  };

  // KUKULKULAHIN ANG TOTAL ASSESSMENT MULA SA ITEMS (HINDI SA SUMMARY TABLE)
  const computedTotal = billingData?.items?.reduce((acc, item) => acc + parseFloat(item.amount), 0) || 0;

  return (
    <div className="p-6 space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Student Billing Portal</h1>
        <p className="text-slate-400 font-medium italic text-sm text-left">Process payments and review student financial records.</p>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border-2 border-slate-100 flex gap-4">
        <div className="relative flex-1 text-left">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Enter Student ID (e.g., 2026-0001)" 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-2 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {billingData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* LEFT COLUMN: Assessment Details (Breakdown from Registrar) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50">
              <div className="flex justify-between items-center mb-6 border-b pb-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <User />
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-slate-800 text-xl uppercase leading-tight">
                      {billingData.summary.first_name} {billingData.summary.last_name}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 font-mono tracking-widest">{billingData.summary.student_id}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  billingData.summary.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {billingData.summary.payment_status}
                </div>
              </div>

              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">
                Assessment Items (From Registrar)
              </h3>
              
              <div className="space-y-3">
                {billingData.items.length > 0 ? (
                  billingData.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="font-bold text-slate-600 text-sm">{item.item_name}</span>
                      </div>
                      <span className="font-black text-slate-800">
                        ₱{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-slate-400 italic text-sm">No items found for this assessment.</p>
                )}
              </div>

              {/* COMPUTED TOTAL BOX */}
              <div className="mt-6 p-6 bg-blue-600 rounded-[2rem] text-white flex justify-between items-center shadow-lg shadow-blue-100">
                <div className="flex flex-col text-left">
                  <span className="font-bold uppercase tracking-widest text-[10px] opacity-80">Total Assessment</span>
                  <span className="text-[9px] italic opacity-60">Computed from itemized fees</span>
                </div>
                <span className="text-3xl font-black">
                  ₱{computedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Action */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6 text-left">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Outstanding Balance</p>
                  <h2 className="text-4xl font-black text-white">
                    ₱{Number(billingData.summary.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Payment Amount</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/10 border-2 border-white/20 p-4 rounded-2xl font-black text-2xl outline-none focus:border-emerald-500 transition-all text-white"
                      placeholder="0.00" 
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                  >
                    Post Payment
                  </button>
                  
                  <div className="flex items-start gap-2 text-white/40">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p className="text-[9px] leading-relaxed italic">
                      Posting payment will automatically update the enrollment status to "Enrolled".
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <button className="w-full p-6 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-3">
              <Printer size={20} />
              Print Statement of Account
            </button>
          </div>

        </div>
      ) : (
        /* Empty State Placeholder */
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 flex flex-col items-center text-slate-400 animate-pulse">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Wallet size={40} className="opacity-20" />
          </div>
          <p className="font-black uppercase tracking-[0.2em] text-sm">Waiting for student search...</p>
          <p className="text-xs font-medium mt-2 text-slate-400/80">Enter a Student ID above to view assessments and process payments.</p>
        </div>
      )}
    </div>
  );
};

export default StudentBilling;