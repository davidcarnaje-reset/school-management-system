import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  UserPlus, X, Mail, RefreshCw, Calendar, Phone, GraduationCap, 
  BookOpen, User, Users, CreditCard, ChevronRight, ChevronLeft, Check 
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

const StudentManagement = () => {
  const { branding } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const initialFormState = {
    // STEP 1: Personal Info
    lrn: '', first_name: '', middle_name: '', last_name: '', suffix: '', 
    nickname: '', gender: 'Male', dob: '', place_of_birth: '', 
    nationality: 'Filipino', religion: '', civil_status: 'Single',
    // STEP 2: Contact & Address
    email: '', mobile_no: '', alt_mobile_no: '', 
    address_house: '', address_brgy: '', address_city: '', address_province: '', address_zip: '',
    // STEP 3: Parent/Guardian
    father_name: '', father_occ: '', father_contact: '',
    mother_name: '', mother_occ: '', mother_contact: '',
    guardian_name: '', guardian_rel: '', guardian_contact: '', guardian_address: '',
    // STEP 4: Academic & Financial
    enrollment_type: 'New', school_year: '2026-2027', grade_level: 'Grade 7',
    section: 'TBA', prev_school: '', prev_school_address: '',
    scholarship_type: 'None', payment_plan: 'Full Payment'
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost/sms-api/get_students.php');
      if (Array.isArray(response.data)) setStudents(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const response = await axios.post('http://localhost/sms-api/add_student.php', formData);
      if (response.data.success) {
        setShowModal(false);
        setFormData(initialFormState);
        setCurrentStep(1);
        fetchStudents();
        alert("Enrolled successfully! ID: " + response.data.student_id);
      } else { alert(response.data.message); }
    } catch (err) { alert("Server Error"); } finally { setSaveLoading(false); }
  };

  // UI Helpers
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${currentStep >= step ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
               style={currentStep >= step ? {backgroundColor: branding.theme_color} : {}}>
            {currentStep > step ? <Check size={14} /> : step}
          </div>
          {step < 4 && <div className={`w-12 h-1 mx-2 rounded ${currentStep > step ? 'bg-blue-500' : 'bg-slate-100'}`} style={currentStep > step ? {backgroundColor: branding.theme_color} : {}} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header same as before... */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <GraduationCap className="text-blue-500" size={32} /> Student Enrollment
          </h1>
          <p className="text-slate-500 text-sm italic">Enterprise Registrar Module</p>
        </div>
        <button onClick={() => { setFormData(initialFormState); setShowModal(true); }} className="shine-effect text-white px-8 py-4 rounded-2xl flex items-center gap-2 shadow-xl font-bold" style={{backgroundColor: branding.theme_color}}>
          <UserPlus size={20} /> Enroll New Student
        </button>
      </div>

      {/* Student Table Area (Simple list for now) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID & Name</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade & LRN</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="p-5">
                        <p className="font-bold text-slate-800">{s.full_name}</p>
                        <p className="text-[10px] font-mono text-blue-500 font-bold">{s.student_id}</p>
                     </td>
                     <td className="p-5 text-sm">
                        <p className="font-semibold text-slate-600">{s.grade_level}</p>
                        <p className="text-[10px] text-slate-400">LRN: {s.lrn || 'N/A'}</p>
                     </td>
                     <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {s.is_verified ? 'VERIFIED' : 'PENDING'}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* MULTI-STEP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Student Registration Wizard</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {currentStep === 1 && "Step 1: Personal Profile"}
                  {currentStep === 2 && "Step 2: Contact & Address"}
                  {currentStep === 3 && "Step 3: Family Background"}
                  {currentStep === 4 && "Step 4: Academic & Billing"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white shadow-sm p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <StepIndicator />

              {/* STEP 1: PERSONAL INFO */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="md:col-span-1"><Input label="LRN (Required)" value={formData.lrn} onChange={v=>setFormData({...formData, lrn:v})} placeholder="12-digit LRN"/></div>
                  <div className="md:col-span-2 invisible invisible-sm md:visible"></div>
                  <Input label="First Name" value={formData.first_name} onChange={v=>setFormData({...formData, first_name:v})} required/>
                  <Input label="Middle Name" value={formData.middle_name} onChange={v=>setFormData({...formData, middle_name:v})}/>
                  <Input label="Last Name" value={formData.last_name} onChange={v=>setFormData({...formData, last_name:v})} required/>
                  <Input label="Suffix" value={formData.suffix} onChange={v=>setFormData({...formData, suffix:v})} placeholder="Jr, Sr, III"/>
                  <Select label="Gender" value={formData.gender} onChange={v=>setFormData({...formData, gender:v})} options={['Male', 'Female', 'Other']}/>
                  <Input label="Date of Birth" type="date" value={formData.dob} onChange={v=>setFormData({...formData, dob:v})} required/>
                  <Input label="Place of Birth" value={formData.place_of_birth} onChange={v=>setFormData({...formData, place_of_birth:v})}/>
                  <Input label="Nationality" value={formData.nationality} onChange={v=>setFormData({...formData, nationality:v})}/>
                  <Input label="Religion" value={formData.religion} onChange={v=>setFormData({...formData, religion:v})}/>
                </div>
              )}

              {/* STEP 2: CONTACT & ADDRESS */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                  <Input label="Email Address" type="email" value={formData.email} onChange={v=>setFormData({...formData, email:v})} required/>
                  <Input label="Mobile Number" value={formData.mobile_no} onChange={v=>setFormData({...formData, mobile_no:v})} required/>
                  <div className="md:col-span-2"><Input label="House No. / Street" value={formData.address_house} onChange={v=>setFormData({...formData, address_house:v})}/></div>
                  <Input label="Barangay" value={formData.address_brgy} onChange={v=>setFormData({...formData, address_brgy:v})}/>
                  <Input label="City / Municipality" value={formData.address_city} onChange={v=>setFormData({...formData, address_city:v})}/>
                  <Input label="Province" value={formData.address_province} onChange={v=>setFormData({...formData, address_province:v})}/>
                  <Input label="Zip Code" value={formData.address_zip} onChange={v=>setFormData({...formData, address_zip:v})}/>
                </div>
              )}

              {/* STEP 3: PARENT / GUARDIAN */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl">
                    <h4 className="md:col-span-3 text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Father's Information</h4>
                    <Input label="Full Name" value={formData.father_name} onChange={v=>setFormData({...formData, father_name:v})}/>
                    <Input label="Occupation" value={formData.father_occ} onChange={v=>setFormData({...formData, father_occ:v})}/>
                    <Input label="Contact No." value={formData.father_contact} onChange={v=>setFormData({...formData, father_contact:v})}/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl">
                    <h4 className="md:col-span-3 text-xs font-black text-pink-500 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Mother's Information</h4>
                    <Input label="Full Name" value={formData.mother_name} onChange={v=>setFormData({...formData, mother_name:v})}/>
                    <Input label="Occupation" value={formData.mother_occ} onChange={v=>setFormData({...formData, mother_occ:v})}/>
                    <Input label="Contact No." value={formData.mother_contact} onChange={v=>setFormData({...formData, mother_contact:v})}/>
                  </div>
                </div>
              )}

              {/* STEP 4: ACADEMIC & FINANCIAL */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                  <Select label="Enrollment Type" value={formData.enrollment_type} onChange={v=>setFormData({...formData, enrollment_type:v})} options={['New', 'Transferee', 'Continuing']}/>
                  <Select label="Grade Level" value={formData.grade_level} onChange={v=>setFormData({...formData, grade_level:v})} options={['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']}/>
                  <Input label="Previous School" value={formData.prev_school} onChange={v=>setFormData({...formData, prev_school:v})}/>
                  <Select label="Payment Plan" value={formData.payment_plan} onChange={v=>setFormData({...formData, payment_plan:v})} options={['Full Payment', 'Installment']}/>
                  <div className="md:col-span-2 bg-amber-50 p-6 rounded-3xl flex items-start gap-4 border border-amber-100">
                     <Mail className="text-amber-500 shrink-0" />
                     <p className="text-xs text-amber-800 font-medium">Upon submission, an official <b>Student ID</b> will be generated and an invitation will be sent to <b>{formData.email || 'the provided email'}</b>.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-between bg-slate-50/20">
              <button disabled={currentStep === 1} onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all">
                <ChevronLeft size={20}/> Previous
              </button>
              
              {currentStep < 4 ? (
                <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all" style={{backgroundColor: branding.theme_color}}>
                  Next Step <ChevronRight size={20}/>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={saveLoading} className="flex items-center gap-2 px-10 py-3 rounded-xl font-black text-white shadow-xl active:scale-95 transition-all" style={{backgroundColor: branding.theme_color}}>
                  {saveLoading ? <RefreshCw className="animate-spin" /> : <><Check size={20}/> Finish Enrollment</>}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// Custom Mini Components for Cleaner Code
const Input = ({ label, type="text", value, onChange, placeholder, required=false }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label} {required && '*'}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}
           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700 shadow-sm" />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e=>onChange(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700 shadow-sm">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default StudentManagement;