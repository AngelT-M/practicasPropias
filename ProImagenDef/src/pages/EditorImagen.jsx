import { useState } from "react";
import Header from "../components/Header";
import Herramientas from "../components/Herramientas";
import SelecImagen from "../components/SelecImgaen";
import VerImagen from "../components/VerImagen";

export default function EditorImagen({setGaleria}){
    const [imagenOriginal, setImagenOriginal] = useState(null);
    const [imagenProcesada, setImagenProcesada] = useState(null);

    const [rotar, setRotar] = useState(0);
    const [volteoH, setVolteoH] = useState(false);
    const [volteoV, setVolteoV] = useState(false);

    const [filtroActivo, setFiltroActivo] = useState('Original');

    const [brillo, setBrillo] = useState(100);
    const [contraste, setContraste] = useState(100);
    const [saturacion, setSaturacion] = useState(100);

    function rotacion(grados){
        setRotar(prev =>(prev+grados+360)%360);
    }
    function VolteoHorizontal(){
        setVolteoH(prev => !prev);
    }
    function VolteoVertical(){
        setVolteoH(prev => !prev);
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

    function desImagen(){
        if (!imagenProcesada)return;

        const enlace = document.createElement('a');
        enlace.href = imagenProcesada;
        enlace.download = 'image.jpg';
        enlace.click();
    }

    function guardarImg(){
        if (!imagenProcesada)return; 
        setGaleria(prev =>[...prev, imagenProcesada]);
    }

    
   
    return(
        <div className="editorInit">
            <Header></Header>
            <div  className="compont">
                <SelecImagen
                    onImagenCargada={setImagenOriginal}
                />
                <VerImagen
                imagenOriginal={imagenOriginal}
                filtroActivo={filtroActivo}

                rotar={rotar}
                volteoH={volteoH}
                volteoV={volteoV}

                brillo={brillo}
                contraste={contraste}
                saturacion={saturacion}

                onImagenProsedada={setImagenProcesada}

                />
                <Herramientas
                imagenOriginal={!!imagenOriginal}
                filtroActivo={filtroActivo}

                brillo={brillo}
                contraste={contraste}
                saturacion={saturacion}
                onBrillo={setBrillo}
                onContraste={setContraste}
                onSaturacion={setSaturacion}

                ImagenProsedada={setImagenProcesada}

                onRotarIzquierda={()=>rotacion(-90)}
                onRotarDerecha={()=>rotacion(90)}
                onRotar180={()=>rotacion(180)}
                onRotarRestablecer={()=>setRotar(0)}

                onVoltearHorizontal={VolteoHorizontal}
                onVoltearVertical={VolteoVertical}

                onFiltroActivo={setFiltroActivo}
                onReestablecer={restablecer}
                    
                onDesckImgaen={desImagen}

                onlisProceso={!!setImagenProcesada}
                onguardar={guardarImg}


                />
            </div>
        </div>

    );


}