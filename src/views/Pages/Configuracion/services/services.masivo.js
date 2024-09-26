
// Listar las plantillas de cloudApi

import { BmHttp } from "function/util/global";

export const plantillas_360 = "https://waba.360dialog.io/v1/configs/templates?offset=0&limit=1000&sort=business_templates.name&filters={}"

export const ControllerListarPlantillaCloudApi = async (id) => {
    const result = await BmHttp().post("plantilla_cloud",{
        id: id
    });
    return result.data
}