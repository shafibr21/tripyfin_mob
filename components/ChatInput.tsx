import React, { useState } from "react";
import { View, TextInput, Pressable, Text, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure this is available, it usually is in Expo

interface ChatInputProps {
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSend(text.trim());
    setText("");
    // We don't dismiss keyboard on every send so user can keep typing
  };

  return (
    <View className="flex-row items-center bg-[#0B2B1C] px-4 py-3 border-t border-[#1A3F2D]">
      <TextInput
        className="flex-1 bg-[#13422C] text-white rounded-full px-4 py-3 mr-3 max-h-32"
        placeholder="Type a message..."
        placeholderTextColor="#6B9A81"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
      />
      <Pressable
        onPress={handleSend}
        className={`h-11 w-11 rounded-full items-center justify-center ${
          text.trim().length > 0 ? "bg-green-500" : "bg-green-800 opacity-50"
        }`}
        disabled={text.trim().length === 0}
      >
        <Ionicons name="send" size={18} color="white" />
      </Pressable>
    </View>
  );
};
