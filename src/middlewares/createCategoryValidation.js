import { connection } from "../database/db.js";

export async function createCategoryValidation(req, res, next){
    const { name } = req.body;

    if (!name) {
        res.sendStatus(400);
        return;
    }

    try {
        const categories = await connection.query("SELECT * FROM categories");
        const categoriesArr = categories.rows;
        for (let i = 0; i < categoriesArr.length; i++) {
            if (categoriesArr[i].name === name) {
                res.sendStatus(409);
                return;
            }
        }

    } catch (error) {
        console.log(error);
    }

    req.name = name;

    next();
}