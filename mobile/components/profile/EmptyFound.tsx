import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

export default function EmptyFound({
  icon,
  title,
  subtitle1,
  subtitle2,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle1: string;
  subtitle2: string;
  onPress: () => void;
}) {
  return (
    <View className="items-center justify-center flex-1 px-6">
      <Ionicons name={icon} size={80} color="#666" />
      <Text className="mt-4 text-xl font-semibold text-text-primary">
        {title}
      </Text>
      <Text className="mt-2 text-center text-text-secondary">{subtitle1} </Text>
      <TouchableOpacity
        className="px-8 py-4 mt-6 bg-primary rounded-2xl"
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Text className="text-base font-bold text-background">{subtitle2}</Text>
      </TouchableOpacity>
    </View>
  );
}
