import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NoProductsFound() {
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="mt-4 font-semibold text-text-primary">
        No products found
      </Text>
      <Text className="mt-2 text-sm text-text-secondary">
        Try adjusting your filters{" "}
      </Text>
    </View>
  );
}
