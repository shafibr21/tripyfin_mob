import { api } from "@/src/api/client";

const loginApi = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // { token, user }
};

const signupApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/signup", payload);
  return data; // { message }
};

const forgotPasswordApi = async (payload: { email: string }) => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data; // { message }
};
const verifyOtpApi = async (payload: { email: string; otp: string }) => {
    const { data } = await api.post("/auth/verify-reset-otp", payload);
    return data; // { message }
};
const resetPasswordApi = async (payload: { email: string; newPassword: string }) => {
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