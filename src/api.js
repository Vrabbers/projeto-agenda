import express from "express";

const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.user)
        next()
    else
        res.sendStatus(401);
}

router.post('/login', async (req, res) => {
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

router.post("/registrar", async (req, res) => {
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

router.get('/logout', isAuthenticated, async (req, res) => {
    req.session.user = null;
    await saveAsync(req.session);
    await regenerateAsync(req.session);
    res.redirect('/');
});


router.get("/whoami", isAuthenticated, (req, res) => {
    res.send(
        JSON.stringify(
            {
                id: req.session.user.id,
                nome: req.session.user.nome
            })
    );
});