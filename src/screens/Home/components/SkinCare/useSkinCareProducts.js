import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../../services/productService";

export const useSkinCareProducts = () => {
  return useQuery({
    queryKey: ["products", "skin-care"],
    queryFn: () => productService.getProductsByCategorySlug("skin-care"),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
