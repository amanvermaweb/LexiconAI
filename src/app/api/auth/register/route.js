import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/server/lib/mongodb";
import User from "@/server/models/User";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { readJsonBody, toErrorResponse } from "@/server/lib/request";
import { parseRegistrationInput } from "@/server/lib/validation";

export async function POST(request) {
  try {
    const body = await readJsonBody(request);
    const { email, password } = parseRegistrationInput(body);

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
    return toErrorResponse(
      {
        message: getAuthErrorMessage(error) || "Failed to create account.",
        status: error?.status,
      },
      "Failed to create account."
    );
  }
}
