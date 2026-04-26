import { api } from "@/src/api/client";

export type ChatMessage = {
  id: string;
  lobbyId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name?: string;
    profilePictureUrl?: string;
  };
};

export async function getLobbyMessages(
  lobbyId: string,
  page: number = 1,
  limit: number = 50
): Promise<ChatMessage[]> {
  try {
    const url = `/messages/${lobbyId}`;
    console.log(`Fetching messages from: ${url}`);
    const res = await api.get(url, {
      params: { page, limit },
    });
    console.log("API response status:", res.status);
    
    // Backend returns: { success: true, data: { page, limit, total, items: [...] } }
    return res.data?.data?.items ?? [];
  } catch (err: any) {
    console.error("Failed to fetch lobby messages", err?.response?.status, err?.response?.data || err.message);
    return [];
  }
}

