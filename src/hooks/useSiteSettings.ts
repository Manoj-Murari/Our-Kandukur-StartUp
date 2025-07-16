import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
    whatsappChannelUrl?: string;
    whatsappCommunityUrl?: string;
    // NEW: Added fields for social media links
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
}

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, 'settings', 'links');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SiteSettings);
            } else {
                setSettings({
                    whatsappChannelUrl: '',
                    whatsappCommunityUrl: '',
                    facebookUrl: '',
                    instagramUrl: '',
                    linkedinUrl: '',
                    youtubeUrl: '',
                });
            }
        } catch (err) {
            console.error("Error fetching site settings: ", err);
            setError('Failed to load site settings.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, loading, error, refetch: fetchSettings };
};
