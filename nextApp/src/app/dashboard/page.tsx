"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const [activeView, setActiveView] = useState("new_game");
  const [roomCode, setRoomCode] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch("/ws/packs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setPacks(data.packs ?? []))
      .catch(console.error);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function createGame() {
    if (!selectedPack) return;
    router.push(`/game?mode=create&packId=${encodeURIComponent(selectedPack)}`);
  }

  function joinGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = roomCode.trim().toUpperCase();
    if (!code) return;

    router.push(`/game?mode=join&code=${encodeURIComponent(code)}`);
  }

  function getDashboardWsUrl() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws/`;
  }

  useEffect(() => {
    let closedByCleanup = false;
    const ws = new WebSocket(getDashboardWsUrl());
    wsRef.current = ws;

    ws.onerror = (event) => {
      console.error("Dashboard WebSocket error", event);
    };

    ws.onclose = (event) => {
      console.log("Dashboard WebSocket closed", event.code, event.reason);
      if (!closedByCleanup) {
        console.warn(event.reason || `Connection closed (${event.code})`);
      }
    };

    return () => {
      closedByCleanup = true;
      wsRef.current = null;
      ws.close();
    };
  }, []);

  const refreshRooms = useCallback(() => {
    const ws = wsRef.current;
    if (!ws) return;

    const requestId = crypto.randomUUID();

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "room:list" && msg.requestId === requestId) {
          setRooms(msg.payload.rooms ?? []);
          ws.removeEventListener("message", handleMessage);
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    const sendRoomList = () => {
      ws.send(
        JSON.stringify({
          type: "room:list",
          requestId,
          ts: Date.now(),
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
  }, []);

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
                  onClick={() => setActiveView("join_game")}
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
                  <button
                    type="button"
                    onClick={logout}
                    className="btn dashboard-link-btn text-danger"
                  >
                    Logout
                  </button>

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
                  <p className="text-white/80">Pick a game to start.</p>
                  <div className="row g-3">
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

                  <button
                    type="button"
                    onClick={createGame}
                    disabled={!selectedPack}
                    className={`btn dashboard-action-btn mt-3 ${!selectedPack ? "disabled" : ""}`}
                  >
                    Create Game
                  </button>
                </div>
              )}

              {activeView === "join_game" && (
                <div className="dashboard-content text-body-secondary">
                  <h1 className="dashboard-title">Join Game</h1>
                  <p className="text-white/80">Enter the room code from the host.</p>

                  <form onSubmit={joinGame} className="d-flex flex-column gap-3 mt-3">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                      className="form-control"
                      maxLength={4}
                      placeholder="Room code"
                    />
                    <button type="submit" className="btn dashboard-action-btn">
                      Join Game
                    </button>
                  </form>
                  <p className="text-white/80 mt-3">Or you can choose from public games.</p>
                  <div className="dashboard-hide-scrollbar" style={{ maxHeight: "300px" }}>
                    <div className="row g-3">
                      {rooms.map((room) => (
                        <div key={room.code} className="col-12 col-md-6 col-lg-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/game?mode=join&code=${encodeURIComponent(room.code)}`)
                            }
                            className="w-100 text-start dashboard-pack p-3 h-100"
                          >
                            <h5 className="text-white">Room {room.code}</h5>
                            <p className="text-white/70 mb-2">
                              Pack: {room.packId}
                              <br />
                              Players: {room.players.length}/{room.maxPlayers}
                              <br />
                              State: {room.state}
                            </p>
                            <small className="text-white/50">Public</small>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
