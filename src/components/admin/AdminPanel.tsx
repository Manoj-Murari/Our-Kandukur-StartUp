import React, { useState, useEffect } from 'react'
import { Shield, Users, Settings, X, Eye, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { User } from '../../types/auth'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, updateUserTag, updateUserRole } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers()
    }
  }, [isOpen, isAdmin])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTag = async (userId: string, newTag: string) => {
    try {
      await updateUserTag(userId, newTag)
      await fetchUsers() // Refresh the list
      alert('User tag updated successfully!')
    } catch (error) {
      alert('Error updating user tag')
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      await fetchUsers() // Refresh the list
      alert('User role updated successfully!')
    } catch (error) {
      alert('Error updating user role')
    }
  }

  const getTagColor = (tag: string) => {
    const colors = {
      user: 'bg-gray-100 text-gray-800',
      student: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
      founder: 'bg-purple-100 text-purple-800',
      teacher: 'bg-green-100 text-green-800',
      mentor: 'bg-orange-100 text-orange-800',
      vip: 'bg-yellow-100 text-yellow-800',
      manager: 'bg-indigo-100 text-indigo-800'
    }
    return colors[tag as keyof typeof colors] || colors.user
  }

  if (!isOpen || !isAdmin) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Users List */}
          <div className="w-2/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                All Users ({users.length})
              </h3>
            </div>
            
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedUser?.id === u.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                      }`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <span className="text-white text-sm font-medium">
                                {u.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{u.name}</h4>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(u.tag)}`}>
                            {u.tag}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(u.role)}`}>
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="w-1/3">
            {selectedUser ? (
              <div className="p-6 h-full overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-medium">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>

                <div className="space-y-6">
                  {/* Tag Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Tag</label>
                    <select
                      value={selectedUser.tag}
                      onChange={(e) => handleUpdateTag(selectedUser.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="user">User</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="founder">Founder</option>
                      <option value="teacher">Teacher</option>
                      <option value="mentor">Mentor</option>
                      <option value="vip">VIP</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  {/* Role Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="founder">Founder</option>
                      <option value="teacher">Teacher</option>
                      <option value="mentor">Mentor</option>
                      <option value="vip">VIP</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  {/* User Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Student:</span>
                        <span className={selectedUser.is_student ? 'text-green-600' : 'text-gray-600'}>
                          {selectedUser.is_student ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Joined:</span>
                        <span className="text-gray-600">
                          {new Date(selectedUser.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedUser.last_login && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Login:</span>
                          <span className="text-gray-600">
                            {new Date(selectedUser.last_login).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Details */}
                  {selectedUser.academic_details && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Academic Details</h4>
                      <div className="space-y-2 text-sm">
                        {selectedUser.academic_details.institution && (
                          <div>
                            <span className="text-gray-500">Institution:</span>
                            <p className="text-gray-700">{selectedUser.academic_details.institution}</p>
                          </div>
                        )}
                        {selectedUser.academic_details.course && (
                          <div>
                            <span className="text-gray-500">Course:</span>
                            <p className="text-gray-700">{selectedUser.academic_details.course}</p>
                          </div>
                        )}
                        {selectedUser.academic_details.skills && selectedUser.academic_details.skills.length > 0 && (
                          <div>
                            <span className="text-gray-500">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedUser.academic_details.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Personal Info */}
                  {selectedUser.personal_info && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        {selectedUser.personal_info.phone && (
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="text-gray-700">{selectedUser.personal_info.phone}</p>
                          </div>
                        )}
                        {selectedUser.personal_info.linkedin && (
                          <div>
                            <span className="text-gray-500">LinkedIn:</span>
                            <a href={selectedUser.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel