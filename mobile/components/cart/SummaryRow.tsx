import { View, Text } from "react-native";

export default function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base text-text-secondary">{label} </Text>
      <Text className="text-base font-semibold text-text-primary">
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}
