import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// UPDATED: The interface now includes all the new fields for filtering and featuring.
export interface Opportunity {
    id: string;
    title: string;
    description: string;
    link: string;
    category: string;
    type: string;
    company: string;
    location: string;
    deadline: string;
    stipend: string;
    status: 'open' | 'closed';
    requirements: string[];
    createdAt: { seconds: number; nanoseconds: number; };
    // NEW FIELDS:
    isFeatured: boolean;
    workLocation: 'On-site' | 'Remote' | 'Hybrid';
    stipendValue: number; // For numeric sorting/filtering
}

export const useOpportunities = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // We still fetch ordered by date initially, as it's a good baseline.
            const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            let opportunitiesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // UPDATED: Mapping now includes the new fields with default values.
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
                    createdAt: data.createdAt,
                    isFeatured: data.isFeatured || false,
                    workLocation: data.workLocation || 'On-site',
                    stipendValue: data.stipendValue || 0,
                } as Opportunity
            });

            // --- NEW ADVANCED SORTING LOGIC ---
            opportunitiesData.sort((a, b) => {
                // 1. Featured items come first
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;

                // 2. Open items come before closed items
                const today = new Date();
                today.setHours(0,0,0,0);
                const isAClosed = new Date(a.deadline) < today || a.status === 'closed';
                const isBClosed = new Date(b.deadline) < today || b.status === 'closed';
                if (!isAClosed && isBClosed) return -1;
                if (isAClosed && !isBClosed) return 1;

                // 3. For items with the same status, sort by newest first
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
