import { Link } from "react-router-dom";
import { isAuth, isNotAuth, useAuth } from "../auth-context";


const notAuthPage = <>
    <p>Primeiro, vamos fazer login.</p>
    <Link to="/login" className="botao destaque">Fazer login</Link>
</>;

export function HomePage() {
    const auth = useAuth();

    if (isAuth(auth)) {
        return <></>;
    } else if (isNotAuth(auth)) {
        return notAuthPage;
    }
}
