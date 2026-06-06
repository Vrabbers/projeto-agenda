import './styles/login.css';

export function Registrar() {
    return (
        <main>
            <div class="aviso-erro"></div>
            <form action="/api/registrar" method="POST">
                <h2>Criar conta</h2>
                <label>
                    Nome do usuário:
                    <input maxlength="40" type="text" name="nome" pattern="[\w\d]+" required />
                </label>
                <label>
                    Senha:
                    <input type="password" name="senha" required />
                </label>
                <label>
                    Confirmar senha:
                    <input type="password" required />
                </label>
                <button type="submit" class="destaque">
                    Criar conta
                </button>
                <small>Já tem uma conta? <a href="/login">Fazer login</a></small>
            </form>
        </main>
    );
}