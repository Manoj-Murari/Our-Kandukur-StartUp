import React, { useState } from 'react'
import { X, Megaphone, AlertCircle, Info, Star } from 'lucide-react'
import { useAnnouncements } from '../hooks/useAnnouncements'

const AnnouncementBanner: React.FC = () => {
  const { announcements, loading } = useAnnouncements()
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  if (loading || announcements.length === 0) return null

  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedIds.includes(announcement.id)
  )

  if (visibleAnnouncements.length === 0) return null

  const dismissAnnouncement = (id: number) => {
    setDismissedIds(prev => [...prev, id])
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertCircle
      case 'info': return Info
      case 'featured': return Star
      default: return Megaphone
    }
  }

  const getBgColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-orange-600'
      case 'low': return 'bg-blue-600'
      default: return 'bg-blue-600'
    }
  }

  return (
    <div className="space-y-2">
      {visibleAnnouncements.slice(0, 3).map((announcement) => {
        const Icon = getIcon(announcement.type)
        const bgColor = getBgColor(announcement.priority)
        
        return (
          <div key={announcement.id} className={`${bgColor} text-white px-4 py-3 relative`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">{announcement.title}</h4>
                  <p className="text-sm opacity-90">{announcement.content}</p>
                </div>
              </div>
              <button
                onClick={() => dismissAnnouncement(announcement.id)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AnnouncementBanner