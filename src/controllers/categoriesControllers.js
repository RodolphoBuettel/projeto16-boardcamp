import { connection } from "../database/db.js";

export async function listCategories(req, res){
    const categories = await connection.query("SELECT * FROM categories");
    res.send(categories.rows);
}

export async function createCategory(req, res){
    const {name} = req.body;
    console.log(name);

    if(!name){
        res.sendStatus(400);
        return;
    }
   

    const categories = await connection.query("SELECT * FROM categories");
    const categoriesArr = categories.rows;
    console.log(categoriesArr);

    for(let i = 0; i < categoriesArr.length; i++){
        if(categoriesArr[i].name === name){
            res.sendStatus(409);
            return;
        }
    }

    const category  = await connection.query("INSERT INTO categories (name) VALUES ($1)",
    [name]);

    res.send(201);
}
