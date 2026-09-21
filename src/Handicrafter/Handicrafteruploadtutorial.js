import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HandicrafterSidebar from "../components/HandicrafterSidebar";

function HandicrafterUploadTutorial() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty_level: "",
    materials: "",
    video: null,
  });
  const [errors, setErrors] = useState({});
  const [videoPreview, setVideoPreview] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        setErrors((prev) => ({
          ...prev,
          video: "Please upload a valid video file",
        }));
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          video: "Video file size should not exceed 500MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, video: file }));
      setErrors((prev) => ({ ...prev, video: "" }));

      // Create video preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tutorial title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Tutorial description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    }

    if (!formData.difficulty_level) {
      newErrors.difficulty_level = "Please select a difficulty level";
    }

    if (!formData.materials.trim()) {
      newErrors.materials = "Materials list is required";
    }

    if (!formData.video) {
      newErrors.video = "Please upload a tutorial video";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("accessToken");

      // Create FormData for file upload
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("difficulty_level", formData.difficulty_level);
      data.append("materials", formData.materials);
      data.append("video", formData.video);

      // Simulate upload progress (replace with actual XMLHttpRequest for real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // TODO: Replace with your actual API endpoint
      const response = await fetch("http://localhost:8000/api/tutorials/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // Show success message
      alert("Tutorial uploaded successfully! It will be reviewed by admin.");

      // Reset form
      setFormData({
        title: "",
        description: "",
        difficulty_level: "",
        materials: "",
        video: null,
      });
      setVideoPreview(null);

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/handicrafter/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload tutorial. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-page">
      <HandicrafterSidebar />

      <main className="content">
        <header className="header">
          <h1>Upload New Tutorial 🎨</h1>
          <p>Share your craft knowledge with the community</p>
        </header>

        <div className="upload-container">
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Tutorial Title */}
            <div className="form-group">
              <label htmlFor="title"></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Handmade Pottery Bowl for Beginners"
                className={errors.title ? "error" : ""}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description"></label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Provide a detailed description of what learners will create..."
                className={errors.description ? "error" : ""}
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            {/* Difficulty Level */}
            <div className="form-group">
              <label htmlFor="difficulty_level"></label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className={errors.difficulty_level ? "error" : ""}
              >
                <option value="">Select difficulty level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.difficulty_level && (
                <span className="error-text">{errors.difficulty_level}</span>
              )}
            </div>

            {/* Materials Required */}
            <div className="form-group">
              <label htmlFor="materials"></label>
              <textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                rows="4"
                placeholder="List all materials needed (one per line)&#10;e.g.,&#10;- Clay (500g)&#10;- Pottery wheel&#10;- Water bowl&#10;- Shaping tools"
                className={errors.materials ? "error" : ""}
              />
              {errors.materials && (
                <span className="error-text">{errors.materials}</span>
              )}
            </div>

            {/* Video Upload */}
            <div className="form-group">
              <label htmlFor="video">Tutorial Video *</label>
              <div className="video-upload-area">
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="video" className="upload-label">
                  {videoPreview ? (
                    <div className="video-preview">
                      <video src={videoPreview} controls width="100%" />
                      <p className="video-name">{formData.video?.name}</p>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📹</div>
                      <p>Click to upload tutorial video</p>
                      <span>Supported formats: MP4, MOV, AVI (Max 500MB)</span>
                    </div>
                  )}
                </label>
              </div>
              {errors.video && <span className="error-text">{errors.video}</span>}
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                  {uploadProgress}%
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/handicrafter/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Tutorial"}
              </button>
            </div>
          </form>

          {/* Info Section */}
          <aside className="info-section">
            <div className="info-card">
              <h3>📝 Tutorial Guidelines</h3>
              <ul>
                <li>Ensure video quality is clear and well-lit</li>
                <li>Speak clearly and explain each step</li>
                <li>Keep tutorial length between 5-30 minutes</li>
                <li>Show close-ups of intricate details</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🤖 AI Enhancement</h3>
              <p>
                Our AI will automatically extract captions and structure your tutorial
                content for better learning experience.
              </p>
            </div>

            <div className="info-card">
              <h3>✅ Review Process</h3>
              <p>
                Your tutorial will be reviewed by our admin team within 24-48 hours
                before being published to the platform.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .upload-page {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f4f6fb;
  }

  .content {
    flex: 1;
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 32px;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .header p {
    color: #6b7280;
    font-size: 16px;
    margin: 0;
  }

  .upload-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
  }

  .upload-form {
    background: #fff;
    padding: 30px;
    border-radius: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 25px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
    font-weight: 500;
    font-size: 14px;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.3s;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
  }

  .form-group input.error,
  .form-group textarea.error,
  .form-group select.error {
    border-color: #ef4444;
  }

  .error-text {
    display: block;
    color: #ef4444;
    font-size: 13px;
    margin-top: 5px;
  }

  .video-upload-area {
    margin-top: 8px;
  }

  .upload-label {
    display: block;
    cursor: pointer;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s;
  }

  .upload-label:hover {
    border-color: #0f766e;
    background: #f0fdfa;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .upload-icon {
    font-size: 48px;
  }

  .upload-placeholder p {
    margin: 0;
    color: #374151;
    font-weight: 500;
  }

  .upload-placeholder span {
    color: #6b7280;
    font-size: 13px;
  }

  .video-preview {
    text-align: center;
  }

  .video-preview video {
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .video-name {
    color: #374151;
    font-size: 14px;
    margin: 0;
  }

  .progress-bar {
    width: 100%;
    height: 40px;
    background: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 25px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0f766e, #14b8a6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    transition: width 0.3s;
  }

  .form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0f766e, #115e59);
    color: #fff;
    box-shadow: 0 4px 6px rgba(15, 118, 110, 0.2);
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #115e59, #134e4a);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(15, 118, 110, 0.3);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #f9fafb;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-card {
    background: #fff;
    padding: 20px;
    border-radius: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .info-card h3 {
    margin: 0 0 15px 0;
    color: #1f2937;
    font-size: 16px;
  }

  .info-card ul {
    margin: 0;
    padding-left: 20px;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.8;
  }

  .info-card p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
  }

  @media (max-width: 1024px) {
    .upload-container {
      grid-template-columns: 1fr;
    }

    .info-section {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .content {
      padding: 20px;
    }

    .header h1 {
      font-size: 24px;
    }

    .upload-form {
      padding: 20px;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
    }
  }
`;

export default HandicrafterUploadTutorial;