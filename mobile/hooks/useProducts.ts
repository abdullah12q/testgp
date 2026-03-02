import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/api/axios";
import { Product } from "@/types";

export default function useProducts() {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/products");
      return data;
    },
    refetchInterval: 5000,
  });

  return result;
}
