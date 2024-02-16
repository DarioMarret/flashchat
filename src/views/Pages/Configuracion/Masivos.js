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
import Swal from 'sweetalert2';


function Masivos(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        LimpiarEnvio()
        setShow(!show)
    }
    const [bots, setBots] = useState([]);
    const [masivos, setMasivos] = useState([]);
    const [progresoFile, setProgresoFile] = useState(0)

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
        intervalo_entre: 10,
        retardo_entre_msjs: 1000,
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
            intervalo_entre: 10,
            retardo_entre_msjs: 1000,
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
            let i = 0
            for (i = progresoFile; i <= 100; i++) {
                setProgresoFile(i)
                if(i === 100){
                    setTimeout(() => {
                        setProgresoFile(0)
                    }, 1500);
                }
            }
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
                Swal.fire({
                    icon: 'success',
                    title: 'Envio actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }else{
            const url = `${host}masivo`;
            const { status } = await axios.post(url, envio);
            if (status === 200) {
                ListarMasivos();
                setShow(false)
                LimpiarEnvio()
                Swal.fire({
                    icon: 'success',
                    title: 'Envio creado',
                    showConfirmButton: false,
                    timer: 1500
                })
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
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podras revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async(result) => {
            if(result.isConfirmed){
                const url = `${host}masivo/${id}`;
                const { data, status } = await axios.delete(url);
                if (status === 200) {
                    ListarMasivos();
                }
            }
        })
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
                            className="w-fit d-flex flex-column px-3 py-2 bg-white border rounded shadow-sm mb-3"
                            md="4"
                            sm="12"
                            lg="4"
                        >
                            <Card.Body>
                                <Row>
                                    <div className="w-fit d-flex flex-column px-3 py-2">
                                        <span>Bot: {item.nombre_bot}</span>
                                        <span>Campana: {item.titulo}</span>
                                        <span>Fecha de envio: {item.fecha_envio}</span>
                                        <span>Estado: {item.estado}</span>
                                        <span>Progreso: {item.progreso}</span>
                                        <span>Intervalo de envio: {item.intervalo_entre}</span>
                                        <span>Retardo de envio entre mensajes: {item.retardo_entre_msjs}</span>
                                        <span>Imgen: </span>
                                        <img key={index} src={item.imagen} alt='...' width={150} />
                                        <span>Mensaje: </span>
                                        <
                                        >{item.mensaje.substring(0, 50)}...</>
                                    </div>
                                    <div className="w-fit d-flex flex-column px-3 py-2 ">
                                        <button className="btn btn "
                                            onClick={()=>handleEditar(item)}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn "
                                            onClick={()=>EliminarMasivo(item.id)}
                                        >
                                            <i className="fa fa-trash text-danger"></i>
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
                            <label htmlFor="nombreunico">Intervalo de envio</label>
                            <input type="number" className="form-control" id="intervalo_entre" placeholder="intervalo_entre" name='intervalo_entre'
                                value={envio.intervalo_entre}
                                onChange={handleEnvio}
                            />
                        </div>

                        {/* restartdo entre mensajes */}
                        {/* hacer un  */}

                        <div className="form-group">
                            <label htmlFor="nombreunico">Retardo de envio entre mensajes</label>
                            <input type="number" className="form-control" id="retardo_entre_msjs" placeholder="retardo_entre_msjs" name='retardo_entre_msjs'
                                value={envio.retardo_entre_msjs}
                                onChange={handleEnvio}
                            />
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