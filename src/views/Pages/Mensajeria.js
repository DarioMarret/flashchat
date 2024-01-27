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
    Container
} from "react-bootstrap";
// import socket from "views/SocketIO";
import io from "socket.io-client";


const socket = io.connect(String(host).replace(`/${proxy}/`,''),{
    path: `${proxy}/socket.io/socket.io.js`,
    transports: ["websocket"],
})
console.log("socket: ",socket);

moment.locale('es')


export default function Mensajeria() {
    
    const [card_mensajes, setCard_mensajes] = useState([])
    const [conversacionActiva, setConversacionActiva] = useState([])
    const [estados, setEstados] = useState([])
    const [newMensaje, setNewMensaje] = useState(null)
    const [convEstado, setConvEstado] = useState(null)

    useEffect(() => {
        try {
            const cuenta_id = GetTokenDecoded().cuenta_id
            socket.emit('listar_conversacion', {
                cuenta_id: cuenta_id,
                equipo_id: null,
                agente_id: null,
                estado: null,
            })
            socket.on(`response_conversacion_${cuenta_id}`, (data) => {
                let new_card = []
                const covActiva = GetManejoConversacion()
                if(data.length > 0) {
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
                            fecha: moment(item.updatedAt) >= moment().subtract(1, 'days') ? moment(item.updatedAt).format('hh:mm a') : moment(item.updatedAt).format('DD/MM/YYYY hh:mm a'),
                            url_avatar: item.Contactos.avatar,
                            proveedor: item.channel.proveedor,
                            active: true,
                            nombreunico: item.nombreunico,
                            etiqueta: item.etiquetas,
                            agente_id: item.agente_id,
                        })
                        if(covActiva) {
                            if(item.conversacion_id === covActiva.conversacion_id && item.nombreunico === covActiva.nombreunico) {
                                socket.emit('get_conversacion_activa', {
                                    cuenta_id: GetTokenDecoded().cuenta_id,
                                    conversacion_id: item.conversacion_id,
                                    nombreunico: item.nombreunico,
                                })
                            }
                        }
                    })
                    setCard_mensajes(new_card)
                }
            })
    
            socket.on('mensaje', (msg) => {
                const { type, data } = msg
                if(type === "update-conversacion" && data.cuenta_id === cuenta_id) {
                    new Promise((resolve, reject) => {
                        socket.emit('listar_conversacion', {
                            cuenta_id: cuenta_id,
                            equipo_id: null,
                            agente_id: null,
                            estado: null,
                        })
                        resolve()
                    })
                    // console.log("data: ",data);
                    // var exit = false
                    // let con = card_mensajes.map((item) => {
                    //     if(item.conversacion_id === data.conversacion_id && item.nombreunico === data.nombreunico) {
                    //         console.log("si esta el id_conversacion: ",{
                    //             ...item,
                    //             mensaje: data.mensajes,
                    //         });
                    //         exit = true
                    //         return {
                    //             ...item,
                    //             mensaje: data.mensajes,
                    //         }
                    //     }else{
                    //         return item
                    //     }
                    // })
                    // console.log("exit: ",exit);
                    // if(!exit) {
                    //     socket.emit('get_conversacion', {
                    //         cuenta_id: cuenta_id,
                    //         conversacion_id: data.conversacion_id,
                    //         nombreunico: data.nombreunico,
                    //     })
                    //     exit = false
                    // }else{
                    //     setCard_mensajes(con)
                    // }
                }
            })

            socket.on(`get_conversacion_activa_${cuenta_id}`, (msg) => {
                const { type, data, listMensajes } = msg
                if(type === "response_get_conversacion_activa" && data.cuenta_id === cuenta_id && data.conversacion_id === JSON.parse(localStorage.getItem("conversacion_activa")).conversacion_id && data.nombreunico === JSON.parse(localStorage.getItem("conversacion_activa")).nombreunico) {
                    setConversacionActiva(listMensajes)
                    console.log("listMensajes: ",listMensajes);
                }
            })
        
        } catch (error) {
            console.log(error);
        }
        return () => { socket.off() }
    },[socket])

    const ListarEstados = async() => {
        const url = `${host}estados`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setEstados(data.data)
        }
    }

    const ManejarConversacion = (item) => {
        console.log("item: ",item);
        localStorage.setItem("conversacion_activa", JSON.stringify({
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id:item.conversacion_id,
            nombreunico: item.nombreunico,
            equipo_id: item.equipo_id,
            channel_id: item.channel_id,
            contacto_id: item.contacto_id,
            estado: item.estado,
            Contacto: item.Contactos,
        }))
        setConvEstado(item.estado)
        socket.emit('get_conversacion_activa', {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: item.conversacion_id,
            equipo_id: item.equipo_id,
            channel_id: item.channel_id,
            contacto_id: item.contacto_id,
            agente_id: GetTokenDecoded().id,
            nombreunico: item.nombreunico,
        })
    }

    const GetManejoConversacion = () => {
        const local = localStorage.getItem("conversacion_activa")
        if(local) {
            return JSON.parse(local)
        }else{
            return null
        }
    }

    const random = () => {
        return Math.random().toString(36).substr(2);
    }

    const EnvianMensaje = (e) => {
        e.preventDefault()
        console.log("newMensaje: ",newMensaje);
        const covActiva = GetManejoConversacion()
        if(covActiva == null || covActiva.estado === 'Eliminado'){
            alert("Seleccione una conversacion")
            return
        }
        if(newMensaje !== null || newMensaje !== "") {

            console.log("e.target.value: ",newMensaje);
            let infoClient = {
                cuenta_id: GetTokenDecoded().cuenta_id,
                conversacion_id: covActiva.conversacion_id,
                equipo_id: covActiva.equipo_id,
                channel_id: covActiva.channel_id,
                contacto_id: covActiva.contacto_id,
                agente_id: GetTokenDecoded().id,
                nombreunico: covActiva.nombreunico,
            }
            let mensaje = {
                id: random(),
                text: newMensaje,
                type: "text",
            }
            socket.emit('enviando_mensajes', {
                infoClient: infoClient,
                mensaje: mensaje,
            })
            setNewMensaje("")
        }
    }

    const CompomenteMultimedis =(item)=> {
        if(item.mensajes.type === "text") {
            return (
                <pre data-id={item.mensajes.id || null} className="">
                    {String(item.mensajes.text)}
                </pre>
            )
        }else if(item.mensajes.type === "image") {
            return (
                <img src={item.mensajes.url} alt="..." className="mr-3" width={250} data-id={item.mensajes.id || null} />
            )
        }else if(item.mensajes.type === "video") {
            return (
                <video src={item.mensajes.url} alt="..." className="mr-3" data-id={item.mensajes.id || null} />
            )
        }else if(item.mensajes.type === "file") {
            
            // preview del archivo
            return (
                <iframe src={item.mensajes.url} height="400px" data-id={item.mensajes.id || null}></iframe>
            )

        }else if(item.mensajes.type == "audio") {
            console.log("item.mensajes.url: ",item.mensajes.url);
            return (
                <audio controls>
                    <source src={item.mensajes.url} type="audio/ogg" />
                </audio>
            )
        }else{
            return null
        }
    }

    const ActualizarEstadoConversacion = (e) => {
        const covActiva = GetManejoConversacion()
        socket.emit('actualizar_estado_conversacion', {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: covActiva.conversacion_id,
            nombreunico: covActiva.nombreunico,
            estado: e.target.value,
        })
        // actualizamos el estado en localstorage
        localStorage.setItem("conversacion_activa", JSON.stringify({
            ...covActiva,
            estado: e.target.value,
        }))
        setConvEstado(e.target.value)
        setTimeout(() => {
            socket.emit('listar_conversacion', {
                cuenta_id: GetTokenDecoded().cuenta_id,
                equipo_id: null,
                agente_id: null,
                estado: null,
            })
        }, 900);
    }
    
    useEffect(() => {
        ListarEstados()
    }, [])
    
  return (
    <>
        <Container fluid>
        <div className="d-flex">
            <div className="w-25">
                <div className="card"
                    style={{
                        marginBottom: "0px !important"
                    }}
                >
                    {/* hacer qie cuando este en md el select valla abajo  */}
                    <div className="d-flex gap-2 border border-bottom-2 p-2 flex-wrap">
                        <h5 className="card-title m-md-1">Conversaciones</h5>
                        <select className="form-control " style={{
                            width: "180px"
                        }}>
                            <option value="1">Mis Conversaciones</option>
                            <option value="2">Sin leer</option>
                        </select>
                    </div>
                    <div className="card-body">
                        <div className="list-group overflow-auto" style={{
                            height: "calc(100vh - 200px)"
                        }} id="style-1">
                            {
                                card_mensajes.map((item, index) => {
                                    return (
                                        <a key={index} href="#" className="list-group-item list-group-item-action" onClick={()=>ManejarConversacion(item)} >
                                            <small
                                                className="float-right"
                                                style={{
                                                    color: "#999"
                                                }}
                                            >{item.proveedor}</small>
                                            <div className="d-flex w-100 justify-content-between">
                                                {
                                                    item.url_avatar == null || item.url_avatar == "" ? (
                                                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="..." className="avatar rounded-circle mr-3" width={50} />
                                                    ) : (
                                                        <img src={item.url_avatar} alt="..." className="avatar rounded-circle mr-3" width={50} />
                                                    )
                                                }
                                                <h5 className="mb-1 text-truncate" style={{maxWidth: "150px"}}>{item.name}</h5>
                                                <small>{item.fecha}</small>
                                            </div>
                                            <p className="mb-1 text-truncate" >{
                                                item.mensaje.type === "text" ? (
                                                    String(item.mensaje.text)
                                                ) : (
                                                    <img src={item.mensaje.url} alt="..." className="mr-3" width={20} />
                                                )
                                            }</p>
                                            <div className="d-flex">
                                                {
                                                    item.etiqueta.map((item, index) => {
                                                        return (
                                                            <small key={index} className="badge bg-primary mx-1">
                                                                {item}</small>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-75">
                <div className="card"
                    style={{
                        marginBottom: "0px !important"
                    }}
                >
                    <div className=" d-flex justify-content-between border border-bottom-2 p-2" >
                        <h4 className="card-title">{
                            GetManejoConversacion() == null ? (
                                "Seleccione una conversacion"
                            ) : (
                                <>
                                    <img src={GetManejoConversacion().Contacto.avatar} alt="..." className="avatar rounded-circle mr-3" width={50} />
                                    {" "+ GetManejoConversacion().Contacto.nombre + " "}
                                    <a href="#" className="btn btn-primary btn-icon btn-round float-right">
                                        <i className="fa fa-phone"></i>
                                        {GetManejoConversacion().Contacto.telefono}
                                    </a>
                                </>
                            )
                        }</h4>
                        <select className="form-control ml-auto" style={{
                            width: "180px",
                            background: convEstado === "Abierto" ? "#28a745" : convEstado === "Eliminado" ? "#dc3545" : convEstado === "Resuelta" ? "#ffc107" : "#17a2b8",
                        }}
                        onChange={(e) => {
                            ActualizarEstadoConversacion(e)
                        }}
                        value={convEstado}
                        >
                            {
                                estados.map((item, index) => {
                                    return(
                                        <option key={index} value={item.estados} 
                                        // selected={convEstado === item.estados ? true : false}
                                        >{item.estados}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="card-body">
                        <div className="list-group overflow-auto" style={{
                            height: "calc(100vh - 245px)"
                        }} id="style-1">
                            {
                                conversacionActiva.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {
                                            //"outgoing"
                                                item.tipo === "ingoing" ? (
                                                    <div className="chat-message
                                                    bg-light text-dark border p-3 m-1
                                                    shadow rounded-lg"
                                                        style={{
                                                            width: "fit-content",
                                                            minWidth: "fit-content",
                                                            maxWidth: "50%",
                                                            borderRadius: "10px 0px 10px 10px",
                                                            wordWrap: "break-word",
                                                        }}
                                                    >
                                                        <p className="mb-0 lg:text-sm"> {CompomenteMultimedis(item)} </p>
                                                        <small className="float-left"
                                                        >{moment(item.updatedAt) >= moment().subtract(1, 'days') ? moment(item.updatedAt).format('hh:mm a') : moment(item.updatedAt).format('DD/MM/YYYY hh:mm a')}</small>
                                                    </div>
                                                ) : (
                                                    <div className="chat-message 
                                                    float-right bg-primary text-white 
                                                    shadow rounded-lg p-3 ml-auto w-auto m-1"
                                                        style={{
                                                            float: "right",
                                                            width: "fit-content",
                                                            minWidth: "fit-content",
                                                            maxWidth: "50%",
                                                            borderRadius: "0px 10px 10px 10px",
                                                            wordWrap: "break-word",
                                                        }}
                                                    >
                                                        <p className="mb-0 lg:text-sm"> {CompomenteMultimedis(item)} </p>
                                                        <small className="float-right"
                                                        >{moment(item.updatedAt) >= moment().subtract(1, 'days') ? moment(item.updatedAt).format('hh:mm a') : moment(item.updatedAt).format('DD/MM/YYYY hh:mm a')}</small>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="chat-footer">
                            <form className="d-flex">
                            <button type="submit" className="btn btn-primary btn-icon ml-2 mx-2">
                                <i className="fa fa-paperclip"></i>
                            </button>
                                <textarea className="form-control" placeholder="Escribe un mensaje"
                                value={newMensaje}
                                onChange={(e) => setNewMensaje(e.target.value)}
                                style={{
                                    height: "50px"
                                }}></textarea>
                                <button type="submit" className="btn btn-primary btn-icon ml-2"
                                    onClick={(e) => EnvianMensaje(e)}
                                >
                                    <i className="fa fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Container>
    </>
  )
}
