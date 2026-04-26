import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

class SocketService {
  public socket: Socket | null = null;

  public async connect() {
    const token = await AsyncStorage.getItem("token");

    // If socket exists, check if the token matches. If not, disconnect to create a new session.
    if (this.socket) {
      const currentToken = (this.socket.auth as { token?: string })?.token;
      if (currentToken === token) {
        return; // Already connected with the correct token
      } else {
        this.disconnect();
      }
    }

    // Extract base URL from EXPO_PUBLIC_API_URL (removes /api/v1)
    const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace("/api/v1", "") || "";

    this.socket = io(baseURL, {
      transports: ["websocket"],
      auth: { token },
      // Automatically attempt reconnection
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  public joinLobby(lobbyId: string) {
    if (!this.socket) return;
    this.socket.emit("join_lobby", { lobbyId });
    console.log(`Joined lobby room: ${lobbyId}`);
  }

  public leaveLobby(lobbyId: string) {
    if (!this.socket) return;
    this.socket.emit("leave_lobby", { lobbyId });
    console.log(`Left lobby room: ${lobbyId}`);
  }

  public sendMessage(lobbyId: string, text: string) {
    if (!this.socket) return;
    this.socket.emit("send_message", { lobbyId, text });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
