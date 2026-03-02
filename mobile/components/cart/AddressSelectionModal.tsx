import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Address, AddressSelectionModalProps } from "@/types";
import useAddresses from "@/hooks/useAddresses";
import AddressCardItem from "./AddressCardItem";
import PaymentOption from "./PaymentOption";

export default function AddressSelectionModal({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) {
  const { addresses, isLoading } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");

  useEffect(() => {
    if (visible && addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [visible, addresses, selectedAddress]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill}>
        <Pressable className="justify-end flex-1" onPress={onClose}>
          <Pressable
            className="bg-background rounded-t-3xl h-[85%] overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-surface">
              <Text className="text-2xl font-bold text-text-primary">
                Checkout
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-surface-light"
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Address List */}
            {isLoading ? (
              <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color="#1DB954" />
              </View>
            ) : (
              <FlatList
                data={addresses}
                renderItem={({ item }) => (
                  <AddressCardItem
                    address={item}
                    isSelected={selectedAddress?._id === item._id}
                    onPress={() => setSelectedAddress(item)}
                  />
                )}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListHeaderComponent={
                  <Text className="mb-4 text-base font-semibold text-text-secondary">
                    Shipping Address
                  </Text>
                }
              />
            )}

            {/* Footer Section */}
            <View className="p-6 border-t bg-background border-surface">
              {/* Payment Method Selector */}
              <Text className="mb-4 text-base font-semibold text-text-secondary">
                Payment Method
              </Text>
              <View className="flex-row gap-3 mb-6">
                <PaymentOption
                  label="Card"
                  icon="card-outline"
                  isSelected={paymentMethod === "card"}
                  onPress={() => setPaymentMethod("card")}
                />
                <PaymentOption
                  label="Cash on Delivery"
                  icon="cash-outline"
                  isSelected={paymentMethod === "cod"}
                  onPress={() => setPaymentMethod("cod")}
                />
              </View>

              {/* Proceed Button */}
              <TouchableOpacity
                className={`py-4 bg-primary rounded-2xl ${
                  !selectedAddress || isProcessing ? "opacity-50" : ""
                }`}
                onPress={() =>
                  selectedAddress && onProceed(selectedAddress, paymentMethod)
                }
                disabled={!selectedAddress || isProcessing}
              >
                <View className="flex-row items-center justify-center">
                  {isProcessing ? (
                    <ActivityIndicator color="#121212" />
                  ) : (
                    <>
                      <Text className="mr-2 text-lg font-bold text-background">
                        {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
                      </Text>
                      <Ionicons
                        name={
                          paymentMethod === "cod" ? "checkmark-circle" : "card"
                        }
                        size={20}
                        color="#121212"
                      />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
