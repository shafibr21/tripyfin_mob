import AddBulkExpenseModal from "@/app/modal/add-bulk-expense";
import AddDepositModal from "@/app/modal/add-deposit";
import AddIndividualExpenseModal from "@/app/modal/add-individual-expense";

import TransactionDetailsModal from "@/app/modal/transaction-details";
import {
  getLobbyById,
  getLobbyTransactions,
} from "@/src/features/trips/trips.api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import AddInviteModal from "../modal/add-Invite";

export default function LobbyDetails() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBulkExpenseModal, setShowBulkExpenseModal] = useState(false);
  const [showIndividualExpenseModal, setShowIndividualExpenseModal] =
    useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [result, txs] = await Promise.all([
        getLobbyById(String(id)),
        getLobbyTransactions(String(id)),
      ]);
      setData(result);
      setTransactions(Array.isArray(txs) ? txs : (txs?.data ?? txs ?? []));
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

  // Invite code generation is handled in the AddInviteModal component

  const lobby = data?.lobby;
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
            onPress={() => setShowInviteModal(true)}
            className="h-9 w-20 rounded-full bg-[#13422C] items-center justify-center"
          >
            <Text className="text-green-400 text-xl">Invite +</Text>
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
            </View>

            {/* Quick Actions */}
            <Text className="text-white font-semibold mb-3">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {isLeader ? (
                <>
                  <Pressable
                    onPress={() => setShowBulkExpenseModal(true)}
                    className="bg-[#0F3A26] rounded-2xl p-4 w-[48%] mb-3"
                  >
                    <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mb-2">
                      <Text className="text-green-400 text-xl">👥</Text>
                    </View>
                    <Text className="text-white font-semibold">
                      Bulk Expense
                    </Text>
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
                    <Text className="text-green-300 text-xs">
                      Per-person meals
                    </Text>
                  </Pressable>
                </>
              ) : null}

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
              transactions.map((tx: any) => {
                const id = tx._id ?? tx.id;
                const creatorName =
                  tx.creator?.name ?? tx.createdBy?.name ?? "User";
                const type = tx.type ?? tx.txType ?? "";
                const isDeposit = String(type).includes("deposit");
                return (
                  <Pressable
                    key={id}
                    onPress={() => {
                      setSelectedTransactionId(String(id));
                      setShowTransactionModal(true);
                    }}
                    className="bg-[#0F3A26] rounded-2xl p-4 mb-3 flex-row items-center"
                  >
                    <View className="h-10 w-10 rounded-full bg-green-400/20 items-center justify-center mr-3">
                      <Text className="text-green-400 text-xl">
                        {isDeposit
                          ? "💳"
                          : type.includes("individual")
                            ? "🍽"
                            : "📝"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold">
                        {tx.description ?? "Transaction"}
                      </Text>
                      <Text className="text-green-300 text-xs">
                        {creatorName} •{" "}
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      className={`font-semibold ${isDeposit ? "text-green-400" : "text-red-400"}`}
                    >
                      {isDeposit ? "+" : "-"}৳{tx.totalAmount ?? 0}
                    </Text>
                  </Pressable>
                );
              })
            ) : (
              <Text className="text-green-300 text-center py-4">
                No transactions yet
              </Text>
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

      <AddInviteModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        lobbyId={String(id)}
        lobbyName={lobby?.name ?? ""}
        initialDeposit={lobby?.initialDeposit}
      />
      <TransactionDetailsModal
        visible={showTransactionModal}
        transactionId={selectedTransactionId}
        onClose={() => {
          setShowTransactionModal(false);
          setSelectedTransactionId(null);
        }}
      />
    </SafeAreaView>
  );
}
