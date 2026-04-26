import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, Text, ActivityIndicator } from "react-native";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { socketService } from "@/src/services/socket";
import { getLobbyMessages, ChatMessage } from "@/src/services/message.service";
import { useAuthStore } from "@/src/features/auth/auth.store";

interface ChatScreenProps {
  lobbyId: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ lobbyId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getLobbyMessages(lobbyId);
        // The backend returns the latest messages first (due to .sort({ createdAt: -1 }))
        // Since we are using an inverted FlatList, we can just set them directly
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 3. Listen for incoming messages
    const handleReceiveMessage = (newMessage: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) {
          return prev;
        }
        return [newMessage, ...prev];
      });
    };

    // 2. Connect to Socket
    socketService.connect().then(() => {
      socketService.joinLobby(lobbyId);
      if (socketService.socket) {
        // Must attach here because socket is initialized asynchronously
        socketService.socket.on("receive_message", handleReceiveMessage);
      }
    });

    // 4. Cleanup on unmount
    return () => {
      if (socketService.socket) {
        socketService.socket.off("receive_message", handleReceiveMessage);
      }
      socketService.leaveLobby(lobbyId);
    };
  }, [lobbyId]);

  const handleSend = useCallback(
    (text: string) => {
      if (!currentUser) return;
      // The backend broadcasts the "receive_message" event to the entire room,
      // including the sender. So we don't need an optimistic update.
      socketService.sendMessage(lobbyId, text);
    },
    [lobbyId, currentUser]
  );

  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const currentUserId = currentUser?.id || (currentUser as any)?._id;
    const isOwnMessage = item.sender?.id === currentUserId;
    
    // Show avatar if the next message (visually below, so index + 1 in inverted array)
    // is from a different user, or if it's the very first message
    const showAvatar =
      index === 0 || messages[index - 1]?.sender?.id !== item.sender?.id;

    return (
      <ChatBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showAvatar={showAvatar}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 bg-[#0B2B1C]">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4ade80" />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-green-300 text-center mt-10 transform scale-y-[-1]">
                No messages yet. Start the conversation!
              </Text>
            }
          />
        )}
        <ChatInput onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};
