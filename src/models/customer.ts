import mongoose, {Schema } from 'mongoose';
import { ICustomer } from '../interfaces/ICustomer';


const customerSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
