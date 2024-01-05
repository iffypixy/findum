import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";

import {PrismaModule} from "@lib/prisma";
import {config} from "@config/index";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config.redis, config.session],
      envFilePath: ".env",
    }),
    PrismaModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
