"use client";

import { createContext, useContext } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

const WSContext = createContext<WebSocket | null>(null);

export function WSProvider({ children }: { children: React.ReactNode }) {
  const ws = useWebSocket("wss://localhost:8443/ws");

  return (
    <WSContext.Provider value={ws}>
      {children}
    </WSContext.Provider>
  );
}

export const useWS = () => useContext(WSContext);