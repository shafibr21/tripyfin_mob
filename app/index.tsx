import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import JoinLobbyModal from "@/app/modal/join-lobby";
import { FeatureCard } from "@/components/FeatureCard";
import { PhoneMockupDashboard } from "@/components/PhoneMockupDashboard";
import { getMe } from "@/src/features/profile/profile.api";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const data = await getMe();
        if (data?.profilePictureUrl) {
          setProfilePictureUrl(data.profilePictureUrl);
        }
      } catch (err) {
        console.warn("Failed to load profile for picture", err);
      }
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#0B2B1C]">
        {/* TopAppBar */}
        <View className="flex-row items-center justify-between px-6 py-4 z-50 shadow-md">
          <View className="flex-row items-center gap-2">
            <Ionicons name="wallet-outline" size={25} color="#00FF88" />
            <Text className="text-3xl font-bold text-[#f1ffef] tracking-tighter font-medium">
              TripyFin
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => setShowJoinModal(true)}
              className="bg-[#00FF88] px-4 py-2 rounded-full"
            >
              <Text className="text-[#003919] text-xs font-bold uppercase tracking-widest">
                Join Lobby
              </Text>
            </TouchableOpacity>

            {isLoggedIn && (
              <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                {profilePictureUrl ? (
                  <Image source={{ uri: profilePictureUrl }} className="w-10 h-10 rounded-full border-2 border-[#1a2b23]" />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-[#1c2d27] items-center justify-center border-2 border-[#1a2b23]">
                    <Ionicons name="person" size={20} color="#00FF88" />
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1 px-5 pt-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View className="items-center mb-16 relative">
            <View className="absolute -top-20 -right-20 w-64 h-64 bg-[#00FF88]/10 rounded-full blur-[80px]" />
            
            <Text className="text-5xl font-extrabold text-[#f1ffef] text-center tracking-tighter leading-none mb-6 mt-4">
              Group Travel{"\n"}Expenses,{"\n"}
              <Text className="text-[#00FF88]">Simplified</Text>
            </Text>
            
            <Text className="text-[#a1bbac] text-lg text-center leading-relaxed mb-10 px-2 font-medium">
              Track trips, split costs, and manage spending — all in one place.
            </Text>

            <View className="w-full max-w-[300px] gap-4">
              <TouchableOpacity
                onPress={() => router.push(isLoggedIn ? "/trips" : "/(auth)/login")}
                style={{ shadowColor: "#00FF88", shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 }}
                className="bg-[#00FF88] py-4 rounded-full items-center justify-center"
              >
                <Text className="text-[#003919] font-bold text-base">Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone Mockup Dashboard */}
          <PhoneMockupDashboard />  

          {/* Feature Highlights */}
          <View className="mb-24 gap-4">
            <FeatureCard 
              icon="apps-outline" 
              title="Smart Trip Management" 
              desc="Organize multiple itineraries and expenses with centralized ledger control." 
            />
            <FeatureCard 
              icon="flash-outline" 
              title="Live Expense Tracking" 
              desc="Real-time updates as soon as anyone in the group logs a new cost." 
            />
            <FeatureCard 
              icon="wallet-outline" 
              title="Centralized Pool System" 
              desc="Fund a shared pool upfront and track it as it depletes throughout the trip." 
            />
            <FeatureCard   
              icon="git-network-outline" 
              title="Flexible Splitting" 
              desc="Split by percentage, fixed amounts, or share weights with ease." 
            />
          </View>

          {/* Value Section */}
          <View className=" bg-[#0d1f18] p-8 rounded-3xl items-center border border-[#1a2b23] relative overflow-hidden">
            <View className="absolute top-0 w-full h-full bg-[#00FF88]/10" />
            <View className="flex-row gap-4 mb-6 relative z-10">
              <Ionicons name="close" size={24} color="rgba(0,255,136,0.4)" />
              <Ionicons name="calculator" size={24} color="rgba(0,255,136,0.4)" />
              <Ionicons name="close" size={24} color="rgba(0,255,136,0.4)" />
            </View>
            <Text className="text-2xl font-bold text-[#f1ffef] text-center mb-4 leading-snug tracking-tight relative z-10">
              No more messy calculations or confusion during trips
            </Text>
            <Text className="text-[#a1bbac] text-sm text-center relative z-10">
              Focus on the memories, let Ledger handle the math.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <JoinLobbyModal visible={showJoinModal} onClose={() => setShowJoinModal(false)} onSuccess={() => router.push("/trips")} />
    </>
  );
}


