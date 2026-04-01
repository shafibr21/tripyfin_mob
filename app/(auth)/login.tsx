import SocialMediaLoginBtn from "@/components/SocialMediaLoginBtn";
import { authApi } from "@/src/features/auth/auth.api";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
//import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
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

  // const handleGoogleLogin = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     await GoogleSignin.hasPlayServices();
  //     const response = await GoogleSignin.signIn();
  //     const idToken = response.data?.idToken || (response as any).idToken;

  //     if (!idToken) {
  //       throw new Error("No ID Token found from Google");
  //     }

  //     const res = await authApi.googleLoginApi(idToken);
  //     if (!res || !res.token) {
  //       throw new Error("Backend did not return a valid token");
  //     }

  //     await login(res.token, res.user);
  //     router.replace("/(tabs)/trips");
  //   } catch (err: any) {
  //     console.error("Google Login error:", err);
  //     // Ignore cancellation
  //     if (err.code !== "SIGN_IN_CANCELLED" && err.code !== "12501") {
  //       setError(err.message || "Google Login failed");
  //       Alert.alert("Google Login Error", String(err.message || "Something went wrong"));
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1">
        {/* Header with Mountain Background */}
        <View className=" pt-2">
          <View className="flex-row items-center gap-2 justify-center">
            <Ionicons name="wallet-outline" size={40} color="#00FF88" className="mb-3" />
            <Text className="text-white text-6xl font-bold text-center mb-2 font-medium">
              TripyFin
            </Text>
          </View>
          {/* Welcome Image */}
          <View className="h-64 w-full justify-center items-center">
            <Image
              source={require("@/assets/images/welcome.avif")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>
        {/* Content */}
        <View className="flex-1 px-6 pt-4">
          {/* Header Text */}
          <View className="mb-8 items-center justify-center">
            <Text className="text-white text-4xl font-medium">Welcome Back</Text>
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
            className="bg-green-400 py-4 rounded-2xl mt-4"
          >
            <Text className="text-center text-green-950 font-bold text-base">
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View className="mt-4">
            <Text className="text-center text-gray-500 mb-4">
              OR CONTINUE WITH
            </Text>

            <View className="flex-row justify-center gap-4">
              <SocialMediaLoginBtn
                iconName="logo-google"
                title="Google"
                // onPress={handleGoogleLogin}
                disabled={loading}
              />
              <SocialMediaLoginBtn
                iconName="logo-apple"
                title="Apple"
                disabled={loading}
              />
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
