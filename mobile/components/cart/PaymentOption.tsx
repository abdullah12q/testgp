import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentOption({
  label,
  icon,
  isSelected,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-1 flex-row items-center justify-center p-4 border rounded-xl ${
        isSelected
          ? "bg-primary/10 border-primary"
          : "bg-surface border-surface-light"
      }`}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isSelected ? "#1DB954" : "#B3B3B3"}
      />
      <Text
        className={`ml-2 font-semibold ${
          isSelected ? "text-primary" : "text-text-secondary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
