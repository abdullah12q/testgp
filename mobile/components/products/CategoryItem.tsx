import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryItem({
  category,
  isSelected,
  setSelectedCategory,
}: {
  category: {
    name: string;
    icon?: any;
    image?: any;
  };
  isSelected: boolean;
  setSelectedCategory: (category: string) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => setSelectedCategory(category.name)}
      className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
    >
      {category.icon ? (
        <Ionicons
          name={category.icon}
          size={36}
          color={isSelected ? "#121212" : "#fff"}
        />
      ) : (
        <Image
          source={category.image}
          className={
            category.name === "Beauty" || category.name === "Home"
              ? "size-14"
              : "size-12"
          }
        />
      )}
    </TouchableOpacity>
  );
}
