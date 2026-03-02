import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { CartItemProps } from "@/types";

export default function CartItem({
  item,
  isLoading,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <View className="mx-6 mb-3 overflow-hidden bg-surface rounded-3xl">
      <View className="flex-row p-4">
        {/* Product Image */}
        <View className="relative">
          <Image
            source={item.product.images[0]}
            className="bg-background-lighter"
            contentFit="cover"
            style={{ width: 112, height: 112, borderRadius: 16 }}
          />
          <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
            <Text className="text-xs font-bold text-background">
              ×{item.quantity}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="justify-between flex-1 ml-4">
          <View>
            <Text
              className="text-lg font-bold leading-tight text-text-primary"
              numberOfLines={2}
            >
              {item.product.name}
            </Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-2xl font-bold text-primary">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
              <Text className="ml-2 text-sm text-text-secondary">
                ${item.product.price.toFixed(2)} each
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row items-center mt-3">
            <TouchableOpacity
              className="items-center justify-center rounded-full size-9 bg-surface-light disabled:opacity-50"
              onPress={() =>
                onUpdateQuantity(item.product._id, item.quantity, -1)
              }
              disabled={isLoading || item.quantity === 1}
            >
              <Ionicons name="remove" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="mx-4 min-w-[32px] items-center">
              {false ? (
                <ActivityIndicator size="small" color="#1DB954" />
              ) : (
                <Text className="text-lg font-bold text-text-primary">
                  {item.quantity}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className="items-center justify-center rounded-full bg-primary size-9 disabled:opacity-50"
              onPress={() =>
                onUpdateQuantity(item.product._id, item.quantity, 1)
              }
              disabled={isLoading || item.quantity === item.product.stock}
            >
              <Ionicons name="add" size={18} color="#121212" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center ml-auto rounded-full bg-red-500/10 size-9 disabled:opacity-50"
              onPress={() => onRemove(item.product._id, item.product.name)}
              disabled={isLoading}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
