const userBox = document.querySelector("#user-box");
(async () => {
    const user = await whoAmI();
    if (user) {
        userBox.childNodes.forEach(x => x.remove());
        userBox.innerHTML = `${user.nome}<br><a class="sair" href="/logout">Sair</a>`
    }

    if (user) {
        document.querySelector("#div-conteudo-auth").classList.remove("display-none");
    } else {
        document.querySelector("#div-conteudo-nao-auth").classList.remove("display-none");
        document.querySelector("nav").classList.add("display-none")
    }
})();