// react components used to create a calendar with events on it
// dependency plugin for react-big-calendar
// react component used to create alerts
// react-bootstrap components
import axios from "axios";
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Container
} from "react-bootstrap";
// import socket from "views/SocketIO";
import io from "socket.io-client";


const socket = io.connect("http://localhost:5002",{
    path: `/socket.io/socket.io.js`,
    transports: ["websocket"],
})
console.log("socket: ",socket);

moment.locale('es')

const mensajes = [
    {
        id: 1,
        mensaje: "Hola, como estas?",
        fecha: "Hace 2 minutos",
        type: "recibido"
    },
    {
        id: 2,
        mensaje: "Estoy bien, y tu?",
        fecha: "Hace 1 minutos",
        type: "enviado"
    },
    {
        id: 3,
        mensaje: "Bien, gracias por preguntar",
        fecha: "Hace 6 minutos",
        type: "recibido"
    },
    {
        id: 4,
        mensaje: "Que bueno",
        fecha: "Hace 1 minutos",
        type: "enviado"
    },
    {
        id: 5,
        mensaje: "Que bueno",
        fecha: "Hace 4 minutos",
        type: "recibido"
    },
    {
        id: 6,
        mensaje: "Que bueno",
        fecha: "Hace 3 minutos",
        type: "enviado"
    },
    {
        id: 7,
        mensaje: "Que bueno",
        fecha: "Hace 5 minutos",
        type: "recibido"
    }
]


export default function Mensajeria() {
    
    const [card_mensajes, setCard_mensajes] = useState([])
    const [conversacionActiva, setConversacionActiva] = useState([])
    const [estados, setEstados] = useState([])

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
                            mensaje: item.mensajes,
                            tipo: item.tipo,
                            // sila fecha es mayor o igual a un dia se muestra la fecha con el siguiente formato DD/MM/YYYY hh:mm a si es de hoy solo se muestra hh:mm a
                            // fecha: moment(item.updatedAt).format('hh:mm a'),
                            fecha: moment(item.updatedAt) >= moment().subtract(1, 'days') ? moment(item.updatedAt).format('hh:mm a') : moment(item.updatedAt).format('DD/MM/YYYY hh:mm a'),
                            // fecha: moment(item.updatedAt).format('DD/MM/YYYY hh:mm a'),
                            url_avatar: item.Contactos.avatar,
                            proveedor: item.channel.proveedor,
                            active: true,
                            nombreunico: item.nombreunico,
                            // si agente_id es 0 se anade en el array de etiquetas el valor Nuevo mas en el equipo que esta asignado
                            etiqueta: item.etiquetas,
                            // equipo:
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
        

            // socket.on(`response_get_conversacion_${cuenta_id}`, (data) => {
            //     console.log("response_get_conversacion_: "+cuenta_id,data);
            //     if(typeof data == 'object' && data.length > 0) {
            //         console.log("data: ",data);
            //         // se tiene que anadir el nuevo mensaje al array de mensajes al inicio
            //         const newMessages = data.map((item) => {
            //             return {
            //                 id: item.id,
            //                 conversacion_id: item.conversacion_id,
            //                 name: item.Contactos.nombre,
            //                 mensaje: item.mensajes,
            //                 tipo: item.tipo,
            //                 fecha: moment(item.updatedAt) >= moment().subtract(1, 'days') 
            //                     ? moment(item.updatedAt).format('hh:mm a') 
            //                     : moment(item.updatedAt).format('DD/MM/YYYY hh:mm a'),
            //                 url_avatar: item.Contactos.avatar,
            //                 proveedor: item.channel.proveedor,
            //                 active: true,
            //                 nombreunico: item.nombreunico,
            //                 etiqueta: item.etiquetas,
            //                 agente_id: item.agente_id,
            //             };
            //         });
            //         // newMessage lo valla al principio del array de mensajes
            //         newMessages.push(...card_mensajes)
            //         console.log("newMessages: ",newMessages);
            //         setCard_mensajes(newMessages)
            //     }
            // })
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
        localStorage.setItem("conversacion_activa", JSON.stringify({conversacion_id:item.conversacion_id, nombreunico: item.nombreunico}))
        socket.emit('get_conversacion_activa', {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: item.conversacion_id,
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
    const CompomenteMultimedis =(item)=> {
        if(item.mensajes.type === "text") {
            return (
                <pre>
                    {String(item.mensajes.text)}
                </pre>
            )
        }else if(item.mensajes.type === "image") {
            return (
                <img src={item.mensajes.url} alt="..." className="mr-3" width={250} />
            )
        }else if(item.mensajes.type === "video") {
            return (
                <video src={item.mensajes.url} alt="..." className="mr-3" />
            )
        }else if(item.mensajes.type === "file") {
            
            // preview del archivo
            return (
                <iframe src={item.mensajes.url} height="400px"></iframe>
            )

        }else if(item.mensajes.type === "audio") {
            return (
                <audio src={item.mensajes.url} alt="..." className="mr-3" />
            )
        }else{
            return null
        }
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
                    <div className="card-header d-flex gap-2 border-bottom-2 flex-wrap">
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
                                                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="..." className="avatar rounded-circle mr-3" />
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
                                                    item.mensaje.url
                                                )
                                            }</p>
                                            <div className="d-flex">
                                                <small className="mr-auto">Etiquetas:</small>
                                                {
                                                    item.etiqueta.map((item, index) => {
                                                        return (
                                                            <small key={index} className="badge badge-primary mr-2">{item}</small>
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
                    <div className="card-header d-flex border-bottom-1">
                        <h4 className="card-title">Informacion del contacto</h4>
                        <select className="form-control ml-auto" style={{
                            width: "180px"
                        }}
                        onChange={(e) => {
                            console.log("e.target.value: ",e.target.value);
                        }}
                        value={estados.estados}
                        >
                            {
                                estados.map((item, index) => {
                                    return (
                                        <option key={index} value={item.estados}>{item.estados}</option>
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
                                <textarea className="form-control" placeholder="Escribe un mensaje" style={{
                                    height: "40px"
                                }}></textarea>
                                <button type="submit" className="btn btn-primary btn-icon ml-2">
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
