import { useState, useEffect, useCallback } from 'react';
import { getMatches } from '../api/matches';

export const useMatches = (filters = {}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMatches(filters);
      setMatches(res.data);
    } catch (err) {
      console.error('Error in useMatches hook:', err);
      setError(err.response?.data?.message || 'Failed to fetch match database records.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(async () => {
      try {
        const res = await getMatches(filters);
        setMatches(res.data);
      } catch (err) {
        console.error('Quiet polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refetchMatches: fetchMatches };
};
