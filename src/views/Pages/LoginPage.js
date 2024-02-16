import axios from "axios";
import { host, usuario_token } from "function/util/global";
import useAuth from "hook/useAuth";
import React from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form
} from "react-bootstrap";
import Swal from "sweetalert2";


const LoginPage =(props)=> {
  const [cardClasses, setCardClasses] = React.useState("card-hidden");
  const [demoStatus, setDemoStatus] = React.useState(false);
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
      const { data, status } = await axios.post(`${host}agendar_demo`, agenda);
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
  
  const Login = async (event) => {
    event.preventDefault();
    if(usuario.correo === "" || usuario.clave === ""){
      Swal.fire({
        title: 'Error',
        html: '<p className="text-white">Todos los campos son obligatorios</p>',
        confirmButtonColor: '#000',
        timer: 1500
      })
    }else{
      const { data, status } = await axios.post(`${host}login`, usuario);
      if (status === 200) {
        if (data.status === 200) {
          localStorage.setItem(usuario_token, JSON.stringify(data.token));
          login(data.token);
          setReloadUser(true);
        } else {
          Swal.fire({
            title: 'Error',
            html: '<p className="text-white">Usuario o contraseña incorrectos</p>',
            confirmButtonColor: '#000',
          })
        }
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

  return (
    <>
      <div
        className="full-page section-image d-flex align-items-center"
        data-color="black"
        data-image={require("assets/img/fondo2.jpeg")}
        style={{ height: '100vh' }}
      >
        <div className="container content d-flex justify-content-center align-items-center p-0">
          <div class="row w-100">
            <div class="col-12 col-md-6 col-lg-8 d-none d-md-flex d-flex flex-column align-items-center justify-content-center">
              <div className="text-center">
                <h3 className="text-uppercase mx-auto text-white font-600 text-center typing">Obtén tu cuenta demo por 10 días !</h3>

                <p className="text-gray frasphe text-center mx-auto my-3">Descubre la revolución en atención al cliente con nuestro innovador chatbot durante 10 días de demo gratuito</p>
                <button className="btn-outline-white" 
                onClick={() => setDemoStatus(!demoStatus)}>Quiero mi demo</button>
              </div>
            </div>
            {
              demoStatus ? 
              <>
               {/* formulario para agendar un demos */}
              <div class="col-12 col-md-6 col-lg-4">
                <Form action="" className="form" method="">
                  <Card className={"card-login background-backdrop" + cardClasses}>
                    <Card.Header>
                      <h4 className="header text-center">Agenda tu demo</h4>
                      <h3 className="header text-center font-bold">FlashChat</h3>
                      <hr/>
                    </Card.Header>
                      <Card.Body>
                      {/* fecha y hora en la que te podemos contactar */}
                      <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>event</span>
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
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>person</span>
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
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span>
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
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>phone</span>
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
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>message</span>
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
                      <Button className="btn-wd w-100" type="submit" variant="dark"
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
              <div class="col-12 col-md-6 col-lg-4">
                <Form action="" className="form" method="">
                  <Card className={"card-login background-backdrop" + cardClasses}>
                    <Card.Header>
                      <h4 className="header text-center">Bienvenido</h4>
                      <h3 className="header text-center font-bold">FlashChat</h3>
                      <hr/>
                    </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-4">
                          <label className="font-600 d-flex align-items-center">
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span>
                            Correo electrónico</label>
                          <Form.Control
                            placeholder="correo@email.com"
                            type="email"
                            name="correo"
                            value={usuario.correo}
                            onChange={handleInputChange}
                          ></Form.Control>
                        </Form.Group>
  
                        <Form.Group>
                          <label className="font-600 d-flex align-items-center">
                          <span class="material-symbols-outlined" style={{marginRight: '5px'}}>
                            lock
                            </span>
                            Contraseña</label>
                          <Form.Control
                            placeholder="********"
                            type="password"
                            name="clave"
                            value={usuario.clave}
                            onChange={handleInputChange}
                          ></Form.Control>
                        </Form.Group>
  
                      </Card.Body>
                    <Card.Footer className="ml-auto mr-auto">
                      <Button className="btn-wd w-100" type="submit" variant="dark"
                        onClick={Login}
                      >
                        {/* en espanol */}
                        Iniciar sesión 
                      </Button>
  
                      {/* <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                        <span className="text-span">- No tienes cuenta - </span>
                        <a className="text-link" onClick={() => props.setEstados(false)}>Regístrate</a>
                      </div> */}
                    </Card.Footer>
                  </Card>
                </Form>
              </div>
            }
          </div>

          {/* <Container>
            <Col sm="12" md="8"></Col>

            <Col className="" sm="12" md="4">
              <Form action="" className="form" method="">
                <Card className={"card-login" + cardClasses}>
                  <Card.Header>
                    <h3 className="header text-center">Login</h3>
                  </Card.Header>
                  <Card.Body>
                    <Card.Body>
                      <Form.Group>
                        <label>Email address</label>
                        <Form.Control
                          placeholder="Enter email"
                          type="email"
                          name="correo"
                          value={usuario.correo}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <label>Password</label>
                        <Form.Control
                          placeholder="Password"
                          type="password"
                          name="clave"
                          value={usuario.clave}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Check className="pl-0">
                        <Form.Check.Label>
                          <Form.Check.Input
                            defaultChecked
                            type="checkbox"
                          ></Form.Check.Input>
                          <span className="form-check-sign"></span>
                          Subscribe to newsletter
                        </Form.Check.Label>
                      </Form.Check>
                    </Card.Body>
                  </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <Button className="btn-wd" type="submit" variant="warning"
                      onClick={Login}
                    >
                      Login
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Container> */}
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage:
              "url(" + require("assets/img/fondo2.jpeg") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default LoginPage;