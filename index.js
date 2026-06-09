import compression from "compression";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import 'dotenv/config';

import { mysqlBackedSession } from "./src/session-promise.js";
import { db } from "./src/db.js";
import morgan from "morgan";
import { apiRouter } from "./src/api.js";

const port = process.env.PORT || 3000;

const app = express();

app.set("trust proxy", 1)

app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mysqlBackedSession(db));

app.use("/api", apiRouter);

const distPath = path.join(import.meta.dirname, "client/dist");
const publicPath = path.join(import.meta.dirname, "client/public");

app.use(express.static(distPath));
app.use(express.static(publicPath));
app.get("/*splat", (_req, res) => {res.sendFile(path.join(distPath, "index.html"));});

const server = app.listen(port, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Aberto em http://localhost:" + port);
    }
});

process.on("SIGTERM", () => {
    server.close();
    db.end();
    process.exit();
});
