import { View, Text } from "react-native";
import { OrderSummaryProps } from "@/types";
import SummaryRow from "./SummaryRow";

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <View className="px-6 mt-6">
      <View className="p-5 border bg-surface rounded-3xl border-surface-light">
        <Text className="mb-4 text-xl font-bold text-text-primary">
          Summary
        </Text>

        <View className="gap-3">
          <SummaryRow label="Subtotal" value={subtotal} />
          <SummaryRow label="Shipping" value={shipping} />
          <SummaryRow label="Tax" value={tax} />

          <View className="my-2 border-t border-surface-light" />

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text-primary">Total</Text>
            <Text className="text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
