import { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useProduct from "@/hooks/useProduct";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: product, isError, isLoading } = useProduct(id);

  const { addToCart, isAddingToCart } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    if (!product) return;
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () =>
          Toast.show({
            type: "success",
            text1: "Added to cart",
            text2: `${product.name} is now in your cart`,
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

  if (isLoading) return <LoadingUI productDetails={true} title="Product" />;
  if (isError || !product)
    return <ErrorUI productDetails={true} title="Product" />;

  const isInStock = product.stock > 0;

  const isLoadingWishlist = isAddingToWishlist || isRemovingFromWishlist;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-6 pt-14">
        <TouchableOpacity
          className="items-center justify-center rounded-full size-12 bg-black/50 backdrop-blur-xl"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`size-12 rounded-full items-center justify-center ${
            isInWishlist(product._id)
              ? "bg-primary"
              : "bg-black/50 backdrop-blur-xl"
          }`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isLoadingWishlist}
          activeOpacity={0.7}
        >
          {isLoadingWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist(product._id) ? "#121212" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* PRODUCT IMAGES AND DETAILS */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* IMAGE GALLERY */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image: string, index: number) => (
              <View key={index} style={{ width }}>
                <Image
                  source={image}
                  style={{ width, height: 400 }}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View className="absolute left-0 right-0 flex-row justify-center gap-2 bottom-4">
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === selectedImageIndex
                    ? "bg-primary w-6"
                    : "bg-white/50 w-2"
                }`}
              />
            ))}
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View className="p-6">
          {/* Category */}
          <View className="flex-row items-center mb-3">
            <View className="px-3 py-1 rounded-full bg-primary/20">
              <Text className="text-xs font-bold text-primary">
                {product.category}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="mb-3 text-3xl font-bold text-text-primary">
            {product.name}
          </Text>

          {/* Rating & Reviews */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center px-3 py-2 rounded-full bg-surface">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="ml-1 mr-2 font-bold text-text-primary">
                {product.averageRating.toFixed(1)}
              </Text>
              <Text className="text-sm text-text-secondary">
                ({product.totalReviews} reviews)
              </Text>
            </View>
            {isInStock ? (
              <View className="flex-row items-center ml-3">
                <View className="mr-2 bg-green-500 rounded-full size-2" />
                <Text className="text-sm font-semibold text-green-500">
                  {product.stock} in stock
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center ml-3">
                <View className="mr-2 bg-red-500 rounded-full size-2" />
                <Text className="text-sm font-semibold text-red-500">
                  Out of Stock
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Text className="text-4xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </Text>
          </View>

          {/* Quantity */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-bold text-text-primary">
              Quantity
            </Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="items-center justify-center rounded-full size-12 bg-surface disabled:opacity-50"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                activeOpacity={0.7}
                disabled={!isInStock || quantity <= 1}
              >
                <Ionicons name="remove" size={24} color={"#FFFFFF"} />
              </TouchableOpacity>

              <Text className="mx-6 text-xl font-bold text-text-primary">
                {quantity}
              </Text>

              <TouchableOpacity
                className="items-center justify-center rounded-full size-12 bg-primary disabled:opacity-50"
                onPress={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                activeOpacity={0.7}
                disabled={!isInStock || quantity >= product.stock}
              >
                <Ionicons name="add" size={24} color={"#121212"} />
              </TouchableOpacity>
            </View>

            {quantity >= product.stock && isInStock && (
              <Text className="mt-2 text-sm text-orange-500">
                Maximum stock reached
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="mb-3 text-lg font-bold text-text-primary">
              Description
            </Text>
            <Text className="text-base leading-6 text-text-secondary">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t bg-background/95 backdrop-blur-3xl border-surface">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-text-secondary">
              Total Price
            </Text>
            <Text className="text-2xl font-bold text-primary">
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${
              !isInStock ? "bg-surface" : "bg-primary"
            }`}
            activeOpacity={0.8}
            onPress={handleAddToCart}
            disabled={!isInStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Ionicons
                  name="cart"
                  size={24}
                  color={!isInStock ? "#666" : "#121212"}
                />
                <Text
                  className={`font-bold text-lg ml-2 ${
                    !isInStock ? "text-text-secondary" : "text-background"
                  }`}
                >
                  {!isInStock ? "Out of Stock" : "Add to Cart"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
