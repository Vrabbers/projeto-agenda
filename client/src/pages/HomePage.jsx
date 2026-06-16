import {} from "react-router-dom";
import { isAuth, useAuth } from "../auth-context";
import Agenda from "../components/Agenda";
import ListasEventos from "../components/ListasEventos";

export default function HomePage() {
    const [auth] = useAuth();

    if (!isAuth(auth)) return null;

    return (
        <ListasEventos />
    );
}
