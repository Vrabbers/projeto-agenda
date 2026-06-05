const auth = false;

if (auth) {
    document.querySelector("#div-conteudo-auth").classList.remove("display-none");
    // preencher página autenticada
} else {
    document.querySelector("#div-conteudo-nao-auth").classList.remove("display-none");
    document.querySelector("nav").classList.add("display-none")
}