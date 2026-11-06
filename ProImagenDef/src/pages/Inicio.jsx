import Header from "../components/Header";


export default function Inicio({galeria}){

    return(
        <div>
            <Header></Header>
            inicio
            <div>
                {galeria.length === 0 ? 
                (
                    <p>No hay imagen cargadas</p>
                ):(
                    galeria.map((imagen,indice)=>(
                        <section key={indice} >
                            <img src={imagen} alt={`imagen guradada ${indice +1}`} />
                        </section>
                    ))
                )}
            </div>
        </div>


    );

}