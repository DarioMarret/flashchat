import d360 from 'assets/img/360.jpeg';
import AI from 'assets/img/chatgpt.png';
import cloud from 'assets/img/cloud.png';
import facebook from 'assets/img/facebook.jpeg';
import gupshup from 'assets/img/gupshup.jpeg';
import instagram from 'assets/img/instagram.jpeg';
import QR from 'assets/img/qr.png';
import telegram from 'assets/img/telegram.jpeg';
import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Container,
    Modal,
    Row
} from 'react-bootstrap';
import socket from 'views/SocketIO';


function ChatBots(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [canales, setCanales] = useState([]);
    const [bot, setBot] = useState({
        id: 0,
        cuenta_id: 1,
        channel_id: 0,
        nombre_bot: '',
        nombreunico: '',
        estado: '',
        pagina: '',
        numero_telefono: '',
        identificador: '',
        IdWhatsAppBusiness: '',
        access_token: '',
        api_key: '',
        api_telegram: '',
        srcname: '',
        source: '',
        url: '',
    });
    const [bots, setBots] = useState([]);

    const ListarCanal = async() => {
        const url = `${host}canales`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setCanales(data.data);
        }
    }

    const ListarBots = async() => {
        const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setBots(data.data);
        }
    }

    const GuardarBot = async() => {
        const url = `${host}bots`;
        const { data, status } = await axios.post(url, bot);
        if (status === 200) {
            ListarBots()
            Limpiar()
            setShow(!show);
        }
    }

    const Actualizar = async() => {
        const url = `${host}bots/${bot.id}`;
        const { data, status } = await axios.put(url, bot);
        if (status === 200) {
            ListarBots()
            Limpiar()
            setShow(!show);
        }
    }

    const EliminarBots = async(id) => {
        const url = `${host}bots/${id}`;
        const { data, status } = await axios.delete(url);
        if (status === 200) {
            ListarBots()
        }
    }

    useEffect(() => {
        ListarCanal();
        ListarBots();
    }, []);

    const Limpiar = () => {
        setBot({
            id: 0,
            cuenta_id: 1,
            channel_id: 0,
            nombre_bot: '',
            pagina: '',
            numero_telefono: '',
            identificador: '',
            IdWhatsAppBusiness: '',
            access_token: '',
            api_key: '',
            api_telegram: '',
            srcname: '',
            source: '',
        });
    }

    const InconBot = (id) => {
        switch (id) {
            case 1:
                return AI;
            case 2:
                return QR;
            case 3:
                return cloud;
            case 4:
                return d360;
            case 5:
                return gupshup;
            case 6:
                return facebook;
            case 7:
                return telegram;
            case 8:
                return instagram;
            default:
                return 'https://via.placeholder.com/50x50';
        }
    }


    socket.on(`bost_update_${GetTokenDecoded().cuenta_id}`, async(data) => {
        // se actializa el estado del bot qr
        // el objeto para no hacer peticiones a la base de datos
        bots.map((bot) => {
            if (bot.nombreunico === data.nombreunico) {
                bot.estado = data.estado;
            }
        })
    });

    const ScannerQR = (id, nombreunico, estado) => {
        if(id === 2) {
            return (
                <div className='col'>
                    <a href={`${host}session/?session=${nombreunico}`} target="_blank" rel="noreferrer">
                        scanner qr
                    </a>
                    <p className={'ml-2 text-' + (estado === 'online' ? 'success' : 'danger')}>{estado}</p>
                </div>
            )
        }else{
            return null;
        }
    }

    const ActivaModalEditar = (item) => {
        setBot({
            id: item.id,
            cuenta_id: 1,
            channel_id: item.channel_id,
            nombre_bot: item.nombre_bot,
            pagina: item.pagina,
            numero_telefono: item.numero_telefono,
            identificador: item.identificador,
            IdWhatsAppBusiness: item.IdWhatsAppBusiness,
            access_token: item.access_token,
            api_key: item.api_key,
            api_telegram: item.api_telegram,
            srcname: item.srcname,
            source: item.source,
        });
        setShow(!show);
    }

    return (
        <>
          <Container fluid>
            <div className='d-flex justify-content-end mb-3'>
                <button className="btn btn-primary ml-2"
                    onClick={handleClose}
                >Crear Bots</button>
            </div>
            <Row
                className='d-flex justify-content-start align-items-start flex-wrap'
            >
                {
                    bots.map((bot, index) => (
                        //espacio entre las cards
                        <Card key={index} className='mr-1 mb-1 ml-1 col-12 col-sm-6 col-md-4 col-lg-3'>
                            <Card.Body>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <img src={InconBot(bot.channel_id)} alt="" width={100}/>
                                        <div className='ml-2'>
                                            <h5>{bot.nombre_bot}</h5>
                                            <p className='text-muted text-truncate m-0'>{bot.numero_telefono.substring(0, 11)}</p>
                                            {
                                                ScannerQR(bot.channel_id, bot.nombreunico, bot.estado)
                                            }
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <button className="btn btn-primary ml-2"
                                            onClick={() => window.open(`${bot.url}`, '_blank')}
                                        >Configurar</button>
                                        <button className="btn btn-primary ml-2" onClick={()=>ActivaModalEditar(bot)}>Editar</button>
                                        <button className="btn btn-danger ml-2" onClick={()=>EliminarBots(bot.id)}>Eliminar</button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                }
            </Row>
            <Modal
                size='md'
                show={show}
                onHide={handleClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                <Modal.Title>Crear Bot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="description">Canal</label>
                            <select className="form-control" id="exampleFormControlSelect1"
                                value={bot.channel_id}
                                onChange={(e) => setBot({...bot, channel_id: parseInt(e.target.value)})}
                            >
                                <option>Seleccione</option>
                                {
                                    canales.map((item, index) => (
                                        <option key={index} value={item.id}>{item.proveedor}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tiempo">Nombre Bots</label>
                            <input type="text" className="form-control" id="nombre_bot" placeholder="Nombre Bots"
                                value={bot.nombre_bot}
                                onChange={(e) => setBot({...bot, nombre_bot: e.target.value})}
                            />
                        </div>
                        {
                            bot.channel_id === 6 || bot.channel_id === 8 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Pagina</label>
                                    <input className="form-control" id="pagina" rows="3"
                                        value={bot.pagina}
                                        onChange={(e) => setBot({...bot, pagina: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        <div className="form-group">
                            <label htmlFor="mensaje">Numero Telefono</label>
                            <input className="form-control" id="numero_telefono"
                                value={bot.numero_telefono}
                                onChange={(e) => setBot({...bot, numero_telefono: e.target.value})}
                            />
                        </div>
                        {
                            bot.channel_id === 3 || bot.channel_id === 8 || bot.channel_id === 6 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Identificador</label>
                                    <input className="form-control" id="identificador"
                                        value={bot.identificador}
                                        onChange={(e) => setBot({...bot, identificador: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        {
                            bot.channel_id === 3 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">IdWhatsAppBusiness</label>
                                    <input className="form-control" id="IdWhatsAppBusiness"
                                        value={bot.IdWhatsAppBusiness}
                                        onChange={(e) => setBot({...bot, IdWhatsAppBusiness: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        {
                            bot.channel_id === 8 || bot.channel_id === 6 || bot.channel_id === 3 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Token Accesso</label>
                                    <input className="form-control" id="access_token"
                                        value={bot.access_token}
                                        onChange={(e) => setBot({...bot, access_token: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        {
                            bot.channel_id === 1 || bot.channel_id === 4 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">api_key</label>
                                    <input className="form-control" id="api_key"
                                        value={bot.api_key}
                                        onChange={(e) => setBot({...bot, api_key: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        {
                             bot.channel_id === 7 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">api_telegram</label>
                                    <input className="form-control" id="api_telegram"
                                        value={bot.api_telegram}
                                        onChange={(e) => setBot({...bot, api_telegram: e.target.value})}
                                    />
                                </div>
                            ) : null
                        }
                        {
                            bot.channel_id === 5 ? (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="mensaje">srcname</label>
                                        <input className="form-control" id="srcname"
                                            value={bot.srcname}
                                            onChange={(e) => setBot({...bot, srcname: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mensaje">source</label>
                                        <input className="form-control" id="source"
                                            value={bot.source}
                                            onChange={(e) => setBot({...bot, source: e.target.value})}
                                        />
                                    </div>
                                </>
                            ) : null
                        }
                        {
                            bot.id === 0 ?  (
                                <button type="submit" className="btn btn-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        GuardarBot();
                                    }}
                                >Guardar</button>
                            ): (
                                <button type="submit" className="btn btn-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        Actualizar();
                                    }}
                                >Actualizar</button>
                            )
                        }

                    </form>
                </Modal.Body>
            </Modal>
          </Container>
        </>
    );
}

export default ChatBots;