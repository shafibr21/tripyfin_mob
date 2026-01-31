import Feature from "@/components/feature";
import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
``

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mt-10">
          <Text className="text-green-400 text-xs font-semibold tracking-widest mb-3">
            NEW · GROUP POOLING
          </Text>

          <Text className="text-white text-4xl font-extrabold leading-tight">
            Group travel expenses,{"\n"}
            <Text className="text-green-400">reimagined.</Text>
          </Text>

          <Text className="text-green-200 mt-4 text-base leading-relaxed">
            Let the leader manage the pool while everyone tracks in real-time.
            No more “who owes who” at the end of the trip.
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-10 space-y-5">
          <Pressable className="bg-green-400 py-4 rounded-2xl my-1">
            <Text className="text-center text-green-950 font-semibold text-base">
              View Trip Lobbies
            </Text>
          </Pressable>

          <Pressable className="border border-green-700 py-4 rounded-2xl my-1">
            <Text className="text-center text-green-300 font-medium">
              Join with Code
            </Text>
          </Pressable>
        </View>

        {/* Mock Card / Progress UI */}
        <View className="mt-12 bg-[#0F3A26] rounded-3xl p-5">
          <View className="h-3 bg-[#164C32] rounded-full overflow-hidden">
            <View className="h-full w-2/3 bg-green-400 rounded-full" />
          </View>

          <View className="flex-row justify-between mt-4">
            <View className="h-10 w-[45%] bg-[#164C32] rounded-xl" />
            <View className="h-10 w-[45%] bg-[#164C32] rounded-xl" />
          </View>
        </View>

        {/* Features */}
        <View className="mt-12 space-y-6">
          <Feature
            title="Centralized Pool"
            description="Collect deposits upfront and pay for group expenses seamlessly."
          />
          <Feature
            title="Live Activity Feed"
            description="Track every expense, approval, and settlement in real-time."
          />
          <Feature
            title="Flexible Splits"
            description="Split equally, custom, or by individual participation."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
