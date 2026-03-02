import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApi } from "@/api/axios";
import { Address } from "@/types";
import useCart from "@/hooks/useCart";
import useAddresses from "@/hooks/useAddresses";
import OrderSummary from "@/components/cart/OrderSummary";
import AddressSelectionModal from "@/components/cart/AddressSelectionModal";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";

export default function CartScreen() {
  const api = useApi();

  const {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdatingQuantity,
    isRemovingFromCart,
  } = useCart();

  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  function handleQuantityChange(
    productId: string,
    currentQuantity: number,
    change: number,
  ) {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  }

  function handleRemoveItem(productId: string, productName: string) {
    Toast.show({
      type: "deleteConfirmation",
      text1: "Remove from cart",
      text2: `Are you sure you want to remove ${productName}?`,
      position: "bottom",
      autoHide: false,
      props: {
        onConfirm: () => removeFromCart(productId),
      },
    });
  }

  function handleCheckout() {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Toast.show({
        type: "navigation",
        text1: "No Address",
        text2:
          "Please add a shipping address in your profile before checking out.",
        props: {
          onConfirm: () => router.push("/(profile)/addresses"),
        },
      });
      return;
    }

    setAddressModalVisible(true);
  }

  async function handleProceedWithPayment(
    selectedAddress: Address,
    paymentMethod: "card" | "cod",
  ) {
    setAddressModalVisible(false);

    try {
      setPaymentLoading(true);

      const shippingAddress = {
        fullName: selectedAddress.fullName,
        streetAddress: selectedAddress.streetAddress,
        city: selectedAddress.city,
        phoneNumber: selectedAddress.phoneNumber,
      };

      if (paymentMethod === "cod") {
        await api.post("/orders", {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
        });

        Toast.show({
          type: "success",
          text1: "Order Placed!",
          text2: "Please pay cash upon delivery.",
        });

        clearCart();
        return;
      }

      // create payment intent with cart items and shipping address
      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress,
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "TapCart",
      });

      if (initError) {
        Toast.show({ type: "error", text1: "Error", text2: initError.message });
        setPaymentLoading(false);
        return;
      }

      // present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Toast.show({
          type: "error",
          text1: "Payment cancelled",
          text2: presentError.message,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Payment successful",
          text2: "Your order is being processed.",
        });
        clearCart();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error instanceof Error ? error.message : "Failed to process payment",
      });
    } finally {
      setPaymentLoading(false);
    }
  }

  if (isLoading) return <LoadingUI title="Cart" />;
  if (isError) return <ErrorUI title="Cart" />;
  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="px-6 pt-6 pb-4 text-3xl font-bold tracking-tight text-text-primary">
        Cart
      </Text>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            isLoading={isUpdatingQuantity || isRemovingFromCart}
            onUpdateQuantity={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
        ListFooterComponent={() => (
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        )}
      />

      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 border-t pb-28 bg-background/95 backdrop-blur-xl border-surface">
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="ml-2 text-text-secondary">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          className="overflow-hidden bg-primary rounded-2xl"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="flex-row items-center justify-center py-5">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text className="mr-2 text-lg font-bold text-background">
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeAreaView>
  );
}
