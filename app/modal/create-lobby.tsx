import { createLobby } from "@/src/features/trips/trips.api";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

interface CreateLobbyModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateLobbyModal({
  visible,
  onClose,
  onSuccess,
}: CreateLobbyModalProps) {
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name) {
      setMessage("Please enter a lobby name");
      return;
    }

    const depositAmount = deposit ? Number(deposit) : 0;
    if (depositAmount < 0 || Number.isNaN(depositAmount)) {
      setMessage("Please enter a valid deposit amount");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await createLobby({ name, initialDeposit: depositAmount });
      setMessage("Lobby created successfully");
      try {
        if (typeof onSuccess === "function") onSuccess();
      } catch (e) {
        console.warn("CreateLobbyModal onSuccess handler failed", e);
      }
      setTimeout(() => {
        onClose();
        setName("");
        setDeposit("");
      }, 800);
    } catch (err: any) {
      console.error("Create lobby error", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create lobby";
      setMessage(String(msg));
    } finally {
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
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Create Lobby</Text>
                <Text className="text-green-300 text-xs mt-1">
                  Start a new shared trip fund
                </Text>
              </View>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">Lobby Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Summer Vacation 2026"
                placeholderTextColor="#6B7280"
                className="bg-[#0F3A26] rounded-2xl px-4 py-3 text-white"
              />
            </View>

            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">
                Initial Deposit (Optional)
              </Text>
              <TextInput
                value={deposit}
                onChangeText={setDeposit}
                placeholder="1000"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                className="bg-[#0F3A26] rounded-2xl px-4 py-3 text-white"
              />
            </View>

            {message && (
              <Text className="text-yellow-300 text-xs mb-3">{message}</Text>
            )}

            <Pressable
              onPress={handleCreate}
              className="bg-green-400 py-4 rounded-2xl mb-3"
            >
              <Text className="text-green-950 text-center font-semibold">
                {loading ? "Creating..." : "Create Lobby"}
              </Text>
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
