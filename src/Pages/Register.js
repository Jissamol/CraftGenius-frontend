import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  beige: "#E9DED1",
  softBrown: "#8A6A55",
  cream: "#F7F6F2",
  taupe: "#C7B8AA",
  darkBrown: "#2A201C",
  inputBg: "#FDFBF8",
  inputBorder: "#E4DDD5",
  inputFocus: "#8A6A55",
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone_number: "",
    role: "CUSTOMER",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      
      if (formData.address) data.append("address", formData.address);
      if (formData.phone_number) data.append("phone_number", formData.phone_number);
      if (profilePic) data.append("profile_picture", profilePic);

      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        body: data,
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(responseData.message || "Welcome! Your account has been created.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(responseData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 20px",
        overflow: "hidden",
      }}
    >
      {/* ── FULL SCREEN BACKGROUND ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&q=80"
          alt="Artisan background"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(1.05)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(42,32,28,0.7) 0%, rgba(42,32,28,0.3) 100%)", backdropFilter: "blur(4px)" }} />
      </div>

      {/* ── CENTERED CARD ── */}
      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.6)",
          width: "100%",
          maxWidth: "480px",
          borderRadius: "32px",
          padding: "48px 40px",
          boxShadow: "0 25px 80px rgba(59,43,37,0.12), 0 8px 32px rgba(59,43,37,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          
          {/* Header */}
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: COLORS.darkBrown,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  fontStyle: "italic",
                  margin: "0 auto",
                }}
              >
                C
              </div>
            </Link>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "32px",
                fontWeight: 600,
                color: COLORS.darkBrown,
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              Create Account
            </h1>
            <p style={{ fontSize: "14px", color: COLORS.taupe }}>Join our artisan marketplace</p>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#FEF2F2", color: "#B91C1C", fontSize: "13px", fontWeight: 500, border: "1px solid #FECACA" }}>
                  {error}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#F0FDF4", color: "#16A34A", fontSize: "13px", fontWeight: 500, border: "1px solid #BBF7D0" }}>
                  {success}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Input: Name */}
            <motion.div variants={fadeUp} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${COLORS.inputBorder}`,
                  background: COLORS.inputBg,
                  fontSize: "15px",
                  color: COLORS.darkBrown,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; e.target.style.background = "white"; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
              />
            </motion.div>

            {/* Input: Email */}
            <motion.div variants={fadeUp} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${COLORS.inputBorder}`,
                  background: COLORS.inputBg,
                  fontSize: "15px",
                  color: COLORS.darkBrown,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; e.target.style.background = "white"; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
              />
            </motion.div>

            {/* Split Row: Phone & Profile Pic */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              {/* Input: Phone */}
              <motion.div variants={fadeUp} style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Phone Number</label>
                <input
                  name="phone_number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${COLORS.inputBorder}`,
                    background: COLORS.inputBg,
                    fontSize: "15px",
                    color: COLORS.darkBrown,
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
                />
              </motion.div>

              {/* Input: Profile Picture (Optional) */}
              <motion.div variants={fadeUp} style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Profile Picture <span style={{color: COLORS.taupe, fontWeight: 400}}>(Optional)</span></label>
                <div style={{ position: "relative" }}>
                  <input
                    name="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      borderRadius: "12px",
                      border: `1.5px dashed ${COLORS.inputBorder}`,
                      background: COLORS.inputBg,
                      fontSize: "12px",
                      color: COLORS.taupe,
                      outline: "none",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; }}
                    onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; }}
                  />
                  {!profilePic && (
                    <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.taupe }}>
                      <CameraIcon />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Input: Address */}
            <motion.div variants={fadeUp} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Address</label>
              <textarea
                name="address"
                placeholder="Enter your full address..."
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={2}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${COLORS.inputBorder}`,
                  background: COLORS.inputBg,
                  fontSize: "15px",
                  color: COLORS.darkBrown,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  resize: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; e.target.style.background = "white"; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
              />
            </motion.div>

            {/* Input: Password */}
            <motion.div variants={fadeUp} style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength="6"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${COLORS.inputBorder}`,
                    background: COLORS.inputBg,
                    fontSize: "15px",
                    color: COLORS.darkBrown,
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    letterSpacing: showPassword ? "normal" : "0.15em",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = COLORS.inputFocus; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.taupe,
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </motion.div>

            {/* Role Switcher */}
            <motion.div variants={fadeUp} style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkBrown, marginBottom: "8px" }}>I am joining as a:</label>
              <div style={{ display: "flex", gap: "8px", background: COLORS.inputBg, padding: "4px", borderRadius: "14px", border: `1px solid ${COLORS.inputBorder}` }}>
                
                <div
                  onClick={() => !isLoading && setFormData({ ...formData, role: "CUSTOMER" })}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    background: formData.role === "CUSTOMER" ? "white" : "transparent",
                    boxShadow: formData.role === "CUSTOMER" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: formData.role === "CUSTOMER" ? 700 : 500, color: formData.role === "CUSTOMER" ? COLORS.darkBrown : COLORS.taupe }}>
                    Customer
                  </span>
                </div>
                
                <div
                  onClick={() => !isLoading && setFormData({ ...formData, role: "HANDICRAFTER" })}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    background: formData.role === "HANDICRAFTER" ? "white" : "transparent",
                    boxShadow: formData.role === "HANDICRAFTER" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: formData.role === "HANDICRAFTER" ? 700 : 500, color: formData.role === "HANDICRAFTER" ? COLORS.darkBrown : COLORS.taupe }}>
                    Artisan
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: COLORS.darkBrown,
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(42,32,28,0.2)",
                }}
              >
                {isLoading ? "Processing..." : "Create Account"}
              </motion.button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div variants={fadeUp} style={{ marginTop: "24px", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: COLORS.taupe }}>Already have an account? </span>
            <Link
              to="/login"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: COLORS.softBrown,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.darkBrown)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.softBrown)}
            >
              Sign in
            </Link>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;