import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT ?? 3001),

  packsDir: process.env.PACKS_DIR ?? path.resolve(__dirname, "./trivia_packs"),
} as const;

