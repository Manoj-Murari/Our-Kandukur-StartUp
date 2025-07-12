import React, { useState } from 'react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, UserPlus } from 'lucide-react';

const ManageTeam: React.FC = () => {
  const { teamMembers, loading, refetch } = useTeamMembers();
  const [formData, setFormData] = useState({ name: '', role: 'Mentor', imageUrl: '', socialLink: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    let finalImageUrl = formData.imageUrl;
    if (!finalImageUrl) {
        finalImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`;
    }

    try {
      await addDoc(collection(db, "teamMembers"), {
        name: formData.name,
        role: formData.role,
        imageUrl: finalImageUrl,
        socialLink: formData.socialLink,
        createdAt: serverTimestamp()
      });
      setMessage('✅ Success! Team member added.');
      setFormData({ name: '', role: 'Mentor', imageUrl: '', socialLink: '' }); // Reset form
      refetch(); // Refresh the list of team members
    } catch (error) {
      console.error("Error adding team member: ", error);
      setMessage('❌ Error! Could not add team member.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
        try {
            await deleteDoc(doc(db, "teamMembers", id));
            alert('Team member deleted successfully.');
            refetch(); // Refresh the list
        } catch (error) {
            console.error("Error deleting team member: ", error);
            alert('Failed to delete team member.');
        }
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Team Member Form */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center"><UserPlus className="mr-3"/>Add a New Team Member</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                <div><label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label><select id="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"><option value="Founder">Founder</option><option value="Technical Support Team">Technical Support Team</option><option value="Content Creator Team">Content Creator Team</option><option value="Broadcasting Team">Broadcasting Team</option><option value="Mentor">Mentor</option><option value="Social Media Marketing Team">Social Media Marketing Team</option></select></div>
            </div>
            <div className="mb-4"><label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label><input type="url" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.png" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div className="mb-4"><label htmlFor="socialLink" className="block text-sm font-medium text-gray-700 mb-1">Social Media Link</label><input type="url" id="socialLink" value={formData.socialLink} onChange={handleChange} required placeholder="https://linkedin.com/in/username" className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div className="flex items-center justify-end">
                {message && <p className="text-sm text-gray-600 mr-4">{message}</p>}
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
                    {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
            </div>
        </form>
      </div>

      {/* Existing Team Members List */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Team</h2>
        {loading ? <Loader2 className="animate-spin"/> : (
            <div className="space-y-4">
                {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                            <img src={member.imageUrl} alt={member.name} className="h-12 w-12 rounded-full mr-4 object-cover"/>
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                            <Trash2 className="h-5 w-5"/>
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
