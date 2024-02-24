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
import Swal from "sweetalert2";

function Etiquetas(props) {
    const [show, setShow] = useState(false);

    const [etiquetas, setEtiquetas] = useState([]);
    const [etiqueta, setEtiqueta] = useState({
        id: 0,
        etiqueta: '',
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
            etiqueta: '',
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
        setEtiqueta({
            id: item.id,
            etiqueta: item.etiquetas,
            color: item.color,
            cuenta_id: GetTokenDecoded().cuenta_id
        })
        setShow(true)
    }

    const ActualizarEtiqueta = async (e) => {
        e.preventDefault()
        let url = host + 'etiqueta/'+etiqueta.id
        const { data, status } = await axios.put(url, etiqueta)
        if(status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Etiqueta actualizada',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                ListarEtiquetas()
                setShow(false)
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar la etiqueta',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const EliminarEquipo = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let url = host + 'etiqueta/'+id
                const { status } = await axios.delete(url)
                if(status === 200){
                    ListarEtiquetas()
                }
            }
        })
    }

    const CrearEquipo = async (e) => {
        e.preventDefault()
        let url = host + 'etiqueta'
        const { status } = await axios.post(url, etiqueta)
        if(status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Etiqueta creada',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                ListarEtiquetas()
            })
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
                <button className="button-bm mr-2 w-25"
                    onClick={handleClose}
                >Crear etiqueta</button>
            </div>
            <Card style={{ overflow:'auto'}}>
                <table className="table table-personalisado table-hover">
                    <thead className='table-active' >
                        <tr
                            className='text-center text-white'
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
                                                height: '15px',
                                                backgroundColor: item.color,
                                                margin: 'auto'
                                            }}></div>
                                        </td>
                                        <td
                                            className='text-center'
                                        >
                                            <button 
                                            className="btn btn w-20"
                                                onClick={() => EditarEquipo(item)}
                                            >
                                                    <i className="fas fa-edit
                                                    text-dark
                                                    "></i>
                                            </button>
                                            
                                            <button className="btn btn w-20"
                                                onClick={() => EliminarEquipo(item.id)}
                                            >
                                                    <i className="fas fa-trash-alt 
                                                    text-danger
                                                    "></i>
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
                                name='etiqueta'
                                value={etiqueta.etiqueta}
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
                                className='button-bm mr-2 w-100'
                            type="submit" onClick={(e)=>ActualizarEtiqueta(e)}>
                                Actualizar Etiqueta
                            </button>:
                            <button 
                                className='button-bm mr-2 w-100'
                            type="submit" onClick={(e)=>CrearEquipo(e)}>
                                Crear Etiqueta
                            </button>
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Etiquetas;