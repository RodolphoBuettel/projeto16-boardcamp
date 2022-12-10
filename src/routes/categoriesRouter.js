import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoriesControllers.js";
import { createCategoryValidation } from "../middlewares/createCategoryValidation.js";

const router = Router();

router.get("/categories", listCategories);

router.post("/categories", createCategoryValidation, createCategory);
export default router;