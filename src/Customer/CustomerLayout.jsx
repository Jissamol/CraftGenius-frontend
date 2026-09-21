import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import HomeNavbar from './HomeComponents/HomeNavbar';
import ChatAssistant from './ChatAssistant';
import Api from '../services/Api';

function CustomerLayout() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        Api.get('cart/').then(res => {
            setCartCount(res.data.total_items || 0);
        }).catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans">
            {/* Shared top navbar used across all customer pages */}
            <div className="sticky top-0 z-50 bg-[#FDFDFD]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <div className="max-w-[1440px] mx-auto">
                <HomeNavbar cartCount={cartCount} />
                </div>
            </div>

            {/* Page content */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <Outlet />
            </div>

            {/* Global Chat Assistant Widget */}
            <ChatAssistant />
        </div>
    );
}

export default CustomerLayout;
