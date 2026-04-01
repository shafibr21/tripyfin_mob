import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface SocialMediaLoginBtnProps extends PressableProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
}

export default function SocialMediaLoginBtn({
  iconName,
  title,
  ...props
}: SocialMediaLoginBtnProps) {
  return (
    <Pressable
      className="flex-1 bg-[#0F3A26] border border-green-800/50 py-4 rounded-2xl flex-row items-center justify-center"
      {...props}
    >
      <Ionicons name={iconName} size={20} color="#FFFFFF" />
      <Text className="text-white ml-2 font-medium">{title}</Text>
    </Pressable>
  );
}
