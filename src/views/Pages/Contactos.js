/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { GetTokenDecoded, SubirMedia } from "function/storeUsuario";
import { colorPrimario, host } from "function/util/global";
import { useEffect, useState } from "react";
import { Card, Container, Modal } from "react-bootstrap";
import { Input } from "reactstrap";
import Swal from "sweetalert2";

export default function Contactos(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    Limpiar();
    setShow(!show);
  };
  const [canales, setCanales] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [limitContactos, setLimitContactos] = useState(10);
  const [offsetContactos, setOffsetContactos] = useState(0);
  const [contac, setContac] = useState([]);
  const [totalContactos, setTotalContactos] = useState(0);
  const [pageContactos, setPageContactos] = useState(1);
  const [totalPaginasContactos, setTotalPaginasContactos] = useState(0);

  const [contacto, setContacto] = useState({
    id: 0,
    nombre: "",
    correo: "",
    telefono: "",
    avatar: "",
    channel_id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
  });

  const ListarContactos = async () => {
    const url = `${host}contactos/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setTotalContactos(data.data.length);
      setContac(data.data.slice(offsetContactos, limitContactos));
      MostrarCantidadContactos(data.data);
      setContactos(data.data);
      Paginacion(data.data);
    }
  };

  const CrearContacto = async () => {
    if (contacto.id !== 0) {
      let urle = `${host}contactos/${contacto.id}`;
      const { status } = await axios.put(urle, contacto);
      if (status === 200) {
        ListarContactos();
        handleClose();
      }
    } else {
      let url = `${host}contactos`;
      const { status } = await axios.post(url, contacto);
      if (status === 200) {
        ListarContactos();
        handleClose();
      }
    }
  };

  const EditarContacto = (item) => {
    setContacto(item);
    setShow(true);
  };

  const Limpiar = () => {
    setContacto({
      id: 0,
      nombre: "",
      correo: "",
      telefono: "",
      avatar: "",
      channel_id: 0,
      cuenta_id: GetTokenDecoded().cuenta_id,
    });
  };

  const ListarCanal = async () => {
    const url = `${host}canales`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setCanales(data.data);
    }
  };

  const CargarAvatar = async (file) => {
    const url = await SubirMedia(file);
    if (url !== null) {
      setContacto({
        ...contacto,
        avatar: url,
      });
      return url;
    } else {
      return null;
    }
  };

  const EliminarContacto = async (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${host}contactos/${id}`;
        const { status } = await axios.delete(url);
        if (status === 200) {
          ListarContactos();
        }
      }
    });
  };
  // cantidad de contactos que se mostrarán la primera vez que se cargue la pagina
  const MostrarCantidadContactos = (contac) => {
    setContac(contac.slice(offsetContactos, limitContactos));
  };

  // cantidad de paginas que se mostraran devuelve la cantidad de paginas
  const Paginacion = (contac) => {
    let paginas = Math.ceil(contac.length / limitContactos);
    let paginacion = 0;
    for (let i = 0; i < paginas; i++) {
      paginacion = i + 1;
    }
    setTotalPaginasContactos(paginas);
    return paginacion;
  };
  // Siguente pagina
  const SiguientePagina = () => {
    if (pageContactos < totalPaginasContactos) {
      setPageContactos(pageContactos + 1);
      setOffsetContactos(offsetContactos + limitContactos);
      MostrarCantidadContactos(contactos);
    }
  };
  // Anterior pagina
  const AnteriorPagina = () => {
    if (pageContactos > 1) {
      setPageContactos(pageContactos - 1);
      setOffsetContactos(offsetContactos - limitContactos);
      MostrarCantidadContactos(contactos);
    }
  };

  useEffect(() => {
    ListarCanal();
    ListarContactos();
  }, []);

  // crear un execl con los contactos y descargarlo
  const ExportarContactos = () => {
    let data = [];
    for (let i = 0; i < contactos.length; i++) {
      data.push({
        id: contactos[i].id,
        nombre: contactos[i].nombre,
        correo: contactos[i].correo,
        telefono: contactos[i].telefono,
        canal: contactos[i].channel.proveedor,
      });
    }
    let csv = "ID,Nombre,Correo,Telefono,Canal\n";
    data.forEach(function (row) {
      csv += row.id + "," + row.nombre + "," + row.correo + ",";
      csv += row.telefono + "," + row.canal + "\n";
    });
    let hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "contactos.csv";
    hiddenElement.click();
  };

  const hanbleBuscar = (e) => {
    let busqueda = e.target.value;
    if (busqueda !== "") {
      let filtro = contactos.filter((item) => {
        if (
          item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.telefono.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.channel.proveedor.toLowerCase().includes(busqueda.toLowerCase())
        ) {
          return item;
        }
      });
      setContac(filtro);
    } else {
      MostrarCantidadContactos(contactos);
    }
  };

  return (
    <>
      <Container fluid>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3 align-items-center">
          <div className="d-flex justify-content-start">
            <button className="mx-2 button-bm" onClick={handleClose}>
              Crear contacto
            </button>
            <button className="mx-2 button-bm" onClick={()=>ExportarContactos()}>Exportar contactos</button>
            {/* <button className="mx-2 button-bm">Importar contactos</button> */}
          </div>

          <div>
            <Input placeholder="Buscar contacto"
              onChange={(e) => hanbleBuscar(e)}
            />
          </div>
        </div>

        <Card style={{ overflow: 'auto' }}>
          <table
            responsive
            className="table-personalisado table-hover"
          >
            <thead>
              <tr className="text-white text-center font-weight-bold text-uppercase text-monospace align-middle">
                <th className="text-white">#</th>
                <th className="text-white">Avatar</th>
                <th className="text-white">Nombre</th>
                <th className="text-white">Correo</th>
                <th className="text-white">Telefono</th>
                <th className="text-white">Canal</th>
                <th className="text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contac.map((contacto, index) => (
                <tr key={index} className="text-center">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={contacto.avatar}
                      alt=""
                      width={40}
                      className="rounded-circle"
                    />
                  </td>
                  <td>{contacto.nombre}</td>
                  <td>{contacto.correo}</td>
                  <td>{contacto.telefono}</td>
                  <td>{contacto.channel.proveedor}</td>
                  <td className="d-flex justify-content-center">
                    {/* redireccionamiento */}
                    <button
                      className="btn btn"
                      onClick={() =>
                        console.log(`redireccionar a ${contacto.id}`)
                      }
                    >
                      {/* ver historial */}
                      <i className="fas fa-eye"></i>
                    </button>
                    {/* iniciar una conversacion */}
                    <button
                      className="btn btn"
                      onClick={() =>
                        console.log(`iniciar conversacion con ${contacto.id}`)
                      }
                    >
                      <i className="fas fa-comments"></i>
                    </button>
                    <button
                      className="btn btn"
                      onClick={() => EditarContacto(contacto)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn"
                      onClick={() => EliminarContacto(contacto.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* si hay mas de  10 contacto solo mostrar los primero 10 y hay visible la paginacion */}
          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item" onClick={() => AnteriorPagina()}>
                  <button className="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>

                <div className="d-flex justify-content-center">
                  <li className="page-item">
                    <button className="page-link">
                      {totalPaginasContactos}
                    </button>
                  </li>
                </div>

                <li className="page-item" onClick={() => SiguientePagina()}>
                  <button className="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </Card>

        <Modal
          size="md"
          show={show}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header>
            <div className="d-flex justify-content-between w-100">
              {contacto.id === 0 ? (
                <Modal.Title>Crear contacto</Modal.Title>
              ) : (
                <Modal.Title>Editar contacto</Modal.Title>
              )}
              <button
                type="button"
                className="btn ml-auto"
                onClick={handleClose}
              >
                <i
                  className="fa fa-times"
                  style={{
                    fontSize: "1.1em",
                    backgroundColor: "transparent",
                    color: colorPrimario,
                  }}
                ></i>
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Nombre"
                  value={contacto.nombre}
                  onChange={(e) =>
                    setContacto({ ...contacto, nombre: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="Correo"
                  value={contacto.correo}
                  onChange={(e) =>
                    setContacto({ ...contacto, correo: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefono"
                  placeholder="Telefono"
                  value={contacto.telefono}
                  onChange={(e) =>
                    setContacto({ ...contacto, telefono: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="avatar">Avatar</label>
                <input
                  type="file"
                  className="form-control"
                  id="avatar"
                  accept="image/png, image/jpeg"
                  onChange={(e) => CargarAvatar(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label htmlFor="canal">Canal</label>
                <select
                  className="form-control"
                  id="canal"
                  value={contacto.channel_id}
                  onChange={(e) =>
                    setContacto({ ...contacto, channel_id: e.target.value })
                  }
                >
                  <option value="">Seleccione</option>
                  {canales.map((canal, index) => (
                    <option key={index} value={parseInt(canal.id)}>
                      {canal.proveedor}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            {contacto.id === 0 ? (
              <button
                className="btn btn button-bm w-100"
                onClick={CrearContacto}
              >
                Crear contacto
              </button>
            ) : (
              <button
                className="btn btn button-bm w-100"
                onClick={CrearContacto}
              >
                Editar contacto
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
