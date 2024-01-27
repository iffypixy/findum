import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import {AuthController} from "./auth.controller";
import {LoadUser} from "./middlewares";

@Module({
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoadUser).forRoutes({
      path: "auth/credentials",
      method: RequestMethod.GET,
    });
  }
}
