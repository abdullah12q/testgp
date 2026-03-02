import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Product } from "@/types";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

export default function WishlistProductItem({ item }: { item: Product }) {
  const { removeFromWishlist, isRemovingFromWishlist } = useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  function handleRemoveFromWishlist(productId: string, productName: string) {
    Toast.show({
      type: "deleteConfirmation",
      text1: "Remove from wishlist",
      text2: `Are you sure you want to remove ${productName}?`,
      position: "bottom",
      autoHide: false,
      props: {
        onConfirm: () => removeFromWishlist(productId),
      },
    });
  }

  function handleAddToCart(productId: string, productName: string) {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () =>
          Toast.show({
            type: "success",
            text1: "Added to cart",
            text2: `${productName} is now in your cart`,
          }),
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error?.response?.data?.message || "Failed to add to cart",
          });
        },
      },
    );
  }

  return (
    <TouchableOpacity
      key={item._id}
      className="mb-3 overflow-hidden bg-surface rounded-3xl"
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <View className="flex-row p-4">
        <Image
          source={item.images[0]}
          className="bg-background-lighter"
          style={{ width: 96, height: 96, borderRadius: 8 }}
        />

        <View className="flex-1 ml-4">
          <Text
            className="mb-2 text-base font-bold text-text-primary"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text className="mb-2 text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </Text>

          {item.stock > 0 ? (
            <View className="flex-row items-center">
              <View className="mr-2 bg-green-500 rounded-full size-2" />
              <Text className="text-sm font-semibold text-green-500">
                {item.stock} in stock
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="mr-2 bg-red-500 rounded-full size-2" />
              <Text className="text-sm font-semibold text-red-500">
                Out of Stock
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="self-start p-2 rounded-full bg-red-500/20"
          activeOpacity={0.7}
          onPress={() => handleRemoveFromWishlist(item._id, item.name)}
          disabled={isRemovingFromWishlist}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
      {item.stock > 0 && (
        <View className="px-4 pb-4">
          <TouchableOpacity
            className="items-center py-3 bg-primary rounded-xl"
            activeOpacity={0.8}
            onPress={() => handleAddToCart(item._id, item.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Text className="font-bold text-background">Add to Cart</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
