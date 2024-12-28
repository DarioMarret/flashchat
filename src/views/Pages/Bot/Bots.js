/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
import FacebookLogin, { FacebookLoginClient } from "@greatsumini/react-facebook-login";
import d360 from "assets/img/360.jpeg";
import AI from "assets/img/chatgpt.png";
import cloud from "assets/img/cloud.png";
import QR from "assets/img/codigo-qr-whatsapp.png";
import gupshup from "assets/img/gupshup.jpeg";
import instagram from "assets/img/instagram.jpeg";
import telegram from "assets/img/telegram.jpeg";
import { GetTokenDecoded, SubirMedia } from "function/storeUsuario";
import { BmHttp, colorPrimario, host, host_widget } from "function/util/global";
import { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";
import ModelSdk from "views/Components/Modales/ModelSdk";


const permiso_facebook = "pages_show_list,pages_read_engagement,pages_manage_metadata,pages_messaging,pages_read_user_content,pages_manage_ads";
const permiso_instagram = "instagram_basic,instagram_manage_messages,instagram_manage_comments,instagram_manage_insights";

function Bots(props) {
  const [show, setShow] = useState(false);
  const [opQr, setOpQr] = useState(false);
  const [estadoQr, setEstadoQr] = useState({
    estado: "",
    nombreunico: "",
  });
  const [linkQr, setLinkQr] = useState("");
  const [canales, setCanales] = useState([]);
  const [bot, setBot] = useState({
    id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
    channel_id: 0,
    nombre_bot: "",
    nombreunico: "",
    estado: "",
    pagina: "",
    numero_telefono: "",
    plantilla: "",
    identificador: "",
    IdWhatsAppBusiness: "",
    access_token: "",
    api_key: "",
    api_telegram: "",
    srcname: "",
    source: "",
    url: "",
    flowise: false,
    leer_mensaje: true,
    bot_respuesta: true,
  });
  const [sdk, setSdk] = useState(null);
  const [ruta, setRuta] = useState("");
  const [bots, setBots] = useState([]);
  const [botPlantilla, setBotPlantilla] = useState([]);
  const [userFb, setUserFb] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [openWebChat, setOpenWebChat] = useState(false);
  const [id, setId] = useState(0);
  const [nombreunico, setNombreunico] = useState("");
  const [openConfirmaWebChat, setOpenConfirmaWebChat] = useState(false);

  const handleClose = () => {
    setShow(!show);
    Limpiar();
  };

  const handleCloseWebChat = async(nombreunico) => {
      const result = await ListarBotUnico(nombreunico+"_webchat");
      setNombreunico(nombreunico+"_webchat")
      if(result){
        setOpenWebChat(!openWebChat);
      }else{
        if(openWebChat){
          setOpenWebChat(false);
          setOpenConfirmaWebChat(false)
        }
      }
  }

  const AcualizarSdk = async () => {
    try {
      const payload = { sdk: { ...sdk } };
      const { data, status } = await BmHttp().post(`update_sdk_bot?nombreunico=${nombreunico}`, payload)
      if(status === 200 && data.status === 200){
        Swal.fire({
          title: "Actualizado correctamente puede generar el script nuevamente",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleCambiosdk = async (e) => {
    if(e.target.name === 'formulario' || e.target.name === 'builderBubble'){
      let str = JSON.stringify({ ...sdk, [e.target.name]: e.target.checked });
      setSdk({ ...sdk, [e.target.name]: e.target.checked });
      let base64 = window.btoa(str);
      setRuta(host_widget+base64)
    }else if(e.target.name === 'avatar_agente' || e.target.name === 'iconBurl' || e.target.name === 'icon'){
      const url = await SubirMedia(e.target.files[0]);
      let str = JSON.stringify({ ...sdk, [e.target.name]: url });
      setSdk({ ...sdk, [e.target.name]: url });
      let base64 = window.btoa(str);
      setRuta(host_widget+base64)
    }else{
      let str = JSON.stringify({ ...sdk, [e.target.name]: e.target.value });
      setSdk({ ...sdk, [e.target.name]: e.target.value });
      let base64 = window.btoa(str);
      setRuta(host_widget+base64)
    }
  }

  const handleOpenWebChat = async (id, nombreunico) => {
    setId(id)
    setNombreunico(nombreunico+"_webchat")
    const result = await ListarBotUnico(nombreunico+"_webchat");
    if(result){
      setOpenWebChat(true);
    }else{
      setOpenConfirmaWebChat(!openConfirmaWebChat);
    }
  }


  const handleopQr = () => {
    setOpQr(!opQr);
  };

  const ListarPlantillaBot = async () => {
    const { data, status } = await BmHttp().get(`bots_plantillas`);
    if (status === 200) {
      setBotPlantilla(data.data);
    }
  };

  const ListarCanal = async () => {
    const { data, status } = await BmHttp().get(`canales`);
    if (status === 200) {
      setCanales(data.data);
    }
  };

  const ListarBots = async () => {
    const { data, status } = await BmHttp().get(`bots/${GetTokenDecoded().cuenta_id}`);
    if (status === 200) {
      setBots(data.data);
    }
  };

  const ListarBotUnico = async (nombreunico) => {
    const { data, status } = await BmHttp().get(`bot/${nombreunico}`);
    if (status === 200 && data.status === 200) {
      setSdk(data.data.sdk);
      setId(data.data.id)
      return true
    }else{
      setSdk(null)
      return false
    }
  }

  const DublicarBot = async () => {
    try {
      const { data, status } = await BmHttp().post('bot_webchat', {id});
      if (status === 200) {
        setSdk(data.data);
        setId(data.id)
        setOpenConfirmaWebChat(!openConfirmaWebChat);
        Swal.fire({
          title: "Se creo el webchat correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 500,
        });
        setTimeout(() => {
          setOpenWebChat(!openWebChat);
        },800)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const GuardarBot = async () => {
    if (perfil && userFb) {
      await SuccessSetuserFb();
    } else {
      const { data, status } = await BmHttp().post(`bots`, bot);
      if (data.status === 200) {
        setShow(!show);
        Swal.fire({
          title: "Bot guardado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          ListarBots()
          ListarBots()
          Limpiar()
          FacebookLoginClient.logout()
        });
      } else if (data.status === 400 && data.message === "No puedes crear mas bots") {
        Swal.fire({
          title: "Error al guardar el bot",
          text: "No puedes crear mas bots limita de bots alcanzado actualiza tu plan",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Actualizar plan",
          confirmButtonColor: colorPrimario,
          cancelButtonText: "Cerrar",
          cancelButtonColor: "red",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/admin/suscripciones'
          }
        });
      } else {
        Swal.fire({
          title: "Error al guardar el bot",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  }

  const Actualizar = async () => {
    const { status } = await BmHttp().put(`bots/${bot.id}`, bot);
    if (status === 200) {
      setShow(!show);
      Swal.fire({
        title: "Bot actualizado",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      ListarBots();
      Limpiar();
    }
  }

  const EliminarBots = async (id) => {
    Swal.fire({
      title: "¿Estas seguro de eliminar el bot?",
      text: "No podras recuperar la informacion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { status } = await BmHttp().delete(`bots/${id}`);
        if (status === 200) {
          ListarBots();
        }
      }
    });
  }

  useEffect(() => {
    (async () => {
      await ListarCanal();
      await ListarBots();
      await ListarPlantillaBot();
      // await loadFB();
    })();
  }, []);

  const loadFB = async() => {
    FacebookLoginClient.logout();
    await FacebookLoginClient.loadSdk('es_LA');
    FacebookLoginClient.init({
      appId: "3176667395950990",
      version: "v19.0",
    });
  }

  const Limpiar = () => {
    setBot({
      id: 0,
      cuenta_id: GetTokenDecoded().cuenta_id,
      channel_id: 0,
      nombre_bot: "",
      pagina: "",
      numero_telefono: "",
      plantilla: "",
      identificador: "",
      IdWhatsAppBusiness: "",
      nombreunico: "",
      access_token: "",
      api_key: "",
      api_telegram: "",
      srcname: "",
      source: "",
      flowise: false,
      leer_mensaje: true,
      bot_respuesta: true,
    });
  };

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
        return "https://via.placeholder.com/50x50";
    }
  };

  const OpenModalQr = (nombreunico, estado) => {
    setEstadoQr({
      estado: estado,
      nombreunico: nombreunico,
    });
    if(estado !== 'online'){
      listarQrNombreunico(nombreunico)
    }
    handleopQr();
  };

  const listarQrNombreunico = async (nombreunico)=>{
    try {
      console.log("listarQrNombreunico: "+nombreunico)
      const { data } = await BmHttp().get('qr/link?nombreunico='+nombreunico)
      if(data.status === 200){
        console.log(data.data)
        setLinkQr(data.data.qr)
      }
    } catch (error) {
      console.log(error)      
    }
  }

  const reconnexionQr = (nombreunico) => {
    Swal.fire({
      title: "¿Estas seguro de reconectar el bot?",
      text: "En este proceso se cerrara la sesion y se volvera a escanear el codigo QR",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then(async (result) => {
      if(result.isConfirmed){
        await BmHttp().get(`reconectar_qr?sessionName=${nombreunico}`)
      }
    });
  };

  const ScannerQR = (id, nombreunico, estado) => {
    if (id === 2) {
      return (
        <>
          <button className="bot-card-buttons-btn"
            onClick={() => OpenModalQr(nombreunico, estado)}
          >
            <span className="material-symbols-outlined text-success">qr_code_2</span> 
          </button>
        </>
      );
    } else {
      return null;
    }
  }

  const EstadoSession = () => {
    if (estadoQr.estado && estadoQr.nombreunico) {
      fetch(`estado_session?sessionName=${estadoQr.nombreunico}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setEstadoQr({
              estado: data.message,
              nombreunico: estadoQr.nombreunico,
            });
          }
        });
    }
  }

  const DesconectarQr = (nombreunico) => {
    Swal.fire({
      title: "¿Estas seguro de desconectar el bot?",
      text: "Se cerrara la sesion del bot",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          const url = `qr_close/${nombreunico}`;
          const { data } = await BmHttp().post(url);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    let intervalId;
    if (opQr) {
        if (estadoQr.estado !== 'online') {
            console.log("estadoQr: ", estadoQr);
            intervalId = 
            setInterval(async () => {
                // await RecargarLink(estadoQr.nombreunico)
                // console.log("This will run every 3 seconds!");
                actualizarImagen()
                EstadoSession()
            }, 900);
            return () => {
                clearInterval(intervalId);
            };
        }
    }
    // Cleanup interval when opQr or estadoQr changes
    return () => {
        clearInterval(intervalId);
    };
}, [opQr, estadoQr]);

  function actualizarImagen() {
    const img = document.getElementById('qrImage');
    // Construir la URL de la imagen
    const timestamp = new Date().getTime(); // Obtiene una marca de tiempo única
    const imageUrl = `${host()}qr/${estadoQr.nombreunico}.png?timestamp=${timestamp}`;
    // Actualizar el atributo src de la imagen
    img.src = imageUrl;
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
      flowise: item.flowise,
      leer_mensaje: item.leer_mensaje,
      bot_respuesta: item.bot_respuesta
    });
    setShow(!show);
  };

  const SuccessSetuserFb = async (datoss) => {
    try {
      if (userFb && perfil) {
        let datos = {
          ...userFb,
          plantilla: bot.plantilla,
          name: perfil.name,
          email: perfil.email,
          url: perfil.picture.data.url,
          access_token_pagina: perfil.accounts.data[0].access_token,
          accounts: perfil.accounts,
        };
        setUserFb(null);
        const { data, status } = await BmHttp().post(`webhookFConfig?cuenta_id=${GetTokenDecoded().cuenta_id}`, datos);
        if (status === 200) {
          await ListarBots();
          setShow(!show);
          Swal.fire({
            title: "Bot guardado",
            icon: "success",
            showConfirmButton: false,
            timer: 800,
          });
          await ListarBots();
          Limpiar();
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log("error");
      return error;
    }
  };

  return (
    <>
      <Container fluid>
        <div className="d-flex justify-content-start mb-3">
          <button className="button-bm active ml-2" onClick={handleClose}>
            CREAR BOT
          </button>
          {/* <FacebookLoginApp/> */}
        </div>

        <div className="row my-4">
          {bots.map((bot, index) => {
            if(bot.channel_id !== 12 && bot.channel_id !== 10){
              return <div className="col-12 col-md-6 col-lg-4 mb-5" key={index+1}>
                <div className="bot-card shadow">
                  <div className="bot-card-img p-1 rounded-circle shadow">
                    <img src={InconBot(bot.channel_id, bot.url_perfil)} width={60} className="rounded-circle"/>
                  </div>

                  <div className="w-100 bot-card-detail mt-2">
                    <h4 className="text-blue font-bold" 
                      style={{ lineHeight: '15px' }}>{String(bot.nombre_bot).length > 15 ? String(bot.nombre_bot).substring(0, 10) + "..." : bot.nombre_bot}</h4>
                    <h5 className="text-secondary" style={{ fontSize: '16px' }}>{bot.numero_telefono.substring(0, 11)}</h5>
                    <h5 className="text-secondary" style={{ fontSize: '16px' }}>Estado: {bot.estado}</h5>
                    <h5 className="text-secondary" style={{ fontSize: '16px' }}>Session: {bot.nombreunico}</h5>

                  </div>

                  {/*  Mostrar el boton de qr*/}
                  <div className="w-100 d-flex flex-row gap-3 justify-content-center flex-wrap bot-card-buttons">
                    {ScannerQR(bot.channel_id, bot.nombreunico, bot.estado)}

                    {/* butto icono de webchat */}
                    <button className="bot-card-buttons-btn"
                      onClick={() => handleOpenWebChat(bot.id, bot.nombreunico)}
                    >
                      {/* icono de webchat */}
                      <span className="material-symbols-outlined text-secondary">chat</span>
                    </button>

                    <button className="bot-card-buttons-btn" onClick={() => ActivaModalEditar(bot)}>
                      <span className="material-symbols-outlined text-secondary">edit_square</span>
                    </button>

                    <button className="bot-card-buttons-btn" onClick={() => EliminarBots(bot.id)}>
                      <span className="material-symbols-outlined text-secondary">delete</span>
                    </button>

                    <button className="bot-card-buttons-btn"
                      onClick={() =>{
                        if(bot.url){
                          let url = bot.url.replaceAll("http://146.190.75.219:3022", "https://flashbot.bot")
                          if(bot.flowise){
                            window.open(`${url}`,"_blank")  
                          }else{
                            window.open(`${url}?cuenta_id=${bot.cuenta_id}`,"_blank")
                          }
                        }else{
                          ListarBots()
                          let url = bot.url.replaceAll("http://146.190.75.219:3022", "https://flashbot.bot")
                          if(bot.flowise){
                            window.open(`${url}`,"_blank")  
                          }else{
                            window.open(`${url}?cuenta_id=${bot.cuenta_id}`,"_blank")
                          }
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-secondary">manufacturing</span>
                    </button>
                  </div>
                </div>
              </div>
            }else{
              return null
            }
          })}
        </div>

        <Modal
          size="md"
          show={show}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header>
            {bot.id === 0 ? (
              <Modal.Title>Crear bot</Modal.Title>
            ) : (
              <Modal.Title>Editar bot</Modal.Title>
            )}
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handleClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="description">Canal</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  value={bot.channel_id}
                  onChange={(e) =>
                    setBot({ ...bot, channel_id: parseInt(e.target.value) })
                  }
                  disabled={bot.id !== 0}
                >
                  <option>Seleccione</option>
                  {canales.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.proveedor}
                    </option>
                  ))}
                </select>
              </div>
              {/* Checkout para flowise o tipebot */}
              <div className="form-group">
                <label htmlFor="description">
                  Flowise
                  <b
                    className="text-secondary"
                    style={{ fontSize: "12px" }}
                  > (Crear tu bot con inteligencia artifical ChatGpt, Llama)</b>
                </label>
                <input type="checkbox"
                  className="mx-2"
                  id="exampleFormControlSelect1"
                  checked={bot.flowise}
                  onChange={(e) =>
                    setBot({ ...bot, flowise: e.target.checked })
                  }
                />
              </div>
              {/* Leer mensaje  solo si es qr */}

              {
                bot.channel_id === 2 ? (
                  <div className="form-group">
                    <label htmlFor="description">
                      Leer mensaje
                      <b
                        className="text-secondary"
                        style={{ fontSize: "12px" }}
                      > (Leer mensajes de los usuarios)</b>
                    </label>
                    <input type="checkbox"
                      className="mx-2"
                      id="exampleFormControlSelect1"
                      checked={bot.leer_mensaje}
                      onChange={(e) =>
                        setBot({ ...bot, leer_mensaje: e.target.checked })
                      }
                    />
                  </div>
                ) : null
              }

              {/* Bot response */}
              <div className="form-group">
                <label htmlFor="description">
                  Bot response
                  <b
                    className="text-secondary"
                    style={{ fontSize: "12px" }}
                  > (Responder mensajes de los usuarios)</b>
                </label>
                <input type="checkbox"
                  className="mx-2"
                  id="exampleFormControlSelect1"
                  checked={bot.bot_respuesta}
                  onChange={(e) =>
                    setBot({ ...bot, bot_respuesta: e.target.checked })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Modelo de bot</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  value={bot.plantilla}
                  onChange={(e) =>
                    setBot({ ...bot, plantilla: e.target.value })
                  }
                  disabled={bot.id !== 0}
                >
                  <option>Seleccione un modelo</option>
                  {botPlantilla.map((item, index) => (
                    <option key={index} value={item.plantilla}>
                      {item.plantilla}
                    </option>
                  ))}
                </select>
              </div>
              {bot.channel_id === 6 || bot.channel_id === 8 ? null : (
                <div className="form-group">
                  <label htmlFor="tiempo">Nombre bots</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre_bot"
                    placeholder="Nombre Bots"
                    value={bot.nombre_bot}
                    // el nombre del bot no puede tener espacios
                    onChange={(e) =>
                      setBot({
                        ...bot,
                        nombre_bot: e.target.value.replace(/\s/g, ""),
                      })
                    }
                  />
                </div>
              )}
              {
                // si el canal es facebook o instagram
                bot.channel_id === 6 || bot.channel_id === 8 ? (
                  <>
                  {/* <FacebookLoginApp/> */}
                    <FacebookLogin
                      appId="3176667395950990"
                      // appId="398382928426980"
                      fields="email,name,picture,accounts"
                      scope={bot.channel_id === 8 ? permiso_instagram : permiso_facebook}
                      autoLoad={true}
                      onSuccess={(response) => {
                        console.log('Login Success!', response);
                        setUserFb(response);
                      }}
                      onFail={(error) => {
                        console.log("Login Failed!", error);
                      }}
                      onProfileSuccess={(response) => {
                        console.log("Get Profile Success!", response);
                        setPerfil(response);
                      }}
                      // siempre al inicio de sesion para que el usuario ponga la cuenta de facebook que quiere usar
                      onProfileFail={(error) => {
                        console.log("Get Profile Failed!", error);
                      }}
                      style={{
                        backgroundColor:
                          bot.channel_id === 8 ? "#e1306c" : "#3b5998",
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
                      {bot.channel_id === 8 ? (
                        <>
                          <i className="fab fa-instagram"></i> Conectar con
                          Instagram
                        </>
                      ) : (
                        <>
                          <i className="fab fa-facebook-f"></i> Conectar con
                          Facebook
                        </>
                      )}
                    </FacebookLogin>
                  </>
                ) : null
              }
              {bot.channel_id === 6 || bot.channel_id === 8 ? null : (
                <div className="form-group">
                  <label htmlFor="mensaje">Numero Telefono</label>
                  <input
                    className="form-control"
                    id="numero_telefono"
                    value={bot.numero_telefono}
                    onChange={(e) =>
                      setBot({ ...bot, numero_telefono: e.target.value })
                    }
                  />
                </div>
              )}
              {bot.channel_id === 3 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">Identificador</label>
                  <input
                    className="form-control"
                    id="identificador"
                    value={bot.identificador}
                    onChange={(e) =>
                      setBot({ ...bot, identificador: e.target.value })
                    }
                  />
                </div>
              ) : null}
              {bot.channel_id === 3 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">IdWhatsAppBusiness</label>
                  <input
                    className="form-control"
                    id="IdWhatsAppBusiness"
                    value={bot.IdWhatsAppBusiness}
                    onChange={(e) =>
                      setBot({ ...bot, IdWhatsAppBusiness: e.target.value })
                    }
                  />
                </div>
              ) : null}
              {bot.channel_id === 3 || bot.channel_id === 5 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">Token Accesso</label>
                  <input
                    className="form-control"
                    id="access_token"
                    value={bot.access_token}
                    onChange={(e) =>
                      setBot({ ...bot, access_token: e.target.value })
                    }
                  />
                </div>
              ) : null}
              {bot.channel_id === 1 || bot.channel_id === 4 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">api_key</label>
                  <input
                    className="form-control"
                    id="api_key"
                    value={bot.api_key}
                    onChange={(e) =>
                      setBot({ ...bot, api_key: e.target.value })
                    }
                  />
                </div>
              ) : null}
              {bot.channel_id === 7 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">api_telegram</label>
                  <input
                    className="form-control"
                    id="api_telegram"
                    value={bot.api_telegram}
                    onChange={(e) =>
                      setBot({ ...bot, api_telegram: e.target.value })
                    }
                  />
                </div>
              ) : null}
              {bot.channel_id === 5 ? (
                <>
                  <div className="form-group">
                    <label htmlFor="mensaje">srcname</label>
                    <input
                      className="form-control"
                      id="srcname"
                      value={bot.srcname}
                      onChange={(e) =>
                        setBot({ ...bot, srcname: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mensaje">source</label>
                    <input
                      className="form-control"
                      id="source"
                      value={bot.source}
                      onChange={(e) =>
                        setBot({ ...bot, source: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : null}
              {bot.channel_id === 3 && bot.id !== 0 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">Webhook</label>
                  <input
                    className="form-control"
                    id="IdWhatsAppBusiness"
                    disabled={true}
                    value={`${host()}webhookCloud?bots=${bot.nombreunico}`}
                  />
                  <CopyToClipboard
                    text={`${host()}webhookCloud?bots=${bot.nombreunico}`}
                  >
                    <a href={"#"} className="">
                      Copiar
                    </a>
                  </CopyToClipboard>
                </div>
              ) : null}
              {bot.channel_id === 5 && bot.id !== 0 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">Webhook</label>
                  <input
                    className="form-control"
                    id="WebHookGupsup"
                    disabled={true}
                    value={`${host()}webhookGupshup?bots=${bot.nombreunico}`}
                  />
                  <CopyToClipboard
                    text={`${host()}webhookGupshup?bots=${bot.nombreunico}`}
                  >
                    <a href={"#"} className="">
                      Copiar
                    </a>
                  </CopyToClipboard>
                </div>
              ) : null}
              {bot.channel_id === 3 && bot.id !== 0 ? (
                <div className="form-group">
                  <label htmlFor="mensaje">Webhook</label>
                  <input
                    className="form-control"
                    id="IdWhatsAppBusiness"
                    disabled={true}
                    value="testing-flashchat"
                  />
                  <CopyToClipboard text={"testing-flashchat"}>
                    <a href={"#"}>Copiar</a>
                  </CopyToClipboard>
                </div>
              ) : null}
              {bot.id === 0 ? (
                <button
                  type="submit"
                  className="button-bm w-100 mt-3"
                  onClick={(e) => {
                    e.preventDefault();
                    GuardarBot();
                  }}
                >
                  Guardar
                </button>
              ) : (
                <button
                  type="submit"
                  className="button-bm w-100 mt-3"
                  onClick={(e) => {
                    e.preventDefault();
                    Actualizar();
                  }}
                >
                  Actualizar
                </button>
              )}
            </form>
          </Modal.Body>
        </Modal>
        <Modal
          size="md"
          show={opQr}
          // onHide={()=>setPerfil(null)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header>
            <Modal.Title>Por favor scanne el codigo QR</Modal.Title>
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handleopQr}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group d-flex justify-content-center align-items-center">
              <p>
                Estado:{" "}
                <span
                  className=""
                  style={{
                    color:
                      estadoQr.estado === "QR: online" ? colorPrimario : "red",
                  }}
                >
                  {estadoQr.estado}
                </span>
              </p>
            </div>
            <div className="form-group d-flex justify-content-center align-items-center">
              <div
                style={{
                  height: "347px",
                  width: "347px",
                  borderRadius: "5px",
                  border: "2px solid #fff",
                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                }}
              >
                {/* que se recarge la imagen  */}
                  <img id="qrImage" alt="qr" width="100%" height="100%" />

              </div>
            </div>
            <div className="text-center m-2">
              <span className="text-center text-muted small">
                Escanea el codigo QR para iniciar sesion
              </span>
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="button-bm w-100 mt-3"
                  onClick={() => {
                    reconnexionQr(estadoQr.nombreunico);
                  }}
                >
                  Recargar QR
                </button>
                <button
                  className="button-bm w-100 mt-3"
                  onClick={() => {
                    DesconectarQr(estadoQr.nombreunico);
                  }}
                >
                  Desconectar
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <ModelSdk
          show={openWebChat}
          handleClose={handleCloseWebChat}
          setSdk={setSdk}
          sdk={sdk}
          setRuta={setRuta}
          ruta={ruta}
          id={id}
          handleCambiosdk={handleCambiosdk}
          AcualizarSdk={AcualizarSdk}
        />


        <Modal
          size="md"
          show={openConfirmaWebChat}
          onHide={()=>setOpenConfirmaWebChat(!openConfirmaWebChat)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          {/* modal para confirmar que quiere activar el Webchat para este bot */}
          <Modal.Header>
            <Modal.Title>Activa WebChat</Modal.Title>
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={()=>setOpenConfirmaWebChat(!openConfirmaWebChat)}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group d-flex justify-content-center align-items-center">
              <p>
                ¿Desea activar el WebChat para este bot?
              </p>
            </div>
            <div className="text-center m-2">
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="button-bm w-100 mt-3"
                  onClick={async() => {
                    await DublicarBot()
                  }}
                >
                  Activar
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default Bots;
