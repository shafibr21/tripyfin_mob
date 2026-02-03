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
    ScrollView,
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
        // last-resort: try globalThis
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

interface AddIndividualExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  lobbyId: string;
  lobbyName: string;
  members?: any[];
}

export default function AddIndividualExpenseModal({
  visible,
  onClose,
  lobbyId,
  lobbyName,
  members = [],
}: AddIndividualExpenseModalProps) {
  const user = useAuthStore((s) => s.user);
  const [description, setDescription] = useState("");
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const totalAmount = Object.values(memberAmounts).reduce(
    (sum, amount) => sum + (parseFloat(amount) || 0),
    0,
  );

  const handleAmountChange = (memberId: string, value: string) => {
    setMemberAmounts((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const handleSubmit = () => {
    if (totalAmount <= 0) {
      Alert.alert("Invalid amount", "Total must be greater than zero.");
      return;
    }
    (async () => {
      // resolve actor id: prefer auth store, fallback to token decode
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

      const items = Object.entries(memberAmounts)
        .map(([memberId, amt]) => ({
          userId: memberId,
          amount: Number(amt) || 0,
        }))
        .filter((it) => it.userId && it.amount > 0);

      if (items.length === 0) {
        Alert.alert(
          "No amounts",
          "Please enter amounts for at least one member.",
        );
        return;
      }

      const payload = {
        description,
        type: "expense_individual",
        individualAmounts: items,
        userId: actorId,
      } as any;

      console.log("add individual payload", { lobbyId, payload });

      setLoading(true);
      try {
        const res = await addExpense(lobbyId, payload);
        Alert.alert("Expense added", "Individual expense added successfully.");
        setDescription("");
        setMemberAmounts({});
        onClose();
        console.log("Individual expense created", res);
      } catch (err: any) {
        console.error("Add individual expense error", err);
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
          className="bg-[#0B2B1C] rounded-t-3xl max-h-[85%]"
        >
          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  Add Individual Expense
                </Text>
                <Text className="text-green-300 text-xs mt-1">
                  Enter individual amounts for each member
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
                  placeholder="e.g., Lunch at restaurant"
                  placeholderTextColor="#6B7280"
                  className="flex-1 text-white text-base"
                />
                <View className="flex-row space-x-1">
                  <View className="h-8 w-8 rounded-full bg-green-400/20 items-center justify-center">
                    <Text className="text-green-400 text-sm">😊</Text>
                  </View>
                  <View className="h-8 w-8 rounded-full bg-green-400/20 items-center justify-center">
                    <Text className="text-green-400 text-sm">📎</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Individual Amounts */}
            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-3">
                Individual Amounts (৳)
              </Text>
              {members.length > 0 ? (
                members.map((member) => (
                  <View
                    key={member._id || member.userId}
                    className="bg-[#0F3A26] rounded-2xl px-4 py-3 mb-3 flex-row items-center justify-between"
                  >
                    <Text className="text-white font-medium">
                      {member.user?.name || member.userId || "Member"}
                    </Text>
                    <View className="bg-[#0B2B1C] rounded-xl px-3 py-2 w-24">
                      <TextInput
                        value={memberAmounts[member._id || member.userId] || ""}
                        onChangeText={(value) =>
                          handleAmountChange(member._id || member.userId, value)
                        }
                        placeholder="0"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        className="text-white text-center"
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View className="bg-[#0F3A26] rounded-2xl px-4 py-3 mb-3">
                  <Text className="text-gray-400 text-center">
                    No members found
                  </Text>
                </View>
              )}
            </View>

            {/* Total */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm">
                Total:{" "}
                <Text className="text-white font-semibold">
                  ৳{totalAmount.toFixed(2)}
                </Text>
              </Text>
            </View>

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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
