import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Container,
    Form,
    Modal
} from 'react-bootstrap';


function Agentes(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [agentes, setAgentes] = useState([])
    const [equipos, setEquipos] = useState([])
    const [agente, setAgente] = useState({
        cuenta_id: GetTokenDecoded().cuenta_id,
        equipo_id: 0,
        nombre: '',
        avatar: '',
        correo: '',
        clave: '',
        menu: {},
        contacto: '',
        perfil: '',
    })

    const ListarAgentes = async() => {
        const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            let ag = []
            data.data.map((agente, index) => {
                ag.push({
                    id: agente.id,
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
                    clave: agente.clave,
                    perfil: agente.perfil,
                    accion: <div className="d-flex justify-content-center">
                        <button className="btn btn mr-2 active"
                            onClick={() => {
                                setAgente({
                                    id: agente.id,
                                    cuenta_id: agente.cuenta_id,
                                    equipo_id: agente.equipo_id,
                                    nombre: agente.nombre,
                                    avatar: agente.avatar,
                                    correo: agente.correo,
                                    clave: agente.clave,
                                    perfil: agente.perfil,
                                })
                                setShow(true)
                            }}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                    </div>
                })
            })
            setAgentes(ag)
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
    const ActualizarAgente = async() => {
        const url = `${host}agentes/${agente.id}`
        const { data, status } = await axios.put(url, agente)
        if (status === 200) {
            ListarAgentes()
            handleClose()
        }
    }

    useEffect(() => {
        ListarAgentes()
        ListarEquipos()
    }, [])

    return (
        <>
         <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark ml-2"
                    onClick={handleClose}
                >Crear agente</button>
            </div>
            <Card>

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
            </Card>

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
                            <Form.Label>Equipo</Form.Label>
                            <Form.Control as="select"
                                onChange={(e) => setAgente({...agente, equipo_id: parseInt(e.target.value)})}
                            >
                                <option value={0}>Seleccione un equipo</option>
                                {
                                    equipos.map((equipo, index) => (
                                        <option value={equipo.id} key={index}>{equipo.equipos}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text"
                                onChange={(e) => setAgente({...agente, nombre: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Avatar</Form.Label>
                            <Form.Control type="file"
                                onChange={(e) => setAgente({...agente, avatar: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email"
                                onChange={(e) => setAgente({...agente, correo: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Clave</Form.Label>
                            <Form.Control type="password"
                                onChange={(e) => setAgente({...agente, clave: e.target.value})}
                            />
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
                    agente.id == 0 ?
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