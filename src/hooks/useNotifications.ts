import { useState, useEffect, useCallback } from 'react';
// FIXED: Added 'where' to the import to allow for filtering
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Notification {
    id: string;
    title: string;
    type: 'new_opportunity';
    createdAt: { seconds: number; nanoseconds: number; };
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // FIXED: Calculate the timestamp for 12 hours ago
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

            // Get notifications from the last 12 hours, ordered by most recent
            const q = query(
                collection(db, 'notifications'), 
                where('createdAt', '>', twelveHoursAgo), // This is the new condition
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(notificationsData);
        } catch (err) {
            console.error("Error fetching notifications: ", err);
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return { notifications, loading, error };
};
