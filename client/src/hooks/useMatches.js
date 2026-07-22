import { useState, useEffect, useCallback } from 'react';
import { getMatches } from '../api/matches';
import { getCache, setCache } from '../utils/cache';

export const useMatches = (filters = {}) => {
  const cacheKey = `matches_${JSON.stringify(filters)}`;
  const cachedData = getCache(cacheKey);

  const [matches, setMatches] = useState(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await getMatches(filters);
      setMatches(res.data);
      setCache(cacheKey, res.data);
    } catch (err) {
      console.error('Error in useMatches hook:', err);
      setError(err.response?.data?.message || 'Failed to fetch match database records.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, JSON.stringify(filters)]);

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(async () => {
      try {
        const res = await getMatches(filters);
        setMatches(res.data);
        setCache(cacheKey, res.data);
      } catch (err) {
        console.error('Quiet polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchMatches, cacheKey]);

  return { matches, loading, error, refetchMatches: () => fetchMatches(true) };
};
