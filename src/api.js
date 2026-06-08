import express from "express";
import bcrypt from "bcrypt";
import { db } from "./db.js";
import { regenerateAsync, saveAsync } from "./session-promise.js";

export const apiRouter = express.Router();

const hashRounds = 10;

function isAuthenticated(req, res, next) {
    if (req.session.user)
        next()
    else
        res.sendStatus(401);
}

apiRouter.post('/login', async (req, res) => {
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

apiRouter.post("/registrar", async (req, res) => {
    let { nome, senha } = req.body;

    nome = nome.trim();
    senha = senha.trim();

    if (nome === "" || senha === "") {
        res.status(400).json({ "error": "Formato inválido" });
        return;
    }
    const [verDuplicado] = await db.execute(
        "SELECT 1 FROM usuario WHERE nome = ?",
        [req.body.nome.trim()]
    );
    if (verDuplicado.length === 0) {
        res.status(400).json({ "error": "Usuário já existe" });
        return;
    }

    const hash = await bcrypt.hash(senha, hashRounds);

    const [vals] = await db.execute(
        "INSERT INTO agenda.usuario (nome, senha) VALUES (?, ?) RETURNING id",
        [nome, hash]
    );

    const { id } = vals[0];

    await regenerateAsync(req.session);
    req.session.user = { nome: nome, id: id };
    await saveAsync(req.session);
    res.sendStatus(200);
});

apiRouter.get('/logout', isAuthenticated, async (req, res) => {
    req.session.user = null;
    await saveAsync(req.session);
    await regenerateAsync(req.session);
    res.redirect('/');
});


apiRouter.get("/whoami", isAuthenticated, (req, res) => {
    res.send(
        JSON.stringify(
            {
                id: req.session.user.id,
                nome: req.session.user.nome
            })
    );
});
