import axios from 'axios';
import { GetTokenDecoded, SubirMedia } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container,
    Modal,
    Row
} from 'react-bootstrap';


function Masivos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [bots, setBots] = useState([]);
    const [masivos, setMasivos] = useState([]);
    const [progresoFile, setProgresoFile] = useState(0);
    const [envio, setEnvio] = useState({
        id: 0,
        cuenta_id: GetTokenDecoded().cuenta_id,
        channel_id: 0,
        titulo: null,
        nombre_bot: null,
        nombreunico: null,
        fecha_envio: null,
        mensaje: null,
        imagen:null,
        plantilla: null,
        parametros: [],
        estado: null,
        progreso: 0,
        updatedAt: null,
    });

    const handleEnvio = (e) => {
        setEnvio({
            ...envio,
            [e.target.name]: e.target.value,
        });
    }
    
    const handleSelect = (item) => {
        if(item.target.value !== ''){
            let inf = JSON.parse(item.target.value)
            setEnvio({
                ...envio,
                nombre_bot: inf.nombre_bot,
                channel_id: inf.channel_id,
                nombreunico: inf.nombreunico,
            });
        }
    }

    const LimpiarEnvio = () => {
        setEnvio({
            id: 0,
            cuenta_id: GetTokenDecoded().cuenta_id,
            channel_id: 0,
            titulo: null,
            nombre_bot: null,
            nombreunico: null,
            fecha_envio: null,
            mensaje: null,
            imagen:null,
            plantilla: null,
            parametros: [],
            estado: null,
            progreso: 0,
            updatedAt: null,
        })
    }

    const CargarAvatar = async(file) => {
        setProgresoFile(10)
        const url = await SubirMedia(file)
        if(url !== null){
            setEnvio({
                ...envio,
                imagen: url
            })
            for (let i = progresoFile; i < 100; i++) {
                setProgresoFile(i)
            }
            const cletar = setInterval(() => {
                setProgresoFile(0)
            }, 2000);
            clearInterval(cletar)
            return url
        }else{
            setProgresoFile(0)
            return null
        }
    }
    
    const ListarBots = async() => {
        const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setBots(data.data);
        }
    }

    const handleEditar = (item) => {
        setEnvio({
            ...envio,
            id: item.id,
            cuenta_id: item.cuenta_id,
            channel_id: item.channel_id,
            titulo: item.titulo,
            nombre_bot: item.nombre_bot,
            nombreunico: item.nombreunico,
            fecha_envio: item.fecha_envio,
            mensaje: item.mensaje,
            imagen: item.imagen,
            plantilla: item.plantilla,
            parametros: item.parametros,
            estado: item.estado,
            progreso: item.progreso,
            updatedAt: item.updatedAt,
        })
        setShow(true)
    }

    const GuardarEnvio = async(e) => {
        e.preventDefault()
        console.log(envio)
        if(envio.id !== 0){
            const url = `${host}masivo/${envio.id}`;
            const { status } = await axios.put(url, envio);
            if (status === 200) {
                ListarMasivos();
                setShow(false)
                LimpiarEnvio()
            }
        }else{
            const url = `${host}masivo`;
            const { status } = await axios.post(url, envio);
            if (status === 200) {
                ListarMasivos();
                setShow(false)
                LimpiarEnvio()
            }
        }
    }

    const ListarMasivos = async() => {
        const url = `${host}masivo/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        console.log(data.data)
        if (status === 200) {
            setMasivos(data.data);
        }
    }

    const EliminarMasivo = async(id) => {
        const url = `${host}masivo/${id}`;
        const { data, status } = await axios.delete(url);
        if (status === 200) {
            ListarMasivos();
        }
    }

    useEffect(() => {
        (async() => {
            await ListarBots();
            await ListarMasivos();
        })()
    }, [])

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark active ml-2"
                    onClick={handleClose}
                >Programar envio masivo</button>
            </div>
            <div className='d-flex justify-content-start flex-wrap'>
                {
                    masivos.map((item, index) => (
                        <Col key={index}
                            className="mb-4 p-2 bg-white rounded shadow-sm"
                            md="4"
                            sm="12"
                            lg="4"
                        >
                            <Card.Header>
                                <Card.Title as="h4">{item.nombre_bot}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <div className="">
                                        <p>Fecha de envio: {item.fecha_envio}</p>
                                        <p>Estado: {item.estado}</p>
                                        <p>Attachment: </p>
                                        <img key={index} src={item.imagen} alt='...' width={150} />
                                        <p>Mensaje: </p>
                                        <span
                                            // que no se desborde el texto
                                            className='d-block text-truncate'
                                        >{item.mensaje}</span>
                                    </div>
                                    <div className="col-md-12 mt-2 w-100 d-flex justify-content-end align-items-center gap-2">
                                        <button className="btn btn-dark ml-2"
                                            onClick={()=>handleEditar(item)}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn-danger ml-2"
                                            onClick={()=>EliminarMasivo(item.id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Col>
                    ))
                }
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    {
                        envio.id !== 0 ?
                        <Modal.Title>Editar envio</Modal.Title>:
                        <Modal.Title>Crear envio masivo</Modal.Title>
                    }
                    <button
                        type="button"
                        className='btn-dark mr-2 w-10'
                        onClick={handleClose}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="titulo">Titulo</label>
                            <input type="text" className="form-control" id="titulo" placeholder="titulo" name='titulo'
                                value={envio.titulo}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombreunico">Bot Envio</label>
                            <select className="form-control" id="nombreunico" name='nombreunico'
                                value={envio.nombreunico}
                                onChange={handleSelect}
                            >
                                <option value="">Seleccione un bot</option>
                                {
                                    bots.map((item, index) => (
                                        <option key={index} value={JSON.stringify(item)}
                                        >{item.nombre_bot}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_envio">Fecha de envio</label>
                            <input type="datetime-local" className="form-control" id="fecha_envio" placeholder="Fecha de envio"
                                name='fecha_envio'
                                value={envio.fecha_envio}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control" id="mensaje" rows="3"
                                name='mensaje'
                                value={envio.mensaje}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="attachment">Imagen</label>
                            <input 
                                className="form-control" id="imagen" placeholder="imagen"
                                type="file"
                                accept="image/*"
                                name="imagen"
                                onChange={(e) => CargarAvatar(e.target.files[0])}
                            />
                            {/* para de progrese para la subida de la imagen  */}
                            {
                                progresoFile !== 0 ?
                                <p className='text-center mt-1'>{progresoFile}%</p> : null
                            }
                            {
                                progresoFile !== 0 ?
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" 
                                    role="progressbar" 
                                    aria-valuenow={progresoFile} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100" 
                                    style={{ width: `${progresoFile}%` }}></div>
                                </div> : null
                            }
                        </div>

                        {
                            envio.channel_id !== 0 && envio.channel_id !== 2 ?
                            <div className="form-group">
                                <label htmlFor="todos_contactos" className="">Seleccione Plantilla</label>
                                <select className="form-control" id="plantilla" name='plantilla'
                                    value={envio.plantilla}
                                    onChange={handleEnvio}
                                >
                                    <option value="">Seleccione una plantilla</option>
                                    <option value="1">Plantilla 1</option>
                                    <option value="2">Plantilla 2</option>
                                    <option value="3">Plantilla 3</option>
                                </select>
                            </div> : null
                        }
                        {
                            envio.channel_id !== 0 && envio.channel_id !== 2 ?
                            <div className="form-group">
                                <label htmlFor="parametros">Parametros</label>
                                <textarea className="form-control" id="parametros" rows="3"
                                    name='parametros'
                                    value={envio.parametros}
                                    onChange={handleEnvio}
                                />
                            </div> : null
                        }
                        <button type="submit" className="btn btn-dark w-100 mt-4"
                            onClick={(e) => GuardarEnvio(e)}
                        >
                            {
                                envio.id !== 0 ? 'Actualizar envio' : 'Crear envio'
                            }
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
            </Container>
        </>
    );
}

export default Masivos;