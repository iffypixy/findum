import {request} from "@shared/lib/request";

const getRooms = () => request({method: "GET", url: "/room/find"});

export const api = {getRooms};
