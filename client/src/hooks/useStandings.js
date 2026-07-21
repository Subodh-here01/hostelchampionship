import { useState, useEffect, useCallback } from 'react';
import { getStandings, getSportStandings } from '../api/standings';

export const useStandings = (sport = null) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (sport && sport !== 'All') {
        res = await getSportStandings(sport);
      } else {
        res = await getStandings();
      }
      setStandings(res.data);
    } catch (err) {
      console.error('Error in useStandings hook:', err);
      setError(err.response?.data?.message || 'Failed to fetch leaderboard standings.');
    } finally {
      setLoading(false);
    }
  }, [sport]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return { standings, loading, error, refetchStandings: fetchStandings };
};
