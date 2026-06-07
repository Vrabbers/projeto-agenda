import { Link, NavLink, Outlet } from "react-router-dom";
import { isAuth, isNotAuth, useAuth } from "./auth-context";

export function TopBarLayout() {
    const auth = useAuth();

    return <>
        <header>
            <h1><Link to="/"><img src="/img/event_available.svg" width="24" /> Agenda</Link></h1>
            <div className="user-box">
                {
                    isAuth(auth) && 
                        <>
                            {(auth.nome)}
                            <br />
                            <a href="/api/logout">Sair</a>
                        </>
                }
                {
                    isNotAuth(auth) &&
                    <Link to="/login" className="botao">Fazer login</Link>
                }
            </div>
            <nav className="auth">
                <ul>
                    <li><NavLink to="/ver-eventos">Ver eventos</NavLink></li>
                    <li><NavLink to="/criar-evento">Criar evento</NavLink></li>
                </ul>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
    </>;
}