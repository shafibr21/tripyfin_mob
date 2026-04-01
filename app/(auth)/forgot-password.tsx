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
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-center py-4 mb-2 relative">
          <Pressable onPress={() => router.back()} className="absolute left-[-8px] p-2">
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-base font-bold">Reset Password</Text>
        </View>

        {/* Content */}
        <View className="flex-1 pt-6">
          <Text className="text-white text-2xl font-bold mb-3 tracking-wide">
            Forgot Password
          </Text>
          <Text className="text-[#8B9B94] mb-8 text-sm leading-5">
            Enter your email address to receive an OTP{"\n"}code.
          </Text>

          {/* Email Input */}
          <View>
            <Text className="text-white text-xs mb-2 font-bold">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#5A6D65"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-[#0F3A26] rounded-2xl px-5 py-4 text-white text-sm font-medium"
            />
          </View>

          {/* Send Code Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={sendCode}
            style={{ shadowColor: "#1ED760", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}
            className="bg-[#1ED760] py-4 rounded-3xl mt-8"
          >
            <Text className="text-center text-[#062612] font-bold text-base">
              {loading ? "Sending..." : "Send Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
