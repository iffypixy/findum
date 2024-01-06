import {Injectable} from "@nestjs/common";
import {Redis} from "ioredis";

import {InjectRedis} from "./redis.decorator";

@Injectable()
export class RedisService {
  constructor(@InjectRedis() readonly client: Redis) {}

  async expire(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const json = await this.client.get(key);
    const parsed = JSON.parse(json) || null;

    return parsed;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async update<T>(key: string, partial: Partial<T>): Promise<void> {
    const value = (await this.get<T>(key)) || {};

    const updated = {...value, ...partial};

    await this.set(key, updated);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
