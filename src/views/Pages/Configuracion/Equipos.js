import Table from "components/ReactTable/ReactTable";
import Multiselect from 'multiselect-react-dropdown';
import { useState } from 'react';
import {
    Button,
    Container,
    Form,
    Modal,
} from "react-bootstrap";

function Equipos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [equipo, setEquipo] = useState({
        id: 0,
        equipo: '',
        description: '',
        color: '#'+Math.floor(Math.random()*16777215).toString(16),
        agentes_id: [],
        cuenta_id: 0
    });
    const handleEquipo = (e) => {
        setEquipo({
            ...equipo,
            [e.target.name]: e.target.value,
        });
    }
    const handleAgentes = (e) => {
        let agentes = equipo.agentes_id
        e.map((item) => {
            let x = agentes.indexOf(item.id)
            if(x === -1){
                agentes.push(item.id)
            }
        })
        setEquipo({
            ...equipo,
            agentes_id: agentes,
        });
    }

    const handleAgentesRemove = (e) => {
        let agentes = []
        console.log("remove: ", e)
        e.map((item) => {
            agentes.push(item.id)
        })
        setEquipo({
            ...equipo,
            agentes_id: agentes,
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
                        Header: "Equipo",
                        accessor: "equipo",
                    },
                    {
                        Header: "Descripción",
                        accessor: "description",
                    },
                    {
                        Header: "Color",
                        accessor: "color",
                    },
                ]}
                data={[
                    {
                        id: 1,
                        equipo: 'Ventas',
                        description: 'Ventas description',
                        color: '#000000',
                    },
                    {
                        id: 2,
                        equipo: 'Antencion al cliente',
                        description: 'Antencion al cliente description',
                        color: '#323232',
                    },
                ]}
                title='Lista de Bots'
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
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Agentes</Form.Label>
                            <Multiselect
                                options={[
                                    {name: 'Srigar', id: 1},
                                    {name: 'Srigar2', id: 2},
                                    {name: 'Srigar3', id: 3},
                                    {name: 'Srigar4', id: 4},
                                ]}
                                displayValue='name'
                                onSelect={handleAgentes}
                                onRemove={handleAgentesRemove}
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

export default Equipos;