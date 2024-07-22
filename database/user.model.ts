import pkg from 'mongoose';
import {Schema, model, Document} from "mongoose";
const {models} = pkg;
// Compilator want to import models this way not with simple import
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  sentMessages: Schema.Types.ObjectId[];
  receivedMessages: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sentMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  receivedMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) next();

    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}

const User = models.User || model<IUser>("User", UserSchema);

export default User;