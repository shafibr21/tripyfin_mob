import { useAuthStore } from "@/src/features/auth/auth.store";
import { addDeposit } from "@/src/features/trips/trips.api";
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

interface AddDepositModalProps {
  visible: boolean;
  onClose: () => void;
  lobbyId: string;
  lobbyName: string;
  onSuccess?: (transactionId?: string | null) => void;
}

export default function AddDepositModal({
  visible,
  onClose,
  lobbyId,
  lobbyName,
  onSuccess,
}: AddDepositModalProps) {
  const user = useAuthStore((s) => s.user);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 500, 1000];

  const handleQuickAmount = (value: number) => {
    const current = parseInt(amount || "0");
    setAmount(String(current + value));
  };

  const handleSubmit = async () => {
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: Number(amount),
        description,
        userId: user?.id,
      } as any;

      const resData = await addDeposit(lobbyId, payload);
      // addDeposit returns response data (backend returns { message, transactionId })
      const transactionId = resData?.transactionId ?? null;
      Alert.alert("Deposit added", "Your deposit was added successfully.");
      onClose();
      if (typeof onSuccess === "function") onSuccess(transactionId);
      console.log("Deposit created", { transactionId, resData });
    } catch (err: any) {
      console.error("Add deposit error", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add deposit";
      Alert.alert("Error", msg);
    } finally {
        setAmount("");
        setDescription("");
        setLoading(false);
    }
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
                  Make Deposit
                </Text>
                <Text className="text-green-300 text-xs mt-1">
                  Add money to the lobby for {lobbyName || "this lobby"}
                </Text>
              </View>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            {/* Amount Input */}
            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">Amount (৳)</Text>
              <View className="bg-[#0F3A26] rounded-2xl px-4 py-4 flex-row items-center">
                <Text className="text-white text-xl mr-2">৳</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="1000"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  className="flex-1 text-white text-xl"
                />
              </View>
            </View>

            {/* Quick Amount Buttons */}
            <View className="flex-row space-x-3 mb-4">
              {quickAmounts.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleQuickAmount(value)}
                  className="bg-[#0F3A26] px-4 py-2 rounded-full"
                >
                  <Text className="text-green-400 text-sm">+{value}</Text>
                </Pressable>
              ))}
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">
                Description <Text className="text-gray-500">(Optional)</Text>
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Additional deposit"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={3}
                className="bg-[#0F3A26] rounded-2xl px-4 py-3 text-white"
                style={{ textAlignVertical: "top" }}
              />
            </View>

            {/* Info Message */}
            <View className="bg-blue-900/30 border border-blue-700 rounded-2xl p-3 mb-4 flex-row">
              <Text className="text-blue-400 text-xl mr-2">ℹ</Text>
              <Text className="flex-1 text-blue-300 text-xs">
                This deposit will be added to the common pool and can be used
                for shared expenses by the lobby leader.
              </Text>
            </View>

            {/* Action Buttons */}
            <Pressable
              onPress={handleSubmit}
              className="bg-green-400 py-4 rounded-2xl mb-3"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-green-950 font-semibold text-base mr-2">
                  Add Deposit
                </Text>
                <Text className="text-green-950 text-lg">💳</Text>
              </View>
            </Pressable>

            <Pressable onPress={onClose} className="py-3">
              <Text className="text-green-300 text-center font-medium">
                Cancel
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
