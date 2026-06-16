import "../styles/criar-evento.css";
import { useEffect, useRef, useState } from 'react';
import { post } from '../fetch-helper';
import { useNavigate } from 'react-router-dom';
import { diasLabels, diasParaBits } from '../dias-helper';

export default function CriarEventoPage() {
    const [granularidade, setGranularidade] = useState('hora');
    const [erro, setErro] = useState(null);
    const formRef = useRef(null);
    const nav = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        if (!form.reportValidity()) {
            return;
        } else {
            if (form["hora_inicio"].valueAsDate > form["hora_fim"].valueAsDate) {
                form["hora_fim"].setCustomValidity("Hora fim não pode ser antes da hora de início.");
                form.reportValidity();
                return;
            } else {
                form["hora_fim"].setCustomValidity("");
                form.reportValidity();
            }
        }

        const formData = new FormData(form);

        const diasArray = diasLabels().map((_, i) => formData.get(`dia-${i}`) === 'on');
        if (diasArray.findIndex(i => i) === -1) {
            setErro("Pelo menos um dia deve ser selecionado.")
        }
        const bitfield = diasParaBits(diasArray);

        formData.append('dias_da_semana', bitfield);
        diasLabels().forEach((_, i) => formData.delete(`dia-${i}`));

        const res = await post("/api/events", formData);

        if (!res.ok) {
            setErro("Erro ao criar evento");
        } else {
            nav("/");
        }
    };

    useEffect(() => {
        if (!formRef.current)
            return;

        const form = formRef.current;
        for (let i = 0; i < 7; i++) {
            form[`dia-${i}`].checked = true;
        }

        form["data_inicio"].valueAsDate = new Date();
    }, [formRef.current])

    const roundHour = (e) => {
        const dateInput = e.target;
        const date = new Date(dateInput.valueAsDate);
        date.setMinutes(0);
        dateInput.valueAsDate = date;
    }

    return (
        <>
            {erro && <div className="aviso-erro">{erro}</div>}
            <h2>Criar novo evento</h2>
            <form onSubmit={onSubmit} className="criar-form" ref={formRef}>
                <label>
                    Nome do evento:
                    <input name="nome" maxLength="60" type="text" required />
                </label>

                <label>Dias da semana:</label>

                <div className="seletor-dias-container">
                    {diasLabels().map((label, i) => (
                        <label key={i}>
                            <input className="seletor-dias" type="checkbox" name={`dia-${i}`} />
                            {label}
                        </label>

                    ))}
                </div>

                <label>
                    Granularidade:
                    <select name="granularidade" onChange={(e) => setGranularidade(e.target.value)}>
                        <option value="hora">Hora</option>
                        <option value="dia">Dia</option>
                    </select>
                </label>

                <label>
                    Data de início:
                    <input name="data_inicio" type="date" required />
                </label>

                {granularidade === 'hora' && (
                    <>
                        <label>
                            Início:
                            <input name="hora_inicio" type="time" step="3600" required onInput={roundHour} />
                        </label>
                        <label>
                            Fim:
                            <input name="hora_fim" type="time" step="3600" required onInput={roundHour} />
                        </label>
                    </>
                )}

                <button type="submit" className="destaque">Criar evento</button>
            </form>
        </>
    );
}