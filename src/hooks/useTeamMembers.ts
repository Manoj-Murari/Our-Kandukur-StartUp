import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// UPDATED: The Team Member object now includes all the new fields.
export interface TeamMember {
    id: string;
    name: string;
    title: string; // e.g., "Founder & CEO"
    role: string; // The group they belong to, e.g., "Founder"
    bio: string;
    location: string;
    email: string;
    imageUrl: string;
    linkedinUrl?: string; // Optional social links
    twitterUrl?: string;
    githubUrl?: string;
    createdAt: { seconds: number; nanoseconds: number; }; // Keep for ordering
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
            
            // UPDATED: The mapping now includes all the new fields with defaults.
            const membersData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'No Name',
                    title: data.title || 'Team Member',
                    role: data.role || 'General Core Team',
                    bio: data.bio || 'An essential member of the Our Kandukur team.',
                    location: data.location || 'Kandukur, AP',
                    email: data.email || '',
                    imageUrl: data.imageUrl || '',
                    linkedinUrl: data.linkedinUrl || '',
                    twitterUrl: data.twitterUrl || '',
                    githubUrl: data.githubUrl || '',
                    createdAt: data.createdAt,
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
