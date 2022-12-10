import { connection } from "../database/db.js";
import { createCustomerSchema } from "../models/schemaCreateCustomer.js";

export async function updateCustomerValidation(req, res, next){
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    const { error } = createCustomerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const customerId = await connection.query("SELECT * FROM customers WHERE id = $1", [id]);
    if (!customerId.rows[0]) {
        res.sendStatus(404);
        return;
    }

    const cpfExist = await connection.query("SELECT * FROM customers WHERE cpf = $1", [cpf]);
    if(cpfExist.rows[0]){
        return res.sendStatus(409);
    }

    req.info =  req.body;

    next();
}