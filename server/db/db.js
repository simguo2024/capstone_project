import { createConnection } from 'mysql2/promise.js'
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

const connection = await createConnection(dbConfig)

async function query(sql) {
    const results = await connection.query(sql)
    return results
}

export {
    connection, query
}