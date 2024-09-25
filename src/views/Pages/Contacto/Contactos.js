/* eslint-disable react-hooks/exhaustive-deps */
import { GetTokenDecoded, SubirMedia } from "function/storeUsuario";
import { BmHttp, colorPrimario, host } from "function/util/global";
import { useEffect, useState } from "react";
import { Card, Container, Modal } from "react-bootstrap";
import { Input } from "reactstrap";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import socket from "views/SocketIO";
import ModalGooglePeople from "./ModalGooglePeople";

export default function Contactos(props) {
  const [show, setShow] = useState(false);
  const [showG, setShowG] = useState(false);


  const handleClose = () => {
    Limpiar();
    setShow(!show);
  };

  const [mensaje, setMensaje] = useState({
    contacto_id: 0,
    channel_id: 0,
    equipo_id: GetTokenDecoded().equipo_id,
    agente_id: GetTokenDecoded().id,
    cuenta_id: GetTokenDecoded().cuenta_id,
    estado: "Abierta",
    alerta: "Asignacion",
    mensajes:{
      id: v4(),
      text: "",
      url: null,
      type: "text", // "text" || "image" || "video" || "audio" || "document" || "location" || "contact" || "sticker"
      parems: null,
      date: new Date(),
    },
    nombreunico: "",
  })
  const [showModal, setShowModal] = useState(false);
  const handleShow = (item) => {
    setShowModal(!showModal);
    if (item) {
      setMensaje({ ...mensaje, contacto_id: item.id, channel_id: item.channel_id });
    }else{
      // se tiene que limpia el mensaje
      setMensaje({
        contacto_id: 0,
        channel_id: 0,
        equipo_id: GetTokenDecoded().equipo_id,
        agente_id: GetTokenDecoded().id,
        cuenta_id: GetTokenDecoded().cuenta_id,
        estado: "Abierta",
        alerta: "Asignacion",
        mensajes:{
          id: v4(),
          text: "",
          url: null,
          type: "text", // "text" || "image" || "video" || "audio" || "document" || "location" || "contact" || "sticker"
          parems: null,
          date: new Date(),
        },
        nombreunico: "",
      });
    }
  }

  const handleShowG = () => {
    setShowG(!showG);
  }

  const [canales, setCanales] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [bot, setBot] = useState([]); 
  const [limitContactos, setLimitContactos] = useState(10);
  const [contac, setContac] = useState([]);
  const [totalContactos, setTotalContactos] = useState(0);
  const [siguiente, setSiguiente] = useState("");
  const [anterior, setAnterior] = useState("");
  const [mensajeGoogle, setMensajeGoogle] = useState("");

  const [contacto, setContacto] = useState({
    id: 0,
    nombre: "",
    correo: "",
    telefono: "",
    avatar: "",
    channel_id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
  });

  const ListarContactos = async (pass) => {
    if(pass){
      const { data, status } = await BmHttp().get(pass);
      if (status === 200 && data) {
        setTotalContactos(data.total);
        setContac(data.data);
        setSiguiente(data.siguientes);
        setAnterior(data.anterior);
      }
      return;
    }else{
      const { data, status } = await BmHttp().get(`contactos/${GetTokenDecoded().cuenta_id}?skip=${0}&take=${limitContactos}`);
      if (status === 200 && data) {
        setTotalContactos(data.total);
        setContac(data.data);
        setSiguiente(data.siguientes);
        setAnterior(data.anterior);
      }
    }
  }

  const HandleSiguiente = async () => {
    await ListarContactos(siguiente);
  }
  const HandleAnterior = async () => {
    await ListarContactos(anterior);
  }

  const ListarBot = async () => {
    const { data, status } = await BmHttp().get(`bots/${GetTokenDecoded().cuenta_id}`);
    if (status === 200) {
      setBot(data.data);
    }
  }

  const CrearContacto = async () => {
    if (contacto.id !== 0) {
      const { status } = await BmHttp().put(`contactos/${contacto.id}`, contacto);
      if (status === 200) {
        ListarContactos();
        handleClose();
      }
    } else {
      const { status } = await BmHttp().post(`contactos`, contacto);
      if (status === 200) {
        ListarContactos();
        handleClose();
      }
    }
  }

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
    const { data, status } = await BmHttp().get(`canales`);
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
        const url = `${host()}contactos/${id}`;
        const { status } = await BmHttp().delete(url);
        if (status === 200) {
          await ListarContactos();
        }
      }
    });
  };

  const Enviarmensaje = async () => {
    socket.emit("iniciar_conversacion", mensaje);
    handleShow();
  }

  useEffect(() => {
    // validar la query success que se recibe en la url
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if(success) {
        console.log("success", success);
        setMensajeGoogle("Cuenta de Google autenticada correctamente");
        // borrar el mensaje despues de 5 segundos
        setTimeout(() => {
          setMensajeGoogle("");
        }, 5000);
    }
  }, []);
  useEffect(() => {
    (async()=>{
      await ListarBot();
      await ListarCanal();
      await ListarContactos();
    })()
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

  const hanbleBuscar = async(e) => {
    let busqueda = e.target.value;
    // validar es es numero 
    if(!isNaN(parseInt(busqueda)) && String(busqueda).length >= 5){
      if (busqueda !== "" && busqueda ) {
        const { data } = await BmHttp().post(`${host()}contactos/coincidencia`,{
          cuenta_id: GetTokenDecoded().cuenta_id,
          coincidencia: busqueda
        });
        setContac(data);
      } else {
        await ListarContactos()
      }
    }else{
      if (busqueda !== "" && String(busqueda).length >= 2 && isNaN(parseInt(busqueda))) {
        const { data } = await BmHttp().post(`${host()}contactos/coincidencia`,{
          cuenta_id: GetTokenDecoded().cuenta_id,
          coincidencia: busqueda
        });
        setContac(data);
      } else {
        await ListarContactos()
      }
    }
  };

  return (
    <>
      <Container fluid>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3 align-items-center">
          <div className="d-flex justify-content-start">
            <button className="mx-2 button-bm" onClick={handleClose}
              title="Crear contacto"
            >
              <i className="fas fa-user-plus" title="Crear contacto"></i>
            </button>
            <button className="mx-2 button-bm" onClick={()=>ExportarContactos()} title="Exportar contactos">
              <i className="fas fa-file-export" title="Exportar contactos"></i>
            </button>
            {/* <button className="mx-2 button-bm">Importar contactos</button> */}
            {/* Conectar Google People Api */}
            <button className="mx-2 button-bm" title="Conectar Google People Api"
              onClick={handleShowG}
            >
              <i className="fab fa-google" title="Conectar Google People Api"></i>
            </button>
          </div>
          {
            mensajeGoogle !== "" && (
              <div 
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  zIndex: "1000",
                  width: "100%",
                }}  
                className="alert alert-success" 
                role="alert"
                >
                {mensajeGoogle}
              </div>
            )
          }
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
                    {/* inconon para sincronizar con google people api */}
                    {/* <button className="">
                      <i className="fas fa-sync" title="Google People Contact."></i>
                    </button> */}
                    {/* redireccionamiento */}
                    <button
                      className=""
                      onClick={() => 
                        window.location.href = `/admin/historial-contacto/${contacto.id}`
                      }
                    >
                      {/* ver historial */}
                      <i className="fas fa-eye"
                        title="Ver historial"
                      ></i>
                    </button>
                    {/* iniciar una conversacion */}
                    <button className="" 
                      onClick={() =>handleShow(contacto) }
                    >
                      <i className="fas fa-comments"
                        title="Iniciar conversacion"
                      ></i>
                    </button>
                    <button
                      className=""
                      onClick={() => EditarContacto(contacto)}
                    >
                      <i className="fas fa-edit"
                        title="Editar contacto"
                      ></i>
                    </button>
                    <button
                      className=""
                      onClick={() => EliminarContacto(contacto.id)}
                    >
                      <i className="fas fa-trash-alt"
                        title="Eliminar contacto"
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* si hay mas de  10 contacto solo mostrar los primero 10 y hay visible la paginacion */}
          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation example text-center">
              <ul className="pagination">
                  <button className="page-link" aria-label="Previous" onClick={() => HandleAnterior()}>
                    <span aria-hidden="true">&laquo;</span>
                  </button>

                  <div className="d-flex justify-content-center">
                      <button className="page-link">
                        {totalContactos === 0 ? 0 : totalContactos}
                      </button>
                  </div>

                  <button className="page-link" aria-label="Next" onClick={() => HandleSiguiente()}>
                    <span aria-hidden="true">&raquo;</span>
                  </button>
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
                className=" button-bm w-100"
                onClick={CrearContacto}
              >
                Crear contacto
              </button>
            ) : (
              <button
                className=" button-bm w-100"
                onClick={CrearContacto}
              >
                Editar contacto
              </button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal
          size="md"
          show={showModal}
          onHide={handleShow}
          aria-labelledby="example-modal-sizes-title-lg shadow"
          className="shadow"
        >
          <Modal.Header>
            <div className="d-flex justify-content-between w-100">
              <Modal.Title>Enviar mensaje</Modal.Title>
              <button
                type="button"
                className="btn ml-auto"
                onClick={handleShow}
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
                <label htmlFor="mensaje">Conexion</label>
                <select
                  className="form-control"
                  id="nombreunico"
                  value={mensaje.nombreunico}
                  onChange={(e) =>
                    setMensaje({ ...mensaje, nombreunico: e.target.value })
                  }
                >
                  <option value="">Seleccione</option>
                  {
                    bot.map((item, index) => (
                      <option key={index} value={item.nombreunico}>{item.nombre_bot}</option>
                    ))
                  }
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  className="form-control"
                  id="mensaje"
                  placeholder="Mensaje"
                  cols={3}
                  rows={3}
                  style={{ 
                    resize: "none",
                    overflow: "auto",
                    minHeight: "100px",
                    maxHeight: "100px",
                  }}
                  value={mensaje.text}
                  onChange={(e) =>
                    setMensaje({ ...mensaje, mensajes: { ...mensaje.mensajes, text: e.target.value } })
                  }
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className=" button-bm w-100"
              onClick={Enviarmensaje}
            >
              Enviar mensaje
            </button>
          </Modal.Footer>
        </Modal>
        <ModalGooglePeople
          show={showG}
          onHide={handleShowG}
          className="shadow"
        />
      </Container>
    </>
  );
}
