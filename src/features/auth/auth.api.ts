import { api } from "@/src/api/client";

const loginApi = async (payload: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", payload);
  // backend returns { data: { accessToken, user }, success }
  if (data && data.data && data.data.accessToken) {
    return { token: data.data.accessToken, user: data.data.user };
  }

  // fallback: return whatever the API returned
  return data;
};

const signupApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/signup", payload);
  // normalize if backend wraps response in `data`
  if (data && data.data) return data.data;
  return data;
};

const forgotPasswordApi = async (payload: { email: string }) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data; // { message }
};
const verifyOtpApi = async (payload: { email: string; otp: string }) => {
  const { data } = await api.post("/auth/verify-reset-otp", payload);
  return data; // { message }
};
const resetPasswordApi = async (payload: {
  email: string;
  newPassword: string;
}) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data; // { message }
};

export const authApi = {
  loginApi,
  signupApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
};