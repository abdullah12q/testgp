import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavHeader from "./profile/NavHeader";

export default function LoadingUI({
  productDetails = false,
  title,
}: {
  productDetails?: boolean;
  title: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {!productDetails && <NavHeader title={title} />}
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="mt-4 text-text-secondary">
          Loading {title.toLowerCase()}...{" "}
        </Text>
      </View>
    </SafeAreaView>
  );
}
