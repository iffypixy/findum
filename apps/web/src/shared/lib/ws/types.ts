interface WsGenericResponse {
  ok: boolean;
}

interface WsResponseFulfilled<T> extends WsGenericResponse {
  ok: true;
  payload: T;
}

interface WsResponseRejected extends WsGenericResponse {
  ok: false;
  msg: string;
}

export type WsResponse<T> = WsResponseFulfilled<T> | WsResponseRejected;

export type WsListener<T> = (payload: T) => void;
