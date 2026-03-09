import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, Pencil, Trash2, X, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    //modal states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'registrar'
  });
  const [deleteModal, setDeleteModal] = useState({
  show: false,
  id: null,
  name: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost/sms-api/get_users.php');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
  e.preventDefault();
  
  // Dynamic URL: gagamit ng update_user.php kung edit mode, else add_user.php
  const url = isEditMode ? 'update_user.php' : 'add_user.php';
  
  try {
    // Kung Edit Mode, isama ang ID sa ipapadala sa PHP
    const payload = isEditMode ? { ...formData, id: selectedUserId } : formData;
    
    const response = await axios.post(`http://localhost/sms-api/${url}`, payload);

    if (response.data.success) {
      setShowModal(false);
      setIsEditMode(false);
      // Reset ang form fields
      setFormData({ username: '', password: '', full_name: '', role: 'registrar' });
      fetchUsers(); // Refresh the table
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Save Error:", error);
    alert("Error saving user data.");
  }
};

// Ang aktwal na pag-delete sa database
const executeDelete = async () => {
  try {
    const response = await axios.post('http://localhost/sms-api/delete_user.php', { 
      id: deleteModal.id 
    });
    
    if (response.data.success) {
      setDeleteModal({ show: false, id: null, name: '' }); // Close modal
      fetchUsers(); // Refresh table
    }
  } catch (error) {
    alert("Error deleting user");
  }
};

const openEditModal = (user) => {
  setIsEditMode(true);
  setSelectedUserId(user.id);
  
  // I-load ang data ng user sa form state
  setFormData({
    full_name: user.full_name,
    username: user.username,
    role: user.role,
    password: '' // Iwanang blanko para sa security
  });
  
  setShowModal(true);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Manage system access for all school personnel.</p>
        </div>
        <button 
        onClick={() => { 
            setIsEditMode(false); 
            setFormData({username:'', password:'', full_name:'', role:'registrar'}); 
            setShowModal(true); 
        }}
        className="group bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-200 transition-all duration-200"
        >
        <div className="bg-blue-500 group-hover:bg-blue-600 p-1 rounded-lg transition-colors">
            <UserPlus size={18} />
        </div>
        <span className="font-semibold text-sm tracking-wide">Add New User</span>
        </button>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Full Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Username</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {user.full_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'registrar' ? 'bg-blue-100 text-blue-700' : 
                          'bg-emerald-100 text-emerald-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                        <Pencil size={16} />
                        </button>
                        <button 
                        disabled={user.id === currentUser?.id}
                        onClick={() => confirmDelete(user.id, user.full_name)} // Buksan ang custom modal
                        className={`p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${user.id === currentUser?.id 
                            ? 'opacity-20 cursor-not-allowed text-slate-300' 
                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        >
                        <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Shield size={20} />
                <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Update User Account' : 'New User Account'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="John Doe"
                  value={formData.full_name} // <--- DAGDAGAN NITO
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Username</label>
                  <input 
                    type="text" required
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="jdoe2026"
                    value={formData.username} // <--- DAGDAGAN NITO
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Password {isEditMode && <span className="text-[10px] lowercase text-blue-400 font-normal">(Leave blank to keep current)</span>}
                </label>
                  <input 
                    type="password" required
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">System Role</label>
                <select 
                    value={formData.role} // <--- DAGDAGAN NITO
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-sm"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="registrar">Registrar</option>
                  <option value="cashier">Cashier</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2">
                  {/* Sa Submit Button ng Modal */}
                    <span>{isEditMode ? 'Save Changes' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
{deleteModal.show && (
  <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
      <div className="p-6 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Delete</h3>
        <p className="text-slate-500 text-sm mb-6">
          Sigurado ka bang gusto mong burahin si <span className="font-bold text-slate-700">{deleteModal.name}</span>? 
          Hindi na ito maibabalik sa system.
        </p>

        <div className="flex space-x-3">
          <button 
            onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={executeDelete}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-100"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;