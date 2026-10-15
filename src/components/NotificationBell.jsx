import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const loadNotifications = useCallback(async () => {
        try {
            const response = await Api.get('notifications/');
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unread_count || 0);
            setError('');
        } catch {
            setError('Notifications could not be loaded.');
        }
    }, []);

    useEffect(() => {
        loadNotifications();
        const intervalId = window.setInterval(loadNotifications, 60000);
        return () => window.clearInterval(intervalId);
    }, [loadNotifications]);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const markAllRead = async () => {
        try {
            await Api.patch('notifications/read-all/');
            setNotifications(current => current.map(item => ({ ...item, is_read: true })));
            setUnreadCount(0);
            setError('');
        } catch {
            setError('Notifications could not be marked as read.');
        }
    };

    const openNotification = async (notification) => {
        if (!notification.is_read) {
            try {
                await Api.patch(`notifications/${notification.id}/read/`);
                setNotifications(current => current.map(item => (
                    item.id === notification.id ? { ...item, is_read: true } : item
                )));
                setUnreadCount(count => Math.max(0, count - 1));
                setError('');
            } catch {
                setError('Notification could not be marked as read.');
                return;
            }
        }
        setIsOpen(false);
        if (notification.url) navigate(notification.url);
    };

    const getDisplayTitle = (notification) => {
        if (!notification) return '';
        const title = notification.title || '';
        const message = notification.message || '';

        if (/^order\s*#\d+/i.test(title)) {
            let productName = '';
            const matchFor = message.match(/order for\s+(?:the\s+)?(.+?)\s+(?:is now|has been|was|is)\b/i);
            const matchOf = message.match(/order of\s+(?:the\s+)?(.+?)(?:\.|$)/i);
            const matchQty = message.match(/Order\s*#\d+:\s*(?:\d+\s*x\s*)?(.+?)(?:\.|$)/i);

            if (matchFor && matchFor[1]) {
                productName = matchFor[1].trim();
            } else if (matchOf && matchOf[1]) {
                productName = matchOf[1].trim();
            } else if (matchQty && matchQty[1]) {
                productName = matchQty[1].trim();
            }

            const actionMatch = title.match(/^order\s*#\d+\s*(.*)$/i);
            const action = actionMatch && actionMatch[1] ? actionMatch[1].trim() : '';

            if (productName) {
                return action ? `${productName} ${action}` : productName;
            }

            if (action) {
                return action.charAt(0).toUpperCase() + action.slice(1);
            }
        }

        return title;
    };

    const getDisplayMessage = (notification) => {
        if (!notification?.message) return '';
        return notification.message.replace(/^Order\s*#\d+:\s*/i, '');
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(open => !open)}
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={isOpen}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8A6A55] px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <section className="absolute right-0 top-12 z-[100] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
                            <p className="text-xs text-gray-500">{unreadCount} unread</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-xs font-semibold text-[#8A6A55] hover:text-[#6B5140]"
                            >
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    {error && <p role="alert" className="px-4 py-3 text-xs text-red-600">{error}</p>}

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 && !error ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-500">You have no notifications yet.</p>
                        ) : notifications.map(notification => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => openNotification(notification)}
                                className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-[#F8F5F2] ${
                                    notification.is_read ? 'bg-white' : 'bg-[#FBF8F5]'
                                }`}
                            >
                                <span className="flex items-start gap-2">
                                    {!notification.is_read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#8A6A55]" />}
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold text-gray-900">{getDisplayTitle(notification)}</span>
                                        <span className="mt-1 block text-xs leading-relaxed text-gray-600">{getDisplayMessage(notification)}</span>
                                        <time className="mt-1 block text-[11px] text-gray-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </time>
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default NotificationBell;
