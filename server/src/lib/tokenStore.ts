import { prisma } from "./prisma.js";

export type SpotifyTokenPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
};

const toExpiresAt = (expiresIn: number) =>
  new Date(Date.now() + expiresIn * 1000);

export const saveToken = async (
  spotifyId: string,
  token: SpotifyTokenPayload,
) => {
  return prisma.token.upsert({
    where: { spotifyId },
    create: {
      spotifyId,
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? "",
      expiresAt: toExpiresAt(token.expires_in),
      scope: token.scope ?? null,
      tokenType: token.token_type ?? "Bearer",
    },
    update: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? undefined,
      expiresAt: toExpiresAt(token.expires_in),
      scope: token.scope ?? null,
      tokenType: token.token_type ?? "Bearer",
    },
  });
};

export const updateToken = async (
  spotifyId: string,
  token: SpotifyTokenPayload,
) => {
  const existing = await prisma.token.findUnique({
    where: { spotifyId },
  });

  if (!existing) {
    throw new Error(`No token row found for spotifyId: ${spotifyId}`);
  }

  return prisma.token.update({
    where: { spotifyId },
    data: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? existing.refreshToken,
      expiresAt: toExpiresAt(token.expires_in),
      scope: token.scope ?? existing.scope,
      tokenType: token.token_type ?? existing.tokenType,
    },
  });
};

export const getTokenBySpotifyId = async (spotifyId: string) => {
  return prisma.token.findUnique({
    where: { spotifyId },
  });
};

export const getLatestToken = async () => {
  return prisma.token.findFirst({
    orderBy: { updatedAt: "desc" },
  });
};
