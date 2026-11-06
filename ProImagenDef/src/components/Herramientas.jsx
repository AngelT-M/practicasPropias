const FILTROS = ['Original', 'Gris','Sepia','ByN','Desenfoque'];

export default function Herramientas({
    imagenOriginal,
    filtroActivo,

    brillo,
    contraste,
    saturacion,
    onBrillo,
    onContraste,
    onSaturacion,

    ImagenProsedada,

    onRotarIzquierda,
    onRotarDerecha,
    onRotar180,
    onRotarRestablecer,

    onVoltearHorizontal,
    onVoltearVertical,

    onFiltroActivo,
    onReestablecer,

    onDesckImgaen,

    onlisProceso,
    onguardar

}){

    return(
        <section className="seccion">
            <div>
               <h1>Herramientas</h1>
            </div>
            <div>
                {FILTROS.map(filtro=>(
                    <button
                    disabled={!imagenOriginal}
                    key={filtro}
                    onClick={()=>onFiltroActivo(filtro)}
                    >{filtro}</button>
                ))}
                
            </div>
            <div>
                <label htmlFor="">Brillo {brillo}%</label>
                <input 
                type="range" 
                min='0'
                max='200'
                value={brillo}
                onChange={(e)=>onBrillo(Number(e.target.value))}
                />
                <label htmlFor="">Brillo {contraste}%</label>
                <input 
                disabled={!imagenOriginal}
                type="range" 
                min='0'
                max='200'
                value={contraste}
                onChange={(e)=>onContraste(Number(e.target.value))}
                />
            </div>
            <div>
                <button
                disabled={!imagenOriginal}
                onClick={onRotarIzquierda}
                >Izquierda</button>
                <button
                disabled={!imagenOriginal}
                onClick={onRotarDerecha}
                >Derecha</button>
                
            </div>
                <button
                disabled={!imagenOriginal}
                onClick={onReestablecer}
                >Reestablecer</button>

                <button
                disabled={!imagenOriginal}
                onClick={onDesckImgaen}
                >Descargar</button>
            
                <button
                disabled={!onlisProceso}
                onClick={onguardar}
                >Guardar img</button>
                
        </section>


    );


}
