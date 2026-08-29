import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { Camera, MapPin, Palette, Globe, Edit2, Save, X, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    craft_specialty: '',
    location: '',
    social_links: { instagram: '', twitter: '', website: '' }
  });
  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await Api.get('seller/profile/');
      setProfile(res.data);
      setFormData({
        bio: res.data.bio || '',
        craft_specialty: res.data.craft_specialty || '',
        location: res.data.location || '',
        social_links: res.data.social_links || { instagram: '', twitter: '', website: '' }
      });
      if (res.data.profile_picture) {
        setPicPreview(res.data.profile_picture);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value }
    }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      setProfilePic(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('craft_specialty', formData.craft_specialty);
      data.append('location', formData.location);
      data.append('social_links', JSON.stringify(formData.social_links));
      if (profilePic) {
        data.append('profile_picture', profilePic);
      }

      const res = await Api.put('seller/profile/', data);
      setProfile(res.data);
      setEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 rounded-lg mb-2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] bg-white border border-gray-100 rounded-2xl" />
          <div className="h-[400px] bg-white border border-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seller Profile
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage your public persona and details</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-200 hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ── Main Form / View Card (2/3 width) ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Header Banner & Avatar */}
          <div className="relative h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500">
            <div className="absolute -bottom-12 left-8 flex items-end gap-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100 text-3xl font-bold text-violet-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {picPreview ? (
                      <img src={picPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      profile?.name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                </div>
                {editing && (
                  <label className="absolute inset-1 bg-black/50 text-white flex flex-col items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                    <Camera size={20} />
                    <span className="text-[10px] font-bold mt-1">Change</span>
                    <input type="file" accept="image/*" onChange={handlePicChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            {editing ? (
              <div className="space-y-6">
                
                {/* Basic Info Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Craft Specialty</label>
                    <div className="relative">
                      <Palette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="craft_specialty"
                        placeholder="e.g. Leatherworking, Pottery"
                        value={formData.craft_specialty}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">About You (Bio)</label>
                  <textarea
                    name="bio"
                    placeholder="Tell your customers about your craft, inspiration, and journey..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors resize-none leading-relaxed"
                  />
                </div>

                <hr className="border-gray-100" />

                {/* Social Links Inputs */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Social Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Camera size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                      <input
                        type="text"
                        name="instagram"
                        placeholder="@username"
                        value={formData.social_links.instagram || ''}
                        onChange={handleSocialChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                      <input
                        type="text"
                        name="twitter"
                        placeholder="@username"
                        value={formData.social_links.twitter || ''}
                        onChange={handleSocialChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input
                        type="text"
                        name="website"
                        placeholder="https://yoursite.com"
                        value={formData.social_links.website || ''}
                        onChange={handleSocialChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => { setEditing(false); setPicPreview(profile?.profile_picture || null); }}
                    className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // ── Read-Only View ──
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {profile?.name}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">{profile?.email}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {formData.craft_specialty && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold border border-pink-100">
                      <Palette size={16} /> {formData.craft_specialty}
                    </div>
                  )}
                  {formData.location && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100">
                      <MapPin size={16} /> {formData.location}
                    </div>
                  )}
                </div>

                {formData.bio && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed text-sm bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                      {formData.bio}
                    </p>
                  </div>
                )}

                {(formData.social_links?.instagram || formData.social_links?.twitter || formData.social_links?.website) && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Connect</h3>
                    <div className="flex flex-wrap gap-3">
                      {formData.social_links.instagram && (
                        <a href={`https://instagram.com/${formData.social_links.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
                          <Camera size={16} /> {formData.social_links.instagram}
                        </a>
                      )}
                      {formData.social_links.twitter && (
                        <a href={`https://twitter.com/${formData.social_links.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
                          <MessageCircle size={16} /> {formData.social_links.twitter}
                        </a>
                      )}
                      {formData.social_links.website && (
                        <a href={formData.social_links.website.startsWith('http') ? formData.social_links.website : `https://${formData.social_links.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
                          <Globe size={16} /> {formData.social_links.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Public Preview Card (1/3 width) ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900">Public Preview</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">How customers see you</p>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4 shadow-inner border border-gray-100 overflow-hidden text-2xl font-bold text-violet-600" style={{ fontFamily: "'Playfair Display', serif" }}>
              {picPreview ? (
                <img src={picPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                profile?.name?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>

            <h4 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {profile?.name}
            </h4>
            
            {formData.craft_specialty && (
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full mb-3">
                {formData.craft_specialty}
              </span>
            )}

            {formData.location && (
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-4">
                <MapPin size={12} /> {formData.location}
              </span>
            )}

            {formData.bio && (
              <p className="text-xs text-gray-600 leading-relaxed mb-6 italic px-2">
                "{formData.bio.substring(0, 120)}{formData.bio.length > 120 ? '...' : ''}"
              </p>
            )}

            <div className="w-full border-t border-gray-50 pt-4 flex justify-center gap-4">
              {formData.social_links.instagram && <Camera size={18} className="text-gray-300" />}
              {formData.social_links.twitter && <MessageCircle size={18} className="text-gray-300" />}
              {formData.social_links.website && <Globe size={18} className="text-gray-300" />}
            </div>

          </div>
        </div>

      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;
