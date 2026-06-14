import {} from "react-router-dom";
import { isAuth, useAuth } from "../auth-context";
import Agenda from "../components/Agenda";

export default function HomePage() {
    const [auth] = useAuth();

    if (!isAuth(auth)) return null;

    return (
        <>
            <h2>Eventos que você criou</h2>
            <Agenda />
        </>
    );
}
