import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { useApi } from "@/api/axios";

// Handler to show notification even when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApi();

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Order Status Updates",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!Device.isDevice) {
      console.error("Must use physical device for Push Notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.error("Failed to get push token for push notification!");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    try {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      console.info("Expo Push Token:", token);
      return token;
    } catch (e) {
      console.error("Error getting Expo Push Token", e);
    }
  }

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (token) {
        // Send token to backend
        api.put("/users/push-token", { pushToken: token }).catch((err) => {
          // Add this log to see the REAL error message from the backend
          console.error("Sync Failed:", err.response?.data || err.message);
        });
      }
    });
  }, [isLoaded, isSignedIn, api]);

  return { expoPushToken };
}
