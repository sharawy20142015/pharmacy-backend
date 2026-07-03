import { useQuery } from "@tanstack/react-query";
import { getActiveBundles } from "../../../../services/bundleService";

export const useBundles = () => {
  return useQuery({
    queryKey: ["bundles"],
    queryFn: async () => {
      const data = await getActiveBundles();
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
