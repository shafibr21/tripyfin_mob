import { authApi } from "@/src/features/auth/auth.api";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await authApi.loginApi({ email, password });
      console.log("Login response:", res);
      if (!res || !res.token) {
        const msg = "Server did not return an auth token";
        console.error(msg, res);
        setError(msg);
        Alert.alert("Login Error", msg);
        return;
      }

      await login(res.token, res.user);

      router.replace("/(tabs)/trips");
    } catch (err: any) {
      console.error("Login error:", err?.response ?? err);
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(message);
      Alert.alert("Login Error", String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1">
        {/* Header with Mountain Background */}
        <View className="bg-[#0F3A26] pt-4 pb-8 px-6">
          <Text className="text-white text-xl font-bold text-center mb-2">
            TripYfin
          </Text>
          {/* Mountain Graphic Placeholder */}
          <View className="h-24 justify-center items-center opacity-30">
            <View className="flex-row items-end gap-1">
              <View
                className="w-16 h-12 bg-green-800/40"
                style={{ transform: [{ skewY: "-10deg" }] }}
              />
              <View
                className="w-20 h-16 bg-green-800/60"
                style={{ transform: [{ skewY: "10deg" }] }}
              />
              <View
                className="w-16 h-12 bg-green-800/40"
                style={{ transform: [{ skewY: "-10deg" }] }}
              />
            </View>
          </View>
        </View>
        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          {/* Header Text */}
          <View className="mb-8">
            <Text className="text-white text-3xl font-bold">Welcome Back</Text>
            <Text className="text-green-200/70 mt-2 text-base">
              Manage your travel funds effortlessly
            </Text>
          </View>

          {/* Input Fields */}
          <View className="space-y-4">
            {/* Email */}
            <View>
              <Text className="text-white text-sm mb-2 font-medium">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base"
              />
            </View>

            {/* Password */}
            <View className="mt-4">
              <Text className="text-white text-sm mb-2 font-medium">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <Pressable
              className="mt-2 self-end"
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text className="text-green-400 text-sm font-medium">
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          {/* Error */}
          {error ? (
            <Text className="text-red-400 mt-4 text-sm">{error}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleLogin}
            className="bg-green-400 py-4 rounded-2xl mt-6"
          >
            <Text className="text-center text-green-950 font-bold text-base">
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View className="mt-8">
            <Text className="text-center text-gray-500 mb-4">
              OR CONTINUE WITH
            </Text>

            <View className="flex-row justify-center gap-4">
              <TouchableOpacity className="border border-gray-600 px-6 py-3 rounded-xl">
                <Text className="text-white">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-gray-600 px-6 py-3 rounded-xl">
                <Text className="text-white">Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-400">Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="text-green-400">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
