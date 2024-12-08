import  { Document } from 'mongoose';

export interface IInventoryItem extends Document {
    name: string;
    description: string;
    quantity: number;
    price: number;
  }