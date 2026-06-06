import { useState, useEffect, useRef, useCallback } from "react";
import { getFromCache, getOrFetch } from "@/lib/apiCache";

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions {
  ttl?: number;
  enabled?: boolean;
}

export function useApi<T>(
  cacheKey: string | null,
  fetchFn: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiResult<T> {
  const { ttl, enabled = true } = options;
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  const [data, setData] = useState<T | null>(
    () => (cacheKey ? getFromCache<T>(cacheKey) : null),
  );
  const [isLoading, setIsLoading] = useState(
    () => !!cacheKey && data === null,
  );
  const [error, setError] = useState<Error | null>(null);

  const prevKeyRef = useRef(cacheKey);
  const fromCacheRef = useRef(data !== null);

  useEffect(() => {
    if (cacheKey === prevKeyRef.current) return;
    prevKeyRef.current = cacheKey;

    const cached = cacheKey ? getFromCache<T>(cacheKey) : null;
    fromCacheRef.current = cached !== null;
    setData(cached);
    setIsLoading(!!cacheKey && cached === null);
    setError(null);
  }, [cacheKey]);

  useEffect(() => {
    if (!enabled || !cacheKey || fromCacheRef.current || data !== null) return;

    setIsLoading(true);
    setError(null);

    getOrFetch(cacheKey, () => fetchFnRef.current(), ttl)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [cacheKey, ttl, enabled, data]);

  const refetch = useCallback(async () => {
    if (!cacheKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getOrFetch(cacheKey, () => fetchFnRef.current(), ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, ttl]);

  return { data, isLoading, error, refetch };
}
