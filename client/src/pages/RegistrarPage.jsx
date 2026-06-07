import { useState } from 'react';
import '../styles/login.css';
import { Link } from 'react-router-dom';

export function RegistrarPage() {
    const [erro, setErro] = useState(null);
    return (
        <div className='login-container'>
            <main className='login'>
                {erro && <div className="aviso-erro">{erro}</div>}
                <form action="/api/registrar" method="POST">
                    <h2>Criar conta</h2>
                    <label>
                        Nome do usuário:
                        <input maxLength="40" type="text" name="nome" pattern="[\w\d]+" required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="senha" required />
                    </label>
                    <label>
                        Confirmar senha:
                        <input type="password" required />
                    </label>
                    <button type="submit" className="destaque">
                        Criar conta
                    </button>
                    <small>Já tem uma conta? <Link to="/login">Fazer login</Link></small>
                </form>
            </main>
        </div>
    );
}