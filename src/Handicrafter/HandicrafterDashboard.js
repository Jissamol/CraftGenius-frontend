import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandicrafterSidebar from "../components/HandicrafterSidebar";

function HandicrafterDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    totalTutorials: 12,
    pendingApproval: 3,
    totalLearners: 248,
    totalEarnings: 18750,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!token || role !== "HANDICRAFTER") {
      navigate("/login");
      return;
    }

    setUserName(name || "Handicrafter");

    // TODO: Fetch real stats from API
    // fetchDashboardStats();
  }, [navigate]);

  const quickActions = [
    {
      icon: "➕",
      label: "Upload New Tutorial",
      action: () => navigate("/handicrafter/upload"),
    },
    {
      icon: "💬",
      label: "View Questions",
      action: () => navigate("/handicrafter/qa"),
    },
    {
      icon: "📊",
      label: "View Earnings",
      action: () => navigate("/handicrafter/earnings"),
    },
  ];

  return (
    <div className="dashboard">
      <HandicrafterSidebar />

      <main className="content">
        <header className="header">
          <h1>Welcome back, {userName} 👋</h1>
          <p>Share your creativity and inspire learners around the world.</p>
        </header>

        {/* Stats Cards */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>Total Tutorials</h3>
              <p>{stats.totalTutorials}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending Approval</h3>
              <p>{stats.pendingApproval}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Learners</h3>
              <p>{stats.totalLearners}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Earnings</h3>
              <p>₹{stats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            {quickActions.map((action, index) => (
              <button key={index} onClick={action.action}>
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity or Additional Sections can go here */}
      </main>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .dashboard {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f4f6fb;
  }

  /* Main Content */
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

  /* Stats Section */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: #fff;
    padding: 25px;
    border-radius: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s;
  }

  .stat-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .stat-icon {
    font-size: 36px;
    background: #f0fdf4;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .stat-info {
    flex: 1;
  }

  .stat-card h3 {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-card p {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    color: #0f766e;
  }

  /* Actions Section */
  .actions {
    margin-top: 40px;
  }

  .actions h2 {
    margin-bottom: 20px;
    font-size: 22px;
    color: #1f2937;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
  }

  .action-grid button {
    padding: 20px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #0f766e, #115e59);
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 6px rgba(15, 118, 110, 0.2);
  }

  .action-grid button:hover {
    background: linear-gradient(135deg, #115e59, #134e4a);
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(15, 118, 110, 0.3);
  }

  .action-grid button:active {
    transform: translateY(-1px);
  }

  .action-icon {
    font-size: 28px;
  }

  .action-label {
    font-size: 14px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard {
      flex-direction: column;
    }

    .content {
      padding: 20px;
    }

    .header h1 {
      font-size: 24px;
    }

    .stats {
      grid-template-columns: 1fr;
    }

    .action-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .action-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default HandicrafterDashboard;