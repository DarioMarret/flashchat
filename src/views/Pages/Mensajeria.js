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
  Input
} from 'reactstrap';
// import socket from "views/SocketIO";
import Picker from 'emoji-picker-react';
import io from "socket.io-client";


const socket = io.connect(String(host).replace(`/${proxy}/`, ""), {
  path: `/${proxy}/socket.io/socket.io.js`,
  transports: ["websocket"],
});

console.log("socket: ", socket);

moment.locale("es");

export default function Mensajeria() {
  const [card_mensajes, setCard_mensajes] = useState([]);
  const [conversacionActiva, setConversacionActiva] = useState([]);
  const [estados, setEstados] = useState([]);
  const [newMensaje, setNewMensaje] = useState(null);
  const [convEstado, setConvEstado] = useState(null);

  const [inputStr, setInputStr] = useState('');
  const [showPicker, setShowPicker] = useState(false);
 
  const onEmojiClick = (emojiObject, event) => {
    setInputStr(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

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
        console.log(`response_conversacion_${cuenta_id}:  `, data);
        let new_card = [];
        const covActiva = GetManejoConversacion();
        if (data.length > 0) {
          data.map((item) => {
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
            });
            if (covActiva) {
              if (
                item.conversacion_id === covActiva.conversacion_id &&
                item.nombreunico === covActiva.nombreunico
              ) {
                socket.emit("get_conversacion_activa", {
                  cuenta_id: GetTokenDecoded().cuenta_id,
                  conversacion_id: item.conversacion_id,
                  nombreunico: item.nombreunico,
                });
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
        if ( type === "response_get_conversacion_activa" && data.cuenta_id === cuenta_id && 
        data.conversacion_id === JSON.parse(localStorage.getItem("conversacion_activa")).conversacion_id && 
        data.nombreunico === JSON.parse(localStorage.getItem("conversacion_activa")).nombreunico) {
          setConversacionActiva(listMensajes);
          console.log("listMensajes: ", listMensajes);
        }
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      socket.off();
    };
  }, [socket]);

  const ListarEstados = async () => {
    const url = `${host}estados`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setEstados(data.data);
    }
  };

  const ManejarConversacion = (item) => {
    console.log("item: ", item);
    localStorage.setItem("conversacion_activa",JSON.stringify({
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
  };

  const GetManejoConversacion = () => {
    const local = localStorage.getItem("conversacion_activa");
    if (local) {
      return JSON.parse(local);
    } else {
      return null;
    }
  };

  const random = () => {
    return Math.random().toString(36).substr(2);
  };

  const EnvianMensaje = (e) => {
    e.preventDefault();
    console.log("newMensaje: ", newMensaje);
    const covActiva = GetManejoConversacion();
    if (covActiva == null || covActiva.estado === "Eliminado") {
      alert("Seleccione una conversacion");
      return;
    }
    if (newMensaje !== null || newMensaje !== "") {
      console.log("e.target.value: ", newMensaje);
      let infoClient = {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: covActiva.conversacion_id,
        equipo_id: covActiva.equipo_id,
        channel_id: covActiva.channel_id,
        contacto_id: covActiva.contacto_id,
        agente_id: GetTokenDecoded().id,
        nombreunico: covActiva.nombreunico,
      };
      let mensaje = {
        id: random(),
        text: newMensaje,
        type: "text",
      };
      socket.emit("enviando_mensajes", {
        infoClient: infoClient,
        mensaje: mensaje,
      });
      setNewMensaje("");
    }
  };

  const CompomenteMultimedis = (item) => {
    if (item.type === "text") {
      return (
        <span  className="">
          {String(item.text)}
        </span>
      );
    } else if (item.type === "image") {
      return (
        <img
          src={item.url}
          alt="..."
          className="mr-3"
          width={250}
        />
      );
    } else if (item.type === "video") {
      return (
        <video
          src={item.url}
          alt="..."
          className="mr-3"
        />
      );
    } else if (item.type === "file") {
      // preview del archivo
      return (
        <iframe
          src={item.url}
          height="400px"
        ></iframe>
      );
    } else if (item.type == "audio") {
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

  const ActualizarEstadoConversacion = (e) => {
    const covActiva = GetManejoConversacion();
    socket.emit("actualizar_estado_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: covActiva.conversacion_id,
      nombreunico: covActiva.nombreunico,
      estado: e.target.value,
    });
    // actualizamos el estado en localstorage
    localStorage.setItem(
      "conversacion_activa",
      JSON.stringify({
        ...covActiva,
        estado: e.target.value,
      })
    );
    setConvEstado(e.target.value);
    setTimeout(() => {
      socket.emit("listar_conversacion", {
        cuenta_id: GetTokenDecoded().cuenta_id,
        equipo_id: null,
        agente_id: null,
        estado: null,
      });
    }, 900);
  };

  useEffect(() => {
    ListarEstados();
  }, []);

	const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [dropdownOpenTag, setDropdownOpenTag] = useState(false);
  const toggleTag = () => setDropdownOpenTag((prevState) => !prevState);

  return (
    <>
			<div className="d-flex box-chat box-chat-container flex-column flex-md-row" style={{ margin: '0px', maxHeight: '80vh'}}>
				<div className="chat-list bg-chat rounded-start">
					<div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
						<div className="">
							<Input className="input-dark text-dark"
								placeholder="Buscar chat"
							/>
						</div>

						<div className="d-flex">
							<Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
								<DropdownToggle data-toggle="dropdown"tag="span" className="cursor-pointer">
									<span class="material-symbols-outlined text-dark">
										more_horiz
									</span>
								</DropdownToggle>

								<DropdownMenu>
									<DropdownItem className="d-flex align-items-center gap-2">
										<span class="material-symbols-outlined">
											all_inbox
										</span>
										<span>Mis Conversaciones</span>
									</DropdownItem>
									<DropdownItem className="d-flex align-items-center gap-2">
										<span class="material-symbols-outlined">
											mark_chat_unread
										</span>
										Sin leer</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>

					<div className="w-100 py-2 px-2 d-flex flex-column gap-3 box-items-chat">
            {
              card_mensajes.map((item, index) => { 
                return (
                  <div key={index+1} className="chat-item cursor-pointer rounded d-flex gap-2 align-items-center"
                    onClick={() => ManejarConversacion(item)}>
                    <div className="w-25 rounded d-flex align-items-center justify-content-center">
                      <img src={item.url_avatar} 
                      className="rounded-circle"
                      width="40px" height="40px"/>
                    </div>

                    <div className="w-75 p-1 d-flex flex-column">
                      <div className="d-flex flex-row justify-content-between" 
                      style={{ lineHeight: '15px'}}>
                        <span className="w-100 text-dark font-bold">{item.name}</span>
                        <small className="text-warning">{item.fecha}</small>
                      </div>

                      <div className="d-flex flex-row justify-content-between my-1">
                        <small className="text-dark">{
                          // limitar la cantidad de caracteres a mostrar
                          item.mensaje.type === 'text' ? String(item.mensaje.text).length > 30 ? String(item.mensaje.text).substring(0, 30) + '...' : item.mensaje.text :
                          // si es imagen o video mostrar el tipo de archivo
                          item.mensaje.type === 'image' || item.mensaje.type === 'video' ? item.mensaje.type :
                          // si es audio mostrar el nombre del archivo
                          item.mensaje.type === 'audio' ? item.mensaje.type :
                          // si es archivo mostrar el nombre del archivo
                          item.mensaje.type === 'file' ? item.mensaje.type : null
                        }</small>
                        <div className="rounded-circle p-0 d-flex justify-content-center aligns-items-center bg-warning" 
                        style={{ width: '24px', height: '24px'}}>1</div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">
                        {
                          item.etiqueta.map((et, index) => {
                            return(
                              <span key={index+1} className="chat-tag rounded bg-gray text-white">{et}</span>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
						{/* <div className="chat-item cursor-pointer rounded d-flex gap-2 align-items-center">
							<div className="w-25 rounded d-flex align-items-center justify-content-center">
								<img src="https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg" 
								className="rounded-circle"
								width="40px" height="40px"/>
							</div>

							<div className="w-75 p-1 d-flex flex-column">
								<div className="d-flex flex-row justify-content-between" 
								style={{ lineHeight: '15px'}}>
									<span className="w-100 text-dark font-bold">Hola mundo</span>
									<small className="text-warning">23:06</small>
								</div>

								<div className="d-flex flex-row justify-content-between my-1">
									<small className="text-dark">Esto es un mensaje</small>
									<div className="rounded-circle p-0 d-flex justify-content-center aligns-items-center bg-warning" 
									style={{ width: '24px', height: '24px'}}>1</div>
								</div>

								<div className="d-flex gap-2 flex-wrap">
									<span className="chat-tag rounded bg-gray text-white">Nuevo</span>
									<span className="chat-tag rounded bg-gray text-white">Activo</span>
								</div>
							</div>
						</div> */}

					</div>
				</div>

				<div className="chat-messages bg-white rounded-end">
					{/* <EmptyChat/> */}
          <div className="p-4 h-100 pt-2 pb-0">
            {/* Chat header */}
            <div className="row rounded bg-chat d-flex" style={{ minHeight: '50px' }}>
              <div className="d-flex align-items-center gap-2 px-2 col-3">
                <div className="rounded d-flex align-items-center justify-content-center">
                  <img src="https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg" 
                  className="rounded-circle"
                  width="40px" height="40px"/>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="d-block font-bold chat-title d-flex">Jhon Dood</span>
                  <span className="d-block status-active"></span>
                </div>
              </div>

              <div className="col-9 d-flex justify-content-end alig-items-center">
                <div className="d-flex align-items-center gap-1">
                  <Input className="input-dark text-dark"
                    placeholder="Buscar en conversación"
                  />

                  {/* <span class="material-symbols-outlined">
                    search
                  </span> */}

                  <Dropdown isOpen={dropdownOpenTag} toggle={toggleTag} direction="down">
                    <DropdownToggle data-toggle="dropdown"tag="span" className="cursor-pointer">
                      <span class="material-symbols-outlined text-dark">
                        more
                      </span>
                    </DropdownToggle>

                    <DropdownMenu>
                      { estados.map((item, index) => {
                          return(
                            <DropdownItem className="d-flex align-items-center gap-2">
                              <span class="material-symbols-outlined">
                                all_inbox
                              </span>
                              <span>{item.estados}</span>
                            </DropdownItem>
                          )
                        }) 
                      }
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              {/* <div className="col-12 border-top">Hola mundo</div> */}
            </div>

            {/* Chat conversation */}
            <div className="row chat-body">
              <div className="col-12">
                {
                  conversacionActiva.map((item, index) => {
                    if(item.tipo === 'ingoing'){
                      return(
                        <div key={index+1} className="w-100 my-3">
                          <div className="w-50">
                            <section className="w-fit d-flex flex-column px-3 py-2 rounded 
                            chat-item-detail chat-receiver">
                              <span>
                                {CompomenteMultimedis(item.mensajes) }
                              </span>
                              <small>
                                {
                                  moment(item.createdAt) >= moment().subtract(1, "days") ?
                                  moment(item.createdAt).format("hh:mm a") :
                                  moment(item.createdAt).format("DD/MM/YYYY hh:mm a")
                                }
                              </small>
                              </section>
                          </div>
                        </div>
                      )
                    }else{
                      return(
                        <div key={index+1} className="w-100 my-3  d-flex justify-content-end">
                          <div className="w-50 d-flex justify-content-end">
                            <section className="border w-fit d-flex flex-column px-3 py-2 rounded 
                            chat-item-detail chat-sender">
                              {CompomenteMultimedis(item.mensajes)}
                              <small>
                                {
                                  moment(item.createdAt) >= moment().subtract(1, "days") ?
                                  moment(item.createdAt).format("hh:mm a") :
                                  moment(item.createdAt).format("DD/MM/YYYY hh:mm a")
                                }
                              </small>
                              </section>
                          </div>
                        </div>
                      )
                    }
                  })
                }
              </div>

              <div className="col-12 picker-icon">
                { showPicker && <Picker
                pickerStyle={{ width: '100%' }}
                onEmojiClick={onEmojiClick} />}
              </div>
            </div>

            <div className="row rounded border-top d-flex align-items-center pt-2" style={{     minHeight: '50px' }}>

              <div className="col-9 d-flex align-items-center py-1">
                <textarea className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1" 
                cols={'2'} rows={'2'} 
                placeholder="Escribir ..."
                value={inputStr}
                onChange={e => setInputStr(e.target.value)}></textarea>
              </div>

              <div className="col-3 d-flex gap-2 justify-content-end" 
              style={{ zIndex: '400' }}>
                <button className="btn-chat" 
                onClick={() => setShowPicker(val => !val)} >
                  <span class="material-symbols-outlined">mood</span>
                </button>

                <button className="btn-chat">
                  <span class="material-symbols-outlined">mic</span>
                </button>

                <button className="btn-chat">
                  <span class="material-symbols-outlined">image</span>
                </button>

                <button className="btn-chat">
                  <span class="material-symbols-outlined">attach_file</span>
                </button>

                <button className="btn-chat btn-chat-send d-flex align-items-center justify-content-center">
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
