export default function Agenda() {
    const dias = [0, 1, 2, 3, 4, 5, 6];
    const horas = [19, 20, 21, 22];
    
    const els = []
    for (let i = 0; i < horas.length + 1; i++) {
        els.push([]);
        if (i !== 0)
            els[i][0] = <th key ={"hora" + horas[i-1]} scope="row">{horas[i - 1]}</th>;
    }
    
    els[0][0] = <th key="0,0"></th>

    for (let d = 0; d < dias.length; d++) {
        els[0][d+1] = <th scope="col" key={"dia" + dias[d]}>{dias[d]}</th>
        for (let h = 0; h < horas.length; h++) {
            els[h + 1][d + 1] = <td key={`${horas[h]},${dias[d]}`}>{`${horas[h]} ${dias[d]}`}</td>
        }
    }

    const rows = els.map((x, i) => <tr key={i}>{x}</tr>);

    return <table><tbody>{rows}</tbody></table>
}