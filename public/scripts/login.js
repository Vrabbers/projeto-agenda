document.querySelectorAll("a.troca").forEach(
    a => a.addEventListener("click", () => {
        document.querySelectorAll(".trocado").forEach(e => e.classList.toggle("display-none"));
    }));