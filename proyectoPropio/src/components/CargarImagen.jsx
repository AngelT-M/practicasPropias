import { useState } from "react";

const FORMATO_ARCHIVO = ['image/jpg', 'image/jpeg','image/png','image/webp'];
const TAMANIO_MAXIMO = 10;

function validarArchivo(Archivo){
   if (!FORMATO_ARCHIVO.includes(Archivo.type)) {
        return 'Foramato de archivo no valido, debe ser JPG, PNG o WEBP';
   }
   const tamanioMB = Archivo.size / (1024*1024);
   if(tamanioMB>TAMANIO_MAXIMO){
        return `El archivo pesa ${Math.round(tamanioMB)}MB, Maximo permitodo ${TAMANIO_MAXIMO}MB`;
   } 
   return null;
}

export default function CargarImagen({onImagenCargada}){
    const [error, setError] = useState('')
    const [arrastrar, setArrastrar] = useState(false);

    function procesarArchivo(Archivo){
        const mesajeError = validarArchivo(Archivo);
        if (mesajeError) {
            setError(mesajeError)
            return;
        }
        setError('')

        const lector = new FileReader();
        lector.onload = ()=>{
            onImagenCargada(lector.result);
        };
        lector.readAsDataURL(Archivo);
    }

    function manejarSelecion(evento){
        const Archivo = evento.target.files[0];
        if(Archivo) procesarArchivo(Archivo);
    }
    function manejarDrop(evento){
        evento.preventDefault();
        setArrastrar(false);
        const Archivo = evento.dataTransfer.files[0];
        if(Archivo) procesarArchivo(Archivo);
    }
    function manejarDragOver(evento){
        evento.preventDefault();
        setArrastrar(true);
    }
    function manejraDragLeave(){
        setArrastrar(false);
    }


    return(
        <section className="sec">
            <div>
                <h2>Cargar Imagen</h2>
                <div
                className={`dropzone ${arrastrar ? 'dropzone-activo':''}`}
                onDrop={manejarDrop}
                onDragOver={manejarDragOver}
                onDragLeave={manejraDragLeave}
                >
                    <p>arrastra imagen</p>
                    <p>o</p>
                    <label 
                    className="btn" >
                        selecionar archivo
                        <input
                         type="file"
                         accept="image/*"
                         onChange={manejarSelecion}
                         style={{display: 'none'}}
                          />
                    </label>
                </div>
                <div>
                    {error && <p>{error}</p> }
                    <p>tamaño maximo admito 10MB</p>
                </div>
                

            </div>
        </section>   


    )
}

