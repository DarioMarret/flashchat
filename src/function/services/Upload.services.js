import axios from "axios";
import { host } from "function/util/global";

export const ServicesSubirMedia = async (imagen, type, nombre) => {
    const url = `${host()}upload`;
    const formData = new FormData();
    if(type){
        formData.append("media", imagen, nombre);
        const { data, status } = await axios.post(url, formData);
        console.log(data);
        if (status === 200) {
            return data.url;
        }else{
            return null;
        }
    }else{
        formData.append("media", imagen);
        const { data, status } = await axios.post(url, formData);
        console.log(data);
        if (status === 200) {
            return data.url;
        }else{
            return null;
        }
    
    }
}