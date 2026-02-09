import { useAuthStore } from "@/src/features/auth/auth.store";
import { addExpense } from "@/src/features/trips/trips.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

function decodeJwtUserId(token?: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    let json = null as any;
    try {
      if (typeof atob === "function") {
        json = atob(b64);
      } else if (typeof Buffer !== "undefined") {
        json = Buffer.from(b64, "base64").toString("utf8");
      } else {
        const atobFn = (globalThis as any).atob;
        if (typeof atobFn === "function") json = atobFn(b64);
      }
    } catch (e) {
      // ignore
    }
    if (!json) return null;
    const payload = JSON.parse(json);
    return (
      payload?.id ?? payload?.userId ?? payload?.sub ?? payload?._id ?? null
    );
  } catch (e) {
    return null;
  }
}

interface AddBulkExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  lobbyId: string;
  lobbyName: string;
  memberCount?: number;
  onSuccess?: () => void;
}

export default function AddBulkExpenseModal({
  visible,
  onClose,
  lobbyId,
  lobbyName,
  memberCount = 1,
  onSuccess,
}: AddBulkExpenseModalProps) {
  const user = useAuthStore((s) => s.user);
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const perPersonAmount =
    totalAmount && memberCount > 0
      ? (parseFloat(totalAmount) / memberCount).toFixed(2)
      : "0.00";

  const handleSubmit = () => {
    if (
      !totalAmount ||
      Number.isNaN(Number(totalAmount)) ||
      Number(totalAmount) <= 0
    ) {
      Alert.alert("Invalid amount", "Please enter a valid total amount.");
      return;
    }
    (async () => {
      // resolve actor id
      let actorId = user?.id;
      if (!actorId) {
        const token = await AsyncStorage.getItem("token");
        actorId = decodeJwtUserId(token);
      }

      if (!actorId) {
        Alert.alert(
          "Not signed in",
          "Please sign in before adding an expense.",
        );
        return;
      }

      const payload = {
        type: "expense_equal",
        description,
        totalAmount: Number(totalAmount),
        memberCount,
        userId: actorId,
      } as any;

      console.log("add bulk payload", { lobbyId, payload });

      setLoading(true);
      try {
        const res = await addExpense(lobbyId, payload);
        Alert.alert("Expense added", "Bulk expense added successfully.");
        setDescription("");
        setTotalAmount("");
        onClose();
        if (typeof onSuccess === "function") onSuccess();
        console.log("Bulk expense created", res);
      } catch (err: any) {
        console.error("Add bulk expense error", err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to add expense";
        Alert.alert("Error", msg);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Pressable onPress={onClose} className="flex-1" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="bg-[#0B2B1C] rounded-t-3xl"
        >
          <View className="p-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  Add Equal Split Expense
                </Text>
                <Text className="text-green-300 text-xs mt-1">
                  This expense will be split equally among all members
                </Text>
              </View>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">Description</Text>
              <View className="bg-[#0F3A26] rounded-2xl px-4 py-4 flex-row items-center">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g., Bus fare"
                  placeholderTextColor="#6B7280"
                  className="flex-1 text-white text-base"
                />
                <View className="flex-row space-x-1">
                  {/* <View className="h-8 w-8 rounded-full bg-green-400/20 items-center justify-center">
                    <Text className="text-green-400 text-sm">📎</Text>
                  </View> */}
                </View>
              </View>
            </View>

            {/* Total Amount Input */}
            <View className="mb-2">
              <Text className="text-green-300 text-xs mb-2">
                Total Amount (৳)
              </Text>
              <View className="bg-[#0F3A26] rounded-2xl px-4 py-4">
                <TextInput
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                  placeholder="600"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  className="text-white text-xl"
                />
              </View>
            </View>

            {/* Per Person Amount */}
            <Text className="text-gray-400 text-xs mb-6">
              ৳{perPersonAmount} per person
            </Text>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-[#0F3A26] py-4 rounded-2xl"
              >
                <Text className="text-green-300 text-center font-semibold">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className="flex-1 bg-green-400 py-4 rounded-2xl"
              >
                <Text className="text-green-950 text-center font-semibold">
                  Add Expense
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
