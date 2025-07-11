import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../contexts/AuthContext'; // Reuse the UserProfile definition

export const useJobSeekers = () => {
    const [jobSeekers, setJobSeekers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobSeekers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Create a query to get all documents from the 'users' collection
            // where the 'role' field is exactly 'jobseeker'
            const q = query(collection(db, 'users'), where('role', '==', 'jobseeker'));
            const querySnapshot = await getDocs(q);
            
            const jobSeekersData = querySnapshot.docs.map(doc => doc.data() as UserProfile);

            setJobSeekers(jobSeekersData);
        } catch (err) {
            console.error("Error fetching job seekers: ", err);
            setError('Failed to load job seeker profiles.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobSeekers();
    }, [fetchJobSeekers]);

    return { jobSeekers, loading, error, refetch: fetchJobSeekers };
};
