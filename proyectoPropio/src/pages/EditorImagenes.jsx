import { use, useState } from "react";
import CargarImagen from "../components/CargarImagen";
import HerraminetasEdicion from "../components/HerramientasEdicion";
import MostrarImagen from "../components/MostrarImagen";
import NavBar from "../components/NavBar";
import { flushSync } from "react-dom";


export default function EditorImagenes(){
    const [imagenOriginal, setImagenOriginal] = useState(null);
    const [imagenProcesada, setImagenProcesada] = useState(null);

    const [rotar,setRotar] = useState(0);
    const [volteoH, setVolteoH] = useState(false);
    const [volteoV, setVolteoV] = useState(false);

    const [filtroActivo, setFiltroActivo] = useState('Original');
    
    const [brillo, setBrillo] = useState(100);
    const [contraste, setContraste] = useState(100);
    const [saturacion, setSaturacion] = useState(100);

    function Rotacion(grados){
        setRotar(prev=>(prev+grados+360)%360);
    }
    function volteoHorizontal(){
        setVolteoH(prev=>!prev);
    }
    function volteoVertical(){
        setVolteoV(prev=>!prev);
    }

    function restablecer(){
        setRotar(0)
        setVolteoH(false)
        setVolteoV(false)

        setFiltroActivo('Original')
    
        setBrillo(100)
        setContraste(100)
        setSaturacion(100)
    }

    return(
        <div>
            <NavBar></NavBar>

            <div className="secciones">
                <CargarImagen
                onImagenCargada={setImagenOriginal}
                ></CargarImagen>

                <MostrarImagen
                imagenOriginal={imagenOriginal}
                rotar={rotar}
                volteoH={volteoH}
                volteoV={volteoV}

                filtroActivo={filtroActivo}

                brillo={brillo}
                contraste={contraste}
                saturacion={saturacion}

                onImagenProcesada={setImagenProcesada}
                ></MostrarImagen>

                <HerraminetasEdicion
                imagenCargada={!!imagenOriginal}
                filtroActivo={filtroActivo}

                brillo={brillo}
                contraste={contraste}
                saturacion={saturacion}
                onCambiarBrillo={setBrillo}
                onCambiarContraste={setContraste}
                onCambiarSaturacion={setSaturacion}

                onRotarizquierda={()=>Rotacion(-90)}
                onRotarDerecha={()=>Rotacion(90)}
                onRotar180={()=>Rotacion(180)}
                onRegresarRotar={()=>setRotar(0)}

                onVolteoHorizontal={volteoHorizontal}
                onVolteoVertical={volteoVertical}
                onSeleccionarFiltro={setFiltroActivo}
                onRestablecer={restablecer}


                
                ></HerraminetasEdicion>
            </div>
        </div>


    )
}