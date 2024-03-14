// react component used to create charts
// react components used to create a SVG / Vector map

// react-bootstrap components
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Table
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
var mes = [{
  "mes": "Enero",
  "mes_numero": 1,
  "contar": 0
}, {
  "mes": "Febrero",
  "mes_numero": 2,
  "contar": 0
}, {
  "mes": "Marzo",
  "mes_numero": 3,
  "contar": 0
}, {
  "mes": "Abril",
  "mes_numero": 4,
  "contar": 0
}, {
  "mes": "Mayo",
  "mes_numero": 5,
  "contar": 0
}, {
  "mes": "Junio",
  "mes_numero": 6,
  "contar": 0
}, {
  "mes": "Julio",
  "mes_numero": 7,
  "contar": 0
}, {
  "mes": "Agosto",
  "mes_numero": 8,
  "contar": 0
}, {
  "mes": "Septiembre",
  "mes_numero": 9,
  "contar": 0
}, {
  "mes": "Octubre",
  "mes_numero": 10,
  "contar": 0
}, {
  "mes": "Noviembre",
  "mes_numero": 11,
  "contar": 0
}, {
  "mes": "Diciembre",
  "mes_numero": 12,
  "contar": 0
}]

var horas24 = [{
  "hora": "00:00",
  "numero": 0,
  "contar": 0
}, {
  "hora": "01:00",
  "numero": 1,
  "contar": 0
}, {
  "hora": "02:00",
  "numero": 2,
  "contar": 0
}, {
  "hora": "03:00",
  "numero": 3,
  "contar": 0
}, {
  "hora": "04:00",
  "numero": 4,
  "contar": 0
}, {
  "hora": "05:00",
  "numero": 5,
  "contar": 0
}, {
  "hora": "06:00",
  "numero": 6,
  "contar": 0
}, {
  "hora": "07:00",
  "numero": 7,
  "contar": 0
}, {
  "hora": "08:00",
  "numero": 8,
  "contar": 0
}, {
  "hora": "09:00",
  "numero": 9,
  "contar": 0
}, {
  "hora": "10:00",
  "numero": 10,
  "contar": 0
}, {
  "hora": "11:00",
  "numero": 11,
  "contar": 0
}, {
  "hora": "12:00",
  "numero": 12,
  "contar": 0
}, {
  "hora": "13:00",
  "numero": 13,
  "contar": 0
}, {
  "hora": "14:00",
  "numero": 14,
  "contar": 0
}, {
  "hora": "15:00",
  "numero": 15,
  "contar": 0
}, {
  "hora": "16:00",
  "numero": 16,
  "contar": 0
}, {
  "hora": "17:00",
  "numero": 17,
  "contar": 0
}, {
  "hora": "18:00",
  "numero": 18,
  "contar": 0
}, {
  "hora": "19:00",
  "numero": 19,
  "contar": 0
}, {
  "hora": "20:00",
  "numero": 20,
  "contar": 0
}, {
  "hora": "21:00",
  "numero": 21,
  "contar": 0
}, {
  "hora": "22:00",
  "numero": 22,
  "contar": 0
}, {
  "hora": "23:00",
  "numero": 23,
  "contar": 0

}]
function Dashboard() {

  const [bots, setBots] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [conversaciones, setConversaciones] = useState();
  const [agentes, setAgentes] = useState([]);
  

  const IsketObj = (obj, key) => {
    return obj[key] !== undefined;
  }

  const ListarBots = async() => {
    const conversacionBot = await axios.get(`${host}bots_conversacion/${GetTokenDecoded().cuenta_id}`)
    setBots(conversacionBot.data.bot)
    setConversaciones(conversacionBot.data.conversacionesCantidad);
    if(conversacionBot.status === 200){
      conversacionBot.data.bot.forEach((bot, index) => {
        conversacionBot.data.conversacion.forEach((conversacion, index) => {
          if(bot.nombreunico === conversacion.nombreunico){
            IsketObj(bot, 'contador') ? bot.contador++ : bot.contador = 1;
          }
        })
      })
      let anioActual = moment().format('YYYY');
      mes.forEach((m, index) => {
        conversacionBot.data.conversacion.forEach((conversacion, index) => {
          if(conversacion.anio === parseInt(anioActual)){
            if(conversacion.mes === m.mes_numero){
              m.contar++;
            }
          }
        })
      })
      let diaActual = moment().format('D');
      console.log(diaActual);
      horas24.forEach((h, index) => {
        conversacionBot.data.conversacion.forEach((conversacion, index) => {
          if(conversacion.dia === parseInt(diaActual)){
            if(conversacion.hora === h.numero){
              h.contar++;
            }
          }
        })
      })
      setBots(conversacionBot.data.bot)
      setConversaciones(conversacionBot.data.conversacionesCantidad);
    }
  }

  const ListarContactos = async() => {
    const url = `${host}contactos/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      setContactos(data.data);
    }
  }
  const ListarAgentes = async() => {
    const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
    const { data, status } = await axios.get(url)
    if (status === 200) {
      setAgentes(data.data);
    }
  }

  useEffect(() => {
    (async()=>{
      await ListarContactos();
      await ListarAgentes();
      await ListarBots();
    })()
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FlashChat Bar',
      },
    },
  };
  const labels = bots.map(bot => bot.nombre_bot);
  const labelsMes = mes.map(m => m.mes);
  const labelsHora = horas24.map(h => h.hora);
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats border-0 shadow">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-chart text-warning"></i> */}
                      {/* icono de clientes o contactos */}
                      <i className="nc-icon nc-single-02 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Contactos</p>
                      <Card.Title as="h4">{contactos.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats cursor-pointer">
                  <i className="fas fa-redo mr-1 cursor-pointer"></i>
                  Actualizar
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg="3" sm="6">
            <Card className="card-stats border-0 shadow">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-light-3 text-success"></i> */}
                      {/* icono de mensajeria */}
                      <i className="nc-icon nc-chat-round text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Conversaciones</p>
                      <Card.Title as="h4">{conversaciones}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  A la fecha
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg="3" sm="6">
            <Card className="card-stats border-0 shadow">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-vector text-danger"></i> */}
                      {/* bot */}
                      <i className="nc-icon nc-android text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Bot</p>
                      <Card.Title as="h4">{bots.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  Bots activos
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg="3" sm="6">
            <Card className="card-stats border-0 shadow">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-favourite-28 text-primary"></i> */}
                      {/* icono de agentes */}
                      <i className="nc-icon nc-badge text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Agentes</p>
                      <Card.Title as="h4">{
                        // los que estan con estado online
                        agentes.filter(agente => agente.estado === 'online').length
                      }</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Agentes en linea
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card className="border-0 shadow">
              <Card.Header>
                <Card.Title as="h4">Conversaciones por bot</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md="6">
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Canal</th>
                          <th>Bot</th>
                          <th>Conversaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          bots.map((bot, index) => (
                            <tr key={index}>
                              <td>{bot.channel.proveedor}</td>
                              <td>{bot.nombre_bot}</td>
                              <td>{bot.contador}</td>
                            </tr>
                          ))
                        }
                      </tbody>

                    </Table>
                  </Col>
                      {/* grafica de barra  */}
                  <Col md="6">
                    <Bar
                      data={
                        {
                          labels: labels,
                          datasets: [
                            {
                              label: 'Conversaciones',
                              data: bots.map(bot => bot.contador),
                              backgroundColor: "rgba(75,192,192,0.2)",
                              borderColor: "rgba(75,192,192,1)",
                              borderWidth: 1
                            }
                          ]
                        }
                      }
                      options={options}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="border-0 shadow">
              <Card.Header>
                <Card.Title as="h4">Conversacion por hora</Card.Title>
                <p className="card-category">24/7</p>
              </Card.Header>
              <Card.Body>
                <Bar
                  data={
                    {
                      labels: labelsHora,
                      datasets: [
                        {
                          label: 'Conversaciones',
                          data: horas24.map(h => h.contar),
                          backgroundColor: "rgba(75,192,192,0.2)",
                          borderColor: "rgba(75,192,192,1)",
                          borderWidth: 1,
                        }
                      ]
                    }
                  }
                  options={options}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row>
          <Col md="12">
            <Card className="border-0 shadow">
              <Card.Header>
                <Card.Title as="h4">Conversacion por mes</Card.Title>
                <p className="card-category">24/7</p>
              </Card.Header>
              <Card.Body>
                <Bar
                  data={
                    {
                      labels: labelsMes,
                      datasets: [
                        {
                          label: 'Conversaciones',
                          data: mes.map(m => m.contar),
                          backgroundColor: "rgba(75,192,192,0.2)",
                          borderColor: "rgba(75,192,192,1)",
                          borderWidth: 1,
                          // base: 0,
                          // categoryPercentage: 0.5,
                          // barPercentage: 0.5,
                        }
                      ]
                    }
                  }
                  options={options}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">2017 Sales</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>

              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle mr-1 text-info"></i>
                  Tesla Model S{" "}
                  <i className="fas fa-circle mr-1 text-danger"></i>
                  BMW 5 Series
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Tasks</Card.Title>
                <p className="card-category">Backend development</p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-688296980">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-202192706">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-746544352">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-743037005">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Flooded: One year later, assessing what was lost and
                          what was found when a ravaging rain swept through
                          metro Detroit
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-855684210">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-242945902">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Create 4 Invisible User Experiences you Never Knew
                          About
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-488557184">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-789597281">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Read "Following makes Medium better"</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-521344137">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-934093947">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Unfollow 5 enemies from twitter</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-97404283">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-888894273">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row> */}
      </Container>
    </>
  );
}

export default Dashboard;
