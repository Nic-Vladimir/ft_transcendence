"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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
  const currentTrivia = trivia[currentQuestion - 1];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

		if (currentQuestion < questionsCount) {
			setCurrentQuestion((q) => q + 1);
			setSelectedAnswer(null);
			return 20;
        };

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
    <div className="h-screen w-full bg-[#070b14] text-white overflow-hidden">
	  <div className="relative isolate h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,110,245,0.28),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(88,80,236,0.22),transparent_24%),linear-gradient(180deg,#0a1020_0%,#070b14_45%,#060912_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_45%,rgba(129,140,248,0.20),transparent_16%),radial-gradient(circle_at_100%_60%,rgba(96,165,250,0.15),transparent_18%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(255,255,255,0.01)_100%)]" />

	    <main className="relative mx-auto flex h-full w-full max-w-7xl px-4 py-4">
  	      <div className="flex h-full w-full items-stretch gap-6">
            {/* Main game area */}
			{gameOver ? (
			<div className="flex h-full flex-1 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
				<div className="text-center">
				  <h1 className="text-4xl font-bold text-white">The End</h1>
				  <p className="mt-4 text-white/70">
					Thanks for playing.
				  </p>
				  <Link
					href="/dashboard"
					className="mt-8 inline-block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white-400 transition hover:bg-white/10 hover:text-white-300"
				  >
					Return to dashboard
				  </Link>
				</div>
			</div>
			) : (
			  <section className="flex h-full flex-1 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl overflow-hidden">
				<div className="mb-4 flex justify-center">
				  <div
					className={`px-8 py-3 text-5xl font-bold ${
					  secondsLeft > 10
					  	? "text-white"
						: secondsLeft > 5
						? "text-yellow-400"
						: "text-red-400"
					}`}
				  >
					{secondsLeft}
				  </div>
				</div>
				<div className="flex h-full flex-col justify-between">
				  {/* Question */}
				  <div className="flex flex-1 items-center justify-center">
					<div className="max-w-3xl text-center">
						<h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
						{currentTrivia.question}
						</h1>
						<p className="mt-4 text-sm leading-7 text-slate-300/70 md:text-base">
						Choose the correct answer below.
						</p>
					</div>
				  </div>

				  {/* Answers */}
				  <div className="mt-auto grid grid-cols-1 gap-4 md:grid-cols-2">
				    {currentTrivia.answers.map((answer, index) => (
					  <button
					    key={answer}
						onClick={() => setSelectedAnswer(index)}
						className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium transition" ${
						  selectedAnswer === index
						  ? "border-white-400 bg-white/20 text-white"
						  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
					  }`}
					>
					  {answer}
				    </button>
				   ))}
				  </div>
				</div>
			  </section>
		    )}
            {/*Sidebar */}
			<aside className="flex h-full w-80 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">Players</h2>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {players.map((player, index) => (
                  <div
                    key={player}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        {player}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-300/80">Ready</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Question
                </p>
                <div className="mt-2 text-2xl font-semibold text-white">
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