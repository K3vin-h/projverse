import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
