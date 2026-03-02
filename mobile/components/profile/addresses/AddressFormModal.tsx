import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressFormModalProps } from "@/types";
import FormField from "./FormField";

const DEFAULT_FORM = {
  label: "",
  fullName: "",
  streetAddress: "",
  city: "",
  phoneNumber: "",
  isDefault: false,
};

export default function AddressFormModal({
  visible,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: AddressFormModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (visible) {
      setForm(initialData || DEFAULT_FORM);
    }
  }, [visible, initialData]);

  function updateField(key: keyof typeof form, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const formNotChanged =
    form.label === initialData?.label &&
    form.fullName === initialData?.fullName &&
    form.streetAddress === initialData?.streetAddress &&
    form.city === initialData?.city &&
    form.phoneNumber === initialData?.phoneNumber &&
    form.isDefault === initialData?.isDefault;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 bg-background">
          {/* HEADER */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface">
            <Text className="text-2xl font-bold text-text-primary">
              {initialData ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24, paddingBottom: 50 }}
            keyboardShouldPersistTaps="handled"
          >
            <FormField
              label="Label"
              placeholder="e.g., Home, Work"
              value={form.label}
              onChangeText={(t) => updateField("label", t)}
            />
            <FormField
              label="Full Name"
              placeholder="Enter full name"
              value={form.fullName}
              onChangeText={(t) => updateField("fullName", t)}
            />
            <FormField
              label="Street Address"
              placeholder="Enter street address"
              value={form.streetAddress}
              onChangeText={(t) => updateField("streetAddress", t)}
              multiline
            />
            <FormField
              label="City"
              placeholder="e.g., New York"
              value={form.city}
              onChangeText={(t) => updateField("city", t)}
            />
            <FormField
              label="Phone Number"
              placeholder="+20 123 456 7890"
              value={form.phoneNumber}
              onChangeText={(t) => updateField("phoneNumber", t)}
              keyboardType="phone-pad"
            />

            {/* Default Switch */}
            <View className="flex-row items-center justify-between p-4 mb-6 bg-surface rounded-2xl">
              <Text className="font-semibold text-text-primary">
                Set as default address
              </Text>
              <Switch
                value={form.isDefault}
                onValueChange={(v) => updateField("isDefault", v)}
                trackColor={{ true: "#1DB954" }}
                thumbColor="white"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className="items-center py-5 bg-primary rounded-2xl disabled:opacity-50"
              activeOpacity={0.8}
              onPress={() => onSubmit(form)}
              disabled={isSubmitting || formNotChanged}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Text className="text-lg font-bold text-background">
                  {initialData ? "Save Changes" : "Add Address"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
