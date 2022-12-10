import { Router } from "express";
import { createCustomer, listCustomerById, listCustomers, updateCustomer } from "../controllers/customersControllers.js";
import { updateCustomerValidation } from "../middlewares/uptadeCustomerValidation.js";

const router = Router();

router.get("/customers", listCustomers);

router.get("/customers/:id", listCustomerById);

router.post("/customers", createCustomer);

router.put("/customers/:id", updateCustomerValidation, updateCustomer);

export default router;