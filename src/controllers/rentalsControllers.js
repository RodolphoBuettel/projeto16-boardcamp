import { connection } from "../database/db.js";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const customerExist = await connection.query("SELECT * FROM customers WHERE id = $1", [customerId]);
    if (!customerExist.rows[0]) {
        return res.sendStatus(400);
    }

    const gameExist = await connection.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (!gameExist.rows[0]) {
        return res.sendStatus(404);
    }

    if (daysRented < 0) {
        return res.sendStatus(400);
    }

    if(gameExist.rows[0].stockTotal === 0){
        return res.sendStatus(400);
    }

    const pricePerDay = gameExist.rows[0].pricePerDay;

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toLocaleDateString();


    const rentPrice = daysRented * pricePerDay;

    const returnDate = null;
    const delayFee = null;

    const gameStocked = await connection.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2`,
     [(gameExist.rows[0].stockTotal -1), gameId]);

    const createRental = await connection.query(`INSERT INTO rentals
     ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customerId, gameId, today, daysRented, returnDate, rentPrice, delayFee]);
    res.send(createRental.rows);
}

export async function listRentals(req, res) {
    const { gameId, customerId } = req.query;

    if (gameId) {
        const findRentedGames = await connection.query(`SELECT rentals.*,
        JSON_BUILD_OBJECT('id',games.id,'name',games.name) AS game FROM rentals 
        JOIN games ON rentals."gameId" = games.id
        WHERE games.id = $1`, [gameId]);
        res.send(findRentedGames.rows)
        return;
    }

    if (customerId) {
        const findCustomer = await connection.query(`SELECT rentals.*,
        JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id
        WHERE customers.id = $1`, [customerId]);
        res.send(findCustomer.rows)
        return;
    }

    const rentals = await connection.query(`SELECT rentals.*,
    JSON_BUILD_OBJECT
        ('id', customers.id, 'name', customers.name)
    AS customer, 
    JSON_BUILD_OBJECT
        ('id',games.id,'name',games.name,'categoryId',games."categoryId",'categoryName',categories.name)
    AS game
    FROM rentals 
    JOIN games
    ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id 
    JOIN customers
    ON rentals."customerId" = customers.id;`);

    res.send(rentals.rows);
}

export async function deleteRentals(req, res) {
    const { id } = req.params;

    const idExist = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);
    if (!idExist.rows[0]) {
        return res.sendStatus(400);
    }

    if (idExist.rows[0].returnDate === null) {
        return res.sendStatus(400);
    }

    const deleteRental = await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
    res.send(200);
}

export async function finalizeRent(req, res) {
    const { id } = req.params;

    const rentExist = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);
    if (!rentExist.rows[0]) {
        return res.sendStatus(404);
    }

    if (rentExist.rows[0].returnDate !== null) {
        return res.sendStatus(400);
    }

    const gameExist = await connection.query(`SELECT * FROM games WHERE id = $1`, [rentExist.rows[0].gameId]);
    const stockGame = gameExist.rows[0].stockTotal;
    const pricePerDay =  gameExist.rows[0].pricePerDay;

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const diffInMs = new Date(today) - new Date(rentExist.rows[0].rentDate); 
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    let delayFee = 0;

    if (diffInDays > rentExist.rows[0].daysRented) {
        const lateDays = diffInDays - (rentExist.rows[0].daysRented);
        delayFee = pricePerDay * lateDays;
    }

    const returnGame = await connection.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2`,[(stockGame + 1), rentExist.rows[0].gameId] )
    const returnDate = await connection.query(`UPDATE rentals SET "returnDate" = $1  WHERE id = $2`, [today, id]);
    const fees = await connection.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2`, [delayFee, id]);
    res.send(200);
}