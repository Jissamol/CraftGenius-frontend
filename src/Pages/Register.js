import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(data.message || "Registration successful! Please login.");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Register Card */}
      <div className="register-card">
        <div className="card-content">
          {/* Header */}
          <div className="register-header">
            <Link to="/login" className="back-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 10H5m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </Link>
            <h1 className="register-title">
              Create Account
            </h1>
            <p className="register-subtitle">
              Join CraftGenius and start your creative journey
            </p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5l6-6m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
            
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 7a7 7 0 1114 0H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6l7 5 7-5M3 6v8a2 2 0 002 2h10a2 2 0 002-2V6M3 6a2 2 0 012-2h10a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10V7a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3.98 8.223A10.477 10.477 0 001.934 10C3.226 13.338 6.244 15.5 10 15.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0110 5.5c3.756 0 6.773 2.162 8.066 5.5a10.477 10.477 0 01-1.555 2.424M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 5.5C6.244 5.5 3.226 7.662 1.934 11c1.292 3.338 4.31 5.5 8.066 5.5s6.773-2.162 8.066-5.5C16.773 7.662 13.756 5.5 10 5.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <p className="input-hint">Must be at least 6 characters</p>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                Register As
              </label>
              <div className="role-selection">
                <label className={`role-card ${formData.role === "CUSTOMER" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={formData.role === "CUSTOMER"}
                    onChange={handleChange}
                    className="role-input"
                    disabled={isLoading}
                  />
                  <div className="role-content">
                    <div className="role-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="role-text">
                      <h3 className="role-title">Customer</h3>
                      <p className="role-description">Learn and explore handicrafts</p>
                    </div>
                  </div>
                  <div className="role-checkmark">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16 6L7.5 14.5 4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </label>

                <label className={`role-card ${formData.role === "HANDICRAFTER" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="HANDICRAFTER"
                    checked={formData.role === "HANDICRAFTER"}
                    onChange={handleChange}
                    className="role-input"
                    disabled={isLoading}
                  />
                  <div className="role-content">
                    <div className="role-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="role-text">
                      <h3 className="role-title">Handicrafter</h3>
                      <p className="role-description">Share your craft expertise</p>
                    </div>
                  </div>
                  <div className="role-checkmark">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16 6L7.5 14.5 4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </label>
              </div>
              {formData.role === "HANDICRAFTER" && (
                <p className="input-hint" style={{ color: "#f59e0b" }}>
                  ⚠️ Handicrafter accounts require admin approval before access
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&q=80') center/cover no-repeat fixed;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .register-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          z-index: 1;
        }

        /* Register Card */
        .register-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.8s ease-out;
        }

        .card-content {
          padding: 50px 40px;
        }

        /* Header */
        .register-header {
          text-align: center;
          margin-bottom: 35px;
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 25px;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #667eea;
          transform: translateX(-5px);
        }

        .register-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #1a1a1a 0%, #667eea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          font-size: 16px;
          color: #666;
          font-weight: 400;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          animation: slideDown 0.5s ease-out;
        }

        .alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        /* Form */
        .register-form {
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #999;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-input:focus ~ .input-icon,
        .input-wrapper:focus-within .input-icon {
          color: #667eea;
        }

        .form-input:disabled {
          background: #f9f9f9;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .form-input::placeholder {
          color: #999;
        }

        .toggle-password {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .toggle-password:hover:not(:disabled) {
          color: #667eea;
        }

        .toggle-password:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .input-hint {
          font-size: 13px;
          color: #999;
          margin-top: 6px;
          display: block;
        }

        /* Role Selection */
        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .role-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 18px;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .role-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .role-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .role-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .role-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .role-text {
          flex: 1;
        }

        .role-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .role-description {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }

        .role-checkmark {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-card.selected .role-checkmark {
          opacity: 1;
          transform: scale(1);
        }

        /* Submit Button */
        .submit-button {
          width: 100%;
          padding: 16px;
          margin-top: 28px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .button-arrow {
          transition: transform 0.3s ease;
        }

        .submit-button:hover:not(:disabled) .button-arrow {
          transform: translateX(5px);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Footer */
        .register-footer {
          text-align: center;
          margin-top: 28px;
          animation: fadeIn 1s ease-out 0.7s both;
        }

        .footer-text {
          font-size: 14px;
          color: #666;
        }

        .footer-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #764ba2;
        }

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .card-content {
            padding: 40px 30px;
          }

          .register-title {
            font-size: 36px;
          }

          .role-selection {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;