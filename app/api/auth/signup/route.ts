import User from "@/database/user.model";
import { connectToDatabase } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  connectToDatabase();
  const { username, email, password } = await req.json();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const newUser = await User.create({ username, email, password });

  if (!newUser) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }

  // TODO: generate JWT token and send it back to the client

  return NextResponse.json(
    { _id: newUser._id, username: newUser.username, email: newUser.email },
    { status: 200 }
  );
};
