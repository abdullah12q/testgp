import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";

export default function RenderProductItem({
  item: product,
}: {
  item: Product;
}) {
  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const { isAddingToCart, addToCart } = useCart();

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
        onError: (error: any) =>
          Toast.show({
            type: "error",
            text1: "Failed to add to cart",
            text2: error?.response?.data?.message || "Something went wrong",
          }),
      },
    );
  }
  return (
    <TouchableOpacity
      className="mb-3 overflow-hidden bg-surface rounded-3xl"
      style={{ width: "48%" }}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product._id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute p-2 rounded-full top-3 right-3 bg-black/30 backdrop-blur-xl"
          activeOpacity={0.7}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="mb-1 text-xs text-text-secondary">
          {product.category}
        </Text>
        <Text
          className="mb-2 text-sm font-bold text-text-primary"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="ml-1 text-xs font-semibold text-text-primary">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="ml-1 text-xs text-text-secondary">
            ({product.totalReviews})
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            className="items-center justify-center rounded-full size-8 bg-primary"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
