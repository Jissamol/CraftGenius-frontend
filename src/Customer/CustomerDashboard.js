import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "CUSTOMER") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">CraftGenius AI</h2>
        <ul>
          <li>Dashboard</li>
          <li>Browse Tutorials</li>
          <li>Image Search</li>
          <li>My Learning Progress</li>
          <li>My Questions</li>
          <li onClick={handleLogout} className="logout">Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        <h1>Welcome 👋</h1>
        <p>Learn beautiful handicrafts step-by-step with AI guidance</p>

        <div className="cards">
          <div className="card">
            <h3>Enrolled Tutorials</h3>
            <p>9</p>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <p>4</p>
          </div>

          <div className="card">
            <h3>In Progress</h3>
            <p>5</p>
          </div>

          <div className="card">
            <h3>Questions Asked</h3>
            <p>7</p>
          </div>
        </div>
      </main>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f4f6f8;
  font-family: 'DM Sans', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  padding: 30px 22px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 40px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 14px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.3s;
}

.sidebar li:hover {
  background: rgba(255, 255, 255, 0.18);
}

.logout {
  margin-top: 40px;
  background: rgba(255, 80, 80, 0.85);
  text-align: center;
}

/* Main Content */
.main {
  flex: 1;
  padding: 40px;
}

.main h1 {
  font-size: 30px;
  margin-bottom: 6px;
}

.main p {
  color: #555;
}

.cards {
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
  font-size: 32px;
  font-weight: 700;
  margin-top: 10px;
  color: #1a1a1a;
}
`;

export default CustomerDashboard;
