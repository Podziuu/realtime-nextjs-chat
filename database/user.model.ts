// import { Schema, models, model, Document } from "mongoose";
import pkg from 'mongoose';
const { Schema, models, model, Document } = pkg;
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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