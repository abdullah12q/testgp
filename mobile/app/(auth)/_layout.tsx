import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  if (!isLoaded)
    return (
      <View className="items-center justify-center flex-1 bg-background">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="mt-4 text-text-secondary">TapCart is loading... </Text>
      </View>
    );
  if (isSignedIn) return <Redirect href={"/(tabs)"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
