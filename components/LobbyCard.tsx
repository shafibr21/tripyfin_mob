import { Pressable, Text, View } from "react-native";

export function LobbyCard({
  role,
  title,
  subtitle,
  balance,
  progress,
  action,
  contribution,
  onActionPress,
}: any) {
  return (
    <View className="bg-[#0F3A26] rounded-3xl p-5 mb-4">
      {/* Top Row */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-green-400 text-xs font-semibold mb-1">
            {role}
          </Text>
          <Text className="text-white font-semibold text-base">{title}</Text>
          <Text className="text-green-200 text-xs mt-1">Leader : {subtitle}</Text>
        </View>

        <View className="items-end">
          <Text className="text-green-300 text-xs">LOBBY BALANCE</Text>
          <Text className="text-white font-semibold mt-1">{balance}</Text>
        </View>
      </View>

      {/* Progress */}
      <Text className="text-green-300 text-xs mb-2">
        {contribution ? "Your Contribution" : "Budget Usage"}
      </Text>

      <View className="h-2 bg-[#164C32] rounded-full overflow-hidden mb-3">
        <View
          className="h-full bg-green-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Bottom Row */}
      <View className="justify-between items-center">

        <Pressable
          onPress={onActionPress}
          className="px-4 py-2 rounded-full border border-green-600 w-full h-10 justify-center"
        >
          <Text className="text-green-300 text-md font-medium text-center">{action}</Text>
        </Pressable>
      </View>
    </View>
  );
}
