import React, { useState } from 'react'
import { X, User, Shield, Chrome, Facebook } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user')
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  if (!isOpen) return null

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      })
    } catch (error) {
      console.error('Social login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminCredentials.email,
        password: adminCredentials.password
      })
      if (error) throw error
      onClose()
    } catch (error) {
      console.error('Admin login error:', error)
      alert('Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 card-3d">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Login Type Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginType('user')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
              loginType === 'user'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            User Login
          </button>
          <button
            onClick={() => setLoginType('admin')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
              loginType === 'admin'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Login
          </button>
        </div>

        {loginType === 'user' ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">
              Sign in with your social account to join our community
            </p>
            
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Chrome className="h-5 w-5 mr-3 text-red-500" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Facebook className="h-5 w-5 mr-3 text-blue-600" />
              Continue with Facebook
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={adminCredentials.email}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@ourkandukur.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginModal