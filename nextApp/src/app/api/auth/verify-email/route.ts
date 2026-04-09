import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/emailVerification";

const APP_URL = process.env.APP_URL?.trim() || "https://localhost:8443";

function loginRedirect(status: string) {
  const url = new URL("/login", APP_URL);
  url.searchParams.set("verification", status);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return loginRedirect("invalid");
    }

    await verifyEmailToken(token);
    return loginRedirect("success");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error(err);

    if (message.includes("already been used")) {
      return loginRedirect("used");
    }

    if (message.includes("expired")) {
      return loginRedirect("expired");
    }

    if (message.includes("token")) {
      return loginRedirect("invalid");
    }

    return loginRedirect("error");
  }
}
