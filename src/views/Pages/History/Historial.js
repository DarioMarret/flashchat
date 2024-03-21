import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp, host } from 'function/util/global';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Card, Col, Container } from 'reactstrap';
import Swal from 'sweetalert2';

function Historial(props) {
    const [agentes, setAgentes] = useState([])
    const [equipos, setEquipos] = useState([])
    const [bots, setBots] = useState([])
    const [mensaje_historial, setMensajeHistorial] = useState(null)
    const [cardMensaje, setCardMensaje] = useState([])
    const [conversacionHistorial, setConversacionHistorial] = useState([])
    const [filtro, setFiltro] = useState({
        fecha_desde: "",
        fecha_hasta: "",
        conversacion_id: "",
        agente_id: "",
        equipo_id: "",
        nombreunico: ""
    })

    const [modal, setModal] = useState(false)


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

    const NombreAgente = (id) => {
        let nombre = agentes.filter((item) => item.id === id)
        if (nombre.length > 0) {
            return nombre[0].nombre
        } else {
            return "Sin agente"
        }
    }

    const Conexion = (id) => {
        let nombre = bots.filter((item) => item.nombreunico === id)
        if (nombre.length > 0) {
            return nombre[0].nombre_bot
        } else {
            return "Sin conexion"
        }
    }

    const BuscarConversacionFiltro  = async() => {
        if(filtro.fecha_desde === "" && filtro.fecha_hasta === "" && filtro.conversacion_id === "" && filtro.agente_id === "" && filtro.equipo_id === "" && filtro.nombreunico === ""){
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Debes seleccionar al menos fecha desde o fecha hasta',
                timer: 2000,
                confirmButtonColor: '#3F98F8'
            })
        }else if(filtro.fecha_desde !== "" && filtro.fecha_hasta === ""){
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Debes seleccionar fecha hasta',
                timer: 2000,
                confirmButtonColor: '#3F98F8'
            })
        }else if(filtro.fecha_desde === "" && filtro.fecha_hasta !== ""){
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Debes seleccionar fecha desde',
                timer: 2000,
                confirmButtonColor: '#3F98F8'
            })
        }else{
            try {
                setModal(true)
                setMensajeHistorial("Buscando historial...")
                // si se selecciona fecha desde y fecha hasta
                const { data, status } = await BmHttp.post(`${host}conversacion_historial_filter`, {
                    cuenta_id: GetTokenDecoded().cuenta_id,
                    desde: moment(filtro.fecha_desde).format('YYYY-MM-DD'),
                    hasta: moment(filtro.fecha_hasta).format('YYYY-MM-DD'),
                    conversacion_id: filtro.conversacion_id === "" || filtro.conversacion_id === 0 ? null : parseInt(filtro.conversacion_id),
                    agente_id: filtro.agente_id === "" || filtro.agente_id === 0 ? null : parseInt(filtro.agente_id),
                    equipo_id: filtro.equipo_id === "" || filtro.equipo_id === 0 ? null : parseInt(filtro.equipo_id),
                    nombreunico: filtro.nombreunico === "" || filtro.nombreunico === 0 ? null : filtro.nombreunico
                })
                if(data && data.status === 200){
                    // setConversacionHistorial(data.data)
                    //sacar solo la primera conversacion de la lista de cada conversacion_id que se ata a el contacto
                    let conversaciones = []
                    data.data.map((item, index) => {
                        setMensajeHistorial('Filtrando conversaciones...')
                        if (conversaciones.length === 0) {
                            conversaciones.push(item)
                        } else {
                            let existe = conversaciones.filter((conversacion) => conversacion.conversacion_id === item.conversacion_id && conversacion.contacto_id === item.contacto_id)
                            if (existe.length === 0) {
                                conversaciones.push(item)
                            }
                        }
                    })
                    // anadir un campo de que calcule el tiempo transcurrido desdel primer mensaje hasta el ultimo de cada
                    // conversacion
                    conversaciones.map((item, index) => {
                        setMensajeHistorial('Calculando tiempo de atencion...')
                        let fecha = moment(item.updatedAt)
                        let ultimamensaje = data.data.filter((conversacion) => conversacion.conversacion_id === item.conversacion_id && conversacion.contacto_id === item.contacto_id)
                        let fecha2 = moment(ultimamensaje[ultimamensaje.length - 1].updatedAt)
                        console.log(fecha)
                        let tiempo = fecha.diff(fecha2, 'minutes')
                        // si es negativo lo volvemos positivo
                        if (tiempo < 0) {
                            tiempo = tiempo * -1
                        }
                        item.tiempo = tiempo
                    })
                    setConversacionHistorial(conversaciones)
                    setModal(false)
                    setMensajeHistorial(null)
                }else{
                    setConversacionHistorial([])
                    setMensajeHistorial("No se encontraron conversaciones")
                    setTimeout(() => {
                        setMensajeHistorial(null)
                        setModal(false)
                    }, 2000)
                }
            } catch (error) {
                setMensajeHistorial("Lo sentimos, error al buscar historial")
                setTimeout(() => {
                    setModal(false)
                    setMensajeHistorial(null)
                }, 2000)
                return null
            }
        }
    }

    useEffect(() => {
        (async () => {
            await ListarAgentes()
            await ListarEquipos()
            await ListarBots()
            // await ObtenerContactos()
            // await ListarCardContacto()
        })()
    }, [])

    return (
        <Container fluid>
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
                                // desde 3 meses atras hasta hoy
                                max={moment().format('YYYY-MM-DD')}
                                min={moment().subtract(3, 'months').format('YYYY-MM-DD')}
                                className='form-control'
                                onChange={(e) => setFiltro({ ...filtro, fecha_desde: e.target.value })}
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p>Fecha hasta</p>
                            <input type="date"
                                // desde 3 meses atras hasta hoy
                                max={moment().format('YYYY-MM-DD')}
                                min={moment().subtract(3, 'months').format('YYYY-MM-DD')}
                                className='form-control'
                                onChange={(e) => setFiltro({ ...filtro, fecha_hasta: e.target.value })}
                            />
                        </div>
                        <div className='mx-3 w-100'>
                            <p># Conversacion</p>
                            <input type="text12"
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
                                onChange={(e) => setFiltro({ ...filtro, nombreunico: e.target.value })}
                            >
                                <option>Selecciona la conexion</option>
                                {
                                    bots.map((bot, index) => {
                                        return (
                                            <option key={index} value={bot.nombreunico}>{bot.nombre_bot}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </Col>
                    <Col className='p-3 '>
                        <button
                            className="button-bm shadow"
                            onClick={() => BuscarConversacionFiltro()}
                        >Buscar</button>
                    </Col>
                </Card> 


                {
                    conversacionHistorial.length > 0 ?
                        <Card className="p-3 mb-3 card-stats border-0 shadow">
                            <div
                                className="d-flex justify-content-between"
                            >
                                <p>Historial</p>
                                <p>Cantidad: {conversacionHistorial.length}</p>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Avatar</th>
                                            <th>Fecha</th>
                                            <th>Tiempo atencion</th>
                                            <th>Conversacion</th>
                                            <th>Contacto</th>
                                            <th>Agente</th>
                                            <th>Equipo</th>
                                            <th>Conexion</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            conversacionHistorial.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{
                                                            item.avatar === null ?
                                                                <img
                                                                    src="https://www.gravatar.com/avatar/
                                                                ?d=identicon"
                                                                    alt="avatar"
                                                                    className="rounded-circle"
                                                                    width="40"
                                                                />
                                                                :
                                                                <img
                                                                    src={item.avatar}
                                                                    alt="avatar"
                                                                    className="rounded-circle"
                                                                    width="40"
                                                                />    
                                                        }</td>
                                                        <td>{moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                        <td>
                                                            <span
                                                                className={item.tiempo >60 ? "text-danger" : "text-success"}
                                                            >
                                                            {
                                                                item.tiempo === 0 ?
                                                                "Menos de un minuto"
                                                                :
                                                                item.tiempo + " minutos"
                                                            }
                                                            </span>
                                                        </td>
                                                        <td>{item.conversacion_id}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{NombreAgente(item.agente_id)}</td>
                                                        <td>{item.equipo_id}</td>
                                                        <td>{Conexion(item.nombreunico)}</td>
                                                        <td>{item.estado}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                        : null
                }
            <Modal
                className="modal-dialog-centered"
                show={modal}
            >
                {/* <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        Cargando...
                    </h5>
                </div> */}
                <div className="modal-body">
                    <div className='w-100 text-center'>
                        <p>{mensaje_historial}</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </Container>
    );
}

export default Historial;