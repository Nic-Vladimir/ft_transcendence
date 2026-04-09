"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="min-h-screen w-full bg-[#070b14] text-white overflow-hidden">
      <div className="relative isolate min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,110,245,0.28),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(88,80,236,0.22),transparent_24%),linear-gradient(180deg,#0a1020_0%,#070b14_45%,#060912_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_45%,rgba(129,140,248,0.20),transparent_16%),radial-gradient(circle_at_100%_60%,rgba(96,165,250,0.15),transparent_18%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(255,255,255,0.01)_100%)]" />

        <main className="relative mx-auto flex min-h-screen w-full max-w-7xl px-4 py-4">
          <div className="flex w-full gap-6">
            {/* Sidebar */}
            <aside className="flex w-72 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
			  <div className="mt-8 flex flex-col gap-2">
                <button
                  onClick={() => setActiveView("profile")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activeView === "profile"
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Profile
                </button>

                <button
                  onClick={() => setActiveView("new_game")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activeView === "new_game"
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  New Game
                </button>

                <button
                  onClick={() => setActiveView("join_game")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activeView === "join_game"
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Join Game
                </button>
			  </div>

              <div className="mt-auto pt-8">
                <div className="flex flex-col gap-2">
				  <Link
					href="/dashboard"
					className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-white/10 hover:text-red-300"
				  >
					Logout
			      </Link>

                  <Link
                    href="/legal"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    Privacy Policy/Terms of Use
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <section className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              {activeView === "profile" && (
                <div className="space-y-4 text-sm leading-7 text-slate-300/80">
                  <h1 className="text-2xl font-semibold text-white">Profile</h1>
                  <p>This is the profile content.</p>
                </div>
              )}

              {activeView === "new_game" && (
                <div className="space-y-4 text-sm leading-7 text-slate-300/80">
                  <h1 className="text-2xl font-semibold text-white">New Game</h1>
                  <p>This is the new game content.</p>

				  <Link
					href="/game"
					className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-orange-400 transition hover:bg-white/10 hover:text-orange-300"
				  >
					Create Game
				  </Link>
                </div>
              )}

              {activeView === "join_game" && (
                <div className="space-y-4 text-sm leading-7 text-slate-300/80">
                  <h1 className="text-2xl font-semibold text-white">Join Game</h1>
                  <p>This is the join game content.</p>

				  <Link
					href="/game"
					className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-orange-400 transition hover:bg-white/10 hover:text-orange-300"				  >
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