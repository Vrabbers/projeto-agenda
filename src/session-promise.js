import MySQLStore from "express-mysql-session";
import session from "express-session";

export function saveAsync(session) {
    return new Promise((resolve, reject) => {
        session.save((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function regenerateAsync(session) {
    return new Promise((resolve, reject) => {
        session.regenerate((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

export function mysqlBackedSession(db) {
    const sessionStore = new (MySQLStore(session))({
        expiration: 3600000,
        clearExpired: true,
    }, db);

    return session({
        secret: process.env.APP_SESSION_SECRET,
        name: process.env.APP_SESSION_NAME,
        resave: false,
        store: sessionStore,
        saveUninitialized: false,
        cookie: { maxAge: 3600000, secure: "auto", sameSite: true }
    });
}
