import { useState, useCallback } from "react";
import * as Linking from "expo-linking";
import { useSSO } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const { startSSOFlow } = useSSO();

  const handleSocialAuth = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      setLoadingStrategy(strategy);

      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy: strategy,
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "tapcart" }),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          Toast.show({
            type: "success",
            text1: "Welcome back!",
            text2: "You have signed in successfully.",
          });
        }
      } catch (error: any) {
        if (error.code === "ERR_REQUEST_CANCELED") {
          console.info("User cancelled login");
        } else {
          console.error("Error in social auth:", error);
          const provider = strategy === "oauth_google" ? "Google" : "Apple";
          Toast.show({
            type: "error",
            text1: `Failed to sign in with ${provider}`,
            text2: error.errors?.[0]?.message || "Please try again.",
          });
        }
      } finally {
        setLoadingStrategy(null);
      }
    },
    [startSSOFlow],
  );

  return { loadingStrategy, handleSocialAuth };
}
