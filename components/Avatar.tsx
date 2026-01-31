import { Text } from "react-native";
import { View } from "react-native";

const Avatar = () => {
  return (
    <View className="h-7 w-7 rounded-full bg-green-700 border border-[#0F3A26]" />
  );
}

const Tab = ({ label, active }: any) => {
  return (
    <View className="items-center">
      <View
        className={`h-2 w-2 rounded-full mb-1 ${
          active ? "bg-green-400" : "bg-transparent"
        }`}
      />
      <Text
        className={`text-xs ${
          active ? "text-green-400" : "text-green-700"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export { Tab, Avatar };