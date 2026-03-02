import { View, Text, TextInput, TextInputProps } from "react-native";

export default function FormField({
  label,
  ...props
}: {
  label: string;
} & TextInputProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 font-semibold text-text-primary">{label}</Text>
      <TextInput
        className="p-4 text-base bg-surface text-text-primary rounded-2xl"
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
}
