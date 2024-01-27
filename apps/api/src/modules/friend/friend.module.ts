import {Module} from "@nestjs/common";

import {FriendController} from "./friend.controller";

@Module({
  controllers: [FriendController],
})
export class FriendModule {}
