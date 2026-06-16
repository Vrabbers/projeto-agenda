import express from "express";
import bcrypt from "bcrypt";
import { db } from "./db.js";
import { regenerateAsync, saveAsync } from "./session-promise.js";

export const api = express.Router();

const hashRounds = 10;

api.post('/login', async (req, res) => {
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

api.post("/registrar", async (req, res) => {
    let { nome, senha } = req.body;

    nome = nome.trim();
    senha = senha.trim();

    const nomeMatch = /[\d\w]+/.test(nome);

    if (nome === "" || senha === "" || !nomeMatch) {
        res.status(400).json({ "error": "Formato inválido" });
        return;
    }

    const [verDuplicado] = await db.execute(
        "SELECT 1 FROM usuario WHERE nome = ?",
        [nome]
    );

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
        "INSERT INTO usuario (id, nome, senha) VALUES (?, ?, ?)",
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

api.use((req, res, next) => {
    if (req.session.user)
        next();
    else
        res.sendStatus(401);
});

api.get('/logout', async (req, res) => {
    req.session.user = null;
    await saveAsync(req.session);
    await regenerateAsync(req.session);
    res.redirect('/');
});

api.get("/whoami", (req, res) => {
    const { id, nome } = req.session.user;
    res.json({ id, nome });
});

api.get("/user/:id", async (req, res) => {
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

api.get("/events/meus-eventos", async (req, res) => {
    const [valsMeusEventos] = await db.execute(
        "SELECT id, nome FROM evento WHERE usuario_id = ? ORDER BY data_criado;",
        [req.session.user.id]
    );
    res.json(valsMeusEventos);
});

api.get("/events/eventos-que-participo", async (req, res) => {
    const [valsEventosParticipantes] = await db.execute(`
        SELECT DISTINCT e.id AS id, e.nome AS nome, e.usuario_id AS usuario_criou
        FROM evento e
        INNER JOIN participante p ON e.id = p.evento
        WHERE p.usuario = ?
        ORDER BY e.data_criado;`,
        [req.session.user.id]
    );
    res.json(valsEventosParticipantes);
});