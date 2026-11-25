import { createClient } from "redis";

// The five commands you'll use most, one at a time, with what Redis answers.
const redis = createClient({ url: process.env.REDIS_URL ?? "redis://localhost:6379" });
await redis.connect();
const show = (cmd: string, result: unknown) => console.log(cmd.padEnd(42), "→", result);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

show('SET greeting "hello"', await redis.set("greeting", "hello"));
show("GET greeting", await redis.get("greeting"));

show('SET session:abc "user 42" EX 5', await redis.set("session:abc", "user 42", { EX: 5 }));
show("TTL session:abc", await redis.ttl("session:abc"));
console.log("...waiting 6 seconds");
await sleep(6000);
show("GET session:abc", await redis.get("session:abc"));

show("EXISTS greeting", await redis.exists("greeting"));
show("DEL greeting", await redis.del("greeting"));
show("GET greeting", await redis.get("greeting"));

await redis.quit();
