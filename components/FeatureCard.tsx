import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View className="bg-[#051610] p-6 rounded-3xl border border-[#00FF88]/10" style={{ shadowColor: "#00FF88", shadowOpacity: 0.05, shadowRadius: 10 }}>
    <Ionicons name={icon} size={32} color="#00FF88" className="mb-4" />
    <Text className="text-xl font-bold text-[#f1ffef] mb-2 mt-4 tracking-tight">{title}</Text>
    <Text className="text-sm text-[#b9cbb9] leading-relaxed">{desc}</Text>
  </View>
);