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
}

export const useOpportunities = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const opportunitiesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // We ensure all fields exist, providing default values if they don't
                return {
                    id: doc.id,
                    title: data.title || 'No Title',
                    description: data.description || 'No Description',
                    link: data.link || '#',
                    category: data.category || 'general',
                    // The page uses 'type', so we map 'category' to 'type'
                    type: data.category || 'general', 
                    company: data.company || 'Not Specified',
                    location: data.location || 'Remote',
                    deadline: data.deadline || new Date().toISOString(),
                    stipend: data.stipend || 'Not Disclosed',
                    status: data.status || 'open',
                    // Ensure requirements is an array
                    requirements: Array.isArray(data.requirements) ? data.requirements : [],
                } as Opportunity
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

    // Add the 'refetch' function that the component needs
    return { opportunities, loading, error, refetch: fetchOpportunities };
};