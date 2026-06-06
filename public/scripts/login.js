const loginForm = document.querySelector("#login-form");
const registrarForm = document.querySelector("#registrar-form");
const avisoErro = document.querySelector("#aviso-erro");
const params = new URLSearchParams(window.location.search);

function alterarLayout() {
    avisoErro.classList.add("display-none");
    if (window.location.hash === "#registrar") {
        loginForm.classList.add("display-none");
        registrarForm.classList.remove("display-none");
        document.title="Criar conta";
    } else {
        loginForm.classList.remove("display-none");
        registrarForm.classList.add("display-none");
        document.title="Fazer login";
    }
}

alterarLayout();

const err = params.get("err");
if (err) {
    avisoErro.textContent = err;
    avisoErro.classList.remove("display-none");
}

window.addEventListener("hashchange", alterarLayout);

registrarForm.addEventListener("submit", (e) => {
    if (registrarForm["senha"].value !== registrarForm["senha-repete"].value) {
        e.preventDefault();
    }
})

registrarForm["senha-repete"].addEventListener("input", (e) => {
    registrarForm["senha-repete"].setCustomValidity("");

    if (registrarForm["senha-repete"].value !== registrarForm["senha"].value) {
        registrarForm["senha-repete"].setCustomValidity("Senha não confere");
    }

    registrarForm["senha-repete"].reportValidity();
});

whoAmI().then((u) => {
    if (u !== null)
        window.location.pathname = '/';
});