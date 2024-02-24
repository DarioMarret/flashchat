import axios from 'axios';
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import { useEffect, useState } from "react";
import {
    Container,
    Modal
} from "react-bootstrap";
import Table from 'react-bootstrap/Table';


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
    const [inactividades, setInactividades] = useState([])

    const handleMensaje = (e) => {
        setInactividad({
            ...inactividad,
            [e.target.id]: e.target.value,
        });
    }
    const handleEditInactividad = (item) => {
        setInactividad({
            id: item.id,
            description: item.description,
            tiempo: item.tiempo,
            mensaje: item.mensaje,
            cuenta_id: GetTokenDecoded().cuenta_id
        })
        setShow(true)
    }

    const ListarInactividad = async() => {
        let url = host + 'inactividad/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200){
            // ordenar por tiempo menor a mayor
            const inactividad = data.sort((a, b) => a.tiempo - b.tiempo)
            setInactividades(inactividad)
        }
    }

    const ActualizarInactividad = async (e) => {
        e.preventDefault()
        let url = host + 'inactividad'
        let info = {
            id: parseInt(inactividad.id),
            description: inactividad.description,
            tiempo: parseInt(inactividad.tiempo),
            mensaje: inactividad.mensaje,
            cuenta_id: parseInt(inactividad.cuenta_id)
        }
        const { status } = await axios.put(url, info)
        if(status === 200){
            ListarInactividad()
            setShow(false)
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarInactividad()
        })()
    }, [])

    return (
        <>
        <Container fluid>
            <div className="d-flex justify-content-between">
                <h4 className="font-weight-bold mt-2">Inactividad</h4>
            </div>

            <Table responsive className='table-personalisado'>
                <thead
                    className="table-active text-center"
                >
                    <tr>
                        <th
                            className="text-white"
                        >Descripción</th>
                        <th
                            className="text-white"
                        >Tiempo</th>
                        <th
                            className="text-white"
                        >Mensaje</th>
                        <th
                            className="text-white"
                        >Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inactividades.map((item, index) => (
                        <tr key={index}
                            className="text-center"
                        >
                            <td>{item.description}</td>
                            <td>{item.tiempo}</td>
                            <td>{item.mensaje}</td>
                            <td>
                                <button className="btn btn ml-2"
                                    onClick={() => handleEditInactividad(item)}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                <Modal.Title>Editar Inactividad</Modal.Title>
                <button type="button" className="button-bm" onClick={handleClose}>
                    <i className="fa fa-times"></i>
                </button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <input type="text" className="form-control" id="description" placeholder="Descripción"
                                value={inactividad.description}
                                onChange={handleMensaje}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tiempo">Tiempo</label>
                            <input type="number" className="form-control" id="tiempo" placeholder="Tiempo"
                                value={inactividad.tiempo}
                                onChange={handleMensaje}
                                min={5}
                                max={1440}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control " id="mensaje" rows="3" cols="50"
                                value={inactividad.mensaje}
                                onChange={handleMensaje}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn button-bm w-100"
                            onClick={(e)=>ActualizarInactividad(e)}
                        >Guardar</button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
            
        </>
    );
}

export default Inactividad;