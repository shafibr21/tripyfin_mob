import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type Creator = {
  id?: string;
  name?: string;
  profilePictureUrl?: string | null;
};

type Transaction = {
  id?: string;
  _id?: string;
  description?: string;
  type?: string;
  txType?: string;
  totalAmount?: number;
  amount?: number;
  createdAt?: string;
  createdBy?: Creator;
  creator?: Creator;
};

type Props = {
  tx: Transaction;
  onPress?: (id?: string) => void;
};

function typeBadge(t?: string) {
  const type = String(t ?? "");
  if (type.includes("deposit")) return "Deposit";
  if (type.includes("equal")) return "Equal Split";
  if (type.includes("individual")) return "Individual";
  return "Transaction";
}

export default function TransactionItem({ tx, onPress }: Props) {
  const id = tx._id ?? tx.id;
  const creator = tx.creator ?? tx.createdBy ?? { name: "User" };
  const description = tx.description ?? "Transaction";
  const date = tx.createdAt ? new Date(tx.createdAt) : null;
  const type = tx.type ?? tx.txType ?? "";
  const isDeposit = String(type).toLowerCase().includes("deposit");
  const amount = Number(tx.totalAmount ?? tx.amount ?? 0);
  const fmt = (v: number) =>
    new Intl.NumberFormat().format(Math.round(v * 100) / 100);

  return (
    <Pressable
      onPress={() => onPress && onPress(String(id))}
      className="bg-[#071018] rounded-2xl p-4 mb-3 flex-row items-center"
    >
      <View className="h-12 w-12 rounded-full bg-[#0B2B1C] items-center justify-center mr-4 overflow-hidden">
        {creator.profilePictureUrl ? (
          // @ts-ignore Image props via className
          <Image
            source={{ uri: creator.profilePictureUrl }}
            className="h-12 w-12"
          />
        ) : (
          <Text className="text-green-400 text-lg">
            {(creator.name || "?").slice(0, 1).toUpperCase()}
          </Text>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-white font-semibold">{description}</Text>
        <Text className="text-green-300 text-xs">
          {creator.name ?? "User"} • {date ? date.toLocaleDateString() : ""}
        </Text>
      </View>

      <View className="items-end">
        <Text
          className={`font-semibold ${isDeposit ? "text-green-400" : "text-red-400"}`}
        >
          {isDeposit ? "+" : "-"}৳{fmt(amount)}
        </Text>
        <View className="mt-2 flex-row items-center">
          <View className="bg-[#0F3A26] px-3 py-1 rounded-full mr-2">
            <Text className="text-green-300 text-xs">{typeBadge(type)}</Text>
          </View>
          <View className="bg-[#0F3A26] px-2 py-1 rounded-full">
            <Text className="text-green-300 text-xs">👁</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
