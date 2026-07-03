import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../services/apiClient";

export const useCategoriesLevel1 = () => {
  return useQuery({
    queryKey: ["categories", "level-1"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/level-1");
      return response.data.filter(
        (cat) => cat.img_url && cat.img_url.trim() !== "",
      );
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
