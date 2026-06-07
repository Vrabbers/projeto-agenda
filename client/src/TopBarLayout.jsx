import { Link, Outlet } from "react-router-dom";

export function TopBarLayout() {
    return <>
        <header>
            <h1><Link to="/"><img src="/img/event_available.svg" width="24" /> Agenda</Link></h1>
            <div id="user-box">
                <Link to="login" className="botao noauth">Fazer login</Link>
            </div>
            <nav className="auth">
                <ul>
                    <li><Link to="/ver-eventos">Ver eventos</Link></li>
                    <li><Link to="/criar-evento.html">Criar evento</Link></li>
                </ul>
            </nav>
        </header>   
        <main>
            <Outlet />
        </main>
    </>;
}