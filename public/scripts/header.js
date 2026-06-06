import { whoAmI } from "./modules/auth.js";

const userBox = document.querySelector("#user-box");
(async () => {
    const user = await whoAmI();
    if (user) {
        userBox.childNodes.forEach(x => x.remove());
        const a = document.createElement("a");
        a.href="/logout";
        a.className = "sair";
        a.textContent = "Sair";
        userBox.append(
            document.createTextNode(user.nome),
            document.createElement("br"),
            a
        );
    }

    if (user) {
        document.querySelectorAll(".auth").forEach(x => x.classList.remove("display-none"));
        document.querySelectorAll(".noauth").forEach(x => x.classList.add("display-none"));
    } else {
        document.querySelectorAll(".noauth").forEach(x => x.classList.remove("display-none"));
        document.querySelectorAll(".auth").forEach(x => x.classList.add("display-none"));
    }
})();