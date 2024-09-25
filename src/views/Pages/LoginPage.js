import logo from "assets/img/logo512.png";
import { setDatosUsuario } from "function/storeUsuario";
import { DecodeJwt } from "function/util/ecrypt";
import { BmHttp, colorPrimario, colorSecundario, HoraServer, host, HttpLogin, tabconversacion } from "function/util/global";
import useAuth from "hook/useAuth";
import React from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import FlashChat from "views/Components/FlashChat/FlashChat";


const LoginPage =(props)=> {
  const dispatch = useDispatch();
  const [cardClasses, setCardClasses] = React.useState("card-hidden");
  const [demoStatus, setDemoStatus] = React.useState(false);
  const [type, setType] = React.useState("password");
  const [agenda, setAgenda] = React.useState({
    fecha: "",
    nombre: "",
    correo: "",
    telefono: "",
    detalle: "",
  })
  React.useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 100);
  })
  // fechaActual mas 7 dias
  const fechaMaxima = new Date()
  fechaMaxima.setDate(fechaMaxima.getDate() + 7)
  fechaMaxima.setHours(18)

  const [usuario, setUsuario] = React.useState({
    correo: "",
    clave: "",
  })

  const handleInputChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  }
  
  const AgendarDemo = async (event) => {
    event.preventDefault();
    console.log(agenda)
    if(agenda.correo === "" || agenda.fecha === "" || agenda.telefono === "" || agenda.detalle === "" || agenda.nombre === ""){
      Swal.fire({
        title: 'Error',
        html: '<p className="text-white">Todos los campos son obligatorios</p>',
        confirmButtonColor: '#000',
        timer: 1500
      })
    }else{
      const { data, status } = await BmHttp().post(`${host()}agendar_demo`, agenda);
      console.log(data)
      if (status === 200) {
        Swal.fire({
          title: 'Exito',
          html: '<p className="text-white">Hemos recibido tu solicitud</p>',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#000',
          timer: 1500
        }).then(() => {
          setDemoStatus(false);
          setAgenda({
            fecha: "",
            correo: "",
            telefono: "",
            mensaje: "",
          })
        })
        // limpiar campos
      } else {
        Swal.fire({
          title: 'Error',
          html: '<p className="text-white">Error de conexión</p>',
          confirmButtonColor: '#000',
          timer: 2000
        })
      }
    }
  }

  const { login, setReloadUser } = useAuth();

  // separar la hora por : para convertirn en numero
  const separarHora = (hora) => {
    return parseFloat(hora.split(":").join("."));
  }
  
  const Login = async (event) => {
    event.preventDefault();
    if (usuario.correo === "" || usuario.clave === "") {
      Swal.fire({
        title: 'Error',
        html: '<p class="text-white">Todos los campos son obligatorios</p>',
        confirmButtonColor: '#000',
        timer: 1500
      });
      return;
    }
    
    try {
      const { data, status } = await HttpLogin().post(`login`, usuario);
      
      if (status === 200) {
        if (data.status === 200) {
          let info_token = await DecodeJwt(data.token);
          const { activar_ini, horario_ini, activar_fin, horario_fin } = info_token;
          if (!activar_ini) {
            setDatosUsuario(data.token);
            login(data.token);
            setReloadUser(true);
          } else {
            let hora_actual = await HoraServer();
            if (hora_actual === null) return;
            const { hora } = hora_actual;
            if (separarHora(hora) >= separarHora(horario_ini) && separarHora(hora) <= separarHora(horario_fin)) {
              setDatosUsuario(data.token);
              login(data.token);
              localStorage.setItem(tabconversacion, 'Sin leer');
              setReloadUser(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error de tiempo',
                text: `Usuario inactivado temporalmente. Hora de inicio: ${horario_ini} `,
                confirmButtonColor: colorPrimario,
                timer: 2000
              });
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            html: '<p class="text-black">Usuario o contraseña incorrectos</p>',
            confirmButtonColor: colorSecundario
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: '<p class="text-black">Error de conexión</p>',
          confirmButtonColor: colorSecundario,
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        html: '<p class="text-black">Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde.</p>',
        confirmButtonColor: colorSecundario,
        timer: 2000
      });
    }
  };

  return (
    <>
      <div
        className="full-page section-image d-flex align-items-center"
        // data-color="black"
        data-image={require("assets/img/1.png")}
        style={{ height: '100vh' }}
      >
        <div className="container content d-flex justify-content-center align-items-center p-0">
          <div className="row w-100">
            <div className="col-12 col-md-6 col-lg-8 d-none d-md-flex d-flex flex-column align-items-center justify-content-center">
              <div className="text-center">
                <h3 className="text-uppercase mx-auto text-obten font-600 text-center typing">Obtén tu cuenta demo por 5 días !</h3>

                <p className="text-black frasphe text-center mx-auto my-3">Descubre la revolución en atención al cliente con nuestro innovador chatbot durante 5 días de demo gratuito</p>
                <button className="btn-outline-white" 
                onClick={() => setDemoStatus(!demoStatus)}>Quiero mi demo</button>
              </div>
            </div>
            {
              demoStatus ?
              <>
               {/* formulario para agendar un demos */}
              <div className="col-12 col-md-6 col-lg-4">
                <Form action="" className="form" method="">
                  <Card className={"card-login background-backdrop" + cardClasses}>
                    <Card.Header>
                      <h4 className="header text-center">Agenda tu demo</h4>
                      {/* <h3 className="header text-center font-bold">FlashChat</h3> */}
                      <FlashChat />
                      <hr/>
                    </Card.Header>
                      <Card.Body>
                      {/* fecha y hora en la que te podemos contactar */}
                      <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                          <span className="material-symbols-outlined" style={{marginRight: '5px'}}>event</span>
                            Fecha y hora</label>
                          <Form.Control
                            placeholder="Fecha y hora"
                            type="datetime-local"
                            max={fechaMaxima}
                            min={new Date().toISOString().split('T')[0] + 'T09:00'}
                            name="fecha"
                            onChange={(e) => setAgenda({...agenda, fecha: e.target.value})}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group className="">
                          <label className="font-600 d-flex align-items-center">
                          <span className="material-symbols-outlined" style={{marginRight: '5px'}}>person</span>
                            Nombre</label>
                          <Form.Control
                            placeholder="Nombre por el cual te podemos llamar"
                            type="text"
                            name="nombre"
                            onChange={(e) => setAgenda({...agenda, nombre: e.target.value})}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group className="">
                          <label className="font-600 d-flex align-items-center">
                          <span className="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span>
                            Correo electrónico</label>
                          <Form.Control
                            placeholder="Correo electrónico"
                            type="email"
                            name="correo"
                            onChange={(e) => setAgenda({...agenda, correo: e.target.value})}
                          ></Form.Control>
                        </Form.Group>
                        {/* contacto */}
                        <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                          <span className="material-symbols-outlined" style={{marginRight: '5px'}}>phone</span>
                            Teléfono</label>
                          <Form.Control
                            placeholder="Teléfono"
                            type="text"
                            name="telefono"
                            onChange={(e) => setAgenda({...agenda, telefono: e.target.value})}
                          ></Form.Control>
                        </Form.Group>
                        {/* mensaje */}
                        <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                          <span className="material-symbols-outlined" style={{marginRight: '5px'}}>message</span>
                            Mensaje</label>
                          <Form.Control
                            placeholder="Detallanos tu necesidad o duda"
                            className="form-control textarea h-auto"
                            as="textarea"
                            cols={3}
                            rows={3}
                            name="detalle"
                            onChange={(e) => setAgenda({...agenda, detalle: e.target.value})}
                          ></Form.Control>
                        </Form.Group>
                      </Card.Body>
                    <Card.Footer className="ml-auto mr-auto">
                      <Button className="button-bm w-100" type="submit" variant="dark"
                        onClick={AgendarDemo}
                      >
                        {/* en espanol */}
                        Enviar
                      </Button>
                      {/* <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                        <a className="text-link" onClick={() => props.setEstados(false)}>Regístrate</a>
                      </div>                       */}
                    </Card.Footer>
                  </Card>
                </Form>
              </div>
              </> : 
              <div className="col-12 col-md-6 col-lg-4">
                <Form action="" className="form" method="">
                  <Card className={"card-login background-backdrop" + cardClasses}>
                    <Card.Header>
                      {/* <h4 className="header text-center">Bienvenido</h4> */}
                      {/* <h3 className="header text-center font-bold">FlashChat</h3> */}
                      <div className="d-flex justify-content-center align-items-center">
                        <img src={logo} alt="FlashChat" className="logo" 
                          style={{width: '100px', height: '100px'}}
                        />
                      </div>
                      <FlashChat />
                      <hr/>
                    </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-4">
                          <label className="font-600 d-flex align-items-center">
                          {/* <span className="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span> */}
                            Correo electrónico</label>
                          <div className="d-flex align-items-center"
                            style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '5px' }} // Ajuste de borde y padding
                          >
                            <span className="material-symbols-outlined" style={{ marginLeft: '5px',
                              marginRight: '5px',
                              padding: '5px',
                              borderRight: '1px solid #ced4da',
                            }} // Ajuste de espacio entre el campo y el ícono
                            >
                              mail
                            </span>

                            <Form.Control
                              placeholder="correo@email.com"
                              type="email"
                              name="correo"
                              value={usuario.correo}
                              onChange={handleInputChange}
                              style={{ boxShadow: 'none', flexGrow: 1,
                                border: 'none', outline: 'none', padding: '0', margin: '0',
                                backgroundColor: 'transparent',
                              }} // Asegura que el input ocupe todo el espacio disponible
                            ></Form.Control>
                          </div>
                        </Form.Group>
  
                        <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                            {/* <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>
                              lock
                            </span> */}
                            Contraseña
                          </label>
                          
                          <div className="d-flex align-items-center"
                            style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '5px' }} // Ajuste de borde y padding
                          >
                            {/* Añadir para ver la contraseña */}
                            <span 
                              className="material-symbols-outlined" 
                              style={{ cursor: 'pointer', marginLeft: '5px',
                                marginRight: '5px',
                                padding: '5px',
                                borderRight: '1px solid #ced4da',
                              }} // Ajuste de espacio entre el campo y el ícono
                              onClick={() => setType(type === "password" ? "text" : "password")}
                            >
                              {type === "password" ? "visibility_off" : "visibility"}
                            </span>
                            <Form.Control
                              placeholder="********"
                              type={type}
                              name="clave"
                              value={usuario.clave}
                              onChange={handleInputChange}
                              style={{ boxShadow: 'none', flexGrow: 1,
                                border: 'none', outline: 'none', padding: '0', margin: '0',
                                backgroundColor: 'transparent',
                               }} // Asegura que el input ocupe todo el espacio disponible
                            />
                            

                          </div>
                        </Form.Group>

                      </Card.Body>
                    <Card.Footer className="ml-auto mr-auto">
                      <button className="button-bm w-100" type="submit"
                        onClick={Login}
                      >
                        {/* en espanol */}
                        Iniciar sesión 
                      </button>
  
                      <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                        <span className="text-span">- No tienes cuenta - </span>
                        <a className="text-link" onClick={() => props.setEstados(false)}>Regístrate</a>
                      </div>
                    </Card.Footer>
                  </Card>
                </Form>
              </div>
            }
          </div>
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage:
              "url(" + require("assets/img/2.png") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default LoginPage;