import LegalPolicyClient from "@/app/legal/LegalPolicyClient";

export default function LegalModalPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const initialTab = searchParams?.tab === "terms" ? "terms" : "privacy";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75"
      style={{ zIndex: 50, backdropFilter: "blur(12px)" }}
    >
      <div className="w-100 h-100 overflow-hidden bg-dark shadow-lg">
        <div className="h-100 overflow-auto">
          <LegalPolicyClient initialTab={initialTab} />
        </div>
      </div>
    </div>
  );
}