import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package, IndianRupee, ImagePlus,
  X, CheckCircle2, Upload, Info, Lightbulb, Camera,
  ArrowLeft, Save, Sparkles, Eye, EyeOff,
} from 'lucide-react';
import Api from '../services/Api';

/* ── Reusable field wrapper ── */
const Field = ({ label, required, error, hint, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-violet-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
        <X size={11} /> {error}
      </p>
    )}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

/* ── Styled input ── */
const Input = ({ error, className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400
      focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100
      transition-all duration-200
      ${error ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'}
      ${className}`}
    {...props}
  />
);

/* ── Styled textarea ── */
const Textarea = ({ error, ...props }) => (
  <textarea
    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400
      focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100
      transition-all duration-200 resize-none
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
    {...props}
  />
);

/* ── Styled select ── */
const Select = ({ error, children, ...props }) => (
  <select
    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
      focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100
      transition-all duration-200 cursor-pointer
      ${error ? 'border-red-300' : 'border-gray-200'}`}
    {...props}
  >
    {children}
  </select>
);

/* ── Section card wrapper ── */
const Section = ({ icon: Icon, title, subtitle, children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
        <Icon size={16} className="text-violet-600" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/* ═══════════════════════════════════ */
function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', category: '',
    price: '', stock: '', tags: '', is_active: true,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCategories();
    if (editId) fetchProduct();
  }, [editId]);

  const fetchCategories = async () => {
    try { const res = await Api.get('categories/'); setCategories(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchProduct = async () => {
    try {
      const res = await Api.get('products/my/');
      const product = res.data.find(p => p.id === parseInt(editId));
      if (product) {
        setFormData({
          name: product.name, description: product.description,
          category: product.category || '', price: product.price,
          stock: product.stock, tags: product.tags, is_active: product.is_active,
        });
        if (product.images) setImagePreviews(product.images.map(img => img.image));
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const processFiles = (files) => {
    const arr = Array.from(files);
    const total = images.length + arr.length;
    if (total > 5) { showToast('Maximum 5 images allowed', 'error'); return; }
    const valid = arr.filter(f => {
      if (!f.type.startsWith('image/')) { showToast(`${f.name} is not an image`, 'error'); return false; }
      if (f.size > 5 * 1024 * 1024) { showToast(`${f.name} exceeds 5MB`, 'error'); return false; }
      return true;
    });
    setImages(prev => [...prev, ...valid]);
    setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
  };

  const handleImageChange = (e) => processFiles(e.target.files);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Drag-and-drop
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errs.price = 'Valid price is required';
    if (formData.stock === '' || formData.stock < 0) errs.stock = 'Valid stock is required';
    if (!editId && images.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'category' && !v) return;
        data.append(k, v);
      });
      images.forEach(img => data.append('images', img));
      if (editId) {
        await Api.put(`products/${editId}/update/`, data);
        showToast('Product updated successfully!', 'success');
      } else {
        await Api.post('products/create/', data);
        showToast('Product listed successfully!', 'success');
      }
      setTimeout(() => navigate('/handicrafter/products'), 1500);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save product', 'error');
    } finally { setLoading(false); }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  return (
    <div className="space-y-6 pb-8">
      {/* ── Page header ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/handicrafter/products')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {editId ? 'Edit Product' : 'List New Product'}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {editId ? 'Update your product details below' : 'Fill in the details to list on the marketplace'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ══ LEFT COLUMN (2/3) ══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <Section icon={Package} title="Basic Information" subtitle="Product name and description">
              <div className="space-y-4">
                <Field label="Product Name" required error={errors.name}>
                  <Input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} placeholder="e.g. Hand-woven Bamboo Basket"
                    error={errors.name}
                  />
                </Field>
                <Field label="Description" required error={errors.description}
                  hint="Write a detailed description to help customers understand your product">
                  <Textarea
                    name="description" value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe materials, dimensions, crafting process, care instructions…"
                    rows={5} error={errors.description}
                  />
                </Field>
              </div>
            </Section>

            {/* Pricing & Inventory */}
            <Section icon={IndianRupee} title="Pricing & Inventory" subtitle="Set price and stock quantity">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <Select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Price (₹)" required error={errors.price}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <Input
                      type="number" name="price" value={formData.price}
                      onChange={handleChange} placeholder="0.00"
                      step="0.01" min="0" error={errors.price}
                      className="pl-8"
                    />
                  </div>
                </Field>
                <Field label="Stock Quantity" required error={errors.stock}>
                  <Input
                    type="number" name="stock" value={formData.stock}
                    onChange={handleChange} placeholder="0"
                    min="0" error={errors.stock}
                  />
                </Field>
                <Field label="Tags" hint="Comma-separated keywords">
                  <Input
                    type="text" name="tags" value={formData.tags}
                    onChange={handleChange}
                    placeholder="handmade, pottery, art"
                  />
                </Field>
              </div>

              {/* Visibility toggle */}
              <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  {formData.is_active
                    ? <Eye size={16} className="text-emerald-500" />
                    : <EyeOff size={16} className="text-gray-400" />
                  }
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {formData.is_active ? 'Visible to customers' : 'Hidden from marketplace'}
                    </p>
                    <p className="text-xs text-gray-400">Toggle product visibility</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox" name="is_active"
                    checked={formData.is_active} onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:bg-violet-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            </Section>

            {/* Image Upload */}
            <Section icon={ImagePlus} title="Product Images"
              subtitle={`${imagePreviews.length}/5 images uploaded`}>

              {/* Drop zone */}
              <div
                ref={dropRef}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer
                  ${dragging
                    ? 'border-violet-400 bg-violet-50 scale-[1.01]'
                    : errors.images
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'
                  }`}
              >
                <label htmlFor="product-images" className="flex flex-col items-center justify-center py-10 cursor-pointer">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                    dragging ? 'bg-violet-100' : 'bg-white border border-gray-200 shadow-sm'
                  }`}>
                    {dragging
                      ? <Upload size={24} className="text-violet-600 animate-bounce" />
                      : <Camera size={24} className="text-gray-400" />
                    }
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {dragging ? 'Drop images here' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP — Max 5MB each</p>
                  <span className="mt-3 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
                    Browse files
                  </span>
                </label>
                <input
                  type="file" id="product-images" multiple accept="image/*"
                  onChange={handleImageChange} className="hidden"
                />
              </div>

              {errors.images && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium mt-2">
                  <X size={11} /> {errors.images}
                </p>
              )}

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                      {/* Remove */}
                      <button
                        type="button" onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={12} />
                      </button>
                      {/* Primary badge */}
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-violet-600/90 text-white text-[10px] font-bold py-0.5 text-center">
                          PRIMARY
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add more slot */}
                  {imagePreviews.length < 5 && (
                    <label htmlFor="product-images"
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/40 flex items-center justify-center cursor-pointer transition-all group">
                      <div className="flex flex-col items-center gap-1">
                        <ImagePlus size={18} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
                        <span className="text-[10px] text-gray-300 group-hover:text-violet-400">Add</span>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </Section>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/handicrafter/products')}
                disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: loading ? '#A78BFA' : 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {editId ? 'Updating…' : 'Creating…'}
                  </>
                ) : editId ? (
                  <><Save size={16} /> Update Product</>
                ) : (
                  <><Sparkles size={16} /> Publish Product</>
                )}
              </button>
            </div>
          </div>

          {/* ══ RIGHT COLUMN (1/3) — Tips ══ */}
          <div className="space-y-4">

            {/* Photo tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-violet-50 to-purple-50">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Camera size={15} className="text-violet-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Photo Tips</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { tip: 'Use natural lighting', detail: 'Shoot near a window for soft, even light' },
                  { tip: 'Show multiple angles', detail: 'Front, back, side and detail shots' },
                  { tip: 'Include size reference', detail: 'Place a common object next to the product' },
                  { tip: 'Use a clean background', detail: 'White or neutral tones work best' },
                ].map(({ tip, detail }, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{tip}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lightbulb size={15} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Pricing Tips</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { tip: 'Research similar products', detail: 'Check what competitors charge' },
                  { tip: 'Include material costs', detail: 'Don\'t forget raw material expenses' },
                  { tip: 'Factor in your time', detail: 'Your labour has value — price accordingly' },
                  { tip: 'Consider shipping costs', detail: 'Build in packaging & delivery fees' },
                ].map(({ tip, detail }, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{tip}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick checklist */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Info size={15} className="text-violet-200" />
                <h3 className="text-sm font-bold">Listing Checklist</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Product name', done: formData.name.length > 3 },
                  { label: 'Description', done: formData.description.length > 10 },
                  { label: 'Price set', done: !!formData.price && formData.price > 0 },
                  { label: 'Stock added', done: !!formData.stock && formData.stock >= 0 },
                  { label: 'Images uploaded', done: imagePreviews.length > 0 },
                ].map(({ label, done }, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-emerald-400' : 'bg-white/20'
                    }`}>
                      {done && <CheckCircle2 size={11} className="text-white" />}
                    </div>
                    <span className={`text-xs ${done ? 'text-white' : 'text-violet-200'}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-violet-200 mb-1.5">
                  <span>Completion</span>
                  <span>
                    {[formData.name.length > 3, formData.description.length > 10,
                      !!formData.price && formData.price > 0,
                      !!formData.stock && formData.stock >= 0,
                      imagePreviews.length > 0].filter(Boolean).length}/5
                  </span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${([formData.name.length > 3, formData.description.length > 10,
                        !!formData.price && formData.price > 0,
                        !!formData.stock && formData.stock >= 0,
                        imagePreviews.length > 0].filter(Boolean).length / 5) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
          toast.type === 'success'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
            : 'bg-gradient-to-r from-red-500 to-rose-600'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={16} />
            : <X size={16} />
          }
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default AddProduct;
