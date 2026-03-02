import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";
import { useApi } from "@/api/axios";

export default function useWishlist() {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{ wishlist: Product[] }>(
        "/users/wishlist",
      );
      return data.wishlist;
    },
  });

  const { mutate: addToWishlistMutation, isPending: isAddingToWishlist } =
    useMutation({
      mutationFn: async (productId: string) => {
        await api.post(`/users/wishlist/${productId}`);
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    });

  const {
    mutate: removeFromWishlistMutation,
    isPending: isRemovingFromWishlist,
  } = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/users/wishlist/${productId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  function isInWishlist(productId: string) {
    return wishlist?.some((product) => product._id === productId) ?? false;
  }

  function toggleWishlist(productId: string) {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation(productId);
    } else {
      addToWishlistMutation(productId);
    }
  }

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation,
    removeFromWishlist: removeFromWishlistMutation,
    isAddingToWishlist: isAddingToWishlist,
    isRemovingFromWishlist: isRemovingFromWishlist,
  };
}
