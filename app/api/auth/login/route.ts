import User from "@/database/user.model";
import { connectToDatabase } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  connectToDatabase();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    // TODO: Generate JWT token and send it back to the client
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
