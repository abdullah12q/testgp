import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NavHeader from "./profile/NavHeader";

export default function ErrorUI({
  productDetails = false,
  title,
}: {
  productDetails?: boolean;
  title: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {!productDetails && <NavHeader title={title} />}
      <View className="items-center justify-center flex-1 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="mt-4 text-xl font-semibold text-center text-text-primary">
          {!productDetails
            ? `Failed to load ${title.toLowerCase()}`
            : `This ${title.toLowerCase()} may have been removed or doesn't exist`}
        </Text>
        {!productDetails ? (
          <Text className="mt-2 text-center text-text-secondary">
            Please check your connection and try again{" "}
          </Text>
        ) : (
          <TouchableOpacity
            className="px-6 py-3 mt-6 bg-primary rounded-2xl"
            onPress={() => router.back()}
          >
            <Text className="font-bold text-background">Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
