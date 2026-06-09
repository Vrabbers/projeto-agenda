import { useState } from 'react';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../fetch-helper';
import { useAuth } from '../auth-context';

export function LoginPage() {
    const [erro, setErro] = useState(null);
    const reauth = useAuth()[1];
    const nav = useNavigate();

    const onSubmit = async (e) => {
        const form = e.target;

        e.preventDefault();
        if (!form.reportValidity()) {
            return;
        }
        
        const res = await post("/api/login", new FormData(form));

        if (!res.ok) {
            form["senha"].value = "";
            setErro(res.status === 401 ? "Usuário ou senha não conferem" : "Ocorreu algum erro");
            return;
        } else {
            nav("/");
            reauth();
        }
    };

    return (
        <div className='login-container'>
            <main className="login">
                {erro && <div className="aviso-erro">{erro}</div>}
                <form onSubmit={onSubmit}>
                    <h2>Fazer login</h2>
                    <label>
                        Nome do usuário:
                        <input maxLength="40" name="nome" pattern="[\w\d]+" required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="senha" required />
                    </label>
                    <button type="submit" className="destaque">
                        Fazer login
                    </button>
                    <small>Não tem uma conta? <Link to="/registrar">Criar conta</Link></small>
                </form>
            </main>
        </div>
    );
}
