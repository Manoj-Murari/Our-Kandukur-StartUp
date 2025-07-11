import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: { seconds: number; nanoseconds: number; };
}

export const useMessages = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const messagesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'N/A',
                    email: data.email || 'N/A',
                    message: data.message || 'No message content.',
                    createdAt: data.createdAt,
                } as ContactMessage;
            });

            setMessages(messagesData);
        } catch (err) {
            console.error("Error fetching messages: ", err);
            setError('Failed to load messages.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return { messages, loading, error, refetch: fetchMessages };
};
