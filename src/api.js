import express from "express";
import bcrypt from "bcrypt";
import { db } from "./db.js";
import { regenerateAsync, saveAsync } from "./session-promise.js";

export const apiRouter = express.Router();

const hashRounds = 10;

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

    const valid = await bcrypt.compare(req.body.senha.trim(), senha);

    if (!valid) {
        res.sendStatus(401);
        return;
    }

    await regenerateAsync(req.session);
    req.session.user = { nome: nome, id: id };
    await saveAsync(req.session);
    res.sendStatus(200);
});

apiRouter.post("/registrar", async (req, res) => {
    let { nome, senha } = req.body;

    nome = nome.trim();
    senha = senha.trim();

    const nomeMatch = /[\d\w]+/.test(nome);

    if (nome === "" || senha === "" || !nomeMatch) {
        res.status(400).json({ "error": "Formato inválido" });
        return;
    }

    console.log(nome);
    const [verDuplicado] = await db.execute(
        "SELECT 1 FROM usuario WHERE nome = ?",
        [nome]
    );

    console.log(verDuplicado);
    if (verDuplicado.length !== 0) {
        res.status(400).json({ "error": "Usuário já existe" });
        return;
    }

    const MAX_INT32 = (2**31) - 1;
    let id;
    while (true) {
        id = Math.floor(Math.random() * MAX_INT32);
        const [verID] = await db.execute(
            "SELECT 1 FROM usuario WHERE id = ?",
            [id]
        );
        if (verID.length === 0)
            break;
    }

    const hash = await bcrypt.hash(senha, hashRounds);

    await db.execute(
        "INSERT INTO agenda.usuario (id, nome, senha) VALUES (?, ?, ?)",
        [id, nome, hash]
    );

    await regenerateAsync(req.session);
    req.session.user = { nome: nome, id: id };
    await saveAsync(req.session);
    res.sendStatus(200);
});

// ====================================================================================================================
// Daqui em diante, todas as rotas de API requerem autenticação
// ====================================================================================================================

apiRouter.use((req, res, next) => {
    if (req.session.user)
        next();
    else
        res.sendStatus(401);
});

apiRouter.get('/logout', async (req, res) => {
    req.session.user = null;
    await saveAsync(req.session);
    await regenerateAsync(req.session);
    res.redirect('/');
});

apiRouter.get("/whoami", (req, res) => {
    const { id, nome } = req.session.user;
    res.json({ id, nome });
});

apiRouter.get("/user/:id", async (req, res) => {
    const [vals] = await db.execute(
        "SELECT nome FROM usuario WHERE id = ?",
        [req.params.id]
    );

    if (vals.length === 0) {
        res.sendStatus(404);
        return;
    }

    const { nome } = vals[0];

    res.json({ id: req.params.id, nome });
});
