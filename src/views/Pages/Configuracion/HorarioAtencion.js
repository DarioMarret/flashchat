import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row
} from "react-bootstrap";
import Swal from "sweetalert2";

function HorarioAtencion(props) {
    const [show, setShow] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const handleClose = () => setShow(!show);
    
    const [horario, setHorario] = useState({
        id: 0,
        equipo_id: 0,
        inicio_horario: '',
        fin_horario: '',
        horario: '',
        mensaje_fuera_horario: '',
        cuenta_id: GetTokenDecoded().cuenta_id
    })

    const ListarEquipos = async () => {
        let url = host + 'equipo/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            setEquipos(data.data)
        }
    }
    const ListarHorarios = async () => {
        let url = host + 'horarios/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            setHorarios(data)
        }
    }

    const EditarHorario = async (item) => {
        setHorario(item)
        setShow(true)
    }

    const ActualizarHorario = async (e) => {
        e.preventDefault()
        let url = host + 'horarios/'+horario.id
        let data = {
            ...horario,
            equipo_id: parseInt(horario.equipo_id),
            horario: horario.inicio_horario+' - '+horario.fin_horario
        }
        const { status } = await axios.put(url, data)
        if(status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Horario Actualizado',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                ListarHorarios()
                setShow(false)
            })
        }
    }

    const EliminarHorario = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let url = host + 'horarios/'+id
                const { status } = await axios.delete(url)
                if(status === 200){
                    ListarHorarios()
                }
            }
        })
    }

    const GuardarHorario = async (e) => {
        e.preventDefault()
        let url = host + 'horarios'
        let data = {
            ...horario,
            equipo_id: parseInt(horario.equipo_id),
            horario: horario.inicio_horario+' - '+horario.fin_horario
        }
        const { status } = await axios.post(url, data)
        if(status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Horario Creado',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                ListarHorarios()
                setShow(false)
            })
        }
    }

    const handleHorario = (e) => {
        if(e.target.name !== 'equipo_id'){
            setHorario({
                ...horario,
                [e.target.name]: parseInt(e.target.value),
            });
        }
        setHorario({
            ...horario,
            [e.target.name]: e.target.value,
        });
    }

    useEffect(() => {
        (async()=>{
            await ListarEquipos()
            await ListarHorarios()
        })()
    }, [])

    return (
        <>
            <Container fluid>
                <div className='d-flex justify-content-start mb-3'>
                    <button className="btn button-bm ml-2"
                        onClick={handleClose}
                    >Crear Horario</button>
                </div>
                <Card style={{ overflow: 'auto' }}>
                    <table responsive className='table-personalisado table-hover'>
                        <thead className="table-active">
                            <tr className="text-center" >
                                <th
                                    className='text-white'
                                >Equipo</th>
                                <th
                                    className='text-white'
                                >Horario</th>
                                <th
                                    className='text-white'
                                >Mensaje Fuera de Horario</th>
                                <th
                                    className='text-white'
                                >Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                horarios.map((item, key) => (
                                    <tr key={key} className="text-center">
                                        <td>{item.equipos.equipos}</td>
                                        <td>{item.horario}</td>
                                        <td>{item.mensaje_fuera_horario}</td>
                                        <td>
                                            <button className="btn mx-1"
                                                onClick={()=>EditarHorario(item)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn mx-1"
                                                onClick={()=>EliminarHorario(item.id)}
                                            >
                                                <i className="fas fa-trash-alt text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Card>
            </Container>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    {
                        horario.id !== 0 ?
                        <Modal.Title>Editar Horario</Modal.Title>:
                        <Modal.Title>Crear Horario</Modal.Title>
                    }
                    <button type="button" 
                        className="btn button-bm"
                        onClick={handleClose}>
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicPassword">
                                <Form.Label>Seleciona Equipo</Form.Label>
                                <select className="form-control" id="exampleFormControlSelect1"
                                    name='equipo_id'
                                    onChange={handleHorario}
                                    value={horario.equipo_id}
                                >
                                    <option value="0">Seleciona Equipo</option>
                                   {
                                        equipos.map((item, key) => (
                                            <option key={key} value={item.id}>{item.equipos}</option>
                                        ))
                                   }
                                </select>
                        </Form.Group>   
                        <Form.Group controlId="formBasicPassword">
                                <Form.Label>Horario inicio y fin</Form.Label>
                                <Col 
                                    md="12"
                                    sm="12"
                                    xs="12"
                                >
                                    <Row className="justify-content-center">
                                        <Col md="4" sm="6" xs="12">
                                            <Form.Control type="time"
                                                name='inicio_horario'
                                                value={horario.inicio_horario}
                                                onChange={handleHorario}
                                            />
                                        </Col>
                                        <Col md="4" sm="6" xs="12">
                                            <Form.Control type="time"
                                                name='fin_horario'
                                                value={horario.fin_horario}
                                                onChange={handleHorario}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                        </Form.Group>
                        <Form.Group controlId="mensaje_fuera_horario">
                                <Form.Label>Mensaje Fuera de Horario</Form.Label>
                                <Form.Control type="text" placeholder="Mensaje Fuera de Horario"
                                    name='mensaje_fuera_horario'
                                    value={horario.mensaje_fuera_horario}
                                    onChange={handleHorario}
                                />
                        </Form.Group>
                        {
                            horario.id !== 0 ?
                            <button 
                                className='btn button-bm mr-2 w-100 mt-3'
                            type="submit" onClick={(e)=>ActualizarHorario(e)}>
                                Editar
                            </button>:
                            <button 
                                className='btn button-bm mr-2 w-100 mt-3'
                            type="submit" onClick={(e)=>GuardarHorario(e)}>
                                Crear
                            </button>
                        }
                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
}

export default HorarioAtencion;