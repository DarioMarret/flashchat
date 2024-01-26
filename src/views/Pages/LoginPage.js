import axios from "axios";
import { host, usuario_token } from "function/util/global";
import useAuth from "hook/useAuth";
import React from "react";
import style from 'assets/css/style.css';

// react-bootstrap components
import {
  Button,
  Card,
  Col,
  Container,
  Form
} from "react-bootstrap";


const LoginPage =()=> {
  const [cardClasses, setCardClasses] = React.useState("card-hidden");
  React.useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 100);
  });
  const [usuario, setUsuario] = React.useState({
    correo: "",
    clave: "",
  });

  const handleInputChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  }
  const { login, setReloadUser } = useAuth();
  
  const Login = async (event) => {
    event.preventDefault();
    console.log(usuario);
    if(usuario.correo === "" || usuario.clave === ""){
      console.log("login");
    }else{
      console.log("no login");
      const { data, status } = await axios.post(`${host}login`, usuario);
      console.log(data);
      if (status === 200) {
        if (data.status === 200) {
          // guardar en localstorage
          localStorage.setItem(usuario_token, JSON.stringify(data.token));
          // redireccionar
          login(data.token);
          setReloadUser(true);
        } else {
          alert(data.mensaje);
        }
      } else {
        alert("Error en el servidor");
      }
    }
  }

  return (
    <>
      <div
        className="full-page section-image d-flex align-items-center"
        data-color="black"
        data-image={require("assets/img/full-screen-image-2.jpg")}
        style={{ height: '100vh' }}
      >
        <div className="container content d-flex justify-content-center align-items-center p-0">
          <div class="row w-100">
            <div class="col-12 col-md-6 col-lg-8 d-none d-md-flex d-flex flex-column align-items-center justify-content-center">
              <div className="text-center">
                <h3 className="text-uppercase mx-auto text-white font-600 text-center typing">Obtén tu cuenta demo por 10 días !</h3>

                <p className="text-gray frasphe text-center mx-auto my-3">Descubre la revolución en atención al cliente con nuestro innovador chatbot durante 10 días de demo gratuito</p>
                <button className="btn-outline-white">Quiero mi demo</button>
              </div>
            </div>

            <div class="col-12 col-md-6 col-lg-4">
              <Form action="" className="form" method="">
                <Card className={"card-login background-backdrop" + cardClasses}>
                  <Card.Header>
                    <h3 className="header text-center">Login</h3>
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

                      {/* <Form.Check className="pl-0">
                        <Form.Check.Label>
                          <Form.Check.Input
                            defaultChecked
                            type="checkbox"
                          ></Form.Check.Input>
                          <span className="form-check-sign"></span>
                          Subscribe to newsletter
                        </Form.Check.Label>
                      </Form.Check> */}

                    </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <Button className="btn-wd w-100" type="submit" variant="warning"
                      onClick={Login}
                    >
                      Login
                    </Button>

                    <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                      <span className="text-span">- No tienes cuenta - </span>
                      <a className="text-link">Regístrate</a>
                    </div>
                  </Card.Footer>
                </Card>
              </Form>
            </div>
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
              "url(" + require("assets/img/full-screen-image-2.jpg") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default LoginPage;