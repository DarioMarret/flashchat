import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global"; // Asegúrate de ajustar la importación según tu proyecto
import { useEffect, useState } from "react";
import Select from "react-select";

const ContactoSelect = ({ value, onChange }) => {
  const [contactos, setContactos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputValue.length > 2) {
      fetchContactos(inputValue);
    }
  }, [inputValue]);

  const fetchContactos = async (query) => {
    setIsLoading(true);
    try {
      const response = await BmHttp().post(`contactos/coincidencia`,{
        cuenta_id: GetTokenDecoded().cuenta_id,
        coincidencia:query
      });
      const { data } = response;
      setContactos(data.map(contacto => ({ value: contacto.id, label: contacto.nombre + " " + contacto.channel.proveedor })));
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
      value={contactos.find(option => option.value === value)}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={contactos}
      isLoading={isLoading}
      placeholder="Seleccione un contacto"
      noOptionsMessage={() => "No se encontraron contactos"}
      isClearable
    />
  );
};

export default ContactoSelect;
