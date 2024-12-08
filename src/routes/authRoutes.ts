// routes.ts
import express from "express";
import { 
  register, 
  login, 
  refreshToken 
} from "../controllers/authController";
import { 
  createInventoryItem,
  deleteInventoryItem,
  getAllInventoryItems,
  searchInventoryItems,
  updateInventoryItem 
} from "../controllers/inventoryController";
import { getAllSales, createSale, deleteSale ,getItemsReport} from '../controllers/salesController';
import { 
  createCustomer, 
  deleteCustomer, 
  getAllCustomers, 
  updateCustomer ,
  searchCustomers,getCustomerLedger,sendLedgerController
} from "../controllers/customerController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Inventory Routes
router.post('/inventory', createInventoryItem);
router.get('/inventory', getAllInventoryItems);
router.get('/inventory/search', searchInventoryItems);
router.post("/send-ledger-email", sendLedgerController);
// Updated to use body for id
router.put('/inventory', updateInventoryItem);  // No need for :id
router.delete('/inventory', deleteInventoryItem);  // id should be passed in req.body
router.post("/customer/ledger", getCustomerLedger);

// Customer Routes
router.post('/customers', createCustomer);
router.get('/customers', getAllCustomers);
router.get('/customers/search', searchCustomers);
// Updated to use body for id
router.put('/customers', updateCustomer);  // id should be passed in req.body
router.delete('/customers', deleteCustomer);  // id should be passed in req.body
router.get('/sales', getAllSales);

// Create a new sale
router.post('/sales', createSale);

// Delete a sale using req.body
router.post('/sales/delete', deleteSale);
router.get("/report", getItemsReport);

export default router;
