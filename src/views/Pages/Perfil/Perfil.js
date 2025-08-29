import { GetTokenDecoded, SubirMedia } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { Container, FormGroup, Input } from "reactstrap";
import Swal from "sweetalert2";

export default function Perfil() {
  console.log(GetTokenDecoded());
  const [usuario, setUsuario] = useState(GetTokenDecoded());
  const [dias_laborales, setDiasLaborales] = useState([]);
  const [bot_asignados, setBotAsignados] = useState([]);
  const [equipos_asignados, setEquiposAsignados] = useState([]);
  const [agente, setAgente] = useState({
    cuenta_id: GetTokenDecoded().cuenta_id,
    equipo_id: 0,
    nombre: "",
    avatar: "",
    correo: "",
    horario_ini: "",
    activar_ini: false,
    horario_fin: "",
    activar_fin: false,
    clave: "",
    newclave: "",
    menu: [],
    contacto: "",
    perfil: "",
    botId: [],
    dias_laborales: [],
    audio_llamada: "",
    audio_mensaje: "",
    mensaje_notificacion: false,
    ring_tono_llamada: false,
    ring_tono_mensaje: false,
    ver_ultimo_mensaje: false,
  });

  const DiasLaborales = (dias_laborales) => {
    let dias = [];
    dias_laborales.map((dia) => {
      if (dia.lunes) {
        dias.push("Lunes");
      }
      if (dia.martes) {
        dias.push("Martes");
      }
      if (dia.miercoles) {
        dias.push("Miercoles");
      }
      if (dia.jueves) {
        dias.push("Jueves");
      }
      if (dia.viernes) {
        dias.push("Viernes");
      }
      if (dia.sabado) {
        dias.push("Sabado");
      }
      if (dia.domingo) {
        dias.push("Domingo");
      }
    });
    return dias;
  };

  const BotAsignados = (bot_asignados) => {
    let bot = [];
    bot_asignados.map((b) => {
      bot.push(b.name);
    });
    return bot;
  };

  const EquiposAsignados = (equipos_asignados) => {
    let equipos = [];
    equipos_asignados.map((equipo) => {
      equipos.push(equipo.equipos);
    });
    return equipos;
  };

  const CargarAvatar = async (file, audio) => {
    const url = await SubirMedia(file);
    if (url !== null) {
      if (audio) {
        setAgente({
          ...agente,
          audio_mensaje: url,
        });
      } else {
        setAgente({
          ...agente,
          avatar: url,
        });
      }
      return url;
    } else {
      return null;
    }
  };

  const ActualizarAgente = async () => {
    Swal.fire({
      icon: "info",
      title: "Actualizando",
      text: "Al actualizar se cerrara la sesion y se tendra que volver a iniciar sesion",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: colorPrimario,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `agentes/${agente.id}`;
        console.log(agente);
        const { status } = await BmHttp().put(url, agente);
        if (status === 200) {
          Swal.fire({
            icon: "success",
            title: "Actualizado",
            text: "Agente actualizado correctamente",
          });
        }
      }
    });
  };

  useEffect(() => {
    setUsuario(GetTokenDecoded());
    setAgente(GetTokenDecoded());
    setDiasLaborales(DiasLaborales(usuario.dias_laborales));
    setBotAsignados(BotAsignados(usuario.botId));
    setEquiposAsignados(EquiposAsignados(usuario.equipos));
  }, []);

  return (
    <Container fluid>
      <h1>Perfil</h1>
      <Row>
        {/* <Col md="12"> */}
        <Card className="shadow border-0">
          <CardHeader>
            <CardTitle tag="h4">Editar Perfil</CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="form">
              <Row>
                <Col md="6" className="p-1">
                  <FormGroup>
                    <label>Empresa</label>
                    <Input
                      defaultValue={usuario.cuenta.empresa}
                      placeholder="Company"
                      type="text"
                      disabled
                      value={usuario.cuenta.empresa}
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label>Usuario</label>
                    <Input
                      defaultValue="michael23"
                      placeholder="Usuario"
                      type="text"
                      value={agente.nombre}
                      onChange={(e) =>
                        setAgente({ ...agente, nombre: e.target.value })
                      }
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="exampleInputEmail1">
                      Correo Electrónico
                    </label>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={agente.correo}
                      onChange={(e) =>
                        setAgente({ ...agente, correo: e.target.value })
                      }
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label>Password</label>
                    <Form.Control
                      type="password"
                      // value={agente.clave}
                      autoComplete="off"
                      aria-autocomplete="none"
                      onChange={(e) =>
                        setAgente({ ...agente, clave: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col
                  className="pl-1  p-1"
                  md="6"
                  style={{
                    // centrar la imagen
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <FormGroup>
                    <a
                      href="#pablo"
                      onClick={(e) =>
                        e.preventDefault() +
                        document.querySelector(".hidden").click()
                      }
                      className="button-bm active"
                    >
                      Cambiar Avatar
                    </a>
                    <input
                      type="file"
                      accept="image/*"
                      lang="es"
                      min={1}
                      max={1}
                      onChange={(e) => CargarAvatar(e.target.files[0], null)}
                      className="d-none hidden"
                    />
                  </FormGroup>
                  <FormGroup
                    className="d-flex flex-column align-items-center "
                    style={{
                      // border: "1px solid #ccc",
                      borderRadius: "50%",
                      width: "40%",
                    }}
                  >
                    <label>Avatar</label>
                    <img
                      src={agente.avatar}
                      alt="avatar"
                      style={{ width: "260px" }}
                      className="rounded-circle"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1" md="6">
                  <Row>
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Hora de Ingreso</label>
                      <Input
                        type="time"
                        value={usuario.horario_ini}
                        disabled
                      ></Input>
                    </FormGroup>
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Hora de Salida</label>
                      <Input
                        type="time"
                        value={usuario.horario_fin}
                        disabled
                      ></Input>
                    </FormGroup>
                  </Row>
                  {/* seccion para activar */}
                  <Row>
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Activar Notificaciones de nuevo mensaje</label>
                      <Input
                        type="checkbox"
                        checked={agente.mensaje_notificacion}
                        onChange={(e) =>
                          setAgente({
                            ...agente,
                            mensaje_notificacion: e.target.checked,
                          })
                        }
                      ></Input>
                    </FormGroup>
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Activar Vista de ultimo mensaje</label>
                      <Input
                        type="checkbox"
                        checked={agente.ver_ultimo_mensaje}
                        onChange={(e) =>
                          setAgente({
                            ...agente,
                            ver_ultimo_mensaje: e.target.checked,
                          })
                        }
                      ></Input>
                    </FormGroup>
                    {/* ring_tono_mensaje */}
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Ring Tono de mensaje</label>
                      <Input
                        type="checkbox"
                        checked={agente.ring_tono_mensaje}
                        onChange={(e) =>
                          setAgente({
                            ...agente,
                            ring_tono_mensaje: e.target.checked,
                          })
                        }
                      ></Input>
                    </FormGroup>
                    {/* audio_mensaje */}
                    {usuario.audio_mensaje && (
                      <audio src={agente.audio_mensaje} controls></audio>
                    )}
                    <FormGroup className="d-flex flex-column w-50">
                      <label>Audio de mensaje</label>
                      <Input
                        type="file"
                        accept="audio/*"
                        lang="es"
                        min={1}
                        max={1}
                        onChange={(e) =>
                          CargarAvatar(e.target.files[0], "audio_mensaje")
                        }
                      ></Input>
                    </FormGroup>
                  </Row>
                </Col>

                <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>Dias Laborales</label>
                    {/*listamos los dia de trabajo en una lista*/}
                    <>
                      {dias_laborales &&
                        dias_laborales.map((dia, index) => (
                          <li key={index}>{dia}</li>
                        ))}
                    </>
                  </FormGroup>
                </Col>
                <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>Bot asignados</label>
                    {/* listamos los dia de trabajo en una lista  */}
                    <>
                      {bot_asignados &&
                        bot_asignados.map((dia, index) => (
                          <li key={index}>{dia}</li>
                        ))}
                    </>
                  </FormGroup>
                </Col>
                <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>equipos asignados</label>
                    {/* listamos los dia de trabajo en una lista  */}
                    <>
                      {equipos_asignados &&
                        equipos_asignados.map((dia, index) => (
                          <li key={index}>{dia}</li>
                        ))}
                    </>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
          <CardFooter className="d-flex justify-content-center">
            <button
              className="button-bm active"
              type="submit"
              onClick={ActualizarAgente}
            >
              ACTUALIZAR
            </button>
          </CardFooter>
        </Card>
        {/* </Col> */}
      </Row>
    </Container>
  );
}
