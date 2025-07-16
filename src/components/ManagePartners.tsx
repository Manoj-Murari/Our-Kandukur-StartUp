import React, { useState } from 'react';
import { usePartners, Partner } from '../hooks/usePartners';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, Building2 } from 'lucide-react';

// List of partner categories as per client requirements
const partnerCategories = [
    "Community Partners",
    "Education Partners",
    "Media Partners",
    "Outreach & Influencer Partners",
    "Corporate & Sponsorship Partners",
    "Government & Institutional Partners"
];

const ManagePartners: React.FC = () => {
    const { partners, loading, error, refetch } = usePartners();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    
    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState(partnerCategories[0]);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const uploadImage = async (imageFile: File): Promise<string> => {
        const formData = new FormData();
        // UPDATED: Changed 'partnerLogo' to 'teamImage' to match the server's expected key
        formData.append('teamImage', imageFile); 
        
        const uploadResponse = await fetch('https://ourkandukur.com/upload.php', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== 'success') {
            throw new Error(uploadResult.message || 'Logo upload failed.');
        }
        return uploadResult.url;
    };

    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logoFile) {
            setMessage('❌ Please select a logo to upload.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        try {
            const logoUrl = await uploadImage(logoFile);
            await addDoc(collection(db, "partners"), { 
                name, 
                category, 
                logoUrl, 
                createdAt: serverTimestamp() 
            });
            setMessage('✅ Success! Partner added.');
            // Reset form
            setName('');
            setCategory(partnerCategories[0]);
            setLogoFile(null);
            // Clear the file input visually
            const fileInput = document.getElementById('logoFile') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

            refetch();
        } catch (err: any) {
            setMessage(`❌ Error! ${err.message}`);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            try {
                await deleteDoc(doc(db, "partners", id));
                alert('Partner deleted successfully.');
                refetch();
            } catch (error) {
                alert('Failed to delete partner.');
            }
        }
    };

    // Group partners by category for display
    const groupedPartners = partners.reduce((acc, partner) => {
        (acc[partner.category] = acc[partner.category] || []).push(partner);
        return acc;
    }, {} as Record<string, Partner[]>);

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center"><Building2 className="mr-3"/>Add a New Partner</h2>
                {message && <p className="text-sm text-center font-semibold mb-4">{message}</p>}
                <form onSubmit={handleAddPartner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Partner/Company Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium">Category</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded-md">
                                {partnerCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="logoFile" className="block text-sm font-medium">Partner Logo</label>
                        <input type="file" id="logoFile" onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} required accept="image/*" className="w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                            {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                            {isSubmitting ? 'Saving...' : 'Save Partner'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Partners</h2>
                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div> : (
                    <div className="space-y-6">
                        {partnerCategories.map(category => (
                            groupedPartners[category] && (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">{category}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {groupedPartners[category].map(partner => (
                                            <div key={partner.id} className="relative group p-2 border rounded-md text-center">
                                                <img src={partner.logoUrl} alt={partner.name} className="h-20 w-full object-contain mb-2"/>
                                                <p className="text-xs font-medium truncate">{partner.name}</p>
                                                <button 
                                                    onClick={() => handleDelete(partner.id)} 
                                                    className="absolute top-0 right-0 m-1 p-1 bg-white rounded-full text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Delete partner"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default ManagePartners;
