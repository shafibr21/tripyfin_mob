import { generateInviteCode } from "@/src/features/trips/trips.api";
import * as Clipboard from "expo-clipboard";
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

interface AddInviteModalProps {
  visible: boolean;
  onClose: () => void;
  lobbyId: string;
  lobbyName?: string;
  initialDeposit?: number;
}

export default function AddInviteModal({
  visible,
  onClose,
  lobbyId,
  lobbyName,
  initialDeposit,
}: AddInviteModalProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await generateInviteCode(String(lobbyId));
      const c = data?.inviteCode ?? data?.code ?? null;
      if (c) {
        setCode(c);
      } else {
        setMessage("No code returned by server");
      }
    } catch (err: any) {
      console.error("Generate invite error", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate invite code";
      setMessage(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvitation = () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }
    setMessage(`Invitation sent to ${email}`);
    setEmail("");
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
                <Text className="text-white text-lg font-bold">
                  Invite Members
                </Text>
                <Text className="text-green-300 text-xs mt-1">
                  Invite friends to join{" "}
                  {lobbyName ? `"${lobbyName}"` : "this lobby"}
                </Text>
                {typeof initialDeposit === "number" && (
                  <Text className="text-green-300 text-xs mt-1">
                    New members will need to deposit ৳{initialDeposit} to join
                  </Text>
                )}
              </View>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            {/* <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-white font-semibold">
                  📧 Invite by Email
                </Text>
              </View>

              <Text className="text-green-300 text-xs mb-2">
                Friend's Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="friend@example.com"
                placeholderTextColor="#6B7280"
                className="bg-[#0F3A26] rounded-2xl px-4 py-3 text-white"
              />

              <Pressable
                onPress={handleSendInvitation}
                className="bg-white/5 py-3 rounded-2xl mt-3"
              >
                <Text className="text-white text-center">Send Invitation</Text>
              </Pressable>
            </View>

            <View className="flex-row items-center my-3">
              <View className="flex-1 h-[1px] bg-[#164C32]" />
              <Text className="text-green-300 text-xs mx-3">OR</Text>
              <View className="flex-1 h-[1px] bg-[#164C32]" />
            </View> */}

            <View>
              <Text className="text-white font-semibold mb-2">
                Share Invite Link
              </Text>

              {code ? (
                <View>
                  <View className="bg-[#0F3A26] rounded-2xl px-4 py-3 mb-3 flex-row items-center justify-between">
                    <Text className="text-green-300">{code}</Text>
                    <Pressable
                      onPress={handleCopy}
                      className="px-3 py-1 rounded-full bg-green-400/10"
                    >
                      <Text className="text-green-400">Copy</Text>
                    </Pressable>
                  </View>
                  {copied && (
                    <Text className="text-green-300 text-xs mb-2">
                      Copied to clipboard
                    </Text>
                  )}
                  <Pressable
                    onPress={() => {
                      setCode(null);
                      setMessage(null);
                    }}
                    className="py-2"
                  >
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={handleGenerate}
                  className="bg-[#0F3A26] py-4 rounded-2xl"
                >
                  <Text className="text-green-300 text-center">
                    {loading ? "Generating..." : "Generate Invite Link"}
                  </Text>
                </Pressable>
              )}

              {message && (
                <Text className="text-yellow-300 text-xs mt-3">{message}</Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
