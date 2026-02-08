import StatCard from "@/components/StatCard";
import { LobbySummary as LobbySummaryType } from "@/src/features/trips/trips.api";
import React from "react";
import { Text, View } from "react-native";

const fmt = (v: number) => new Intl.NumberFormat().format(Math.round(v));

type Props = {
  summary: LobbySummaryType | null;
  lobbyName?: string;
};

export default function LobbySummary({ summary, lobbyName }: Props) {
  const s = summary ?? {
    totalBalance: 0,
    initialDeposit: 0,
    utilizationPercent: 0,
    totalDeposits: 0,
    totalSpent: 0,
    memberCount: 0,
    transactionCount: 0,
  };

  return (
    <View>
      <View className="bg-[#0F3A26] rounded-3xl p-5 mb-6">
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <Text className="text-green-300 text-xs">AVAILABLE BALANCE</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {fmt(s.totalBalance)}{" "}
              <Text className="text-green-400 text-lg">BDT</Text>
            </Text>
            <Text className="text-green-300 text-xs mt-1">
              Fund Utilization
            </Text>
          </View>
          <View className="items-end">
            <View className="bg-green-400/10 px-3 py-1 rounded-full">
              <Text className="text-green-400 text-xs">ACTIVE</Text>
            </View>
          </View>
        </View>

        <View className="h-2 bg-[#164C32] rounded-full overflow-hidden mb-3">
          <View
            className="h-full bg-green-400 rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, s.utilizationPercent))}%`,
            }}
          />
        </View>
        <Text className="text-green-300 text-xs text-right">
          {s.utilizationPercent}%
        </Text>
      </View>

      <View className="flex-row justify-between mb-6">
        <StatCard
          title="Total Deposits"
          value={`৳${fmt(s.totalDeposits)}`}
          subtitle={`+${s.memberCount} Members`}
          icon="⬆️"
        />
        <StatCard
          title="Total Spent"
          value={`৳${fmt(s.totalSpent)}`}
          subtitle={`${s.transactionCount} Transactions`}
          icon="🛒"
        />
      </View>
    </View>
  );
}
