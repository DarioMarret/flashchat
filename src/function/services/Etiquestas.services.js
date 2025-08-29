const { GetTokenDecoded } = require("function/storeUsuario")
const { BmHttp } = require("function/util/global")

export const ServicesListarEtiquetas = async () => {
    const { data, status } = await BmHttp().get(`etiqueta/${GetTokenDecoded().cuenta_id}`)
    if (status === 200) {
        return data.data
    }else{
        return []
    }
}