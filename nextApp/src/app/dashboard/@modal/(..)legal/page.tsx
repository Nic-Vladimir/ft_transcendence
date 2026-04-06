import LegalPolicyClient from "@/app/legal/LegalPolicyClient";

export default function LegalModalPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const initialTab = searchParams?.tab === "terms" ? "terms" : "privacy";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="h-[100dvh] w-screen overflow-hidden border-0 bg-[#070b14] shadow-2xl">
        <div className="h-full w-full overflow-y-auto">
          <LegalPolicyClient initialTab={initialTab} />
        </div>
      </div>
    </div>
  );
}