import ColumnaKanban from "./ColumnaKanban";

const PESO = {Alta:1, MEDIA:2, BAJA:3};

const porPrioridad = (a,b)=>
    (PESO[a.prioridad] ?? 4) -(PESO[b.prioridad] ?? 4) || (a.orden ?? 0)-(b.orden ?? 0);

const COLUMNAS = [
    {titulo: 'Pendiente', estado: 'PENDIENTE', color:'blue' },
    {titulo: 'En Proceso', estado: 'EN_PROCESO', color:'orange'},
    {titulo: 'Completada', estado: 'COMPLETA', color:'green'}
];


export default function Tablero({tareas, onVerTarea, onSoltarTarea}){

    return(
        <div className="tablero">
            {COLUMNAS.map(col =>(
                <ColumnaKanban
                key={col.estado}
                titulo={col.titulo}
                estado={col.estado}
                col={col.color}

                tareas={tareas.filter(t => t.estado === col.estado).sort(porPrioridad)}
                onVerTarea={onVerTarea}
                onSoltarTarea={onSoltarTarea}
                />
            ))}
        </div>
    )

}