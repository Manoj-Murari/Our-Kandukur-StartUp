import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    category: string;
    createdAt: { seconds: number; nanoseconds: number; };
}

export const usePartners = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPartners = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'partners'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const partnersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Partner));
            setPartners(partnersData);
        } catch (err) {
            console.error("Error fetching partners: ", err);
            setError('Failed to load partners.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    return { partners, loading, error, refetch: fetchPartners };
};
