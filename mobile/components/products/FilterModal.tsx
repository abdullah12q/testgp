import { FiltersModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function FilterModal({
  isModalVisible,
  handleCloseModal,
  filters,
  setFilters,
  resetFilters,
}: FiltersModalProps) {
  return (
    <Modal visible={isModalVisible} transparent animationType="slide">
      <Pressable
        className="justify-end flex-1 bg-black/40"
        onPress={handleCloseModal}
      >
        <Pressable
          className="p-6 bg-background rounded-t-3xl"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-text-primary">
              Filter & Sort
            </Text>
            <Ionicons
              name="close"
              size={24}
              color="#fff"
              onPress={handleCloseModal}
            />
          </View>

          {/* Price Range */}
          <Text className="mb-2 font-semibold text-text-secondary">
            Price Range
          </Text>
          <View className="flex-row gap-3 mb-4">
            <TextInput
              placeholder="Min"
              keyboardType="numeric"
              value={filters.priceRange.min}
              onChangeText={(text) =>
                setFilters((prev: any) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, min: text },
                }))
              }
              className="flex-1 p-3 bg-surface rounded-xl text-text-primary"
            />
            <TextInput
              placeholder="Max"
              keyboardType="numeric"
              value={filters.priceRange.max}
              onChangeText={(text) =>
                setFilters((prev: any) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, max: text },
                }))
              }
              className="flex-1 p-3 bg-surface rounded-xl text-text-primary"
            />
          </View>

          {/* Rating */}
          <Text className="mb-2 font-semibold text-text-secondary">
            Minimum Rating
          </Text>
          <View className="flex-row mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= filters.minRating ? "star" : "star-outline"}
                size={28}
                color="#facc15"
                onPress={() =>
                  setFilters((prev: any) => ({ ...prev, minRating: star }))
                }
                style={{ marginRight: 8 }}
              />
            ))}
          </View>

          {/* Sorting */}
          <Text className="mb-2 font-semibold text-text-secondary">
            Sort By
          </Text>

          {[
            { label: "Newest", value: "newest" },
            { label: "Price: Low → High", value: "price_low" },
            { label: "Price: High → Low", value: "price_high" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() =>
                setFilters((prev: any) => ({ ...prev, sortBy: option.value }))
              }
              className={`p-4 rounded-xl mb-2 ${
                filters.sortBy === option.value ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text className="text-text-primary">{option.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Reset */}
          <TouchableOpacity
            onPress={resetFilters}
            className="p-4 mt-4 rounded-xl bg-surface"
          >
            <Text className="text-center text-text-secondary">
              Reset Filters
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
