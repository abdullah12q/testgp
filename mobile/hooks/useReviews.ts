import { useApi } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReviewData } from "@/types";

export default function useReviews() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { mutateAsync: createReview, isPending: isCreatingReview } =
    useMutation({
      mutationFn: async (data: CreateReviewData) => {
        const response = await api.post("/reviews", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
    });

  return {
    createReviewAsync: createReview,
    isCreatingReview: isCreatingReview,
  };
}
