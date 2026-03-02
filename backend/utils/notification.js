import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotification(pushToken, title, body, data = {}) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title: title,
      body: body,
      data: data, // send the orderId here to open the specific order on tap
      channelId: "default",
      priority: "high",
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
