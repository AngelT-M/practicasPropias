
const FILTROS = ['Original', 'Gris', 'Sepia', 'Blanco y Negro', 'Desenfoque']


export default function HerraminetasEdicion({
    imagenCargada,
    filtroActivo,
    brillo,
    contraste,
    saturacion,
    onCambiarBrillo,
    onCambiarContraste,
    onCambiarSaturacion,

    onRotarizquierda,
    onRotarDerecha,
    onRotar180,
    onRegresarRotar,

    onVolteoHorizontal,
    onVolteoVertical,
    onSeleccionarFiltro,
    onRestablecer

}){


    return(
        <section className="sec">
            <div>
                <h2>Herramientas edicion</h2>
            </div>
            <div>
                <p>filtros</p>
                <div>
                    {FILTROS.map(filtros=>(
                        <button
                            key={filtros}
                            className={`filtrozone ${filtroActivo ===filtros ? 'filtroActivo':""}`}
                            disabled={!imagenCargada}
                            onClick={()=>onSeleccionarFiltro(filtros)}
                        >   
                        {filtros} 
                        </button>


                    ))}
                </div>
            </div>

            <div>
                <div>
                    <p>brillo</p>
                    <input type="range" />
                </div>
                <div>
                    <p>contraste</p>
                    <input type="range" />
                </div>
                <div>
                    <p>saturacion</p>
                    <input type="range" />
                </div>
            </div>

            <div>
                <p>transformar</p>

                <div>
                    <button>izquierda</button>
                    <button>180</button>
                    <button>derecha</button>
                    <button>original</button>
                </div>

                <div>
                    <button>Horizontal</button>
                    <button>Vertical</button>
                </div>
            </div>

            <div>
                <button>restablecer</button>
            </div>

        </section>
    )


}