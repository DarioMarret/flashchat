import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global"; // Asegúrate de ajustar la importación según tu proyecto
import { useEffect, useState } from "react";
import Select from "react-select";

export default function CorreoSelect({ value, onChange }) {
    const [correos, setCorreos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (inputValue.length > 2) {
            fetchCorreos(inputValue);
        }
    }, [inputValue]);
    const fetchCorreos = async (query) => {
        setIsLoading(true);
        try {
          const response = await BmHttp().post(`correos/coincidencia`,{
            cuenta_id: GetTokenDecoded().cuenta_id,
            coincidencia:query
          });
          const { data } = response;
          setCorreos(data.map(contacto => ({ value: contacto.id, label: contacto.correos })));
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching contactos:", error);
          setIsLoading(false);
        }
      };
    
      const handleInputChange = (newValue) => {
        setInputValue(newValue);
      };
    
      const handleChange = (selectedOption) => {
        onChange(selectedOption ? selectedOption.value : "");
      };
    return (
        <Select
          value={correos.find(option => option.value === value)}
          onChange={handleChange}
          onInputChange={handleInputChange}
          options={correos}
          isLoading={isLoading}
          placeholder="Seleccione un correo"
          noOptionsMessage={() => "No se encontraron correos"}
          isClearable
        />
      );
}
