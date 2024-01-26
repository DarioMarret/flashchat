
// react-bootstrap components
import {
  Button,
  Card,
  Form
} from "react-bootstrap";

function RegisterPage() {
  return (
    <>
      <div
        className="full-page section-image d-flex align-items-center pt-4"
        data-color="black"
        data-image={require("assets/img/full-screen-image-2.jpg")}
        style={{ height: '100vh' }}
      >
        <div className="container content d-flex justify-content-center align-items-center p-0">
          <div class="row w-100 justify-content-center">
            <div class="col-12 col-md-6 col-lg-5">
              <Form action="" className="form" method="">
                <Card className={"card-login background-backdrop"}>
                  <Card.Header>
                    <h3 className="header text-center">Registro</h3>
                    <hr/>
                  </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span class="material-symbols-outlined" style={{marginRight: '5px'}}>domain</span>
                          Nombre de empresa</label>
                        <Form.Control
                          placeholder="Mi empresa"
                          type="text"
                          name="empresa"
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span class="material-symbols-outlined" style={{marginRight: '5px'}}>phone_iphone</span>
                          Contacto</label>
                        <Form.Control
                          placeholder="0999999999"
                          type="text"
                          name="contacto"
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <label className="font-600 d-flex align-items-center">
                        <span class="material-symbols-outlined" style={{marginRight: '5px'}}>mail</span>
                          Correo electrónico</label>
                        <Form.Control
                          placeholder="correo@email.com"
                          type="email"
                          name="correo"
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
                        ></Form.Control>
                      </Form.Group>
                    </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <Button className="btn-wd w-100" type="submit" variant="warning"
                      
                    >
                      Registrarme
                    </Button>

                    <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
                      <small className="text-span">- Tendrás 10 días gratuitos - </small>
                      <a className="text-link">Iniciar sesión</a>
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
              "url(" + require("assets/img/full-screen-image-2.jpg") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default RegisterPage;
