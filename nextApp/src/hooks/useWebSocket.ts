// import { useEffect, useState } from "react";

// export function useWebSocket(url: string) {
//   const [ws, setWs] = useState<WebSocket | null>(null);

//   useEffect(() => {
//     const socket = new WebSocket(url);

//     socket.onopen = () => console.log("Connected");
//     socket.onclose = () => console.log("Disconnected");

//     setWs(socket);

//     return () => socket.close();
//   }, [url]);

//   return ws;
// }