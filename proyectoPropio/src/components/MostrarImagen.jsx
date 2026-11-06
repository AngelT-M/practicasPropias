import { useEffect, useRef } from "react"

const FILTROS_CSS = {
    Original: '',
    Gris: 'grayscale(100%)',
    Sepia: 'sepia(100%)',
    'Blanco y Negro': 'grayscale(100%) contrast(120%)',
    desenfoque: 'blur(4px)'
}

export default function MostrarImagen({
    imagenOriginal, 
    rotar, 
    volteoH, 
    volteoV, 
    filtroActivo, 
    brillo, 
    contraste, 
    saturacion, 
    onImagenProcesada}){
    const canvasRef = useRef(null);

    useEffect(()=>{
        if(!imagenOriginal)return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = ()=>{
            const deCostado = rotar===90 || rotar==270;
            canvas.width = deCostado ? img.height : img.width;
            canvas.height = deCostado ? img.width : img.height;

            ctx.save();
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.translate(canvas.width/2 , canvas.height/2);
            ctx.rotate((rotar * Math.PI)/180);
            ctx.scale( volteoH ? -1:1 , volteoV ? -1:1);

            const filtroBase = FILTROS_CSS[filtroActivo] || '';
            ctx.filter = `${filtroBase} brightness(${brillo}%) contrast(${contraste}%) saturate(${saturacion}%)`.trim();

            ctx.drawImage(img, -img.width/2, -img.height/2);
            ctx.restore();
            
        }
        img.src = imagenOriginal;
    }, [imagenOriginal, rotar, volteoH,volteoV,filtroActivo,brillo,contraste,saturacion,onImagenProcesada]
);

    return(
        <section className="sec">
            <div>
                <h2>visualizacion de imagen</h2>
            </div>
            <div>
                {imagenOriginal ? 
                (
                     <canvas ref={canvasRef}></canvas>
                )
                :
                (
                    <p>Imagen</p>
                )

                }
            </div>

        </section>

    )

}