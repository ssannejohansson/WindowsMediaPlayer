import axios from "axios";
import express from "express";
import logger from "../lib/logger.js";
import {
  getSpotifyAuthorizeURL,
  exchangeCodeForTokens,
  refreshAccessToken,
} from "../lib/spotify.js";
import { getLatestToken, saveToken, updateToken } from "../lib/tokenStore.js";

const router = express.Router();

// Redirect user to Spotify authorize page
router.get("/login", (req, res) => {
  const url = getSpotifyAuthorizeURL();
  logger.info("Redirecting to Spotify authorize URL");
  res.redirect(url);
});

// OAuth callback — exchange code for tokens and redirect back to client
router.get("/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error) {
    logger.error("Spotify callback returned error: %s", String(error));
    return res.status(400).send("Authorization error");
  }

  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing code");
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    logger.info("Token exchange scopes: %s", tokens.scope ?? "(none returned)");

    const profileResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    await saveToken(profileResponse.data.id, tokens);

    // For development we redirect to the client and include tokens in the query.
    // In production, store tokens server-side (DB) and issue a secure session cookie instead.
    const params = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || "",
      expires_in: String(tokens.expires_in),
      spotify_id: profileResponse.data.id,
      display_name: profileResponse.data.display_name || "",
    });
    const clientUrl = process.env.CLIENT_URL || "http://127.0.0.1:5173";
    const destination = `${clientUrl}/auth/callback?${params.toString()}`;
    // Serve a page that navigates explicitly — bare 302 redirects from Spotify's
    // origin can be blocked by Chrome in certain browser states.
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8">
<script>window.location.replace(${JSON.stringify(destination)})</script>
</head><body></body></html>`);
  } catch (err) {
    logger.error("Failed to exchange code for tokens: %o", err);
    res.status(500).send("Token exchange failed");
  }
});

// Refresh endpoint — accepts JSON { refresh_token }
router.post("/refresh", express.json(), async (req, res) => {
  const existingToken = await getLatestToken();

  if (!existingToken) {
    return res.status(404).json({ error: "no_saved_token" });
  }

  try {
    const refreshed = await refreshAccessToken(existingToken.refreshToken);
    await updateToken(existingToken.spotifyId, refreshed);

    return res.json(refreshed);
  } catch (err) {
    logger.error("Refresh failed: %o", err);
    return res.status(500).json({ error: "refresh_failed" });
  }
});

export default router;
