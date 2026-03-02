import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

export default function AddressCardItem({
  address,
  isSelected,
  onPress,
}: {
  address: Address;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`bg-surface rounded-3xl p-6 border-2 ${
        isSelected ? "border-primary" : "border-background-lighter"
      }`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-3">
            <Text className="mr-2 text-lg font-bold text-primary">
              {address.label}
            </Text>
            {address.isDefault && (
              <View className="px-3 py-1 rounded-full bg-primary/20">
                <Text className="text-sm font-semibold text-primary">
                  Default
                </Text>
              </View>
            )}
          </View>
          <Text className="mb-2 text-lg font-semibold text-text-primary">
            {address.fullName}
          </Text>
          <Text className="mb-1 text-base leading-6 text-text-secondary">
            {address.streetAddress}
          </Text>
          <Text className="mb-2 text-base text-text-secondary">
            {address.city}
          </Text>
          <Text className="text-base text-text-secondary">
            {address.phoneNumber}
          </Text>
        </View>
        {isSelected && (
          <View className="p-2 ml-3 rounded-full bg-primary">
            <Ionicons name="checkmark" size={24} color="#121212" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
