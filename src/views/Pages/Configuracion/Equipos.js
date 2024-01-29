import axios from "axios";
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState } from 'react';
import {
    Container,
    Form,
    Modal
} from "react-bootstrap";

function Equipos(props) {
    const [show, setShow] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const handleClose = () => setShow(!show);
    const [agentes, setAgentes] = useState([]);
    const [equipo, setEquipo] = useState({
        id: 0,
        equipos: '',
        descripcion: '',
        agenteId: [],
        cuenta_id: GetTokenDecoded().cuenta_id
    });

    const Limpiar = () => {
        setEquipo({
            id: 0,
            equipos: '',
            descripcion: '',
            agenteId: [],
            cuenta_id: GetTokenDecoded().cuenta_id
        })
    }
    const handleEquipo = (e) => {
        setEquipo({
            ...equipo,
            [e.target.name]: e.target.value,
        });
    }
    const handleAgentes = (e) => {
        setEquipo({
            ...equipo,
            agenteId: e,
        });
    }

    const handleAgentesRemove = (e) => {
        setEquipo({
            ...equipo,
            agenteId: e,
        });
    }

    const ListarAgentes = async () => {
        let url = host + 'agentes/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            let labels = []
            data.data.map((item) => {
                labels.push({name: item.nombre, id: item.id})
            })
            setAgentes(labels)
        }
    }
    const ListarEquipos = async () => {
        let url = host + 'equipo/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            setEquipos(data.data)
            Limpiar()
        }
    }

    const CrearEquipo = async (e) => {
        e.preventDefault()
        let url = host + 'equipo'
        const { data, status } = await axios.post(url, equipo)
        if(status === 200){
            Limpiar()
            ListarEquipos()
            handleClose()
        }
    }

    const EliminarEquipo = async (id) => {
        let url = host + 'equipo/'+id
        const { data, status } = await axios.delete(url)
        if(status === 200){
            Limpiar()
            ListarEquipos()
        }
    }

    const handleEquipoEdit = (e) => {
        setEquipo(e);
        setShow(true)
    }

    const EditarEquipo = async (id) => {
        let url = host + 'equipo/'+id
        const { data, status } = await axios.put(url, equipo)
        if(status === 200){
            ListarEquipos()
            setShow(true)
            Limpiar()
        }
    }

    useEffect(() => {
        (async () => {
            await ListarAgentes()
            await ListarEquipos()
        })()
    }, [])

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark ml-2"
                    onClick={handleClose}
                >Crear nuevo equipo</button>
            </div>
            <table className="table table-striped table-responsive">
                <thead>
                    <tr
                        className="table-dark text-center table-active"
                    >
                        <th
                            className="text-white"
                        >Equipo</th>
                        <th
                            className="text-white"
                        >Descripción</th>
                        <th
                            className="text-white"
                        >Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        equipos.map((item, key) => {
                            return(
                                <tr key={key}
                                    className="text-center"
                                >
                                    <td>{item.equipos}</td>
                                    <td>{item.descripcion}</td>
                                    <td>
                                        <button className="btn btn ml-2"
                                            onClick={() => handleEquipoEdit(item)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn ml-2"
                                            onClick={() => EliminarEquipo(item.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            </Container>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    {
                        equipo.id !== 0 ?
                        <Modal.Title>Editar Equipo</Modal.Title>:
                        <Modal.Title>Crear Equipo</Modal.Title>
                    }
                    <button
                        type="button"
                        className='btn-dark mr-2 w-10'
                        onClick={handleClose}>
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Nombre del Equipo</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del Equipo"
                                name='equipos'
                                value={equipo.equipos}
                                onChange={handleEquipo}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" placeholder="Descripción" 
                                name='descripcion'
                                value={equipo.descripcion}
                                onChange={handleEquipo}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Agentes</Form.Label>
                            <Multiselect
                                options={agentes}
                                displayValue="name"
                                avoidHighlightFirstOption="true"
                                onSelect={handleAgentes}
                                onRemove={handleAgentesRemove}
                                selectedValues={equipo.agenteId}
                            />
                        </Form.Group>
                        {
                            equipo.id !== 0 ?
                            <button 
                                className='btn btn-dark active mr-2 w-100 mt-3'
                            type="submit" onClick={(e)=>EditarEquipo(equipo.id)}>
                                Editar
                            </button>:
                            <button 
                                className='btn btn-dark active mr-2 w-100 mt-3'
                            type="submit" onClick={(e)=>CrearEquipo(e)}>
                                Crear
                            </button>
                            
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Equipos;