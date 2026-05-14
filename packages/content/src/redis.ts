import { Redis } from '@upstash/redis'
import crypto from 'crypto'

const redisConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = redisConfigured ? Redis.fromEnv() : null

type RedisValue = {
    views: number,
    hashedIps: string[]
}

export function hashIp(ip: string, key?: string) {
    if (key) {
        return crypto.createHmac("sha256", key).update(ip).digest("hex");
    }
    return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function incrementViews(key: string, hashed_ip_address: string) {
    if (!redis) return
    const data = await redis.get(key) as RedisValue

    if (data === null) {
        await redis.set(key, { views: 1, hashedIps: [hashed_ip_address] })
        return
    }

    if (data.hashedIps.includes(hashed_ip_address)) {
        return
    }

    await redis.set(key, { views: data.views + 1, hashedIps: [...data.hashedIps, hashed_ip_address] })
}

export async function getViews(key: string) {
    if (!redis) return 0
    const data = await redis.get(key) as RedisValue
    return data?.views || 1
}

export async function getMergedViews(keys: string[]) {
    if (!redis) return 0
    const results = await Promise.all(
        keys.map(key => redis!.get<RedisValue>(key))
    )
    const total = results.reduce((sum, data) => sum + (data?.views ?? 0), 0)
    return total || 1
}
