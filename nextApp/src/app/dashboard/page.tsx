"use client";

import { useEffect, useState, useCallback } from "react";
import { useWS } from "@/context/WSContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/admin.css";

type Pack = {
  id: string;
  name: string;
  questionCount: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
};

type RoomPlayer = {
  userId: string;
  displayName: string;
  score: number;
  isSpectator: boolean;
  isReady: boolean;
};

type Room = {
  code: string;
  isPublic: boolean;
  packId: string;
  maxPlayers: number;
  state: string;
  players: RoomPlayer[];
};

export default function Dashboard() {
  const [activeView, setActiveView] = useState("new_game");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const ws = useWS();
  const [user] = useState<{ token: string; name: string }>({
    token: "tom", //TODO
    name: "Tom", //TODO
  });
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const handleCreateGame = () => {
    if (!ws || !selectedPack) return;

    const requestId = crypto.randomUUID(); //TODO - what should it be

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type !== "room:created" || msg.requestId !== requestId) return;

        ws.removeEventListener("message", handleMessage);

        const roomCode = msg.payload?.code;
        if (!roomCode) return;

        router.push(`/game?room=${roomCode}`);
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    ws.send(
      JSON.stringify({
        type: "room:create",
        requestId,
        ts: 1,
        payload: {
          packId: selectedPack,
          isPublic: true,
          maxPlayers: 8,
        },
      })
    );
  };
  const handleJoinGame = () => {
    if (!ws || !selectedRoom) return;

    const msg = {
      type: "room:join",
      requestId: "r2", //TODO?
      ts: 1, //TODO?
      payload: {
        code: selectedRoom,
      },
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      ws.addEventListener(
        "open",
        () => ws.send(JSON.stringify(msg)),
        { once: true }
      );
    }
  };
  const refreshRooms = useCallback(() => {
    if (!ws) return;

    const requestId = crypto.randomUUID(); //TODO - what should it be

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "room:list" && msg.requestId === requestId) {
          setRooms(msg.payload.rooms ?? []);
        }
      } catch {
      }
    };

    const sendRoomList = () => {
      ws.send(
        JSON.stringify({
          type: "room:list",
          requestId,
          ts: 1, //TODO - what should it be
          payload: {},
        })
      );
    };

    ws.addEventListener("message", handleMessage);

    if (ws.readyState === WebSocket.OPEN) {
      sendRoomList();
    } else {
      ws.addEventListener("open", sendRoomList, { once: true });
    }

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  useEffect(() => {
    fetch("/ws/packs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setPacks(data.packs))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!ws || !user ) return;

    const sendIdentify = () => {
      ws.send(JSON.stringify({
        type: "session:identify",
        requestId: crypto.randomUUID(), //TODO - what should it be
        ts: 1, //TODO - what should it be
        payload: {
          token: user.token,
          displayName: user.name,
        },
      }));
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendIdentify();
    } else {
      ws.addEventListener("open", sendIdentify, { once: true });
    }
  }, [ws, user]);

  useEffect(() => {
    if (activeView !== "join_game") return;
    const cleanup = refreshRooms();
    return cleanup;
  }, [activeView, refreshRooms]);

  return (
    <div className="dashboard-shell min-vh-100 w-100 text-white overflow-hidden">
      <div className="position-relative min-vh-100">
        <div className="dashboard-bg-1 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="dashboard-bg-2 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="dashboard-bg-3 position-absolute top-0 start-0 end-0 bottom-0" />

        <main className="position-relative mx-auto d-flex min-vh-100 w-100 dashboard-max-width px-3 py-3">
          <div className="d-flex w-100 gap-4 flex-column flex-lg-row">
            <aside className="dashboard-glass dashboard-sidebar d-flex flex-column p-4">
              <div className="mt-4 d-flex flex-column gap-2">
                <button
                  onClick={() => setActiveView("profile")}
                  className={`btn dashboard-nav-btn text-start ${
                    activeView === "profile"
                    ? "dashboard-nav-active"
                    : ""
                  }`}
                >
                  Profile
                </button>

                <button
                  onClick={() => setActiveView("new_game")}
                  className={`btn dashboard-nav-btn text-start ${
                    activeView === "new_game"
                    ? "dashboard-nav-active"
                    : ""
                  }`}
                >
                  New Game
                </button>

                <button
                  onClick={() => {
                    setActiveView("join_game")
                    setSelectedRoom(null);
                    refreshRooms();
                  }}
                  className={`btn dashboard-nav-btn text-start ${
                    activeView === "join_game"
                    ? "dashboard-nav-active"
                    : ""
                  }`}
                >
                  Join Game
                </button>
              </div>

              <div className="mt-auto pt-4">
                <div className="d-flex flex-column gap-2">
                  <Link href="/login" className="btn dashboard-link-btn text-danger">
                    Logout
                  </Link>

                  <Link href="/legal" className="btn dashboard-link-btn text-white">
                    Privacy Policy/Terms of Use
                  </Link>
                </div>
              </div>
            </aside>

            <section className="dashboard-glass flex-grow-1 p-4 p-lg-5">
              {activeView === "profile" && (
                <div className="dashboard-content text-body-secondary">
                  <h1 className="dashboard-title">Profile</h1>
                  <p className="text-white/80">This is the profile content.</p>
                </div>
              )}

              {activeView === "new_game" && (
                <div className="dashboard-content text-body-secondary">
                  <h1 className="dashboard-title">New Game</h1>
                  <div className="dashboard-hide-scrollbar" style={{maxHeight: "300px",  }}>
                    <div className="row g-3 mt-2">
                      {packs.map((pack) => (
                        <div key={pack.id} className="col-12 col-md-6 col-lg-4">
                          <button
                            type="button"
                            onClick={() => setSelectedPack(pack.id)}
                            className={`w-100 text-start dashboard-pack p-3 h-100 ${
                              selectedPack === pack.id ? "dashboard-pack-selected" : ""
                            }`}
                          >
                            <h5 className="text-white">{pack.name}</h5>

                            <p className="text-white/70 mb-2">
                              Questions: {pack.questionCount.total}
                            </p>

                            <small className="text-white/50">
                              Easy: {pack.questionCount.easy} | Medium: {pack.questionCount.medium} | Hard: {pack.questionCount.hard}
                            </small>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn dashboard-action-btn mt-2 ${
                      !selectedPack ? "disabled" : ""
                    }`}
                    disabled={!selectedPack}
                    onClick={handleCreateGame}
                  >
                    Create Game
                  </button>
                </div>

              )}

              {activeView === "join_game" && (
                <div className="dashboard-content text-body-secondary">
                  <h1 className="dashboard-title">Join Game</h1>

                  <div className="dashboard-hide-scrollbar" style={{ maxHeight: "300px" }}>
                    <div className="row g-3 mt-2">
                      {rooms.map((room) => (
                        <div key={room.code} className="col-12 col-md-6 col-lg-4">
                          <button
                            type="button"
                            onClick={() => setSelectedRoom(room.code)}
                            className={`w-100 text-start dashboard-pack p-3 h-100 ${
                              selectedRoom === room.code ? "dashboard-pack-selected" : ""
                            }`}
                          >
                            <h5 className="text-white">Room {room.code}</h5>

                            <p className="text-white/70 mb-2">
                              Pack: {room.packId}
                              <br />
                              Players: {room.players.length}/{room.maxPlayers}
                              <br />
                              State: {room.state}
                            </p>

                            <small className="text-white/50">
                              {room.isPublic ? "Public" : "Private"}
                            </small>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={selectedRoom ? `/game?room=${selectedRoom}` : "#"}
                    className={`btn dashboard-action-btn mt-2 ${
                      !selectedRoom ? "disabled" : ""
                    }`}
                    aria-disabled={!selectedRoom}
                    onClick={(e) => {
                      if (!selectedRoom) {
                        e.preventDefault();
                        return;
                      }

                      handleJoinGame();
                    }}
                  >
                    Join Game
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
