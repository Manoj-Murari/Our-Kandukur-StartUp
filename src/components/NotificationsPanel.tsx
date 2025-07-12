import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Loader2, AlertCircle, Megaphone } from 'lucide-react';

const NotificationsPanel: React.FC = () => {
    const { notifications, loading, error } = useNotifications();

    const timeAgo = (seconds: number) => {
        const now = new Date();
        const past = new Date(seconds * 1000);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-xl border z-50">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {loading && <div className="p-4 text-center"><Loader2 className="animate-spin inline-block"/></div>}
                {error && <div className="p-4 text-center text-red-600"><AlertCircle className="inline-block mr-2"/>{error}</div>}
                {!loading && !error && notifications.length === 0 && <p className="p-4 text-sm text-gray-500">No new notifications.</p>}
                {!loading && !error && notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><Megaphone size={16}/></div>
                            <div>
                                <p className="text-sm text-gray-700">{notif.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt.seconds)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPanel;
