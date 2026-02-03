import { api } from "@/src/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Lobby = {
  id: string | number;
  title: string;
  subtitle?: string;
  balance?: string;
  progress?: number;
  role?: "LEADER" | "MEMBER" | string;
  contribution?: string;
};

export async function getUserLobbies(): Promise<Lobby[]> {
  const res = await api.get("/users/lobbies");
  const payload =
    res.data && Array.isArray(res.data.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];

  return payload.map((item: any) => {
    const total =
      typeof item.totalBalance === "number"
        ? item.totalBalance
        : Number(item.totalBalance || 0);
    const initial =
      typeof item.initialDeposit === "number"
        ? item.initialDeposit
        : Number(item.initialDeposit || 0);
    const progress =
      total > 0 ? Math.min(100, Math.round((initial / total) * 100)) : 0;

    // try to pick a member contribution if present (best-effort)
    let contribution: string | undefined = undefined;
    if (Array.isArray(item.members) && item.members.length > 0) {
      const m = item.members[0];
      if (m && (m.individualBalance || m.totalDeposited)) {
        const ind = m.individualBalance ?? m.totalDeposited ?? 0;
        contribution = `৳${ind} / ${total ? `৳${total}` : "৳0"}`;
      }
    }

    return {
      id: item._id,
      title: item.name,
      subtitle: item.leader?.name ?? "",
      balance: `৳${total}`,
      progress,
      // role is intentionally left undefined (UI can decide based on current user)
      contribution,
    } as Lobby;
  });
}

export async function getLobbyById(id: string): Promise<any> {
  const res = await api.get(`/users/lobbies/${id}`);
  // response structure: { success: true, data: { lobby, memberBalances, transactions, isLeader } }
  return res.data?.data ?? res.data ?? null;
}

export async function addDeposit(
  lobbyId: string,
  payload: { amount: number; description?: string; userId?: string },
) {
  const res = await api.post(
    `/users/transactions/lobbies/${lobbyId}/deposits`,
    payload,
  );
  return res.data;
}

export async function addExpense(
  lobbyId: string,
  payload: Record<string, any>,
) {
  const path = `/users/transactions/lobbies/${lobbyId}/expenses`;
  const base = (api.defaults && api.defaults.baseURL) || "";
  const fullUrl = base ? `${base.replace(/\/$/, "")}${path}` : path;
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("addExpense: calling", {
      base,
      path,
      fullUrl,
      payload,
      tokenPresent: !!token,
    });
    const res = await api.post(path, payload);
    console.log("addExpense: response", { status: res.status, data: res.data });
    return res.data;
  } catch (err: any) {
    console.error("addExpense error", {
      message: err?.message,
      status: err?.response?.status,
      responseData: err?.response?.data,
      requestUrl: fullUrl,
      payload,
    });
    throw err;
  }
}

export async function generateInviteCode(lobbyId: string) {
  // POST to /lobbies/:id/invite-code
  const res = await api.post(
    `/users/transactions/lobbies/${lobbyId}/invite-code`,
  );
  // expected response: { inviteCode: '...' }
  return res.data;
}
