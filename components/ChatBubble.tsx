import React from "react";
import { View, Text, Image } from "react-native";
import { ChatMessage } from "@/src/services/message.service";

interface ChatBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({ message, isOwnMessage, showAvatar }) => {
    // Basic timestamp formatting HH:MM
    const timeString = new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        className={`w-full flex-row my-1 px-4 ${
          isOwnMessage ? "justify-end" : "justify-start"
        }`}
      >
        {!isOwnMessage && showAvatar && (
          <View className="h-8 w-8 rounded-full bg-green-800 items-center justify-center mr-2 mt-auto overflow-hidden">
            {message.sender?.profilePictureUrl ? (
              <Image source={{ uri: message.sender.profilePictureUrl }} className="w-full h-full" />
            ) : (
              <Text className="text-white text-xs font-bold">
                {message.sender?.name?.charAt(0).toUpperCase() || "?"}
              </Text>
            )}
          </View>
        )}
        
        {/* Placeholder if we want alignment to look right without avatar */}
        {!isOwnMessage && !showAvatar && <View className="w-8 mr-2" />}

        <View
          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? "bg-green-600 rounded-br-sm"
              : "bg-[#1A3F2D] rounded-bl-sm"
          }`}
        >
          {!isOwnMessage && (
            <Text className="text-green-300 text-xs mb-1 font-semibold">
              {message.sender?.name || "Unknown"}
            </Text>
          )}
          <Text className="text-white text-base">{message.text}</Text>
          <Text
            className={`text-[10px] mt-1 text-right ${
              isOwnMessage ? "text-green-200" : "text-gray-400"
            }`}
          >
            {timeString}
          </Text>
        </View>
      </View>
    );
  }
);
