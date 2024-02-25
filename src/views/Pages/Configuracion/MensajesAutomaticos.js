import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Container,
    Modal,
} from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Swal from 'sweetalert2';

function MensajesAutomaticos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [mensaje, setMensaje] = useState({
        id: 0,
        mensaje: '',
        cuenta_id: GetTokenDecoded().cuenta_id,
        estado: ''
    })

    const [mensajes, setMensajes] = useState([])
    const [estados, setEstados] = useState([])
    const [mensajeEstado, setMensajeEstado] = useState([])


    const ListarMensajes = async () => {
        const url = `${host}mensaje_predeterminado/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        console.log(data)
        if (status === 200 && data.data !== null) {
            setMensajes(data.data)
        }
    }
    // estados mensajes
    const ListarMensajeEstados = async () => {
        const url = `${host}estado_mensaje/${GetTokenDecoded().cuenta_id}`
        const { data } = await axios.get(url)
        console.log(data.data)
        if (data.status === 200) {
            setMensajeEstado(data.data)
        }
    }
    const ActualizarMensajeEstado = async () => {
        const url = `${host}estado_mensaje`
        const data = {
            id: mensaje.id,
            cuenta_id: GetTokenDecoded().cuenta_id,
            mensaje: mensaje.mensaje,
            estado: mensaje.estado
        }
        const { status } = await axios.put(url, data)
        if (status === 200) {
            await ListarMensajeEstados()
            Swal.fire({
                icon: 'success',
                title: 'Mensaje Actualizado',
                showConfirmButton: false,
                timer: 1500
            })
            handleClose()
        }
    }

    const ListaEstados = async () => {
        const url = `${host}estados`
        const { data, status } = await axios.get(url)
        if (status === 200 && data.data !== null) {
            setEstados(data.data)
        }
    }
    const handleShow = (item) => {
        setMensaje(item)
        setShow(true)
    }
    const CrearMensaje = async () => {
        if(mensaje.id === 0){
            const url = `${host}/mensaje_predeterminado`
            const data = {
                mensaje: mensaje.mensaje,
                cuenta_id: GetTokenDecoded().cuenta_id
            }
            const { status } = await axios.post(url, data)
            if (status === 200) {
                await ListarMensajes()
                Swal.fire({
                    icon: 'success',
                    title: 'Mensaje Creado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }else{
            const url = `${host}/mensaje_predeterminado`
            const data = {
                id: mensaje.id,
                mensaje: mensaje.mensaje,
                cuenta_id: GetTokenDecoded().cuenta_id
            }
            const { status } = await axios.put(url, data)
            if (status === 200) {
                await ListarMensajes()
                Swal.fire({
                    icon: 'success',
                    title: 'Mensaje Actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
                handleClose()
            }
        }
    }

    const EliminarMensaje = async (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Eliminar Mensaje',
            text: '¿Estas seguro de eliminar este mensaje?',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = `${host}/mensaje_predeterminado/${id}`
                const { status } = await axios.delete(url)
                if (status === 200) {
                    await ListarMensajes()
                }
            }
        })
    }

    useEffect(() => {
        (async()=>{
            await ListarMensajes()
            await ListaEstados()
            await ListarMensajeEstados()
        })()
    }, [])

    return (
        <>
          <Container fluid>

          <Tabs
            defaultActiveKey="respuestas_rapidas"
            id="uncontrolled-tab-example"
            className="mb-3"
            >
            <Tab eventKey="respuestas_rapidas" title="Respuestas Rapidas">
                <div className='d-flex justify-content-start mb-3'>
                    <button className="button-bm ml-2"
                        onClick={handleClose}
                    >Crea respuesta rapida</button>
                </div>
                <Card style={{ overflow: 'auto' }}>
                    <table responsive className='table-personalisado table-hover'>
                        <thead>
                            <tr
                                className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle'
                            >
                                <th scope="col-9"
                                    className="text-start text-white"
                                >Mensaje</th>
                                <th scope="col-2"
                                    className="text-center text-white"
                                >Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensajes.map((item) => (
                                <tr key={item.id}>
                                    <td
                                        className="text-start m-0 p-0"
                                    >{item.mensaje}</td>
                                    <td
                                        className="text-center d-flex justify-content-center align-items-center gap-2 m-0 p-0"
                                    >
                                        <button className="btn btn m-0"
                                            onClick={()=>handleShow(item)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn m-0"
                                            onClick={()=>EliminarMensaje(item.id)}
                                        >
                                            <i className="fas fa-trash-alt text-danger"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Modal
                    size='md'
                    show={show}
                    onHide={handleClose}
                    // aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header>
                        <div
                            className='d-flex justify-content-between w-100'
                        >
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {
                                mensaje.id === 0
                                    ? 'Crear Mensaje'
                                    : 'Actualizar Mensaje'
                            }
                        </Modal.Title>
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
                        <form>
                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea className="form-control" id="mensaje" 
                                value={mensaje.mensaje}
                                onChange={(e) => setMensaje({...mensaje, mensaje: e.target.value})}
                                rows="3"></textarea>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer
                        className="d-flex justify-content-end"
                    >
                        <button className="btn btn-dark ml-2"
                            onClick={CrearMensaje}
                        >
                            {
                                mensaje.id === 0
                                    ? 'Guardar'
                                    : 'Actualizar'
                            }
                        </button>
                    </Modal.Footer>
                </Modal>
            </Tab>
            <Tab eventKey="Estados" title="Estados">
                <Card style={{ overflow: 'auto' }}>
                    <table responsive className='table-personalisado table-hover'>  
                        <thead>
                            <tr
                                className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle'
                            >
                                <th scope="col-9"
                                    className="text-center text-white"
                                >Estado</th>
                                <th scope="col-9"
                                    className="text-center text-white"
                                >Mensaje</th>
                                <th scope="col-2"
                                    className="text-center text-white"
                                >Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensajeEstado.map((item) => (
                                <tr key={item.id}>
                                    <td
                                        className="text-center m-0 p-0"
                                    >{item.estado}</td>
                                    <td
                                        className="text-center m-0 p-0"
                                    >{item.mensaje}</td>
                                    <td
                                        className="text-center d-flex justify-content-center align-items-center gap-2 m-0 p-0"
                                    >
                                        <button className="btn btn m-0"
                                            onClick={()=>handleShow(item)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Modal
                    size='md'
                    show={show}
                    onHide={handleClose}
                    // aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header>
                        <div
                            className='d-flex justify-content-between w-100'
                        >
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {
                                mensaje.id === 0
                                    ? 'Crear Mensaje'
                                    : 'Actualizar Mensaje'
                            }
                        </Modal.Title>
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
                        <form>
                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea className="form-control" id="mensaje" 
                                value={mensaje.mensaje}
                                cols={3}
                                rows={10}
                                style={{
                                    // resize: 'none',
                                    overflow: 'auto',
                                    height: 'auto'
                                }}
                                onChange={(e) => setMensaje({...mensaje, mensaje: e.target.value})}
                                ></textarea>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer
                        className="d-flex justify-content-end"
                    >
                        <button className="btn button-bm w-100 ml-2"
                            onClick={ActualizarMensajeEstado}
                        >
                            {
                                mensaje.id === 0
                                    ? 'Guardar'
                                    : 'Actualizar'
                            }
                        </button>
                    </Modal.Footer>
                </Modal>
            </Tab>
            {/* <Tab eventKey="contact" title="Contact" disabled>
                Tab content for Contact
            </Tab> */}
            </Tabs>


          </Container>

        </>
    );
}

export default MensajesAutomaticos;