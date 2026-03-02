import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "@/utils/constants";
import CategoryItem from "@/components/products/CategoryItem";
import ProductsGrid from "@/components/products/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import useDebounce from "@/hooks/useDebounce";
import { Product } from "@/types";
import FilterModal from "@/components/products/FilterModal";

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    minRating: 0,
    sortBy: "newest" as "newest" | "price_low" | "price_high",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products as Product[];

    // 1. Filter by Category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // 2. Filter by Search Query
    if (debouncedSearchQuery.trim()) {
      const lowerQuery = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery),
      );
    }

    // 3. Filter by Price Range
    if (filters.priceRange.min) {
      filtered = filtered.filter(
        (p) => p.price >= parseFloat(filters.priceRange.min),
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(
        (p) => p.price <= parseFloat(filters.priceRange.max),
      );
    }

    // 4. Filter by Rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (p) => (p.averageRating || 0) >= filters.minRating,
      );
    }

    // 5. Apply Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return filtered;
  }, [
    products,
    selectedCategory,
    debouncedSearchQuery,
    filters.priceRange,
    filters.minRating,
    filters.sortBy,
  ]);

  function resetFilters() {
    setFilters({
      priceRange: { min: "", max: "" },
      minRating: 0,
      sortBy: "newest",
    });
  }

  const isFilterActive =
    filters.priceRange.min !== "" ||
    filters.priceRange.max !== "" ||
    filters.minRating > 0 ||
    filters.sortBy !== "newest";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold tracking-tight text-text-primary">
                TapCart Shop
              </Text>
              <Text className="mt-1 text-sm text-text-secondary">
                Browse all products{" "}
              </Text>
            </View>

            <TouchableOpacity
              className={`p-3 rounded-full ${
                isFilterActive ? "bg-primary" : "bg-surface/50"
              }`}
              activeOpacity={0.7}
              onPress={() => setIsModalVisible(true)}
            >
              <View>
                <Ionicons
                  name="options-outline"
                  size={22}
                  color={isFilterActive ? "#fff" : "#fff"}
                />
                {/* Red Dot Indicator */}
                {isFilterActive && (
                  <View className="absolute top-0 right-0 size-2.5 bg-red-500 rounded-full border border-background" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="flex-row items-center px-4 py-1 bg-surface rounded-2xl">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              return (
                <CategoryItem
                  key={category.name}
                  category={category}
                  isSelected={isSelected}
                  setSelectedCategory={setSelectedCategory}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* PRODUCTS */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-text-primary">
              Products
            </Text>
            <Text className="text-sm text-text-secondary">
              {filteredProducts.length} items
            </Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>

      {/* FILTER MODAL */}
      <FilterModal
        isModalVisible={isModalVisible}
        handleCloseModal={() => setIsModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
    </SafeAreaView>
  );
}
