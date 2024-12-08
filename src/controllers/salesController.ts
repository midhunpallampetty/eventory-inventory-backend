import { Request, Response } from 'express';
import Sale from '../models/salesModel';
import InventoryItem from '../models/inventoryItem';
import Customer from '../models/customer';
import mongoose from 'mongoose';

// Fetch all sales
export const getAllSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await Sale.find()
      .populate('itemId', 'name description price') // Include item details
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Transform data to include customerName in the response if present
    const formattedSales = sales.map((sale) => ({
      ...sale,
      customerName: sale.customerName || 'Anonymous', // Fallback if customerName is not provided
    }));

    res.status(200).json(formattedSales);
    console.log(formattedSales)
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching sales', error });
  }
};


// Add a new sale
export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, quantity, customerName,saleType } = req.body;
console.log(req.body,'dss')
    // Validate itemId
    if (!itemId || !mongoose.isValidObjectId(itemId)) {
      res.status(400).json({ message: 'Invalid or missing Item ID' });
      return;
    }

    // Check if item exists and has sufficient stock
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    if (item.quantity < quantity) {
      res.status(400).json({ message: 'Insufficient stock for the item' });
      return;
    }

    // Validate customerId if provided
    

    // Check if customer exists (if provided)
  

    // Deduct stock from inventory
    item.quantity -= quantity;
    await item.save();

    // Create and save sale
    const sale = new Sale({
      itemId,
      quantity,
      customerName: customerName || null, // Default to `null` for cash sales
      saleType
    });
    await sale.save();

    res.status(201).json(sale);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating sale', error });
  }
};

// Delete a sale
export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid or missing Sale ID' });
      return;
    }

    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
      res.status(404).json({ message: 'Sale not found' });
      return;
    }

    // Restore stock to inventory
    const item = await InventoryItem.findById(sale.itemId);
    if (item) {
      item.quantity += sale.quantity;
      await item.save();
    }

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};
export const getItemsReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find();

    const report = await Promise.all(
      items.map(async (item) => {
        const sales = await Sale.find({ itemId: item._id });

        const totalSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const revenue = sales.reduce((sum, sale) => sum + sale.quantity * item.price, 0);

        return {
          _id: item._id,
          name: item.name,
          description: item.description,
          totalSold,
          revenue,
        };
      })
    );

    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: "Error generating items report", error });
  }
};
