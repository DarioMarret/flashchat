import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Container,
    Form,
    Modal
} from "react-bootstrap";

function Etiquetas(props) {
    const [show, setShow] = useState(false);

    const [etiquetas, setEtiquetas] = useState([]);
    const [etiqueta, setEtiqueta] = useState({
        id: 0,
        etiquetas: '',
        color: '#'+Math.floor(Math.random()*16777215).toString(16),
        cuenta_id: GetTokenDecoded().cuenta_id
    });
    const handleEquipo = (e) => {
        setEtiqueta({
            ...etiqueta,
            [e.target.name]: e.target.value,
        });
    }
    const handleClose = () => {
        setShow(!show)
        setEtiqueta({
            id: 0,
            etiquetas: '',
            color: '#'+Math.floor(Math.random()*16777215).toString(16),
            cuenta_id: GetTokenDecoded().cuenta_id
        })
    };
    const ListarEtiquetas = async () => {
        let url = host + 'etiqueta/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            setEtiquetas(data.data)
        }
    }
    const EditarEquipo = async (item) => {
        console.log(item)
        setEtiqueta(item)
        setShow(true)
    }

    const ActualizarEtiqueta = async (e) => {
        e.preventDefault()
        let url = host + 'etiqueta/'+etiqueta.id
        const { data, status } = await axios.put(url, etiqueta)
        if(status === 200){
            ListarEtiquetas()
            setShow(false)
        }
    }

    const EliminarEquipo = async (id) => {
        let url = host + 'etiqueta/'+id
        const { data, status } = await axios.delete(url)
        if(status === 200){
            ListarEtiquetas()
        }
    }

    const CrearEquipo = async (e) => {
        e.preventDefault()
        let url = host + 'etiqueta'
        const { data, status } = await axios.post(url, etiqueta)
        if(status === 200){
            ListarEtiquetas()
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarEtiquetas()
        })()
    },[])
    

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark active mr-2 w-25"
                    onClick={handleClose}
                >Crear Etiquetas</button>
            </div>
            <Card>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr
                            className='text-center text-white table-dark table-active'
                        >
                            <th
                                className='text-white'
                            >Etiqueta</th>
                            <th
                                className='text-white'
                            >color</th>
                            <th
                                className='text-white'
                            >Accione</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            etiquetas.map((item, key) => {
                                return(
                                    <tr key={key}>
                                        <td
                                            className='text-center'
                                        >{item.etiquetas}</td>
                                        <td
                                            className='text-center'
                                        >
                                            <div style={{
                                                width: '60px', 
                                                height: '20px', 
                                                backgroundColor: item.color,
                                                margin: 'auto'
                                            }}></div>
                                        </td>
                                        <td
                                            className='text-center'
                                        >
                                            <button 
                                            className="btn btn active w-20 mx-1"
                                                onClick={() => EditarEquipo(item)}
                                            >
                                                {/* icono de editar */}
                                                <a href="#" className="text-bark">
                                                    <i className="fas fa-edit
                                                    text-warning
                                                    "></i>
                                                </a>
                                            </button>
                                            
                                            <button className="btn btn active mx-1 w-20"
                                                onClick={() => EliminarEquipo(item.id)}
                                            >
                                                {/* icono de eliminar */}
                                                <a href="#" className="text-bark">
                                                    <i className="fas fa-trash-alt 
                                                    text-danger
                                                    "></i>
                                                </a>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
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
                        etiqueta.id !== 0 ?
                        <Modal.Title>Editar Etiqueta</Modal.Title>:
                        <Modal.Title>Crear Etiqueta</Modal.Title>
                    }
                    <button 
                        type="button"
                        className='btn-dark mr-2 w-10'
                        onClick={handleClose}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Etiqueta</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del Equipo"
                                name='etiquetas'
                                value={etiqueta.etiquetas}
                                onChange={handleEquipo}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword"
                            className='mt-2'
                        >
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="color" placeholder="Color" 
                                name='color'
                                className='w-25 mb-2'
                                value={etiqueta.color}
                                onChange={handleEquipo}
                            />
                        </Form.Group>
                        {
                            etiqueta.id !== 0 ?
                            <button 
                                className='btn btn-dark active mr-2 w-100'
                            type="submit" onClick={(e)=>ActualizarEtiqueta(e)}>
                                Actualizar
                            </button>:
                            <button 
                                className='btn btn-dark active mr-2 w-100'
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

export default Etiquetas;