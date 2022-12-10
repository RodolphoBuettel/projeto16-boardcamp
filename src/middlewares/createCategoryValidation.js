import { connection } from "../database/db.js";

export async function createCategoryValidation(req, res, next){
    const { name } = req.body;

    if (!name) {
        res.sendStatus(400);
        return;
    }

    const categoryExist = await connection.query("SELECT * FROM categories WHERE name = $1", [name]);
    if(categoryExist.rows[0]){
        return res.sendStatus(409);
    }

    req.name = name;

    next();
}