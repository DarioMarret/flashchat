import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListarPaginasBy } from './Services.pagina';


const Paginas = () => {

  const [paginas, setPaginas] = useState({
    id: 0,
    cuenta_id: 0,
    nombre: '',
    url: '',
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await ListarPaginasBy(id);
      if (status === 200) {
        setPaginas(data.data);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {
        paginas.id === 0 ? <h1>Esta pagina no existe</h1> : <>
        <iframe
        src={paginas.url} // URL de la página que quieres embeber
        width="100%"
        height={window.innerHeight}
        frameBorder="0"
        title="Embeber Página"
        />
        </>
      }
    </>
  );
};

export default Paginas;
