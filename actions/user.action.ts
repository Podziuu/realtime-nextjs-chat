"use server";

import Message from "@/database/message.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/utils/mongoose";
import { IMessage } from "@/types";
import mongoose from "mongoose";

export async function getMessages({ from, to }: any) {
  try {
    connectToDatabase();

    const fromId = new mongoose.Types.ObjectId(from);
    const toId = new mongoose.Types.ObjectId(to);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: fromId, to: toId },
            { from: toId, to: fromId },
          ],
        },
      },
      {
        $sort: { timestamp: 1 },
      },
    ]);

    return messages;

  } catch (error) {
    console.log(error);
    throw error;
  }
}
