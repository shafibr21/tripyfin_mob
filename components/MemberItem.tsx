import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type Member = {
  id: string;
  name: string;
  profilePictureUrl?: string | null;
  deposited: number;
  expenses: number;
  balance: number;
  owes: number;
};

type Props = {
  member: Member;
  onDeposit?: (memberId: string) => void;
};

export default function MemberItem({ member, onDeposit }: Props) {
  const fmt = (v: number) =>
    new Intl.NumberFormat().format(Math.round(v * 100) / 100);
  const owes = Number(member.owes ?? 0);

  return (
    <View className="bg-[#0F3A26] rounded-2xl p-4 mb-3 flex-row items-center">
      <View className="h-12 w-12 rounded-full bg-[#0B2B1C] items-center justify-center mr-4 overflow-hidden">
        {member.profilePictureUrl ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Image
            source={{ uri: member.profilePictureUrl }}
            className="h-12 w-12"
          />
        ) : (
          <Text className="text-green-400 text-lg">
            {(member.name || "?").slice(0, 1).toUpperCase()}
          </Text>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-white font-semibold mb-1">{member.name}</Text>
        <Text className="text-green-300 text-xs">
          Deposited: ৳{fmt(member.deposited)}
        </Text>
        <Text className="text-green-300 text-xs">
          Expenses: ৳{fmt(member.expenses)}
        </Text>
      </View>

      <View className="items-end">
        <Text
          className={`font-semibold ${member.balance >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          ৳{fmt(member.balance)}
        </Text>
        <View className="flex-row items-center mt-2">
          {owes > 0 ? (
            <View className="bg-red-600 px-2 py-1 rounded-full mr-2">
              <Text className="text-white text-xs">Owes ৳{fmt(owes)}</Text>
            </View>
          ) : null}
          <Pressable
            onPress={() => onDeposit && onDeposit(member.id)}
            className="border border-green-400 px-3 py-1 rounded-full"
          >
            <Text className="text-green-400 text-xs">Deposit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
