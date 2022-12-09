import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import categoriesRouter from "./routes/categoriesRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));