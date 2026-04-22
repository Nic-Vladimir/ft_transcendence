import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config/index.js";
import { initPackLoader, closePackLoader } from "./services/packLoader.js";
import { startIdleCleanup } from "./services/roomManager.js";
import { handleHttpRequest } from "./router.js";
import { handleMessage, handleDisconnect } from "./handlers/message.js";


initPackLoader(config.packsDir);
startIdleCleanup();
const server = http.createServer(handleHttpRequest);
const wss = new WebSocketServer({ server });


wss.on("connection", (ws) => {
  console.log("[ws] Client connected");

  ws.on("message", (raw) => handleMessage(ws, raw.toString()));
  ws.on("close", () => handleDisconnect(ws));
  ws.on("error", (err) => console.error("[ws] Socket error:", err));
});

server.listen(config.port, () => {
  console.log(`[server] Listening on port ${config.port}`);
  console.log(`[server] HTTP:      http://localhost:${config.port}`);
  console.log(`[server] WebSocket: ws://localhost:${config.port}`);
  console.log(`[server] Packs dir: ${config.packsDir}`);
  console.log(`[server] Questions:  easy=${config.questions.easy} medium=${config.questions.medium} hard=${config.questions.hard}`);
});


async function shutdown(signal: string) {
  console.log(`\n[server] ${signal} received — shutting down`);
  await closePackLoader();
  wss.close(() => {
    server.close(() => {
      console.log("[server] Closed");
      process.exit(0);
    });
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
