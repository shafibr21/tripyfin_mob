import MemberItem from "@/components/MemberItem";
import { LobbyMember } from "@/src/features/trips/trips.api";
import React from "react";
import { View } from "react-native";

type Props = {
  members: LobbyMember[];
  onDeposit?: (memberId: string) => void;
};

export default function MembersList({ members, onDeposit }: Props) {
  return (
    <View>
      {members.map((m) => (
        <MemberItem key={m.id} member={m as any} onDeposit={onDeposit} />
      ))}
    </View>
  );
}
