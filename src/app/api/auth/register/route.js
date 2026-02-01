import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/server/lib/mongodb";
import User from "@/server/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.toLowerCase()?.trim();
    const password = body?.password;
    const confirmPassword = body?.confirmPassword;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Email, password, and confirmation are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account already exists for this email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      provider: "credentials",
    });

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to create account." },
      { status: 500 }
    );
  }
}
