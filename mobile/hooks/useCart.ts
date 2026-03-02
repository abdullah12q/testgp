import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cart } from "@/types";
import { useApi } from "@/api/axios";

export default function useCart() {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ cart: Cart }>("/cart");
      return data.cart;
    },
  });

  const cartTotal =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ) ?? 0;

  const cartItemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const { mutate: addToCartMutation, isPending: isAddingToCart } = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post<{ cart: Cart }>("/cart", {
        productId,
        quantity,
      });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const { mutate: updateQuantityMutation, isPending: isUpdatingQuantity } =
    useMutation({
      mutationFn: async ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) => {
        const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, {
          quantity,
        });
        return data.cart;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });

  const { mutate: removeFromCartMutation, isPending: isRemovingFromCart } =
    useMutation({
      mutationFn: async (productId: string) => {
        const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
        return data.cart;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    });

  const { mutate: clearCartMutation, isPending: isClearingCart } = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation,
    updateQuantity: updateQuantityMutation,
    removeFromCart: removeFromCartMutation,
    clearCart: clearCartMutation,
    isAddingToCart,
    isUpdatingQuantity,
    isRemovingFromCart,
    isClearingCart,
  };
}
