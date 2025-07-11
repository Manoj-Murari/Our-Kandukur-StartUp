import React, { useState } from 'react'
import { User, Edit, Save, X, Upload, GraduationCap, Briefcase } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { AcademicDetails, PersonalInfo } from '../../types/auth'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'academic'>('personal')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    is_student: user?.is_student || false,
    personal_info: user?.personal_info || {} as PersonalInfo,
    academic_details: user?.academic_details || {} as AcademicDetails
  })

  if (!isOpen || !user) return null

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name,
          is_student: formData.is_student,
          personal_info: formData.personal_info,
          academic_details: formData.academic_details,
          tag: formData.is_student ? 'student' : 'user'
        })
        .eq('id', user.id)

      if (error) throw error
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(user.tag)}`}>
                    {user.tag.charAt(0).toUpperCase() + user.tag.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">{user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'personal'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="h-5 w-5 inline mr-2" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'academic'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="h-5 w-5 inline mr-2" />
            Academic Details
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.personal_info.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal_info: { ...formData.personal_info, phone: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.personal_info.address || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    personal_info: { ...formData.personal_info, address: e.target.value }
                  })}
                  disabled={!editing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.personal_info.linkedin || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal_info: { ...formData.personal_info, linkedin: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={formData.personal_info.github || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal_info: { ...formData.personal_info, github: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_student"
                  checked={formData.is_student}
                  onChange={(e) => setFormData({ ...formData, is_student: e.target.checked })}
                  disabled={!editing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_student" className="ml-2 block text-sm text-gray-900">
                  I am a student (This will change your tag to "Student")
                </label>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input
                    type="text"
                    value={formData.academic_details.institution || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      academic_details: { ...formData.academic_details, institution: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    value={formData.academic_details.course || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      academic_details: { ...formData.academic_details, course: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    value={formData.academic_details.year || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      academic_details: { ...formData.academic_details, year: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                  <input
                    type="text"
                    value={formData.academic_details.cgpa || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      academic_details: { ...formData.academic_details, cgpa: e.target.value }
                    })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.academic_details.skills?.join(', ') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    academic_details: {
                      ...formData.academic_details,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }
                  })}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="React, Node.js, Python, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (comma-separated)</label>
                <input
                  type="text"
                  value={formData.academic_details.certifications?.join(', ') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    academic_details: {
                      ...formData.academic_details,
                      certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }
                  })}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="AWS Certified, Google Analytics, etc."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile