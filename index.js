import compression from "compression";
import express from "express";
import MySQLStore from "express-mysql-session";
import session from "express-session";
import helmet from "helmet";
import mysql2 from "mysql2/promise";
import path from "node:path";
import bcrypt from "bcrypt";
import { pinoHttp } from "pino-http";

import { regenerateAsync, saveAsync } from "./src/session-promise.js";

try {
    process.loadEnvFile();
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }
}

const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", 1)

app.use(pinoHttp({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
}));
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = await mysql2.createPool(process.DB_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const sessionStore = new (MySQLStore(session))({
    expiration: 3600000,
    clearExpired: true,
}, db);

app.use(session({
    secret: process.env.APP_SESSION_SECRET,
    name: process.env.APP_SESSION_NAME,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: "auto", sameSite: true }
}))

function isAuthenticated(req, res, next) {
    if (req.session.user)
        next()
    else
        res.sendStatus(401);
}

app.post('/api/login', async (req, res, next) => {
    const [vals] = await db.execute(
        "SELECT id, nome, senha FROM usuario WHERE nome = ?",
        [req.body.nome.trim()]
    );

    if (vals.length === 0) {
        res.sendStatus(401);
        return;
    }

    const { id, nome, senha } = vals[0];
    const valid = await bcrypt.compare(req.body.senha, senha);

    if (!valid) {
        res.sendStatus(401);
        return;
    }

    await regenerateAsync(req.session);
    req.session.user = { nome: nome, id: id };
    await saveAsync(req.session);
    res.redirect('/');
});

app.get('/api/logout', async (req, res, next) => {
    req.session.user = null;
    await saveAsync(req.session);
    await regenerateAsync(req.session);
    res.redirect('/');
});

app.post("/api/registrar", async (req, res, next) => {
    const { nome, senha } = req.body;

    if (nome.trim() === "" || senha === "") {
        res.sendStatus(400);
        return;
    }

    const hash = await bcrypt.hash(senha, 10);

    const [vals] = await db.execute(
        "INSERT INTO agenda.usuario (nome, senha) VALUES (?, ?) RETURNING id",
        [nome, hash]
    );

    const { id } = vals[0];

    await regenerateAsync(req.session);

    req.session.user = { nome: nome, id: id };

    await saveAsync(req.session);

    res.redirect("/");
});

app.get("/api/whoami", isAuthenticated, (req, res, next) => {
    res.send(
        JSON.stringify(
            {
                id: req.session.user.id,
                nome: req.session.user.nome
            })
    );
});

const distPath = path.join(import.meta.dirname, "client/dist");
app.use(express.static(distPath));
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
})

const publicPath = path.join(import.meta.dirname, "client/public");
app.use(express.static(publicPath));

app.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err);
})

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
})