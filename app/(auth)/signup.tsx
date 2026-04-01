import { authApi } from "@/src/features/auth/auth.api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import SocialMediaLoginBtn from "@/components/SocialMediaLoginBtn";
import {
  ActivityIndicator, Alert, Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await authApi.signupApi({ name, email, password });
      router.replace("/(auth)/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Signup failed";
      Alert.alert("Signup Error", String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1 px-6">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#0F3A26] items-center justify-center mt-4"
        >
          <Ionicons name="arrow-back" size={20} color="#10B981" />
        </Pressable>

        {/* Header */}
        <View className="mt-8">
          <Text className="text-white text-3xl font-bold">
            Create your account
          </Text>
          <Text className="text-green-200/70 mt-2 text-base">
            Start managing your group expenses{"\n"}seamlessly
          </Text>
        </View>

        {/* Input Fields */}
        <View className="mt-8 space-y-4">
          {/* Full Name */}
          <View>
            <Text className="text-white text-sm mb-2 font-medium">
              Full Name
            </Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#6B7280"
              className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View className="mt-4">
            <Text className="text-white text-sm mb-2 font-medium">Email</Text>
            <TextInput
              placeholder="hello@travelapp.com"
              placeholderTextColor="#6B7280"
              className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View className="mt-4">
            <Text className="text-white text-sm mb-2 font-medium">
              Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                className="bg-[#0F3A26] border border-green-800/50 rounded-2xl px-4 py-4 text-white text-base pr-12"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
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
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className={`py-4 rounded-2xl mt-8 ${loading ? "bg-green-700/60" : "bg-green-400"}`}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#064E3B"
              style={{ alignSelf: "center" }}
            />
          ) : (
            <Text className="text-center text-green-950 font-bold text-base">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mt-8">
          <View className="flex-1 h-[1px] bg-green-800/30" />
          <Text className="text-green-200/50 mx-4 text-sm">
            Or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-green-800/30" />
        </View>

        {/* Social Login Buttons */}
        <View className="flex-row gap-4 mt-6">
          <SocialMediaLoginBtn iconName="logo-google" title="Google" />
          <SocialMediaLoginBtn iconName="logo-apple" title="Apple" />
        </View>

        {/* Login Link */}
        <View className="mt-auto mb-6">
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-center text-green-200/70">
              Already have an account?{" "}
              <Text className="text-green-400 font-semibold">Login</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
