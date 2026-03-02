import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/api/axios";
import { Address } from "@/types";

export default function useAddresses() {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get<{ addresses: Address[] }>(
        "/users/addresses",
      );
      return data.addresses;
    },
  });

  const { mutate: addAddressMutation, isPending: isAddingAddress } =
    useMutation({
      mutationFn: async (addressData: Omit<Address, "_id">) => {
        const { data } = await api.post("/users/addresses", addressData);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      },
    });

  const { mutate: updateAddressMutation, isPending: isUpdatingAddress } =
    useMutation({
      mutationFn: async ({
        addressId,
        addressData,
      }: {
        addressId: string;
        addressData: Partial<Address>;
      }) => {
        const { data } = await api.put(
          `/users/addresses/${addressId}`,
          addressData,
        );
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      },
    });

  const { mutate: deleteAddressMutation, isPending: isDeletingAddress } =
    useMutation({
      mutationFn: async (addressId: string) => {
        const { data } = await api.delete<{ addresses: Address[] }>(
          `/users/addresses/${addressId}`,
        );
        return data.addresses;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      },
    });

  return {
    addresses: addresses || [],
    isLoading,
    isError,
    addAddress: addAddressMutation,
    updateAddress: updateAddressMutation,
    deleteAddress: deleteAddressMutation,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  };
}
