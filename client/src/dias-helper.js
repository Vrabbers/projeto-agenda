export function diasParaBits(diasArray) {
    return diasArray.reduce((acc, ativo, i) => acc | (ativo ? (1 << i) : 0), 0);
};

export function bitsParaDias(bitfield) {
    let a = [];
    for (let i = 0; i < 7; i++) {
        a[i] = (bitfield & (1 << i)) !== 0;
    }
    return a;
}

export function geraDias(totalDias, diaInicio, diasDaSemana) {
    let semanas = [];
    let sem = [];

    const primeiroDiaDaSemana = diaInicio.getDay();
    if (primeiroDiaDaSemana !== 0) {
        totalDias += 7 - primeiroDiaDaSemana;
    }

    for (let i = 0; i < totalDias; i++) {
        const data = new Date(diaInicio);
        data.setDate(data.getDate() + i);
        if (data.getDay() === 0 && i !== 0) {
            if (sem.length > 0)
                semanas.push(sem);
            sem = [];
        }

        if (diasDaSemana[data.getDay()]) {
            sem.push(data);
        }

        if (i === totalDias - 1 && sem.length > 0) {
            semanas.push(sem);
        }
    }
    return semanas;
}

export function diasLabels() {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
} 