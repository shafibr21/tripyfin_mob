import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Expenses() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B2B1C]">
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl">Expenses Screen</Text>
      </View>
    </SafeAreaView>
  );
}
