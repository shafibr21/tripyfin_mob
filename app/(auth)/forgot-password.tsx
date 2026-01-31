import { authApi } from "@/src/features/auth/auth.api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    try {
      setLoading(true);
      await authApi.forgotPasswordApi({ email });
      router.push({ pathname: "/(auth)/verify-otp", params: { email } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1">
        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-3xl font-bold mb-3">
            Forgot Password
          </Text>
          <Text className="text-green-200/70 mb-8 text-base">
            Enter your email address to receive an OTP code.
          </Text>

          {/* Email Input */}
          <View>
            <Text className="text-white text-sm mb-2 font-medium">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base"
            />
          </View>

          {/* Send Code Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={sendCode}
            className="bg-green-400 py-4 rounded-2xl mt-6"
          >
            <Text className="text-center text-green-950 font-bold text-base">
              {loading ? "Sending..." : "Send Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
