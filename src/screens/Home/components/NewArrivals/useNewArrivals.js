import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../../services/productService";

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productService.getProductsByClassification("New Arrivals"),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
