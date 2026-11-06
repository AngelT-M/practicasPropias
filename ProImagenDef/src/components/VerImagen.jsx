import { useEffect, useRef } from "react";


const FILTROS_CSS= {
    Original:'',
    Gris:'grayscale(100%)',
    Sepia:'sepia(100%)',
    'ByN': 'grayscale(100%) contrast(120%)',
    Desenfoque: 'blur(4px)'
}


export default function VerImagen({
    imagenOriginal,
    filtroActivo,
    rotar,
    volteoH,
    volteoV,
    brillo,
    contraste,
    saturacion,
    onImagenProsedada

}){
    const canvasRef = useRef(null);

    useEffect(()=>{
        if(!imagenOriginal)return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload=()=>{
            const deCostrado = rotar === 90 || rotar === 270;
            canvas.width = deCostrado ? img.height : img.width;
            canvas.height = deCostrado ? img.width : img.height;

            ctx.save()
            ctx.clearRect(0,0, canvas.width,canvas.height);
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate((rotar * Math.PI)/180);
            ctx.scale(volteoH ? -1:1, volteoV ? -1:1)


            const filtroBase = FILTROS_CSS[filtroActivo];
            ctx.filter = `${filtroBase} brightness(${brillo}%) contrast(${contraste}%) saturate(${saturacion}%)`.trim();
            
            ctx.drawImage(img, -img.width/2, -img.height/2);
            ctx.restore();
            
            onImagenProsedada(canvas.toDataURL('image/jpg'));
        
        }
        img.src = imagenOriginal;

    }, [ imagenOriginal,
    filtroActivo,
    rotar,
    volteoH,
    volteoV,
    brillo,
    contraste,
    saturacion,
    onImagenProsedada]);

   


    return(
        <section className="seccion">
            <div>
                <h1>Visualizar Image</h1>
            </div>

            <div className="vista"> 
                {imagenOriginal ? 
                (
                  <canvas className="cont" ref={canvasRef}></canvas>  
                ):(
                    <p>Aqui se mira la imagens</p>
                )}
            </div>
        </section>
        
    );

}