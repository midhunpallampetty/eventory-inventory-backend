import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  date: Date;
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  customerName: string // Optional: null for cash sales
}

const saleSchema: Schema = new Schema(
  {
    date: { type: Date, default: Date.now },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    quantity: { type: Number, required: true },
    customerName: { type:String, ref: 'Customer', default: null },
    saleType:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model<ISale>('Sale', saleSchema);
