import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddressCardProps } from "@/types";
import ActionButton from "./ActionButton";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isBusy,
}: AddressCardProps) {
  return (
    <View className="p-5 mb-3 bg-surface rounded-3xl">
      {/* Card Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="items-center justify-center mr-3 rounded-full size-12 bg-primary/20">
            <Ionicons name="location" size={24} color="#1DB954" />
          </View>
          <Text
            className="text-lg font-bold text-text-primary"
            numberOfLines={1}
          >
            {address.label}
          </Text>
        </View>
        {address.isDefault && (
          <View className="px-3 py-1 ml-2 rounded-full bg-primary">
            <Text className="text-xs font-bold text-background">Default</Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View className="ml-15">
        <Text className="mb-1 font-semibold text-text-primary">
          {address.fullName}
        </Text>
        <Text className="text-sm text-text-secondary">
          {address.streetAddress}, {address.city}
        </Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {address.phoneNumber}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2 mt-4">
        <ActionButton
          icon="create-outline"
          label="Edit"
          color="text-primary"
          bgColor="bg-primary/20"
          disabled={isBusy}
          onPress={() => onEdit(address)}
        />
        <ActionButton
          icon="trash-outline"
          label="Delete"
          color="text-red-500"
          bgColor="bg-red-500/20"
          disabled={isBusy}
          onPress={() => onDelete(address._id, address.label)}
        />
      </View>
    </View>
  );
}
