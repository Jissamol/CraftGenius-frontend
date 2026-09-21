import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusSquare, ShoppingCart,
  Star, IndianRupee, TrendingUp, User, LogOut, Palette, ChevronLeft, ChevronRight
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview',     path: '/handicrafter/dashboard' },
  { icon: Package,         label: 'My Products',  path: '/handicrafter/products' },
  { icon: PlusSquare,      label: 'Add Product',  path: '/handicrafter/add-product' },
  { icon: ShoppingCart,    label: 'Orders',       path: '/handicrafter/orders' },
  { icon: Star,            label: 'Reviews',      path: '/handicrafter/reviews' },
  { icon: IndianRupee,     label: 'Earnings',     path: '/handicrafter/earnings' },
  { icon: TrendingUp,      label: 'Analytics',    path: '/handicrafter/analytics' },
  { icon: User,            label: 'Profile',      path: '/handicrafter/profile' },
];

function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-gray-100 shadow-sm
        transition-all duration-300 ease-in-out
        h-screen sticky top-0 z-50
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        ${/* Mobile: off-canvas */ ''}
        lg:relative lg:translate-x-0
        ${mobileOpen ? 'fixed left-0 top-0 translate-x-0' : 'fixed -translate-x-full lg:translate-x-0 lg:static'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-gray-100 h-16 px-4 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          onClick={() => navigate('/handicrafter/dashboard')}
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1F1F1F] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Palette size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-gray-900 text-base truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
              CraftGenius
            </span>
          )}
        </button>

        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="hidden lg:flex mx-auto mt-2 w-7 h-7 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
        )}
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNav(item.path)}
                  title={collapsed ? item.label : ''}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200 group
                    ${collapsed ? 'justify-center' : ''}
                    ${active
                      ? 'bg-[#8A6A55] text-white shadow-md shadow-[#8A6A55]/20'
                      : 'text-gray-500 hover:bg-[#F3ECE6] hover:text-[#6B5140]'
                    }
                  `}
                >
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {/* Active indicator dot when collapsed */}
                  {collapsed && active && (
                    <span className="absolute right-1 w-1.5 h-1.5 bg-[#C9B49A] rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
