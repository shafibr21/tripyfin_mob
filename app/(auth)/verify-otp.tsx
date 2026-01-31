import { authApi } from "@/src/features/auth/auth.api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(59);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<any>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verify = async () => {
    try {
      setLoading(true);
      await authApi.verifyOtpApi({ email, otp: otp.join("") } as any);
      router.push({ pathname: "/(auth)/reset-password", params: { email } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await authApi.forgotPasswordApi({ email } as any);
      setSeconds(59);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-[#0F3A26] pt-4 pb-6 px-6 flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-lg font-semibold">Verification</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-3xl font-bold mb-3">
            Verify Email
          </Text>
          <Text className="text-green-200/70 mb-8 text-base">
            We sent a 4-digit code to your email.
          </Text>

          {/* OTP Circles */}
          <View className="flex-row justify-center gap-4 mb-8">
            {otp.map((digit, index) => (
              <View
                key={index}
                className="w-16 h-16 rounded-full border-2 border-green-600 bg-[#0F3A26] items-center justify-center"
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="text-white text-2xl font-bold text-center w-full"
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !digit &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                />
              </View>
            ))}
          </View>

          {/* Resend Code Section */}
          <View className="items-center mb-8">
            <Text className="text-green-200/70 mb-3">Resend code in</Text>
            <View className="flex-row gap-3 items-center">
              <View className="bg-[#0F3A26] border border-green-800/50 rounded-xl px-5 py-3">
                <Text className="text-green-400 text-xl font-bold">00</Text>
                <Text className="text-green-200/50 text-xs text-center">
                  Minutes
                </Text>
              </View>
              <View className="bg-[#0F3A26] border border-green-800/50 rounded-xl px-5 py-3">
                <Text className="text-green-400 text-xl font-bold">
                  {seconds.toString().padStart(2, "0")}
                </Text>
                <Text className="text-green-200/50 text-xs text-center">
                  Seconds
                </Text>
              </View>
            </View>
          </View>

          {/* Resend Link */}
          <View className="items-center mb-8">
            <Text className="text-green-200/70">
              Didn't receive the code?{" "}
              <Text
                onPress={seconds === 0 ? resendCode : undefined}
                className={
                  seconds === 0
                    ? "text-green-400 font-medium"
                    : "text-green-800"
                }
              >
                Resend
              </Text>
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            disabled={loading || otp.join("").length !== 4}
            onPress={verify}
            className="bg-green-400 py-4 rounded-2xl mt-auto mb-8"
          >
            <Text className="text-center text-green-950 font-bold text-base">
              {loading ? "Verifying..." : "Verify & Proceed"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
