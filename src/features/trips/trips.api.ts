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

export async function getLobbyTransactions(lobbyId: string) {
  const res = await api.get(`/users/transactions/lobbies/${lobbyId}`);
  return res.data?.data ?? res.data ?? [];
}

export type LobbySummary = {
  totalBalance: number;
  initialDeposit: number;
  utilizationPercent: number;
  totalDeposits: number;
  totalSpent: number;
  memberCount: number;
  transactionCount: number;
};

/**
 * Fetch pre-computed summary/aggregates for a lobby.
 * GET /users/lobbies/:id/summary
 */
export async function getLobbySummary(
  lobbyId: string,
): Promise<LobbySummary | null> {
  try {
    const res = await api.get(`/users/lobbies/${lobbyId}/summary`);
    const payload = res.data?.data ?? res.data ?? null;
    if (!payload) return null;

    return {
      totalBalance: Number(payload.totalBalance ?? 0),
      initialDeposit: Number(payload.initialDeposit ?? 0),
      utilizationPercent: Number(payload.utilizationPercent ?? 0),
      totalDeposits: Number(payload.totalDeposits ?? 0),
      totalSpent: Number(payload.totalSpent ?? 0),
      memberCount: Number(payload.memberCount ?? 0),
      transactionCount: Number(payload.transactionCount ?? 0),
    } as LobbySummary;
  } catch (err) {
    // don't crash the app on missing endpoint; caller can fall back to client-side compute
    console.warn("getLobbySummary failed", err);
    return null;
  }
}

export type LobbyMember = {
  id: string;
  name: string;
  profilePictureUrl?: string | null;
  deposited: number;
  expenses: number;
  balance: number;
  owes: number;
};

export async function getLobbyMembers(lobbyId: string): Promise<LobbyMember[]> {
  try {
    const res = await api.get(`/users/lobbies/${lobbyId}/members`);
    const payload = res.data?.data ?? res.data ?? [];
    if (!Array.isArray(payload)) return [];
    return payload.map((m: any) => ({
      id: m.id ?? m._id ?? String(m.id),
      name: m.name ?? "",
      profilePictureUrl: m.profilePictureUrl ?? m.avatar ?? null,
      deposited: Number(m.deposited ?? 0),
      expenses: Number(m.expenses ?? 0),
      balance: Number(m.balance ?? 0),
      owes: Number(m.owes ?? 0),
    }));
  } catch (err) {
    console.warn("getLobbyMembers failed", err);
    return [];
  }
}

export async function getTransactionDetails(transactionId: string) {
  const res = await api.get(
    `/users/transactions/lobbies/transaction-details/${transactionId}`,
  );
  return res.data?.data ?? res.data ?? null;
}

export async function joinLobbyByCodeDeposit(
  inviteCode: string,
  amount: number,
) {
  // POST to join with invite code and required initial deposit
  // Adjust this endpoint to match your backend if needed
  const res = await api.post(
    `/users/transactions/lobbies/join-with-deposit-and-code`,
    {
      inviteCode,
      amount,
    },
  );
  return res.data;
}
