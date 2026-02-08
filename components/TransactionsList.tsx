import TransactionItem from "@/components/TransactionItem";
import React from "react";
import { View } from "react-native";

type Props = {
  transactions: any[];
  onSelect?: (id: string) => void;
};

export default function TransactionsList({ transactions, onSelect }: Props) {
  return (
    <View>
      {transactions.map((tx) => (
        <TransactionItem key={tx._id ?? tx.id} tx={tx} onPress={onSelect} />
      ))}
    </View>
  );
}
