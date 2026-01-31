import { authApi } from "@/src/features/auth/auth.api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setPasswordsMatch(password === confirm && password.length > 0);
  }, [password, confirm]);

  const updatePassword = async () => {
    if (password !== confirm) return;
    if (!hasMinLength || !hasNumber || !hasSpecialChar) return;

    try {
      setLoading(true);
      await authApi.resetPasswordApi({ email, password } as any);
      router.replace("/(auth)/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          <Text className="text-white text-lg font-semibold">
            Create New Password
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-3xl font-bold mb-3">
            Create New Password
          </Text>
          <Text className="text-green-200/70 mb-8 text-base">
            Choose a strong password for your account to keep your travel funds
            secure.
          </Text>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">
              New Password
            </Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base pr-12"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#10B981"
                />
              </Pressable>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-white text-sm mb-2 font-medium">
              Confirm New Password
            </Text>
            <View className="relative">
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Re-enter new password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showConfirm}
                className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base pr-12"
              />
              <Pressable
                onPress={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-4"
              >
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#10B981"
                />
              </Pressable>
            </View>
          </View>

          {/* Password Requirements */}
          <View className="mb-8">
            <Text className="text-white text-sm font-medium mb-3">
              Password Requirements:
            </Text>

            <View className="flex-row items-center mb-2">
              <Ionicons
                name={hasMinLength ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={hasMinLength ? "#10B981" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm ${hasMinLength ? "text-green-400" : "text-gray-400"}`}
              >
                At least 8 characters
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons
                name={hasNumber ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={hasNumber ? "#10B981" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm ${hasNumber ? "text-green-400" : "text-gray-400"}`}
              >
                Includes a number
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons
                name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={hasSpecialChar ? "#10B981" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm ${hasSpecialChar ? "text-green-400" : "text-gray-400"}`}
              >
                Includes a special character (!@#$%)
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name={passwordsMatch ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={passwordsMatch ? "#10B981" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm ${passwordsMatch ? "text-green-400" : "text-gray-400"}`}
              >
                Passwords must match
              </Text>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            disabled={
              loading ||
              !hasMinLength ||
              !hasNumber ||
              !hasSpecialChar ||
              !passwordsMatch
            }
            onPress={updatePassword}
            className={`py-4 rounded-2xl ${!hasMinLength || !hasNumber || !hasSpecialChar || !passwordsMatch ? "bg-green-800/30" : "bg-green-400"}`}
          >
            <Text className="text-center text-green-950 font-bold text-base">
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
