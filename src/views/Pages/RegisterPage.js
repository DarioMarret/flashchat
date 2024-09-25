
// react-bootstrap components
import logo from "assets/img/registroLogo.png";
import axios from "axios";
import { host } from "function/util/global";
import { useState } from "react";
import {
  Card,
  Form
} from "react-bootstrap";

function RegisterPage(props) {

  const [empresa, setEmpresa] =useState({
    empresa: "",
    nombre: "",
    avatar: "",
    correo: "",
    clave: "",
    conatcto: "",
    menu:{}
  })
  const [disableRegistro, setDisableRegistro] = useState(false);

  const handleInputChange = (event) => {
    setEmpresa({
      ...empresa,
      [event.target.name]: event.target.value,
    });
  }

  const Register = async (event) => {
    event.preventDefault();
    const { data, status } = await axios.post(`${host()}cuentas`, empresa);
    if(status === 200){
      if(data.status === 200){
        console.log(data);
        props.setEstados(true);
      }else{
        console.log(data);
      }
    }
  }

  return (
    <>
      <div
        className="full-page section-image d-flex align-items-center pt-4"
        // data-color="black"
        // data-image={require("assets/img/fondo2.jpeg")}
        style={{ height: '100vh' }}
      >
        <div className="container content d-flex justify-content-center align-items-center p-0">
          <div className="row w-100 justify-content-center">
            <div className="col-12 col-md-6 col-lg-5">
              <Form action="" className="form" method="">
                <Card className={"card-login background-backdrop"}>
                  <Card.Header>
                    <div className="d-flex justify-content-center align-items-center">
                        <img src={logo} alt="FlashChat" className="logo" 
                          style={{width: '250px', height: '100px'}}
                        />
                    </div>
                    {/* <h3 className="header text-center">Registro</h3> */}
                    <hr/>
                  </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span className="material-symbols-outlined" style={{marginRight: '5px'}}>domain</span>
                          Nombre de empresa</label>
                        <Form.Control
                          placeholder="Mi empresa"
                          type="text"
                          name="empresa"
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span className="material-symbols-outlined" style={{marginRight: '5px'}}>phone_iphone</span>
                          Contacto</label>
                        <Form.Control
                          placeholder="593 993 754 368"
                          type="text"
                          name="contacto"
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span className="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span>
                          Correo electrónico</label>
                        <Form.Control
                          placeholder="correo@email.com"
                          type="email"
                          name="correo"
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group>
                        <label className="font-600 d-flex align-items-center">
                        <span className="material-symbols-outlined" style={{marginRight: '5px'}}>
                          lock
                          </span>
                          Contraseña</label>
                        <Form.Control
                          placeholder="********"
                          type="password"
                          name="clave"
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                    </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <button className="btn button-bm w-100" type="submit"
                      disabled={disableRegistro}
                      onClick={(event) => Register(event)}
                    >
                      Registrarme
                    </button>

                    <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                      <small className="text-span">- Tendrás 5 días gratuitos - </small>
                      <a className="text-link" onClick={() => props.setEstados(true)}>Iniciar sesión</a>
                    </div>
                  </Card.Footer>
                </Card>
              </Form>
            </div>
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
      {/* realizar un modal de espera que estamos creando su cuenta por favor espere unos minutos */}
      

    </>
  );
}

export default RegisterPage;
