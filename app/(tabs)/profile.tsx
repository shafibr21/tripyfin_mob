import { authApi } from "@/src/features/auth/auth.api";
import {
  getMe,
  updateMe,
  updateMeWithImage,
} from "@/src/features/profile/profile.api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [name, setName] = useState("Alex Johnson");
  const [bio, setBio] = useState(
    "Passionate traveler exploring the world one group expense at a time. Always looking for the next adventure.",
  );
  const [age, setAge] = useState("28");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined,
  );
  const [localImage, setLocalImage] = useState<{
    uri: string;
    name?: string;
    type?: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMe();
        if (data) {
          setName(data.name || "");
          setBio(data.bio || "");
          setAge(data.age ? String(data.age) : "");
          setProfilePicture(data.profilePictureUrl || undefined);
        }
      } catch (err) {
        console.warn("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

      {loading ? (
        <View className="flex-1 items-center justify-center p-4">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="items-center mt-4">
            <View className="w-32 h-32 rounded-full bg-[#0F3A26] items-center justify-center overflow-hidden">
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={{ width: 128, height: 128, borderRadius: 999 }}
                />
              ) : (
                <Ionicons name="person" size={64} color="#D1FAE5" />
              )}
            </View>
            <Pressable
              className="-mt-6 ml-16 bg-[#10B981] w-10 h-10 rounded-full items-center justify-center border-2 border-[#06241a]"
              onPress={async () => {
                try {
                  const permission =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!permission.granted) {
                    Alert.alert(
                      "Permission required",
                      "Permission to access photos is required",
                    );
                    return;
                  }

                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.8,
                  });

                  if (!result.canceled) {
                    // Newer API returns an assets array
                    const asset = (result as any).assets?.[0];
                    const uri = asset?.uri ?? (result as any).uri;
                    if (uri) {
                      const name = uri.split("/").pop();
                      const type = asset?.type ?? "image/jpeg";
                      setLocalImage({ uri, name, type });
                      setProfilePicture(uri);
                    }
                  }
                } catch (err) {
                  console.warn("Image pick failed", err);
                  Alert.alert("Error", "Could not pick image");
                }
              }}
            >
              <Ionicons name="pencil" size={18} color="#00320f" />
            </Pressable>

            <Text className="text-white text-xl font-semibold mt-4">
              {name}
            </Text>
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
              onPress={async () => {
                try {
                  setSaving(true);
                  const payload = {
                    name,
                    bio,
                    age: age ? Number(age) : undefined,
                  };

                  if (localImage) {
                    // upload multipart with image
                    await updateMeWithImage(payload, localImage);
                  } else {
                    await updateMe(payload);
                  }
                  Alert.alert("Success", "Profile updated");
                } catch (err) {
                  console.warn("Update failed", err);
                  Alert.alert("Error", "Failed to update profile");
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
            >
              <Text className="text-center text-green-950 font-bold text-base">
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>
            <View className="mt-3" />
            <Pressable
              className="bg-red-500 py-3 rounded-full items-center"
              onPress={() => {
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        setLoggingOut(true);
                        await authApi.logoutApi();
                        // navigate back to index after logout
                        router.replace("/");
                        Alert.alert("Logged out");
                      } catch (err) {
                        console.warn("Logout failed", err);
                        Alert.alert("Error", "Failed to logout");
                      } finally {
                        setLoggingOut(false);
                      }
                    },
                  },
                ]);
              }}
              disabled={loggingOut}
            >
              <Text className="text-center text-white font-bold text-base">
                {loggingOut ? "Logging out..." : "Logout"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
