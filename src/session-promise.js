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