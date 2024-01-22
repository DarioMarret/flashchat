import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import { Card, Container, Modal, Table } from 'react-bootstrap';

export default function Contactos (props) {
    console.log(props)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [contactos, setContactos] = useState([])

    const ListarContactos = async() => {
        const url = `${host}contactos/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setContactos(data.data)
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
        ListarContactos()
    }, [])
  return (
    <>
        <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Crear Contacto</button>
                <button className="btn btn-primary ml-2">Exportar Contactos</button>
                <button className="btn btn-primary ml-2">Importar Contactos</button>
            </div>
            <Card>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Avatar</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Telefono</th>
                            <th>Canal</th>
                            <th
                                className='d-flex justify-content-end'
                            >Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contactos.map((contacto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td><img src={contacto.avatar} alt="" width={50} className="rounded-circle"
                                    /></td>
                                    <td>{contacto.nombre}</td>
                                    <td>{contacto.correo}</td>
                                    <td>{contacto.telefono}</td>
                                    <td>{contacto.channel.proveedor}</td>
                                    <td
                                        className='d-flex justify-content-end'
                                    >
                                        <button className="btn btn-primary mx-1">Editar</button>
                                        <button className="btn btn-danger mx-1"
                                            onClick={() => EliminarContacto(contacto.id)}
                                        >Eliminar</button>
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Card>

            <Modal 
                size='md'
                show={show}
                onHide={handleClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Crear Contacto
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Nombre"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Correo</label>
                            <input type="email" className="form-control" id="correo" placeholder="Correo"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Telefono</label>
                            <input type="text" className="form-control" id="telefono" placeholder="Telefono"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar">Avatar</label>
                            <input type="file" className="form-control" id="avatar"/>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <button className="btn btn-primary">Crear</button>
                </Modal.Footer>
            </Modal>

        </Container>
    </>
  )
}
