import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">CraftGenius AI</h2>
      <nav>
        <ul>
          <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
          <li>User Management</li>
          <li onClick={() => navigate("/admin/pending-handicrafters")}>
            Handicrafter Approvals
          </li>
          <li>Tutorial Approvals</li>
          <li>Reports</li>
          <li onClick={handleLogout} className="logout">
            Logout
          </li>
        </ul>
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          background: linear-gradient(135deg, #5f72ff, #9b5cff);
          color: white;
          padding: 30px 20px;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 40px;
        }

        nav ul {
          list-style: none;
          padding: 0;
        }

        nav ul li {
          padding: 14px 12px;
          margin-bottom: 10px;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.3s;
        }

        nav ul li:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .logout {
          margin-top: 40px;
          background: rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 210px;
          }
        }
      `}</style>
    </aside>
  );
}

export default AdminSidebar;
