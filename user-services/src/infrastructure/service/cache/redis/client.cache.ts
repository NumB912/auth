import type ICache from "@domain/interface/cache.entities.js";
import type { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import 'dotenv/config';
import cacheConfig from "src/config/cache.config.js";
 
class RedisCache implements ICache {
  private client: RedisClientType;         
  private static instance: RedisCache;

  private constructor() {
    this.client = createClient({
      url: `${cacheConfig.HOST}:${cacheConfig.PORT}`,
    });

    this.client.on('error', (err) => {
      console.error('[Redis error]', err);
    });

    this.client.on('connect', () => {     
      console.log('[Redis] Đã kết nối thành công');
    });
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async disconnect():Promise<void>{
    await this.client.disconnect();
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default RedisCache;