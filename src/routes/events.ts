import { Router } from "express";
import { redis } from "../redis.js";
import { getEvent, updateEvent } from "../db.js";

export const events = Router();
const TTL_SECONDS = 60;

// Read: check Redis first (cache-aside).
events.get("/events/:id", async (req, res) => {
  const key = `event:${req.params.id}`;
  const start = Date.now();

  if (redis.isReady) {
    const cached: string | null = await redis.get(key);
    if (cached) {
      console.log(`HIT  ${key}  (${Date.now() - start} ms)`);
      return res.json(JSON.parse(cached));
    }
  }

  const event = await getEvent(Number(req.params.id));
  if (!event) return res.status(404).json({ error: "Event not found" }); // never cache a miss

  if (redis.isReady) await redis.set(key, JSON.stringify(event), { EX: TTL_SECONDS });
  console.log(`MISS ${key}  (${Date.now() - start} ms, from the database)`);
  res.json(event);
});

// Write: update the database, then delete the cached copy so nobody sees stale data.
events.put("/events/:id", async (req, res) => {
  const event = await updateEvent(Number(req.params.id), req.body);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const key = `event:${req.params.id}`;
  // Chapter 7: run with CACHE_INVALIDATION=off to see the stale-data bug.
  if (process.env.CACHE_INVALIDATION === "off") {
    console.log(`UPDATED ${key} in the database only`);
    return res.json(event);
  }
  if (redis.isReady) await redis.del(key);
  console.log(`UPDATED ${key}, cache cleared`);
  res.json(event);
});
