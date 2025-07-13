import React, { useState } from 'react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, UserPlus } from 'lucide-react';

const ManageTeam: React.FC = () => {
  const { teamMembers, loading, refetch } = useTeamMembers();
  
  // State for the form, including the file
  const [name, setName] = useState('');
  const [role, setRole] = useState('Mentor');
  const [socialLink, setSocialLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !socialLink) {
        setMessage('Please fill out all fields.');
        return;
    }
    setIsSubmitting(true);
    setMessage('');
    let imageUrl = '';

    try {
        // Step 1: Handle the image upload to your PHP script
        if (imageFile) {
            const formData = new FormData();
            formData.append('teamImage', imageFile);

            // IMPORTANT: This URL points to the PHP script on your live server
            const uploadResponse = await fetch('https://ourkandukur.com/upload.php', {
                method: 'POST',
                body: formData
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.status !== 'success') {
                throw new Error(uploadResult.message || 'Image upload failed.');
            }
            imageUrl = uploadResult.url;
        } else {
            // If no image is selected, generate a default one
            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
        }

        // Step 2: Save the data (including the new image URL) to Firestore
        await addDoc(collection(db, "teamMembers"), {
            name,
            role,
            socialLink,
            imageUrl,
            createdAt: serverTimestamp()
        });

        setMessage('✅ Success! Team member added.');
        // Reset form fields
        setName('');
        setRole('Mentor');
        setSocialLink('');
        setImageFile(null);
        // Clear the file input visually
        if (document.getElementById('imageFile') as HTMLInputElement) {
            (document.getElementById('imageFile') as HTMLInputElement).value = "";
        }
        refetch(); // Refresh the list of team members
    } catch (error: any) {
        console.error("Error adding team member: ", error);
        setMessage(`❌ Error! ${error.message}`);
    } finally {
        setIsSubmitting(false);
        setTimeout(() => setMessage(''), 5000);
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
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                <div><label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label><select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"><option value="Founder">Founder</option><option value="Technical Support Team">Technical Support Team</option><option value="Content Creator Team">Content Creator Team</option><option value="Broadcasting Team">Broadcasting Team</option><option value="Mentor">Mentor</option><option value="Social Media Marketing Team">Social Media Marketing Team</option></select></div>
            </div>
            <div className="mb-4"><label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label><input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div className="mb-4"><label htmlFor="socialLink" className="block text-sm font-medium text-gray-700 mb-1">Social Media Link</label><input type="url" id="socialLink" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} required placeholder="https://linkedin.com/in/username" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div className="flex items-center justify-end">
                {message && <p className="text-sm text-gray-600 mr-4">{message}</p>}
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
                    {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
            </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Team</h2>
        {loading ? <Loader2 className="animate-spin"/> : (
            <div className="space-y-4">
                {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center"><img src={member.imageUrl} alt={member.name} className="h-12 w-12 rounded-full mr-4 object-cover"/><div><p className="font-semibold">{member.name}</p><p className="text-sm text-gray-500">{member.role}</p></div></div>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><Trash2 className="h-5 w-5"/></button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
