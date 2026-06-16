import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth-context';
import AgendaDisponibilidade from '../components/AgendaDisponibilidade';

export default function EventoPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [auth] = useAuth();
    const [evento, setEvento] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/events/${id}`);
            if (!res.ok) setEvento(() => { throw new Error("Erro ao carregar evento") });

            const data = await res.json();
            setEvento(data);
        })();
    }, [id, nav]);

    const handleExcluir = async () => {
        if (!window.confirm("Confirmar exclusão?"))
            return;

        const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
        if (res.ok) {
            nav('/');
        } else {
            setEvento(() => { throw new Error("Erro ao excluir.") });
        }
    };

    if (!evento)
        return <p>Carregando...</p>;

    return (
        <>

            <div className="flex-row">
                <h2>{evento.nome} </h2>
                {
                    auth.id === evento.usuario_id &&
                    <button onClick={handleExcluir} className="destaque deleta">
                        Excluir
                    </button>
                }
            </div>
            <div className="flex-row">
                <Link className="botao" to="/">Voltar</Link>
            </div>

            <h3>Disponibilidade geral</h3>
            <div>
                <AgendaDisponibilidade evento={evento} id={id} />
            </div>

        </>
    );
}