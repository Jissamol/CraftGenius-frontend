import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone, FiMapPin, FiMap, FiHash, FiHome,
  FiEdit3, FiSave, FiX, FiCamera, FiCheck, FiAlertCircle,
  FiShoppingBag, FiPackage, FiUser, FiMail
} from 'react-icons/fi';
import Api from '../services/Api';

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    Api.get('customer/profile/')
      .then(res => { setProfile(res.data); setForm(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm(f => ({ ...f, profile_picture: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      ['phone', 'address', 'city', 'state', 'pincode'].forEach(k => {
        if (form[k] !== undefined) fd.append(k, form[k]);
      });
      if (form.profile_picture instanceof File) fd.append('profile_picture', form.profile_picture);
      const res = await Api.put('customer/profile/', fd);
      setProfile(res.data);
      setEditing(false);
      setAvatarPreview(null);
      showToast('success', 'Profile updated successfully!');
    } catch {
      showToast('error', 'Failed to update profile');
    }
    setSaving(false);
  };

  const cancelEdit = () => { setEditing(false); setForm(profile); setAvatarPreview(null); };

  const avatarSrc = avatarPreview || profile?.profile_picture;
  const initials  = (profile?.name || 'U').charAt(0).toUpperCase();

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="py-10 space-y-5 animate-pulse">
      <div className="h-40 bg-[#F7F6F2] rounded-3xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-[#F7F6F2] rounded-2xl" />)}
      </div>
      <div className="h-64 bg-[#F7F6F2] rounded-3xl" />
    </div>
  );

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── Left Sidebar: Identity & Stats ── */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">
          
          {/* Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Subtle decorative background top */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-[#F7F6F2] -z-10" />

            {/* Avatar */}
            <div className="mb-4">
              {editing ? (
                <label className="relative cursor-pointer block">
                  <input type="file" accept="image/*" hidden onChange={handleChange} name="profile_picture" />
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-md flex items-center justify-center hover:border-gray-50 transition-colors">
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-[#F7F6F2] border-2 border-dashed border-[#8A6A55] rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-[#8A6A55]">{initials}</span>
                        </div>
                    }
                  </div>
                  <span className="absolute bottom-0 right-0 w-8 h-8 bg-[#1F1F1F] text-white rounded-full flex items-center justify-center shadow-md">
                    <FiCamera size={14} />
                  </span>
                </label>
              ) : (
                <div className="w-28 h-28 rounded-full overflow-hidden bg-[#F7F6F2] border-4 border-white shadow-md flex items-center justify-center">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-4xl font-bold text-[#8A6A55]">{initials}</span>
                  }
                </div>
              )}
            </div>

            {/* Name + email */}
            <h2 className="text-2xl font-bold text-[#1F1F1F] mb-1">
              {profile?.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mb-5">
              <FiMail size={14} />
              <span className="truncate max-w-[200px]">{profile?.email}</span>
            </div>
            
            <span className="inline-flex items-center px-4 py-1.5 bg-[#F7F6F2] text-[#8A6A55] text-xs font-bold rounded-full border border-[#E8DDD4] uppercase tracking-wide">
              Craft Enthusiast
            </span>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="divide-y divide-gray-100">
              {[
                { icon: FiPackage,     label: 'Total Orders', value: profile?.total_orders || 0 },
                { icon: FiShoppingBag, label: 'Total Spent',  value: `₹${profile?.total_spent?.toFixed(0) || 0}` },
                { icon: FiUser,        label: 'Member Since', value: profile?.date_joined
                    ? new Date(profile.date_joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : 'Active' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-[#F7F6F2] flex items-center justify-center">
                      <Icon size={14} className="text-[#8A6A55]" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
                  </div>
                  <span className="text-lg font-bold text-[#1F1F1F]">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Main Area ── */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#1F1F1F] mb-1">
                My Profile
              </h1>
              <p className="text-sm text-gray-500">Manage your personal information and contact details</p>
            </div>

            {!editing && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1F1F1F] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors shadow-sm"
              >
                <FiEdit3 size={16} /> Edit Profile
              </motion.button>
            )}
          </motion.div>

          {/* Details / Edit panel */}
          <AnimatePresence mode="wait">
            {editing ? (
              /* ── Edit Form ── */
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex-1"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-[#1F1F1F]">
                    Edit Contact Details
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-[#1F1F1F] transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { name: 'phone',   label: 'Phone Number',  icon: FiPhone,  placeholder: 'e.g. 9876543210' },
                    { name: 'city',    label: 'City',          icon: FiMapPin, placeholder: 'e.g. Kochi' },
                    { name: 'state',   label: 'State',         icon: FiMap,    placeholder: 'e.g. Kerala' },
                    { name: 'pincode', label: 'Pincode',       icon: FiHash,   placeholder: 'e.g. 682001' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        <f.icon size={14} className="text-[#8A6A55]" /> {f.label}
                      </label>
                      <input
                        name={f.name}
                        value={form[f.name] || ''}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 bg-[#F7F6F2] border border-transparent rounded-xl text-sm text-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      <FiHome size={14} className="text-[#8A6A55]" /> Full Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address || ''}
                      onChange={handleChange}
                      placeholder="House No, Street, Landmark…"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#F7F6F2] border border-transparent rounded-xl text-sm text-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-all resize-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-lg hover:bg-[#333] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : <><FiSave size={16} /> Save Changes</>}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── View Mode ── */
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex-1"
              >
                <h3 className="text-lg font-bold text-[#1F1F1F] mb-6 pb-4 border-b border-gray-100">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: FiPhone,  label: 'Phone',   value: profile?.phone },
                    { icon: FiMapPin, label: 'City',    value: profile?.city },
                    { icon: FiMap,    label: 'State',   value: profile?.state },
                    { icon: FiHash,   label: 'Pincode', value: profile?.pincode },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="p-5 rounded-2xl bg-[#F7F6F2] flex flex-col gap-1 border border-transparent"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="text-[#8A6A55]" />
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
                      </div>
                      <p className="text-sm font-bold text-[#1F1F1F]">{value || '—'}</p>
                    </div>
                  ))}

                  {/* Full-width address */}
                  <div className="sm:col-span-2 p-5 rounded-2xl bg-[#F7F6F2] flex flex-col gap-1 border border-transparent">
                    <div className="flex items-center gap-2 mb-2">
                      <FiHome size={16} className="text-[#8A6A55]" />
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Address</p>
                    </div>
                    <p className="text-sm font-bold text-[#1F1F1F] leading-relaxed max-w-2xl">{profile?.address || '—'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── Toast (portal) ── */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-[#1F1F1F] text-white' : 'bg-red-600 text-white'
              }`}
            >
              {toast.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default CustomerProfile;
