import { useState } from 'react';

// Dummy hook to prevent a crash
export const useAnnouncements = () => {
  const [announcements] = useState([]);
  return { announcements, loading: false };
};