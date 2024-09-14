/* eslint-disable jsx-a11y/alt-text */
// react components used to create a calendar with events on it
// dependency plugin for react-big-calendar
// react component used to create alerts
// react-bootstrap components
import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import Swal from 'sweetalert2';
// import socket from "views/SocketIO";
import MensajeriaContext from "context/MensajeriaContext";
import Picker from "emoji-picker-react";
import { DeletManejoConversacionStorange, GetManejoConversacion, SetManejoConversacionStorange, SubirMedia, removeDatosUsuario } from "function/storeUsuario";
import { colorPrimario } from "function/util/global";
import useAuth from "hook/useAuth";
import { useDispatch, useSelector } from 'react-redux';
import ComponenteMultimedia from "views/Components/ComponenteMultimedia";
import ModalMensaje from "views/Components/Modales/ModalMensaje";
import socket from "views/SocketIO";
import { addAgente } from "../../../redux/Agentes/agente.servicio";
import { fetchMensajeriaCard } from '../../../redux/Mensajeria/mensajeria.servicio';
import CardTab from "./components/CardTab/CardTab";
import InfoHistorialContacto from "./components/InfoContacto/InfoHistorialContacto";
import { EmiittingMensaje, EmittMesnaje, EventoAsignacionAgente, GetActivaConversacion, random } from "./service/Eventos";

moment.locale("es");
var cardMensage = [];
export default function Mensajeria() {
  const dispatch = useDispatch();
  const { mensaje_card, verConversacion, historial, pingMensaje } = useSelector(state => state.mensajeria);
  const [pingNuevoMensaje, setPingNuevoMensaje] = useState(false);
  const [ping, setPing] = useState(undefined);
  const [card_mensajes, setCard_mensajes] = useState(mensaje_card);
  const [conversacionActiva, setConversacionActiva] = useState([]);
  const [loading, setLoading] = useState(false)
  const [estados, setEstados] = useState([]);
  const [respuestaRapidas, setRespuestaRapidas] = useState([])
  const dummy = useRef(null);
  const audioRef = useRef(null);
  const [showRespuesta, setShowRespuesta] = useState(false)
  const [disabledInput, setDisabledInput] = useState(false)
  const [inputStr, setInputStr] = useState("");
  const [linkPreview, setLinkPreview] = useState("");
  const [typeInput, setTypeInput] = useState("text");
  const [showPicker, setShowPicker] = useState(false);
  const [showMensaje, onHideMensaje] = useState(false);


  const PlanAsignado = async () => {
    const { data } = await BmHttp().get(`cuenta_plan/${GetTokenDecoded().cuenta_id}`)
    // verificar si el plan asignado es el 1 osea el plan gratuito y si la fecha ya expiro
    // a la fecha es mayor a 15 dias 
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

  const onEmojiClick = (emojiObject, event) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
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
      mensaje: covActiva.mensaje,
    });
    if(estado !== "Eliminado" && estado !== "Resuelta"){
      SetManejoConversacionStorange({...covActiva,estado: estado})
      card.map((item) => {
        if (item.conversacion_id === covActiva.conversacion_id && item.contacto_id === covActiva.contacto_id && covActiva.nombreunico === item.nombreunico) {
          item.estado = estado;
        }
      })
      setCard_mensajes(card)
      dispatch(fetchMensajeriaCard())
    }else{
      if(covActiva && covActiva !== null && covActiva !== undefined){
        dispatch({ type: 'REMOVER_MENSAJE_CARD', payload: covActiva });
        dispatch({ type: 'RESET_PING_MENSAJE' });
        setPingNuevoMensaje(Math.random())
        DeletManejoConversacion()
        setConversacionActiva([])
        historyInfo()
      }
    }
  }

  // Despacha la acción para obtener los mensajes
  useEffect(() => {
    dispatch(fetchMensajeriaCard());
    dispatch(addAgente());
  }, [dispatch]);

  // Pre-cargar el audio
  useEffect(() => {
    const audioSrc = GetTokenDecoded().audio_mensaje || 'https://codigomarret.online/upload/img/intercom-in-83962.mp3';
    audioRef.current = new Audio(audioSrc);
  }, []);

  useEffect(() => {
    // Expresión regular para detectar enlaces
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = inputStr.match(urlRegex);
    if (foundLinks && foundLinks.length > 0) {
      setLinkPreview(foundLinks[0]);
    } else {
      setLinkPreview("");
    }
  }, [inputStr]);


  const ListarMensajesRespuestaRapida = async () => {
    try {
      const { data, status } = await BmHttp().get(`mensaje_predeterminado/${GetTokenDecoded().cuenta_id}`)
      if (status === 200 && data.data !== null) {
        setRespuestaRapidas(data.data)
      }
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    (async()=>{
      await ListarMensajesRespuestaRapida()
      await PlanAsignado()
    })()
  }, []);

  const VerConversaciones = (item) => {
    localStorage.setItem('misConversaciones', item)
    EmiittingMensaje()
    dispatch({ type: 'VER_CONVERSACION', payload: Math.random() });
  }

  const { logout } = useAuth();
  
  // Eventod que de las cards de los mensajes
  useEffect(() => {
    if (mensaje_card.length > 0) {
      setLoading(true);
      const covActiva = GetManejoConversacion();
      let new_card = [];
  
      mensaje_card.forEach((item) => {
        if (covActiva && item.conversacion_id === covActiva.conversacion_id &&
            item.nombreunico === covActiva.nombreunico && item.Contactos.id === covActiva.Contactos.id) {
  
          const isActiveAgent = item.agente_id === GetTokenDecoded().id;
  
          socket.emit("get_conversacion_activa", {
            cuenta_id: GetTokenDecoded().cuenta_id,
            contacto_id: item.Contactos.id,
            equipo_id: item.equipo_id,
            channel_id: item.channel_id,
            agente_id: isActiveAgent ? GetTokenDecoded().id : item.agente_id,
            conversacion_id: item.conversacion_id,
            nombreunico: item.nombreunico,
          });
        }
  
        // Construir new_card con datos relevantes
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
          equipo_id: item.equipo_id,
          tipo: item.tipo,
          estado: item.estado,
          etiquetas_estado: item.etiquetas_estado,
          fecha: moment(item.updatedAt).isAfter(moment().subtract(1, "days"))
                  ? moment(item.updatedAt).format("hh:mm a")
                  : moment(item.updatedAt).format("DD/MM/YYYY hh:mm a"),
          url_avatar: item.Contactos.avatar.includes("https://pps.whatsapp.net/") 
                      ? 'https://codigomarret.online/upload/img/avatarwhatsapp-fotor-2024021116415.png'
                      : item.Contactos.avatar,
          proveedor: item.channel.proveedor,
          leido: item.leido,
          alerta: item.alerta,
          active: true,
          nombreunico: item.nombreunico,
          etiqueta: item.etiquetas,
          agente_id: item.agente_id,
          nota: item.nota,
          sessionIdWebChat: item.sessionIdWebChat,
        });
      });
  
      cardMensage = new_card;
  
      if (new_card.length > 0) {
        new_card.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setLoading(false);
        setCard_mensajes(new_card);
      } else {
        setLoading(false);
        setCard_mensajes([]);
      }
    } else {
      setLoading(false);
      setCard_mensajes([]);
    }
  }, [mensaje_card, pingMensaje, verConversacion, pingNuevoMensaje]);

  // recibe un nuevo mensaje card
  useEffect(() => {
    if (socket) {
      try {
        const cuenta_id = GetTokenDecoded().cuenta_id;
        const handleMensaje = (msg) => {
          const { type, data } = msg;
          if (data && data.cuenta_id === cuenta_id) {
            if (type === "mensaje_card" && data.mensaje.length > 0) {
              dispatch({ type: 'NEW_MENSAJE_OR_REMPLAZAR_MENSAJE_CARD', payload: data.mensaje });
            } else if (type === "finaliza-conversacion") {
              dispatch({ type: 'REMOVER_MENSAJE_CARD', payload: data });
            } else if (type === "mensaje_array_card" && data.card) {
              dispatch({ type: 'SET_CARD_MENSAJERIA', payload: data.card });
            }
            dispatch({ type: 'RESET_PING_MENSAJE' });
            setPingNuevoMensaje(Math.random());
          }
        };
  
        // Establecer el listener de eventos
        socket.on(`mensaje_${cuenta_id}`, handleMensaje);
        // Limpieza de listeners
        return () => {
          socket.off(`mensaje_${cuenta_id}`, handleMensaje);
        };
  
      } catch (error) {
        console.log(error);
      }
    }
  }, [socket]);

  // Escuchar los eventos de los mensajes
  useEffect(() => {
    if (socket) {
      const cuentaId = GetTokenDecoded().cuenta_id;
      const usuarioId = GetTokenDecoded().id;
  
      const handleCambiarEstado = (msg) => {
        const { type, data, listMensajes } = msg;
        if (type === "response_cambiar_estado" && data.cuenta_id === cuentaId) {
          dispatch({ type: 'SET_CARD_MENSAJERIA', payload: listMensajes });
          dispatch({ type: 'RESET_PING_MENSAJE' });
          setPingNuevoMensaje(Math.random());
        }
      };
  
      const handleLiberarChat = (msg) => {
        const { type, data, card } = msg;
        if (type === "response_liberar_chat" && data.cuenta_id === cuentaId) {
          dispatch({ type: 'SET_CARD_MENSAJERIA', payload: card });
          dispatch({ type: 'RESET_PING_MENSAJE' });
          setPingNuevoMensaje(Math.random());
        }
      };
  
      const handleTransferirChat = (msg) => {
        console.log("Transferir chat: ", msg)
        const { type, data, card } = msg;
        if (type === "response_transferir_chat" && data.cuenta_id === cuentaId) {
          dispatch({ type: 'SET_CARD_MENSAJERIA', payload: card });
          dispatch({ type: 'RESET_PING_MENSAJE' });
          setPingNuevoMensaje(Math.random());
        }
      };
  
      const handleAsignacionAgente = (msg) => {
        try {
          const { type, data } = msg;
          if (type === "response_asignacion_agente" && data.cuenta_id === cuentaId) {
            if(cardMensage.length > 0){
              CambiodeAgente(data);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      const handleRecargar = (msg) => {
        const { type, data } = msg;
        if (type === "recargar" && data.cuenta_id === cuentaId) {
          Swal.fire({
            title: 'Alerta',
            text: 'Por favor recarge el navegador o cierre sesión y vuelva a iniciar sesión',
            icon: 'info',
            confirmButtonColor: "#8F8F8F",
            timer: 2000,
          });
        } else if (type === "recargar_agente_id" && data.agente_id === usuarioId) {
          Swal.fire({
            title: 'Alerta',
            text: 'Su cuenta se recarga por otro usuario',
            icon: 'info',
            confirmButtonColor: "#8F8F8F",
            timer: 2500,
          }).then(() => {
            window.location.reload();
          });
        } else if (type === "cerrar_session" && data.cuenta_id !== cuentaId) {
          Swal.fire({
            title: 'Alerta',
            text: 'La cuenta fue cerrada por otro usuario',
            icon: 'warning',
            confirmButtonColor: "#8F8F8F",
            timer: 2000,
          }).then(() => {
            logout();
            removeDatosUsuario();
            window.location.href = "/";
          });
        }
      };
  
      // Setting up the listeners
      socket.on(`cambiar_estado_${cuentaId}`, handleCambiarEstado);
      socket.on(`liberar_chat_${cuentaId}`, handleLiberarChat);
      socket.on(`transferir_chat_${cuentaId}`, handleTransferirChat);
      // socket.on(`infoUsuario_${cuentaId}`, handleInfoUsuario);
      socket.on(`asignacion_agente_${cuentaId}`, handleAsignacionAgente);
      socket.on(`recargar_${cuentaId}`, handleRecargar);
  
      // Cleanup
      return () => {
        socket.off(`cambiar_estado_${cuentaId}`, handleCambiarEstado);
        socket.off(`liberar_chat_${cuentaId}`, handleLiberarChat);
        socket.off(`transferir_chat_${cuentaId}`, handleTransferirChat);
        // socket.off(`infoUsuario_${cuentaId}`, handleInfoUsuario);
        socket.off(`asignacion_agente_${cuentaId}`, handleAsignacionAgente);
        socket.off(`recargar_${cuentaId}`, handleRecargar);
      };
    }
  }, [socket]);
  

  // para escuchar los mensajes de la conversacion activa
  useEffect(() => {
    if (socket) {
      const { cuenta_id } = GetTokenDecoded();
  
      const handleConversacionActiva = (msg) => {
        const covActiva = GetManejoConversacion();
        const { type, data, listMensajes } = msg;
  
        if (covActiva && listMensajes.length > 0) {
          if (
            type === "response_get_conversacion_activa" &&
            data.cuenta_id === cuenta_id &&
            data.conversacion_id === covActiva.conversacion_id &&
            data.nombreunico === covActiva.nombreunico &&
            data.contacto_id === covActiva.contacto_id
          ) {
            if (historial.length === 0 && data.agente_id === GetTokenDecoded().id) {
              socket.emit('mensaje_leido', {
                id: listMensajes[listMensajes.length - 1].id,
                cuenta_id: cuenta_id,
                contacto_id: listMensajes[listMensajes.length - 1].contacto_id,
                conversacion_id: listMensajes[listMensajes.length - 1].conversacion_id,
                nombreunico: listMensajes[listMensajes.length - 1].nombreunico,
              });
              if (listMensajes.length !== 0 && JSON.stringify(listMensajes) !== JSON.stringify(conversacionActiva)) {
                setConversacionActiva(listMensajes);
                if (GetTokenDecoded().ver_ultimo_mensaje) {
                  dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }
                if (listMensajes[listMensajes.length - 1].tipo === "ingoing" && listMensajes[listMensajes.length - 1].leido === false) {
                  if (GetTokenDecoded().mensaje_notificacion) {
                    const notification = new Notification('Nuevo mensaje', {
                      body: listMensajes[listMensajes.length - 1].mensajes.type === 'text' ? listMensajes[listMensajes.length - 1].mensajes.text : listMensajes[listMensajes.length - 1].mensajes.type,
                      icon: listMensajes[listMensajes.length - 1].Contactos.avatar,
                    });
  
                    notification.onclick = function(event) {
                      event.preventDefault();
                      OpenConversacion(listMensajes[listMensajes.length - 1]);
                      window.focus();
                    };
  
                    audioRef.current.play().catch(error => {
                      console.log('Error al reproducir el audio:', error);
                    });
                  }
                }
                if (listMensajes[listMensajes.length - 1].tipo !== "ingoing") {
                  dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }
              }
            } else if (historial.length === 0 && covActiva.sin_asignar === true && covActiva.agente_id === data.agente_id) {
              if (listMensajes.length !== 0 && JSON.stringify(listMensajes) !== JSON.stringify(conversacionActiva)) {
                setConversacionActiva(listMensajes);
                if (GetTokenDecoded().ver_ultimo_mensaje) {
                  dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }
              }
            }
          }
        }
      };
  
      socket.on(`get_conversacion_activa_${cuenta_id}`, handleConversacionActiva);
  
      return () => {
        socket.off(`get_conversacion_activa_${cuenta_id}`, handleConversacionActiva);
      };
    }
  }, [socket]);
  

  const OpenConversacion = (item) => {
    // redireccionar a la conversacion activa
    console.log("Realizar la redireccion a la conversacion activa")
  }

  //buscar la conversacion y por cuenta_id, contacto_id, conversacion_id, agente_id, y reemplazar los valores
  const CambiodeAgente = (data) => {
    try {
      const CuentaId = GetTokenDecoded().cuenta_id;
      const { cuenta_id, contacto_id, conversacion_id, agente_id } = data;
      const updatedCards = cardMensage.map((item) => {
        if (item.conversacion_id === conversacion_id && item.Contactos.id === contacto_id && cuenta_id === CuentaId) {
          return {
            ...item,
            agente_id: agente_id,
          };
        }
        return item;
      });
  
      setCard_mensajes(updatedCards);
      dispatch({ type: 'SET_CARD_MENSAJERIA', payload: updatedCards });
    } catch (error) {
      console.log(error);
    }
  }

  const ListarEstados = async () => {
    const url = `estados`;
    const { data, status } = await BmHttp().get(url);
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

  const DeletManejoConversacion = () => {
    DeletManejoConversacionStorange()
  }

  const EnvianMensaje = (e) => {
    e.preventDefault();
    var covActiva = GetManejoConversacion()
    if (covActiva == null || covActiva.estado === "Eliminado") {
      return;
    }
    console.log("covActiva: ", covActiva)
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
          // esperar 300 milesegundo y enviar el mensaje 
          setTimeout(()=>EnviarMensajeSocket(), 350)
          
        }
      })
    }else if(covActiva.agente_id !== GetTokenDecoded().id){
      Swal.fire({
        title: 'Conversación asignada',
        text: 'Esta conversación ha sido asignada a otro agente',
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
          setTimeout(()=>EnviarMensajeSocket(), 350)
        }
      })
    }else{
      EnviarMensajeSocket()
    }
  }

  const EnviarMensajeSocket = ()=>{
    var covActiva = GetManejoConversacion()
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
        chat_id: covActiva.mensaje.chat_id,
        sessionId: covActiva.sessionIdWebChat
      };
      EmittMesnaje(infoClient, mensaje);
      setInputStr("");
      setTypeInput("text");
      EmiittingMensaje();
      GetActivaConversacion(covActiva)
      dummy.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }

  const handleBusqueda = (e) => {
    const busqueda = e.target.value.toLowerCase();
    let new_card = [];
  
    if (busqueda === "") {
      setCard_mensajes(cardMensage);
      return;
    }
  
    new_card = cardMensage.filter((item) => {
      let mensaje = item.mensaje.type === "text" ? item.mensaje.text : item.mensaje.url;
      return (
        item.bot.toLowerCase().includes(busqueda) ||
        item.name.toLowerCase().includes(busqueda) ||
        item.telefono.toLowerCase().includes(busqueda) ||
        mensaje.toLowerCase().includes(busqueda) ||
        // en las etiquetas_estado es un array de objetos con el key etiquetas
        item.etiquetas_estado.some((etiqueta) => etiqueta.etiquetas.toLowerCase().includes(busqueda))
      );
    });
    setCard_mensajes(new_card);
  };
  

  useEffect(() => {
    ListarEstados();
    if ('Notification' in window) {
      Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
              console.log('Permiso de notificación concedido');
          } else {
              console.log('Permiso de notificación denegado');
          }
      });
    } else {
      console.log('Las notificaciones no son soportadas por este navegador');
    }
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
            chat_id: covActiva.mensaje.chat_id,
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

        {/* Los tab */}
        <CardTab
          onHideMensaje={onHideMensaje}
          card_mensajes={card_mensajes}
          loading={loading}
          VerConversaciones={VerConversaciones}
          // ManejarConversacion={ManejarConversacion}
          handleBusqueda={handleBusqueda}
        />

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
                      <span className="material-symbols-outlined text-dark">
                        more
                      </span>
                    </DropdownToggle>

                    <DropdownMenu>
                      {estados.map((item, index) => {
                        return (
                          <DropdownItem key={index} className="d-flex align-items-center gap-2" onClick={()=>ActualizarEstadoConversacion(item.estados)} >
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
                {
                  historial.length > 0 ? (
                    historial.map((item, index) => {
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
                                    : moment(item.createdAt).format("DD/MM/YYYY hh:mm a")}
                                </small>
                              </section>
                            </div>
                          </div>
                        );
                      }
                    })):
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
                              className="col-12 rounded border text-dark px-3 py-1 cursor-pointer w-50
                              d-flex align-items-center justify-content-start"
                              style={{
                                overflow: "auto",
                                height: "auto",
                                fontSize: "13px",
                                cursor: "pointer",
                                background: "#f5f5f5",
                              }}
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

            {/* el imput de enviar mensaje */}
            <div className="row rounded border-top d-flex d-flex flex-column flex-md-row align-items-center pt-2" style={{ minHeight: "50px" }}>
              <div className="col-9 d-flex align-items-center py-1">
                {/* se hace visible las respuesta rapidas que el usuario las puedas seleccionar  */}
                <textarea
                  className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1"
                  cols={"3"}
                  rows={"3"}
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
                <button
                  className="btn-chat"
                  onClick={() => setShowPicker((val) => !val)}
                >
                  <span className="material-symbols-outlined">mood</span>
                </button>

                <button className="btn-chat"
                  // onClick={()=>setOpenGrande(!openGrande)}
                >
                  {/* <span className="material-symbols-outlined">mic</span> */}
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
