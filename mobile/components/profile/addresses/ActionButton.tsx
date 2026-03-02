import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export default function ActionButton({
  icon,
  label,
  color,
  bgColor,
  disabled,
  onPress,
}: {
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-row justify-center gap-2 items-center flex-1 py-3 rounded-xl ${bgColor} ${disabled ? "opacity-50" : ""}`}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons
        name={icon}
        size={24}
        color={color === "text-primary" ? "#1DB954" : "#F44336"}
      />
      <Text className={`font-bold ${color}`}>{label}</Text>
    </TouchableOpacity>
  );
}
