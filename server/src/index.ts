import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import logger from "./lib/logger";
import authRouter from "./routes/auth";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: process.env.CLIENT_URL || "http://127.0.0.1:5173" }));
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (_req, res) => {
  res.send("Spotify WMP Clone API");
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error("Unhandled error: %o", err);
    res.status(500).json({ error: "internal_server_error" });
  },
);

app.listen(PORT, () => {
  logger.info(`Server listening on http://127.0.0.1:${PORT}`);
});
