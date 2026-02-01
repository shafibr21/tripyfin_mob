import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [name, setName] = useState("Alex Johnson");
  const [bio, setBio] = useState(
    "Passionate traveler exploring the world one group expense at a time. Always looking for the next adventure.",
  );
  const [age, setAge] = useState("28");

  return (
    <SafeAreaView className="flex-1 bg-[#06241a]">
      <View className="px-4 pt-4">
        <View className="flex-row items-center">
          <Pressable className="p-2">
            <Ionicons name="arrow-back" size={24} color="#10B981" />
          </Pressable>
          <Text className="flex-1 text-center text-white text-lg font-semibold">
            Profile Settings
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mt-4">
          <View className="w-32 h-32 rounded-full bg-[#0F3A26] items-center justify-center">
            <Ionicons name="person" size={64} color="#D1FAE5" />
          </View>
          <Pressable className="-mt-6 ml-16 bg-[#10B981] w-10 h-10 rounded-full items-center justify-center border-2 border-[#06241a]">
            <Ionicons name="pencil" size={18} color="#00320f" />
          </Pressable>

          <Text className="text-white text-xl font-semibold mt-4">{name}</Text>
          <Text className="text-green-200/80 mt-1">TravelGroupLeader</Text>
        </View>

        <View className="mt-8 space-y-4">
          <View>
            <Text className="text-green-200 text-sm mb-2">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor="#6B7280"
              className="bg-[#0F3A26] border border-green-800/40 rounded-full px-4 py-3 text-white"
            />
          </View>

          <View>
            <Text className="text-green-200 text-sm mb-2">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Short bio"
              placeholderTextColor="#6B7280"
              className="bg-[#0F3A26] border border-green-800/40 rounded-2xl px-4 py-3 text-white"
              multiline
              numberOfLines={4}
              style={{ textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-green-200 text-sm mb-2">Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Age"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              className="bg-[#0F3A26] border border-green-800/40 rounded-full px-4 py-3 text-white w-24"
            />
          </View>
        </View>

        <View className="mt-8">
          <Pressable
            className="bg-green-400 py-4 rounded-full items-center"
            onPress={() => {}}
          >
            <Text className="text-center text-green-950 font-bold text-base">
              Save Changes
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
