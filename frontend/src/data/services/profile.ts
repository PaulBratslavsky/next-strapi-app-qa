import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TAuthUser } from "@/types";
import { services } from "@/data/services";
import { actions } from "@/data/actions";
import { api } from "@/data/data-api";

type TUpdateProfile = {
  firstName: string;
  lastName: string;
  bio: string;
};

const baseUrl = getStrapiURL();

export async function updateProfileService(
  profileData: TUpdateProfile
): Promise<TStrapiResponse<TAuthUser>> {
  const userId = (await services.auth.getUserMeService()).data?.id;
  if (!userId) throw new Error("User Id is required");

  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const url = new URL("/api/users/" + userId, baseUrl);
  const result = await api.put<TAuthUser, TUpdateProfile>(
    url.href,
    profileData,
    { authToken }
  );

  console.dir(result, { depth: null });

  return result;
}

export async function updateProfileImageService(
  imageId: number
): Promise<TStrapiResponse<TAuthUser>> {
  const userId = (await services.auth.getUserMeService()).data?.id;
  if (!userId) throw new Error("User Id is required");

  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const url = new URL("/api/users/" + userId, baseUrl);
  const payload = { image: imageId };

  const result = await api.put<TAuthUser, { image: number }>(
    url.href,
    payload,
    { authToken }
  );

  console.dir(result, { depth: null });

  return result;
}