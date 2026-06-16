export function diasParaBits(diasArray) {
    return diasArray.reduce((acc, ativo, i) => acc + (ativo ? (1 << i) : 0), 0);
};

export function diasLabels() {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
} 