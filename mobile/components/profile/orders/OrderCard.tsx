import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "@/types";
import { formatDate, getStatusColor } from "@/utils/helpers";

export default function OrderCard({
  order,
  onRatePress,
}: {
  order: Order;
  onRatePress: () => void;
}) {
  const firstItem = order.orderItems[0];
  const isDelivered = order.status === "delivered";
  const statusColor = getStatusColor(order.status);
  const paymentMethodLabel =
    order.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment";
  const paymentIcon =
    order.paymentMethod === "cod" ? "cash-outline" : "card-outline";

  let statusDateLabel = null;
  let statusDateValue = null;
  if (order.status === "delivered" && order.deliveredAt) {
    statusDateLabel = "Delivered on";
    statusDateValue = order.deliveredAt;
  } else if (order.status === "shipped" && order.shippedAt) {
    statusDateLabel = "Shipped on";
    statusDateValue = order.shippedAt;
  }

  return (
    <View className="p-5 mb-4 bg-surface rounded-3xl">
      <View className="flex-row mb-4">
        {/* IMAGE SECTION */}
        <View className="relative">
          <Image
            source={firstItem?.image}
            style={{ height: 80, width: 80, borderRadius: 12 }}
            contentFit="cover"
            transition={200}
          />

          {/* BADGE FOR MORE ITEMS */}
          {order.orderItems.length > 1 && (
            <View className="absolute items-center justify-center border-2 rounded-full -bottom-2 -right-2 bg-primary size-7 border-surface">
              <Text className="text-xs font-bold text-background">
                +{order.orderItems.length - 1}
              </Text>
            </View>
          )}
        </View>

        {/* INFO SECTION */}
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between">
            <Text className="mb-1 text-base font-bold text-text-primary">
              Order #{order._id.slice(-6).toUpperCase()}
            </Text>
          </View>

          <Text className="mb-2 text-xs text-text-secondary">
            Placed on {formatDate(order.createdAt)}
          </Text>

          {/* Shipped/Delivered Date */}
          {statusDateValue && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={12} color="#1DB954" />
              <Text className="ml-1 text-xs font-medium text-primary">
                {statusDateLabel}: {formatDate(statusDateValue)}{" "}
              </Text>
            </View>
          )}

          {/* Status Badge */}
          <View
            className="self-start px-3 py-1 rounded-full"
            style={{
              backgroundColor: statusColor + "20",
            }}
          >
            <Text
              className="text-xs font-bold capitalize"
              style={{ color: statusColor }}
            >
              {order.status}
            </Text>
          </View>
        </View>
      </View>

      {/* ITEMS LIST TEXT */}
      <View className="mb-3">
        {order.orderItems.map((item) => (
          <Text
            key={item._id}
            className="text-sm text-text-secondary"
            numberOfLines={1}
          >
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      {/* FOOTER */}
      <View className="flex-row items-center justify-between pt-3 border-t border-surface-light">
        <View>
          {/* Payment Method Badge */}
          <View className="flex-row items-center mb-1">
            <Ionicons name={paymentIcon} size={12} color="#B3B3B3" />
            <Text className="ml-1 text-xs text-text-secondary">
              {paymentMethodLabel}{" "}
            </Text>
          </View>

          <Text className="text-lg font-bold text-primary">
            ${order.totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* REVIEW BUTTON */}
        {isDelivered &&
          (order.hasReviewed ? (
            <View className="flex-row items-center px-4 py-2 rounded-full bg-surface-light">
              <Ionicons name="checkmark-circle" size={16} color="#1DB954" />
              <Text className="ml-2 text-sm font-semibold text-text-primary">
                Reviewed
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              className="flex-row items-center px-5 py-2.5 rounded-full bg-primary"
              activeOpacity={0.7}
              onPress={onRatePress}
            >
              <Ionicons name="star" size={16} color="#121212" />
              <Text className="ml-2 text-sm font-bold text-background">
                Rate Order
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
