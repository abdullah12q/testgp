import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View, Text, TouchableOpacity } from "react-native";

export default function ProductRatingRow({
  item,
  rating,
  onRate,
}: {
  item: Order["orderItems"][number];
  rating: number;
  onRate: (star: number) => void;
}) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Image
          source={item.image}
          style={{ height: 48, width: 48, borderRadius: 8 }}
          contentFit="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-text-primary" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-text-secondary">
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between p-3 bg-background-lighter rounded-xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate(star)}
            activeOpacity={0.7}
            className="p-1"
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={28}
              color={star <= rating ? "#1DB954" : "#4A4A4A"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
