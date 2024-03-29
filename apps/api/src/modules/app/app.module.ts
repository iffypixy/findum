import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {config} from "@config/index";
import {PrismaModule} from "@lib/prisma";
import {RedisModule} from "@lib/redis";
import {SocketModule} from "@lib/socket";
import {AuthModule} from "@modules/auth";
import {ChatModule} from "@modules/chat";
import {FriendModule} from "@modules/friend";
import {PaymentModule} from "@modules/payment";
import {ProfileModule} from "@modules/profile";
import {ProjectModule} from "@modules/project";
import {UserModule} from "@modules/user";

import {AppGateway} from "./app.gateway";
import {UploadModule} from "@modules/upload";
import {AppController} from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        config.redis,
        config.session,
        config.robokassa,
        config.client,
        config.s3,
      ],
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
    SocketModule,
    AuthModule,
    ChatModule,
    ProjectModule,
    FriendModule,
    PaymentModule,
    ProfileModule,
    UserModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
