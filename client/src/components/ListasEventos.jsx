import { Link, useNavigate } from "react-router-dom";
import "../styles/lista-eventos.css";
import { useState, useEffect } from 'react';

export default function ListasEventos() {
    const nav = useNavigate();
    const [meusEventos, setMeusEventos] = useState([]);
    const [eventosQueParticipo, setEventosQueParticipo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const [resMeus, resParticipo] = await Promise.all([
                    fetch('/api/events/meus-eventos'),
                    fetch('/api/events/eventos-dos-quais-participo')
                ]);

                if (resMeus.ok && resParticipo.ok) {
                    const dadosMeus = await resMeus.json();
                    const dadosParticipo = await resParticipo.json();

                    setMeusEventos(dadosMeus);

                    for (const p of dadosParticipo) {
                        const ur = await fetch(`/api/user/${p.usuario_criou}`);
                        const un = (await ur.json()).nome;
                        p.usuarioNome = un;
                    }
                    setEventosQueParticipo(dadosParticipo);
                } else {
                    throw new Error("Erro ao buscar eventos");
                }
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
                throw error;
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <div className="flex-row"> <h2>Eventos que você criou</h2>  <Link className="botao destaque" to="/criar-evento">Criar Evento</Link> </div>
            <table className='lista-eventos'>
                <thead>
                    <tr>
                        <th>Evento</th>
                    </tr>
                </thead>
                <tbody>
                    {meusEventos.length === 0 ? (
                        <tr><td>Nenhum evento.</td></tr>
                    ) : (
                        meusEventos.map(evento => (
                            <tr onClick={() => { nav(`/evento/${evento.id}`) }} className="tr-evento" key={evento.id}>
                                <td>{evento.nome}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <h2>Eventos em que você está incluido</h2>
            <table className='lista-eventos'>
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th>Criado por</th>
                    </tr>
                </thead>
                <tbody>
                    {eventosQueParticipo.length === 0 ? (
                        <tr><td colSpan="2">Você não está incluído em nenhum evento.</td></tr>
                    ) : (
                        eventosQueParticipo.map(evento => (
                            <tr onClick={() => { nav(`/evento/${evento.id}`) }} className="tr-evento" key={evento.id}>
                                <td>{evento.nome}</td>
                                <td>{evento.usuarioNome}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}