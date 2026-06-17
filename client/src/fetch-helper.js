export function post(url, body) {
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body instanceof FormData) {
        const optsBody = {};
        for (const [key, value] of body.entries()) {
            optsBody[key] = value;
        }
        opts.body = JSON.stringify(optsBody);
    } else {
        opts.body = JSON.stringify(body);
    };

    return fetch(url, opts);
}

export function del(url, body) {
    const opts = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    };

    opts.body = JSON.stringify(body);

    return fetch(url, opts);
}