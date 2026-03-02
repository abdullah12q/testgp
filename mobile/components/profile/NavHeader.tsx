import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NavHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center px-5 pt-3 pb-5 border-b border-surface">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-text-primary">{title}</Text>
      {children}
    </View>
  );
}
