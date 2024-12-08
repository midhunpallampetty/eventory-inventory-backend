import { Request, Response, RequestHandler } from 'express';
import InventoryItem from '../models/inventoryItem';
import mongoose from 'mongoose';

// Create a new inventory item
export const createInventoryItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, quantity, price } = req.body;

    if (!name || !description || quantity === undefined || price === undefined) {
      res.status(400).json({ message: 'All fields (name, description, quantity, price) are required' });
      return;
    }

    const newItem = new InventoryItem({ name, description, quantity, price });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inventory items
export const getAllInventoryItems: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Search inventory items by name or description
export const searchInventoryItems: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const items = await InventoryItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update an inventory item
export const updateInventoryItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id, name, description, quantity, price } = req.body;

    if (!_id || !mongoose.isValidObjectId(_id)) {
      res.status(400).json({ message: 'Invalid or missing Item ID' });
      return;
    }

    const updatedItem = await InventoryItem.findByIdAndUpdate(
      _id,
      { name, description, quantity, price },
      { new: true, runValidators: true } // Return updated document and run validations
    );

    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an inventory item
export const deleteInventoryItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid or missing Item ID' });
      return;
    }

    const deletedItem = await InventoryItem.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
