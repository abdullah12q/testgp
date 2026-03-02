import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RatingModalProps } from "@/types";
import ProductRatingRow from "./ProductRatingRow";

export default function RatingModal({
  visible,
  onClose,
  order,
  productRatings,
  onRatingChange,
  onSubmit,
  isSubmitting,
}: RatingModalProps) {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="items-center justify-center flex-1">
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-black/80"
          onPress={onClose}
        />

        <View className="bg-surface rounded-3xl w-[90%] max-h-[85%] overflow-hidden shadow-2xl">
          {/* Header */}
          <View className="items-center px-6 pt-8 pb-6 border-b bg-surface border-surface-light">
            <View className="items-center justify-center mb-4 rounded-full size-14 bg-primary/10">
              <Ionicons name="star" size={28} color="#1DB954" />
            </View>
            <Text className="text-xl font-bold text-center text-text-primary">
              Rate Your Order
            </Text>
            <Text className="mt-1 text-sm text-center text-text-secondary">
              Order #{order._id.slice(-6).toUpperCase()}
            </Text>
          </View>

          {/* List of Products */}
          <FlatList
            data={order.orderItems}
            renderItem={({ item }) => (
              <ProductRatingRow
                item={item}
                rating={productRatings[item.product._id] || 0}
                onRate={(r: number) => onRatingChange(item.product._id, r)}
              />
            )}
            keyExtractor={(item) => item.product._id}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 24,
            }}
            indicatorStyle="white"
            persistentScrollbar={true}
          />

          {/* Footer */}
          <View className="p-6 border-t border-surface-light bg-surface">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 bg-primary rounded-2xl"
              activeOpacity={0.8}
              onPress={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#121212" />
              ) : (
                <>
                  <Text className="mr-2 text-base font-bold text-background">
                    Submit Reviews
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#121212" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center py-4 mx-auto w-fit"
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text className="text-base font-semibold text-text-secondary">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
