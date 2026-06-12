import "./styles/top-bar.css";
import { Link, Outlet } from "react-router-dom";
import { isAuth, isNotAuth, useAuth } from "./auth-context";

const notAuthPage = <>
    <p>Primeiro, vamos fazer login.</p>
    <Link to="/login" className="botao destaque">Fazer login</Link>
</>;

export default function TopBarLayout() {
    const [auth, reauth] = useAuth();
    
    const clickLogout = async () => {
        await fetch("/api/logout");
        await reauth();
    };
    
    return <>
        <header>
            <h1><Link to="/" className="main-a"><img src="/img/event_available.svg" width="28" /> <span className="main-a-texto">Agenda Compartilhada</span></Link></h1>
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
        </header>
        <main className="normal-main">
            {
                (isAuth(auth) && <Outlet />) || (isNotAuth(auth) && notAuthPage) 
            }
        </main>
    </>;
}