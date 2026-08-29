import { useNavigate } from "react-router-dom";

function HandicrafterSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/handicrafter/dashboard" },
    { icon: "📚", label: "My Tutorials", path: "/handicrafter/tutorials" },
    { icon: "⬆", label: "Upload Tutorial", path: "/handicrafter/upload" },
    { icon: "💬", label: "Q&A / Comments", path: "/handicrafter/qa" },
    { icon: "👤", label: "Profile", path: "/handicrafter/profile" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">🎨 CraftGenius</h2>

      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} onClick={() => navigate(item.path)}>
              {item.icon} {item.label}
            </li>
          ))}
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #0f766e, #115e59);
          color: #fff;
          padding: 30px 20px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .logo {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 40px;
          text-align: center;
          cursor: pointer;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar li {
          padding: 12px 14px;
          margin-bottom: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
        }

        .sidebar li:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: translateX(5px);
        }

        .sidebar li:active {
          transform: scale(0.98);
        }

        .logout {
          margin-top: 40px;
          background: #dc2626;
          text-align: center;
        }

        .logout:hover {
          background: #b91c1c;
        }
      `}</style>
    </aside>
  );
}

export default HandicrafterSidebar;