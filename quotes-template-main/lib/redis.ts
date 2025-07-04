// quotes-template-main/lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redis;