const loginForm = document.querySelector("#login-form");
const registrarForm = document.querySelector("#registrar-form");
const avisoErro = document.querySelector("#aviso-erro");
const params = new URLSearchParams(window.location.search);


function doHash() {
    avisoErro.classList.add("display-none");
    if (window.location.hash === "#registrar") {
        loginForm.classList.add("display-none");
        registrarForm.classList.remove("display-none")
    } else {
        loginForm.classList.remove("display-none");
        registrarForm.classList.add("display-none");
    }
}

doHash();

const err = params.get("err");
if (err) {
    avisoErro.textContent = err;
    avisoErro.classList.remove("display-none");
}

window.addEventListener("hashchange", doHash);