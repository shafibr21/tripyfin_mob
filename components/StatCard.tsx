import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
};

export default function StatCard({ title, value, subtitle, icon }: Props) {
  return (
    <View className="bg-[#0F3A26] rounded-2xl p-4 w-[48%] mb-3">
      <View className="flex-row items-center mb-2">
        <View className="h-8 w-8 rounded-full bg-green-400/20 items-center justify-center mr-3">
          <Text className="text-green-400 text-lg">{icon ?? "📊"}</Text>
        </View>
        <Text className="text-white font-semibold">{title}</Text>
      </View>
      <Text className="text-white text-2xl font-bold">{value}</Text>
      {subtitle ? (
        <Text className="text-green-300 text-xs mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}
