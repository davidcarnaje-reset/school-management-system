import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Wallet, CreditCard, Receipt, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentAccounting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const API_BASE_URL = "http://localhost/sms-api";

  const [branding, setBranding] = useState({
    theme_color: '#001f3f'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandRes = await axios.get(`${API_BASE_URL}/branding.php`);
        if (brandRes.data) setBranding(brandRes.data);

        const studentRes = await axios.get(`${API_BASE_URL}/get_students.php`);
        const myData = studentRes.data.find(s => s.email === user.email);
        if (myData) setStudentData(myData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.email]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse font-black text-slate-400">LOADING FINANCIAL RECORDS...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <button 
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Accounting <span style={{ color: branding.theme_color }}>Records</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Financial Summary & Transaction History</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* BALANCE CARD */}
          <div style={{ backgroundColor: branding.theme_color }} className="md:col-span-2 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <Wallet size={48} className="text-yellow-500 mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Total Outstanding Balance</p>
            <h2 className="text-5xl font-black mt-2 tracking-tight">₱ {studentData?.balance || '0.00'}</h2>
            <div className="mt-8 flex gap-4">
              <span className="bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase">Plan: {studentData?.payment_plan || 'N/A'}</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Status: Active</span>
            </div>
          </div>

          {/* QUICK INFO */}
          <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Payment</p>
                <p className="text-2xl font-black text-slate-900">₱ {studentData?.last_payment || '0.00'}</p>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</p>
                <p className="text-sm font-black text-slate-700">{studentData?.payment_date || 'No record'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION TABLE PLACEHOLDER */}
        <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <Receipt size={16} className="text-blue-500"/> Statement of Account
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-600">
                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">Tuition Fee - SY {studentData?.school_year}</td>
                  <td className="px-8 py-6">Initial</td>
                  <td className="px-8 py-6">---</td>
                  <td className="px-8 py-6 text-right font-black text-slate-900">₱ {studentData?.balance}</td>
                </tr>
                {/* Dito pwedeng i-map ang transaction history kung may table ka na sa database */}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-slate-50/50 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Please visit the Cashier's office for official receipts and detailed assessment.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudentAccounting;