import { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Order } from "@/types";
import useOrders from "@/hooks/useOrders";
import useReviews from "@/hooks/useReviews";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import NavHeader from "@/components/profile/NavHeader";
import EmptyFound from "@/components/profile/EmptyFound";
import OrderCard from "@/components/profile/orders/OrderCard";
import RatingModal from "@/components/profile/orders/RatingModal";

export default function OrdersScreen() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{
    [key: string]: number;
  }>({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  function handleOpenRating(order: Order) {
    setShowRatingModal(true);
    setSelectedOrder(order);

    // init ratings for all product to 0 rating
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });
    setProductRatings(initialRatings);
  }

  async function handleSubmitRating() {
    if (!selectedOrder) return;

    // check if all products have been rated
    const unratedProducts = Object.values(productRatings).some(
      (rating) => rating === 0,
    );
    if (unratedProducts) {
      return Alert.alert(
        "Missing Ratings",
        "Please rate all products to continue.",
      );
    }

    try {
      // Process all reviews in parallel
      const reviewPromises = selectedOrder.orderItems.map((item) =>
        createReviewAsync({
          productId: item.product._id,
          orderId: selectedOrder._id,
          rating: productRatings[item.product._id],
        }),
      );

      await Promise.all(reviewPromises);

      Toast.show({
        type: "success",
        text1: "Thank you!",
        text2: "Your reviews have been submitted.",
      });
      setShowRatingModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error?.response?.data?.message || "Could not submit reviews",
      });
    }
  }

  if (isLoading) return <LoadingUI title="My Orders" />;
  if (isError) return <ErrorUI title="My Orders" />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <NavHeader title="My Orders" />

      {!orders || orders.length === 0 ? (
        // EMPTY ORDERS
        <EmptyFound
          icon="cart-outline"
          title="No orders yet"
          subtitle1="It looks like you haven't ordered anything yet."
          subtitle2="Start Shopping"
          onPress={() => router.replace("/(tabs)")}
        />
      ) : (
        // ORDERS LIST
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onRatePress={() => handleOpenRating(item)}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1DB954"
              colors={["#1DB954"]}
              progressBackgroundColor="#121212"
            />
          }
        />
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
      />
    </SafeAreaView>
  );
}
