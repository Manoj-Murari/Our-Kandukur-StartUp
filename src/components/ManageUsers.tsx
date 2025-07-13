import React, { useState, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, AlertCircle, Search, Edit, X, Save } from 'lucide-react';

// Edit Form Modal Component
const EditUserForm: React.FC<{
    user: { uid: string; name: string; };
    onClose: () => void;
    onSave: () => void;
}> = ({ user, onClose, onSave }) => {
    const [newName, setNewName] = useState(user.name);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) {
            alert("Name cannot be empty.");
            return;
        }
        setIsSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { name: newName });
            alert('Username updated successfully!');
            onSave();
            onClose();
        } catch (err) {
            console.error("Error updating username:", err);
            alert("Failed to update username.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit User Name</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X/></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="username" value={newName} onChange={(e) => setNewName(e.target.value)} required className="w-full p-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                            {isSaving && <Loader2 className="animate-spin mr-2"/>}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ManageUsers: React.FC = () => {
  const { users, loading, error, refetch } = useUsers();
  const { userProfile: adminProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<{uid: string; name: string;} | null>(null);

  const handleRoleChange = async (userId: string, newRole: 'jobseeker' | 'recruiter' | 'admin') => {
    if (userId === adminProfile?.uid) {
        alert("For security, you cannot change your own role.");
        return;
    }
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
        alert('User role updated successfully!');
        refetch();
    } catch (err) {
        console.error("Error updating user role:", err);
        alert("Failed to update user role.");
    }
  };

  const filteredUsers = useMemo(() => {
      return users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [users, searchTerm]);

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage User Roles</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {error && <div className="text-red-600"><AlertCircle className="inline mr-2"/>{error}</div>}
        
        {!loading && !error && (
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user.uid} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center mb-2 sm:mb-0">
                  {/* FIXED: Added a fallback for the profile picture */}
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    alt={user.name} 
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* NEW: Edit Name Button */}
                    <button onClick={() => setEditingUser({ uid: user.uid, name: user.name })} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <Edit className="h-5 w-5"/>
                    </button>
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value as any)}
                        disabled={user.uid === adminProfile?.uid}
                        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    >
                        <option value="jobseeker">Job Seeker</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Edit Modal will appear here when a user is selected */}
      {editingUser && (
          <EditUserForm 
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={() => {
                refetch();
                setEditingUser(null);
            }}
          />
      )}
    </>
  );
};

export default ManageUsers;
