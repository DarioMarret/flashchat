/* eslint-disable react-hooks/exhaustive-deps */
import { GetManejoConversacion, GetTokenDecoded, SubirMedia } from 'function/storeUsuario';
import { colorPrimario } from 'function/util/global';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ComponenteMultimedia from 'views/Components/ComponenteMultimedia';
import { EmiittingMensaje, EmittMesnaje, GetActivaConversacionMonitoreo, random } from 'views/Pages/Mensajeria/service/Eventos';
import socket from 'views/SocketIO';


export default function MensajeriaFlotante({ isOpen, onClose, conversation, agentes }) {
  const dispatch = useDispatch();
  const { conversacionMonitoreo } = useSelector(state => state.mensajeria);
  const [convers, setConvers] = useState(conversacionMonitoreo);
  const dummy = useRef();
  const [conversacionActiva, setConversacionActiva] = useState([]);
  const [inputStr, setInputStr] = useState("");
  const [linkPreview, setLinkPreview] = useState("");
  const [typeInput, setTypeInput] = useState("text");

  console.log(isOpen)
  useEffect(() => {
    // GetActivaConversacionMonitoreo(conversation);
  }, [isOpen]);
  // recibe la conversacion activa
  const NombreAGente=(agente_id)=>{
    for (let index = 0; index < agentes.length; index++) {
      const element = agentes[index];
      if(element.id === agente_id){
        return element.nombre
      }
    }
    return ""
  }

  const EnvianMensaje = (e) => {
    e.preventDefault();
    if (conversation == null || conversation.estado === "Eliminado") {
      return;
    }
    EnviarMensajeSocket()
  }

  const EnviarMensajeSocket = ()=>{
    var covActiva = GetManejoConversacion()
    if (inputStr !== null && inputStr !== "") {
      let infoClient = {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: conversation.conversacion_id,
        equipo_id: conversation.equipo_id,
        channel_id: conversation.channel_id,
        contacto_id: conversation.Contactos.id,
        agente_id: conversation.agente_id,
        updatedAt: new Date(),
        nombreunico: conversation.nombreunico,
      };
      let mensaje = {
        id: random(),
        text: typeInput === "text" ? inputStr : null,
        url: typeInput === "text" ? null : inputStr,
        type: typeInput,
        parems: null,
        chat_id: covActiva.mensaje.chat_id,
        sessionId: covActiva.sessionIdWebChat
      };
      EmittMesnaje(infoClient, mensaje);
      setInputStr("");
      setTypeInput("text");
      EmiittingMensaje();
      setTimeout(() => GetActivaConversacionMonitoreo(conversation), 350)
      dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }

  const CargarAvatar = async(file) => {
    const url = await SubirMedia(file)
    if(url !== null){
      setInputStr(url)
      return url
    }else{
      return null
    }
  }


  useEffect(() => {
    const { cuenta_id } = GetTokenDecoded();
    const handleConversacionActiva = (msg) => {
      const { type, data, listMensajes } = msg;
      console.log("Mensaje:", msg);
      console.log("conversation:", conversacionMonitoreo); 
      if (conversacionMonitoreo && listMensajes.length > 0) {
        console.log("Flotante:", msg); 
        if (type === "response_get_conversacion_activa" &&
          data.cuenta_id === cuenta_id && data.conversacion_id === conversacionMonitoreo.conversacion_id &&
          data.nombreunico === conversacionMonitoreo.nombreunico && data.contacto_id === conversacionMonitoreo.contacto_id) {
          
          if (listMensajes.length !== 0) {
            setConversacionActiva(listMensajes);
            if (GetTokenDecoded().ver_ultimo_mensaje) {
              dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }

            if (listMensajes[listMensajes.length - 1].tipo !== "ingoing") {
              dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
          }
        }
      }
    };
    socket.on(`get_conversacion_activa_${cuenta_id}`, handleConversacionActiva);
    return () => {
      socket.off(`get_conversacion_activa_${cuenta_id}`, handleConversacionActiva);
    };
  }, [socket, conversacionMonitoreo]);

  useEffect(() => {
    if (socket) {
      try {
        const cuenta_id = GetTokenDecoded().cuenta_id;
        const handleMensaje = (msg) => {
          const { type, data } = msg;
          if (data && data.cuenta_id === cuenta_id) {
            if (type === "mensaje_card" && data.mensaje.length > 0) {
              // conversacionActiva  //anadir el nuevo mensaje a la conversacion activa
              if (conversacionMonitoreo && data.mensaje[0].conversacion_id === conversacionMonitoreo.conversacion_id 
                && data.mensaje[0].nombreunico === conversacionMonitoreo.nombreunico 
                && data.mensaje[0].Contactos.id === conversacionMonitoreo.Contactos.id) {
                let copia = [...conversacionActiva];
                copia.push(data.mensaje[0]);
                setConversacionActiva(copia);
              }
            } else if (type === "finaliza-conversacion") {
              if(data.conversacion_id === conversacionMonitoreo.conversacion_id && data.nombreunico === conversacionMonitoreo.nombreunico){
                onClose();
                dispatch({ type: "SET_CONVERSACION_MONITOREO", payload: null });
              }
            }
          }
        };

        const handleCambiarEstado = (msg) => {
          const { type, data } = msg;
          if (type === "response_cambiar_estado" && data.cuenta_id === cuenta_id) {
            const { estado, conversacion_id, contacto_id, nombreunico } = data;
            if (conversacionMonitoreo && conversacionMonitoreo.conversacion_id === conversacion_id &&
              conversacionMonitoreo.nombreunico === nombreunico && conversacionMonitoreo.Contactos.id === contacto_id) {
              if (estado === "Eliminado" || estado === "Finalizado" || estado === "Resuelta") {
                onClose();
                dispatch({ type: "SET_CONVERSACION_MONITOREO", payload: null });
              }
            }
          }
        };
        // Establecer el listener de eventos
        socket.on(`mensaje_${cuenta_id}`, handleMensaje);
        socket.on(`cambiar_estado_${cuenta_id}`, handleCambiarEstado);
        // Limpieza de listeners
        return () => {
          socket.off(`mensaje_${cuenta_id}`, handleMensaje);
          socket.off(`cambiar_estado_${cuenta_id}`, handleCambiarEstado);
        };
  
      } catch (error) {
        console.log(error);
      }
    }
  }, [socket]);

  if (!isOpen) return null;
    
  return (
    <Modal 
      show={isOpen}
      onHide={onClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <div className="d-flex justify-content-between w-100 border-bottom">
          <div className="d-flex align-items-center w-10">
            <img src={conversation.Contactos.avatar} alt="imagen" className="rounded-circle" style={{ width: '50px' }} />
          </div>
          <div className="d-flex align-items-start flex-column w-90">
            <p className="m-0">{"Contacto: "}{conversation.Contactos.nombre}</p>
            <small className="text-muted">{"Telefono: "}{conversation.Contactos.telefono}</small>
            <small className="text-muted">{"Conexion: "}{conversation.nombre_bot}</small>
            {/* agente que lo esta atendiendo */}
            <small className="text-muted">{"Agente: "}{NombreAGente(conversation.agente_id)}
            </small>
          </div>
          <div className=''>
          <div className="d-flex justify-content-between w-100">
              <button
                  type="button"
                  className="btn ml-auto"
                  onClick={()=>onClose()}
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
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="row chat-body" style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '15px' }}>
          <div className="col-12">
            {
              conversacionActiva.map((item, index) => {
                if (item.tipo === "ingoing") {
                  return (
                    <div key={index + 1} className="w-100 my-3">
                      <div className="w-50">
                        <section
                          className="w-fit d-flex flex-column px-3 py-2 rounded 
                          chat-item-detail chat-receiver"
                        >
                          <ComponenteMultimedia item={item.mensajes} />
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
                          {/* {CompomenteMultimedis(item.mensajes)} */}
                          < ComponenteMultimedia item={item.mensajes} />
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
              })
            }
            {/* Este div es usado para hacer el scroll al final */}
            <div ref={dummy}></div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <div className="col-12">
        <div className="row rounded border-top d-flex d-flex flex-column flex-md-row align-items-center pt-2" style={{ minHeight: "50px" }}>
          <div className="col-9 d-flex align-items-center py-1">
            {/* se hace visible las respuesta rapidas que el usuario las puedas seleccionar  */}
            <textarea
              className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1"
              cols={"3"}
              rows={"3"}
              placeholder="Escribir ..."
              value={inputStr}
              onChange={(e) => {
                setInputStr(e.target.value)
              }}
              // cuando se presione enter enviar el mensaje
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  EnvianMensaje(e);
                }
              }}
              // detectar cuando el usuario digite / para mostrar las opciones de respuesta rapida
              onKeyUp={(e) => {
                // if (e.key === "/") {
                //   setShowRespuesta(true);
                // }else{
                //   setShowRespuesta(false);
                // }
              }}
            ></textarea>
            {linkPreview && (
              <div className="link-preview">
                {
                  // ver si es una imagen
                  linkPreview.includes(".png") || linkPreview.includes(".jpg") || linkPreview.includes(".jpeg") ? (
                    <img src={linkPreview} alt="link-preview" 
                      // que la imagen se muestre en un tamaño pequeño
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    <a href={linkPreview} target="_blank" rel="noreferrer">
                      {linkPreview}
                    </a>
                  )
                }
              </div>
            )}
          </div>

          <div
            className="col-3 d-flex gap-2 justify-content-end"
            style={{ zIndex: "400" }}
          >


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
              <span className="material-symbols-outlined">image</span>
            </button>

            <button className="btn-chat"
              onClick={() => {
                setTypeInput("file");
                document.getElementById("cualquiercosa").click();
              }}
            >
              <input type="file" id="cualquiercosa" name="file" 
              // que acepte cualquier tipo de archivo menos imagen .exe
              accept="application/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.pdf,.json"
              style={{ display: "none" }}
                onChange={(e) => {
                  CargarAvatar(e.target.files[0])
                }}
              />
              <span className="material-symbols-outlined">attach_file</span>
            </button>

            <button className="btn-chat d-flex align-items-center justify-content-center rounded-circle" 
              onClick={EnvianMensaje}
              style={{
                background: colorPrimario,
                color: "#fff",
              }}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
      </Modal.Footer>
    </Modal>
  )
}
