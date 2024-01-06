import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {config} from "@config/index";
import {PrismaModule} from "@lib/prisma";
import {RedisModule} from "@lib/redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config.redis, config.session],
      envFilePath: ".env",
    }),
    PrismaModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>("redis.host"),
        port: config.get<number>("redis.port"),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
