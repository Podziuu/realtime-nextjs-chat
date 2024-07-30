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

export async function getChatUsers({ userId }: any) {
  try {
    connectToDatabase();

    const userObjetId = new mongoose.Types.ObjectId(userId);

    const chats = await User.findById({ _id: userId }).populate({
      path: "chats",
      select: "username",
    }).select("chats").exec();

    const chatUserIds = chats.chats.map((chat => chat._id));

    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: userObjetId, to: { $in: chatUserIds } },
            { from: { $in: chatUserIds }, to: userObjetId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$from", userObjetId] },
              "$to",
              "$from"
            ]
          },
          recentMessage: {$first: "$$ROOT"}
        }
      }
    ])

    const chatsWithRecentMessages = chats.chats.map((chat) => {
      console.log(chat, "CHAAAAATERTS");
      console.log(recentMessages, "RECENT MESSAGESSS")
      const recentMessage = recentMessages.find((msg) => msg._id.toString() === chat._id.toString())
      console.log(recentMessage, "OSTATNIA WEIADOMOSC")
      return {
        chatUser: chat,
        recentMessage: recentMessage ? recentMessage.recentMessage : null
      }
    })

    return chatsWithRecentMessages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
