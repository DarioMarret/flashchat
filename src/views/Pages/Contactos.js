import axios from 'axios';
import { GetTokenDecoded, SubirMedia } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import { Card, Container, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

export default function Contactos (props) {
    console.log(props)
    const [show, setShow] = useState(false);
    const handleClose = () => {
        Limpiar()
        setShow(!show)
    }
    const [canales, setCanales] = useState([])
    const [contactos, setContactos] = useState([])
    const [contacto, setContacto] = useState({
        id: 0,
        nombre: '',
        correo: '',
        telefono: '',
        avatar: '',
        channel_id: 0,
        cuenta_id: GetTokenDecoded().cuenta_id
    })

    const ListarContactos = async() => {
        const url = `${host}contactos/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setContactos(data.data)
        }
    }

    const CrearContacto = async() => {
        if(contacto.id !== 0){
            let urle = `${host}contactos/${contacto.id}`
            const { status } = await axios.put(urle, contacto)
            if (status === 200) {
                ListarContactos()
                handleClose()
            }
        }else{
            let url = `${host}contactos`
            const { status } = await axios.post(url, contacto)
            if (status === 200) {
                ListarContactos()
                handleClose()
            }
        }
    }

    const EditarContacto = (item)=>{
        setContacto(item)
        setShow(true)
    }

    const Limpiar = () => {
        setContacto({
            id: 0,
            nombre: '',
            correo: '',
            telefono: '',
            avatar: '',
            channel_id: 0,
            cuenta_id: GetTokenDecoded().cuenta_id
        })
    }

    const ListarCanal = async() => {
        const url = `${host}canales`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setCanales(data.data);
        }
    }

    const CargarAvatar = async(file) => {
        const url = await SubirMedia(file)
        if(url !== null){
            setContacto({
                ...contacto,
                avatar: url
            })
            return url
        }else{
            return null
        }
    }


    const EliminarContacto = async(id) => {
        const url = `${host}contactos/${id}`
        const { status } = await axios.delete(url)
        if (status === 200) {
            ListarContactos()
        }
    }

    useEffect(() => {
        ListarCanal()
        ListarContactos()
    }, [])
  return (
    <>
        <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark active mx-2" onClick={handleClose}>Crear contacto</button>
                <button className="btn btn-dark active mx-2">Exportar contactos</button>
                <button className="btn btn-dark active mx-2">Importar contactos</button>
            </div>
            <Card>
                <Table responsive>
                    <thead>
                        <tr
                            className='text-white text-center font-weight-bold text-uppercase text-monospace align-middle table-dark table-active'  
                        >
                            <th
                                className='text-white'
                            >#</th>
                            <th
                                className='text-white'
                            >Avatar</th>
                            <th
                                className='text-white'
                            >Nombre</th>
                            <th
                                className='text-white'
                            >Correo</th>
                            <th
                                className='text-white'
                            >Telefono</th>
                            <th
                                className='text-white'
                            >Canal</th>
                            <th
                                className='text-white'
                            >Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contactos.map((contacto, index) => (
                                <tr key={index}
                                    className='text-center'
                                >
                                    <td>{index + 1}</td>
                                    <td><img src={contacto.avatar} alt="" width={50} className="rounded-circle"
                                    /></td>
                                    <td>{contacto.nombre}</td>
                                    <td>{contacto.correo}</td>
                                    <td>{contacto.telefono}</td>
                                    <td>{contacto.channel.proveedor}</td>
                                    <td
                                        className='d-flex justify-content-center'
                                    >
                                        {/* redireccionamiento */}
                                        <button className="btn btn mr-1"
                                            onClick={() => console.log(`redireccionar a ${contacto.id}`)}
                                        >
                                        {/* ver historial */}
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        {/* iniciar una conversacion */}
                                        <button className="btn btn mr-1"
                                            onClick={() => console.log(`iniciar conversacion con ${contacto.id}`)}
                                        >
                                            <i className="fas fa-comments"></i>
                                        </button>
                                        <button className="btn btn mr-1" onClick={()=>EditarContacto(contacto)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn mr-1"
                                            onClick={() => EliminarContacto(contacto.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                {/* si hay mas de  10 contacto solo mostrar los primero 10 y hay visible la paginacion */}
                <div className="d-flex justify-content-center">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item">
                                <button className="page-link" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>
                            <li className="page-item"><button className="page-link">1</button></li>
                            <li className="page-item"><button className="page-link">2</button></li>
                            <li className="page-item"><button className="page-link">3</button></li>
                            <li className="page-item">
                                <button className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </Card>

            <Modal 
                size='md'
                show={show}
                onHide={handleClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <div className='d-flex justify-content-between w-100' >
                        {
                            contacto.id === 0 ?
                            <Modal.Title>Crear contacto</Modal.Title>
                            :
                            <Modal.Title>Editar contacto</Modal.Title>
                        }
                        <button type="button" className="btn-dark ml-auto" onClick={handleClose} >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Nombre" value={contacto.nombre} onChange={(e) => setContacto({...contacto, nombre: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Correo</label>
                            <input type="email" className="form-control" id="correo" placeholder="Correo" value={contacto.correo} onChange={(e) => setContacto({...contacto, correo: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Telefono</label>
                            <input type="text" className="form-control" id="telefono" placeholder="Telefono" value={contacto.telefono} onChange={(e) => setContacto({...contacto, telefono: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar">Avatar</label>
                            <input type="file" className="form-control" id="avatar"
                                accept="image/png, image/jpeg"
                                onChange={(e) => CargarAvatar(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="canal">Canal</label>
                            <select className="form-control" id="canal" value={contacto.channel_id} onChange={(e) => setContacto({...contacto, channel_id: e.target.value})}>
                                <option value="">Seleccione</option>
                                {
                                    canales.map((canal, index) => (
                                        <option key={index} value={parseInt(canal.id)}>{canal.proveedor}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    {
                        contacto.id === 0 ?
                        <button className="btn btn-dark w-100"
                            onClick={CrearContacto}
                        >Crear contacto</button>
                        :
                        <button className="btn btn-dark w-100"
                            onClick={CrearContacto}
                        >Editar contacto</button>
                    }
                </Modal.Footer>
            </Modal>

        </Container>
    </>
  )
}
