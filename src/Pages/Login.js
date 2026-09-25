import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  beige: "#E9DED1",
  softBrown: "#8A6A55",
  cream: "#F8F5F1",
  taupe: "#C7B8AA",
  darkBrown: "#3B2B25",
  warmWhite: "#FDFBF8",
  cardBg: "rgba(255,255,255,0.92)",
  inputBg: "#F5F1EC",
  inputBorder: "#E4DDD5",
  inputFocus: "#8A6A55",
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.35 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE ICON SVG
// ═══════════════════════════════════════════════════════════════════════════════

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EYE ICONS
// ═══════════════════════════════════════════════════════════════════════════════

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

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING BACKGROUND BLOBS
// ═══════════════════════════════════════════════════════════════════════════════

function FloatingBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.beige}80 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.taupe}60 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.softBrown}15 0%, transparent 70%)`,
          filter: "blur(50px)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.role);

      if (data.is_superuser || data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "CUSTOMER") {
        navigate("/customer/dashboard");
      } else if (data.role === "HANDICRAFTER") {
        navigate("/handicrafter/dashboard");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.beige} 50%, ${COLORS.taupe}40 100%)`,
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        position: "relative",
      }}
    >
      <FloatingBlobs />

      {/* ── MAIN CARD ── */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1080px",
          background: COLORS.cardBg,
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow:
            "0 25px 80px rgba(59,43,37,0.12), 0 8px 32px rgba(59,43,37,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
          display: "flex",
          overflow: "hidden",
          minHeight: "620px",
        }}
      >
        {/* ════════════════════════════════════════════════════
            LEFT — LOGIN FORM
        ════════════════════════════════════════════════════ */}
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          style={{
            flex: "1 1 50%",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Back Button & Logo */}
          <motion.div variants={itemVariants} style={{ marginBottom: "36px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: "none", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "8px",
                color: COLORS.taupe,
                fontSize: "14px",
                fontWeight: 500,
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = COLORS.softBrown}
              onMouseLeave={(e) => e.target.style.color = COLORS.taupe}
            >
              <ArrowLeftIcon /> Back to Home
            </Link>
            
            <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", width: "fit-content" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${COLORS.softBrown}, ${COLORS.darkBrown})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  fontStyle: "italic",
                }}
              >
                C
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: COLORS.darkBrown,
                  letterSpacing: "0.02em",
                }}
              >
                CraftGenius
              </span>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} style={{ marginBottom: "28px" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "32px",
                fontWeight: 700,
                color: COLORS.darkBrown,
                marginBottom: "8px",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Login
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: COLORS.softBrown,
                lineHeight: 1.5,
                opacity: 0.85,
              }}
            >
              Choose from 10,000+ products across 400+ categories
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#B91C1C",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#DC2626", flexShrink: 0 }} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>



          <form onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div variants={itemVariants} style={{ marginBottom: "18px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.darkBrown,
                  marginBottom: "8px",
                  letterSpacing: "0.02em",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "14px",
                  border: `1.5px solid ${COLORS.inputBorder}`,
                  background: COLORS.inputBg,
                  fontSize: "14px",
                  color: COLORS.darkBrown,
                  outline: "none",
                  transition: "all 0.25s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.inputFocus;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.softBrown}18`;
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.inputBorder;
                  e.target.style.boxShadow = "none";
                  e.target.style.background = COLORS.inputBg;
                }}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} style={{ marginBottom: "18px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.darkBrown,
                  marginBottom: "8px",
                  letterSpacing: "0.02em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "13px 48px 13px 16px",
                    borderRadius: "14px",
                    border: `1.5px solid ${COLORS.inputBorder}`,
                    background: COLORS.inputBg,
                    fontSize: "14px",
                    color: COLORS.darkBrown,
                    outline: "none",
                    transition: "all 0.25s ease",
                    fontFamily: "inherit",
                    letterSpacing: showPassword ? "normal" : "0.15em",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.inputFocus;
                    e.target.style.boxShadow = `0 0 0 3px ${COLORS.softBrown}18`;
                    e.target.style.background = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.inputBorder;
                    e.target.style.boxShadow = "none";
                    e.target.style.background = COLORS.inputBg;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.taupe,
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.softBrown)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.taupe)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={itemVariants}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: COLORS.softBrown,
                }}
              >
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      appearance: "none",
                      width: "18px",
                      height: "18px",
                      borderRadius: "5px",
                      border: `1.5px solid ${rememberMe ? COLORS.softBrown : COLORS.inputBorder}`,
                      background: rememberMe ? COLORS.softBrown : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  />
                  {rememberMe && (
                    <svg
                      width="11"
                      height="9"
                      viewBox="0 0 11 9"
                      fill="none"
                      style={{ position: "absolute", left: "3.5px", top: "4.5px", pointerEvents: "none" }}
                    >
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                Remember Me
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.softBrown,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.darkBrown)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.softBrown)}
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "14px",
                  border: "none",
                  background: `linear-gradient(135deg, ${COLORS.softBrown} 0%, ${COLORS.darkBrown} 100%)`,
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(138,106,85,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  letterSpacing: "0.02em",
                }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            variants={itemVariants}
            style={{
              textAlign: "center",
              marginTop: "28px",
              fontSize: "13px",
              color: COLORS.taupe,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: COLORS.softBrown,
                fontWeight: 700,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.darkBrown)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.softBrown)}
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════════
            RIGHT — IMAGE SHOWCASE
        ════════════════════════════════════════════════════ */}
        <div
          className="login-image-section"
          style={{
            flex: "1 1 50%",
            position: "relative",
            overflow: "hidden",
            display: "none",
          }}
        >
          {/* Subtle warm overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${COLORS.beige}15 0%, transparent 40%, ${COLORS.beige}25 100%)`,
              zIndex: 2,
              pointerEvents: "none",
              borderRadius: "0 24px 24px 0",
            }}
          />

          {/* Decorative floating shapes */}
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "10%",
              right: "10%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.beige}50 0%, transparent 70%)`,
              filter: "blur(25px)",
              zIndex: 1,
            }}
          />
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{
              position: "absolute",
              bottom: "15%",
              left: "5%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.taupe}40 0%, transparent 70%)`,
              filter: "blur(20px)",
              zIndex: 1,
            }}
          />

          {/* Main Image */}
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            src="/login_showcase.png"
            alt="Handmade ceramic artisan product"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0 24px 24px 0",
              transition: "transform 0.6s ease",
            }}
          />
        </div>
      </motion.div>

      {/* ── INLINE RESPONSIVE STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        input::placeholder {
          color: ${COLORS.taupe} !important;
          opacity: 0.7;
        }

        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Show image section on desktop */
        @media (min-width: 900px) {
          .login-image-section {
            display: block !important;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 899px) {
          .login-image-section {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 28px !important;
          }
        }

        /* Subtle noise texture */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          opacity: 0.015;
          pointer-events: none;
          z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>
    </motion.div>
  );
}

export default Login;