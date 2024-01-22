import Table from "components/ReactTable/ReactTable";
import { useState } from 'react';
import {
    Button,
    Container,
    Form,
    Modal,
} from "react-bootstrap";

function Etiquetas(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [etiqueta, setEtiqueta] = useState({
        id: 0,
        etiqueta: '',
        color: '#'+Math.floor(Math.random()*16777215).toString(16),
        cuenta_id: 0
    });
    const handleEquipo = (e) => {
        setEtiqueta({
            ...etiqueta,
            [e.target.name]: e.target.value,
        });
    }

    

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Crear Equipos</button>
            </div>
            <Table
                columns={[
                    {
                        Header: "Etiqueta",
                        accessor: "etiqueta",
                    },
                    {
                        Header: "Color",
                        accessor: "color",
                    },
                ]}
                data={[
                    {
                        id: 1,
                        etiqueta: 'Urgente',
                        color: '#000000',
                    },
                    {
                        id: 2,
                        etiqueta: 'Importante',
                        color: '#323232',
                    },
                    {
                        id: 3,
                        etiqueta: 'Normal',
                        color: '#454545',
                    },
                    {
                        id: 4,
                        etiqueta: 'Baja',
                        color: '#787878',
                    },
                ]}
                title='Lista de Etiquetas'
            />
            </Container>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Crear Equipo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Nombre del Equipo</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del Equipo"
                                name='equipo'
                                onChange={handleEquipo}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" placeholder="Descripción" 
                                name='description'
                                onChange={handleEquipo}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="color" placeholder="Color" 
                                name='color'
                                onChange={handleEquipo}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Crear
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Etiquetas;