import { createClient, RedisClientType } from 'redis';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

type StreamMessage<T = unknown> = {
  id: string;
  message: T;
};

type StreamMessages<T = unknown> = StreamMessage<T>[];

const stringifyObj = (data: object): Record<string, string> => {
  const stringifiedData: Record<string, string> = {};

  for (const [field, value] of Object.entries(data)) {
    stringifiedData[field] =
      typeof value === 'string' ? value : JSON.stringify(value);
  }

  return stringifiedData;
};

const parseRedisData = <T extends object>(data: Record<string, unknown>): T => {
  const parseValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        console.error('Cannot parse value:', value);
        return value;
      }
    }
    return value;
  };

  const parsed = Object.entries(data).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      acc[key] = parseValue(value);
      return acc;
    },
    {},
  );

  return parsed as T;
};

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({ url: 'redis://localhost:6379' });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis disconnected');
  }

  async createStream(key: string, group: string) {
    try {
      await this.client.xGroupCreate(key, group, '0', { MKSTREAM: true }); // 0 - start position for reading, MKSTREAM - create stream if not exists

      console.log('Group created');
    } catch (err) {
      // Ignore a case when the group has already created
      if (!(err instanceof Error) || !err.message.includes('BUSYGROUP')) {
        throw err;
      }
    }
  }

  async readStreamMessages<T extends object>(
    key: string,
    group: string,
    consumer: string,
  ): Promise<StreamMessages<T>> {
    const result = await this.client.xReadGroup(
      group,
      consumer,
      [{ key, id: '>' }],
      {
        COUNT: 10,
        BLOCK: 5000,
      },
    );

    if (!result) return [];

    return result[0].messages.reduce<StreamMessages<T>>(
      (acc, { id, message }) => {
        const value = parseRedisData<T>(message);

        if (value) {
          acc.push({
            id,
            message: value,
          });
        }

        return acc;
      },
      [],
    );
  }

  commitStreamMessage(key: string, group: string, messageId: string) {
    return this.client.xAck(key, group, messageId);
  }

  addStreamMessage(key: string, data: object) {
    return this.client.xAdd(key, '*', stringifyObj(data));
  }
}
