import FacebookLogin from "@greatsumini/react-facebook-login";
import d360 from 'assets/img/360.jpeg';
import AI from 'assets/img/chatgpt.png';
import cloud from 'assets/img/cloud.png';
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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import socket from 'views/SocketIO';


function ChatBots(props) {
    const [show, setShow] = useState(false);
    
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
    const [userFb, setUserFb] = useState(null);
    const [perfil, setPerfil] = useState(null);

    const handleClose = () => {
        setShow(!show);
        Limpiar();
    }

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
        if(perfil && userFb){
            await SuccessSetuserFb()
        }else{
            const url = `${host}bots`;
            const { data, status } = await axios.post(url, bot);
            if (status === 200) {
                ListarBots()
                Limpiar()
                setShow(!show);
            }
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
            nombreunico: '',
            access_token: '',
            api_key: '',
            api_telegram: '',
            srcname: '',
            source: '',
        });
    }

    const InconBot = (id, url) => {
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
                return url;
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
            nombreunico: item.nombreunico,
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

    const SuccessSetuserFb = async (datoss) => {
        try {
            if(userFb && perfil){
                let datos = {
                    ...userFb,
                    name: perfil.name,
                    email: perfil.email,
                    url: perfil.picture.data.url,
                }
                console.log(datos)
                setUserFb(null)
                const { data, status } = await axios.post(`${host}webhookFConfig?cuenta_id=${GetTokenDecoded().cuenta_id}`, datos);
                if (status === 200) {
                    console.log("response: ",data)
                    setShow(!show);
                    return true
                }else{
                    return false
                }
            }
        } catch (error) {
          console.log("error")
          return error
        }
    }

    return (
        <>
          <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="btn btn-dark active ml-2"
                    onClick={handleClose}
                >Crear nuevo bot</button>
            </div>
            <Row
                className='d-flex justify-content-start align-items-start flex-wrap'
            >
                {
                    bots.map((bot, index) => (
                        //espacio entre las cards
                        <Card key={index} className='mx-1 col-lg-4 col-md-3 col-sm-1'>
                            <Card.Body>
                                <div className='d-flex justify-content-between align-items-start'>
                                    <div className='d-flex'>
                                        <img src={InconBot(bot.channel_id, bot.url_perfil)} alt="" width={90}
                                        />
                                        <div className=''>
                                            <h5>{
                                                String(bot.nombre_bot).length > 15 ? (
                                                    String(bot.nombre_bot).substring(0, 15) + '...'
                                                ) : (
                                                    bot.nombre_bot
                                                )
                                                }</h5>
                                            <p className='text-muted text-truncate m-0'>{bot.numero_telefono.substring(0, 11)}</p>
                                            {
                                                ScannerQR(bot.channel_id, bot.nombreunico, bot.estado)
                                            }
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column mx-x'>
                                        <button className="btn btn active mr-2"
                                            onClick={() => window.open(`${bot.url}`, '_blank')}
                                        >
                                            {/* icono de construir */}
                                            <i className="fas fa-cogs"></i>
                                        </button>
                                        <button className="btn btn active mr-2"
                                        onClick={()=>ActivaModalEditar(bot)}>
                                            {/* icono de editar */}
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn active mr-2"
                                        onClick={()=>EliminarBots(bot.id)}>
                                            {/* icono de eliminar */}
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
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
                <Modal.Header>
                    {
                        bot.id === 0 ? (
                            <Modal.Title>Crear bot</Modal.Title>
                        ) : (
                            <Modal.Title>Editar bot</Modal.Title>
                        )
                    }
                    <button
                        className='btn btn-dark active mr-2 w-10'
                        onClick={handleClose}
                    >
                        X
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="description">Canal</label>
                            <select className="form-control" id="exampleFormControlSelect1"
                                value={bot.channel_id}
                                onChange={(e) => setBot({...bot, channel_id: parseInt(e.target.value)})}
                                disabled={bot.id !== 0}
                            >
                                <option>Seleccione</option>
                                {
                                    canales.map((item, index) => (
                                        <option key={index} value={item.id}>{item.proveedor}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {
                            bot.channel_id === 6 || bot.channel_id === 8 ? null : (
                            <div className="form-group">
                                <label htmlFor="tiempo">Nombre Bots</label>
                                <input type="text" className="form-control" id="nombre_bot" placeholder="Nombre Bots"
                                    value={bot.nombre_bot}
                                    // el nombre del bot no puede tener espacios
                                    onChange={(e) => setBot({...bot, nombre_bot: e.target.value.replace(/\s/g, '')})}
                                />
                            </div>
                            )
                        }
                        {
                            bot.channel_id === 6 || bot.channel_id === 8 ? (
                                <>
                                    <FacebookLogin
                                        appId="3176667395950990"
                                        fields="email,name,picture"
                                        scope="email,public_profile,pages_show_list,pages_messaging,pages_read_engagement"
                                        autoLoad={true}
                                        onSuccess={(response) => {
                                            // console.log('Login Success!', response);
                                            setUserFb(response)
                                        }}
                                        onFail={(error) => {
                                            console.log('Login Failed!', error);
                                        }}
                                        onProfileSuccess={(response) => {
                                            console.log('Get Profile Success!', response);
                                            setPerfil(response)
                                        }}
                                        // siempre al inicio de sesion para que el usuario ponga la cuenta de facebook que quiere usar
                                        onProfileFail={(error) => {
                                            console.log('Get Profile Failed!', error);
                                        }}
                                        style={{
                                            backgroundColor: bot.channel_id === 8 ? "#e1306c" : "#3b5998",
                                            color: "#fff",
                                            fontSize: "16px",
                                            padding: "5px 5px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            width: "100%",
                                            marginTop: "15px",
                                        }}
                                    >
                                        {
                                            bot.channel_id === 8 ? (
                                                <>
                                                    <i className="fab fa-instagram"></i> Conectar con Instagram
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fab fa-facebook-f"></i> Conectar con Facebook
                                                </>
                                            )

                                        }
                                    </FacebookLogin>
                                </>
                            ) : null
                        }
                        {
                            bot.channel_id === 6 || bot.channel_id === 8 ? null : (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Numero Telefono</label>
                                    <input className="form-control" id="numero_telefono"
                                        value={bot.numero_telefono}
                                        onChange={(e) => setBot({...bot, numero_telefono: e.target.value})}
                                    />
                                </div>
                            )
                        }
                        {
                            bot.channel_id === 3  ? (
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
                            bot.channel_id === 3 ? (
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
                            bot.channel_id === 3 && bot.id !== 0 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Webhook</label>
                                    <input className="form-control" id="IdWhatsAppBusiness" disabled={true}
                                        value={`${host}webhookCloud?bots=${bot.nombreunico}`}
                                    />
                                    <CopyToClipboard text={`${host}webhookCloud?bots=${bot.nombreunico}`}>
                                        <a href={'#'} className="">
                                            Copiar
                                        </a>
                                    </CopyToClipboard>
                                </div>
                            ) : null
                        }
                        {
                            bot.channel_id === 3 && bot.id !== 0 ? (
                                <div className="form-group">
                                    <label htmlFor="mensaje">Webhook</label>
                                    <input className="form-control" id="IdWhatsAppBusiness" disabled={true}
                                        value="testing-flashchat"
                                    />
                                    <CopyToClipboard text={"testing-flashchat"}>
                                        <a href={'#'}>
                                            Copiar
                                        </a>
                                    </CopyToClipboard>
                                </div>
                            ) : null
                        }
                        {
                            bot.id === 0 ?  (
                                <button type="submit" className="btn btn-dark active w-100 mt-3"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        GuardarBot();
                                    }}
                                >Guardar</button>
                            ): (
                                <button type="submit" className="btn btn-dark active w-100 mt-3"
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