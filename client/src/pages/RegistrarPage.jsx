import { useState } from 'react';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../fetch-helper';
import { useAuth } from '../auth-context';
import { useRef } from 'react';

export default function RegistrarPage() {
    const [erro, setErro] = useState(null);
    const reauth = useAuth()[1];
    const nav = useNavigate();

    const onSubmit = async (e) => {
        const form = e.target;

        e.preventDefault();
        if (!form.reportValidity()) {
            return;
        }

        const res = await post("/api/registrar", new FormData(form));

        if (!res.ok) {
            form["senha"].value = "";
            form["repete-senha"].value = "";
            setErro(res.status === 400 ? (await res.json()).error : "Ocorreu algum erro");
            return;
        } else {
            nav("/");
            reauth();
        }
    };

    const senhaRef = useRef(null);
    const onSenhaRepeteChange = (e) => {
        const senhaRepete = e.target;
        if (senhaRepete.value !== senhaRef.current.value) {
            senhaRepete.setCustomValidity("Senhas não são iguais.");
        } else {
            senhaRepete.setCustomValidity("");
        }
    };

    return (
        <div className='login-container'>
            <main className='login'>
                {erro && <div className="aviso-erro">{erro}</div>}
                <form onSubmit={onSubmit}>
                    <h2>Criar conta</h2>
                    <label>
                        Nome do usuário:
                        <input maxLength="40" type="text" name="nome" pattern="[\w\d]+" required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="senha" ref={senhaRef} required />
                    </label>
                    <label>
                        Confirmar senha:
                        <input type="password" id="repete-senha" onInput={onSenhaRepeteChange} required />
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
