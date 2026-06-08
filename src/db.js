import mysql2 from "mysql2/promise";

export function createDbPool() {
    return mysql2.createPool(process.DB_URL || {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
}
