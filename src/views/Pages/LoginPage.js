import axios from "axios";
import { host, usuario_token } from "function/util/global";
import useAuth from "hook/useAuth";
import React from "react";

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
        className="full-page section-image"
        data-color="black"
        data-image={require("assets/img/full-screen-image-2.jpg")}
      >
        <div className="content d-flex align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="4" md="8">
              <Form action="" className="form" method="">
                <Card className={"card-login " + cardClasses}>
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
          </Container>
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