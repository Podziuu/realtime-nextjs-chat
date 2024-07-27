"use server"

import User from "@/database/user.model";
import generateToken from "@/utils/generateToken";
import { connectToDatabase } from "@/utils/mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  connectToDatabase();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    const token = generateToken({ userId: user._id, username: user.username });
    cookies().set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    return NextResponse.json(
      { _id: user._id, username: user.username, email: user.email },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
};
