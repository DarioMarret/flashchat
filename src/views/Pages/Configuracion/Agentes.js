import axios from 'axios';
import Table from 'components/ReactTable/ReactTable';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Form,
    Modal,
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
                    estado: agente.estado,
                    contacto: agente.contacto,
                    fecha: agente.fecha,
                    clave: agente.clave,
                    perfil: agente.perfil,
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
        const url = `${host}agente`
    }

    useEffect(() => {
        ListarAgentes()
        ListarEquipos()
    }, [])

    return (
        <>
         <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Crear Bots</button>
            </div>
            <Table 
                columns={[
                    {
                        Header: 'Equipo',
                        accessor: 'equipo',
                    },
                    {
                        Header: 'Nombre',
                        accessor: 'nombre',
                    },
                    {
                        Header: 'Perfil',
                        accessor: 'perfil',
                    },
                    {
                        Header: 'Avatar',
                        accessor: 'avatar',
                    },
                    {
                        Header: 'Correo',
                        accessor: 'correo',
                    },
                    {
                        Header: 'Estado',
                        accessor: 'estado',
                    },
                    // {
                    //     Header: 'Fecha',
                    //     accessor: 'fecha',
                    // },
                    {
                        Header: 'Contacto',
                        accessor: 'contacto',
                    },
                ]}
                data={agentes}
                title='Lista de agentes'
            />

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Crear Agente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Equipo</Form.Label>
                            <Form.Control as="select"
                                onChange={(e) => setAgente({...agente, equipo_id: e.target.value})}
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
                                    <option value="agente" key={1}>agente</option>
                                    <option value="administrador" key={2}>administrador</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary"
                    onClick={CrearAgente}
                >Crear</Button>
                </Modal.Footer>

            </Modal>
         </Container>   
        </>
    );
}

export default Agentes;