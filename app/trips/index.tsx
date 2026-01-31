import { Tab } from "@/components/Avatar";
import { LobbyCard } from "@/components/LobbyCard";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

export default function TripsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-row items-center space-x-3">
            <View className="h-10 w-10 rounded-full bg-green-700 items-center justify-center">
              <Text className="text-white font-semibold">S</Text>
            </View>
            <Text className="text-white text-lg font-semibold">
              Travel Lobbies
            </Text>
          </View>

          <View className="h-9 w-9 rounded-full bg-[#13422C] items-center justify-center">
            <Text className="text-green-400">🔔</Text>
          </View>
        </View>

        {/* Create Lobby */}
        <Pressable className="bg-green-400 py-4 rounded-2xl mb-6 active:opacity-90">
          <Text className="text-center text-green-950 font-semibold text-base">
            + Create New Lobby
          </Text>
        </Pressable>

        {/* Active Section */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-semibold">
            Your Active Lobbies
          </Text>
          <Text className="text-green-400 text-xs font-semibold">
            2 ACTIVE
          </Text>
        </View>

        {/* Lobby Card – Leader */}
        <LobbyCard
          role="LEADER"
          title="Winter Escape 2024"
          subtitle="Trip to Sajek Valley"
          balance="৳7,500"
          progress={75}
          action="Manage"
        />

        {/* Lobby Card – Member */}
        <LobbyCard
          role="MEMBER"
          title="Tea Garden Retreat"
          subtitle="Weekend in Sylhet"
          balance="৳12,200"
          progress={80}
          action="View Details"
          contribution="৳2,000 / 2,500"
        />

        {/* Past Memories */}
        <Text className="text-white font-semibold mt-8 mb-4">
          Past Memories
        </Text>

        <View className="flex-row space-x-4 mb-10">
          <View className="h-36 flex-1 rounded-2xl bg-[#13422C]" />
          <View className="h-36 flex-1 rounded-2xl bg-[#13422C]" />
        </View>
      </ScrollView>

      {/* Bottom Tabs (Mock) */}
      <View className="flex-row justify-around items-center h-16 bg-[#0F3A26] border-t border-green-900">
        <Tab label="Lobby" active />
        <Tab label="Expenses" />
        <Tab label="Network" />
        <Tab label="Profile" />
      </View>
    </SafeAreaView>
  );
}
