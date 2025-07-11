import { useState } from 'react';

// Dummy hook to prevent a crash
export const useVisitorCount = () => {
  const [count] = useState(0);
  return { count, loading: false };
};