import { connection } from "../database/db.js";
import { creatGameSchema } from "../models/schemaCreatGame.js";

export async function listGames(req, res) {
    const {name} = req.query;

    if(name){
        const gamesFiltred = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games 
        JOIN categories ON games."categoryId"=categories.id`);
        const gamesRows = gamesFiltred.rows;
        const gamesRowsFiltred = gamesRows.filter((game) =>
            game.name.toLowerCase().indexOf(name.toLocaleLowerCase()) >=0
        );

        return res.send(gamesRowsFiltred);
    }

    const games = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games 
    JOIN categories ON games."categoryId"=categories.id`);
    res.send(games.rows);
}

export async function creatGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const { error } = creatGameSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const nameExist = await connection.query("SELECT * FROM games WHERE name = $1", [name]);
    if(nameExist.rows[0]){
        return res.sendStatus(409);
    }

    try {
        const categories = await connection.query("SELECT * FROM categories");
        const categoriesArr = categories.rows;

        for (let i = 0; i < categoriesArr.length; i++) {

            if (categoriesArr[i].id === categoryId) {
                const game = await connection.query(`
                INSERT INTO games 
                    (name, image, "stockTotal", "categoryId", "pricePerDay") 
                 VALUES
                    ($1, $2, $3, $4, $5)`,
                    [name, image, stockTotal, categoryId, pricePerDay]);

                res.sendStatus(201);
                return;
            }
        }
        return res.sendStatus(400);

    } catch (error) {
        console.log(error);
    }
}