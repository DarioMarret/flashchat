import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
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
        cuenta_id: GetTokenDecoded().cuenta_id
    })

    const [mensajes, setMensajes] = useState([])
    const [estados, setEstados] = useState([])
    const [mensajeEstado, setMensajeEstado] = useState([])


    const ListarMensajes = async () => {
        const url = `${host}/mensaje_predeterminado/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        console.log(data)
        if (status === 200 && data.data !== null) {
            setMensajes(data.data)
        }
    }
    const ListarMensajeEstados = async () => {
        const url = `${host}/mensaje_estado/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        console.log(data)
        if (status === 200 && data.data !== null) {
            setMensajeEstado(data.data)
        }
    }
    const ListaEstados = async () => {
        const url = `${host}/estados`
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
            const url = `${host}/mensaje_predeterminado/${mensaje.id}`
            const data = {
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
            }
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarMensajes()
            await ListaEstados()
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
                    <button className="btn btn-dark ml-2"
                        onClick={handleClose}
                    >Crea respuesta rapida</button>
                </div>

                <table className="table table-response">
                    <thead>
                        <tr
                            className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle table-dark table-active'
                        >
                            <th scope="col-9"
                                className="text-start"
                            >Mensaje</th>
                            <th scope="col-2"
                                className="text-center"
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
                                        onClick={handleClose}
                                    >
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            <div className='d-flex justify-content-start mb-3'>
                    <button className="btn btn-dark ml-2"
                        onClick={handleClose}
                    >Crea mensaje de estado</button>
                </div>
                <table className="table table-response">
                    <thead>
                        <tr
                            className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle table-dark table-active'
                        >
                            <th scope="col-9"
                                className="text-start"
                            >Mensaje</th>
                            <th scope="col-2"
                                className="text-center"
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
                                        onClick={handleClose}
                                    >
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            {/* <Tab eventKey="contact" title="Contact" disabled>
                Tab content for Contact
            </Tab> */}
            </Tabs>


          </Container>

        </>
    );
}

export default MensajesAutomaticos;