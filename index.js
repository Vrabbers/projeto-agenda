import compression from "compression";
import express from "express";
import helmet from "helmet";
import mysql2 from "mysql2/promise";
import path from "node:path";

try {
    process.loadEnvFile();
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }
}

const port = process.env.PORT || 3000;
const publicPath = path.join(import.meta.dirname, "public");

const app = express();

app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

const db = await mysql2.createConnection(process.DB_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

app.listen(port, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Aberto em http://localhost:" + port);
    }
});
