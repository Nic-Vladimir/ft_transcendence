import type { WebSocket } from "ws";
import type { IdentifyPayload } from "../types/message.js";
import { validateToken, upsertSession, updateSessionRoom } from "../services/sessionManager.js";
import { getRoom } from "../services/roomManager.js";
import { send } from "../services/roomManager.js";

function err(ws: WebSocket, code: string, message: string, requestId?: string): void {
  send(ws, { type: "error", requestId, ts: Date.now(), payload: { code, message } });
}

function reply(ws: WebSocket, type: string, payload: object, requestId?: string): void {
  send(ws, { type, requestId, ts: Date.now(), payload });
}

export function handleIdentify(
  ws: WebSocket,
  payload: IdentifyPayload,
  requestId?: string
): void {
  const { token, displayName } = payload ?? {};

  if (!token || !displayName) {
    err(ws, "INVALID_PAYLOAD", "token and displayName are required", requestId);
    return;
  }

  const auth = validateToken(token);
  if (!auth) {
    err(ws, "INVALID_TOKEN", "Token is invalid or expired", requestId);
    return;
  }

  const { session, reconnected } = upsertSession(auth.userId, displayName, ws);

  // If they had a room, check it still exists
  let previousRoom: { code: string; state: string } | null = null;
  if (session.roomCode) {
    const room = getRoom(session.roomCode);
    if (room) {
      previousRoom = { code: room.code, state: room.state };
    } else {
      // Room is gone — clear stale reference
      updateSessionRoom(auth.userId, null);
    }
  }

  reply(ws, "session:ack", {
    userId: auth.userId,
    displayName,
    reconnected,
    previousRoom,
  }, requestId);

  console.log(`[ws] ${reconnected ? "Reconnected" : "Identified"}: ${displayName} (${auth.userId})`);
}
