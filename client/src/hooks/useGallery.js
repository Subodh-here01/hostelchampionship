import { useState, useEffect, useCallback } from 'react';
import { getGallery } from '../api/gallery';
import { getCache, setCache } from '../utils/cache';

export const useGallery = (filters = {}) => {
  const cacheKey = `gallery_${JSON.stringify(filters)}`;
  const cachedData = getCache(cacheKey);

  const [photos, setPhotos] = useState(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await getGallery(filters);
      setPhotos(res.data);
      setCache(cacheKey, res.data);
    } catch (err) {
      console.error('Error in useGallery hook:', err);
      setError(err.response?.data?.message || 'Failed to query match moments gallery.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, JSON.stringify(filters)]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { photos, loading, error, refetchGallery: () => fetchGallery(true) };
};
