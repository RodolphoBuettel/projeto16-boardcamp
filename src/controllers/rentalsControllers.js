import { connection } from "../database/db.js";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const customerExist = await connection.query("SELECT * FROM customers WHERE id = $1", [customerId]);
    if (!customerExist.rows[0]) {
        return res.sendStatus(400);
    }

    const gameExist = await connection.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (!gameExist.rows[0]) {
        return res.sendStatus(400);
    }

    if(daysRented < 0){
        return res.sendStatus(400);
    }

    console.log(gameExist.rows[0])
    const pricePerDay = gameExist.rows[0].pricePerDay;

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toLocaleDateString();
    console.log(today);
    const rentPrice = daysRented * pricePerDay;

    const returnDate = null;
    const delayFee = null;

    const createRental = await connection.query(`INSERT INTO rentals
     ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [customerId, gameId, today, daysRented, returnDate, rentPrice, delayFee]);
    res.send(createRental.rows);
}

export async function listRentals(req, res){
    const rentals = await connection.query("SELECT * FROM rentals");
    res.send(rentals.rows);
}

export async function deleteRentals(req, res){
    const {id} = req.params;

    const idExist = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);
    if(!idExist.rows[0]){
        return res.sendStatus(400);
    }

    if(idExist.rows[0].returnDate === null){
        return res.sendStatus(400);
    }

    const deleteRental = await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
    res.send(200);
}

export async function finalizeRent(req, res){
    const {id} = req.params;

    const rentExist = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);
    if(!rentExist.rows[0]){
        return res.sendStatus(400);
    }

    if(rentExist.rows[0].returnDate !== null){
        return res.sendStatus(400);
    }

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toLocaleDateString();

    const finalizeRent = await connection.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2`, [today, id]);
    res.send(200);
}