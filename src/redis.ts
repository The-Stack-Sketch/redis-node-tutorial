import { createClient } from "redis";

// In Docker the URL points at the "redis" service; on your laptop it's localhost.
export const redis = createClient({ url: process.env.REDIS_URL ?? "redis://localhost:6379" });

redis.on("error", (err) => console.error("Redis error:", err.message));
redis.on("ready", () => console.log("Redis connected"));

// Don't await: the API starts even if Redis is down, and the client keeps retrying.
redis.connect().catch(() => {});
