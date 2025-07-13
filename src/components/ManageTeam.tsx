import React, { useState } from 'react';
import { useTeamMembers, TeamMember } from '../hooks/useTeamMembers';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, UserPlus, Edit, X } from 'lucide-react';

// Reusable form for both adding and editing team members
const TeamMemberForm: React.FC<{
    initialData?: Partial<TeamMember>;
    onSubmit: (data: Omit<TeamMember, 'id' | 'createdAt'>, imageFile: File | null) => Promise<void>;
    onClose?: () => void;
    isSubmitting: boolean;
}> = ({ initialData = {}, onSubmit, onClose, isSubmitting }) => {
    const [name, setName] = useState(initialData.name || '');
    const [role, setRole] = useState(initialData.role || 'Mentor');
    const [socialLink, setSocialLink] = useState(initialData.socialLink || '');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { name, role, socialLink };
        onSubmit(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="name" className="block text-sm font-medium">Full Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-md"/></div>
                <div><label htmlFor="role" className="block text-sm font-medium">Role</label><select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full p-2 border rounded-md"><option value="Founder">Founder</option><option value="Technical Support Team">Technical Support Team</option><option value="Content Creator Team">Content Creator Team</option><option value="Broadcasting Team">Broadcasting Team</option><option value="Mentor">Mentor</option><option value="Social Media Marketing Team">Social Media Marketing Team</option></select></div>
            </div>
            <div><label htmlFor="imageFile" className="block text-sm font-medium">Profile Picture (Optional)</label><input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label htmlFor="socialLink" className="block text-sm font-medium">Social Media Link</label><input type="url" id="socialLink" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} required placeholder="https://linkedin.com/in/username" className="w-full p-2 border rounded-md"/></div>
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

  const handleAddSubmit = async (data: Omit<TeamMember, 'id' | 'createdAt'>, imageFile: File | null) => {
    setIsSubmitting(true);
    setMessage('');
    try {
        let imageUrl = '';
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        } else {
            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`;
        }
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

  const handleEditSubmit = async (data: Omit<TeamMember, 'id' | 'createdAt'>, imageFile: File | null) => {
    if (!editingMember) return;
    setIsSubmitting(true);
    try {
        let imageUrl = editingMember.imageUrl;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        const memberRef = doc(db, "teamMembers", editingMember.id);
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
    if (window.confirm('Are you sure you want to delete this team member?')) {
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
        {loading ? <Loader2 className="animate-spin"/> : (
            <div className="space-y-4">
                {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center"><img src={member.imageUrl} alt={member.name} className="h-12 w-12 rounded-full mr-4 object-cover"/><div><p className="font-semibold">{member.name}</p><p className="text-sm text-gray-500">{member.role}</p></div></div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setEditingMember(member)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"><Edit className="h-5 w-5"/></button>
                            <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><Trash2 className="h-5 w-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
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
