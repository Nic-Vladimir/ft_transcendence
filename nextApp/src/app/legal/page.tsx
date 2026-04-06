import LegalPolicyClient from "./LegalPolicyClient";

export default function Page({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const initialTab = searchParams?.tab === "terms" ? "terms" : "privacy";

  return <LegalPolicyClient initialTab={initialTab} />;
}