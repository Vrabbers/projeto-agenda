import {} from "react-router-dom";
import { isAuth, useAuth } from "../auth-context";
import AgendaDisponibilidade from "../components/AgendaDisponibilidade";
import ListasEventos from "../components/ListasEventos";

export default function HomePage() {
    return (
        <ListasEventos />
    );
}
