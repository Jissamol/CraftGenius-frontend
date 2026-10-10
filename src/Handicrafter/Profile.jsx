import { useState, useEffect } from 'react';
import Api from '../services/Api';
import { 
  Camera, MapPin, Palette, Globe, Edit2, Save, X, CheckCircle2, 
  AlertCircle, MessageCircle, Phone, Home, Shield, ShieldCheck, 
  Mail, Sparkles, ExternalLink, Trash2, Plus, Image as ImageIcon, 
  BookOpen, Layers, Hammer, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    bio: '',
    craft_specialty: '',
    workshop_headline: '',
    craft_story: '',
    years_of_experience: '',
    techniques_used: '',
    materials_used: '',
    badge_label: '',
    location: '',
    social_links: { instagram: '', twitter: '', website: '' }
  });

  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [coverBanner, setCoverBanner] = useState(null);
  const [coverBannerPreview, setCoverBannerPreview] = useState(null);

  // Workshop Photos
  const [workshopPhotos, setWorkshopPhotos] = useState([]);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
        name: res.data.name || '',
        phone_number: res.data.phone_number || '',
        address: res.data.address || '',
        bio: res.data.bio || '',
        craft_specialty: res.data.craft_specialty || '',
        workshop_headline: res.data.workshop_headline || '',
        craft_story: res.data.craft_story || '',
        years_of_experience: res.data.years_of_experience !== null ? res.data.years_of_experience : '',
        techniques_used: res.data.techniques_used || '',
        materials_used: res.data.materials_used || '',
        badge_label: res.data.badge_label || '',
        location: res.data.location || '',
        social_links: res.data.social_links || { instagram: '', twitter: '', website: '' }
      });
      if (res.data.profile_picture_url || res.data.profile_picture) {
        setPicPreview(res.data.profile_picture_url || res.data.profile_picture);
      }
      if (res.data.cover_banner_url || res.data.cover_banner) {
        setCoverBannerPreview(res.data.cover_banner_url || res.data.cover_banner);
      }
      if (res.data.workshop_photos) {
        setWorkshopPhotos(res.data.workshop_photos);
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
        showToast('Profile image must be less than 5MB', 'error');
        return;
      }
      setProfilePic(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Banner image must be less than 10MB', 'error');
        return;
      }
      setCoverBanner(file);
      setCoverBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleWorkshopPhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Workshop photo must be under 8MB', 'error');
        return;
      }
      setNewPhotoFile(file);
      setNewPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadWorkshopPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoFile) {
      showToast('Please select a workshop image to upload', 'error');
      return;
    }
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('image', newPhotoFile);
      if (newPhotoCaption) {
        fd.append('caption', newPhotoCaption);
      }
      const res = await Api.post('seller/workshop-photos/', fd);
      setWorkshopPhotos(prev => [res.data, ...prev]);
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      setNewPhotoCaption('');
      showToast('Workshop photo added successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload workshop photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteWorkshopPhoto = async (photoId) => {
    try {
      await Api.delete(`seller/workshop-photos/${photoId}/`);
      setWorkshopPhotos(prev => prev.filter(p => p.id !== photoId));
      showToast('Workshop photo removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete workshop photo', 'error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone_number', formData.phone_number);
      data.append('address', formData.address);
      data.append('bio', formData.bio);
      data.append('craft_specialty', formData.craft_specialty);
      data.append('workshop_headline', formData.workshop_headline);
      data.append('craft_story', formData.craft_story);
      if (formData.years_of_experience !== '') {
        data.append('years_of_experience', formData.years_of_experience);
      }
      data.append('techniques_used', formData.techniques_used);
      data.append('materials_used', formData.materials_used);
      data.append('badge_label', formData.badge_label);
      data.append('location', formData.location);
      data.append('social_links', JSON.stringify(formData.social_links));
      
      if (profilePic) {
        data.append('profile_picture', profilePic);
      }
      if (coverBanner) {
        data.append('cover_banner', coverBanner);
      }

      const res = await Api.put('seller/profile/', data);
      setProfile(res.data);
      setEditing(false);
      showToast('Artisan storefront profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sellerUserId = profile?.seller_id || profile?.user;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-[#E9DED1] rounded-lg mb-2 opacity-50" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] bg-white border border-[#E9DED1] rounded-2xl" />
          <div className="h-[400px] bg-white border border-[#E9DED1] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
            Artisan Storefront & Identity
          </h1>
          <p className="text-sm text-[#8A6A55] mt-1">
            Curate your craft stories, studio workshop photography, materials, and public shopfront.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {sellerUserId && (
            <button
              onClick={() => window.open(`/customer/artisan/${sellerUserId}`, '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              <ExternalLink size={16} /> View Public Storefront
            </button>
          )}

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3B2B25] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#8A6A55] hover:scale-105 active:scale-95 transition-all"
            >
              <Edit2 size={16} /> Edit Storefront
            </button>
          ) : (
            <button
              onClick={() => {
                setEditing(false);
                setPicPreview(profile?.profile_picture_url || profile?.profile_picture || null);
                setCoverBannerPreview(profile?.cover_banner_url || profile?.cover_banner || null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-bold transition-all"
            >
              <X size={16} /> Cancel Editing
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ── Main Form / View Card (2/3 width) ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E4DDD5] shadow-sm overflow-hidden">
            
            {/* Header Banner & Avatar */}
            <div className="relative h-44 sm:h-52 bg-gradient-to-r from-[#E9DED1] to-[#C7B8AA] overflow-hidden group">
              {coverBannerPreview ? (
                <img 
                  src={coverBannerPreview} 
                  alt="Storefront Banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-40 bg-[radial-gradient(#8A6A55_1px,transparent_1px)] [background-size:16px_16px]" />
              )}
              
              {editing && (
                <label className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 backdrop-blur-sm transition-all shadow-md">
                  <Camera size={14} /> Change Cover Banner
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                </label>
              )}

              {/* Profile Avatar overlay */}
              <div className="absolute -bottom-12 left-8 flex items-end gap-4">
                <div className="relative group/avatar">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-[#FDFBF8] overflow-hidden flex items-center justify-center border border-[#E4DDD5] text-3xl font-bold text-[#8A6A55]" style={{ fontFamily: "'Georgia', serif" }}>
                      {picPreview ? (
                        <img src={picPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profile?.name?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                  </div>
                  {editing && (
                    <label className="absolute inset-1 bg-black/50 text-white flex flex-col items-center justify-center rounded-2xl opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
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
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Craft Specialty</label>
                      <div className="relative">
                        <Palette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="craft_specialty"
                          placeholder="e.g. Stoneware Ceramics, Hand-carved Woodwork"
                          value={formData.craft_specialty}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Years of Experience</label>
                      <input
                        type="number"
                        name="years_of_experience"
                        placeholder="e.g. 12"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Workshop Studio Headline</label>
                      <input
                        type="text"
                        name="workshop_headline"
                        placeholder="e.g. Riverbend Wheel-Thrown Ceramic Studio"
                        value={formData.workshop_headline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Artisan Badge / Title</label>
                      <input
                        type="text"
                        name="badge_label"
                        placeholder="e.g. Master Potter, Heritage Woodcarver"
                        value={formData.badge_label}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Location / Studio Town</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="location"
                          placeholder="e.g. Wayanad, Kerala"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Workshop Address</label>
                      <div className="relative">
                        <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2">Short Bio</label>
                    <textarea
                      name="bio"
                      placeholder="A short introductory statement for your storefront banner..."
                      value={formData.bio}
                      onChange={handleChange}
                      rows={2}
                      className="w-full p-4 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Craft Story */}
                  <div>
                    <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-amber-800" /> Craft Story ("Behind the Craft")
                    </label>
                    <p className="text-xs text-[#8A6A55] mb-2">
                      Share the heart of your craft: family lineage, apprenticeship journey, why you create, and the soul behind your products.
                    </p>
                    <textarea
                      name="craft_story"
                      placeholder="My grandfather first sat me at a pottery wheel when I was seven years old in the clay valleys of..."
                      value={formData.craft_story}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-4 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  {/* Techniques & Materials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Hammer size={14} className="text-amber-800" /> Techniques Used
                      </label>
                      <input
                        type="text"
                        name="techniques_used"
                        placeholder="e.g. Wheel-throwing, Wood-firing, Chisel Carving"
                        value={formData.techniques_used}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                      <span className="text-[11px] text-[#8A6A55] mt-1 block">Comma-separated skills & techniques</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers size={14} className="text-amber-800" /> Natural Materials Sourced
                      </label>
                      <input
                        type="text"
                        name="materials_used"
                        placeholder="e.g. Local Clay, Reclaimed Teak, Organic Glazes"
                        value={formData.materials_used}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                      />
                      <span className="text-[11px] text-[#8A6A55] mt-1 block">Comma-separated natural materials</span>
                    </div>
                  </div>

                  <hr className="border-[#E4DDD5]" />

                  {/* Social Links Inputs */}
                  <div>
                    <label className="block text-xs font-bold text-[#3B2B25] uppercase tracking-wider mb-4">Connect & Social Media</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Camera size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="instagram"
                          placeholder="@instagram"
                          value={formData.social_links.instagram || ''}
                          onChange={handleSocialChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="relative">
                        <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="twitter"
                          placeholder="@twitter"
                          value={formData.social_links.twitter || ''}
                          onChange={handleSocialChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="relative">
                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                        <input
                          type="text"
                          name="website"
                          placeholder="https://yourwebsite.com"
                          value={formData.social_links.website || ''}
                          onChange={handleSocialChange}
                          className="w-full pl-11 pr-4 py-3 bg-[#FDFBF8] border border-[#E4DDD5] rounded-xl text-sm focus:outline-none focus:border-[#8A6A55] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => { setEditing(false); setPicPreview(profile?.profile_picture_url || null); }}
                      className="px-6 py-3 text-sm font-bold text-[#8A6A55] bg-white border border-[#E4DDD5] rounded-xl hover:bg-[#FDFBF8] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#3B2B25] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-[#8A6A55] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={18} /> Save Storefront Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // ── Read-Only View ──
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-3xl font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
                        {profile?.name}
                      </h2>
                      {profile?.is_approved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase border border-emerald-300">
                          <ShieldCheck size={14} className="text-emerald-600" /> Verified Artisan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold tracking-wide uppercase border border-amber-200">
                          <Shield size={12} /> Pending Approval
                        </span>
                      )}

                      {formData.badge_label && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold border border-amber-300">
                          <Award size={12} /> {formData.badge_label}
                        </span>
                      )}
                    </div>

                    {formData.workshop_headline && (
                      <p className="text-lg font-medium text-[#8A6A55] mt-1 italic">
                        "{formData.workshop_headline}"
                      </p>
                    )}
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-[#8A6A55]">
                        <Mail size={16} className="text-[#C7B8AA]" /> {profile?.email}
                      </div>
                      {profile?.phone_number && (
                        <div className="flex items-center gap-2.5 text-sm font-medium text-[#8A6A55]">
                          <Phone size={16} className="text-[#C7B8AA]" /> {profile?.phone_number}
                        </div>
                      )}
                      {profile?.address && (
                        <div className="flex items-center gap-2.5 text-sm font-medium text-[#8A6A55] md:col-span-2">
                          <Home size={16} className="text-[#C7B8AA]" /> {profile?.address}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {formData.craft_specialty && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F5F1] text-[#3B2B25] rounded-xl text-sm font-bold border border-[#E4DDD5]">
                        <Palette size={16} className="text-[#8A6A55]" /> {formData.craft_specialty}
                      </div>
                    )}
                    {formData.years_of_experience && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F5F1] text-[#3B2B25] rounded-xl text-sm font-bold border border-[#E4DDD5]">
                        <Sparkles size={16} className="text-[#8A6A55]" /> {formData.years_of_experience} Years Crafting
                      </div>
                    )}
                    {formData.location && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F5F1] text-[#3B2B25] rounded-xl text-sm font-bold border border-[#E4DDD5]">
                        <MapPin size={16} className="text-[#8A6A55]" /> {formData.location}
                      </div>
                    )}
                  </div>

                  {formData.bio && (
                    <div>
                      <h3 className="text-xs font-bold text-[#8A6A55] uppercase tracking-wider mb-2">Artisan Bio</h3>
                      <p className="text-[#3B2B25] leading-relaxed text-sm bg-[#FDFBF8] p-5 rounded-2xl border border-[#E4DDD5]">
                        {formData.bio}
                      </p>
                    </div>
                  )}

                  {formData.craft_story && (
                    <div>
                      <h3 className="text-xs font-bold text-[#8A6A55] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen size={14} className="text-amber-800" /> Behind the Craft & Story
                      </h3>
                      <div className="text-[#3B2B25] leading-relaxed text-sm bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-6 rounded-2xl border border-amber-200/60 whitespace-pre-line">
                        {formData.craft_story}
                      </div>
                    </div>
                  )}

                  {(formData.techniques_used || formData.materials_used) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.techniques_used && (
                        <div className="p-4 rounded-2xl bg-[#F8F5F1] border border-[#E4DDD5]">
                          <span className="text-xs font-bold text-[#8A6A55] uppercase tracking-wider block mb-2">Techniques Used</span>
                          <div className="flex flex-wrap gap-1.5">
                            {formData.techniques_used.split(',').map((t, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white text-xs font-semibold text-stone-700 border border-stone-200">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.materials_used && (
                        <div className="p-4 rounded-2xl bg-[#F8F5F1] border border-[#E4DDD5]">
                          <span className="text-xs font-bold text-[#8A6A55] uppercase tracking-wider block mb-2">Sourced Materials</span>
                          <div className="flex flex-wrap gap-1.5">
                            {formData.materials_used.split(',').map((m, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white text-xs font-semibold text-stone-700 border border-stone-200">
                                {m.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(formData.social_links?.instagram || formData.social_links?.twitter || formData.social_links?.website) && (
                    <div>
                      <h3 className="text-xs font-bold text-[#8A6A55] uppercase tracking-wider mb-3">Connect</h3>
                      <div className="flex flex-wrap gap-3">
                        {formData.social_links.instagram && (
                          <a href={`https://instagram.com/${formData.social_links.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDFBF8] hover:bg-[#F8F5F1] hover:text-[#3B2B25] border border-[#E4DDD5] rounded-xl text-sm font-semibold text-[#8A6A55] transition-colors">
                            <Camera size={16} /> {formData.social_links.instagram}
                          </a>
                        )}
                        {formData.social_links.twitter && (
                          <a href={`https://twitter.com/${formData.social_links.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDFBF8] hover:bg-[#F8F5F1] hover:text-[#3B2B25] border border-[#E4DDD5] rounded-xl text-sm font-semibold text-[#8A6A55] transition-colors">
                            <MessageCircle size={16} /> {formData.social_links.twitter}
                          </a>
                        )}
                        {formData.social_links.website && (
                          <a href={formData.social_links.website.startsWith('http') ? formData.social_links.website : `https://${formData.social_links.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDFBF8] hover:bg-[#F8F5F1] hover:text-[#3B2B25] border border-[#E4DDD5] rounded-xl text-sm font-semibold text-[#8A6A55] transition-colors">
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

          {/* ── Studio Workshop Photos Gallery & Management ── */}
          <div className="bg-white rounded-3xl border border-[#E4DDD5] shadow-sm p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4DDD5] pb-5">
              <div>
                <h3 className="text-xl font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
                  Studio & Workshop Photography
                </h3>
                <p className="text-sm text-[#8A6A55] mt-0.5">
                  Give customers a window into where and how your handmade pieces come to life.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-stone-100 rounded-full text-stone-700">
                {workshopPhotos.length} Photos in Gallery
              </span>
            </div>

            {/* Upload New Photo Form */}
            <form onSubmit={handleUploadWorkshopPhoto} className="p-5 rounded-2xl bg-[#FDFBF8] border border-amber-200/70 space-y-4">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={14} /> Add Studio Photo to Storefront
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Choose Photo</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleWorkshopPhotoFileChange}
                    className="block w-full text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3B2B25] file:text-white hover:file:bg-[#8A6A55] cursor-pointer"
                  />
                  {newPhotoPreview && (
                    <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-stone-300">
                      <img src={newPhotoPreview} alt="Workshop upload preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Caption (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Clay wheel spinning in morning sunlight"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E4DDD5] rounded-xl text-xs focus:outline-none focus:border-[#8A6A55]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploadingPhoto || !newPhotoFile}
                  className="px-5 py-2.5 rounded-xl bg-[#3B2B25] hover:bg-[#8A6A55] text-white text-xs font-bold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploadingPhoto ? 'Uploading...' : 'Upload Workshop Photo'}
                </button>
              </div>
            </form>

            {/* Gallery Grid */}
            {workshopPhotos.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-[#E4DDD5] rounded-2xl p-6">
                <ImageIcon className="mx-auto text-stone-300 mb-2" size={36} />
                <p className="text-sm font-semibold text-stone-700">No workshop photos uploaded yet</p>
                <p className="text-xs text-stone-500 mt-1">Upload pictures of your studio bench, tools, and hands shaping materials to build trust with buyers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {workshopPhotos.map((photo) => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-[#E4DDD5] aspect-square shadow-sm">
                    <img 
                      src={photo.image_url || photo.image} 
                      alt={photo.caption || 'Workshop photograph'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteWorkshopPhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow transition-all"
                          title="Delete photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {photo.caption && (
                        <p className="text-white text-xs font-medium line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Public Preview Card (1/3 width) ── */}
        <div className="space-y-6 sticky top-6">
          <div className="bg-white rounded-3xl border border-[#E4DDD5] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E4DDD5] bg-[#FDFBF8] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2A201C]">Storefront Card</h3>
                <p className="text-[11px] text-[#8A6A55] uppercase tracking-wide">Marketplace Identity</p>
              </div>
              {profile?.is_approved && (
                <ShieldCheck size={18} className="text-emerald-600" />
              )}
            </div>
            
            <div className="p-6 flex flex-col items-center text-center bg-[#F8F5F1]">
              <div className="w-20 h-20 rounded-2xl bg-[#E9DED1] flex items-center justify-center mb-3 shadow-sm border border-[#E4DDD5] overflow-hidden text-2xl font-bold text-[#3B2B25]" style={{ fontFamily: "'Georgia', serif" }}>
                {picPreview ? (
                  <img src={picPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>

              <h4 className="text-lg font-bold text-[#2A201C]" style={{ fontFamily: "'Georgia', serif" }}>
                {profile?.name}
              </h4>

              {formData.badge_label && (
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full mt-1 mb-2">
                  {formData.badge_label}
                </span>
              )}
              
              {formData.craft_specialty && (
                <span className="text-xs font-semibold text-[#3B2B25] bg-[#E9DED1] border border-[#C7B8AA] px-3 py-1 rounded-full mb-2">
                  {formData.craft_specialty}
                </span>
              )}

              {formData.location && (
                <span className="text-xs font-medium text-[#8A6A55] flex items-center gap-1 mb-3">
                  <MapPin size={12} /> {formData.location}
                </span>
              )}

              {formData.bio && (
                <p className="text-xs text-[#3B2B25] leading-relaxed mb-5 italic px-2">
                  "{formData.bio.substring(0, 110)}{formData.bio.length > 110 ? '...' : ''}"
                </p>
              )}

              {/* View Public Storefront Button */}
              {sellerUserId && (
                <button
                  type="button"
                  onClick={() => window.open(`/customer/artisan/${sellerUserId}`, '_blank')}
                  className="w-full py-2.5 rounded-xl bg-[#2A201C] hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mb-4"
                >
                  <ExternalLink size={14} /> Open Live Storefront
                </button>
              )}

              <div className="w-full border-t border-[#E4DDD5] pt-4 flex justify-center gap-4">
                {formData.social_links.instagram && <Camera size={18} className="text-[#8A6A55]" />}
                {formData.social_links.twitter && <MessageCircle size={18} className="text-[#8A6A55]" />}
                {formData.social_links.website && <Globe size={18} className="text-[#8A6A55]" />}
              </div>

            </div>
          </div>

          {/* Quick Craft Story Tips Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-sm text-xs space-y-2.5 text-stone-700">
            <h5 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <Sparkles size={16} className="text-amber-700" /> Storytelling Matters
            </h5>
            <p>
              Buyers on CraftGenius treasure authenticity. Artisans who tell the origin of their techniques and share workshop photos see up to 3× higher customer trust and order rates.
            </p>
          </div>
        </div>

      </div>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl ${
              toast.type === 'success' ? 'bg-[#3B2B25]' : 'bg-red-600'
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
