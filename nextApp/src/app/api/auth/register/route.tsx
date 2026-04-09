import { NextRequest, NextResponse } from "next/server";
import { createEmailVerificationToken } from "@/lib/emailVerification";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 }
      );
    }

    const [existingEmailUser, existingUsernameUser] = await prisma.$transaction([
      prisma.users.findUnique({
        where: { email },
        select: { id: true },
      }),
      prisma.users.findFirst({
        where: { username },
        select: { id: true },
      }),
    ]);

    if (existingEmailUser && existingUsernameUser) {
      return NextResponse.json(
        { error: "This email and username are already in use." },
        { status: 409 }
      );
    }

    if (existingEmailUser) {
      return NextResponse.json(
        { error: "This email is already linked to an existing account." },
        { status: 409 }
      );
    }

    if (existingUsernameUser) {
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role: "user",
      },
    });

    await createEmailVerificationToken(user.id, user.email);

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
