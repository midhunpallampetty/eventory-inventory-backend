import mongoose, { Schema } from "mongoose";
import { UserDocument } from "../interfaces/UserDocument";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:{type:String,required:true,unique:true}
});


export const userModel = mongoose.model<UserDocument>("User", UserSchema);
