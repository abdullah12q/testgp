import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/api/axios";
import { Order } from "@/types";

export default function useOrders() {
  const api = useApi();

  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.orders;
    },
    refetchInterval: 5000,
  });
}
