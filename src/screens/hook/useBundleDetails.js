// src/hook/useBundleDetails.js

import { useState, useEffect, useCallback } from "react";
import { getBundleBySlug } from "../../services/bundleService";

export const useBundleDetails = (slug) => {
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBundleDetails = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBundleBySlug(slug);
      setBundle(data);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب تفاصيل الباقة");
      console.error("🔥 useBundleDetails Hook Error:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBundleDetails();
  }, [fetchBundleDetails]);

  return { bundle, loading, error, refetch: fetchBundleDetails };
};
