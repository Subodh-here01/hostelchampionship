import { useState, useEffect, useCallback } from 'react';
import { getGallery } from '../api/gallery';

export const useGallery = (filters = {}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGallery(filters);
      setPhotos(res.data);
    } catch (err) {
      console.error('Error in useGallery hook:', err);
      setError(err.response?.data?.message || 'Failed to query match moments gallery.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { photos, loading, error, refetchGallery: fetchGallery };
};
