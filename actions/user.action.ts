"use server";

import Message from "@/database/message.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/utils/mongoose";
import { IMessage } from "@/types";
// { from: string; to: string }
export async function getMessages({ from, to }: any) {
  try {
    connectToDatabase();

    console.log(from);

    // const user = await User.findOne({_id: from});

    // console.log(user);

    const user = await User.findById(from)
      .populate({
        path: "sentMessages",
        match: { to },
        select: "message timestamp",
      })
      .populate({
        path: "receivedMessages",
        match: { from: to },
        select: "message timestamp",
      });

    if (!user) {
      throw new Error("User not found");
    }

    const sentMessages = user.sentMessages as IMessage[];
    const receivedMessages = user.receivedMessages as IMessage[];

    // Combine the results
    const allMessages = [...sentMessages, ...receivedMessages];

    // Optionally, sort by timestamp if needed
    // @ts-ignore
    // allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return allMessages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
