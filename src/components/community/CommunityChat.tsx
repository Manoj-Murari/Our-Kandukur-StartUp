import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Users, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Message } from '../../types/auth'

interface CommunityChatProps {
  isOpen: boolean
  onClose: () => void
}

const CommunityChat: React.FC<CommunityChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchMessages()
      subscribeToMessages()
      updateOnlineCount()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('community_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const updateOnlineCount = () => {
    // Simulate online users count
    setOnlineUsers(Math.floor(Math.random() * 50) + 10)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert([{
          user_id: user.id,
          user_name: user.name,
          user_tag: user.tag,
          content: newMessage.trim(),
          avatar_url: user.avatar_url
        }])

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Community Chat</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{onlineUsers} online</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                {message.avatar_url ? (
                  <img src={message.avatar_url} alt={message.user_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {message.user_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{message.user_name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(message.user_tag)}`}>
                    {message.user_tag}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {user ? (
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-4 border-t border-gray-200 text-center">
            <p className="text-gray-500">Please sign in to join the conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityChat