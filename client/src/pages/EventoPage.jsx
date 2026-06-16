import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth-context';

export default function EventoPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [auth] = useAuth();
    const [evento, setEvento] = useState(null);

    useEffect(() => {
        fetch(`/api/events/${id}`)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setEvento(data))
            .catch(() => nav('/'));
    }, [id, nav]);

    const handleExcluir = async () => {
        if (!window.confirm("Confirmar exclusão?"))
            return;

        const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
        if (res.ok) {
            nav('/');
        } else {
            alert("Erro ao excluir.");
        }
    };

    if (!evento)
        return <p>Carregando...</p>;

    return (
        <>
            <div className="flex-row">
                <h2>{evento.nome}</h2>
                {
                    auth.id === evento.usuario_id &&
                    <button onClick={handleExcluir} className="destaque deleta">
                        Excluir
                    </button>
                }
            </div>
            <h3>Disponibilidade geral</h3>
            <div>
                {JSON.stringify(evento)}
            </div>
            <div className="flex-row">
                <Link className="botao" to="/">Voltar</Link>
                <Link className="botao destaque" to="./registrar">Registrar disponibilidade</Link>
            </div>

        </>
    );
}