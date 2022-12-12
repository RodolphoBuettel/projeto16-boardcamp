import { Router } from "express";
import { createRental, deleteRentals, finalizeRent, listRentals } from "../controllers/rentalsControllers.js";

const router = Router();

router.post("/rentals", createRental);

router.get("/rentals", listRentals);

router.delete("/rentals/:id", deleteRentals);

router.post("/rentals/:id/return", finalizeRent);

export default router;