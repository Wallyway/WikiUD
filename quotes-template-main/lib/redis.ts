// quotes-template-main/lib/redis.ts
import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
    port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port) : 6379,
    password: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined,
    // Configuraciones de connection pooling
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: true,
    maxLoadingTimeout: 5000,
    // Configuraciones de timeout
    connectTimeout: 10000,
    commandTimeout: 5000,
    // Configuraciones de keep-alive
    keepAlive: 30000,
    family: 4,
    // Configuraciones de reconnection
    retryDelayOnClusterDown: 300,
    // Configuraciones de lazy connect
    lazyConnect: true,
    // Configuraciones de health check
    healthCheckInterval: 30000,
}

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", redisConfig);

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('ready', () => {
    console.log('Redis is ready to accept commands');
});

redis.on('close', () => {
    console.log('Redis connection closed');
});

redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
});

export default redis;