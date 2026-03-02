import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/api/axios";
import { Product } from "@/types";

export default function useProduct(productId: string) {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  return result;
}
