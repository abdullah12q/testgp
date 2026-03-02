import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function EmptyCart() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="px-6 pt-6 pb-4 text-3xl font-bold tracking-tight text-text-primary">
        Cart
      </Text>
      <View className="items-center justify-center flex-1">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="mt-4 text-xl font-semibold text-text-primary">
          Your cart is empty
        </Text>
        <Text className="mt-2 text-center text-text-secondary">
          Add some products to get started{" "}
        </Text>
        <TouchableOpacity
          className="px-8 py-4 mt-6 bg-primary rounded-2xl"
          activeOpacity={0.8}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-base font-bold text-background">Shop Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
