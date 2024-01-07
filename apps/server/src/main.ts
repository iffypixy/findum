import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";

import {session} from "@lib/session";
import {AppModule} from "@modules/app";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(session);

  await app.listen(3000);
}

bootstrap();
