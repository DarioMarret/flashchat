/* eslint-disable jsx-a11y/alt-text */
// react components used to create a calendar with events on it
// dependency plugin for react-big-calendar
// react component used to create alerts
// react-bootstrap components
import axios from "axios";
import { GetTokenDecoded } from "function/storeUsuario";
import { host, proxy } from "function/util/global";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input
} from "reactstrap";
import Swal from 'sweetalert2';
// import socket from "views/SocketIO";
import MensajeriaContext from "context/MensajeriaContext";
import Picker from "emoji-picker-react";
import { DeletManejoConversacionStorange, GetManejoConversacion, SetManejoConversacionStorange, SubirMedia, removeDatosUsuario, setDatosUsuario } from "function/storeUsuario";
import { colorPrimario, dev } from "function/util/global";
import useAuth from "hook/useAuth";
import io from "socket.io-client";
import ComponenteMultimedia from "views/Components/ComponenteMultimedia";
import ModalMensaje from "views/Components/Modales/ModalMensaje";
import InfoHistorialContacto from "./Chat/components/InfoHistorial/InfoHistorialContacto";
import TabChat from "./Chat/components/Tab";
var socket = null;
try {
  if(dev){
    socket = io.connect("http://localhost:5002", {
      path: "/socket.io/socket.io.js",
      transports: ["websocket"],
    });
  }else{
    socket = io.connect(String(host).replace(`/${proxy}/`, ""), {
      path: `/${proxy}/socket.io/socket.io.js`,
      transports: ["websocket"],
    });
  }
} catch (error) {
  console.log(error) 
}



moment.locale("es");
var cardMensage = [];
export default function Mensajeria() {
  const [ping, setPing] = useState(undefined);
  const [card_mensajes, setCard_mensajes] = useState([]);
  const [conversacionActiva, setConversacionActiva] = useState([]);
  const [ListarPlanAsignado, setListarPlanAsignado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [estados, setEstados] = useState([]);
  const [misConversaciones, setMisConversaciones] = useState('Sin leer')
  const [respuestaRapidas, setRespuestaRapidas] = useState([])
  const dummy = useRef(null);
  const [etiquetas, setEtiquetas] = useState([])
  const [showRespuesta, setShowRespuesta] = useState(false)
  const [disabledInput, setDisabledInput] = useState(false)
  const [countC, setCountC] = useState({
    sinLeer: 0,
    misConversaciones: 0,
    todas: 0,
  })

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
  })
  
  const [agentes, setAgentes] = useState([]);
  const [inputStr, setInputStr] = useState("");
  const [typeInput, setTypeInput] = useState("text");
  const [showPicker, setShowPicker] = useState(false);
  const [showMensaje, onHideMensaje] = useState(false);


  const PlanAsignado = async () => {
    const url = `${host}cuenta_plan/${GetTokenDecoded().cuenta_id}`
    const { data } = await axios.get(url)
    setListarPlanAsignado(data.data[0])
    console.log("PlanAsignado: ",data.data[0])
    // verificar si el plan asignado es el 1 osea el plan gratuito y si la fecha ya expiro
    // a la fecha es mayor a 15 dias 
    console.log("fecha fin: ",moment(data.data[0].fecha_fin))
    if(data.data[0].plan_id === 1 && moment(data.data[0].fecha) <= moment().subtract(15, 'days')){
      setDisabledInput(true)
      Swal.fire({
        title: 'Plan gratuito expirado',
        text: 'El plan gratuito ha expirado, por favor actualice su plan',
        icon: 'info',
        confirmButtonText: 'Actualizar plan',
        confirmButtonColor: colorPrimario,
        // showCancelButton: true,
        // cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/admin/suscripciones"
        }
      })
    }
  }


  const ListarEtiquetas = async () => {
    let url = host + 'etiqueta/'+GetTokenDecoded().cuenta_id
    const { data, status } = await axios.get(url)
    if(status === 200){
        setEtiquetas(data.data)
    }
  }
  
  const onEmojiClick = (emojiObject, event) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  }

  const ListarAgentes = async() => {
    const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
    const { data, status } = await axios.get(url)
    console.log(data.data)
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

  const ListarMensajesRespuestaRapida = async () => {
    try {
      const url = `${host}/mensaje_predeterminado/${GetTokenDecoded().cuenta_id}`
      const { data, status } = await axios.get(url)
      if (status === 200 && data.data !== null) {
        setRespuestaRapidas(data.data)
      }
    } catch (error) {
      return null
    }
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
    (async()=>{
      GetMisConversaciones()
      await ListarAgentes()
      await ListarMensajesRespuestaRapida()
      await ListarEtiquetas()
      await PlanAsignado()
    })()
  }, []);

  const VerConversaciones = (item) => {
    localStorage.setItem('misConversaciones', item)
    EmiittingMensaje()
    setMisConversaciones(item)
  }

  const LimpiarCounC = () => {
    setCountC({
      sinLeer: 0,
      misConversaciones: 0,
      todas: 0,
    })
  }

  const { logout } = useAuth();
  
  useEffect(() => {
    try {
      setLoading(true)
      const cuenta_id = GetTokenDecoded().cuenta_id;
      socket.emit("listar_conversacion", {
        cuenta_id: cuenta_id,
        equipo_id: null,
        agente_id: null,
        estado: null,
      });
      //listar las conversaciones y las precenta en una card con el nombre del contacto, el mensaje, el estado, la fecha y la hora
      socket.on(`response_conversacion_${cuenta_id}`, (data) => {
        const covActiva = GetManejoConversacion();
        setEquipoUsuario(GetTokenDecoded());
        let new_card = [];
        let equipos = []
        let bots = []
        if(GetTokenDecoded().equipos !== null){
          GetTokenDecoded().equipos.map((item) => {
            equipos.push(item.id)
          })
        }
        if(GetTokenDecoded().botId !== null){
          GetTokenDecoded().botId.map((item) => {
            bots.push(item.name)
          })
        }
        
        if (data.length > 0) {
          LimpiarCounC()
          for (let index = 0; index < data.length; index++) {
            const item = data[index];
            if (covActiva && covActiva !== null && covActiva !== undefined) {// verificamos si hay una conversacion activa
              if (item.conversacion_id === covActiva.conversacion_id && item.nombreunico === covActiva.nombreunico && item.Contactos.id === covActiva.Contactos.id) {
                if(item.agente_id === GetTokenDecoded().id){
                  socket.emit("get_conversacion_activa", {//si hay convresacion activa se debe obtener los mensajes de la conversacion activa
                    cuenta_id: GetTokenDecoded().cuenta_id,
                    contacto_id: item.Contactos.id,
                    equipo_id: item.equipo_id,
                    channel_id: item.channel_id,
                    agente_id: GetTokenDecoded().id,
                    conversacion_id: item.conversacion_id,
                    nombreunico: item.nombreunico,
                  })
                }else if(covActiva.sin_asignar === true){
                  socket.emit("get_conversacion_activa", {
                    cuenta_id: GetTokenDecoded().cuenta_id,
                    contacto_id: item.Contactos.id,
                    equipo_id: item.equipo_id,
                    channel_id: item.channel_id,
                    agente_id: 0,
                    conversacion_id: item.conversacion_id,
                    nombreunico: item.nombreunico,
                  })
                }
              }
            }
            if(equipos.includes(item.equipo_id) && bots.includes(item.nombre_bot)){
              new_card.push({
                id: item.id,
                bot: item.nombre_bot,
                conversacion_id: item.conversacion_id,
                name: item.Contactos.nombre,
                telefono: item.Contactos.telefono,
                Contactos: item.Contactos,
                contacto_id: item.contacto_id,
                channel_id: item.channel_id,
                mensaje: item.mensajes,
                mensajes: item.mensajes,
                equipo_id: item.equipo_id,
                tipo: item.tipo,
                estado: item.estado,
                etiquetas_estado: item.etiquetas_estado,
                fecha: moment(item.updatedAt) >= moment().subtract(1, "days") ? moment(item.updatedAt).format("hh:mm a") : moment(item.updatedAt).format("DD/MM/YYYY hh:mm a"),
                url_avatar: item.Contactos.avatar,
                proveedor: item.channel.proveedor,
                active: true,
                nombreunico: item.nombreunico,
                etiqueta: item.etiquetas,
                agente_id: item.agente_id,
                nota: item.nota,
              })
            }
          }
          cardMensage = new_card;
          if(new_card.length > 0){
            setLoading(false)
            setCard_mensajes(new_card);
            ContadorCon(new_card)
          }else{
            setLoading(false)
          }
        }else{
          setLoading(false)
          setCard_mensajes([])
          ContadorCon([])
        }
      });

      socket.on("mensaje", (msg) => {
        const { type, data } = msg;
        if (type === "update-conversacion" && data.cuenta_id === cuenta_id) {
          socket.emit("listar_conversacion", {
            cuenta_id: cuenta_id,
            equipo_id: null,
            agente_id: null,
            estado: null,
          });
        }
      });

      socket.on("cambiar_estado", (msg) => {
        const { type, data, listMensajes } = msg;
        if (type === "response_cambiar_estado" && data.cuenta_id === GetTokenDecoded().cuenta_id) {
          CambiarEstadoConversacion(data, listMensajes)
        }
      });

      socket.on("liberar_chat", (msg) => {
        const { type, data } = msg;
        if (type === "response_liberar_chat" && data.cuenta_id === GetTokenDecoded().cuenta_id) {
          LiberarChat(data)
        }
      })

      socket.on("transferir_chat", (msg) => {
        const { type, data } = msg;
        if (type === "response_transferir_chat" && data.cuenta_id === GetTokenDecoded().cuenta_id) {
          TransferirChat(data)
        }
      });

      socket.on("infoUsuario", (msg) => {
        try {
          const { type, data, agente_id } = msg;
          if (type === "recargarToken" && agente_id === GetTokenDecoded().id) {
            if(cardMensage.length > 0){
              setDatosUsuario(data)
            }
          }
        } catch (error) {
          console.log(error)
        }
      })

      socket.on("asignacion_agente", (msg) => {
        try {
          const { type, data } = msg;
          if (type === "response_asignacion_agente" && data.cuenta_id === GetTokenDecoded().cuenta_id) {
            if(cardMensage.length > 0){
              CambiodeAgente(data)
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
      // recargar navegador
      socket.on("recargar", (msg) => {
        const { type, data } = msg;
        if (type === "recargar" && data.cuenta_id === GetTokenDecoded().cuenta_id) {
          Swal.fire({
            title: 'Alerta',
            text: 'Por favor recarge el navegador o cierre sesión y vuelva a iniciar sesión',
            icon: 'info',
            confirmButtonColor: "#8F8F8F",
            timer: 2000,
          })
        }else if(type === "recargar_agente_id" && data.agente_id === GetTokenDecoded().id){
          Swal.fire({
            title: 'Alerta',
            text: 'Su cuenta se recarga por otro usuario',
            icon: 'info',
            confirmButtonColor: "#8F8F8F",
            timer: 2500,
          }).then(() => {
            window.location.reload()
          })
        }else if(type === "cerrar_session" && data.cuenta_id !== GetTokenDecoded().cuenta_id){
          Swal.fire({
            title: 'Alerta',
            text: 'La cuenta fue cerrada por otro usuario',
            icon: 'warning',
            confirmButtonColor: "#8F8F8F",
            timer: 2000,
          }).then(() => {
            logout()
            removeDatosUsuario()
            window.location.href = "/"
          })
        }
      })
    } catch (error) {
      console.log(error);
    }

    return () => {
      socket.off(`response_conversacion_${GetTokenDecoded().cuenta_id}`);
      // socket.off(`get_conversacion_activa_${GetTokenDecoded().cuenta_id}`);
      socket.off("mensaje");
      socket.off("cambiar_estado");
      socket.off("infoUsuario");
      socket.off("asignacion_agente");
      socket.off("recargar")
    }
  }, [])


  useEffect(() => {
    const cuenta_id = GetTokenDecoded().cuenta_id;
    socket.on(`get_conversacion_activa_${cuenta_id}`, (msg) => {//listamos los mensajes de la conversacion activa (la que esta siendo atendida por el agente)
      const covActiva = GetManejoConversacion();
      const { type, data, listMensajes } = msg;
      if(covActiva && covActiva !== null && covActiva !== undefined){
        if (type === "response_get_conversacion_activa" && data.cuenta_id === cuenta_id && data.conversacion_id === covActiva.conversacion_id && data.nombreunico === covActiva.nombreunico  && data.contacto_id === covActiva.contacto_id) {
          if(data.agente_id === GetTokenDecoded().id){
            if(listMensajes.length !== 0 && JSON.stringify(listMensajes) !== JSON.stringify(conversacionActiva)){
              setConversacionActiva(listMensajes)
              dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
              // antes que suene el audio se verifica si el ultimo mensaje es del cliente para que suene el audio
              if(listMensajes[listMensajes.length - 1].tipo === "ingoing"){
                // reproduccion de audio
                // let audio = new Audio(livechat);
                // audio.play();
              }
            }
          }else if(data.agente_id === 0 && covActiva.sin_asignar === true){
            if(listMensajes.length !== 0 && JSON.stringify(listMensajes) !== JSON.stringify(conversacionActiva)){
              setConversacionActiva(listMensajes)
              dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
          }
        }
      }
    })
    return () => {
      socket.off(`get_conversacion_activa_${cuenta_id}`);
    }
  }, [])


  const CambiarEstadoConversacion = (data, listMensajes) => {
    try {
      const { cuenta_id, contacto_id, conversacion_id, estado, nombreunico } = data;
      if(estado === "Eliminado" || estado === "Resuelta"){
        if(GetManejoConversacion() !== null && GetManejoConversacion().conversacion_id === conversacion_id && 
          GetManejoConversacion().nombreunico === nombreunico && GetManejoConversacion().contacto_id === contacto_id){
          DeletManejoConversacion()
          setConversacionActiva([])
        }
      }
      let card = [];
      listMensajes.map((item) => {
        card.push({
          id: item.id,
          bot: item.nombre_bot,
          conversacion_id: item.conversacion_id,
          name: item.Contactos.nombre,
          telefono: item.Contactos.telefono,
          Contactos: item.Contactos,
          contacto_id: item.contacto_id,
          channel_id: item.channel_id,
          mensaje: item.mensajes,
          mensajes: item.mensajes,
          equipo_id: item.equipo_id,
          tipo: item.tipo,
          estado: item.estado,
          etiquetas_estado: item.etiquetas_estado,
          fecha: moment(item.updatedAt) >= moment().subtract(1, "days") ? moment(item.updatedAt).format("hh:mm a") : moment(item.updatedAt).format("DD/MM/YYYY hh:mm a"),
          url_avatar: item.Contactos.avatar,
          proveedor: item.channel.proveedor,
          active: true,
          nombreunico: item.nombreunico,
          etiqueta: item.etiquetas,
          agente_id: item.agente_id,
          nota: item.nota,
        })
      })
      setCard_mensajes(card)
      ContadorCon(card)
    } catch (error) {
      alert("Error al cambiar el estado de la conversacion")
    }
  }

  // se libero el chat 
  const LiberarChat = (data) => {
    try {
      const { cuenta_id, contacto_id, conversacion_id, nombreunico } = data;
      var card = [...cardMensage];
      card.map((item) => {
        if (item.conversacion_id === conversacion_id && item.Contactos.id === contacto_id && cuenta_id === GetTokenDecoded().cuenta_id && nombreunico === item.nombreunico) {
          item.agente_id = 0;
        }
      })
      setCard_mensajes(card)
      ContadorCon(card)
    } catch (error) {
      console.log("Error al liberar el chat")
    }
  }
  // se transfirio el chat
  const TransferirChat = (data) => {
    try {
      const { cuenta_id, contacto_id, conversacion_id, agente_id } = data;
      var card = [...cardMensage];
      card.map((item) => {
        if (item.conversacion_id === conversacion_id && item.Contactos.id === contacto_id && cuenta_id === GetTokenDecoded().cuenta_id) {
          item.agente_id = agente_id;
        }
      })
      setCard_mensajes(card)
      ContadorCon(card)
    } catch (error) {
      console.log("Error al transferir el chat")
    }
  }

  //buscar la conversacion y por cuenta_id, contacto_id, conversacion_id, agente_id, y reemplazar los valores
  const CambiodeAgente = (data) => {
    try {
      const { cuenta_id, contacto_id, conversacion_id, agente_id } = data;
      var card = [...cardMensage];
      card.map((item) => {
        if (item.conversacion_id === conversacion_id && item.Contactos.id === contacto_id && cuenta_id === GetTokenDecoded().cuenta_id) {
          item.agente_id = agente_id;
        }
      })
      setCard_mensajes(card)
      // contar las conversaciones sin leer, las mis conversaciones y todas
      ContadorCon(card)
    } catch (error) {
      alert("Error al cambiar de agente")
    }
  }

  const EmiittingMensaje = () => {
    socket.emit("listar_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      equipo_id: null,
      agente_id: null,
      estado: null,
    })
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
    if(misConversaciones === 'Todas' && item.agente_id !== 0 
    && item.agente_id !== GetTokenDecoded().id){
      Swal.fire({
        title: 'Conversación en curso',
        text: 'Esta conversación ya está siendo atendida por el agente *' + NombreAgente(item.agente_id)+'*',
        html: 'Esta conversación ya está siendo atendida por el agente <b className="w-100 text-dark font-bold">' + NombreAgente(item.agente_id)+'</b>',
        icon: 'info',
        confirmButtonText: 'Tomar la conversación',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})
          GetActivaConversacion(item)
          EventoAsignacionAgente(item)
        }
      })
    }else if(item.agente_id === GetTokenDecoded().id){
      SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})
      socket.emit("get_conversacion_activa", {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: item.conversacion_id,
        equipo_id: item.equipo_id,
        channel_id: item.channel_id,
        contacto_id: item.Contactos.id,
        agente_id: GetTokenDecoded().id,
        nombreunico: item.nombreunico,
      });
    }else{
      SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})//se guarda en localstorage la conversacion activa
      socket.emit("asignacion_agente", { // se asigna el agente a la conversacion
        cuenta_id: GetTokenDecoded().cuenta_id,
        contacto_id: item.contacto_id,
        conversacion_id: item.conversacion_id,
        nombreunico: item.nombreunico,
        agente_id: GetTokenDecoded().id,
      });
      GetActivaConversacion(item)
    }
  }


  const GetActivaConversacion = async(item) => {
    socket.emit("get_conversacion_activa", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: item.conversacion_id,
      equipo_id: item.equipo_id,
      channel_id: item.channel_id,
      contacto_id: item.Contactos.id,
      agente_id: GetTokenDecoded().id,
      nombreunico: item.nombreunico,
    })
  }

  const EventoAsignacionAgente = (item) => {
    socket.emit("asignacion_agente", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      contacto_id: item.Contactos.id,
      conversacion_id: item.conversacion_id,
      nombreunico: item.nombreunico,
      agente_id: GetTokenDecoded().id,
    });
  }

  const DeletManejoConversacion = () => {
    DeletManejoConversacionStorange()
  }

  const random = () => {
    return Math.random().toString(36).substr(2);
  }

  const EnvianMensaje = (e) => {
    e.preventDefault();
    var covActiva = GetManejoConversacion()
    if (covActiva == null || covActiva.estado === "Eliminado") {
      return;
    }
    if(covActiva.agente_id === 0 && covActiva.sin_asignar === true){
      Swal.fire({
        title: 'Conversación sin asignar',
        text: 'Esta conversación no ha sido asignada a ningún agente',
        icon: 'info',
        confirmButtonText: 'Tomar la conversación',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          covActiva['agente_id'] = GetTokenDecoded().id
          SetManejoConversacionStorange(covActiva)
          EventoAsignacionAgente(covActiva)
          GetActivaConversacion(covActiva)
        }
      })
    }
    if (inputStr !== null && inputStr !== "") {
      let infoClient = {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: covActiva.conversacion_id,
        equipo_id: covActiva.equipo_id,
        channel_id: covActiva.channel_id,
        contacto_id: covActiva.Contactos.id,
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
  }

  const ActualizarEstadoConversacion = (estado) => {
    var card = [...card_mensajes];
    const covActiva = GetManejoConversacion();
    socket.emit("actualizar_estado_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: covActiva.conversacion_id,
      contacto_id: covActiva.contacto_id,
      nombreunico: covActiva.nombreunico,
      estado: estado,
      agente_id: GetTokenDecoded().id,
    });
    if(estado !== "Eliminado" || estado !== "Resuelta"){
      SetManejoConversacionStorange({...covActiva,estado: estado})
      card.map((item) => {
        if (item.conversacion_id === covActiva.conversacion_id && item.contacto_id === covActiva.contacto_id && covActiva.nombreunico === item.nombreunico) {
          item.estado = estado;
        }
      })
      setCard_mensajes(card)
    }else{
      const conV = GetManejoConversacion()
      if(conV !== null){
        console.log("se quita: ", card_mensajes)
        card = card.filter((item) => item.conversacion_id !== covActiva.conversacion_id  && item.contacto_id !== covActiva.contacto_id && covActiva.nombreunico !== item.nombreunico)
        setCard_mensajes(card)
        ContadorCon(card)
        DeletManejoConversacion()
        setConversacionActiva([])
      }
    }
  }

  const handleBusqueda = (e) => {
    // se tiene que buscar coincidencias con el nombre del contacto, numero de telefono y el mensaje
    let busqueda = e.target.value;
    let card = cardMensage;
    let new_card = [];
    if(e.target.value === ""){
      setCard_mensajes(cardMensage);
      return;
    }else{
      card.map((item) => {
        let mensaje = item.mensaje.type === "text" ? item.mensaje.text : item.mensaje.url
        if (
          item.bot.toLowerCase().includes(busqueda.toLowerCase()) || item.name.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.telefono.toLowerCase().includes(busqueda.toLowerCase()) || mensaje.toLowerCase().includes(busqueda.toLowerCase())
        ) {
          new_card.push(item);
        }
      });
      setCard_mensajes(new_card);
    }
  }

  useEffect(() => {
    ListarEstados();
  }, [])



  const [dropdownOpenTag, setDropdownOpenTag] = useState(false);
  const toggleTag = () => setDropdownOpenTag((prevState) => !prevState);


  // funcion para grabar audio
  const addAudioElement = (blob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = async () => {
      let nombre = `audio_${moment().format('YYYYMMDDHHmmss')}.ogg`;
      const url = await SubirMedia(blob, true, nombre);
      if(url !== null){
        const covActiva = GetManejoConversacion();
        if (covActiva == null || covActiva.estado === "Eliminado") {
          return;
        }
          let infoClient = {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: covActiva.conversacion_id,
            equipo_id: covActiva.equipo_id,
            channel_id: covActiva.channel_id,
            contacto_id: covActiva.Contactos.id,
            agente_id: GetTokenDecoded().id,
            updatedAt: new Date(),
            nombreunico: covActiva.nombreunico,
          };
          let mensaje = {
            id: random(),
            text: null,
            url: url,
            type: "audio",
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
    }
  }

  const ContadorCon = (card) => {
    let sinLeer = 0
    let todo = 0
    let misConversaciones = 0
    LimpiarCounC()
    card.map((item) => {
      if(item.agente_id === 0){
        sinLeer = sinLeer + 1
      }else if(item.agente_id === GetTokenDecoded().id){
        misConversaciones = misConversaciones + 1
      }
      todo = todo + 1
    })
    setCountC({...countC, sinLeer: sinLeer, misConversaciones: misConversaciones, todas: todo})
  }

  const historyInfo =()=>{
    setPing(Math.random())
  }
  const verHistorial=(item)=>{
    if(item.length>0){
      setConversacionActiva(item)
    }
  }


  const Mensajeria = useMemo(
    () => ({
      ping,
      historyInfo,
      verHistorial,
    }),
    [ping]
  )

  return (
    <MensajeriaContext.Provider value={Mensajeria}>
      <div className="d-flex box-chat box-chat-container flex-column flex-md-row px-0 py-0 position-relative"
        style={{ margin: "0px", height: '100%'}}>
        <div className="chat-list bg-chat rounded-start">
          <div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
            <div className="w-100 m-1">
              <Input
                className="input-dark text-dark bg-white"
                placeholder="Buscar chat"
                onChange={(e) => handleBusqueda(e)}
              />
            </div>
          </div>
          <TabChat
            onHideMensaje={onHideMensaje}
            countC={countC}
            card_mensajes={card_mensajes}
            loading={loading}
            VerConversaciones={VerConversaciones}
            ManejarConversacion={ManejarConversacion}
          />
        </div>

        <div className="chat-messages bg-white rounded-end">
          {/* <EmptyChat/> */}
          <div className="p-4 h-100 pt-2 pb-0">
            {/* Chat header */}
            <div
              className="row rounded bg-chat d-flex"
              style={{ minHeight: "50px" }}
            >
              <div className="col-3 col-md-4 d-flex align-items-center gap-2 px-2">
                <div className="rounded d-flex align-items-center justify-content-center position-relative">
                {GetManejoConversacion() ? (
                    <span className="position-absolute d-block status-active"></span>
                  ) : null}

                  <img
                    src={
                      GetManejoConversacion()
                        ? GetManejoConversacion().Contactos.avatar
                        : null
                    }
                    className="rounded-circle"
                    width="40px"
                    height="40px"
                  />
                </div>

                <div className="d-flex align-items-center flex-row gap-2">
                  <div className="d-block font-bold chat-title d-flex flex-column gap-1">
                    {GetManejoConversacion()
                      ? 
                      <>
                        <span>{GetManejoConversacion().Contactos.nombre}</span>
                        <span 
                          className="text-span"
                          style={{ fontSize: '12px' }}>
                            {GetManejoConversacion().Contactos.telefono}
                        </span>
                      </>
                      : "Seleccione una conversación"}
                  </div>
                </div>
              </div>

              <div className="col-9 col-md-8 d-flex justify-content-end alig-items-center">
                <div className="d-flex align-items-center gap-1">
                  <Dropdown
                    isOpen={dropdownOpenTag}
                    toggle={toggleTag}
                    direction="start"
                    className="mt-2"
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
                            <span>{item.estados}</span>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
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
                })}
                <p className="text-center mt-3" ref={dummy}></p>
              </div>
            </div>

            <div
              className="col-12 d-flex flex-wrap gap-2"
              style={{
                zIndex: "400",
                position: "absolute",
                bottom: "100px",
              }}
              >
              {/* <div className="col-12 picker-icon"> */}
                {showPicker && (
                    <Picker
                      pickerStyle={{ width: "100%" }}
                      onEmojiClick={onEmojiClick}
                    />
                )}
              {/* </div> */}
                {
                    showRespuesta ? (
                        respuestaRapidas.map((item, index) => {
                          return (
                            <span
                              key={index + 1}
                              className="col-12 rounded border text-dark px-3 bg-chat chat-text py-1 cursor-pointer w-50
                              height-50 d-flex align-items-center justify-content-start"
                              onClick={() => {
                                setInputStr(item.mensaje);
                                setShowRespuesta(false);
                              }}
                            >
                              {item.mensaje}
                            </span>
                          )
                        })
                    ): null
                  }
            </div>

            <div className="row rounded border-top d-flex d-flex flex-column flex-md-row align-items-center pt-2" style={{ minHeight: "50px" }}>
              <div className="col-9 d-flex align-items-center py-1">
                {/* se hace visible las respuesta rapidas que el usuario las puedas seleccionar  */}
                <textarea
                  className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1"
                  cols={"2"}
                  rows={"2"}
                  placeholder="Escribir ..."
                  disabled={disabledInput}
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
                    if (e.key === "/") {
                      setShowRespuesta(true);
                    }else{
                      setShowRespuesta(false);
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

                <button className="btn-chat"
                  // onClick={()=>setOpenGrande(!openGrande)}
                >
                  {/* <span class="material-symbols-outlined">mic</span> */}
                  <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }} 
                    // downloadOnSavePress={true}
                    downloadFileExtension="mp3"
                    classes={{
                      display: "none",
                    }}
                  />
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
                  <input type="file" id="cualquiercosa" name="file" 
                  // que acepte cualquier tipo de archivo menos imagen .exe
                  accept="application/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.pdf,.json"
                  style={{ display: "none" }}
                    onChange={(e) => {
                      CargarAvatar(e.target.files[0])
                    }}
                  />
                  <span class="material-symbols-outlined">attach_file</span>
                </button>

                <button className="btn-chat d-flex align-items-center justify-content-center rounded-circle" 
                  onClick={EnvianMensaje}
                  style={{
                    background: colorPrimario,
                    color: "#fff",
                  }}
                >
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Aki se cierra y abre el layout de info  -> close-box-info */}
        <InfoHistorialContacto/>
        <ModalMensaje
          showMensaje={showMensaje}
          onHideMensaje={onHideMensaje}
        />
      </div>
    </MensajeriaContext.Provider>
  );
}
