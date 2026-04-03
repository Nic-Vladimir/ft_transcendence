import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config.js";
import { initPackLoader, closePackLoader } from "./services/packLoader.js";
import { handleHttpRequest } from "./router.js";


initPackLoader(config.packsDir);
const server = http.createServer(handleHttpRequest);
const wss = new WebSocketServer({ server });


wss.on("connection", (ws) => {
  console.log("[ws] Client connected");

  ws.on("message", (raw) => {
    console.log("[ws] Message received:", raw.toString());
  });

  ws.on("close", () => {
    console.log("[ws] Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("[ws] Socket error:", err);
  });
});

server.listen(config.port, () => {
  console.log(`[server] Listening on port ${config.port}`);
  console.log(`[server] HTTP:      http://localhost:${config.port}`);
  console.log(`[server] WebSocket: ws://localhost:${config.port}`);
  console.log(`[server] Packs dir: ${config.packsDir}`);
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
