// src/hook/useBundles.js

import { useState, useEffect, useCallback } from "react";
import { getActiveBundles } from "../../services/bundleService";

export const useBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveBundles();
      setBundles(data);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب الباقات");
      console.error("🔥 useBundles Hook Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  return { bundles, loading, error, refetch: fetchBundles };
};
