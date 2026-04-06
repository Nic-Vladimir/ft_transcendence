"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Scale, ShieldAlert, CircleUserRound, Globe } from "lucide-react";

const chips = [
  "Email address",
  "Display name / username",
  "Profile picture",
  "Google account ID (OAuth)",
  "Game scores & history",
  "Friends list",
  "IP address & device info",
  "Session cookies",
];

type Tab = "privacy" | "terms";

export default function LegalPolicyClient({
  initialTab,
}: {
  initialTab: Tab;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`/legal?tab=${tab}`);
  };

  return (
    //<div className="min-h-screen w-full overflow-hidden bg-[#070b14] text-white">
    //<div className="text-white">
      //<div className="relative isolate min-h-screen">
      <div className="relative isolate">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,110,245,0.28),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(88,80,236,0.22),transparent_24%),radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.10),transparent_30%),linear-gradient(180deg,#0a1020_0%,#070b14_45%,#060912_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_45%,rgba(129,140,248,0.20),transparent_16%),radial-gradient(circle_at_100%_60%,rgba(96,165,250,0.15),transparent_18%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(255,255,255,0.01)_100%)]" />
        <main className="relative mx-auto flex w-full max-w-none flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="mt-2 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/20 backdrop-blur-md">
            <button
              onClick={() => handleTabChange("privacy")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeTab === "privacy"
                  ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                  : "text-white/45 hover:text-white/75"
              }`}
            >
              Privacy Policy
            </button>

            <button
              onClick={() => handleTabChange("terms")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeTab === "terms"
                  ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                  : "text-white/45 hover:text-white/75"
              }`}
            >
              Terms of Use
            </button>
          </div>

          {activeTab === "privacy" ? (
            <>
              <div className="mt-14 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-slate-300/90 backdrop-blur-md">
                  <Scale className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-blue-400">LEGAL</span>
                  <span className="tracking-[0.2em] text-white/45">· TRIVIAAPP</span>
                </div>

                <h1
                  className="mt-8 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-[#e8e4df] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Transparent by Design
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300/60 sm:text-base">
                  We keep things simple. Here&apos;s exactly what we collect, why, and what you agree to.
                </p>
              </div>

              <section className="mt-14 w-full max-w-5xl rounded-3xl border border-blue-400/25 bg-[#111a33]/55 px-5 py-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
                <div className="flex items-start gap-4 text-slate-200/80">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20">
                    <Lock className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 sm:text-base">
                    We never sell your personal data to third parties. This policy explains what we collect, how we use it,
                    and what control you have over it.
                  </p>
                </div>
              </section>

              <section className="mt-6 w-full max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(76,97,171,0.14)_0%,rgba(29,45,84,0.34)_50%,rgba(21,28,53,0.62)_100%)] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-blue-400/90">
                  <span>01</span>
                  <span>-</span>
                  <span>DATA COLLECTION</span>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-blue-400/40 via-white/5 to-transparent" />

                <h2
                  className="mt-10 text-3xl font-semibold text-[#f3efe9] sm:text-4xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  What we collect
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/55 sm:text-base">
                  When you create an account or play with us, we collect the following information:
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {chips.map((chip, idx) => (
                    <div
                      key={chip}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          idx % 4 === 0 ? "bg-blue-400" : idx % 4 === 1 ? "bg-sky-400" : idx % 4 === 2 ? "bg-violet-400" : "bg-emerald-400"
                        }`}
                      />
                      <span>{chip}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-xs font-semibold tracking-[0.32em] text-violet-300/90">
                  GOOGLE SIGN-IN
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md sm:px-5">
                  <div className="flex items-start gap-4 text-slate-200/80">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#4285F4]">
                      <Globe className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 sm:text-base">
                      When you sign in with Google, we receive your name, email, and profile picture from Google. We do not
                      receive your Google password.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3 text-slate-100/90">
                      <CircleUserRound className="h-5 w-5 text-blue-300" />
                      <h3 className="text-lg font-semibold">Account data</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300/60">
                      We store the details required to identify you, connect friends, and keep your game progress available.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3 text-slate-100/90">
                      <ShieldAlert className="h-5 w-5 text-violet-300" />
                      <h3 className="text-lg font-semibold">Security signals</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300/60">
                      We use cookies, IP address, and device info for authentication, abuse prevention, and service reliability.
                    </p>
                  </div>
                </div>
              </section>

              <div className="h-14" />
            </>
          ) : (
            <>
              <div className="mt-14 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-slate-300/90 backdrop-blur-md">
                  <Scale className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-blue-400">LEGAL</span>
                  <span className="tracking-[0.2em] text-white/45">· TRIVIAAPP</span>
                </div>

                <h1
                  className="mt-8 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-[#e8e4df] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Terms of Use
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300/60 sm:text-base">
                  By using this application, you agree to the following terms and conditions.
                </p>
              </div>

            {/* content */}
              <section className="mt-12 mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="space-y-8 text-sm text-slate-300/70 leading-7">

                  <div>
                    <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
                    <p className="mt-2">
                      By accessing or using this app, you agree to be bound by these Terms of Use. If you do not agree,
                      you must not use the service.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">2. User Accounts</h2>
                    <p className="mt-2">
                      You are responsible for maintaining the confidentiality of your account and all activities under it.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">3. Acceptable Use</h2>
                    <p className="mt-2">
                      You agree not to misuse the platform, attempt unauthorized access, or disrupt the service.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">4. Content</h2>
                    <p className="mt-2">
                      You retain ownership of your content, but grant us a license to use it for operating the service.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">5. Termination</h2>
                    <p className="mt-2">
                      We may suspend or terminate access if these terms are violated.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">6. Disclaimer</h2>
                    <p className="mt-2">
                      The service is provided "as is" without warranties of any kind.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    //</div>
  );
}