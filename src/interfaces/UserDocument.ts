import mongoose, {  Document } from "mongoose";

export interface UserDocument extends Document {
    username: string;
    password: string; 
  }