import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content">
        <h1>Admin Dashboard</h1>
        <p>Manage users, tutorials, and platform activity</p>

        <div className="stats">
          <div className="card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="card">
            <h3>Pending Handicrafters</h3>
            <p>8</p>
          </div>

          <div className="card">
            <h3>Pending Tutorials</h3>
            <p>14</p>
          </div>

          <div className="card">
            <h3>Published Tutorials</h3>
            <p>56</p>
          </div>
        </div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f4f6f8;
        }

        .main-content {
          flex: 1;
          padding: 40px;
        }

        .main-content h1 {
          font-size: 30px;
          margin-bottom: 6px;
        }

        .main-content p {
          color: #555;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .card {
          background: white;
          padding: 26px;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
        }

        .card h3 {
          font-size: 15px;
          color: #666;
        }

        .card p {
          font-size: 34px;
          font-weight: 700;
          margin-top: 12px;
          color: #1a1a1a;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
