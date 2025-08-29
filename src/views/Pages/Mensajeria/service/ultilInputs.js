import { SubirMedia } from "function/storeUsuario";
import moment from "moment";

export const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf("image") === 0) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                if (event.target && event.target.result) {
                    // console.log(event.target.result); // Aquí tendrás el resultado como una URL de datos
                    // setUrl(event.target); // Suponiendo que setUrl guardará la URL de la imagen
                }
            };
            if (blob) {
                // el buffer de la imagen
                const buffer = await blob.arrayBuffer();
                const nombre = moment().unix().toString() + '.png';
                // Convertir la imagen a Base64
                reader.readAsDataURL(blob); 
                const file = new File([buffer], nombre, { type: 'image/jpeg' });
                const url = await SubirMedia(file, true, nombre);
                if(url){
                    return {
                        type: "image",
                        content: url,
                    }
                }
            }
        }
    }
};
