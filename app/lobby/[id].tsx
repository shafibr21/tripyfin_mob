import AddBulkExpenseModal from "@/app/modal/add-bulk-expense";
import AddDepositModal from "@/app/modal/add-deposit";
import AddIndividualExpenseModal from "@/app/modal/add-individual-expense";
import { generateInviteCode, getLobbyById } from "@/src/features/trips/trips.api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function LobbyDetails() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBulkExpenseModal, setShowBulkExpenseModal] = useState(false);
  const [showIndividualExpenseModal, setShowIndividualExpenseModal] =
    useState(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLobbyById(String(id));
      setData(result);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load lobby");
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSuccess = async (transactionId?: string | null) => {
    // Close modal and refresh lobby details
    setShowDepositModal(false);
    try {
      await fetchData();
      console.log("Lobby refreshed after deposit", { transactionId });
    } catch (err) {
      console.warn("Failed to refresh lobby after deposit", err);
    }
  };

  const handleExpenseSuccess = async () => {
    // Close expense modals and refresh lobby
    setShowBulkExpenseModal(false);
    setShowIndividualExpenseModal(false);
    try {
      await fetchData();
      console.log("Lobby refreshed after expense");
    } catch (err) {
      console.warn("Failed to refresh lobby after expense", err);
    }
  };

  const generatecode = async () => {
              try {
                // generate invite code
                const data = await generateInviteCode(String(id));
                const code = data?.inviteCode ?? data?.code ?? null;
                if (code) {
                  Alert.alert("Invite Code", code);
                } else {
                  Alert.alert("Invite Code", "No code returned by server");
                }
              } catch (err: any) {
                console.error("Generate invite error", err);
                const msg =
                  err?.response?.data?.message ||
                  err?.message ||
                  "Failed to generate invite code";
                Alert.alert("Error", String(msg));
              }
            };

  const lobby = data?.lobby;
  const transactions = data?.transactions ?? [];
  const isLeader = data?.isLeader ?? false;
  const totalBalance = lobby?.totalBalance ?? 0;
  const initialDeposit = lobby?.initialDeposit ?? 0;
  const usedFunds = initialDeposit - totalBalance;
  const progressPercent =
    initialDeposit > 0 ? Math.round((usedFunds / initialDeposit) * 100) : 0;
  const isHealthy = progressPercent <= 75;

  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-green-400 text-2xl">‹</Text>
          </Pressable>
          <Text className="text-white text-base font-semibold">
            Lobby Management
          </Text>
          <Pressable
            onPress={() => generatecode()}
          >
            <Text className="text-green-400 text-xl">code+</Text>
          </Pressable>
        </View>

        {loading ? (
          <Text className="text-green-300">Loading...</Text>
        ) : error ? (
          <View>
            <Text className="text-red-400">{error}</Text>
            <Pressable
              onPress={fetchData}
              className="mt-2 bg-green-400 py-2 px-3 rounded-2xl"
            >
              <Text className="text-green-950 text-center">Retry</Text>
            </Pressable>
          </View>
        ) : lobby ? (
          <View>
            {/* Lobby Balance Card */}
            <View className="bg-[#0F3A26] rounded-3xl p-5 mb-6">
              <Text className="text-white text-xl font-bold text-center mb-4">
                Lobby Balance
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-green-300 text-xs">Available Funds</Text>
                <Text className="text-white font-semibold">
                  ৳{totalBalance} Taka
                </Text>
              </View>

              <View className="h-2 bg-[#164C32] rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </View>

              <View className="flex-row justify-between">
                <Text className="text-green-400 text-xs">
                  {progressPercent}% of total deposits remaining
                </Text>
                <Text
                  className={`text-xs font-semibold ${isHealthy ? "text-green-400" : "text-yellow-500"}`}
                >
                  {isHealthy ? "HEALTHY" : "LOW"}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text className="text-white font-semibold mb-3">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              <Pressable
                onPress={() => setShowBulkExpenseModal(true)}
                className="bg-[#0F3A26] rounded-2xl p-4 w-[48%] mb-3"
              >
                <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mb-2">
                  <Text className="text-green-400 text-xl">👥</Text>
                </View>
                <Text className="text-white font-semibold">Bulk Expense</Text>
                <Text className="text-green-300 text-xs">
                  Bus, hotels & splits
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowIndividualExpenseModal(true)}
                className="bg-[#0F3A26] rounded-2xl p-4 w-[48%] mb-3"
              >
                <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mb-2">
                  <Text className="text-green-400 text-xl">🍽</Text>
                </View>
                <Text className="text-white font-semibold">
                  Individual Expense
                </Text>
                <Text className="text-green-300 text-xs">Per-person meals</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowDepositModal(true)}
                className="bg-[#0F3A26] rounded-2xl p-4 w-[48%]"
              >
                <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mb-2">
                  <Text className="text-green-400 text-xl">💳</Text>
                </View>
                <Text className="text-white font-semibold">Add Deposit</Text>
                <Text className="text-green-300 text-xs">
                  Top-up lobby funds
                </Text>
              </Pressable>

              <Pressable className="bg-[#0F3A26] rounded-2xl p-4 w-[48%]">
                <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mb-2">
                  <Text className="text-green-400 text-xl">👤</Text>
                </View>
                <Text className="text-white font-semibold">Members</Text>
                <Text className="text-green-300 text-xs">
                  Manage {lobby.members?.length ?? 0} travelers
                </Text>
              </Pressable>
            </View>

            {/* Live Feed */}
            <Text className="text-white font-semibold mb-3">Live Feed</Text>
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx: any) => (
                <View
                  key={tx._id}
                  className="bg-[#0F3A26] rounded-2xl p-4 mb-3 flex-row items-center"
                >
                  <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mr-3">
                    <Text className="text-green-400 text-xl">
                      {tx.type === "deposit"
                        ? "💳"
                        : tx.type === "expense"
                          ? "🍽"
                          : "📝"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {tx.description ?? "Transaction"}
                    </Text>
                    <Text className="text-green-300 text-xs">
                      {tx.creator?.name ?? "User"} •{" "}
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text
                    className={`font-semibold ${tx.type === "deposit" ? "text-green-400" : "text-red-400"}`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}৳{tx.totalAmount ?? 0}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-green-300 text-center py-4">
                No transactions yet
              </Text>
            )}

            {/* Low Balance Warning */}
            {!isHealthy && (
              <View className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-4 mt-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <Text className="text-yellow-500 text-xl mr-2">⚠</Text>
                  <Text className="text-yellow-500 font-semibold">
                    Low Balance Warning
                  </Text>
                </View>
                <Text className="text-yellow-200 text-xs mb-3">
                  Lobby balance is dropping fast. {lobby.members?.length ?? 0}{" "}
                  members haven't paid their initial deposit yet.
                </Text>
                <Pressable className="bg-yellow-600 py-2 px-4 rounded-full">
                  <Text className="text-white text-xs font-semibold text-center">
                    SEND REMINDERS
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <Text className="text-green-300">No lobby data</Text>
        )}
      </ScrollView>

      <AddDepositModal
        visible={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        lobbyId={String(id)}
        lobbyName={lobby?.name ?? ""}
        onSuccess={handleDepositSuccess}
      />

      <AddBulkExpenseModal
        visible={showBulkExpenseModal}
        onClose={() => setShowBulkExpenseModal(false)}
        lobbyId={String(id)}
        lobbyName={lobby?.name ?? ""}
        memberCount={lobby?.members?.length ?? 1}
        onSuccess={handleExpenseSuccess}
      />

      <AddIndividualExpenseModal
        {...({
          visible: showIndividualExpenseModal,
          onClose: () => setShowIndividualExpenseModal(false),
          lobbyId: String(id),
          lobbyName: lobby?.name ?? "",
          members: lobby?.members ?? [],
          onSuccess: handleExpenseSuccess,
        } as any)}
      />
    </SafeAreaView>
  );
}
