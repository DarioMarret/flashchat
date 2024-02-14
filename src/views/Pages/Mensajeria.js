/* eslint-disable jsx-a11y/alt-text */
// react components used to create a calendar with events on it
// dependency plugin for react-big-calendar
// react component used to create alerts
// react-bootstrap components
import axios from "axios";
import { GetTokenDecoded } from "function/storeUsuario";
import { host, proxy } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";
// import socket from "views/SocketIO";
import Picker from "emoji-picker-react";
import { SubirMedia } from "function/storeUsuario";
import io from "socket.io-client";

var socket = null;
if(proxy === ""){
  socket = io.connect(String(host), {
    path: "/socket.io/socket.io.js",
    transports: ["websocket"],
  });
}else{
  socket = io.connect(String(host).replace(`/${proxy}/`, ""), {
    path: `/${proxy}/socket.io/socket.io.js`,
    transports: ["websocket"],
  });
}


console.log("socket: ", socket);

moment.locale("es");

export default function Mensajeria() {
  const [card_mensajes, setCard_mensajes] = useState([]);
  const [conversacionActiva, setConversacionActiva] = useState([]);
  const [estados, setEstados] = useState([]);
  const [misConversaciones, setMisConversaciones] = useState('Sin leer')
  const [equipoUsuario , setEquipoUsuario] = useState({
    correo: '',
    estado: '',
    nombre: '',
    perfil: '',
    cuenta: {
      id: 0,
      empresa: '',
      estado: '',
      limite_agentes: '',
      limite_bots: '',
    },
    equipos:[]
  });
  const [newMensaje, setNewMensaje] = useState(null);
  const [convEstado, setConvEstado] = useState(null);
  const [agentes, setAgentes] = useState([]);

  const [inputStr, setInputStr] = useState("");
  const [typeInput, setTypeInput] = useState("text");
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject, event) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };
  const ListarAgentes = async() => {
    const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
    const { data, status } = await axios.get(url)
    if (status === 200) {
        let ag = []
        data.data.map((agente, index) => {
            ag.push({
              id: agente.id,
              cuenta_id: agente.cuenta_id,
              nombre: agente.nombre,
            })
        })
        setAgentes(ag)
    }else{
      setAgentes([])
    }
  }

  const NombreAgente = (id) => {
    let nombre = agentes.filter((item) => item.id === id)
    if(nombre.length > 0){
      return nombre[0].nombre
    }else{
      return "Sin agente"
    }
  }

  useEffect(() => {
    GetMisConversaciones()
    ListarAgentes()
  }, []);

  const VerConversaciones = (item) => {
    localStorage.setItem('misConversaciones', item)
    EmiittingMensaje()
    setMisConversaciones(item)
  }

  const GetMisConversaciones = () => {
    const local = localStorage.getItem('misConversaciones');
    if (local) {
      setMisConversaciones(local)
    } else {
      setMisConversaciones('Sin leer')
    }
  }
  
  useEffect(() => {
    try {
      const cuenta_id = GetTokenDecoded().cuenta_id;
      socket.emit("listar_conversacion", {
        cuenta_id: cuenta_id,
        equipo_id: null,
        agente_id: null,
        estado: null,
      });
      socket.on(`response_conversacion_${cuenta_id}`, (data) => {
        setEquipoUsuario(GetTokenDecoded());
        let new_card = [];
        let equipos = []
        GetTokenDecoded().equipos.map((item) => {
          equipos.push(item.id)
        });
        const covActiva = GetManejoConversacion();
        if (data.length > 0) {
          data.map((item) => {
            if(item.estado !== "Eliminado" && item.estado !== "Resuelta"){
              if(equipos.includes(item.equipo_id)){
                new_card.push({
                  id: item.id,
                  conversacion_id: item.conversacion_id,
                  name: item.Contactos.nombre,
                  Contactos: item.Contactos,
                  contacto_id: item.contacto_id,
                  channel_id: item.channel_id,
                  mensaje: item.mensajes,
                  equipo_id: item.equipo_id,
                  tipo: item.tipo,
                  estado: item.estado,
                  fecha:
                    moment(item.updatedAt) >= moment().subtract(1, "days")
                      ? moment(item.updatedAt).format("hh:mm a")
                      : moment(item.updatedAt).format("DD/MM/YYYY hh:mm a"),
                  url_avatar: item.Contactos.avatar,
                  proveedor: item.channel.proveedor,
                  active: true,
                  nombreunico: item.nombreunico,
                  etiqueta: item.etiquetas,
                  agente_id: item.agente_id,
                })
                if (covActiva) {
                  if (item.conversacion_id === covActiva.conversacion_id && item.nombreunico === covActiva.nombreunico) {
                    socket.emit("get_conversacion_activa", {
                      cuenta_id: GetTokenDecoded().cuenta_id,
                      contacto_id: item.contacto_id,
                      equipo_id: item.equipo_id,
                      channel_id: item.channel_id,
                      agente_id: GetTokenDecoded().id,
                      conversacion_id: item.conversacion_id,
                      nombreunico: item.nombreunico,
                    })
                  }
                }
              }
            }
          });
          setCard_mensajes(new_card);
        }
      });

      socket.on("mensaje", (msg) => {
        const { type, data } = msg;
        if (type === "update-conversacion" && data.cuenta_id === cuenta_id) {
          new Promise((resolve, reject) => {
            socket.emit("listar_conversacion", {
              cuenta_id: cuenta_id,
              equipo_id: null,
              agente_id: null,
              estado: null,
            });
            resolve();
          });
        }
      });

      socket.on(`get_conversacion_activa_${cuenta_id}`, (msg) => {
        const { type, data, listMensajes } = msg;
        console.log("msg: ", msg);
        if (type === "response_get_conversacion_activa" &&
          data.cuenta_id === cuenta_id && data.conversacion_id === JSON.parse(localStorage.getItem("conversacion_activa")).conversacion_id &&
          data.nombreunico === JSON.parse(localStorage.getItem("conversacion_activa")).nombreunico) {
          setConversacionActiva(listMensajes);
        }
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      socket.off(`response_conversacion_${GetTokenDecoded().cuenta_id}`);
      socket.off(`get_conversacion_activa_${GetTokenDecoded().cuenta_id}`);
      socket.off("mensaje");
    };
  }, []);


  const EmiittingMensaje = () => {
    socket.emit("listar_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      equipo_id: null,
      agente_id: null,
      estado: null,
    });
  }

  const ListarEstados = async () => {
    const url = `${host}estados`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setEstados(data.data);
    }
  };

  const CargarAvatar = async(file) => {
    const url = await SubirMedia(file)
    if(url !== null){
      setInputStr(url)
      return url
    }else{
      return null
    }
  }
  const ManejarConversacion = (item) => {
    console.log("item: ", item);
    localStorage.setItem("conversacion_activa", JSON.stringify({
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: item.conversacion_id,
        nombreunico: item.nombreunico,
        equipo_id: item.equipo_id,
        channel_id: item.channel_id,
        contacto_id: item.contacto_id,
        estado: item.estado,
        Contacto: item.Contactos,
      })
    );
    setConvEstado(item.estado);
    socket.emit("get_conversacion_activa", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: item.conversacion_id,
      equipo_id: item.equipo_id,
      channel_id: item.channel_id,
      contacto_id: item.contacto_id,
      agente_id: GetTokenDecoded().id,
      nombreunico: item.nombreunico,
    });
    EmiittingMensaje();
  };

  const GetManejoConversacion = () => {
    const local = localStorage.getItem("conversacion_activa");
    if (local) {
      return JSON.parse(local);
    } else {
      return null;
    }
  };

  const DeletManejoConversacion = () => {
    localStorage.removeItem("conversacion_activa");
  }

  const random = () => {
    return Math.random().toString(36).substr(2);
  };

  const EnvianMensaje = (e) => {
    e.preventDefault();
    const covActiva = GetManejoConversacion();
    if (covActiva == null || covActiva.estado === "Eliminado") {
      alert("Seleccione una conversacion");
      return;
    }
    if (inputStr !== null && inputStr !== "") {
      let infoClient = {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: covActiva.conversacion_id,
        equipo_id: covActiva.equipo_id,
        channel_id: covActiva.channel_id,
        contacto_id: covActiva.contacto_id,
        agente_id: GetTokenDecoded().id,
        updatedAt: new Date(),
        nombreunico: covActiva.nombreunico,
      };
      let mensaje = {
        id: random(),
        text: typeInput === "text" ? inputStr : null,
        url: typeInput === "text" ? null : inputStr,
        type: typeInput,
        parems: null,
      };
      socket.emit("enviando_mensajes", {
        infoClient: infoClient,
        mensaje: mensaje,
      });
      setInputStr("");
      setTypeInput("text");
      EmiittingMensaje();
    }
  };

  const CompomenteMultimedis = (item) => {
    console.log("CompomenteMultimedis_item: ", item);
    if(item === null || item === undefined){
      return null;
    }
    if (item.type === "text") {
      return <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word"}} >{String(item.text)}</span>;
    } else if (item.type === "image") {
      // cuando se haga click en la imagen se debe abrir en un modal
      return (
        <img
          src={item.url}
          alt="..."
          className="mr-3"
          width={250}
          onClick={() => {
            window.open(item.url, "_blank");
          }}
        />
      );
    } else if (item.type === "video") {
      return  (
        <video controls width={250}>
          <source src={item.url} type="video/mp4" />
        </video>
      )
    } else if (item.type === "contact") {
      return <span className="">{String(item.text)}</span>;
    } else if (item.type === "file") {
      // preview del archivo
      if(item.url.split('.').pop() === 'xlsx' || item.url.split('.').pop() === 'xls'){
        // si es xlsx mostrar el icono de excel y cuando se haga click descargar el archivo
        return (
          <div className="d-flex gap-2">
            <span class="material-symbols-outlined">insert_drive_file</span>
            <a href={item.url} download>
              {item.url.split('/').pop()}
            </a>
          </div>
        )
      // si es .json .exe .docx .doc .pptx .ppt .txt .zip .rar mostrar el icono de archivo y cuando se haga click descargar el archivo
      }else if (item.url.split('.').pop() === 'json' || item.url.split('.').pop() === 'exe' || item.url.split('.').pop() === 'docx' || item.url.split('.').pop() === 'doc' || item.url.split('.').pop() === 'pptx' || item.url.split('.').pop() === 'ppt' || item.url.split('.').pop() === 'txt' || item.url.split('.').pop() === 'zip' || item.url.split('.').pop() === 'rar'){
        return (
          <div className="d-flex gap-2">
            <span class="material-symbols-outlined">insert_drive_file</span>
            <a href={item.url} download>
              {item.url.split('/').pop()}
            </a>
          </div>
        )
      }else{
        return <iframe src={item.url} height="400px"></iframe>;
      }

    } else if (item.type === "audio") {
      console.log("item.mensajes.url: ", item.url);
      return (
        <audio controls>
          <source src={item.url} type="audio/ogg" />
        </audio>
      );
    } else {
      return null;
    }
  };

  const ActualizarEstadoConversacion = (estado) => {
    const covActiva = GetManejoConversacion();
    socket.emit("actualizar_estado_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: covActiva.conversacion_id,
      contacto_id: covActiva.contacto_id,
      nombreunico: covActiva.nombreunico,
      estado: estado,
    });
    // actualizamos el estado en localstorage
    if(estado === "Eliminado" || estado === "Resuelta"){
      DeletManejoConversacion();
      setConversacionActiva([]);
    }else{
      localStorage.setItem("conversacion_activa",JSON.stringify({...covActiva,estado: estado}));
    }

    setConvEstado(estado);
    setTimeout(() => {
      socket.emit("listar_conversacion", {
        cuenta_id: GetTokenDecoded().cuenta_id,
        equipo_id: null,
        agente_id: null,
        estado: null,
      });
    }, 300);
  };

  useEffect(() => {
    ListarEstados();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  // transferir
  const [dropdownOpenTransferir, setDropdownOpenTransferir] = useState(false);
  const toggleTransferir = () => setDropdownOpenTransferir((prevState) => !prevState);

  const [dropdownOpenTag, setDropdownOpenTag] = useState(false);
  const toggleTag = () => setDropdownOpenTag((prevState) => !prevState);

  return (
    <>
      <div
        className="d-flex box-chat box-chat-container flex-column flex-md-row"
        style={{ margin: "0px", height: '100%' }}
      >
        <div className="chat-list bg-chat rounded-start">
          <div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
            <div className="">
              <Input
                className="input-dark text-dark"
                placeholder="Buscar chat"
              />
              <p className="m-2 mb-0">
                {misConversaciones}
              </p>
            </div>
            <div className="d-flex">
              <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
                <DropdownToggle
                  data-toggle="dropdown"
                  tag="span"
                  className="cursor-pointer"
                  
                >
                  <span class="material-symbols-outlined text-dark">
                    more_horiz
                  </span>
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem className="d-flex align-items-center gap-2"
                    onClick={() => {
                      VerConversaciones('Mis Conversaciones')
                    }}
                  >
                    <span class="material-symbols-outlined">all_inbox</span>
                    <span>Mis Conversaciones</span>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center gap-2"
                    onClick={() => {
                      VerConversaciones('Sin leer')
                    }}
                  >
                    <span class="material-symbols-outlined">
                      mark_chat_unread
                    </span>
                    Sin leer
                  </DropdownItem>
                  {/* todas */}
                  {
                    GetTokenDecoded().perfil === 'Administrador' ?
                      <DropdownItem className="d-flex align-items-center gap-2"
                        onClick={() => {
                          VerConversaciones('Todas')
                        }}
                      >
                        <span class="material-symbols-outlined">chat</span>
                        Todas
                      </DropdownItem>
                      : null
                  }
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <div className="w-100 py-2 px-2 d-flex flex-column gap-3 box-items-chat">
            {card_mensajes.map((item, index) => {
              if(misConversaciones === 'Sin leer' && item.agente_id === 0){
                return (
                  <div
                    key={index + 1}
                    className="chat-item cursor-pointer rounded d-flex gap-2 align-items-center"
                    onClick={() => ManejarConversacion(item)}
                  >
                    <div className="w-25 rounded d-flex align-items-center justify-content-center">
                      <img
                        src={item.url_avatar}
                        className="rounded-circle"
                        width="40px"
                        height="40px"
                      />
                    </div>

                    <div className="w-75 p-1 d-flex flex-column">
                      <div
                        className="d-flex flex-row justify-content-between"
                        style={{ lineHeight: "15px" }}
                      >
                        <span className="w-100 text-dark font-bold">
                          {item.name}
                        </span>
                        <small className="text-warning">{item.fecha}</small>
                      </div>

                      <div className="d-flex flex-row justify-content-between my-1">
                        <small className="text-dark">
                          {
                            // limitar la cantidad de caracteres a mostrar
                            item.mensaje.type === "text"
                              ? String(item.mensaje.text).length > 30
                                ? String(item.mensaje.text).substring(0, 30) +
                                  "..."
                                : item.mensaje.text
                              : // si es imagen o video mostrar el tipo de archivo
                              item.mensaje.type === "image" ||
                                item.mensaje.type === "video"
                              ? item.mensaje.type
                              : // si es audio mostrar el nombre del archivo
                              item.mensaje.type === "audio"
                              ? item.mensaje.type
                              : // si es archivo mostrar el nombre del archivo
                              item.mensaje.type === "file"
                              ? item.mensaje.type
                              : null
                          }
                        </small>
                        <div
                          className="rounded-circle p-0 d-flex justify-content-center aligns-items-center bg-warning"
                          style={{ width: "24px", height: "24px" }}
                        >
                          1
                        </div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">
                        {item.etiqueta.map((et, index) => {
                          if(et !== null && et !== "" && et !== undefined){
                            return (
                              <span
                                key={index + 1}
                                className="chat-tag rounded bg-gray text-white"
                              >
                                {et}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                );
              }else if(misConversaciones === 'Mis Conversaciones' && item.agente_id === GetTokenDecoded().id){
                // se permite mostrar todas las conversaciones que tienen el agente_id igual al id del agente logueado
                return (
                  <div
                    key={index + 1}
                    className="chat-item cursor-pointer rounded d-flex gap-2 align-items-center"
                    onClick={() => ManejarConversacion(item)}
                  >
                    <div className="w-25 rounded d-flex align-items-center justify-content-center">
                      <img
                        src={item.url_avatar}
                        className="rounded-circle"
                        width="40px"
                        height="40px"
                      />
                    </div>

                    <div className="w-75 p-1 d-flex flex-column">
                      <div
                        className="d-flex flex-row justify-content-between"
                        style={{ lineHeight: "15px" }}
                      >
                        <span className="w-100 text-dark font-bold">
                          {item.name}
                        </span>
                        <small className="text-warning">{item.fecha}</small>
                      </div>

                      <div className="d-flex flex-row justify-content-between my-1">
                        <small className="text-dark">
                          {
                            // limitar la cantidad de caracteres a mostrar
                            item.mensaje.type === "text"
                              ? String(item.mensaje.text).length > 30
                                ? String(item.mensaje.text).substring(0, 30) +
                                  "..."
                                : item.mensaje.text
                              : // si es imagen o video mostrar el tipo de archivo
                              item.mensaje.type === "image" ||
                                item.mensaje.type === "video"
                              ? item.mensaje.type
                              : // si es audio mostrar el nombre del archivo
                              item.mensaje.type === "audio"
                              ? item.mensaje.type
                              : // si es archivo mostrar el nombre del archivo
                              item.mensaje.type === "file"
                              ? item.mensaje.type
                              : null
                          }
                        </small>
                        <div
                          className="rounded-circle p-0 d-flex justify-content-center aligns-items-center bg-warning"
                          style={{ width: "24px", height: "24px" }}
                        >
                          1
                        </div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">

                        {item.etiqueta.map((et, index) => {
                          if(et !== null && et !== "" && et !== undefined){
                            return (
                              <span
                                key={index + 1}
                                className="chat-tag rounded bg-gray text-white"
                              >
                                {et}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                );
              }else if(misConversaciones === 'Todas'){
                return (
                  <div
                    key={index + 1}
                    className="chat-item cursor-pointer rounded d-flex gap-2 align-items-center"
                    onClick={() => ManejarConversacion(item)}
                  >
                    <div className="w-25 rounded d-flex align-items-center justify-content-center ">
                      <img
                        src={item.url_avatar}
                        className="rounded-circle"
                        width="40px"
                        height="40px"
                      />
                    </div>


                    <div className="w-75 p-1 d-flex flex-column">
                      <div
                        className="d-flex flex-row justify-content-between"
                        style={{ lineHeight: "15px" }}
                      >
                        <span className="w-100 text-dark font-bold">
                          {item.name}
                        </span>
                        <small className="text-warning">{item.fecha}</small>
                      </div>

                      <div className="d-flex flex-row justify-content-between my-1">
                        <small className="text-dark">
                          {
                            // limitar la cantidad de caracteres a mostrar
                            item.mensaje.type === "text"
                              ? String(item.mensaje.text).length > 30
                                ? String(item.mensaje.text).substring(0, 30) +
                                  "..."
                                : item.mensaje.text
                              : // si es imagen o video mostrar el tipo de archivo
                              item.mensaje.type === "image" ||
                                item.mensaje.type === "video"
                              ? item.mensaje.type
                              : // si es audio mostrar el nombre del archivo
                              item.mensaje.type === "audio"
                              ? item.mensaje.type
                              : // si es archivo mostrar el nombre del archivo
                              item.mensaje.type === "file"
                              ? item.mensaje.type
                              : null
                          }
                        </small>
                        <div
                          className="rounded-circle p-0 d-flex justify-content-center aligns-items-center bg-warning"
                          style={{ width: "24px", height: "24px" }}
                        >
                          1
                        </div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">

                        {item.etiqueta.map((et, index) => {
                          if(et !== null && et !== "" && et !== undefined){
                            return (
                              <span
                                key={index + 1}
                                className="chat-tag rounded bg-gray text-white"
                              >
                                {et}
                              </span>
                            );
                          }
                        })}
                      <span className="w-20 text-dark font-bold"
                        style={{ fontSize: "12px" }}
                      >
                       Ag: {NombreAgente(item.agente_id)}
                      </span>
                      </div>

                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="chat-messages bg-white rounded-end">
          {/* <EmptyChat/> */}
          <div className="p-4 h-100 pt-2 pb-0">
            {/* Chat header */}
            <div
              className="row rounded bg-chat d-flex"
              style={{ minHeight: "50px" }}
            >
              <div className="d-flex align-items-center gap-2 px-2 col-3">
                <div className="rounded d-flex align-items-center justify-content-center">
                  <img
                    src={
                      GetManejoConversacion()
                        ? GetManejoConversacion().Contacto.avatar
                        : null
                    }
                    className="rounded-circle"
                    width="40px"
                    height="40px"
                  />
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="d-block font-bold chat-title d-flex">
                    {GetManejoConversacion()
                      ? GetManejoConversacion().Contacto.nombre
                      : "Seleccione una conversación"}
                  </span>
                  {GetManejoConversacion() ? (
                    <span className="d-block status-active"></span>
                  ) : null}
                </div>
              </div>

              <div className="col-9 d-flex justify-content-end alig-items-center">
                <div className="d-flex align-items-center gap-1">
                  <Input
                    className="input-dark text-dark"
                    placeholder="Buscar en conversación"
                  />

                  {/* <span class="material-symbols-outlined">
                    search
                  </span> */}

                  <Dropdown
                    isOpen={dropdownOpenTag}
                    toggle={toggleTag}
                    direction="down"
                  >
                    <DropdownToggle
                      data-toggle="dropdown"
                      tag="span"
                      className="cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-dark">
                        more
                      </span>
                    </DropdownToggle>

                    <DropdownMenu>
                      {estados.map((item, index) => {
                        return (
                          <DropdownItem className="d-flex align-items-center gap-2" onClick={()=>ActualizarEstadoConversacion(item.estados)} >
                            <span class="material-symbols-outlined">
                              all_inbox
                            </span>
                            <span>{item.estados}</span>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              {/* <div className="col-12 border-top">Hola mundo</div> */}
            </div>

            {/* Chat conversation */}
            <div className="row chat-body">
              <div className="col-12">
                {conversacionActiva.map((item, index) => {
                  if (item.tipo === "ingoing") {
                    return (
                      <div key={index + 1} className="w-100 my-3">
                        <div className="w-50">
                          <section
                            className="w-fit d-flex flex-column px-3 py-2 rounded 
                            chat-item-detail chat-receiver"
                          >
                            <span>{CompomenteMultimedis(item.mensajes)}</span>
                            <small>
                              {moment(item.createdAt) >=
                              moment().subtract(1, "days")
                                ? moment(item.createdAt).format("hh:mm a")
                                : moment(item.createdAt).format(
                                    "DD/MM/YYYY hh:mm a"
                                  )}
                            </small>
                          </section>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index + 1}
                        className="w-100 my-3  d-flex justify-content-end"
                      >
                        <div className="w-50 d-flex justify-content-end">
                          <section
                            className="border w-fit d-flex flex-column px-3 py-2 rounded 
                            chat-item-detail chat-sender"
                          >
                            {CompomenteMultimedis(item.mensajes)}
                            <small>
                              {moment(item.createdAt) >=
                              moment().subtract(1, "days")
                                ? moment(item.createdAt).format("hh:mm a")
                                : moment(item.createdAt).format(
                                    "DD/MM/YYYY hh:mm a"
                                  )}
                            </small>
                          </section>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              <div className="col-12 picker-icon">
                {showPicker && (
                    <Picker
                      pickerStyle={{ width: "100%" }}
                      onEmojiClick={onEmojiClick}
                    />
                )}
              </div>
            </div>

            <div
              className="row rounded border-top d-flex d-flex flex-column flex-md-row align-items-center pt-2"
              style={{ minHeight: "50px" }}
            >
              <div className="col-9 d-flex align-items-center py-1">
                <textarea
                  className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1"
                  cols={"2"}
                  rows={"2"}
                  placeholder="Escribir ..."
                  value={inputStr}
                  onChange={(e) => setInputStr(e.target.value)}
                  // cuando se presione enter enviar el mensaje
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      EnvianMensaje(e);
                    }
                  }}
                ></textarea>
              </div>

              <div
                className="col-3 d-flex gap-2 justify-content-end"
                style={{ zIndex: "400" }}
              >
                <button
                  className="btn-chat"
                  onClick={() => setShowPicker((val) => !val)}
                >
                  <span class="material-symbols-outlined">mood</span>
                </button>

                <button className="btn-chat">
                  <span class="material-symbols-outlined">mic</span>
                </button>

                <button className="btn-chat"
                  onClick={() => {
                    setTypeInput("image");
                    document.getElementById("file").click();

                  }}
                >
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      CargarAvatar(e.target.files[0])
                    }}
                  />
                  <span class="material-symbols-outlined">image</span>
                </button>

                <button className="btn-chat"
                  onClick={() => {
                    setTypeInput("file");
                    document.getElementById("cualquiercosa").click();
                  }}
                >
                  <input type="file" id="cualquiercosa" name="file" accept="*" style={{ display: "none" }}
                    onChange={(e) => {
                      CargarAvatar(e.target.files[0])
                    }}
                  />
                  <span class="material-symbols-outlined">attach_file</span>
                </button>

                <button className="btn-chat btn-chat-send d-flex align-items-center justify-content-center" onClick={EnvianMensaje}>
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
