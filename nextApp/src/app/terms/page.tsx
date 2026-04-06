import React from "react";
import { Scale } from "lucide-react";
import Link from "next/link";

export default function LegalTermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#070b14] text-white overflow-hidden">
      <div className="relative isolate min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,110,245,0.28),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(88,80,236,0.22),transparent_24%),linear-gradient(180deg,#0a1020_0%,#070b14_45%,#060912_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_45%,rgba(129,140,248,0.20),transparent_16%),radial-gradient(circle_at_100%_60%,rgba(96,165,250,0.15),transparent_18%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(255,255,255,0.01)_100%)]" />

        <main className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-6">
          {/* tabs */}
          <div className="mt-2 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            <Link
    		  href="/privacy"
			  className="rounded-full px-5 py-2 text-sm font-medium text-white/45 transition hover:text-white/75"
            >
			  Privacy Policy
			</Link>
            <button className="rounded-full bg-white/12 px-5 py-2 text-sm font-medium text-white">
              Terms of Use
            </button>
          </div>

          {/* head */}
          <div className="mt-14 text-center">
			<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-slate-300/90 backdrop-blur-md">
			  <Scale className="h-3.5 w-3.5 text-amber-400" />
			  <span className="text-blue-400">LEGAL</span>
			  <span className="tracking-[0.2em] text-white/45">· TRIVIAAPP</span>
			</div>

            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-[#e8e4df] sm:text-6xl lg:text-7xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Terms of Use
            </h1>
            <p className="mt-4 text-slate-300/60 max-w-2xl mx-auto">
              By using this application, you agree to the following terms and conditions.
            </p>
          </div>

          {/* content */}
          <section className="mt-12 w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
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
        </main>
      </div>
    </div>
  );
}
