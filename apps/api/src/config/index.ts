import {redis} from "./redis.config";
import {session} from "./session.config";
import {robokassa} from "./robokassa.config";
import {client} from "./client.config";
import {s3} from "./s3.config";

export const config = {redis, session, robokassa, client, s3};
