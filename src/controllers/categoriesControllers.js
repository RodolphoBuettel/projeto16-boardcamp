import { connection } from "../database/db.js";

export async function listCategories(req, res) {
    const categories = await connection.query("SELECT * FROM categories");
    res.send(categories.rows);
}

export async function createCategory(req, res) {
    const name = req.name;

    const category = await connection.query("INSERT INTO categories (name) VALUES ($1)",
        [name]);

    res.send(201);
}
