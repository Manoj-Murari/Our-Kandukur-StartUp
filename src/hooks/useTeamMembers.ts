import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Define the structure of a Team Member object
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    socialLink: string;
}

export const useTeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeamMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'teamMembers'), orderBy('createdAt', 'asc'));
            const querySnapshot = await getDocs(q);
            
            const membersData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'No Name',
                    role: data.role || 'No Role',
                    imageUrl: data.imageUrl || '',
                    socialLink: data.socialLink || '#',
                } as TeamMember;
            });

            setTeamMembers(membersData);
        } catch (err) {
            console.error("Error fetching team members: ", err);
            setError('Failed to load team members.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    return { teamMembers, loading, error, refetch: fetchTeamMembers };
};
