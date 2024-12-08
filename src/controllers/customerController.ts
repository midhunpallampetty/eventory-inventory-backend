import { Request, Response, RequestHandler } from 'express';
import Customer from '../models/customer';
import salesModel from '../models/salesModel';
import mongoose from 'mongoose';
import sendLedgerEmail from './sendLedgerEmail';
// Create a new customer

interface Customer{
  customerName:string;

}
export const createCustomer: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, mobile } = req.body;
    const newCustomer = new Customer({ name, address, mobile });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const searchCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    

    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Get all customers
export const getAllCustomers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a customer (using request body for id)
export const updateCustomer: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id, name, address, mobile } = req.body; // Extract data from request body

    // Ensure the ID is provided
    if (!_id) {
      res.status(400).json({ message: 'Customer ID is required' });
      return;
    }

    // Validate other fields (optional but recommended)
    if (!name || !address || !mobile) {
      res.status(400).json({ message: 'Name, address, and mobile are required' });
      return;
    }

    // Update the customer with the provided data
    const updatedCustomer = await Customer.findByIdAndUpdate(
      _id,
      { name, address, mobile },
      { new: true, runValidators: true } // Return the updated document and run schema validations
    );

    // If the customer is not found, return a 404 error
    if (!updatedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Return the updated customer
    res.status(200).json(updatedCustomer);
  } catch (error: any) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
};

// Delete a customer (using request body for id)
export const deleteCustomer: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.body;  // Get id from the body
      
      if (!id) {
        res.status(400).json({ message: 'Customer ID is required' }); // Send response without returning anything
        return;  // Stop execution here
      }
      
      const deletedCustomer = await Customer.findByIdAndDelete(id);
      if (!deletedCustomer) {
        res.status(404).json({ message: 'Customer not found' });
        return;  // Stop execution here
      }
  
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };



export const getCustomerLedger = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400).json({ message: "Invalid customer ID" });
    return;
  }

  try {
    // Fetch the customer using customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const customerName = customer.name; // Assuming the field is 'name' in your Customer model

    // Fetch transactions for the customer using customerName
    const transactions = await salesModel
      .find({ customerName }) // Match by customerName
      .populate("itemId", "name price") // Populate item details including price
      .sort({ date: -1 });
     
        // Calculate total balance
    const totalBalance = transactions.reduce((acc, transaction) => {
      const itemPrice =  0; // Safely access item price
      return acc + transaction.quantity * itemPrice;
    }, 0);

    res.status(200).json({
      customer,
      transactions,
      totalBalance,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching customer ledger", error: error.message });
  }
};
  
export const sendLedgerController = async (req: Request, res: Response): Promise<void> => {
  const { email, customerId, ledgerDetails } = req.body;
console.log(req.body);
const customer = await Customer.findOne({_id: customerId }); // Find one customer by customerId
if (!customer) {
 console.log("Customer not found.");
  
}
  if (!email || !customerId || !ledgerDetails) {
    res.status(400).json({ message: "Email, customer name, and ledger details are required." });
    return;
  }

  try {
    // Send the ledger email to the provided email address
    await sendLedgerEmail({
      customerEmail: email,
      customerName:customer?.name!,
      ledgerDetails,
    });

    res.status(200).json({ message: "Ledger email sent successfully!" });
  } catch (error:any) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};