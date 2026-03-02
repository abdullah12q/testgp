import { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Address } from "@/types";
import useAddresses from "@/hooks/useAddresses";
import AddressCard from "@/components/profile/addresses/AddressCard";
import AddressFormModal from "@/components/profile/addresses/AddressFormModal";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import NavHeader from "@/components/profile/NavHeader";
import EmptyFound from "@/components/profile/EmptyFound";

export default function AddressesScreen() {
  const {
    addresses,
    isLoading,
    isError,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  function handleOpenAdd() {
    setSelectedAddress(null);
    setModalVisible(true);
  }

  function handleOpenEdit(address: Address) {
    setSelectedAddress(address);
    setModalVisible(true);
  }

  function handleFormSubmit(formData: any) {
    const callbacks = {
      onSuccess: (data: any) => {
        setModalVisible(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2:
            data.message ||
            `Address ${selectedAddress ? "updated" : "added"} successfully`,
        });
      },
      onError: (error: any) => {
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Operation failed",
        );
      },
    };

    if (selectedAddress) {
      updateAddress(
        { addressId: selectedAddress._id, addressData: formData },
        callbacks,
      );
    } else {
      addAddress(formData, callbacks);
    }
  }

  function handleDelete(addressId: string, label: string) {
    Toast.show({
      type: "deleteConfirmation",
      text1: "Delete Address",
      text2: `Are you sure you want to delete ${label}?`,
      position: "bottom",
      autoHide: false,
      props: { onConfirm: () => deleteAddress(addressId) },
    });
  }

  if (isLoading) return <LoadingUI title="My Addresses" />;
  if (isError) return <ErrorUI title="My Addresses" />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER */}
      <NavHeader title="My Addresses" />

      {addresses.length === 0 ? (
        // EMPTY ADDRESSES
        <EmptyFound
          icon="location-outline"
          title="No Addresses Found"
          subtitle1="You have not added any addresses yet"
          subtitle2="Add your first address"
          onPress={handleOpenAdd}
        />
      ) : (
        // ADDRESSES LIST
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-6 py-4">
            <FlatList
              data={addresses}
              renderItem={({ item }) => (
                <AddressCard
                  address={item}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  isBusy={isUpdatingAddress || isDeletingAddress}
                />
              )}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              className="flex-row items-center justify-center py-4 mt-2 bg-primary rounded-2xl"
              activeOpacity={0.8}
              onPress={handleOpenAdd}
            >
              <Ionicons name="add-circle-outline" size={24} color="#121212" />
              <Text className="ml-2 text-base font-bold text-background">
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={modalVisible}
        initialData={selectedAddress}
        isSubmitting={isAddingAddress || isUpdatingAddress}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
      />
    </SafeAreaView>
  );
}
