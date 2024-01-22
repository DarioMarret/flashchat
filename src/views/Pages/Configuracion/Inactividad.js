import { useState } from "react";
import {
    Container,
    Modal
} from "react-bootstrap";

const equipos = [
    {
        id: 1,
        description: 'Alerta',
        tiempo: 10,
        mensaje: 'Su conversación está a punto de expirar, ¿desea continuar?'
    },
    {
        id: 2,
        description: 'Expirado',
        tiempo: 15,
        mensaje: 'Su conversación ha expirado, por favor inicie una nueva conversación'
    },
    {
        id: 3,
        description: 'Expira 24 horas',
        tiempo: 1440,
        mensaje: 'Su conversación ha expirado, por favor inicie una nueva conversación'
    }
];
function Inactividad(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [inactividad, setInactividad] = useState({
        id: 0,
        description: '',
        tiempo: 0,
        mensaje: '',
        cuenta_id: 0
    });

    const handleMensaje = (e) => {
        setInactividad({
            ...inactividad,
            [e.target.id]: e.target.value,
        });
    }

    return (
        <>
        <Container fluid>
            <table className="table table-striped response">
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Tiempo</th>
                        <th>Mensaje</th>
                    </tr>
                </thead>
                <tbody>
                    {equipos.map((item, index) => (
                        <tr key={index}>
                            <td>{item.description}</td>
                            <td>{item.tiempo}</td>
                            <td>{item.mensaje}</td>
                            <td>
                                <button className="btn btn-primary ml-2"
                                    onClick={handleClose}
                                >Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Editar Inactividad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <input type="text" className="form-control" id="description" placeholder="Descripción"
                                value={inactividad.description}
                                onChange={handleMensaje}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tiempo">Tiempo</label>
                            <input type="number" className="form-control" id="tiempo" placeholder="Tiempo"
                                value={inactividad.tiempo}
                                onChange={handleMensaje}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control" id="mensaje" rows="3"
                                value={inactividad.mensaje}
                                onChange={handleMensaje}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal.Body>
            </Modal>

        </Container>
            
        </>
    );
}

export default Inactividad;