import { api } from "@/src/api/client";

export interface Profile {
  id?: string;
  name: string;
  bio?: string;
  age?: number | string;
  profilePictureUrl?: string;
}

export const getMe = async (): Promise<Profile> => {
  const { data } = await api.get("/users/get-me");
  // backend often wraps payload as { success, data }
  return data && data.data ? data.data : data;
};

export const updateMe = async (payload: Partial<Profile>): Promise<Profile> => {
  const { data } = await api.put("/users/update-me", payload);
  return data && data.data ? data.data : data;
};

// Send multipart/form-data when uploading a profile picture.
export const updateMeWithImage = async (
  payload: Partial<Profile>,
  image?: { uri: string; name?: string; type?: string },
): Promise<Profile> => {
  const form = new FormData();

  if (image && image.uri) {
    // In React Native, FormData file entry should be { uri, name, type }
    form.append("profilePicture", {
      uri: image.uri,
      name: image.name || "profile.jpg",
      type: image.type || "image/jpeg",
    } as any);
  }

  if (payload.name !== undefined) form.append("name", String(payload.name));
  if (payload.bio !== undefined) form.append("bio", String(payload.bio));
  if (payload.age !== undefined) form.append("age", String(payload.age));
  if ((payload as any).profilePictureUrl !== undefined)
    form.append(
      "profilePictureUrl",
      String((payload as any).profilePictureUrl),
    );

  const { data } = await api.put("/users/update-me", form, {
    headers: {
      // Let axios/set the proper boundary; specifying multipart/form-data is fine
      "Content-Type": "multipart/form-data",
    },
  });

  return data && data.data ? data.data : data;
};
