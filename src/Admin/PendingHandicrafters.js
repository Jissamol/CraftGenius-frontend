import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function PendingHandicrafters() {
  const [pendingHandicrafters, setPendingHandicrafters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const fetchPending = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/pending-handicrafters/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingHandicrafters(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [navigate, token]);

  const handleApprove = async (id) => {
    try {
        await axios.post(
            `http://localhost:8000/api/approve-handicrafter/${id}/`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );          
      setPendingHandicrafters(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/reject-handicrafter/${id}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingHandicrafters(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="pending-content">
        <h1>Pending Handicrafters</h1>
        {pendingHandicrafters.length === 0 ? (
          <p>No pending handicrafters.</p>
        ) : (
          <ul>
            {pendingHandicrafters.map(user => (
              <li key={user.id}>
                {user.name} ({user.email})
                <div className="buttons">
                  <button onClick={() => handleApprove(user.id)}>Approve</button>
                  <button className="reject" onClick={() => handleReject(user.id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</button>
      </main>

      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f4f6f8;
        }

        .pending-content {
          flex: 1;
          padding: 40px;
          font-family: 'DM Sans', sans-serif;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          padding: 12px 10px;
          margin-bottom: 8px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .buttons button {
          margin-left: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .buttons button:hover {
          opacity: 0.9;
        }

        .buttons .reject {
          background: #ff4d4d;
          color: white;
        }

        .buttons button:not(.reject) {
          background: #5f72ff;
          color: white;
        }

        button {
          margin-top: 20px;
          padding: 10px 16px;
          background: #5f72ff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:hover {
          background: #4a5fe0;
        }
      `}</style>
    </div>
  );
}

export default PendingHandicrafters;
