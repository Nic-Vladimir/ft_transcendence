"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWS } from "@/context/WSContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/admin.css";

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

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <TriviaPage />
    </Suspense>
  );
}

function TriviaPage() {
  const ws = useWS();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");

  const [room, setRoom] = useState<Room | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const trivia = [
    {
      question: "When was 42 Prague established?",
      answers: ["2021", "2022", "2023", "2024"],
    },
    {
      question: "What is the address of 42 Prague?",
      answers: ["Kolbenova 6", "Kolbenova 9", "Kolbenova 13", "Kolbenova 42"],
    },
  ];

  const questionsCount = trivia.length;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const currentTrivia = trivia[currentQuestion - 1];

  useEffect(() => {
    if (!ws || !roomCode) return;

    const requestId = crypto.randomUUID();

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (
          (msg.type === "room:joined" || msg.type === "room:updated") &&
          (msg.requestId === requestId || msg.payload?.code === roomCode)
        ) {
          setRoom(msg.payload?.room ?? msg.payload);
        }
      } catch {
      }
    };

    const joinRoom = () => {
      ws.send(
        JSON.stringify({
          type: "room:join",
          requestId,
          ts: 1,
          payload: { code: roomCode },
        })
      );
    };

    ws.addEventListener("message", handleMessage);

    if (ws.readyState === WebSocket.OPEN) {
      joinRoom();
    } else {
      ws.addEventListener("open", joinRoom, { once: true });
    }

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws, roomCode]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (currentQuestion < questionsCount) {
          setCurrentQuestion((q) => q + 1);
          setSelectedAnswer(null);
          return 20;
        }

        setGameOver(true);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, currentQuestion, questionsCount, gameOver]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  return (
    <div className="game-shell min-vh-100 w-100 text-white overflow-hidden">
      <div className="position-relative min-vh-100">
        <div className="game-bg-1 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="game-bg-2 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="game-bg-3 position-absolute top-0 start-0 end-0 bottom-0" />

        {!gameStarted ? (
          <main className="position-relative mx-auto d-flex min-vh-100 w-100 game-max-width px-3 py-3">
            <section className="game-glass w-100 d-flex flex-column align-items-center justify-content-center p-4 p-lg-5">
              <h1 className="mb-4">Waiting Room</h1>

              <div className="w-100" style={{ maxWidth: "500px" }}>
                {room?.players.map((player) => (
                  <div
                    key={player.userId}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <span>{player.displayName}</span>

                    <span className={player.isReady ? "text-success" : "text-white-50"}>
                      {player.isReady ? "Ready" : "Not ready"}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-white-50">
                {room?.players.filter((p) => p.isReady).length ?? 0}/{room?.players.length ?? 0} players ready
              </p>
              <div className="mt-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setGameStarted(true)}
                >
                  Start Game
                </button>
              </div>
            </section>
          </main>
        ) : (

          <main className="position-relative mx-auto d-flex min-vh-100 w-100 game-max-width px-3 py-3">
            <div className="d-flex w-100 gap-4 flex-column flex-lg-row align-items-stretch">
              {gameOver ? (
                <section className="game-glass flex-grow-1 d-flex align-items-center justify-content-center p-4 p-lg-5">
                  <div className="text-center">
                    <h1 className="game-end-title">The End</h1>
                    <p className="mt-3 text-white-50">Thanks for playing.</p>
                    <Link href="/dashboard" className="btn game-link-btn mt-4">
                      Return to dashboard
                    </Link>
                  </div>
                </section>
              ) : (
                <section className="game-glass flex-grow-1 d-flex flex-column p-4 p-lg-5 overflow-hidden">
                  <div className="d-flex justify-content-center mb-3">
                    <div
                      className={`game-timer ${
                        secondsLeft > 10
                          ? "game-timer-safe"
                          : secondsLeft > 5
                          ? "game-timer-warn"
                          : "game-timer-danger"
                      }`}
                    >
                      {secondsLeft}
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-grow-1 justify-content-between">
                    <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                      <div className="text-center game-question-wrap">
                        <h1 className="game-question">{currentTrivia.question}</h1>
                        <p className="mt-3 game-subtitle">
                          Choose the correct answer below.
                        </p>
                      </div>
                    </div>

                    <div className="row g-3 mt-auto">
                      {currentTrivia.answers.map((answer, index) => (
                        <div className="col-12 col-md-6" key={answer}>
                          <button
                            type="button"
                            onClick={() => setSelectedAnswer(index)}
                            className={`btn w-100 game-answer-btn text-start ${
                              selectedAnswer === index ? "game-answer-selected" : ""
                            }`}
                          >
                            {answer}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <aside className="game-glass game-sidebar d-flex flex-column p-4">
                <div className="mb-4">
                  <h2 className="game-sidebar-title">Players</h2>
                </div>

                <div className="d-flex flex-column gap-3 flex-grow-1">
                  {room?.players.map((player, index) => (
                    <div key={player.userId} className="game-player-row">
                      <div className="d-flex align-items-center gap-3">
                        <div className="game-player-badge">{index + 1}</div>
                        <span className="game-player-name">{player.displayName}</span>
                      </div>

                      <span className="game-player-status">
                        {player.isReady ? "Ready" : "Not ready"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 game-question-footer">
                  <p className="game-question-label">Question</p>
                  <div className="game-question-count">
                    {currentQuestion}/{questionsCount}
                  </div>
                </div>
              </aside>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
