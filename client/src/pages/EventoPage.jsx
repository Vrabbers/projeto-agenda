import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth-context';
import AgendaDisponibilidade from '../components/AgendaDisponibilidade';
import { post } from '../fetch-helper';

export default function EventoPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [auth] = useAuth();
    const [evento, setEvento] = useState(null);
    const [semanas, setSemanas] = useState(4);

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

    const adicionarParticipante = async () => {
        const nomeBusca = prompt("Digite o nome do participante:");
        if (nomeBusca === null || nomeBusca.trim() === "")
            return;

        const resBusca = await fetch(`/api/users/search/${encodeURIComponent(nomeBusca.trim())}`);

        if (resBusca.status === 404) {
            alert(`Usuário "${nomeBusca}" não foi encontrado.`);
            return;
        } else if (!resBusca.ok) {
            alert("Ocorreu algum erro");
            return;
        }

        const usuarioEncontrado = await resBusca.json();

        const confirmar = confirm(`Adicionar "${usuarioEncontrado.nome}" ao evento?`);
        if (!confirmar)
            return;

        const resAdd = await post(`/api/events/${id}/participantes`, { usuario_id: usuarioEncontrado.id });

        if (resAdd.ok) {
            alert("Usuário adicionado");
            window.navigation.reload();
        } else {
            alert("Algo de errado aconteceu.");
        }
    }


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
            <div className='flex-row'>
                <div className='agenda-container'>
                    <div className='flex-row'>
                        <h3>Disponibilidade</h3>
                        <label class="seleciona-semanas">
                            Mostrar 
                            <input type='number'
                                value={semanas}
                                min={1}
                                onChange={(e) => setSemanas(e.target.value)} />
                            semanas
                        </label>
                    </div>
                    <AgendaDisponibilidade evento={evento} id={id} semanas={semanas} />
                </div>
                <div className="participantes">
                    Participantes:
                    <ul>{Object.entries(evento.participantes).map(([id, nome]) => <li>{nome}</li>)}</ul>
                    {auth.id === evento.usuario_id && <button className='destaque' onClick={adicionarParticipante}>Adicionar</button>}
                </div>
            </div>
        </>
    );
}