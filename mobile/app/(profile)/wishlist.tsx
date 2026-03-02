import { FlatList, Text } from "react-native";
import { router } from "expo-router";
import useWishlist from "@/hooks/useWishlist";
import { SafeAreaView } from "react-native-safe-area-context";
import WishlistProductItem from "@/components/profile/wishlist/WishlistProductItem";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import NavHeader from "@/components/profile/NavHeader";
import EmptyFound from "@/components/profile/EmptyFound";

export default function WishlistScreen() {
  const { wishlist, isLoading, isError } = useWishlist();

  if (isLoading) return <LoadingUI title="Wishlist" />;
  if (isError) return <ErrorUI title="Wishlist" />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER */}
      <NavHeader title="Wishlist">
        <Text className="ml-auto text-sm text-text-secondary">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </NavHeader>

      {wishlist.length === 0 ? (
        // EMPTY WISHLIST
        <EmptyFound
          icon="heart-outline"
          title="Your wishlist is empty"
          subtitle1="Start adding products you love!"
          subtitle2="Browse Products"
          onPress={() => router.replace("/(tabs)")}
        />
      ) : (
        // PRODUCT LIST
        <FlatList
          data={wishlist}
          renderItem={({ item }) => <WishlistProductItem item={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 24,
            paddingTop: 16,
          }}
        />
      )}
    </SafeAreaView>
  );
}
