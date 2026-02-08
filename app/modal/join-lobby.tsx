import { joinLobbyByCodeDeposit } from "@/src/features/trips/trips.api";
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

interface JoinLobbyModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JoinLobbyModal({
  visible,
  onClose,
  onSuccess,
}: JoinLobbyModalProps) {
  const [code, setCode] = useState("");
  const [deposit, setDeposit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!code) {
      setMessage("Please enter the invite code");
      return;
    }
    if (!deposit || Number.isNaN(Number(deposit)) || Number(deposit) <= 0) {
      setMessage("Please enter the required initial deposit amount");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await joinLobbyByCodeDeposit(code, Number(deposit));
      setMessage("Joined lobby successfully");
      try {
        if (typeof onSuccess === "function") onSuccess();
      } catch (e) {
        console.warn("JoinLobbyModal onSuccess handler failed", e);
      }
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error("Join lobby error", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to join lobby";
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
                <Text className="text-white text-lg font-bold">Join Lobby</Text>
                <Text className="text-green-300 text-xs mt-1">
                  Enter the code given by a member
                </Text>
              </View>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">Invite Code</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="ABCD1234"
                placeholderTextColor="#6B7280"
                className="bg-[#0F3A26] rounded-2xl px-4 py-3 text-white"
              />
            </View>

            <View className="mb-4">
              <Text className="text-green-300 text-xs mb-2">
                Initial Deposit (if required)
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
              onPress={handleJoin}
              className="bg-green-400 py-4 rounded-2xl mb-3"
            >
              <Text className="text-green-950 text-center font-semibold">
                {loading ? "Joining..." : "Join Lobby"}
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
