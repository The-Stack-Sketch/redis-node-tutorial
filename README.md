# redis-node-tutorial

Companion code for **The Stack Sketch** video *Redis Tutorial: Add Caching to a TypeScript Node.js API (with Docker)* (YouTube: @TheStackSketch).

A small TypeScript Express API with Redis in front of a deliberately slow "database". Every Redis step is logged, so you can watch what the cache does.

## Run it

You need Docker.

```bash
docker compose up --build
```

Then, in another terminal:

```bash
curl localhost:3000/events/42     # first time: MISS, ~800 ms
curl localhost:3000/events/42     # second time: HIT, ~1 ms
curl -X PUT -H "content-type: application/json" -d '{"seatsLeft":95}' localhost:3000/events/42
```

Watch every command Redis receives:

```bash
docker compose exec redis redis-cli MONITOR
```

Try the five basic commands (SET, GET, TTL, EXISTS, DEL):

```bash
docker compose exec api npm run basics
```

See the stale-cache bug from the video: set `CACHE_INVALIDATION: "off"` under `api.environment` in `docker-compose.yml`, then run `docker compose up --build` again.

## What's where

| Path | What it does |
|---|---|
| `docker-compose.yml` | Starts two containers: Redis and the API |
| `Dockerfile` | How the API's image is built |
| `package.json` | Dependencies (`express`, `redis`; `typescript` and `tsx` for development) and scripts |
| `tsconfig.json` | TypeScript settings (strict mode) |
| `src/server.ts` | Starts the Express API |
| `src/redis.ts` | Connects to Redis and logs when it's ready |
| `src/db.ts` | A pretend database: every read takes 800 ms |
| `src/routes/events.ts` | Cache-aside on reads, cache invalidation on updates |
| `scripts/basics.ts` | SET, GET, expiry, TTL, EXISTS and DEL, one at a time |

## Troubleshooting

**`Redis error: getaddrinfo ENOTFOUND redis`**: the API can't find the Redis container by name, usually because of old containers or a stale network from an earlier run. Clean up and rebuild:

```bash
docker compose down --remove-orphans
docker compose up --build
```

If it still happens, restart Docker Desktop and run the two commands again.

## Not using Node?

Redis doesn't care what your backend is written in; the idea stays the same. The same commands work in every language: `redis-py` in Python, Jedis or Lettuce in Java, `go-redis` in Go, Predis or phpredis in PHP.

## License

MIT
