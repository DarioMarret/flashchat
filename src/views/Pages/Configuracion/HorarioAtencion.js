import Table from "components/ReactTable/ReactTable";
import { useState } from 'react';
import {
    Col,
    Container,
    Form,
    Modal,
    Row
} from "react-bootstrap";

function HorarioAtencion(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [horario, setHorario] = useState({
        id: 0,
        equipo_id: 0,
        horario: '',
        mensaje_fuera_horario: '',
        cuenta_id: 0
    });
    return (
        <>
            <Container fluid>
                <div className='d-flex justify-content-end mb-3'>
                    <button className="btn btn-primary ml-2"
                        onClick={handleClose}
                    >Crear Horario</button>
                </div>
                <Table 
                    columns={[
                        {
                            Header: 'Equipo',
                            accessor: 'equipo',
                        },
                        {
                            Header: 'Horario',
                            accessor: 'horario',
                        },
                        {
                            Header: 'Mensaje Fuera de Horario',
                            accessor: 'mensaje_fuera_horario',
                        },
                        {
                            Header: 'Acciones',
                            accessor: 'acciones',
                        }
                    ]}
                    data={[
                        {
                            id: 1,
                            equipo: 'Ventas',
                            horario: 'Lunes a Viernes de 8:00 a 18:00',
                            mensaje_fuera_horario: 'Lo sentimos, estamos fuera de horario',
                            acciones: (
                                <>
                                    <button className="btn btn-primary ml-2"
                                        onClick={handleClose}
                                    >Editar</button>
                                    <button className="btn btn-danger ml-2"
                                        onClick={handleClose}
                                    >Eliminar</button>
                                </>
                            
                            )
                        },
                        {
                            id: 2,
                            equipo: 'Ventas',
                            horario: 'Lunes a Viernes de 8:00 a 18:00',
                            mensaje_fuera_horario: 'Lo sentimos, estamos fuera de horario',
                            acciones: (
                                <>
                                    <button className="btn btn-primary ml-2"
                                        onClick={handleClose}
                                    >Editar</button>
                                    <button className="btn btn-danger ml-2"
                                        onClick={handleClose}
                                    >Eliminar</button>
                                </>
                            
                            )
                        },
                        {
                            id: 3,
                            equipo: 'Ventas',
                            horario: 'Lunes a Viernes de 8:00 a 18:00',
                            mensaje_fuera_horario: 'Lo sentimos, estamos fuera de horario',
                            acciones: (
                                <>
                                    <button className="btn btn-primary ml-2"
                                        onClick={handleClose}
                                    >Editar</button>
                                    <button className="btn btn-danger ml-2"
                                        onClick={handleClose}
                                    >Eliminar</button>
                                </>
                            
                            )
                        },
                        {
                            id: 4,
                            equipo: 'Ventas',
                            horario: 'Lunes a Viernes de 8:00 a 18:00',
                            mensaje_fuera_horario: 'Lo sentimos, estamos fuera de horario',
                            acciones: (
                                <>
                                    <button className="btn btn-primary ml-2"
                                        onClick={handleClose}
                                    >Editar</button>
                                    <button className="btn btn-danger ml-2"
                                        onClick={handleClose}
                                    >Eliminar</button>
                                </>
                            
                            )
                        }
                    ]}
                    title='Lista de Horarios'
                />
            </Container>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Crear Horario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicPassword">
                                <Form.Label>Seleciona Equipo</Form.Label>
                                <select className="form-control" id="exampleFormControlSelect1">
                                    <option>Equipo 1</option>
                                    <option>Equipo 2</option>
                                    <option>Equipo 3</option>
                                    <option>Equipo 4</option>
                                    <option>Equipo 5</option>
                                </select>
                        </Form.Group>   
                        <Form.Group controlId="formBasicPassword">
                                <Form.Label>Horario inicio y fin</Form.Label>
                                <Col 
                                    md="12"
                                    sm="12"
                                    xs="12"
                                >
                                    <Row className="justify-content-center">
                                        <Col md="4" sm="6" xs="12">
                                            <Form.Control type="time"
                                                name='horario'
                                                // onChange={handleEquipo}
                                            />
                                        </Col>
                                        <Col md="4" sm="6" xs="12">
                                            <Form.Control type="time"
                                                name='horario'
                                                // onChange={handleEquipo}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                                <Form.Label>Mensaje Fuera de Horario</Form.Label>
                                <Form.Control type="text" placeholder="Mensaje Fuera de Horario"
                                    name='mensaje_fuera_horario'
                                    // onChange={handleEquipo}
                                />
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default HorarioAtencion;