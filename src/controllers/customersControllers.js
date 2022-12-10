import { connection } from "../database/db.js";
import { createCustomerSchema } from "../models/schemaCreateCustomer.js";

export async function listCustomers(req, res) {
    const { cpf } = req.query;

    if (cpf) {
        const customersFiltred = await connection.query(`SELECT * FROM customers`);
        const customersRows = customersFiltred.rows;
        const customerRowsFiltred = customersRows.filter((customer) =>
            customer.cpf.toLowerCase().indexOf(cpf.toLowerCase()) >= 0
        );

        return res.send(customerRowsFiltred);
    }
    const customers = await connection.query("SELECT * FROM customers");
    res.send(customers.rows);
}

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const { error } = createCustomerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const customer = await connection.query(`INSERT INTO customers
    (name, phone, cpf, birthday) 
    VALUES ($1, $2, $3, $4)`,
        [name, phone, cpf, birthday]);
    res.send(201);
}

export async function listCustomerById(req, res) {
    const { id } = req.params;

    const customerId = await connection.query("SELECT * FROM customers WHERE id = $1", [id]);
    if (!customerId.rows[0]) {
        res.sendStatus(404);
        return;
    }
    res.send(customerId.rows[0]);
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.info;

    const upCustomer = await connection.query(`UPDATE customers
     SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
        [name, phone, cpf, birthday, id]);
    res.send(200);
}