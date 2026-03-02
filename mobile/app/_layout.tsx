import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { StripeProvider } from "@stripe/stripe-react-native";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#1DB954", backgroundColor: "#121212" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}
      text2Style={{ fontSize: 14, color: "#B3B3B3" }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#FF6B6B", backgroundColor: "#121212" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}
      text2Style={{ fontSize: 14, color: "#B3B3B3" }}
    />
  ),

  deleteConfirmation: ({ text1, text2, props }: any) => (
    <View className="w-[90%] bg-surface p-5 rounded-3xl border border-surface-light shadow-xl">
      <View className="mb-4">
        <Text className="text-lg font-bold text-text-primary">{text1}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{text2}</Text>
      </View>

      <View className="flex-row justify-end gap-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Toast.hide()}
          className="px-5 py-2.5 bg-surface-light rounded-xl"
        >
          <Text className="font-semibold text-text-primary">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (props.onConfirm) props.onConfirm();
            Toast.hide();
          }}
          className="px-5 py-2.5 bg-accent-red rounded-xl"
        >
          <Text className="font-bold text-text-primary">Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),

  navigation: ({ text1, text2, props }: any) => (
    <View className="w-[90%] bg-surface p-5 rounded-3xl border border-surface-light shadow-xl">
      <View className="mb-4">
        <Text className="text-lg font-bold text-text-primary">{text1}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{text2}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (props.onConfirm) props.onConfirm();
          Toast.hide();
        }}
        className="px-5 py-2.5 bg-primary rounded-xl"
      >
        <Text className="font-bold text-center text-text-primary">
          Add Address
        </Text>
      </TouchableOpacity>
    </View>
  ),
};

function InitialLayout() {
  usePushNotifications();

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <StatusBar backgroundColor="#121212" />
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        >
          <InitialLayout />
          <Toast config={toastConfig} />
        </StripeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
