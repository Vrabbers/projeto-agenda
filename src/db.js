import 'dotenv/config';
import mysql2 from "mysql2/promise";

export const db = mysql2.createPool(process.DB_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

await db.query("SELECT 1");
console.log("query ok");
