import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// This interface now matches ALL the fields the page component needs
export interface Opportunity {
    id: string;
    title: string;
    description: string;
    link: string;
    category: string; // The original component calls this 'type'
    type: string;
    company: string;
    location: string;
    deadline: string;
    stipend: string;
    status: 'open' | 'closed';
    requirements: string[];
    // We need createdAt to sort by date
    createdAt: { seconds: number; nanoseconds: number; };
}

export const useOpportunities = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // We still fetch ordered by date from Firestore initially
            const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            let opportunitiesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // We ensure all fields exist, providing default values if they don't
                return {
                    id: doc.id,
                    title: data.title || 'No Title',
                    description: data.description || 'No Description',
                    link: data.link || '#',
                    category: data.category || 'general',
                    type: data.category || 'general', 
                    company: data.company || 'Not Specified',
                    location: data.location || 'Remote',
                    deadline: data.deadline || new Date().toISOString(),
                    stipend: data.stipend || 'Not Disclosed',
                    status: data.status || 'open',
                    requirements: Array.isArray(data.requirements) ? data.requirements : [],
                    createdAt: data.createdAt, // Make sure to get the timestamp
                } as Opportunity
            });

            // --- NEW SORTING LOGIC ---
            opportunitiesData.sort((a, b) => {
                const today = new Date();
                today.setHours(0,0,0,0);

                const isAClosed = new Date(a.deadline) < today || a.status === 'closed';
                const isBClosed = new Date(b.deadline) < today || b.status === 'closed';

                // If one is open and the other is closed, the open one comes first
                if (!isAClosed && isBClosed) return -1; // a comes first
                if (isAClosed && !isBClosed) return 1;  // b comes first

                // If both have the same status, sort by creation date (newest first)
                // The original fetch already did this, but we re-sort to be safe.
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            setOpportunities(opportunitiesData);
        } catch (err) {
            console.error("Error fetching opportunities: ", err);
            setError('Failed to load opportunities.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    return { opportunities, loading, error, refetch: fetchOpportunities };
};
