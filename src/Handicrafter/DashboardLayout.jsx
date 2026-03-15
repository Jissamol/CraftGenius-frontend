import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

function DashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { darkMode } = useTheme();

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setMobileSidebarOpen(prev => !prev);
        } else {
            setSidebarCollapsed(prev => !prev);
        }
    };

    return (
        <div className={`flex h-screen overflow-hidden font-sans ${darkMode ? 'bg-gray-950' : 'bg-[#F8F9FC]'}`}>

            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onToggle={toggleSidebar}
                onMobileClose={() => setMobileSidebarOpen(false)}
            />

            {/* Main area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Navbar onMenuToggle={toggleSidebar} />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto px-6 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
