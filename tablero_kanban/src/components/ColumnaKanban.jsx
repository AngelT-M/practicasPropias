

export default function ColumnaKanban({titulo, estado, color, tareas, onVerTarea, onSoltarTarea}){

    return(
        <div
        
        onDragOver={e=>e.preventDefault()}
        onDrop={e=> onSoltarTarea(Number(e.dataTransfer.getData('text/plain')),estado)}
        >
            <div style={{borderTop:`4px solid ${color}`}}>
                <h3>{titulo}</h3>
                <span>{tareas.length}</span>
            </div>
            
        </div>
    )
}