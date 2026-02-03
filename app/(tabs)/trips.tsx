import { LobbyCard } from "@/components/LobbyCard";
import { getUserLobbies, Lobby } from "@/src/features/trips/trips.api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Trips() {
  const [lobbies, setLobbies] = useState<Lobby[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLobbies();
  }, []);

  const fetchLobbies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserLobbies();
      setLobbies(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load lobbies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
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
          <Text className="text-white font-semibold">Your Active Lobbies</Text>
          <Text className="text-green-400 text-xs font-semibold">
            {lobbies ? `${lobbies.length} ACTIVE` : "0 ACTIVE"}
          </Text>
        </View>

        {loading ? (
          <Text className="text-green-300">Loading lobbies...</Text>
        ) : error ? (
          <View>
            <Text className="text-red-400">{error}</Text>
            <Pressable
              onPress={fetchLobbies}
              className="mt-2 bg-green-400 py-2 px-3 rounded-2xl"
            >
              <Text className="text-green-950 text-center">Retry</Text>
            </Pressable>
          </View>
        ) : lobbies && lobbies.length > 0 ? (
          lobbies.map((lobby) => (
            <LobbyCard
              key={lobby.id}
              role={lobby.role ?? "MEMBER"}
              title={lobby.title}
              subtitle={lobby.subtitle ?? ""}
              balance={lobby.balance ?? "৳0"}
              progress={lobby.progress ?? 0}
              action={lobby.role === "LEADER" ? "Manage" : "View Details"}
              contribution={lobby.contribution}
              onActionPress={() => router.push({ pathname: "/lobby/[id]", params: { id: String(lobby.id) } })}
            />
          ))
        ) : (
          <Text className="text-green-300">No active lobbies found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
