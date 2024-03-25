import axios from 'axios';
import { GetTokenDecoded, SetManejoConversacionStorange } from 'function/storeUsuario';
import { colorPrimario, host } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Modal
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import socket from 'views/SocketIO';

function CardChat(props) {
  const { index, messageItem, verConversacion } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { historyInfo } = useMensajeria();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [show, setShow] = useState(false);
  const [agentes, setAgentes] = useState([])
  const [agente_id, setAgente_id] = useState(0)

  const ChatLiberado = (data) => {
    socket.emit("liberar_chat", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      contacto_id: data.contacto_id,
      conversacion_id: data.conversacion_id,
      nombreunico: data.nombreunico,
      agente_id: GetTokenDecoded().id,
    })
    Swal.fire({
      icon: 'success',
      title: 'Chat liberado',
      showConfirmButton: false,
      timer: 1500
    })
    socket.emit("borrar_conversacion", {
      agente_id: GetTokenDecoded().id,
    })
  }

  const SetTransferirChat = (data) => {
    socket.emit("transferir_chat", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      agente_id_transferir: GetTokenDecoded().id,
      contacto_id: data.contacto_id,
      conversacion_id: data.conversacion_id,
      agente_id: agente_id,
    });
  }

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

  const VerConversacionesSinAsignar = (items) => {
    let data = {
      ...items,
      sin_asignar: true,
    }
    SetManejoConversacionStorange(data)
    socket.emit("get_conversacion_activa", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: items.conversacion_id,
      equipo_id: items.equipo_id,
      channel_id: items.channel_id,
      contacto_id: items.contacto_id,
      agente_id: 0,
      nombreunico: items.nombreunico,
      tipo: "sin_asignar",
    })
    historyInfo()
  }

  useState(() => {
    (async()=>{
      await ListarAgentes()
    })()
  },[])

  if(messageItem === undefined){
    return null
  }

  return (
    <>
      <div key={index + 1} className="chat-item rounded w-100">
        <div className="w-100 rounded px-2 rounded-1 rounded-bottom-0 d-flex justify-content-between align-items-center" 
        style={{ 
          // backgroundColor: "#3F98F8",
          backgroundColor: colorPrimario,
          color: "white",
          fontSize: "13px" }}>
            <span>{ messageItem.bot +" - "+messageItem.telefono }</span>
            <span>#{ messageItem.conversacion_id }</span>
            <Dropdown 
              isOpen={dropdownOpen}
              toggle={toggle}>
              <DropdownToggle
                data-toggle="dropdown"
                tag="span"
              >
              </DropdownToggle>

              <DropdownMenu>
                {
                  messageItem.agente_id === GetTokenDecoded().id ?
                  <DropdownItem onClick={() => ChatLiberado(messageItem)}>Liberar</DropdownItem>
                  : null
                }
                {
                  messageItem.agente_id === GetTokenDecoded().id ?
                  <DropdownItem onClick={() => setShow(!show)}>Transferir</DropdownItem>
                  : null
                }
                <DropdownItem onClick={() => VerConversacionesSinAsignar(messageItem)}>Ver conversacion </DropdownItem>
                {/* <DropdownItem>Historial de conversaciones</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
        </div>

        <div className="d-flex gap-2 align-items-center p-2 cursor-pointer" 
        onClick={verConversacion}>
          <div className="w-25 d-flex flex-column align-items-center justify-content-center">
            <div className="w-25 rounded d-flex align-items-center justify-content-center">
                <img src={ messageItem.url_avatar } className="rounded-circle" width="50px" height="50px"/>
            </div>
          </div>

          <div className="w-75 p-1 d-flex flex-column">
            <div className="d-flex flex-column justify-content-between">
              <span className="w-100 text-dark font-bold text-start" 
              style={{ fontSize: '14px' }}>
                { messageItem.name }
              </span>

              <div className="w-100 d-flex justify-content-between">
                <small 
                className="text-warning" 
                style={{ fontSize: '12px' }}>{messageItem.fecha}</small>

                <div className="rounded-circle text-center p-0 circle-count bg-warning"
                style={{ fontSize: '12px' }}>
                  1
                </div>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-between my-1" 
            style={{ lineHeight: '17px'}}>
              <small className="text-dark">
                {
                  // limitar la cantidad de caracteres a mostrar
                  messageItem.mensaje.type === "text"
                    ? String(messageItem.mensaje.text).length > 30
                      ? String(messageItem.mensaje.text).substring(0, 30) +
                        "..."
                      : messageItem.mensaje.text
                    : // si es imagen o video mostrar el tipo de archivo
                    messageItem.mensaje.type === "image" ||
                      messageItem.mensaje.type === "video"
                    ? messageItem.mensaje.type
                    : // si es audio mostrar el nombre del archivo
                    messageItem.mensaje.type === "audio"
                    ? messageItem.mensaje.type
                    : // si es archivo mostrar el nombre del archivo
                    messageItem.mensaje.type === "file"
                    ? messageItem.mensaje.type
                    : null
                }
              </small>
            </div>
          </div>
        </div>

        <div className="border-top w-100"></div>
        
        <div className="w-100 rounded px-2 my-2 rounded-1 rounded-top-0" 
          style={{ fontSize: "13px" }}>
          <div className="d-flex gap-2 flex-wrap mt-1">
              { messageItem.etiqueta.map((et, index) => {
                if (et !== null && et !== "" && et !== undefined){
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
            Ag: {NombreAgente(messageItem.agente_id)}
            </span>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={() => setShow(!show)+setAgente_id(0)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* Listar a que agente le quiere transfer el chat */}
        <Modal.Header closeButton>
          <Modal.Title>Transferir chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            {
              // datos del chat
              messageItem && messageItem.name !== undefined ?
              <div className="d-flex gap-2">
                <span className="text-dark">Usuario:</span>
                <span className="text-dark font-bold">{messageItem.name}</span>
              </div>
              : null
            }
            {
              // bots
              messageItem && messageItem.bot !== undefined ?
              <div className="d-flex gap-2">
                <span className="text-dark">Bot:</span>
                <span className="text-dark font-bold">{messageItem.bot}</span>
              </div>
              : null
            }
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setAgente_id(parseInt(e.target.value))}
              >
                <option value="0">Seleccione un agente</option>
                {
                  agentes && agentes.length > 0 ?
                  agentes.map((agente, index) => {
                      return (
                        <option key={index + 1} value={agente.id}>
                          {agente.nombre}
                        </option>
                      );
                    }): null
                }
              </select>

              <button
                className="btn btn-primary"
                onClick={() => SetTransferirChat(messageItem)}
              >
                Transferir
              </button>


          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export { CardChat };
