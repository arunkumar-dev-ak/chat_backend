import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    this.publisher = redisClient.duplicate();
    this.subscriber = redisClient.duplicate();
  }

  async set(key: string, value: string, ttl: number) {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  //publisher publishes the message
  async publish(channel: string, message: string) {
    // console.log('in publisher');
    await this.publisher.publish(channel, message);
  }

  //subscriber
  async subscribe(channel: string, handler: (message: string) => void) {
    // console.log('in subscriber');
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (chan, message) => {
      // console.log('in processing message');1
      if (chan === channel) {
        handler(message);
      }
    });
  }
}
