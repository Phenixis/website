import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const redis = Redis.fromEnv()

type value = {
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
    const data = await redis.get(key) as value

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
    const data = await redis.get(key) as value
    return data?.views || 1
}