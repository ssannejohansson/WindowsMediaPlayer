import axios from "axios";
import logger from "./logger.js";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const getBasicAuthHeader = () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";

  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
};

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export const exchangeCodeForTokens = async (
  code: string,
): Promise<TokenResponse> => {
  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }).toString();

    const response = await axios.post(SPOTIFY_TOKEN_URL, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getBasicAuthHeader(),
      },
    });
    logger.info("Token exchange successful");
    return response.data;
  } catch (error) {
    logger.error("Token exchange failed:", error);
    throw error;
  }
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken.trim(),
    }).toString();

    const response = await axios.post(SPOTIFY_TOKEN_URL, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getBasicAuthHeader(),
      },
    });
    logger.info("Token refresh successful");
    return response.data;
  } catch (error) {
    logger.error("Token refresh failed:", error);
    throw error;
  }
};

export const getSpotifyAuthorizeURL = (): string => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-library-read",
      "playlist-read-private",
    ].join(" "),
  });
  return `https://accounts.spotify.com/authorize?${params}`;
};
