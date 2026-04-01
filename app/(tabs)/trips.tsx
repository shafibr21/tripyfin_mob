import { LobbyCard } from "@/components/LobbyCard";
import { getUserLobbies, Lobby } from "@/src/features/trips/trips.api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import JoinLobbyModal from "@/app/modal/join-lobby";
import CreateLobbyModal from "@/app/modal/create-lobby";
import { Image } from "expo-image";
import { images } from "@/constants/images";


export default function Trips() {
  const [lobbies, setLobbies] = useState<Lobby[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    <><SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-row items-center space-x-3">
            <View className="h-10 w-10 items-center justify-center mr-2">
              <Image source={images.logo} style={{ width: 28, height: 28}} className="rounded-2xl" />
            </View>
            <Text className="text-white text-lg font-semibold">
              Travel Lobbies
            </Text>
          </View>

          <Pressable onPress={() => setShowJoinModal(true)} className="h-8 w-12 rounded-lg bg-green-400 items-center justify-center">
            <Text className="text-black font-semibold">JOIN</Text>
          </Pressable>
        </View>
    <JoinLobbyModal visible={showJoinModal} onClose={() => setShowJoinModal(false)} onSuccess={fetchLobbies} />
        {/* Create Lobby */}
        <Pressable onPress={() => setShowCreateModal(true)} className="bg-green-400 py-4 rounded-2xl mb-6 active:opacity-90">
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
              onActionPress={() => router.push({ pathname: "/lobby/[id]", params: { id: String(lobby.id) } })} />
          ))
        ) : (
          <Text className="text-green-300">No active lobbies found.</Text>
        )}
      </ScrollView>
    </SafeAreaView><JoinLobbyModal visible={showJoinModal} onClose={() => setShowJoinModal(false)} /><CreateLobbyModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={fetchLobbies} /></>
  );
}
