import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
    createdAt: { seconds: number; nanoseconds: number; };
}

export const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const testimonialsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Anonymous',
                    role: data.role || 'Community Member',
                    image: data.image || '',
                    content: data.content || '',
                    rating: data.rating || 5,
                    createdAt: data.createdAt,
                } as Testimonial;
            });
            setTestimonials(testimonialsData);
        } catch (err) {
            console.error("Error fetching testimonials: ", err);
            setError('Failed to load testimonials.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    return { testimonials, loading, error, refetch: fetchTestimonials };
};
