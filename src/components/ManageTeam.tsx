import React, { useState } from 'react';
import { useTeamMembers, TeamMember } from '../hooks/useTeamMembers';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, UserPlus, Edit, X } from 'lucide-react';

const teamRoles = [
    "Founder", "Mentors", "Research & Development Team", "Event Management Team",
    "Social Media Marketing Team", "GFX / VFX Team", "Content Writing Team", "General Core Team"
];

const TeamMemberForm: React.FC<{
    initialData?: Partial<TeamMember>;
    onSubmit: (data: Omit<TeamMember, 'id' | 'createdAt'>, imageFile: File | null) => Promise<void>;
    onClose?: () => void;
    isSubmitting: boolean;
}> = ({ initialData = {}, onSubmit, onClose, isSubmitting }) => {
    // UPDATED: State now includes all new fields
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        title: initialData.title || '',
        role: initialData.role || 'Mentors',
        bio: initialData.bio || '',
        location: initialData.location || '',
        email: initialData.email || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        githubUrl: initialData.githubUrl || '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // We need to construct the data object without the `id` and `createdAt` fields
        const dataToSubmit: Omit<TeamMember, 'id' | 'createdAt' | 'imageUrl'> = { ...formData };
        onSubmit(dataToSubmit as any, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="name" className="block text-sm font-medium">Full Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
                <div><label htmlFor="title" className="block text-sm font-medium">Title (e.g., Founder & CEO)</label><input type="text" id="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
                <div><label htmlFor="role" className="block text-sm font-medium">Team / Group</label><select id="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border rounded-md">{teamRoles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                <div><label htmlFor="location" className="block text-sm font-medium">Location (e.g., Seattle, WA)</label><input type="text" id="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
            </div>
            <div><label htmlFor="email" className="block text-sm font-medium">Email Address</label><input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
            <div><label htmlFor="bio" className="block text-sm font-medium">Short Bio / Description</label><textarea id="bio" value={formData.bio} onChange={handleChange} required rows={3} className="w-full p-2 border rounded-md"></textarea></div>
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-md font-semibold px-2">Social Links (Optional)</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label htmlFor="linkedinUrl" className="block text-sm font-medium">LinkedIn URL</label><input type="url" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="twitterUrl" className="block text-sm font-medium">Twitter URL</label><input type="url" id="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="githubUrl" className="block text-sm font-medium">GitHub URL</label><input type="url" id="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                </div>
            </fieldset>

            <div><label htmlFor="imageFile" className="block text-sm font-medium">Profile Picture</label><input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            
            <div className="flex justify-end space-x-4 pt-4">
                {onClose && <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>}
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                    {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
            </div>
        </form>
    );
};


const ManageTeam: React.FC = () => {
    const { teamMembers, loading, error, refetch } = useTeamMembers();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const uploadImage = async (imageFile: File): Promise<string> => {
        const formData = new FormData();
        formData.append('teamImage', imageFile);
        const uploadResponse = await fetch('https://ourkandukur.com/upload.php', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== 'success') {
            throw new Error(uploadResult.message || 'Image upload failed.');
        }
        return uploadResult.url;
    };

    const handleAddSubmit = async (data: Omit<TeamMember, 'id' | 'createdAt' | 'imageUrl'>, imageFile: File | null) => {
        setIsSubmitting(true);
        setMessage('');
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            } else {
                imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`;
            }
            // UPDATED: Submitting the new data structure
            await addDoc(collection(db, "teamMembers"), { ...data, imageUrl, createdAt: serverTimestamp() });
            setMessage('✅ Success! Team member added.');
            refetch();
        } catch (err: any) {
            setMessage(`❌ Error! ${err.message}`);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleEditSubmit = async (data: Omit<TeamMember, 'id' | 'createdAt' | 'imageUrl'>, imageFile: File | null) => {
        if (!editingMember) return;
        setIsSubmitting(true);
        try {
            let imageUrl = editingMember.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            const memberRef = doc(db, "teamMembers", editingMember.id);
            // UPDATED: Updating with the new data structure
            await updateDoc(memberRef, { ...data, imageUrl });
            alert('Team member updated successfully!');
            setEditingMember(null);
            refetch();
        } catch (err: any) {
            alert(`Failed to update team member: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            try {
                await deleteDoc(doc(db, "teamMembers", id));
                alert('Team member deleted successfully.');
                refetch();
            } catch (error) {
                alert('Failed to delete team member.');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center"><UserPlus className="mr-3"/>Add a New Team Member</h2>
                {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                <TeamMemberForm onSubmit={handleAddSubmit} isSubmitting={isSubmitting} />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Team</h2>
                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div> : (
                    <div className="space-y-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center">
                                    <img src={member.imageUrl} alt={member.name} className="h-12 w-12 rounded-full mr-4 object-cover"/>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setEditingMember(member)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"><Edit className="h-5 w-5"/></button>
                                    <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><Trash2 className="h-5 w-5"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {error && <p className="text-red-500 mt-4">Error loading team members.</p>}
            </div>

            {editingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit Team Member</h2>
                            <button onClick={() => setEditingMember(null)} className="p-2 rounded-full hover:bg-gray-200"><X/></button>
                        </div>
                        <TeamMemberForm 
                            initialData={editingMember}
                            onSubmit={handleEditSubmit}
                            onClose={() => setEditingMember(null)}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTeam;
