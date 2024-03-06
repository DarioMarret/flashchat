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
import ComponenteMultimedia from 'views/Components/ComponenteMultimedia';

function HistorialContacto(props) {

    const [agentes, setAgentes] = useState([])
    const [equipos, setEquipos] = useState([])
    const dummy = useRef();
    const [bots, setBots] = useState([])
    const [contactos, setContactos] = useState(null)
    const [cardMensaje, setCardMensaje] = useState([])
    const [conversacionHistorial, setConversacionHistorial] = useState([])
    const [filtro, setFiltro] = useState({
        fecha_desde: "",
        fecha_hasta: "",
        conversacion_id: "",
        agente_id: "",
        equipo_id: "",
        conexion_id: ""
    })

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
        // espera a que se obtenga el id del contacto
        const url = `${host}conversacion_card_contacto`
        const { data, status } = await axios.post(url, {
            contacto_id: parseInt(id),
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

    const BuscarConversacionFiltro  = () => {
        // dentro de la data conversacionHistorial
        // buscar por fecha desde y fecha hasta
        // buscar por conversacion_id
        // buscar por agente_id
        // buscar por equipo_id
        // buscar por conexion_id
        // si no se encuentra nada mostrar un mensaje de que no se encontro nada
        // si se encuentra algo mostrarlo
        // validar que los campos para la busqueda tiene que venir al menos uno con datos para poder realizar la busqueda
        if(filtro.fecha_desde === "" && filtro.fecha_hasta === "" && filtro.conversacion_id === "" && filtro.agente_id === "" && filtro.equipo_id === "" && filtro.conexion_id === ""){
            alert('Debes seleccionar al menos un filtro para poder realizar la busqueda')
        }else{
            // si se selecciona fecha desde y fecha hasta
            if(filtro.fecha_desde !== "" && filtro.fecha_hasta !== ""){
                let fechaDesde = moment(filtro.fecha_desde).format('YYYY-MM-DD')
                let fechaHasta = moment(filtro.fecha_hasta).format('YYYY-MM-DD')
                let data = conversacionHistorial.filter((item) => {
                    return moment(item.createdAt).format('YYYY-MM-DD') >= fechaDesde && moment(item.createdAt).format('YYYY-MM-DD') <= fechaHasta
                })
                if(data.length > 0){
                    setConversacionHistorial(data)
                }else{
                    alert('No se encontro nada con las fechas seleccionadas')
                }
            }

            // si se selecciona conversacion_id
            if(filtro.conversacion_id !== ""){
                let data = conversacionHistorial.filter((item) => {
                    return item.conversacion_id === parseInt(filtro.conversacion_id)
                })
                if(data.length > 0){
                    setConversacionHistorial(data)
                }else{
                    alert('No se encontro nada con la conversacion seleccionada')
                }
            }

            // si se selecciona agente_id
            if(filtro.agente_id !== ""){
                let data = conversacionHistorial.filter((item) => {
                    return item.agente_id === parseInt(filtro.agente_id)
                })
                if(data.length > 0){
                    setConversacionHistorial(data)
                }else{
                    alert('No se encontro nada con el agente seleccionado')
                }
            }

            // si se selecciona equipo_id
            if(filtro.equipo_id !== ""){
                let data = conversacionHistorial.filter((item) => {
                    return item.equipo_id === parseInt(filtro.equipo_id)
                })
                if(data.length > 0){
                    setConversacionHistorial(data)
                }else{
                    alert('No se encontro nada con el equipo seleccionado')
                }
            }

            // si se selecciona conexion_id
            if(filtro.conexion_id !== ""){
                let data = conversacionHistorial.filter((item) => {
                    return item.channel_id === parseInt(filtro.conexion_id)
                })
                if(data.length > 0){
                    setConversacionHistorial(data)
                }else{
                    alert('No se encontro nada con la conexion seleccionada')
                }
            }
        }


    
    }

    useEffect(() => {
        (async () => {
            await ListarAgentes()
            await ListarEquipos()
            await ListarBots()
            await ObtenerContactos()
            await ListarCardContacto()
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
                                onChange={(e) => setFiltro({ ...filtro, fecha_desde: e.target.value })}
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Fecha hasta</p>
                            <input type="date"
                                className='form-control'
                                onChange={(e) => setFiltro({ ...filtro, fecha_hasta: e.target.value })}
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p># Conversacion</p>
                            <input type="number"
                                className='form-control'
                                onChange={(e) => setFiltro({ ...filtro, conversacion_id: e.target.value })}
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Agente</p>
                            <select
                                className='form-control'
                                onChange={(e) => setFiltro({ ...filtro, agente_id: e.target.value })}
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
                                onChange={(e) => setFiltro({ ...filtro, equipo_id: e.target.value })}
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
                                onChange={(e) => setFiltro({ ...filtro, conexion_id: e.target.value })}
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
                            onClick={() => BuscarConversacionFiltro()}
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
                                                                className="w-fit d-flex flex-column px-3 py-2 rounded chat-item-detail chat-receiver"
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
                                            }
                                        })}
                                        <p className="text-center mt-3" ref={dummy}></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Card>

                <div className="d-flex justify-content-end align-items-end">
                    <div className="d-flex gap-3">
                        <button
                            className="btn btn button-bm shadow"
                            onClick={() => window.history.back()}
                        >Regresar</button>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default HistorialContacto;