import express from "express";
import bcrypt from "bcrypt";
import { db } from "./db.js";
import { regenerateAsync, saveAsync } from "./session-promise.js";

const api = express.Router();

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

    const MAX_INT32 = (2 ** 31) - 1;
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

api.get("/events/eventos-dos-quais-participo", async (req, res) => {
    const [valsEventosParticipantes] = await db.execute(`
        SELECT id, nome, usuario_criou 
        FROM (
            SELECT DISTINCT e.id AS id, e.nome AS nome, e.usuario_id AS usuario_criou, e.data_criado
            FROM evento e
            INNER JOIN participante p ON e.id = p.evento
            WHERE p.usuario = ?
        ) AS subquery
        ORDER BY data_criado;`,
        [req.session.user.id]
    );
    res.json(valsEventosParticipantes);
});

api.post("/events", async (req, res) => {
    const { nome, dias_da_semana, data_inicio, hora_inicio, hora_fim } = req.body;
    const usuario_id = req.session.user.id;

    const query = await db.execute(`
        INSERT INTO evento (nome, usuario_id, dias_da_semana, data_inicio, hora_inicio, hora_fim)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [nome, usuario_id, parseInt(dias_da_semana), data_inicio, hora_inicio, hora_fim]
    );

    res.sendStatus(200);
});

api.get("/events/:id", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;
    const [rows] = await db.execute(`
        SELECT e.* FROM evento e
        WHERE e.id = ? 
        AND (e.usuario_id = ? OR EXISTS (SELECT 1 FROM participante p WHERE p.usuario = ? AND p.evento = e.id));`,
        [eventoId, usuarioId, usuarioId]
    );

    if (rows.length === 0) {
        res.sendStatus(404);
    }

    const [participantes] = await db.execute(`
        SELECT u.id, u.nome 
            FROM usuario u
            INNER JOIN participante p ON p.usuario = u.id
            WHERE p.evento = ?
        UNION
        SELECT u.id, u.nome 
            FROM usuario u
            INNER JOIN evento e ON e.usuario_id = u.id
            WHERE e.id = ?;`,
        [eventoId, eventoId]);

    const participantesObj = Object.fromEntries(participantes.map(x => [x.id, x.nome]));

    res.json({ participantes: participantesObj, ...rows[0] });
});

api.delete("/events/:id", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;

    const [result] = await db.execute(
        "DELETE FROM evento WHERE id = ? AND usuario_id = ?;",
        [eventoId, usuarioId]
    );
    if (result.affectedRows === 0) {
        return res.sendStatus(404);
    } else {
        return res.sendStatus(200);
    }
});

api.get("/events/:id/disponibilidade", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;

    const [perm] = await db.execute(`
        SELECT 1 FROM evento e
        WHERE e.id = ? 
        AND (e.usuario_id = ? OR EXISTS (SELECT 1 FROM participante p WHERE p.usuario = ? AND p.evento = e.id));
    `, [eventoId, usuarioId, usuarioId]);

    if (perm.length === 0) {
        return res.sendStatus(403);
    }

    const [rows] = await db.execute(`
        SELECT 
            usuario, DATE_FORMAT(data, '%Y-%m-%d') as data, hora
        FROM participante_horario_possivel 
        WHERE evento = ?;`,
        [eventoId]);

    res.json(rows);
});

api.post("/events/:id/participantes", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;
    const usuarioAdicionarId = req.body.usuario_id;
    const [evento] = await db.execute(
        "SELECT usuario_id FROM evento WHERE id = ?;",
        [eventoId]
    );

    if (evento.length === 0) {
        return res.sendStatus(404);
    }

    if (evento[0].usuario_id !== usuarioId) {
        return res.sendStatus(403);
    }

    await db.execute(`
            INSERT INTO participante (usuario, evento) 
            VALUES (?, ?)`,
        [usuarioAdicionarId, eventoId]);

    res.sendStatus(200);
});

api.get("/users/search/:nome", async (req, res) => {
    const { nome } = req.params;

    if (!nome || nome.trim() === "") {
        return res.sendStatus(400);
    }

    const [usuarios] = await db.execute(
        "SELECT id, nome FROM usuario WHERE nome = ?;",
        [nome.trim()]
    );

    if (usuarios.length === 0) {
        return res.sendStatus(404);
    }

    res.json(usuarios[0]);
});

api.post("/events/:id/disponibilidade", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;
    const { data, hora } = req.body;

    if (!data || hora === undefined) {
        return res.sendStatus(400);
    }

    const [perm] = await db.execute(`
        SELECT 1 FROM evento e
        WHERE e.id = ? 
        AND (e.usuario_id = ? OR EXISTS (SELECT 1 FROM participante p WHERE p.usuario = ? AND p.evento = e.id));
    `, [eventoId, usuarioId, usuarioId]);

    if (perm.length === 0) {
        return res.sendStatus(403);
    }

    await db.execute(`
        INSERT INTO participante_horario_possivel (usuario, evento, data, hora) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE usuario=usuario;
    `, [usuarioId, eventoId, data, hora]);

    res.sendStatus(200);
});

api.delete("/events/:id/disponibilidade", async (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = req.session.user.id;
    const { data, hora } = req.body;

    if (!data || hora === undefined) {
        return res.sendStatus(400);
    }

    const [result] = await db.execute(`
        DELETE FROM participante_horario_possivel 
        WHERE usuario = ? AND evento = ? AND data = ? AND hora = ?;
    `, [usuarioId, eventoId, data, hora]);

    if (result.affectedRows === 0) 
        return res.sendStatus(404);

    res.sendStatus(200);
});

export const apiRouter = api;