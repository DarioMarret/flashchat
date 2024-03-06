import FacebookLogin from "@greatsumini/react-facebook-login";
import d360 from "assets/img/360.jpeg";
import AI from "assets/img/chatgpt.png";
import cloud from "assets/img/cloud.png";
import QR from "assets/img/codigo-qr-whatsapp.png";
import gupshup from "assets/img/gupshup.jpeg";
import instagram from "assets/img/instagram.jpeg";
import telegram from "assets/img/telegram.jpeg";
import axios from "axios";
import { GetTokenDecoded } from "function/storeUsuario";
import { colorPrimario, host } from "function/util/global";
import { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";

function ChatBots(props) {
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
  });
  const [bots, setBots] = useState([]);
  const [botPlantilla, setBotPlantilla] = useState([]);
  const [userFb, setUserFb] = useState(null);
  const [perfil, setPerfil] = useState(null);

  const handleClose = () => {
    setShow(!show);
    Limpiar();
  };

  const handleopQr = () => {
    setOpQr(!opQr);
  };

  const ListarPlantillaBot = async () => {
    const url = `${host}bots_plantillas`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setBotPlantilla(data.data);
    }
  };

  const ListarCanal = async () => {
    const url = `${host}canales`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setCanales(data.data);
    }
  };

  const ListarBots = async () => {
    const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setBots(data.data);
    }
  };

  const GuardarBot = async () => {
    if (perfil && userFb) {
      await SuccessSetuserFb();
    } else {
      const url = `${host}bots`;
      const { data, status } = await axios.post(url, bot);
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
    const url = `${host}bots/${bot.id}`;
    const { status } = await axios.put(url, bot);
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
        const url = `${host}bots/${id}`;
        const { status } = await axios.delete(url);
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
    })();
  }, []);

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
    handleopQr();
  };

  const reconnexionQr = (nombreunico) => {
    Swal.fire({
      title: "¿Estas seguro de reconectar el bot?",
      text: "En este proceso se cerrara la sesion y se volvera a escanear el codigo QR",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then(async (result) => {
      const url = `${host}reconectar/${nombreunico}`;
      fetch(url);
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
      fetch(`${host}/estado_session?sessionName=${estadoQr.nombreunico}`)
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

  const RecargarQr = () => {
    if (estadoQr.estado && estadoQr.nombreunico) {
      let linkQr = `${host}qr/${estadoQr.nombreunico}.png`;
      setLinkQr(linkQr);
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
          const url = `${host}qr_close/${nombreunico}`;
          const { data } = await axios.post(url);
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    EstadoSession();
    RecargarQr();
    var interval = null;
    if (opQr) {
      interval = setInterval(() => {
        EstadoSession();
        RecargarQr();
        console.log("This will run every 3 seconds!");
      }, 3000);
    } else {
      clearInterval(interval);
    }
  }, [opQr]);

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
  };

  const SuccessSetuserFb = async (datoss) => {
    try {
      if (userFb && perfil) {
        let datos = {
          ...userFb,
          name: perfil.name,
          email: perfil.email,
          url: perfil.picture.data.url,
        };
        setUserFb(null);
        const { data, status } = await axios.post(`${host}webhookFConfig?cuenta_id=${GetTokenDecoded().cuenta_id}`, datos);
        if (status === 200) {
          console.log("response: ", data);
          setShow(!show);
          Swal.fire({
            title: "Bot guardado",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          })
          ListarBots();
          ListarBots();
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
            Crear nuevo bot
          </button>
        </div>

        <div className="row my-4">
          {bots.map((bot, index) => (
            <div className="col-12 col-md-6 col-lg-4 mb-5">
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

                <div className="w-100 d-flex flex-row gap-3 justify-content-center flex-wrap 
                bot-card-buttons">
                  {ScannerQR(bot.channel_id, bot.nombreunico, bot.estado)}


                  <button className="bot-card-buttons-btn" onClick={() => ActivaModalEditar(bot)}>
                    <span class="material-symbols-outlined text-secondary">edit_square</span>
                  </button>

                  <button className="bot-card-buttons-btn" onClick={() => EliminarBots(bot.id)}>
                    <span class="material-symbols-outlined text-secondary">delete</span>
                  </button>

                  <button className="bot-card-buttons-btn"
                    onClick={() =>window.open(`${bot.url}?cuenta_id=${bot.cuenta_id}`,"_blank")}
                  >
                    <span class="material-symbols-outlined text-secondary">manufacturing</span>
                  </button>
                </div>  
              </div>
            </div>
          ))}
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
              <div className="form-group">
                <label htmlFor="description">Plantilla Bot</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  value={bot.plantilla}
                  onChange={(e) =>
                    setBot({ ...bot, plantilla: e.target.value })
                  }
                  disabled={bot.id !== 0}
                >
                  <option>Seleccione una plantilla</option>
                  {botPlantilla.map((item, index) => (
                    <option key={index} value={item.plantilla}>
                      {item.plantilla}
                    </option>
                  ))}
                </select>
              </div>
              {bot.channel_id === 6 || bot.channel_id === 8 ? null : (
                <div className="form-group">
                  <label htmlFor="tiempo">Nombre Bots</label>
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
                    <FacebookLogin
                      appId="3176667395950990"
                      // obtener el identificador de la pagina
                      fields="email,name,picture,accounts"
                      // que liste las paginas que tiene el usuario
                      // obtener el identificador de la pagina
                      scope="pages_show_list,email,public_profile,pages_messaging,pages_manage_metadata,pages_messaging_subscriptions"
                      autoLoad={true}
                      onSuccess={(response) => {
                        // console.log('Login Success!', response);
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
                    value={`${host}webhookCloud?bots=${bot.nombreunico}`}
                  />
                  <CopyToClipboard
                    text={`${host}webhookCloud?bots=${bot.nombreunico}`}
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
                    value={`${host}webhook_gupshup?bots=${bot.nombreunico}`}
                  />
                  <CopyToClipboard
                    text={`${host}webhook_gupshup?bots=${bot.nombreunico}`}
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
                {linkQr ? (
                  <img src={linkQr} alt="qr" width="100%" height="100%" />
                ) : (
                  <img
                    src={`${host}qr/${estadoQr.nombreunico}.png`}
                    alt="qr"
                    width="100%"
                    height="100%"
                  />
                )}
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
      </Container>
    </>
  );
}

export default ChatBots;
