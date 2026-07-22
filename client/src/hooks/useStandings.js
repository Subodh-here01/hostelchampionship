import { useState, useEffect, useCallback } from 'react';
import { getStandings, getSportStandings } from '../api/standings';
import { getCache, setCache } from '../utils/cache';

export const useStandings = (sport = null) => {
  const cacheKey = `standings_${sport || 'All'}`;
  const cachedData = getCache(cacheKey);

  const [standings, setStandings] = useState(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchStandings = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      let res;
      if (sport && sport !== 'All') {
        res = await getSportStandings(sport);
      } else {
        res = await getStandings();
      }
      setStandings(res.data);
      setCache(cacheKey, res.data);
    } catch (err) {
      console.error('Error in useStandings hook:', err);
      setError(err.response?.data?.message || 'Failed to fetch leaderboard standings.');
    } finally {
      setLoading(false);
    }
  }, [sport, cacheKey]);

  useEffect(() => {
    fetchStandings();

    const interval = setInterval(async () => {
      try {
        let res;
        if (sport && sport !== 'All') {
          res = await getSportStandings(sport);
        } else {
          res = await getStandings();
        }
        setStandings(res.data);
        setCache(cacheKey, res.data);
      } catch (err) {
        console.error('Quiet polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStandings, sport, cacheKey]);

  return { standings, loading, error, refetchStandings: () => fetchStandings(true) };
};
