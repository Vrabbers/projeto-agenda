import "../styles/evento.css";
import { useParams } from "react-router-dom";
import { bitsParaDias, diasLabels, geraDias } from "../dias-helper";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth-context";
import { del, post } from "../fetch-helper";

const formataData = new Intl.DateTimeFormat('pt-BR', { day: "numeric", month: "short" });

function chaveDeData(data, hora) {
    const stringData = data.toISOString().split('T')[0];
    return `${stringData},${hora}`;
}

function chaveDB(dbData, dbHora) {
    const data = dbData.includes('T') ? dbDate.split('T')[0] : dbData;
    return `${data},${dbHora}`;
}

function TableBody({ dias, horas, totalDias, disponibilidades, participantes, adicionarDisponibilidade, removerDisponibilidade }) {
    const [auth] = useAuth();

    const els = []
    for (let i = 0; i < horas.length + 1; i++) {
        els.push([]);
        if (i !== 0)
            els[i][0] = <th key={"hora" + horas[i - 1]} scope="row">{`${horas[i - 1]}:00`.padStart(5, "0")}</th>;
    }

    els[0][0] = <th key="0,0"></th>

    const doff = 1 + totalDias - dias.length;
    for (let d = 0; d < dias.length; d++) {
        const stringData = dias[d].toISOString().split('T')[0];

        els[0][d + doff] = <th scope="col" key={"dia" + dias[d]}>{formataData.format(dias[d])}</th>
        for (let h = 0; h < horas.length; h++) {
            const k = chaveDeData(dias[d], horas[h]);
            const temDisponibilidade = disponibilidades.has(k);
            const corpo = temDisponibilidade ? disponibilidades.get(k).map(uid => participantes[uid]).join(", ") : ""
            const key = `${horas[h]},${dias[d]}`;
            if (temDisponibilidade) {
                const souEu = disponibilidades.get(k).findIndex(x => x === auth.id) !== -1;
                const callback = souEu ? removerDisponibilidade : adicionarDisponibilidade;
                els[h + 1][d + doff] = (
                    <td key={key}
                        className={souEu ? "eu interact" : "interact"}
                        onClick={() => { callback(dias[d], horas[h]) }}>
                        {corpo}
                    </td>
                );
            } else {
                els[h + 1][d + doff] = (
                    <td key={key} 
                        className="interact"
                        onClick={() => { adicionarDisponibilidade(dias[d], horas[h]) }} 
                        />);
            }
            els[h + 1].fill(<td />, 1, doff);
        }
        els[0].fill(<th scope="col" />, 1, doff);
    }

    const rows = els.map((x, i) => <tr key={i}>{x}</tr>);
    return <tbody>{rows}</tbody>
}

export default function AgendaDisponibilidade({ id, evento, semanas }) {
    const [loading, setLoading] = useState(true);

    const [disponibilidades, setDisponibilidades] = useState(new Map());

    const diasDaSemana = bitsParaDias(evento.dias_da_semana);
    const countDiasDaSemana = diasDaSemana.filter(x => x).length;

    const horas = [];
    const horaInicio = evento.hora_inicio;
    const horaFim = evento.hora_fim;
    let h = horaInicio;
    while (true) {
        horas.push(h);
        if (h === horaFim)
            break;
        h = (h + 1) % 24;
    }

    if (semanas < 1) {
        semanas = 1;
    }

    const dataInicio = new Date(evento.data_inicio);
    const semana = geraDias(semanas * 7, dataInicio, diasDaSemana);

    const getDisponibilidade = useCallback(async () => {
        const res = await fetch(`/api/events/${id}/disponibilidade`);
        if (res.ok) {
            const data = await res.json();
            const mapeado = new Map();

            for (const x of data) {
                const chave = chaveDB(x.data, x.hora);
                if (!mapeado.has(chave)) {
                    mapeado.set(chave, []);
                }
                mapeado.get(chave).push(x.usuario);
            }
            setDisponibilidades(mapeado);
            setLoading(false);
        } else {
            setDisponibilidades(() => { throw new Error("Erro ao carregar disponibilidades"); });
        }
    }, [id]);

    useEffect(() => {
        getDisponibilidade();
    }, [id]);

    const adicionarDisponibilidade = useCallback(async (data, hora) => {
        const stringData = data.toISOString().split('T')[0];
        const res = await post(`/api/events/${id}/disponibilidade`, { data: stringData, hora });
        if (!res.ok) {
            setDisponibilidades(() => { throw new Error("Erro ao adicionar disponibilidade.") });
        } else {
            await getDisponibilidade();
        }
    }, [id, setDisponibilidades, getDisponibilidade]);

    const removerDisponibilidade = useCallback(async (data, hora) => {
        const stringData = data.toISOString().split('T')[0];
        const res = await del(`/api/events/${id}/disponibilidade`, { data: stringData, hora })
        if (!res.ok) {
            setDisponibilidades(() => { throw new Error("Erro ao remover disponibilidade.") });
        } else {
            await getDisponibilidade();
        }
    }, [id, setDisponibilidades, getDisponibilidade]);


    if (loading)
        return <p>Carregando agenda...</p>;

    const thead = (
        <thead>
            <tr>
                <th></th>
                {diasDaSemana.map((x, i) => [x, i]).filter(([x, i]) => x).map(([_x, i]) => <th key={i}>{diasLabels()[i]}</th>)}
            </tr>
        </thead>
    );

    return (
        <table>
            {thead}
            {semana.map((x, i) => <TableBody
                key={i}
                dias={x} horas={horas}
                totalDias={countDiasDaSemana}
                disponibilidades={disponibilidades}
                participantes={evento.participantes}
                adicionarDisponibilidade={adicionarDisponibilidade}
                removerDisponibilidade={removerDisponibilidade} />)}
        </table>
    );
}