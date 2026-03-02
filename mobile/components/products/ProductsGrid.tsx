import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProductsGridProps } from "@/types";
import RenderProductItem from "./RenderProductItem";
import NoProductsFound from "./NoProductsFound";

export default function ProductsGrid({
  products,
  isLoading,
  isError,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <View className="items-center justify-center py-20">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="mt-4 text-text-secondary">Loading products... </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center py-20">
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text className="mt-4 font-semibold text-text-primary">
          Failed to load products
        </Text>
        <Text className="mt-2 text-sm text-text-secondary">
          Please try again later
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <RenderProductItem item={item} />}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
    />
  );
}
