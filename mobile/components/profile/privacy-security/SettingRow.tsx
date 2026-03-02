import { SettingItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Switch } from "react-native";

export default function SettingRow({
  item,
  onToggle,
}: {
  item: SettingItem;
  onToggle: (id: string, val: boolean) => void;
}) {
  const isDanger = item.variant === "danger";
  const iconColor = isDanger ? "#EF4444" : "#1DB954";
  const iconBg = isDanger ? "bg-red-500/20" : "bg-primary/20";
  const titleColor = isDanger ? "text-red-500" : "text-text-primary";

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 mb-3 bg-surface rounded-2xl ${isDanger ? "border-2 border-red-500/20" : ""}`}
      activeOpacity={item.type === "toggle" ? 1 : 0.7}
    >
      {/* Icon */}
      <View
        className={`items-center justify-center size-12 mr-4 rounded-full ${iconBg}`}
      >
        <Ionicons name={item.icon} size={24} color={iconColor} />
      </View>

      {/* Text Info */}
      <View className="flex-1">
        <Text className={`mb-1 text-base font-bold ${titleColor}`}>
          {item.title}
        </Text>
        <Text className="text-sm text-text-secondary">{item.description}</Text>
      </View>

      {/* Action Area (Switch or Chevron) */}
      {item.type === "toggle" ? (
        <Switch
          value={item.value}
          onValueChange={(val) => onToggle(item.id, val)}
          trackColor={{ true: "#1DB954", false: "#767577" }}
          thumbColor="white"
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDanger ? "#EF4444" : "#666"}
        />
      )}
    </TouchableOpacity>
  );
}
