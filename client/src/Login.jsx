import { useState } from 'react';
import './styles/login.css';

export function Login() {
    const [erro, setErro] = useState("");
    return (
        <div className='login-container'>
            <main className="login">
                {erro === "" ? null : <div className="aviso-erro">{erro}</div>}
                <form id="login-form" action="/api/login" method="POST">
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
                    <small>Não tem uma conta? <a href="/registrar">Criar conta</a></small>
                </form>
            </main>
        </div>
    );
}