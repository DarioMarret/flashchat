import { useState } from 'react';
import {
    Container,
    Modal,
} from 'react-bootstrap';

const mensajes = [
    {
        id: 1,
        mensaje: 'Hola, como estas?',
    },
    {
        id: 2,
        mensaje: 'Bienvenido a la empresa',
    },
    {
        id:3,
        mensaje: 'Buenas tardes claro en un momento le atiendo nos fuimos a almorzar',
    }
]
function MensajesAutomaticos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    return (
        <>
          <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Crear Mensajeria</button>
            </div>

            <table className="table response">
                <thead>
                    <tr
                    >
                        <th scope="col-9"
                            className="text-start w-75"
                        >Mensaje</th>
                        <th scope="col-2"
                            className="text-center w-25"
                        >Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mensajes.map((item) => (
                        <tr key={item.id}>
                            <td>{item.mensaje}</td>
                            <td>
                                <button className="btn btn-primary ml-2"
                                    onClick={handleClose}
                                >Editar</button>
                                <button className="btn btn-danger ml-2"
                                    onClick={handleClose}
                                >Eliminar</button>
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
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Crear Mensajeria
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control" id="mensaje" rows="3"></textarea>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary ml-2"
                        onClick={handleClose}
                    >Guardar</button>
                    <button className="btn btn-danger ml-2"
                        onClick={handleClose}
                    >Cancelar</button>
                </Modal.Footer>
            </Modal>
          </Container>

        </>
    );
}

export default MensajesAutomaticos;