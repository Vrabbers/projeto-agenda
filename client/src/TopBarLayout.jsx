import { Link, NavLink, Outlet } from "react-router-dom";
import { isAuth, isNotAuth, useAuth } from "./auth-context";

const notAuthPage = <>
    <p>Primeiro, vamos fazer login.</p>
    <Link to="/login" className="botao destaque">Fazer login</Link>
</>;

export default function TopBarLayout() {
    const [auth, reauth] = useAuth();
    
    const clickLogout = async () => {
        const res = await fetch("/api/logout");
        if (res.ok) {
            await reauth();
        }
    };
    
    return <>
        <header>
            <h1><Link to="/" className="main-a"><img src="/img/event_available.svg" width="28" /> Agenda Compartilhada</Link></h1>
            <div className="user-box">
                {
                    isAuth(auth) &&  (
                        <>
                            {(auth.nome)}
                            <br />
                            <Link to="/" onClick={clickLogout}>Sair</Link>
                        </>
                    )
                }
                {
                    isNotAuth(auth) && <Link to="/login" className="botao">Fazer login</Link>
                }
            </div>
            {
                isAuth(auth) && (
                    <nav className="auth">
                        <ul>
                            <li><NavLink to="/ver-eventos">Ver eventos</NavLink></li>
                            <li><NavLink to="/criar-evento">Criar evento</NavLink></li>
                        </ul>
                    </nav>
                )
            }
        </header>
        <main class="normal-main">
            {
                (isAuth(auth) && <Outlet />) || (isNotAuth(auth) && notAuthPage) 
            }
        </main>
    </>;
}