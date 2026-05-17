"use client";

import { useEffect, useState } from "react";
import { useWS } from "@/context/WSContext";
import Link from "next/link";
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

export default function Dashboard() {
  const [activeView, setActiveView] = useState("new_game");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const ws = useWS();
  const [user] = useState<{ token: string; name: string }>({
    token: "tom", //TODO
    name: "Tom", //TODO
  });

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
      requestId: crypto.randomUUID(),
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

                  {/* <Link href="/game" className="btn dashboard-action-btn mt-2">
                    Create Game
                  </Link> */}
                  {/* <button
                    className="btn dashboard-action-btn mt-2"
                    disabled={!selectedPack}
                    onClick={() => {
                      if (selectedPack) {
                        window.location.href = `/game?pack=${selectedPack}`;
                      }
                    }}
                  >
                    Create Game
                  </button> */}
                  <Link
                    href={selectedPack ? `/game?pack=${selectedPack}` : "#"}
                    className={`btn dashboard-action-btn mt-2 ${
                      !selectedPack ? "disabled" : ""
                    }`}
                    aria-disabled={!selectedPack}
                    onClick={(e) => {
                      if (!selectedPack) e.preventDefault();
                    }}
                  >
                    Create Game
                  </Link>
                </div>

              )}

              {activeView === "join_game" && (
                <div className="dashboard-content text-body-secondary">
                  <h1 className="dashboard-title">Join Game</h1>
                  <p className="text-white/80">This is the join game content.</p>

                  <Link href="/game" className="btn dashboard-action-btn mt-2">
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
