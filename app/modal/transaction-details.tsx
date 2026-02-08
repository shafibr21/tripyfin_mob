import { getTransactionDetails } from "@/src/features/trips/trips.api";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

interface TransactionDetailsModalProps {
  visible: boolean;
  transactionId: string | null;
  onClose: () => void;
}

export default function TransactionDetailsModal({
  visible,
  transactionId,
  onClose,
}: TransactionDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && transactionId) fetchDetails();
    if (!visible) {
      setData(null);
      setError(null);
    }
  }, [visible, transactionId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactionDetails(String(transactionId));
      setData(res);
    } catch (err: any) {
      console.error("Transaction details error", err);
      setError(err?.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const tx = data?.data ?? data ?? null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Pressable onPress={onClose} className="flex-1" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="bg-[#0B2B1C] rounded-t-3xl"
        >
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">
                Transaction Details
              </Text>
              <Pressable onPress={onClose} className="p-2">
                <Text className="text-green-400 text-xl">✕</Text>
              </Pressable>
            </View>

            {loading ? (
              <Text className="text-green-300">Loading...</Text>
            ) : error ? (
              <Text className="text-red-400">{error}</Text>
            ) : tx ? (
              <View>
                <Text className="text-white font-semibold text-lg mb-2">
                  {tx.description ?? tx.title ?? "Transaction"}
                </Text>
                <Text className="text-green-300 text-xs mb-2">
                  {tx.createdBy?.name ?? tx.creator?.name ?? "User"} •{" "}
                  {new Date(tx.createdAt).toLocaleString()}
                </Text>
                <Text
                  className={`text-xl font-semibold ${tx.type?.includes("deposit") ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.type?.includes("deposit") ? "+" : "-"}৳
                  {tx.totalAmount ?? 0}
                </Text>

                {Array.isArray(tx.breakdown) && tx.breakdown.length > 0 && (
                  <View className="mt-4">
                    <Text className="text-white font-semibold mb-2">
                      Breakdown
                    </Text>
                    {tx.breakdown.map((b: any, i: number) => (
                      <View
                        key={i}
                        className="bg-[#0F3A26] rounded-2xl p-3 mb-2"
                      >
                        <Text className="text-white">
                          {b.name ?? b.user?.name ?? "Item"}
                        </Text>
                        <Text className="text-green-300 text-xs">
                          ৳{b.amount ?? b.share ?? 0}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <Text className="text-green-300">No details available</Text>
            )}

            <Pressable onPress={onClose} className="py-3">
              <Text className="text-green-300 text-center font-medium">
                Close
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
