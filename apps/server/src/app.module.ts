import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {config} from "@config/index";
import {PrismaModule} from "@lib/prisma";
import {RedisModule} from "@lib/redis";
import {AuthModule} from "@modules/auth";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config.redis, config.session, config.robokassa, config.client],
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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
