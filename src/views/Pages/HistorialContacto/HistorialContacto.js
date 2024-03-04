import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import {
    Card,
    Col,
    Container
} from 'reactstrap';

function HistorialContacto(props) {

    const [agentes, setAgentes] = useState([])
    const [equipos, setEquipos] = useState([])
    const dummy = useRef();
    const [bots, setBots] = useState([])
    const [contactos, setContactos] = useState(null)
    const [cardMensaje, setCardMensaje] = useState([])
    const [conversacionHistorial, setConversacionHistorial] = useState([])

    const ListarAgentes = async () => {
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
        } else {
            setAgentes([])
        }
    }

    const ListarEquipos = async () => {
        let url = host + 'equipo/' + GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setEquipos(data.data)
        }
    }

    const ListarBots = async () => {
        const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setBots(data.data);
        }
    };

    const ObtenerContactos = async () => {
        let id = window.location.pathname.split('/')[3]
        const url = `${host}contacto/${id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setContactos(data.data[0])
        }
    }

    const OntenerConversacion = async (items) => {
        const { data, status } = await axios.post(`${host}conversacion_activa`, {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: items.conversacion_id,
            equipo_id: items.equipo_id,
            channel_id: items.channel_id,
            contacto_id: items.contacto_id,
            agente_id: items.agente_id,
            nombreunico: items.nombreunico,
        })
        setConversacionHistorial(data)
    }

    const ListarCardContacto = async () => {
        let id = window.location.pathname.split('/')[3]
        const url = `${host}conversacion_card_contacto`
        const { data, status } = await axios.post(url, {
            contacto_id: id,
            cuenta_id: GetTokenDecoded().cuenta_id
        })
        if (status === 200) {
            if (data.length > 0) {
                setCardMensaje(data)
            }
        }
    }

    const NombreAgente = (id) => {
        let nombre = agentes.filter((item) => item.id === id)
        if (nombre.length > 0) {
            return nombre[0].nombre
        } else {
            return "Sin agente"
        }
    }

    const Conexion = (id) => {
        let nombre = bots.filter((item) => item.channel_id === id)
        if (nombre.length > 0) {
            return nombre[0].nombre_bot
        } else {
            return "Sin conexion"
        }
    }

    const CompomenteMultimedis = (item) => {
        if (item === null || item === undefined) {
            return null;
        }
        if (item.type === "text") {
            return <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} >{String(item.text)}</span>;
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
            return (
                <video controls width={250}>
                    <source src={item.url} type="video/mp4" />
                </video>
            )
        } else if (item.type === "contact") {
            return <span className="">{String(item.text)}</span>;
        } else if (item.type === "file") {
            // preview del archivo
            if (item.url.split('.').pop() === 'xlsx' || item.url.split('.').pop() === 'xls') {
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
            } else if (item.url.split('.').pop() === 'json' || item.url.split('.').pop() === 'exe' || item.url.split('.').pop() === 'docx' || item.url.split('.').pop() === 'doc' || item.url.split('.').pop() === 'pptx' || item.url.split('.').pop() === 'ppt' || item.url.split('.').pop() === 'txt' || item.url.split('.').pop() === 'zip' || item.url.split('.').pop() === 'rar') {
                return (
                    <div className="d-flex gap-2">
                        <span class="material-symbols-outlined">insert_drive_file</span>
                        <a href={item.url} download>
                            {item.url.split('/').pop()}
                        </a>
                    </div>
                )
            } else {
                return <iframe src={item.url} height="400px"></iframe>;
            }

        } else if (item.type === "audio") {
            return (
                <audio controls>
                    <source src={item.url} type="audio/ogg" />
                </audio>
            );
        } else {
            return null;
        }
    }

    useEffect(() => {
        (async () => {
            await ListarAgentes()
            await ListarEquipos()
            await ListarBots()
            await ListarCardContacto()
            await ObtenerContactos()
        })()
    }, [])

    return (
        <>
            <Container fluid>
                <h3>Historial de conversaciones</h3>
                <Card
                    className="p-3 mb-3 card-stats border-0 shadow"
                >
                    <p>Filtro</p>
                    <Col
                        className="d-flex"
                    >
                        <div className='mx-3 w-100'>
                            <p>Fecha desde</p>
                            <input type="date"
                                className='form-control'
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Fecha hasta</p>
                            <input type="date"
                                className='form-control'
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p># Conversacion</p>
                            <input type="number"
                                className='form-control'
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Agente</p>
                            <select
                                className='form-control'
                            >
                                <option>Selecciona el agente</option>
                                {
                                    agentes.map((agente, index) => {
                                        return (
                                            <option key={index} value={agente.id}>{agente.nombre}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Equipo</p>
                            <select
                                className='form-control'
                            >
                                <option>Selecciona el equipo</option>
                                {
                                    equipos.map((equipo, index) => {
                                        return (
                                            <option key={index} value={equipo.id}>{equipo.equipos}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Conexion</p>
                            <select
                                className='form-control'
                            >
                                <option>Selecciona la conexion</option>
                                {
                                    bots.map((bot, index) => {
                                        return (
                                            <option key={index} value={bot.id}>{bot.nombre_bot}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </Col>
                    <Col className='p-3 '>
                        <button
                            className="btn btn button-bm shadow"
                        >Buscar</button>
                    </Col>
                </Card>

                <Card className="p-3 mb-3 card-stats border-0 shadow">

                    <div className="d-flex box-chat box-chat-container flex-column flex-md-row px-0 py-0 position-relative" style={{ margin: "0px", height: '100%' }} >

                        <div className="chat-list bg-chat rounded-start bg-white">
                            <div className="w-100 d-flex flex-column gap-2 mt-2 p-2"
                                style={{
                                    maxHeight: '550px',
                                    minHeight: '550px',
                                    overflow: 'auto',
                                    scrollbarWidth: 'thin',
                                }}
                            >
                                {cardMensaje ? cardMensaje.map((item, index) => {
                                    return (
                                        <div
                                            className="border w-100 p-2 rounded d-flex flex-column gap-1 cursor-pointer bg-white shadow" key={index + 1}
                                            onClick={() => OntenerConversacion(item)}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <span className="text-black">Conversacion: #{item.conversacion_id}</span>
                                                <span className="text-black">Fecha: {moment(item.createdAt).format("YYYY/MM/DD")}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-black">Agente: {NombreAgente(item.agente_id)}</span>
                                                <span className="text-black">Estado: {item.estado}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-black">Conexion: {Conexion(item.channel_id)}</span>
                                                <span className="text-black">Contacto: {item.contacto_id}</span>
                                            </div>
                                        </div>
                                    )
                                }) : null}
                            </div>
                        </div>



                        <div className="chat-messages bg-white rounded-end">
                            <div className="p-4 pt-2 pb-0"
                                style={{
                                    maxHeight: '550px',
                                    minHeight: '550px',
                                    overflow: 'auto',
                                    scrollbarWidth: 'thin',
                                    borderLeft: '1px solid #e0e0e0',
                                }}
                            >
                                <div
                                    className="row rounded bg-chat d-flex"
                                    style={{ minHeight: "50px" }}
                                >
                                    <div className="col-3 col-md-4 d-flex align-items-center gap-2 px-2">
                                        <div className="rounded d-flex align-items-center justify-content-center position-relative">
                                            {contactos ? (
                                                <span className="position-absolute d-block status-active"></span>
                                            ) : null}

                                            <img
                                                src={
                                                    contactos
                                                        ? contactos.avatar
                                                        : null
                                                }
                                                className="rounded-circle"
                                                width="40px"
                                                height="40px"
                                            />
                                        </div>

                                        <div className="d-flex align-items-center flex-row gap-2">
                                            <div className="d-block font-bold chat-title d-flex flex-column gap-1">
                                                {contactos
                                                    ?
                                                    <>
                                                        <span>{contactos.nombre}</span>
                                                        <span
                                                            className="text-span"
                                                            style={{ fontSize: '12px' }}>
                                                            {contactos.telefono}
                                                        </span>
                                                    </>
                                                    : "Seleccione una conversación"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row chat-body">
                                    <div className="col-12">
                                        {conversacionHistorial.map((item, index) => {
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
                                        <p className="text-center mt-3" ref={dummy}></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Card>
            </Container>
        </>
    );
}

export default HistorialContacto;