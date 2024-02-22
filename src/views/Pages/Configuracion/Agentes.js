import axios from 'axios';
import { GetTokenDecoded, SubirMedia } from 'function/storeUsuario';
import { host } from 'function/util/global';
import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState } from 'react';
import {
    Container,
    Form,
    Modal
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import socket from 'views/SocketIO';

function Agentes(props) {
    const [show, setShow] = useState(false);

    const [agentes, setAgentes] = useState([])
    const [equipos, setEquipos] = useState([])
    const [agente, setAgente] = useState({
        cuenta_id: GetTokenDecoded().cuenta_id,
        equipo_id: 0,
        nombre: '',
        avatar: '',
        correo: '',
        clave: '',
        newclave: '',
        menu: [],
        contacto: '',
        perfil: '',
        botId: []
    })

    const [bots, setBots] = useState([])
    const handleClose = () => {
        setShow(!show)
        setAgente({
            id: 0,
            cuenta_id: GetTokenDecoded().cuenta_id,
            equipo_id: 0,
            nombre: '',
            avatar: '',
            correo: '',
            clave: '',
            menu: [],
            contacto: '',
            perfil: '',
        })
    }

    const RecargarPaginaAgente = (item) => {
        socket.emit("recargar_pagina", {
            type: "recargar_agente_id",
            data:{
                agente_id: item.id,
                cuenta_id: GetTokenDecoded().cuenta_id
            }
        })
        Swal.fire({
            icon: 'success',
            title: 'Se envio la solicitud de recarga',
            showConfirmButton: false,
            timer: 1500
        })
    }
    const CerrarSessionAgente = (item) => {
        socket.emit("recargar_pagina", {
            type: "cerrar_session",
            data:{
                agente_id: item.id,
                cuenta_id: GetTokenDecoded().cuenta_id
            }
        })
    }

    const ListarAgentes = async() => {
        const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            let ag = []
            data.data.map((agente, index) => {
                ag.push({
                    id: agente.id,
                    botId: agente.botId,
                    cuenta_id: agente.cuenta_id,
                    equipo_id: agente.equipo_id,
                    equipo: agente.equipos.equipos,
                    nombre: agente.nombre,
                    avatar: <img src="https://codigomarret.online/upload/img/chatbot.jpeg" alt="avatar" width={50} className="rounded-circle"/>,
                    correo: agente.correo,
                    estado: agente.estado === 'offline' ? <button className="btn btn text-danger" disabled={true} >Offline</button>
                    : <button disabled={true} className="btn btn text-success">Online</button>,
                    contacto: agente.contacto,
                    fecha: agente.fecha,
                    // clave: agente.clave,
                    newclave: "",
                    perfil: agente.perfil,
                    accion: <div className="d-flex justify-content-center gap-2">
                        {/* recargar pagina del agente */}
                        <button className="btn btn"
                            onClick={() => {
                                RecargarPaginaAgente(agente)
                            }}
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="btn btn "
                            onClick={() => {
                                setAgente({
                                    id: agente.id,
                                    botId: agente.botId,
                                    cuenta_id: agente.cuenta_id,
                                    equipo_id: agente.equipo_id,
                                    nombre: agente.nombre,
                                    avatar: agente.avatar,
                                    correo: agente.correo,
                                    contacto: agente.contacto,
                                    clave: agente.clave,
                                    perfil: agente.perfil,
                                })
                                setShow(!show)
                            }}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn"
                            onClick={() => EliminarAgente(agente.id, agente.nombre)}
                        >
                            <i className="fas fa-trash-alt text-danger"></i>
                        </button>
                    </div>
                })
            })
            setAgentes(ag)
        }
    }

    const ListarBots = async() => {
        const url = `${host}bots/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            let labels = []
            data.data.map(bot => {
                labels.push({
                    name: bot.nombre_bot,
                    id: bot.id
                })
            })
            setBots(labels)
        }
    }

    const ListarEquipos = async() => {
        const url = `${host}equipo/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setEquipos(data.data)
        }
    }

    const CrearAgente = async() => {
        const url = `${host}agentes`
        const { data, status } = await axios.post(url, agente)
        if (status === 200) {
            ListarAgentes()
            handleClose()
        }
    }

    const CargarAvatar = async(file) => {
        const url = await SubirMedia(file)
        if(url !== null){
            setAgente({
                ...agente,
                avatar: url
            })
            return url
        }else{
            return null
        }
    }

    const handlebotSelect = (e) => {
        setAgente({
            ...agente,
            botId: e
        })
    }
    const handlebotRemove = (e) => {
        setAgente({
            ...agente,
            botId: e
        })
    }


    const EliminarAgente = async(id, nombre) => {
        const url = `${host}agentes/${id}`
        Swal.fire({
            title: 'Estas seguro?',
            html: `Eliminaras el agente <b>${nombre}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(url)
                .then(response => {
                    ListarAgentes()
                })
            }
        })
    }

    const ActualizarAgente = async() => {
        const url = `${host}agentes/${agente.id}`
        const { data, status } = await axios.put(url, agente)
        if (status === 200) {
            ListarAgentes()
            handleClose()
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarAgentes()
            await ListarEquipos()
            await ListarBots()
        })()
    }, [])

    return (
        <>
         <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark ml-2"
                    onClick={handleClose}
                >Crear agente</button>
            </div>
                <table className="table table-responsive">
                    <thead className=''>
                        <tr 
                            className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle table-dark table-active'
                        >
                            <th
                                className='align-middle text-white'
                            >Equipo</th>
                            <th
                                className='align-middle text-white'
                            >Nombre</th>
                            <th
                                className='align-middle text-white' 
                            >Perfil</th>
                            <th
                                className='align-middle text-white' 
                            >Avatar</th>
                            <th
                                className='align-middle text-white' 
                            >Correo</th>
                            <th
                                className='align-middle text-white' 
                            >Estado</th>
                            <th
                                className='align-middle text-white' 
                            >Contacto</th>
                            <th
                                className='align-middle text-white'
                            >Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            agentes.map((agente, index) => (
                                <tr key={index}
                                    className='text-center'
                                >
                                    <td>{agente.equipo}</td>
                                    <td>{agente.nombre}</td>
                                    <td>{agente.perfil}</td>
                                    <td>{agente.avatar}</td>
                                    <td>{agente.correo}</td>
                                    <td>{agente.estado}</td>
                                    <td>{agente.contacto}</td>
                                    <td>{agente.accion}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header >
                    <div
                        className='d-flex justify-content-between w-100'
                    >
                    {
                        agente.id == 0 ?
                        <Modal.Title>Crear Agente</Modal.Title>
                        :
                        <Modal.Title>Editar Agente</Modal.Title>
                    }
                    {/* botton para X para cerrar el modal */}
                    <button 
                    type="button"
                    className="btn-dark ml-auto"
                        onClick={handleClose}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Atencion bot</Form.Label>
                            <Multiselect
                                options={bots}
                                displayValue="name"
                                avoidHighlightFirstOption="true"
                                onSelect={handlebotSelect}
                                onRemove={handlebotRemove}
                                selectedValues={agente.botId}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text"
                                name='nombre'
                                value={agente.nombre}
                                onChange={(e) => setAgente({...agente, nombre: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Avatar</Form.Label>
                            <Form.Control type="file"
                                accept="image/png, image/jpeg"
                                name='avatar'
                                onChange={(e) => CargarAvatar(e.target.files[0])}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email"
                                name='correo'
                                value={agente.correo}
                                onChange={(e) => setAgente({...agente, correo: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Contacto</Form.Label>
                            <Form.Control type="text"
                                name='contacto'
                                value={agente.contacto}
                                onChange={(e) => setAgente({...agente, contacto: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Clave</Form.Label>
                            {
                                agente.id === 0 ?
                                <Form.Control 
                                    type="password"
                                    name='clave'
                                    autoComplete='off'
                                    aria-autocomplete='none'
                                    onChange={(e) => setAgente({...agente, clave: e.target.value})}
                                />
                                :
                                <Form.Control 
                                    type="password"
                                    name='clave'
                                    autoComplete='off'
                                    aria-autocomplete='none'
                                    onChange={(e) => setAgente({...agente, newclave: e.target.value})}
                                />
                            }
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Perfil</Form.Label>
                            <Form.Control as="select"
                                onChange={(e) => setAgente({...agente, perfil: e.target.value})}
                                value={agente.perfil}
                            >
                                    <option value={0}>Seleccione un Perfil</option>
                                    <option value="Agente" key={1}>Agente</option>
                                    <option value="Administrador" key={2}>Administrador</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                {
                    agente.id !== 0 ?
                    <button 
                        className='btn btn-dark active mr-2 w-100'
                        onClick={ActualizarAgente}
                    >Actualizar</button>
                    :
                    <button 
                        className='btn btn-dark active mr-2 w-100'
                        onClick={CrearAgente}
                    >Guardar</button>
                }
                </Modal.Footer>

            </Modal>
         </Container>
        </>
    );
}

export default Agentes;