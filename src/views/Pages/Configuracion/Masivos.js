import { useState } from 'react';
import {
    Card,
    Container,
    Modal,
    Row
} from 'react-bootstrap';
const envios = [
    {
        bost_id: 1,
        name: 'Bot 1',
        proveedor: 'Facebook',
        attachment: [{
            type: 'image',
            url: 'https://codigomarret.online/upload/img/sintelconpublicidad.jpeg'
        }],
        mensaje: 'Hola, soy un bot 1',
        fecha_envio: '2021-09-01 10:00:00',
        estado: 'Enviado',
        todos_contactos: true,
        contacto_id: []
    }
]
function Masivos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [envio, setEnvio] = useState({
        bost_id: 0,
        name: '',
        proveedor: '',
        attachment: [],
        mensaje: '',
        fecha_envio: '',
        estado: '',
        todos_contactos: false,
        contacto_id: []
    });

    const handleEnvio = (e) => {
        setEnvio({
            ...envio,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Programar envio masivo</button>
            </div>
            <Row>
                {
                    envios.map((item, index) => (
                        <Card key={index}>
                            <Card.Header>
                                <Card.Title as="h4">{item.name}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <div className="col-md-12">
                                        <p>Proveedor: {item.proveedor}</p>
                                        <p>Fecha de envio: {item.fecha_envio}</p>
                                        <p>Estado: {item.estado}</p>
                                        <p>Attachment: {item.attachment.map((item, index) => (
                                            item.type === 'image' ?
                                            <img key={index} src={item.url} alt={item.type} width={50} />
                                            : <p key={index}>{item.url}</p>
                                        ))}</p>
                                        <p>Mensaje: {item.mensaje}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <button className="btn btn-primary ml-2"
                                            onClick={handleClose}
                                        >Editar</button>
                                        <button className="btn btn-danger ml-2"
                                            onClick={handleClose}
                                        >Eliminar</button>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                }
            </Row>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Programar envio masivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" className="form-control" id="name" placeholder="Nombre"
                                value={envio.name}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="proveedor">Proveedor</label>
                            <input type="text" className="form-control" id="proveedor" placeholder="Proveedor"
                                value={envio.proveedor}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha_envio">Fecha de envio</label>
                            <input type="datetime-local" className="form-control" id="fecha_envio" placeholder="Fecha de envio"
                                value={envio.fecha_envio}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <input type="text" className="form-control" id="estado" placeholder="Estado"
                                value={envio.estado}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="attachment">Attachment</label>
                            <input type="text" className="form-control" id="attachment" placeholder="Attachment"
                                value={envio.attachment}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control" id="mensaje" rows="3"
                                value={envio.mensaje}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="todos_contactos" className="">Todos los contactos</label>
                            <input type="checkbox" className="form-control" id="todos_contactos"
                                value={envio.todos_contactos}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contacto_id">Contacto</label>
                            <input type
                            ="text" className="form-control" id="contacto_id" placeholder="Contacto"
                                value={envio.contacto_id}
                                onChange={handleEnvio}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal.Body>
            </Modal>
            </Container>
        </>
    );
}

export default Masivos;