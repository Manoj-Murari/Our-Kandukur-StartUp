import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, AlertCircle, Search } from 'lucide-react';

const ManageUsers: React.FC = () => {
  const { users, loading, error, refetch } = useUsers();
  const { userProfile: adminProfile } = useAuth(); // Get the current admin's profile
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChange = async (userId: string, newRole: 'jobseeker' | 'recruiter' | 'admin') => {
    if (userId === adminProfile?.uid) {
        alert("For security, you cannot change your own role.");
        return;
    }
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
        alert('User role updated successfully!');
        refetch(); // Refresh the user list
    } catch (err) {
        console.error("Error updating user role:", err);
        alert("Failed to update user role.");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                <img src={user.photoURL} alt={user.name} className="h-12 w-12 rounded-full mr-4 object-cover"/>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value as any)}
                  disabled={user.uid === adminProfile?.uid} // Disable changing own role
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
  );
};

export default ManageUsers;
