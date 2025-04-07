import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
        port: parseInt(configService.get<string>('REDIS_PORT', '6379')),
      },
    });
    return { store: () => store };
  },
  imports: [ConfigModule],
  inject: [ConfigService],
};
