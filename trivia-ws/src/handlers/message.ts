import type { WebSocket } from "ws";
import type { ClientMessage, RoomCreatePayload, RoomJoinPayload, IdentifyPayload, AnswerPayload } from "../types/message.js";
import { getSessionByWs } from "../services/sessionManager.js";
import { send } from "../services/roomManager.js";
import { handleIdentify } from "./session.js";
import { handleRoomCreate, handleRoomJoin, handleRoomLeave, handleRoomList } from "./room.js";
import { handleReady, handleAnswer } from "./game.js";

function err(ws: WebSocket, code: string, message: string, requestId?: string): void {
  send(ws, { type: "error", requestId, ts: Date.now(), payload: { code, message } });
}

export function handleMessage(ws: WebSocket, raw: string): void {
  let msg: ClientMessage;

  try {
    msg = JSON.parse(raw);
  } catch {
    err(ws, "INVALID_MESSAGE", "Message must be valid JSON");
    return;
  }

  const { type, requestId, payload } = msg;

  if (type === "session:identify") {
    return handleIdentify(ws, payload as IdentifyPayload, requestId);
  }

  const session = getSessionByWs(ws);
  if (!session) {
    err(ws, "NOT_IDENTIFIED", "Send session:identify first", requestId);
    return;
  }

  switch (type) {
    case "room:create":
      return handleRoomCreate(ws, session.userId, session.displayName, payload as RoomCreatePayload, requestId);
    case "room:join":
      return handleRoomJoin(ws, session.userId, session.displayName, payload as RoomJoinPayload, requestId);
    case "room:leave":
      return handleRoomLeave(ws, session.userId, requestId);
    case "room:list":
      return handleRoomList(ws, requestId);
    case "game:ready":
      return handleReady(ws, session.userId, requestId);
    case "game:answer":
      return handleAnswer(ws, session.userId, payload as AnswerPayload, requestId);
    default:
      err(ws, "UNKNOWN_TYPE", `Unknown message type: ${type}`, requestId);
  }
}

export function handleDisconnect(ws: WebSocket): void {
  const session = getSessionByWs(ws);
  if (!session) return;
  console.log(`[ws] Disconnected: ${session.displayName} (${session.userId})`);
}
