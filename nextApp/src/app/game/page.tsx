"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/admin.css";

export default function TriviaPage() {
  const players = ["Tom", "Kate", "Adam", "Steve"];
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
    if (gameOver) return;

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
  }, [currentQuestion, questionsCount, gameOver]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  return (
    <div className="game-shell min-vh-100 w-100 text-white overflow-hidden">
      <div className="position-relative min-vh-100">
        <div className="game-bg-1 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="game-bg-2 position-absolute top-0 start-0 end-0 bottom-0" />
        <div className="game-bg-3 position-absolute top-0 start-0 end-0 bottom-0" />

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
                {players.map((player, index) => (
                  <div key={player} className="game-player-row">
                    <div className="d-flex align-items-center gap-3">
                      <div className="game-player-badge">{index + 1}</div>
                      <span className="game-player-name">{player}</span>
                    </div>
                    <span className="game-player-status">Ready</span>
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
      </div>
    </div>
  );
}