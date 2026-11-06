import { useState } from "react";

const FOMRATO_ARCHIVO = ['image/jpeg','image/jpg','image/png','image/webp'];
const TAMANIO_MAX = 10;


function validarArchivo(Archivo){
    if (!FOMRATO_ARCHIVO.includes(Archivo.type)) {
        return 'El formato del archivo no es valido';
    }
    const tamanioMN = Archivo.size / (1024*1024);
    if (tamanioMN>TAMANIO_MAX) {
        return `EL archivo pesa ${tamanioMN}MB, solo se permite ${TAMANIO_MAX}MB`;
    }
    return null;
}

export default function SelecImagen({onImagenCargada}){
    const [error, setError] = useState(null);
    const [arrastrar, setArrastrar] = useState(false);

    function procesarArchivo(Archivo){
        const mensajeError = validarArchivo(Archivo)
        if (mensajeError) {
           setError(mensajeError);
           return; 
        }
        setError('');
        
        const lector = new FileReader();
        lector.onload =()=>{
            onImagenCargada(lector.result);
        };
        lector.readAsDataURL(Archivo);
    }

    function manejarSeleccion(evento){
        const Archivo = evento.target.files[0];
        if(Archivo) procesarArchivo(Archivo);
    }
    function manejarDrop(evento){
        evento.preventDefault();
        setArrastrar(false);
        const Archivo = evento.dataTrasfer.files[0];
        if(Archivo) procesarArchivo(Archivo);    
    }
    function DragOver(evento){
        evento.dataTrasfer();
        setArrastrar(true);
    }
    function DragLeave(){
        setArrastrar(false);
    }

    return(
        <section className="seccion">
            <div>
                Ingresar imagen
            </div>
            <div
            onDrop={manejarDrop}
            onDragOver={DragOver}
            onDragLeave={DragLeave}  
            >
                <p>Arrastrar imagen </p>
                <p>o</p>
                <label >
                    Seleccionar imagen
                    <input 
                    type="file" 
                    accept="image/*"
                    onChange={manejarSeleccion}
                    style={{display: 'none'}}
                    />
                </label>
                {error && <p>{error}</p>}
            </div>

        </section>
        
    );

}