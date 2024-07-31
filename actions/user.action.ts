"use server";

import Message from "@/database/message.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/utils/mongoose";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { getMessagesProps, getChatUsersProps, createChatProps, Chat } from "@/types";

export async function getMessages({ from, to }: getMessagesProps) {
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

export async function getChatUsers({ userId }: getChatUsersProps) {
  try {
    connectToDatabase();

    const userObjetId = new mongoose.Types.ObjectId(userId);

    const chats = await User.findById({ _id: userId })
      .populate({
        path: "chats",
        select: "username",
      })
      .select("chats")
      .exec();

    const chatUserIds = chats.chats.map((chat: Chat) => chat._id);

    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: userObjetId, to: { $in: chatUserIds } },
            { from: { $in: chatUserIds }, to: userObjetId },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$from", userObjetId] }, "$to", "$from"],
          },
          recentMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    const chatsWithRecentMessages = chats.chats.map((chat: Chat) => {
      const recentMessage = recentMessages.find(
        (msg) => msg._id.toString() === chat._id.toString()
      );
      return {
        chatUser: chat,
        recentMessage: recentMessage ? recentMessage.recentMessage : null,
      };
    });

    return chatsWithRecentMessages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createChat({ username, userId, path }: createChatProps) {
  try {
    connectToDatabase();

    const user = await User.findOne({ username });

    if(!user) {
      throw new Error("User not found");
    }

    if(userId === user._id.toString()) {
      throw new Error("You can't chat with yourself");
    }

    if (user.chats.includes(userId)) {
      throw new Error("Chat already exists");
    }

    user.chats.push(userId);

    await user.save();

    await User.findByIdAndUpdate(userId, {
      $push: { chats: user._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
