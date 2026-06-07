import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return <main>
        <h1>Erro</h1>
        <big>
            {
                (error &&
                    ((error.status === 404 && "Página não encontrada.") || error.statusText || error.message))
                || "Ocorreu algum erro."
            }
        </big>
        <br />
        <Link to="/">Voltar ao início.</Link>
    </main>;
}