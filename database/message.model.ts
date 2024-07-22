import {Schema, model, Document} from "mongoose";
import pkg from 'mongoose';
const { models} = pkg;
// Compilator want to import models this way not with simple import

export interface IMessage extends Document {
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;
