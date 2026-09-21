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
    <div className="py-8 space-y-6 max-w-4xl mx-auto">

      {/* ── Page title row ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Profile
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your personal information</p>
        </div>

        {!editing && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors shadow-sm"
          >
            <FiEdit3 size={14} /> Edit Profile
          </motion.button>
        )}
      </motion.div>

      {/* ── Hero / identity card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Warm top strip matching brand */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8A6A55] via-[#C4A882] to-[#8A6A55]" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-7">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {editing ? (
              <label className="relative cursor-pointer block">
                <input type="file" accept="image/*" hidden onChange={handleChange} name="profile_picture" />
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F7F6F2] border-2 border-dashed border-[#8A6A55] flex items-center justify-center">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-4xl font-bold text-[#8A6A55]">{initials}</span>
                  }
                </div>
                <span className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#1F1F1F] text-white rounded-full flex items-center justify-center shadow-md">
                  <FiCamera size={13} />
                </span>
              </label>
            ) : (
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F7F6F2] border border-gray-100 flex items-center justify-center">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-4xl font-bold text-[#8A6A55]">{initials}</span>
                }
              </div>
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {profile?.name}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-400 mt-1">
              <FiMail size={13} />
              <span>{profile?.email}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#F7F6F2] text-[#8A6A55] text-xs font-semibold rounded-full border border-[#E8DDD4]">
              🎨 Craft Enthusiast
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-20 bg-gray-100 self-center" />

          {/* Inline stats */}
          <div className="flex sm:flex-col gap-6 sm:gap-4 text-center sm:text-right flex-shrink-0">
            <div>
              <p className="text-2xl font-bold text-[#1F1F1F]">{profile?.total_orders || 0}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-0.5">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F1F1F]">₹{profile?.total_spent?.toFixed(0) || 0}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-0.5">Spent</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat mini-cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: FiPackage,      label: 'Total Orders', value: profile?.total_orders || 0,            accent: '#8A6A55', bg: '#FBF8F5' },
          { icon: FiShoppingBag, label: 'Total Spent',  value: `₹${profile?.total_spent?.toFixed(0) || 0}`, accent: '#1F1F1F', bg: '#F4F4F4' },
          { icon: FiUser,        label: 'Member Since', value: profile?.date_joined
              ? new Date(profile.date_joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
              : 'Active',
            accent: '#6B7280', bg: '#F7F7F7' },
        ].map(({ icon: Icon, label, value, accent, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.06 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1F1F1F]">{value}</p>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Details / Edit panel ── */}
      <AnimatePresence mode="wait">
        {editing ? (
          /* ── Edit Form ── */
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Edit Details
              </h3>
              <button
                onClick={cancelEdit}
                className="w-8 h-8 rounded-full bg-[#F7F6F2] text-gray-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
              >
                <FiX size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'phone',   label: 'Phone Number',  icon: FiPhone,  placeholder: 'e.g. 9876543210' },
                { name: 'city',    label: 'City',          icon: FiMapPin, placeholder: 'e.g. Kochi' },
                { name: 'state',   label: 'State',         icon: FiMap,    placeholder: 'e.g. Kerala' },
                { name: 'pincode', label: 'Pincode',       icon: FiHash,   placeholder: 'e.g. 682001' },
              ].map(f => (
                <div key={f.name}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <f.icon size={12} /> {f.label}
                  </label>
                  <input
                    name={f.name}
                    value={form[f.name] || ''}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 bg-[#F7F6F2] border border-gray-200 rounded-xl text-sm text-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:border-[#8A6A55] focus:ring-2 focus:ring-[#E8DDD4] transition-all"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <FiHome size={12} /> Full Address
                </label>
                <textarea
                  name="address"
                  value={form.address || ''}
                  onChange={handleChange}
                  placeholder="House No, Street, Landmark…"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#F7F6F2] border border-gray-200 rounded-xl text-sm text-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:border-[#8A6A55] focus:ring-2 focus:ring-[#E8DDD4] transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Saving…' : <><FiSave size={14} /> Save Changes</>}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={cancelEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F7F6F2] text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <FiX size={14} /> Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* ── View Mode ── */
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7"
          >
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact & Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: FiPhone,  label: 'Phone',   value: profile?.phone },
                { icon: FiMapPin, label: 'City',    value: profile?.city },
                { icon: FiMap,    label: 'State',   value: profile?.state },
                { icon: FiHash,   label: 'Pincode', value: profile?.pincode },
              ].map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ backgroundColor: '#FDFAF7' }}
                  className="flex items-center gap-3 p-4 bg-[#F7F6F2] rounded-2xl border border-transparent hover:border-[#E8DDD4] transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD4] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#8A6A55]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-[#1F1F1F] mt-0.5">{value || '—'}</p>
                  </div>
                </motion.div>
              ))}

              {/* Full-width address */}
              <motion.div
                whileHover={{ backgroundColor: '#FDFAF7' }}
                className="sm:col-span-2 flex items-start gap-3 p-4 bg-[#F7F6F2] rounded-2xl border border-transparent hover:border-[#E8DDD4] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiHome size={14} className="text-[#8A6A55]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-semibold text-[#1F1F1F] mt-0.5">{profile?.address || '—'}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
