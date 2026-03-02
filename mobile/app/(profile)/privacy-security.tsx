import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Section } from "@/types";
import SettingRow from "@/components/profile/privacy-security/SettingRow";
import NavHeader from "@/components/profile/NavHeader";

export default function PrivacyAndSecurityScreen() {
  const STORAGE_KEY = "@user_preferences";

  const [isLoading, setIsLoading] = useState(true);

  const [preferences, setPreferences] = useState({
    twoFactor: false,
    biometric: true,
    push: true,
    email: true,
    marketing: false,
    data: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(jsonValue) }));
      }
    } catch (e) {
      console.error("Failed to load preferences", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggle(key: string, value: boolean) {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    try {
      const jsonValue = JSON.stringify(newPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save preferences", e);
    }
  }

  const SECTIONS: Section[] = [
    {
      title: "Security",
      items: [
        {
          id: "password",
          icon: "lock-closed-outline",
          title: "Change Password",
          description: "Update your account password",
          type: "link",
        },
        {
          id: "twoFactor",
          icon: "shield-checkmark-outline",
          title: "Two-Factor Auth",
          description: "Add an extra layer of security",
          type: "toggle",
          value: preferences.twoFactor,
        },
        {
          id: "biometric",
          icon: "finger-print-outline",
          title: "Biometric Login",
          description: "Use Face ID or Touch ID",
          type: "toggle",
          value: preferences.biometric,
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          id: "push",
          icon: "notifications-outline",
          title: "Push Notifications",
          description: "Receive push notifications",
          type: "toggle",
          value: preferences.push,
        },
        {
          id: "email",
          icon: "mail-outline",
          title: "Email Notifications",
          description: "Receive order updates via email",
          type: "toggle",
          value: preferences.email,
        },
        {
          id: "marketing",
          icon: "megaphone-outline",
          title: "Marketing Emails",
          description: "Receive promotional emails",
          type: "toggle",
          value: preferences.marketing,
        },
        {
          id: "data",
          icon: "analytics-outline",
          title: "Share Usage Data",
          description: "Help us improve the app",
          type: "toggle",
          value: preferences.data,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          id: "activity",
          icon: "time-outline",
          title: "Account Activity",
          description: "View recent login activity",
          type: "link",
        },
        {
          id: "devices",
          icon: "phone-portrait-outline",
          title: "Connected Devices",
          description: "Manage devices with access",
          type: "link",
        },
        {
          id: "download",
          icon: "download-outline",
          title: "Download Data",
          description: "Get a copy of your data",
          type: "action",
        },
      ],
    },
    {
      items: [
        {
          id: "delete",
          icon: "trash-outline",
          title: "Delete Account",
          description: "Permanently delete your account",
          type: "action",
          variant: "danger",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-background">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <NavHeader title="Privacy & Security" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Render Sections */}
        {SECTIONS.map((section, sectionIndex) => (
          <View key={sectionIndex} className="px-6 pt-6">
            {section.title && (
              <Text className="mb-4 text-lg font-bold text-text-primary">
                {section.title}
              </Text>
            )}

            {section.items.map((item) => (
              <SettingRow key={item.id} item={item} onToggle={handleToggle} />
            ))}
          </View>
        ))}

        {/* Footer Info */}
        <View className="px-6 pt-6">
          <View className="flex-row p-4 bg-primary/10 rounded-2xl">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#1DB954"
            />
            <Text className="flex-1 ml-3 text-sm leading-5 text-text-secondary">
              We take your privacy seriously. Your data is encrypted and stored
              securely. You can manage your privacy settings at any time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
