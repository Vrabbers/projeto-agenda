import './styles/login.css';

export function Login() {
    return (
        <main>
            <div class="aviso-erro"></div>
            <form id="login-form" action="/api/login" method="POST">
                <h2>Fazer login</h2>
                <label>
                    Nome do usuário:
                    <input maxlength="40" name="nome" pattern="[\w\d]+" required />
                </label>
                <label>
                    Senha:
                    <input type="password" name="senha" required />
                </label>
                <button type="submit" class="destaque">
                    Fazer login
                </button>
                <small>Não tem uma conta? <a href="/registrar">Criar conta</a></small>
            </form>
        </main>
    );
}